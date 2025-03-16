/* eslint-disable react/jsx-boolean-value */
/* eslint-disable import/order */
import './global.css';

import React, { useEffect, useRef } from 'react';
import { NavigationContainerRef } from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from 'react-query';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet } from 'react-native';
import { TabProvider } from './app/context/TabContext';
import { AuthProvider } from './app/context/auth/AuthContext';
import { initializeNotifications } from './app/services/NotificationService';
import AppNavigator from './app/navigation/AppNavigator';

const queryClient = new QueryClient();

export default function App() {
  const navigationRef = useRef<NavigationContainerRef<any>>(null);
  
  useEffect(() => {
    initializeNotifications(navigationRef);
  }, []);

  return (
    <GestureHandlerRootView style={styles.container}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <TabProvider>
            <AppNavigator navigationRef={navigationRef} />
          </TabProvider>
        </AuthProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
