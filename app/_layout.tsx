import { View, Text } from "react-native";
import React from "react";
import { Stack } from "expo-router";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const Layout = () => {
  return (
    <AuthProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack >
        <Stack.Screen options={{ headerShown: false }} name="(tabs)" />
      </Stack>
      </GestureHandlerRootView>
    </AuthProvider>
  );
};

export default Layout;
