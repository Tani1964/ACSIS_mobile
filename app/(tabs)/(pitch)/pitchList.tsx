import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl,
  Image,
  useWindowDimensions,
} from "react-native";
import React, { useEffect, useState, useCallback } from "react";
import { axi, useAuth } from "../../context/AuthContext";
import { useNavigation } from "@react-navigation/native";
import { AntDesign } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import MainAdvert from "@/components/mainAdvert";

const PitchList = () => {
  const { width, height } = useWindowDimensions()
  const navigation = useNavigation();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("all");
  const { authState } = useAuth();
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const headers = { Authorization: `Bearer ${authState.token}` };
      const response = await axi.get(`/pitch/get-user-pitches/`, { headers });
      const sortedData = response.data.pitches.sort(
        (a, b) => new Date(b.updated_at) - new Date(a.updated_at)
      );
      setData(sortedData);
    } catch (error) {
      console.error("Error fetching data:", error);
      // Alert.alert("Error", "Failed to fetch pitch data.");
    } finally {
      setLoading(false);
    }
  }, [authState.authenticated]);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const auth = await authState.authenticated;
        if (!auth) {
          navigation.navigate("auth/mainAuth/signin");
        } else {
          fetchData();
        }
      } catch (error) {
        console.error(error);
      }
    };
    checkAuth();
  }, [authState.authenticated, navigation, fetchData]);

  const deleteHandler = async (id) => {
    try {
      const headers = { Authorization: `Bearer ${authState.token}` };
      await axi.delete(`/pitch/delete-pitch/${id}`, { headers });
      setData((prevData) => prevData.filter((item) => item.id !== id));
      fetchData();
      Alert.alert("Success", "Pitch deleted successfully.");
    } catch (error) {
      console.error("Error deleting pitch:", error);
      Alert.alert("Error", "Failed to delete pitch.");
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchData().then(() => {
      setRefreshing(false);
    });
  };

  const filteredData = data.filter((item) => {
    if (filter === "all") return true;
    if (filter === "submitted") return item.is_submitted;
    if (filter === "drafts") return !item.is_submitted;
    return true;
  });

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#196100" />
      </View>
    );
  }

  if (data.length === 0) {
    return (
      <View style={[styles.body, { paddingHorizontal: width * 0.1 }]}>
        <View style={styles.imageContainer}>
          <Image
            source={require("../../../assets/images/pitch.png")}
            style={styles.image}
          />
          <View style={styles.textContainer}>
            <Text style={styles.headerText}>You have no pitches yet</Text>
            <Text style={{ color: "grey" }}>
              Whenever you pitch an idea, you can track its
            </Text>
            <Text style={{ color: "grey" }}>progress here.</Text>
          </View>
        </View>
        <View>
          <TouchableOpacity
            style={styles.link}
            onPress={() => navigation.navigate("form/index")}
          >
            <Text style={styles.linkText}>Pitch an idea</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View>
        <View style={styles.filterContainer}>
          <Text style={styles.filterLabel}>Filter: </Text>
          <Picker
            selectedValue={filter}
            style={styles.picker}
            onValueChange={(itemValue) => setFilter(itemValue)}
          >
            <Picker.Item label="All" value="all" />
            <Picker.Item label="Submitted" value="submitted" />
            <Picker.Item label="Drafts" value="drafts" />
          </Picker>
        </View>
        <ScrollView
          style={[styles.scrollView, { height: height * 0.55 }]}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {filteredData.map((item) => (
            <View
              key={item.id}
              style={[
                styles.card,
                (item.review && item.review.review_status) ===
                  "not-submitted" && styles.notSubmitted,
                (item.review && item.review.review_status) === "pending" &&
                  styles.pending,
                (item.review && item.review.review_status) === "approved" &&
                  styles.approved,
                (item.review && item.review.review_status) === "declined" &&
                  styles.rejected,
              ]}
            >
              <View style={styles.innerCard}>
                <View style={styles.cardHeader}>
                  <Text>{new Date(item.updated_at).toLocaleDateString()}</Text>
                  {item.uid && (
                    <Text style={{ fontWeight: "bold", fontSize: 20 }}>{` #${
                      item.uid || ""
                    }`}</Text>
                  )}
                  {!item.is_submitted && (
                    <AntDesign
                      name="delete"
                      size={24}
                      color="black"
                      onPress={() =>
                        Alert.alert(
                          "Confirm Delete",
                          "Are you sure you want to delete this pitch?",
                          [
                            { text: "Cancel", style: "cancel" },
                            {
                              text: "Delete",
                              onPress: () => deleteHandler(item.id),
                            },
                          ],
                          { cancelable: true }
                        )
                      }
                    />
                  )}
                </View>

                <Text>{`"${
                  item.competition_questions?.business_name ||
                  "No Business Name"
                }..."`}</Text>
                <Text>{`"${
                  item.competition_questions?.business_description ||
                  "No description"
                }..."`}</Text>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() =>
                    navigation.navigate(
                      item.is_submitted
                        ? "dynamics/viewPitchInfo"
                        : "updateform/personal",
                      { itemId: item.id }
                    )
                  }
                >
                  <Text style={styles.actionButtonText}>
                    {item.is_submitted ? "View Pitch Info" : "Edit Pitch"}
                  </Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.statusText}>
                {item.review && item.review.review_status}
              </Text>
            </View>
          ))}
          <View style={{ height: 100 }} />
        </ScrollView>
        <View style={styles.createButtonContainer}>
          <TouchableOpacity
            style={styles.createButton}
            onPress={() => navigation.navigate("form/index")}
          >
            <Text style={styles.createButtonText}>Create new pitch</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.sponsors}>
        <MainAdvert filter={"pitch"} />
      </View>
    </View>
  );
};

export default PitchList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingBottom: 70,
  },
  filterContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    marginTop: 120,
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: "bold",
  },
  picker: {
    flex: 1,
    height: 50,
  },
  scrollView: {
    paddingHorizontal: 10,
    marginBottom: -30,
    // paddingBottom: 300,
    height: "60%"
  },
  card: {
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
  },
  notSubmitted: {
    backgroundColor: "lightgrey",
  },
  pending: {
    backgroundColor: "#fdf6e4",
  },
  approved: {
    backgroundColor: "#CFE2FF",
  },
  rejected: {
    backgroundColor: "#fb8500",
  },
  innerCard: {
    borderRadius: 10,
    padding: 10,
    backgroundColor: "white",
    shadowColor: "grey",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 1,
  },
  cardHeader: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  actionButton: {
    backgroundColor: "white",
    borderColor: "#196100",
    borderWidth: 2,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 10,
  },
  actionButtonText: {
    color: "#196100",
    textAlign: "center",
  },
  statusText: {
    textAlign: "center",
    marginTop: 10,
    fontWeight: "bold",
    color: "grey",
  },
  createButtonContainer: {
    padding: 20,
    backgroundColor: "white",
    marginBottom: 10,
  },
  createButton: {
    backgroundColor: "#196100",
    borderRadius: 50,
    paddingVertical: 15,
    alignItems: "center",
  },
  createButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  body: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-around",
    textAlign: "center",
    backgroundColor: "white",
  },
  imageContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 10,
  },
  textContainer: {
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    color: "grey",
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  link: {
    marginBottom: 80,
    paddingVertical: 10,
    paddingHorizontal: 100,
    borderRadius: 50,
    color: "white",
    backgroundColor: "#196100",
    shadowColor: "black",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  linkText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  innerContainer: {
    marginTop: "1%",
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
