import React, { useState, useEffect } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { axi } from "@/app/context/AuthContext";
import { useAuth } from "@/app/context/AuthContext";
import MapPreview from "../../assets/images/mapPreview.jpg";
import * as SecureStore from "expo-secure-store";

const formatDateTime = (dateTimeString) => {
  const date = new Date(dateTimeString);
  const dateOptions = { weekday: "long", month: "short", day: "numeric" };
  const timeOptions = { hour: "2-digit", minute: "2-digit" };
  return `${date.toLocaleDateString(
    "en-US",
    dateOptions
  )}, ${date.toLocaleTimeString("en-US", timeOptions)}`;
};

const Events = () => {
  const navigation = useNavigation();
  const [events, setEvents] = useState([]);
  const { authState, setAuthState } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axi.get("/user/get-all-events");
        setEvents(response.data); // Assuming response.data is an array of events
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {events
          ? events.map((event) => (
              <View key={event.id} style={styles.card}>
                <View style={styles.cardHeader}>
                  <Text style={styles.eventName}>
                    {event.title || "Unnamed Event"}
                  </Text>
                  <Text style={styles.dateText}>
                    {formatDateTime(event.date_time)}
                  </Text>
                </View>
                <Text style={styles.timeText}>
                  Expected duration: {event.duration_hours} hours
                </Text>
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate("maps/fullView", {
                      location: event.location,
                      event: event,
                    })
                  }
                >
                  <Image source={MapPreview} style={styles.eventImage} />
                </TouchableOpacity>
                <View style={styles.venueContainer}>
                  <View style={styles.venueDetails}>
                    <Text style={styles.venueName}>{event.description}</Text>
                    {/* <Text style={styles.venueInfo}>
                  {event.venueDistance} • {event.venueRating} ★ (
                  {event.reviewsCount} reviews)
                </Text> */}
                    <Text style={styles.location}>{event.location}</Text>
                  </View>
                </View>
                <View style={styles.actionButtons}>
                  <TouchableOpacity
                    style={styles.button}
                    onPress={() => (
                      console.log(event.registrationLink),
                      event.registrationLink?
                      navigation.navigate("maps/linkWeb", {
                        link: event.registrationLink,
                      }): Alert.alert("No need to register")
                    )}
                  >
                    <Text style={styles.buttonText}>Register</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.button}
                    onPress={() =>
                      navigation.navigate("maps/fullView", {
                        location: event.location,
                        event: event,
                      })
                    }
                  >
                    <Text style={styles.buttonText}>More Info</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          : "Loading..."}
      </ScrollView>
    </View>
  );
};

export default Events;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
    paddingTop: 20,
    paddingBottom: 90,
  },
  scrollView: {
    paddingHorizontal: 10,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 15,
    marginVertical: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  eventName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  dateText: {
    fontSize: 14,
    color: "#666",
  },
  timeText: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 10,
  },
  eventImage: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
  },
  venueContainer: {
    flexDirection: "row",
    marginBottom: 10,
  },
  venueDetails: {
    flex: 1,
    justifyContent: "center",
  },
  venueName: {
    fontSize: 16,
    fontWeight: "600",
  },
  venueInfo: {
    fontSize: 14,
    color: "#666",
  },
  location: {
    fontSize: 14,
    color: "#666",
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  button: {
    backgroundColor: "#196100",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  buttonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },
});
