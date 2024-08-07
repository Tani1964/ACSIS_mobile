import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ScrollView,
  Modal,
  TextInput,
  Alert,
} from "react-native";
import Header from "../../components/header";
import { axi } from "../context/AuthContext";
import { useAuth } from "../context/AuthContext";
import { useNavigation } from "@react-navigation/native";

const Votes = () => {
  const [page, setPage] = useState("votes");
  const [votingData, setVotingData] = useState([
  ]);
  const [loading, setLoading] = useState(true);
  const { authState } = useAuth();
  const navigation = useNavigation();

  const nominationData = [
    { id: 1, title: "DesignNow", status: "Nominee" },
    { id: 2, title: "BQ Pharmaceutical Solutions", status: "Nominee" },
    { id: 3, title: "Berga Enterprises", status: "Nominee" },
    { id: 4, title: "Everest Trading Co.", status: "Nominee" },
    { id: 5, title: "Shapig Enterprises", status: "Nominee" },
    { id: 7, title: "Shapig Enterprises", status: "Nominee" },
    { id: 8, title: "Shapig Enterprises", status: "Nominee" },
    { id: 9, title: "Shapig Enterprises", status: "Nominee" },
  ];

  const [modalVisible, setModalVisible] = useState(false);
  const [voteModalVisible, setVoteModalVisible] = useState(false);
  const [selectedAwardTitle, setSelectedAwardTitle] = useState("");
  const [selectedCompany, setSelectedCompany] = useState("");
  const [nominationInput, setNominationInput] = useState("");

  const fetchData = async () => {
    try {
      const headers = { Authorization: `Bearer ${authState.token}` };
      const response = await axi.get("/award/get-awards", {headers});
      setVotingData(response.data.awards); 
      console.log(response.data)
    } catch (error) {
      console.error("Error fetching events:", error);
      if (error.response) {
        const statusCode = error.response.status;
        if (statusCode === 400) {
          Alert.alert("Error", "Bad request. Please try again later.");
        } else if (statusCode === 401) {
          console.log("Error", "Unauthorized access. Please log in again.");
          navigation.navigate("auth/mainAuth/signin");
        } else if (statusCode === 403) {
          Alert.alert("Error", "Forbidden access. You do not have permission to access this resource.");
        } else if (statusCode === 404) {
          Alert.alert("Error", "Events not found.");
        } else if (statusCode === 500) {
          console.log("Error", "Internal server error. Please try again later.");
        } else {
          Alert.alert("Error", "An unexpected error occurred. Please try again later.");
        }
      } else {
        Alert.alert("Error", "Network error. Please check your internet connection.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openNominationModal = (awardTitle:string) => {
    setSelectedAwardTitle(awardTitle);
    setModalVisible(true);
  };

  const openVoteModal = (awardTitle:string) => {
    setSelectedAwardTitle(awardTitle);
    setVoteModalVisible(true);
  };

  const submitNomination = () => {
    // Handle nomination submission logic here
    if (nominationInput.trim() === "") {
      Alert.alert("Error", "Please enter a company name to nominate.");
    } else {
      // Call an API or update the state
      Alert.alert(
        "Nomination Submitted",
        `You nominated ${nominationInput} for ${selectedAwardTitle}`
      );
      setModalVisible(false);
      setNominationInput("");
    }
  };

  const submitVote = () => {
    // Handle vote submission logic here
    if (!selectedCompany) {
      Alert.alert("Error", "Please select a company to vote for.");
    } else {
      // Call an API or update the state
      Alert.alert(
        "Vote Submitted",
        `You voted for ${selectedCompany} in ${selectedAwardTitle}`
      );
      setVoteModalVisible(false);
      setSelectedCompany("");
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>{item.title}</Text>
        {page === "votes" && (
          <Text style={styles.votes}>{item.votes} votes</Text>
        )}
        {page === "nominations" && (
          <Text style={styles.status}>{item.status}</Text>
        )}
      </View>
      {page === "votes" && (
        <TouchableOpacity
          style={styles.voteButton}
          onPress={() => openVoteModal(item.title)}
        >
          <Text style={styles.voteButtonText}>Vote</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <Header />
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, page === "votes" && styles.activeTab]}
          onPress={() => setPage("votes")}
        >
          <Text
            style={[styles.tabText, page === "votes" && styles.activeTabText]}
          >
            Votes
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, page === "nominations" && styles.activeTab]}
          onPress={() => setPage("nominations")}
        >
          <Text
            style={[
              styles.tabText,
              page === "nominations" && styles.activeTabText,
            ]}
          >
            Nominations
          </Text>
        </TouchableOpacity>
      </View>
      
      {page === "votes" ? (
        <ScrollView style={{ paddingHorizontal: 10 }}>
          {votingData.map((award) => (
            <View
              key={award.id}
              style={{
                paddingVertical: 20,
                borderBottomWidth: 1,
                borderColor: "#949494",
              }}
            >
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Text style={{ fontSize: 16, fontWeight: "bold" }}>
                  {award.title} 🏅
                </Text>
                <TouchableOpacity
                  style={styles.nominateButton}
                  onPress={() => openNominationModal(award.title)}
                >
                  <Text style={styles.nominateButtonText}>Nominate</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.nominateButton}
                  onPress={() => openNominationModal(award.title)}
                >
                  <Text style={styles.nominateButtonText}>Vote</Text>
                </TouchableOpacity>
              </View>
              {/* award description */}
              <Text>fxvhkbdb</Text>
            </View>
          ))}
        </ScrollView>
      ) : (
        <ScrollView style={{ paddingHorizontal: 10 }}>
          {nominationData.map((award) => (
            <View
              key={award.id}
              style={{
                paddingVertical: 20,
                borderBottomWidth: 1,
                borderColor: "#949494",
              }}
            >
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Text style={{ fontSize: 16, fontWeight: "bold" }}>
                  {award.title} 🏅
                </Text>
                
              </View>
              {/* award description */}
              <Text>fxvhkbdb</Text>
            </View>
          ))}
        </ScrollView>
      )}
      {/* Nomination Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              Nominate a Company for {selectedAwardTitle}
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Enter company name"
              value={nominationInput}
              onChangeText={(text) => setNominationInput(text)}
            />
            <TouchableOpacity
              style={styles.submitButton}
              onPress={submitNomination}
            >
              <Text style={styles.submitButtonText}>Submit</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Voting Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={voteModalVisible}
        onRequestClose={() => {
          setVoteModalVisible(!voteModalVisible);
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              Vote for a Company in {selectedAwardTitle}
            </Text>
            {votingData.map((company) => (
              <TouchableOpacity
                key={company.id}
                style={styles.radioContainer}
                onPress={() => setSelectedCompany(company.title)}
              >
                <View
                  style={[
                    styles.radioButton,
                    selectedCompany === company.title &&
                      styles.radioButtonSelected,
                  ]}
                />
                <Text style={styles.radioLabel}>{company.title}</Text>
              </TouchableOpacity>
            ))}
            <View style={{display:"flex", flexDirection:"row", gap:10}}>

            <TouchableOpacity style={styles.submitButton} onPress={submitVote}>
              <Text style={styles.submitButtonText}>Submit Vote</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setVoteModalVisible(false)}
              >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
              </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignSelf: "center",
    marginVertical: 16,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 100,
    paddingHorizontal: 1,
    backgroundColor: "#949494",
    width: "42%",
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 100,
  },
  activeTab: {
    backgroundColor: "#fff",
    borderColor: "#949494",
  },
  tabText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#666",
  },
  activeTabText: {
    color: "#949494",
  },
  listContainer: {
    flexGrow: 1,
    paddingHorizontal: 16,
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
  },
  votes: {
    fontSize: 14,
    color: "#666",
  },
  status: {
    fontSize: 14,
    color: "#666",
  },
  voteButton: {
    backgroundColor: "#196100", // Updated button color
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 100,
  },
  voteButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  nominateButton: {
    backgroundColor: "#196100", // Updated button color
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 100,
  },
  nominateButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "white",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    padding: 8,
    marginBottom: 16,
  },
  submitButton: {
    backgroundColor: "#196100", // Updated button color
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 100,
    marginBottom: 8,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  closeButton: {
    backgroundColor: "#ccc",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 100,
  },
  closeButtonText: {
    color: "#333",
    fontSize: 14,
    fontWeight: "bold",
  },
  radioContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 8,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#ccc",
    marginRight: 8,
  },
  radioButtonSelected: {
    borderColor: "#196100",
    backgroundColor: "#196100",
  },
  radioLabel: {
    fontSize: 16,
  },
});

export default Votes;
