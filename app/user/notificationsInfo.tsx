import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import React, { useEffect, useState, useLayoutEffect } from "react";
import { axi, useAuth } from "@/app/context/AuthContext";
import { useNavigation } from "@react-navigation/native";
import { Picker } from "@react-native-picker/picker";

const NotificationsInfo = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchingError, setFetchingError] = useState(null);
  const [dateFilter, setDateFilter] = useState("all");
  const navigation = useNavigation();
  const { authState } = useAuth();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "Notifications",
    });
  }, [navigation]);

  const handleApiError = (error) => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          return "Unauthorized. Please log in again.";
        case 404:
          return "Not found. Please try again later.";
        case 422:
          return "Validation error. Please check your input.";
        case 500:
          return "Server error. Please try again later.";
        default:
          console.log(error.response);
          return "An unexpected error occurred. Please try again.";
      }
    } else if (error.request) {
      return "Network error. Please check your connection.";
    } else {
      return "Error setting up request. Please try again.";
    }
  };

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const headers = { Authorization: `Bearer ${authState.token}` };
      const params = { filter: dateFilter };
      const response = await axi.get("/user/get-alerts", { headers, params });
      const sortedNotifications = response.data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      setNotifications(sortedNotifications);
    } catch (error) {
      const errorMessage = handleApiError(error);
      setFetchingError(errorMessage);
      Alert.alert("Error", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const markNotificationsAsRead = async () => {
    try {
      const headers = { Authorization: `Bearer ${authState.token}` };
      const alertIds = notifications.map(notification => notification.id);
      // Uncomment this line when ready to implement marking notifications as read
      // await axi.patch("/user/mark-alerts-as-read", {
      //   markAllAsRead: true,
      //   alertIds: alertIds,
      // }, { headers });
    } catch (error) {
      const errorMessage = handleApiError(error);
      Alert.alert("Error", errorMessage);
    }
  };

  useEffect(() => {
    if (authState.authenticated) {
      fetchNotifications();
      markNotificationsAsRead();
    }
  }, [dateFilter, authState.authenticated]); // Refetch notifications whenever date filter changes

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#196100" />
      </View>
    );
  }

  if (fetchingError) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{fetchingError}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Date Filter */}
      <View style={styles.filterContainer}>
        <Text style={styles.filterLabel}>Filter by date:</Text>
        <Picker
          selectedValue={dateFilter}
          style={styles.picker}
          onValueChange={(itemValue) => setDateFilter(itemValue)}
        >
          <Picker.Item label="All" value="all" />
          <Picker.Item label="Last Week" value="lastWeek" />
          <Picker.Item label="Last Month" value="lastMonth" />
          <Picker.Item label="Custom Range" value="custom" />
        </Picker>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {notifications.length === 0 ? (
          <View style={styles.noNotificationsContainer}>
            <Text style={styles.noNotificationsText}>No notifications available.</Text>
          </View>
        ) : (
          notifications.map((notification) => (
            <View key={notification.id} style={styles.notificationCard}>
              <Text style={styles.notificationText}>{notification.message}</Text>
              <Text style={styles.notificationDate}>
                {new Date(notification.created_at).toLocaleDateString()}
              </Text>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
};

export default NotificationsInfo;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#FFFFFF",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  errorText: {
    textAlign: "center",
    color: "red",
    fontSize: 16,
  },
  noNotificationsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noNotificationsText: {
    textAlign: "center",
    fontSize: 16,
    color: "grey",
  },
  filterContainer: {
    marginBottom: 20,
  },
  filterLabel: {
    fontSize: 16,
    marginBottom: 10,
  },
  picker: {
    height: 50,
    width: "100%",
  },
  scrollContainer: {
    flexGrow: 1,
  },
  notificationCard: {
    padding: 15,
    borderRadius: 10,
    backgroundColor: "#f9f9f9",
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  notificationText: {
    fontSize: 16,
    marginBottom: 5,
  },
  notificationDate: {
    fontSize: 14,
    color: "grey",
  },
});
