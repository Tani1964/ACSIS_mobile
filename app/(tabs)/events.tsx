import React, { useState, useEffect } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
  RefreshControl,
  TextInput,
  useWindowDimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { axi } from "../context/AuthContext";
import Header from "../../components/header";
import MainAdvert from "@/components/mainAdvert";

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
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDay, setSelectedDay] = useState("");
  const { width, height } = useWindowDimensions();

  const fetchData = async () => {
    try {
      const response = await axi.get("/event/get-all-events");
      setEvents(response.data);
    } catch (error) {
      console.error("Error fetching events:", error);
      handleFetchError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleFetchError = (error) => {
    if (error.response) {
      const statusCode = error.response.status;
      switch (statusCode) {
        case 400:
          Alert.alert("Error", "Bad request. Please try again later.");
          break;
        case 401:
          Alert.alert("Error", "Unauthorized access. Please log in again.");
          navigation.navigate("auth/mainAuth/signin");
          break;
        case 403:
          Alert.alert(
            "Error",
            "Forbidden access. You do not have permission to access this resource."
          );
          break;
        case 404:
          Alert.alert("Error", "Events not found.");
          break;
        case 500:
          Alert.alert(
            "Error",
            "Internal server error. Please try again later."
          );
          break;
        default:
          Alert.alert(
            "Error",
            "An unexpected error occurred. Please try again later."
          );
      }
    } else {
      Alert.alert(
        "Error",
        "Network error. Please check your internet connection."
      );
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchData().then(() => {
      setRefreshing(false);
    });
  };

  const filterEvents = (events, searchQuery, selectedDay) => {
    return events
      .filter((event) => {
        const matchesSearchQuery = event.title
          .toLowerCase()
          .includes(searchQuery.toLowerCase());
        const matchesSelectedDay =
          selectedDay === "" || `Day ${event.day}` === selectedDay;
        return matchesSearchQuery && matchesSelectedDay;
      })
      .sort((a, b) => new Date(a.date_time) - new Date(b.date_time));
  };

  const filteredEvents = filterEvents(events, searchQuery, selectedDay);

  if (loading) {
    return (
      <View
        style={styles.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <Header />
        <ActivityIndicator size="large" color="#196100" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header />
      <View>
        <View style={styles.innerContainer}>
          <TextInput
            style={styles.input}
            placeholder="Search events"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <View style={styles.filterContainer}>
            {["", "Day 1", "Day 2", "Day 3"].map((day) => (
              <TouchableOpacity
                key={day}
                style={[
                  styles.filterButton,
                  selectedDay === day && styles.filterButtonActive,
                ]}
                onPress={() => setSelectedDay(day)}
              >
                <Text
                  style={[
                    styles.filterButtonText,
                    selectedDay === day && styles.filterButtonTextActive,
                  ]}
                >
                  {day || "All Days"}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <ScrollView
            style={[styles.scrollView, { height: height * 0.6 }]}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          >
            {filteredEvents.length === 0 ? (
              <Text style={styles.emptyText}>No events found.</Text>
            ) : (
              filteredEvents.map((event) => (
                <View
                  key={event.id}
                  style={styles.card}
                  refreshControl={
                    <RefreshControl
                      refreshing={refreshing}
                      onRefresh={onRefresh}
                    />
                  }
                >
                  <View style={styles.cardHeader}></View>
                  <View
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <View
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        gap: 8,
                        width: '70%'
                      }}
                    >
                      <Text style={styles.eventName}>
                        {event.title || "Unnamed Event"}
                      </Text>
                      <Text>{event.day && `Day ${event.day}`}</Text>
                      <Text style={styles.dateText}>
                        {formatDateTime(event.date_time)}
                      </Text>
                      <Text style={styles.location}>{event.location}</Text>
                      {/* <Text style={styles.timeText}>
                    Expected duration: {event.duration_hours} hours
                  </Text> */}
                    </View>
                    <View style={styles.imgContainer}>
                      <TouchableOpacity
                      // onPress={() =>
                      //   navigation.navigate("maps/fullView", {
                      //     location2: event.location,
                      //     eventID: event.id,
                      //   })
                      // }
                      >
                        <Image
                          source={{ uri: event.image_url }}
                          style={styles.eventImage}
                          resizeMode="cover"
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                  <View style={styles.venueContainer}>
                    <View style={styles.venueDetails}>
                      {/* <Text style={styles.venueName}>{event.description}</Text> */}
                    </View>
                  </View>
                  <View style={styles.actionButtons}>
                    <TouchableOpacity
                      style={styles.button}
                      onPress={() => {
                        if (event.registrationLink) {
                          navigation.navigate("maps/linkWeb", {
                            link: event.registrationLink,
                          });
                        } else {
                          Alert.alert("Info", "No need to register.");
                        }
                      }}
                    >
                      <Text style={styles.buttonText}>Register</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.buttonSec}
                      onPress={async () => {
                        //   try {
                        //     await SecureStore.setItemAsync("location", event.location);
                        // } catch (error) {
                        //     console.error("Error saving location:", error);
                        // }

                        navigation.navigate("maps/fullView", {
                          eventID: event.id,
                          location2: event.location,
                        });
                      }}
                    >
                      <Text style={styles.buttonTextSec}>More Info</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            )}
            <View style={{ height: 100 }} />
          </ScrollView>
        </View>
        <View style={styles.sponsors}>
          <MainAdvert filter={"event"} />
        </View>
      </View>
    </View>
  );
};

export default Events;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
    paddingBottom: 90,
  },
  innerContainer: {
    marginTop: 110,
  },
  scrollView: {
    paddingHorizontal: 10,
    marginBottom: -80,
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 10,
    marginHorizontal: 10,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  filterContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    gap: 20,
    marginBottom: 10,
    paddingHorizontal: 4,
    marginHorizontal: 15,
  },
  filterButton: {
    paddingVertical: 8,
    borderRadius: 5,
    width: "25%",
    backgroundColor: "#e0e0e0",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  filterButtonActive: {
    backgroundColor: "#196100",
  },
  filterButtonText: {
    color: "#333",
  },
  filterButtonTextActive: {
    color: "white",
  },
  card: {
    backgroundColor: "white",
    borderRadius: 60,
    paddingHorizontal: 25,
    paddingVertical: 14,
    marginVertical: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 5,
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
    color: "#999",
  },
  eventImage: {
    width: 100,
    height: 100, // Half of width/height to make it round
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
  location: {
    width: "50%",
    fontSize: 14,
    color: "#666",
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  imgContainer: {
    borderWidth: 4,
    borderRadius: 100, // Keep it rounded
    overflow: "hidden", // Ensures content inside respects borderRadius
    width: 100, // Match the dimensions to the image
    height: 100,
    borderColor: "#196100",
    marginRight: 15,
  },
  button: {
    backgroundColor: "#196100",
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 20,
  },
  buttonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },
  buttonSec: {
    backgroundColor: "white",
    borderColor: "#196100",
    borderWidth: 2,
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 20,
    marginRight: 10,
  },
  buttonTextSec: {
    color: "#196100",
    fontSize: 14,
    fontWeight: "bold",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f8f8",
  },
  emptyText: {
    fontSize: 18,
    color: "#666",
    textAlign: "center",
    marginTop: 20,
  },
  sponsors: {
    position: "absolute", // Absolute positioning to overlap the WebView
    top: 0, // Adjust as needed to control the overlap position
    left: 0,
    right: 0,
    height: "14%", // Adjust height as needed
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white", // Semi-transparent background to overlap but still show the WebView content
    zIndex: 1, // Ensure it appears above the WebView
  },
});
