import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { NavigationProp } from '@react-navigation/native';
import TabBar from '../components/TabBar';
import { FIREBASE_AUTH } from 'FirebaseConfig';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface RouterProps {
  navigation: NavigationProp<any, any>;
}

const Settings = ({ navigation }: RouterProps) => {
  const handleSignOut = () => {
    FIREBASE_AUTH.signOut();
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Settings</Text>
        
        <View style={styles.settingsSection}>
          <Text style={styles.sectionTitle}>Account</Text>
          
          <TouchableOpacity style={styles.settingItem}>
            <Icon name="account" size={24} color="#686D76" style={styles.settingIcon} />
            <Text style={styles.settingText}>Profile</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.settingItem}>
            <Icon name="bell" size={24} color="#686D76" style={styles.settingIcon} />
            <Text style={styles.settingText}>Notifications</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.settingItem} onPress={handleSignOut}>
            <Icon name="logout" size={24} color="#686D76" style={styles.settingIcon} />
            <Text style={styles.settingText}>Sign Out</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.settingsSection}>
          <Text style={styles.sectionTitle}>App</Text>
          
          <TouchableOpacity style={styles.settingItem}>
            <Icon name="theme-light-dark" size={24} color="#686D76" style={styles.settingIcon} />
            <Text style={styles.settingText}>Theme</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.settingItem}>
            <Icon name="information" size={24} color="#686D76" style={styles.settingIcon} />
            <Text style={styles.settingText}>About</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={styles.tabBarContainer}>
        <TabBar navigation={navigation} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    position: 'relative',
  },
  content: {
    flex: 1,
    padding: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#686D76',
    marginBottom: 30,
  },
  settingsSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#686D76',
    marginBottom: 15,
    opacity: 0.8,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.2)',
  },
  settingIcon: {
    marginRight: 15,
  },
  settingText: {
    fontSize: 16,
    color: '#686D76',
  },
  tabBarContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  }
});

export default Settings; 