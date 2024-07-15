import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Button,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Link } from "expo-router";
import { axi, useAuth } from "../../context/AuthContext";
import ActionButton from "../../../components/actionButton";
import { useNavigation } from "@react-navigation/native";
import { AntDesign } from "@expo/vector-icons";

const PitchList = () => {
  const navigation = useNavigation();
  const [data, setData] = useState([]);
  const { authState } = useAuth();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const auth = await authState.authenticated;
        if (!auth) {
          navigation.navigate("auth/mainAuth/signin");
        }
        console.log("Authentication status successfully.");
      } catch (error) {
        console.error(error);
      }
    };

    const getData = async () => {
      try {
        const headers = { Authorization: `Bearer ${authState.token}` };
        const response = await axi.get(`/pitch/get-user-pitches/`, { headers });
        const sortedData = response.data.pitches.sort(
          (a, b) => new Date(b.updated_at) - new Date(a.updated_at)
        );
        setData(sortedData);
        console.log(s);
        Alert.alert("Data fetched successfully");
      } catch (error) {
        console.log("Error fetching data:", error);
      }
    };

    checkAuth();
    getData();
  }, []);

  const getData = async () => {
    try {
      const headers = { Authorization: `Bearer ${authState.token}` };
      const response = await axi.get(`/pitch/get-user-pitches/`, { headers });
      const sortedData = response.data.pitches.sort(
        (a, b) => new Date(b.updated_at) - new Date(a.updated_at)
      );
      setData(sortedData);
      Alert.alert("Data fetched successfully");
    } catch (error) {
      console.log("Error fetching data:", error);
    }
  };

  const deleteHandler = (id) => {
    const headers = { Authorization: `Bearer ${authState.token}` };
    axi.delete(`/pitch/delete-pitch/${id}`, { headers });
    getData();
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {data.map((item) => (
          <View
            key={item.id}
            style={[
              styles.card,
              item.review_status === "pending" && styles.pending,
              item.review_status === "approved" && styles.approved,
              item.review_status === "rejected" && styles.rejected,
            ]}
          >
            <View style={styles.innerCard}>
              <View style={{display:"flex" ,flexDirection:"row", justifyContent:"space-between"}}>
                <Text>{new Date(item.updated_at).toLocaleDateString()}</Text>
                <AntDesign
                  name="delete"
                  size={24}
                  color="black"
                  onPress={() => deleteHandler(item.id)}
                />
              </View>
              {/* <Text style={styles.idText}>{item.id}</Text> */}
              <Text>{`"${
                item.competition_questions?.business_description ||
                "No description"
              }..."`}</Text>
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
        <ActionButton text={"Create new pitch"} link={"/form"} />
      </View>
    </View>
  );
};

export default PitchList;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    paddingBottom: 150,
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
