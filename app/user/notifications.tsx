import React, { useState, useLayoutEffect, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Switch,
  Alert,
  ScrollView,
  
} from "react-native";
import { Ionicons,FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { axi } from "@/app/context/AuthContext"; // Ensure axi is correctly imported
import { useAuth } from "@/app/context/AuthContext";
import * as SecureStore from "expo-secure-store";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link } from "expo-router";

const Account = () => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const navigation = useNavigation();
  const { authState, setAuthState } = useAuth();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  const [user, setUser] = useState("");
  
  useEffect(() => {
    const getUser = async () => {
      const response = await axi.get("/user")
      setUser(response.data);
      setNotificationsEnabled(response.data.user.pitch_notification_status);
    };
    getUser();
  }, []);

  const toggleNotifications = async () => {
    try {
      console.log({
        notificationStatus: !notificationsEnabled,
        pitchNotificationStatus: !notificationsEnabled,
        postNotificationStatus: !notificationsEnabled,
        eventNotificationStatus: !notificationsEnabled,
      })
      const response = await axi.patch("/user/update-notification-settings", {
        notificationStatus: !notificationsEnabled,
        pitchNotificationStatus: !notificationsEnabled,
        postNotificationStatus: !notificationsEnabled,
        eventNotificationStatus: !notificationsEnabled,
      });
      Alert.alert(response.data.message);

      // Refetch user data after update
      const updatedUser = await axi.get("/user");
      setNotificationsEnabled(updatedUser.data.user.pitch_notification_status);
    } catch (e) {
      console.log(e);
      Alert.alert("Error updating notification settings");
    }
  
};


  const signOutHandler = async () => {
    await SecureStore.deleteItemAsync("authToken");
    setAuthState({
      token: null,
      authenticated: false,
    });
    navigation.navigate("auth/mainAuth/signin"); // Ensure you have a SignIn screen to navigate to
  };

  return (
    <SafeAreaView style={styles.safeArea}>
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
                <Text style={styles.optionSubText}>{user&&user.user.email}</Text>
              </TouchableOpacity>
              {/* <TouchableOpacity style={styles.optionContainer} onPress={()=>navigation.navigate("user/phoneNumber")}>
                <Text style={styles.optionText}>Phone number</Text>
                <Text style={styles.optionSubText}>{user&&(user.user.phone?user.user.phone: "No phone number yet...")}</Text>
              </TouchableOpacity> */}
            </View>

            {/* <View style={styles.section}>
              <Text style={styles.sectionTitle}>Security</Text>
              <TouchableOpacity style={styles.optionContainer}>
                <Text style={styles.optionText}>Change Password</Text>
              </TouchableOpacity>
            </View> */}

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
                <Link href="https://www.africancaribbeansummit.com/concept-note" style={styles.optionText}>About Us</Link>
              </TouchableOpacity>
              <TouchableOpacity style={styles.optionContainer}>
                <Link href="auth/mainAuth/terms" style={styles.optionText}>Terms & privacy policy</Link>
              </TouchableOpacity>
            </View>
            <View style={styles.section}>
              
              <TouchableOpacity style={styles.optionContainer}>
                <Link href="auth/mainAuth/terms" style={styles.optionText}>Terms & privacy policy</Link>
              </TouchableOpacity>
            </View>

            <View style={styles.section}>
              <TouchableOpacity
                style={styles.optionContainer}
                onPress={signOutHandler}
              >
                <Text style={[styles.optionText, { color: "red" }]}>Sign Out</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.optionContainer}>
                
                <Link href="https://africancaribbeansummit.xyz/delete" style={[styles.optionText, {color: "red"}]}><FontAwesome name="warning" size={20} color={"red"} /> Delete Account</Link>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={styles.signInContainer}>
            <Text style={styles.signInPrompt}>You are not signed in</Text>
            <TouchableOpacity
              style={styles.signInButton}
              onPress={() => navigation.navigate("auth/mainAuth/signin")}
            >
              <Text style={styles.signInButtonText}>Sign In</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Account;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    padding: 20,
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
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
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
  signInContainer: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  signInPrompt: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
  },
  signInButton: {
    backgroundColor: "#196100",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  signInButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});
