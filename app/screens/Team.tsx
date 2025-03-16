import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NavigationProp } from '@react-navigation/native';
import TabBar from '../components/TabBar';

interface RouterProps {
  navigation: NavigationProp<any, any>;
}

const Team = ({ navigation }: RouterProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>My Team</Text>
        <Text style={styles.subtitle}>Your captured Pokemon will appear here</Text>
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
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#686D76',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#686D76',
    textAlign: 'center',
  },
  tabBarContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  }
});

export default Team; 