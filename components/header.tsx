import { View, Text, StyleSheet, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import UserAvatar from "react-native-user-avatar";
import { useEffect, useState } from "react";
import { axi, useAuth } from "@/app/context/AuthContext";
import * as SecureStore from "expo-secure-store";

const Header = () => {
  const [user, setUser] = useState(null);
  const [notificationsCount, setNotificationsCount] = useState(0); // State for badge count
  const { authState } = useAuth();

  useEffect(() => {
    const getUser = async () => {
      const headers = { Authorization: `Bearer ${authState.token}` };
      try {
        const response = await axi.get("/user", { headers });
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    const getNotificationsCount = async () => {
      const headers = { Authorization: `Bearer ${authState.token}` };
      try {
        const response = await axi.get("/user/get-alerts", { headers });
        // setNotificationsCount(response.data.alerts.filter(alert => !alert.is_read).length); // Count unread notifications
        setNotificationsCount(0); // Count unread notifications
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };
    authState.authenticated && getUser();
    authState.authenticated && getNotificationsCount();;
    
    
  }, [authState.token]);

  return (
    <View style={styles.header}>
     {user&& <View style={styles.rightIcons}>
        <Link href="user/notificationsInfo">
          <View style={styles.iconContainer}>
            <Ionicons name="notifications-outline" size={37} color="lightgrey" />
            {notificationsCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{notificationsCount}</Text>
              </View>
            )}
          </View>
        </Link>
      </View>}
      <Image
        source={require("../assets/images/PNG File 1.png")} // Correct way to reference local assets
        style={styles.logo}
      />
      <View style={styles.rightIcons}>
        <Link href="user/notifications">
          {(authState.authenticated && user) ? (
            <UserAvatar size={40} name={user.user.full_name} bgColor="#196100" />
          ) : (
            <Ionicons name="person-circle-sharp" size={37} color="lightgrey" />
          )}
        </Link>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    width: "100%",
    backgroundColor: "white",
  },
  rightIcons: {
    flexDirection: "row",
    alignItems: "center",
  },
  logo: {
    width: 50,
    height: 50,
  },
  iconContainer: {
    position: "relative",
  },
  badge: {
    position: "absolute",
    top: -5,
    right: -10,
    backgroundColor: "red",
    color: "white",
    borderRadius: 50,
    padding: 5,
    minWidth: 20,
    minHeight: 20,
    justifyContent: "center",
    alignItems: "center",
    display: "flex",
  },
  badgeText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
});

export default Header;
