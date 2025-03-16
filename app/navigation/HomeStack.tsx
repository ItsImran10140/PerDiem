import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationProp } from '@react-navigation/native';
import { Pressable, View, Text, Image, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTabContext } from '../context/TabContext';
import { useAuth } from '../context/auth/AuthContext';


import Home from '../screens/Home';
import Team from '../screens/Team';
import Settings from '../screens/Settings';
import PokemonDetails from '../screens/PokemonDetails';

type HomeStackParamList = {
  Home: undefined;
  Team: undefined;
  Settings: undefined;
  PokemonDetails: { url: string; name: string };
};

const Stack = createNativeStackNavigator<HomeStackParamList>();

const HomeStack = ({ navigation }: { navigation: NavigationProp<any, any> }) => {
  const { user, signOut } = useAuth();
  const { activeTab } = useTabContext();

  React.useEffect(() => {
    if (activeTab === 'team') {
      navigation.navigate('Team');
    } else if (activeTab === 'settings') {
      navigation.navigate('Settings');
    } else {
      navigation.navigate('Home');
    }
  }, [activeTab, navigation]);

  const UserProfileDisplay = () => {
    if (user?.photoURL) {
      return (
        <View style={styles.profileContainer}>
          <Image
            source={{ uri: user.photoURL }}
            style={styles.profileImage}
          />
          <Text style={styles.userName}>{user.displayName || user.email}</Text>
        </View>
      );
    } else {
      return (
        <View style={styles.profileContainer}>
          <View style={styles.iconContainer}>
            <Icon name="account-circle" size={32} color="#fff" />
          </View>
          <Text style={styles.userName}>{user?.displayName || user?.email}</Text>
        </View>
      );
    }
  };

  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerStyle: {
          backgroundColor: '#9B7EBD',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen
        name="Home"
        component={Home}
        options={{
          title: '',
          headerShadowVisible: false,
          headerLeft: () => <UserProfileDisplay />,
          headerRight: () => (
            <Pressable onPress={signOut}>
              <View style={styles.iconContainer}>
                <Icon name="logout" size={24} color="#fff" />
              </View>
            </Pressable>
          ),
        }}
      />
      <Stack.Screen
        name="Team"
        component={Team}
        options={{
          title: 'My Team',
        }}
      />
      <Stack.Screen
        name="Settings"
        component={Settings}
        options={{
          title: 'Settings',
        }}
      />
      <Stack.Screen
        name="PokemonDetails"
        component={PokemonDetails}
        options={({ route }) => ({
          title: route.params.name.charAt(0).toUpperCase() + route.params.name.slice(1),
        })}
      />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
  },
  iconContainer: {
    marginRight: 8,
  },
  userName: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '500',
  },
});

export default HomeStack; 