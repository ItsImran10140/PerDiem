import messaging from "@react-native-firebase/messaging";
import { Alert, Linking, Platform } from 'react-native';
import { PermissionsAndroid } from 'react-native';
import { NavigationContainerRef } from '@react-navigation/native';

/**
 * @param navigationRef 
 */
export const initializeNotifications = async (
  navigationRef: React.RefObject<NavigationContainerRef<any>>
): Promise<void> => {
  await requestNotificationPermission();
  setupNotificationHandlers(navigationRef);
  await checkInitialNotification(navigationRef);
};

const setupNotificationHandlers = (
  navigationRef: React.RefObject<NavigationContainerRef<any>>
): (() => void) => {
  const unsubscribeForeground = messaging().onMessage(async remoteMessage => {
    console.log('Foreground notification received:', remoteMessage);
  });

  messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('Message handled in the background!', remoteMessage);
  });

  messaging().onNotificationOpenedApp(remoteMessage => {
    console.log('Notification opened app from background state:', remoteMessage);
    handleNotificationNavigation(remoteMessage, navigationRef);
  });

  return unsubscribeForeground;
};

const checkInitialNotification = async (
  navigationRef: React.RefObject<NavigationContainerRef<any>>
): Promise<void> => {
  const remoteMessage = await messaging().getInitialNotification();
  if (remoteMessage) {
    console.log('Notification opened app from background state:', remoteMessage);
    handleNotificationNavigation(remoteMessage, navigationRef);
  }
};

const handleNotificationNavigation = (
  remoteMessage: any,
  navigationRef: React.RefObject<NavigationContainerRef<any>>
): void => {
  if (!navigationRef.current?.isReady()) {
    setTimeout(() => {
      handleNotificationNavigation(remoteMessage, navigationRef);
    }, 100);
    return;
  }

  if (remoteMessage?.data?.Screen) {
    const screen = String(remoteMessage.data.Screen);
    const url = remoteMessage.data?.url;
    const name = remoteMessage.data?.name;
    
    if (screen === 'PokemonDetails' && url && name) {
      const state = navigationRef.current.getRootState();
      const isAuthenticated = state?.routes?.some(route => route.name === 'Home');
      
      if (isAuthenticated) {
        navigationRef.current?.navigate('PokemonDetails', {
          url: String(url),
          name: String(name)
        });
      } else {
        const unsubscribe = navigationRef.current.addListener('state', (e) => {
          const currentState = navigationRef.current?.getRootState();
          const isNowAuthenticated = currentState?.routes?.some(route => route.name === 'Home');
          
          if (isNowAuthenticated) {
            setTimeout(() => {
              navigationRef.current?.navigate('PokemonDetails', {
                url: String(url),
                name: String(name)
              });
            }, 300);
            
            unsubscribe();
          }
        });
      }
    } else {
      try {
        navigationRef.current?.navigate(screen as never);
      } catch (error) {
        console.error('Navigation error:', error);
      }
    }
  }
};

const requestNotificationPermission = async (): Promise<void> => {
  if (Platform.OS === 'android' && Platform.Version >= 33) {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
        {
          title: "Notification Permission",
          message: "This app needs notification permission to send you updates",
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK"
        }
      );

      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log("Notification permission granted");
        getAndSaveFCMToken();
      } else {
        console.log("Notification permission denied");
        Alert.alert(
          "Notifications Disabled",
          "You won't receive important updates. You can enable notifications in your device settings.",
          [
            { text: "OK", onPress: () => console.log("OK Pressed") },
            {
              text: "Open Settings",
              onPress: () => {
                if (Platform.OS === 'android') {
                  Linking.openSettings();
                }
              }
            }
          ]
        );
      }
    } catch (err) {
      console.warn(err);
    }
  } else {
    getAndSaveFCMToken();
  }
};

const getAndSaveFCMToken = async (): Promise<any> => {
  try {
    await messaging().requestPermission();
    const token = await messaging().getToken();
    console.log("FCM Token:", token);
    return messaging().onTokenRefresh(newToken => {
      console.log("FCM Token refreshed:", newToken);
    });
  } catch (error: any) {
    console.error("Failed to get FCM token:", error);
    if (error.code === 'messaging/permission-blocked') {
      Alert.alert(
        "Notifications Blocked",
        "Please enable notifications in your device settings to receive important updates.",
        [
          { text: "OK" },
          {
            text: "Open Settings",
            onPress: () => Linking.openSettings()
          }
        ]
      );
    }
  }
}; 