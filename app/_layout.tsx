import { View, Text } from "react-native";
import React from "react";
import { Stack } from "expo-router";
import { AuthProvider, useAuth } from "./context/AuthContext";

const Layout = () => {
  return (
    <AuthProvider>
      <Stack >
        <Stack.Screen options={{ headerShown: false }} name="(tabs)" />
      </Stack>
    </AuthProvider>
  );
};

export default Layout;
