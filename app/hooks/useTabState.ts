import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationProp } from '@react-navigation/native';

const STORAGE_KEY = '@tab_state';

export const useTabState = (navigation: NavigationProp<any, any>) => {
  const [activeTab, setActiveTab] = useState('Catch');

  useEffect(() => {
    const loadTabState = async () => {
      try {
        const savedTab = await AsyncStorage.getItem(STORAGE_KEY);
        if (savedTab) {
          setActiveTab(savedTab);
          switch (savedTab) {
            case 'Catch':
              navigation.navigate('Home');
              break;
            case 'Team':
              navigation.navigate('Team');
              break;
            case 'Settings':
              navigation.navigate('Settings');
              break;
            default:
              break;
          }
        }
      } catch (error) {
        console.error('Error loading tab state:', error);
      }
    };

    loadTabState();
  }, [navigation]);

  const setTab = async (tabName: string) => {
    try {
      setActiveTab(tabName);
      await AsyncStorage.setItem(STORAGE_KEY, tabName);
    } catch (error) {
      console.error('Error saving tab state:', error);
    }
  };

  return {
    activeTab,
    setTab
  };
}; 