import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type TabType = 'catch' | 'team' | 'settings';

interface TabContextType {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

const TabContext = createContext<TabContextType | undefined>(undefined);

export const TabProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTabState] = useState<TabType>('catch');

  useEffect(() => {
    const loadTabState = async () => {
      try {
        const savedTab = await AsyncStorage.getItem('activeTab');
        if (savedTab) {
          setActiveTabState(savedTab as TabType);
        }
      } catch (error) {
        console.error('Error loading tab state:', error);
      }
    };

    loadTabState();
  }, []);


  const setActiveTab = (tab: TabType) => {
    setActiveTabState(tab);
    
  
    AsyncStorage.setItem('activeTab', tab).catch(error => {
      console.error('Error saving tab state:', error);
    });
  };

  return (
    <TabContext.Provider value={{ activeTab, setActiveTab }}>
      {children}
    </TabContext.Provider>
  );
};

export const useTabContext = () => {
  const context = useContext(TabContext);
  if (context === undefined) {
    throw new Error('useTabContext must be used within a TabProvider');
  }
  return context;
}; 