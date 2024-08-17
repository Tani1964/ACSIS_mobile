import React, { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  RefreshControl,
  TextInput,
  Modal,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { axi } from "../context/AuthContext";
import { useAuth } from "../context/AuthContext";
import Header from "../../components/header";

const Business = () => {
  const navigation = useNavigation();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { authState } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [meetingDetails, setMeetingDetails] = useState({
    description: "",
    proposedMeetingStart: "",
    proposedMeetingEnd: "",
  });
  const [selectedBusiness, setSelectedBusiness] = useState(null);

  const fetchData = async () => {
    try {
      const response = await axi.get(`/user/get-businesses/`);
      setData(response.data);
    } catch (error) {
      console.log("Error fetching data:", error);

      let errorMessage = "Failed to load business data";
      if (error.response) {
        switch (error.response.status) {
          case 400:
            errorMessage = "Bad Request. Please try again later.";
            break;
          case 401:
            errorMessage = "Unauthorized. Please log in again.";
            break;
          case 403:
            errorMessage =
              "Forbidden. You don't have permission to access this.";
            break;
          case 404:
            errorMessage =
              "Not Found. The requested resource could not be found.";
            break;
          case 500:
            errorMessage = "Server Error. Please try again later.";
            break;
          default:
            errorMessage = "An unexpected error occurred. Please try again.";
        }
      } else if (error.request) {
        errorMessage =
          "No response from server. Please check your internet connection.";
      } else {
        errorMessage = "Request error. Please try again.";
      }
      Alert.alert("Error", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const formatDateTime = (dateTimeString) => {
    const date = new Date(dateTimeString);
    const dateOptions = { weekday: "long", month: "short", day: "numeric" };
    const timeOptions = { hour: "2-digit", minute: "2-digit" };
    return `${date.toLocaleDateString(
      "en-US",
      dateOptions
    )}, ${date.toLocaleTimeString("en-US", timeOptions)}`;
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchData().then(() => {
      setRefreshing(false); // Stop refreshing after data is fetched
    });
  };

  const filterBusinessesByTitle = (businesses, query) => {
    if (!query) return businesses;
    return businesses.filter((business) =>
      business.business_name.toLowerCase().includes(query.toLowerCase())
    );
  };

  const filteredData = filterBusinessesByTitle(data, searchQuery);

  const openScheduleModal = (business) => {
    setSelectedBusiness(business);
    setModalVisible(true);
  };

  const closeScheduleModal = () => {
    setModalVisible(false);
    setMeetingDetails({
      description: "",
      proposedMeetingStart: "",
      proposedMeetingEnd: "",
    });
  };

  const scheduleHandler = async () => {
    if (
      !meetingDetails.description
      // !meetingDetails.proposedMeetingStart ||
      // !meetingDetails.proposedMeetingEnd
    ) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }

    try {
      const response = await axi.post("/user/schedule-meeting", {
        description: meetingDetails.description,
        recipientId: selectedBusiness.id,
        // proposedMeetingStart: meetingDetails.proposedMeetingStart,
        // proposedMeetingEnd: meetingDetails.proposedMeetingEnd,
      });
      Alert.alert("Success", "Meeting scheduled successfully!");
      closeScheduleModal();
    } catch (error) {
      console.log("Error scheduling meeting:", error);
      const statusCode = error.response.status;
      if (statusCode === 401) {
        Alert.alert(
          "Can't schedule a meeting",
          "Please sign in to schedule a meeting"
        );
      } else {
        Alert.alert(
          "Error",
          "An error occurred while scheduling the meeting. Please try again."
        );
      }
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Header />
        <ActivityIndicator size="large" color="#196100" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header />
      <TextInput
        style={styles.searchBar}
        placeholder="Search businesses"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      {filteredData.length === 0 ? (
        <Text style={styles.emptyText}>No businesses found.</Text>
      ) : (
        <ScrollView
          style={styles.scrollView}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {filteredData.map((item) => (
            <View key={item.id} style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={styles.iconContainer}>
                  <Ionicons name="business-sharp" size={24} color="white" />
                </View>
                <Text style={styles.companyName}>
                  {item.business_name || "Unknown"}
                </Text>
              </View>
              <View>
              <View style={styles.detailRow}>
                  <MaterialIcons name="description" size={20} color="#196100" />
                  <Text style={styles.detailText}>{item.business_description}</Text>
                </View>
                <View style={styles.detailRow}>
                  <MaterialIcons name="person" size={20} color="#196100" />
                  <Text style={styles.detailText}>{item.business_owner_name}</Text>
                </View>
                <TouchableOpacity style={styles.detailRow} onPress={() =>
                    navigation.navigate("maps/linkWeb", { link: item.website })
                  }>
                  <MaterialIcons name="language" size={20} color="#196100" />
                  <Text style={styles.detailText}>{item.website}</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.actionButtons}>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => openScheduleModal(item)}
                >
                  <Text style={styles.buttonText}>Create Meeting Proposal</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </ScrollView>
      )}

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={closeScheduleModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Create a Proposal</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Describe Reason for Meeting ..."
              value={meetingDetails.description}
              onChangeText={(text) =>
                setMeetingDetails((prev) => ({ ...prev, description: text }))
              }
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={scheduleHandler}
              >
                <Text style={styles.modalButtonText}>Confirm</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={closeScheduleModal}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Business;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
    paddingBottom: 100
  },
  scrollView: {
    paddingHorizontal: 10,
  },
  searchBar: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 10,
    marginHorizontal: 10,
    paddingHorizontal: 8,
    borderRadius: 4,
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
  actionButtons: {
    marginTop:8,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  button: {
    backgroundColor: "#196100",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    width: "100%",
  },
  buttonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
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
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "80%",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  modalInput: {
    width: "100%",
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  modalButton: {
    flex: 1,
    backgroundColor: "#196100",
    paddingVertical: 10,
    marginHorizontal: 5,
    borderRadius: 5,
  },
  modalButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
  }, detailsContainer: {
    marginBottom: 10,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  detailText: {
    marginLeft: 10,
    fontSize: 16,
    color: "#333",
  },
});
