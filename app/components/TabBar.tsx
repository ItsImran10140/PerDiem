import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { NavigationProp } from '@react-navigation/native';
import { useTabState } from 'app/hooks/useTabState';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface TabBarProps {
  navigation: NavigationProp<any, any>;
}

const TabBar: React.FC<TabBarProps> = ({ navigation }) => {
  const { activeTab, setTab } = useTabState(navigation);

  const handleTabPress = (tabName: string) => {
    setTab(tabName);
    switch (tabName) {
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
  };

  return (
    <View style={styles.container}>
      
      <TouchableOpacity
        style={[styles.tab, activeTab === 'Team' && styles.activeTab]}
        onPress={() => handleTabPress('Team')}
      >
        <Icon 
          name="account-group" 
          size={28} 
          color={activeTab === 'Team' ? '#fff' : '#9B7EBD'} 
        />
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.tab, activeTab === 'Catch' && styles.activeTab]}
        onPress={() => handleTabPress('Catch')}
      >
        <Icon 
          name="pokeball" 
          size={28} 
          color={activeTab === 'Catch' ? '#fff' : '#9B7EBD'} 
        />
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.tab, activeTab === 'Settings' && styles.activeTab]}
        onPress={() => handleTabPress('Settings')}
      >
        <Icon 
          name="cog" 
          size={28} 
          color={activeTab === 'Settings' ? '#fff' : '#9B7EBD'} 
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -3,
    },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 10,
  },
  tab: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#f0f0f0',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  activeTab: {
    backgroundColor: '#9B7EBD',
    transform: [{ scale: 1.1 }],
  },
});

export default TabBar; 