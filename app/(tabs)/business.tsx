import { ScrollView, StyleSheet, Text, View, Button, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { axi } from "../context/AuthContext";

const mockData = [
  {
    id: "#JI456M9",
    date: "Friday, 08 Mar",
    description:
      "This is a place holder text to show the first two lines of the brief description of your business",
    location: "Nigeria",
    name: "RUNIT",
  },
  {
    id: "#Y98MYO",
    date: "Friday, 08 Mar",
    description:
      "This is a place holder text to show the first two lines of the brief description of your business",
    location: "kenya",
    name: "ggg",
  },
  {
    id: "#BN234T",
    date: "Friday, 08 Mar",
    description:
      "This is a place holder text to show the first two lines of the brief description of your business",
    location: "Senegal",
    name: "",
  },
  {
    id: "#BN334T",
    date: "Friday, 08 Mar",
    description:
      "This is a place holder text to show the first two lines of the brief description of your business",
    location: "Senegal",
    name: "",
  },
  {
    id: "#BN634T",
    date: "Friday, 08 Mar",
    description:
      "This is a place holder text to show the first two lines of the brief description of your business",
    location: "Senegal",
    name: "",
  },
];

const Business = () => {
  const navigation = useNavigation();
  const [data, setData] = useState([]);

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await axi.get(`/pitch/get-all-pitches/`);
        console.log("Response data:", response.data.pitches); // Add this line to log the response data
        setData( response.data.pitches);
        Alert.alert("Data fetched successfully");
      } catch (error) {
        console.log("Error fetching data:", error); // Add this line to log any errors
      }
    };
    getData();
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {mockData.map((item) => (
          <View key={item.id} style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.iconContainer}>
                <Ionicons name="business-sharp" size={24} color="white" />
              </View>
              <Text style={styles.companyName}>{item.name || "Unknown"}</Text>
            </View>
            <Text style={styles.description}>{item.description}</Text>
            <Text style={styles.date}>{item.location}</Text>
            {/* <Text style={styles.date}>{item.date}</Text> */}
            <Button
              title="View Pitch Info"
              color={"#196100"}
              onPress={() =>
                navigation.navigate("dynamics/viewBusiness", {
                  itemId: item.id,
                })
              }
            />
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default Business;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    backgroundColor: "white",
    paddingBottom: 60,
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
  companyName: {
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
