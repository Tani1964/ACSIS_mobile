import { ScrollView, StyleSheet, Text, View, Button } from "react-native";
import React, { useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import * as SecureStore from "expo-secure-store";
import { useNavigation } from "@react-navigation/native";
import { axi } from "../context/AuthContext";

const mockEvents = [
  {
    id: "#EVT123",
    date: "Saturday, 10 Jul",
    description: "An exciting event that showcases local talents and skills.",
    location: "Lagos, Nigeria",
    name: "Talent Showcase",
  },
  {
    id: "#EVT456",
    date: "Sunday, 15 Aug",
    description:
      "A workshop on the latest trends in technology and innovation.",
    location: "Nairobi, Kenya",
    name: "Tech Workshop",
  },
  {
    id: "#EVT789",
    date: "Wednesday, 22 Sep",
    description: "A music festival featuring local and international artists.",
    location: "Dakar, Senegal",
    name: "Music Fest",
  },
];

const EventsScreen = () => {
  const [authState, setAuthState] = useState(null);
  const navigation = useNavigation();
  const [data, setData] = useState([])

  useEffect(() => {
    const fetchAuthState = async () => {
      const result = await SecureStore.getItemAsync("authenticated");
      setAuthState(result);
    };
    const getData = async() => {
      const token = await SecureStore.getItemAsync("token")
      const headers = { Authorization: `Bearer ${token}` };

      // const response = await axi.get()
      // setData(response.data)

    }

    fetchAuthState();
  }, []);

  return (
    <View style={styles.container}>
      <Button
        title="View authState"
        color={"#196100"}
        onPress={() => alert(`${authState}`)}
      />
      <ScrollView style={styles.scrollView}>
        {mockEvents.map((event) => (
          <View key={event.id} style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.iconContainer}>
                <Ionicons name="calendar" size={24} color="white" />
              </View>
              <Text style={styles.eventName}>
                {event.name || "Unnamed Event"}
              </Text>
            </View>
            <Text style={styles.description}>{event.description}</Text>
            <Text style={styles.location}>{event.location}</Text>
            <Text style={styles.date}>{event.date}</Text>
            <Button
              title="View Event"
              color={"#196100"}
              onPress={() =>
                navigation.navigate("dynamics/viewEvent", {
                  itemId: event.id,
                })
              }
            />
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default EventsScreen;

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
    alignItems: "center",
    marginBottom: 10,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#196100",
    alignItems: "center",
    justifyContent: "center",
  },
  eventName: {
    flex: 1,
    marginLeft: 10,
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  description: {
    fontSize: 14,
    color: "#666",
    marginBottom: 5,
  },
  location: {
    fontSize: 14,
    color: "#666",
  },
  date: {
    fontSize: 12,
    color: "#aaa",
    marginTop: 5,
  },
});
