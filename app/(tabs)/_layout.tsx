// _layout.js

import { Tabs } from 'expo-router';
import React from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import TabBar from '../../components/TabBar';
import Header from '../../components/header'; // Ensure correct import

const Layout = () => {
  return (
    <SafeAreaView style={styles.safeContainer}>
    <Tabs
      tabBar={(props) => <TabBar {...props} />}
      screenOptions={{
        headerShown: false,
        // headerTitle: () => <Header />, // Ensure correct usage
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Feed' }} />
      <Tabs.Screen name="events" options={{ title: 'Events' }} />
      <Tabs.Screen name="(pitch)/index" options={{ title: 'Pitch' }} />
      <Tabs.Screen name="business" options={{ title: 'Business' }} />
    </Tabs>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeContainer:{
    flex: 1,
    backgroundColor: 'white'
},
})

export default Layout;
