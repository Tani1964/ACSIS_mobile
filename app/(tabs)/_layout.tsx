// _layout.js

import { Tabs } from 'expo-router';
import React from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import TabBar from '../../components/TabBar';

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
      <Tabs.Screen name="index" options={{ title: 'Updates' }} />
      <Tabs.Screen name="events" options={{ title: 'Agenda' }} />
      <Tabs.Screen name="(pitch)/index" options={{ title: 'PiTCi' }} />
      <Tabs.Screen name="(pitch)/pitchList" options={{ title: 'PiTCi' }} />
      <Tabs.Screen name="business" options={{ title: 'B2B' }} />
      <Tabs.Screen name="votes" options={{ title: 'Awards' }} />
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
