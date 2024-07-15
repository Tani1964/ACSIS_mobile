import React, { useState, useLayoutEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Switch,
  Alert,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { axi } from "@/app/context/AuthContext"; // Ensure axi is correctly imported
import { useAuth } from "@/app/context/AuthContext";
import * as SecureStore from "expo-secure-store";
import { SafeAreaView } from "react-native-safe-area-context";

const Account = () => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const navigation = useNavigation();
  const { authState, setAuthState } = useAuth();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  const toggleNotifications = async () => {
    const auth = await authState.authenticated;
    if (notificationsEnabled && auth) {
      Alert.alert("Notifications Disabled");
    } else {
      try {
        const response = await axi.patch("/user/update-notification-settings", {
          notificationStatus: !notificationsEnabled,
          pitchNotificationStatus: !notificationsEnabled,
          postNotificationStatus: !notificationsEnabled,
          eventNotificationStatus: !notificationsEnabled,
        });
        Alert.alert(response.data.message); // Assuming response.data.message contains a success message
      } catch (e) {
        console.log(e);
        Alert.alert("Error updating notification settings");
      }
    }
    setNotificationsEnabled(!notificationsEnabled);
  };

  const signOutHandler = async () => {
    await SecureStore.deleteItemAsync("token");
    await setAuthState((prevState) => ({
      ...prevState,
      token: null,
    }));
    await setAuthState((prevState) => ({
      ...prevState,
      authenticated: false,
    }));
    navigation.navigate(""); // Ensure you have a SignIn screen to navigate to
  };

  return (
    <SafeAreaView>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.headerContainer}>
          <Ionicons
            name="arrow-back"
            size={24}
            color="black"
            onPress={() => navigation.goBack()}
          />
          <Text style={styles.headerTitle}>Account Settings</Text>
        </View>
        {authState.authenticated ? (
          <View style={styles.container}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Profile</Text>
              <TouchableOpacity style={styles.optionContainer}>
                <Text style={styles.optionText}>Email</Text>
                <Text style={styles.optionSubText}>arlene.mccoy@gmail.com</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.optionContainer}>
                <Text style={styles.optionText}>Phone number</Text>
                <Text style={styles.optionSubText}>+2548123456789</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Security</Text>
              <TouchableOpacity style={styles.optionContainer}>
                <Text style={styles.optionText}>Change Password</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>General</Text>
              <View style={styles.optionContainer}>
                <Text style={styles.optionText}>Notifications</Text>
                <Switch
                  trackColor={{ false: "#767577", true: "#81b0ff" }}
                  thumbColor={notificationsEnabled ? "#f5dd4b" : "#f4f3f4"}
                  ios_backgroundColor="#3e3e3e"
                  onValueChange={toggleNotifications}
                  value={notificationsEnabled}
                />
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Learn more</Text>
              <TouchableOpacity style={styles.optionContainer}>
                <Text style={styles.optionText}>About</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.optionContainer}>
                <Text style={styles.optionText}>Terms & privacy policy</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.section}>
              <TouchableOpacity
                style={styles.optionContainer}
                onPress={signOutHandler}
              >
                <Text style={styles.optionText}>Sign Out</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <TouchableOpacity
            style={styles.optionContainer}
            onPress={() => navigation.navigate("auth/mainAuth/signin")}
          >
            <Text style={styles.optionText}>Sign In</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Account;

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#FFFFFF",
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 30,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginLeft: 10,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  optionContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 15,
    borderBottomColor: "lightgrey",
    borderBottomWidth: 1,
  },
  optionText: {
    fontSize: 16,
  },
  optionSubText: {
    fontSize: 14,
    color: "grey",
  },
});
