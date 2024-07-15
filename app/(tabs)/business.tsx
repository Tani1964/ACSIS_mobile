import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View, TouchableOpacity, Image, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { axi } from "../context/AuthContext";
import { useAuth } from "../context/AuthContext";
import PlaceholderImage from "../../assets/images/mapPreview.jpg"; // replace with an appropriate image

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
    location: "Kenya",
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
  const { authState, setAuthState } = useAuth();

  useEffect(() => {
    const getData = async () => {
      try {
        const token = await authState.token;
        if (token) {
          const headers = { Authorization: `Bearer ${token}` };
          const response = await axi.get(`/get-businesses/`, { headers });
          console.log("Response data:", response.data.pitches);
          setData(response.data.pitches);
          Alert.alert("Data fetched successfully");
        } else {
          console.log("Token not found");
        }
      } catch (error) {
        console.log("Error fetching data:", error);
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
            <Text style={styles.location}>{item.location}</Text>
            <TouchableOpacity onPress={() => navigation.navigate("dynamics/viewBusiness", { itemId: item.id })}>
              <Image source={PlaceholderImage} style={styles.businessImage} />
            </TouchableOpacity>
            <View style={styles.actionButtons}>
              <TouchableOpacity style={styles.button} onPress={() => alert("More Info clicked")}>
                <Text style={styles.buttonText}>More Info</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={() => alert("Contact clicked")}>
                <Text style={styles.buttonText}>Contact</Text>
              </TouchableOpacity>
            </View>
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
  businessImage: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
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
