import { ScrollView, StyleSheet, Text, View, Button,Alert } from "react-native";
import React, {useEffect, useState} from "react";
import { Link } from "expo-router";
import { axi, useAuth } from "../../context/AuthContext";
import ActionButton from "../../../components/actionButton";
import { useNavigation } from "@react-navigation/native";
import * as SecureStore from "expo-secure-store";




const mockData = [
  {
    id: "#JI456M9",
    date: "Friday, 08 Mar",
    description: "This is a place holder text to show the first two lines of the brief description of your business",
    status: "pending"
  },
  {
    id: "#Y98MYO",
    date: "Friday, 08 Mar",
    description: "This is a place holder text to show the first two lines of the brief description of your business",
    status: "approved"
  },
  {
    id: "#BN234T",
    date: "Friday, 08 Mar",
    description: "This is a place holder text to show the first two lines of the brief description of your business",
    status: "rejected"
  },
];

const PitchList = () => {
  const navigation = useNavigation();
  const [data, setData] = useState({})

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const auth = await SecureStore.getItemAsync('authenticated');
        if (auth != 'true') {
          navigation.navigate("login");
        }
        console.log('Authentication status successfully.');
      } catch (error) {
        console.error(error);
      }
    };
    const getData = async() => {
      try {
        const headers = { Authorization: `Bearer ${SecureStore.getItem("token")}` };
      const response = await axi.get(`/pitch/get-user-pitches/`, {headers});
        console.log("Response data:", response.data.pitches); // Add this line to log the response data
        setData(response.data.pitches);
        Alert.alert("Data fetched successfully");
      } catch (error) {
        console.log("Error fetching data:", error); // Add this line to log any errors
      }
    }
    checkAuth()
    getData()
  }, []);
  
    
  // console.log(data)
  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {mockData.map((item) => (
          <View
            key={item.id}
            style={[
              styles.card,
              item.status === "pending" && styles.pending,
              item.status === "approved" && styles.approved,
              item.status === "rejected" && styles.rejected,
            ]}
            
          >
            <View style={styles.innerCard}>
              <Text>{item.date}</Text>
              <Text style={styles.idText}>{item.id}</Text>
              <Text>{`"${item.description}..."`}</Text>
              <Button
              title="View Pitch Info"
              color={"#196100"}
              onPress={() =>
                navigation.navigate("dynamics/viewPitchInfo", {
                  itemId: item.id,
                })
              }
            />
            </View>
            <Text style={styles.statusText}>{item.status}</Text>
          </View>
        ))}
      </ScrollView>
      <View style={styles.actionButtonContainer}>
        <ActionButton
          text={"Create new pitch"}
          link={"/form"}
        />
      </View>
    </View>
  );
};

export default PitchList;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    paddingBottom:150
  },
  scrollView: {
    paddingHorizontal: 10,
    paddingBottom: 200,
  },
  card: {
    borderRadius: 10,
    padding: 2,
    marginBottom: 20,
    height: "20vh",
  },
  pending: {
    backgroundColor: "#fdf6e4",
  },
  approved: {
    backgroundColor: "#CFE2FF",
  },
  rejected: {
    backgroundColor: "#F0F0F0",
  },
  innerCard: {
    borderRadius: 10,
    padding: 8,
    backgroundColor: "white",
    shadowColor: "grey",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 1,
  },
  idText: {
    fontWeight: "bold",
    marginTop: 5,
  },
  statusText: {
    textAlign: "center",
    marginTop: 10,
    fontWeight: "bold",
    color: "grey",
  },
  actionButtonContainer: {
    paddingHorizontal: 20,
    backgroundColor: "white",
  },
});
