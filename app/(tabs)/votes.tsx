import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  TextInput,
  Alert,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import Header from "../../components/header";
import { axi, useAuth } from "../context/AuthContext";
import { useNavigation } from "@react-navigation/native";

const Votes = () => {
  const [page, setPage] = useState("votes");
  const [votingData, setVotingData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { authState } = useAuth();
  const navigation = useNavigation();

  const [modalVisible, setModalVisible] = useState(false);
  const [voteModalVisible, setVoteModalVisible] = useState(false);
  const [selectedAward, setSelectedAward] = useState(null);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [nominationInput, setNominationInput] = useState("");
  const [nominations, setNominations] = useState([]);
  const [nominationSuggestions, setNominationSuggestions] = useState([]);
  const [nominee, setNominee] = useState(null);

  const [buttonLoader, setButtonLoader] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const auth = await authState.authenticated;
        console.log(authState.token);
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

  const fetchData = async () => {
    try {
      const headers = { Authorization: `Bearer ${authState.token}` };
      const response = await axi.get("/award/get-awards", { headers });
      setVotingData(response.data.awards);
      setNominations(response.data.nominations);
    } catch (error) {
      console.error("Error fetching awards:", error);
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleError = (error) => {
    if (error.response) {
      const statusCode = error.response.status;
      switch (statusCode) {
        case 400:
          Alert.alert("Error", "Bad request. Please try again later.");
          break;
        case 401:
          console.log("Error", "Unauthorized access. Please log in again.");
          navigation.navigate("auth/mainAuth/signin");
          break;
        case 403:
          Alert.alert(
            "Error",
            "Forbidden access. You do not have permission to access this resource."
          );
          break;
        case 404:
          Alert.alert("Error", "Awards not found.");
          break;
        case 500:
          console.log(
            "Error",
            "Internal server error. Please try again later."
          );
          break;
        default:
          Alert.alert(
            "Error",
            "An unexpected error occurred. Please try again later."
          );
          break;
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

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchData().finally(() => setRefreshing(false));
  }, []);

  const openNominationModal = (award) => {
    setSelectedAward(award);
    setModalVisible(true);
  };

  const openVoteModal = (award) => {
    setSelectedAward(award);
    setVoteModalVisible(true);
  };

  const submitNomination = async () => {
    if (nominationInput.trim() === "" || !nominee) {
      Alert.alert("Error", "Please enter a company name to nominate.");
      return;
    }

    try {
      setButtonLoader(true);
      const formData = {
        nomineeId: nominee.id,
        // nomineeType: "",
        awardId: selectedAward.id,
        reason: "",
      };
      console.log(formData)

      await axi.post("/award/nominate-for-award", formData);

      Alert.alert(
        "Nomination Submitted",
        `You nominated ${nominationInput} for ${selectedAward.title}`
      );
      setModalVisible(false);
      setNominationInput("");
      setNominee(null); // Clear the selected nominee
      setNominationSuggestions([]); // Clear suggestions
    } catch (error) {
      let message =
        "An error occurred while submitting your nomination. Please try again later.";

      if (error.response) {
        const statusCode = error.response.status;
        switch (statusCode) {
          case 400:
            // Bad request
            message = "Invalid nomination request. Please check your input.";
            break;
          case 401:
            // Unauthorized access
            message = "Unauthorized access. Please log in again.";
            navigation.navigate("auth/mainAuth/signin");
            break;
          case 403:
            // Forbidden access
            message =
              "Forbidden access. You do not have permission to perform this action.";
            break;
          case 404:
            // Resource not found
            message = "Award or nominee not found.";
            break;
          case 409:
            // Conflict
            message = "You have already nominated this company for this award.";
            break;
          case 500:
            // Internal server error
            message = "Internal server error. Please try again later.";
            break;
          default:
            // Generic error message
            message = "An unexpected error occurred. Please try again later.";
            break;
        }
      } else if (error.request) {
        // No response received
        message = "Network error. Please check your internet connection.";
      } else {
        // Error setting up request
        message = "An error occurred while setting up the request.";
      }

      Alert.alert("Error", message);
    } finally {
      setButtonLoader(false);
    }
  };

  const submitVote = async () => {
    if (!selectedCompany || !selectedAward) {
      Alert.alert("Error", "Please select a company to vote for.");
      return;
    }

    try {
      setButtonLoader(true);
      const headers = { Authorization: `Bearer ${authState.token}` };

      await axi.post(
        "/award/vote-for-nominee",
        {
          awardId: selectedAward.id,
          nomineeId: selectedCompany.id,
        },
        { headers }
      );
      Alert.alert(
        "Vote Submitted",
        `You voted for ${selectedCompany.business_nominee.business_name}`
      );
    } catch (error) {
      let message =
        "An error occurred while submitting your vote. Please try again later.";

      if (error.response) {
        const statusCode = error.response.status;
        switch (statusCode) {
          case 400:
            // Specific error message for already voted
            message = "You have already voted for this award category.";
            break;
          case 401:
            // Unauthorized access
            message = "Unauthorized access. Please log in again.";
            navigation.navigate("auth/mainAuth/signin");
            break;
          case 403:
            // Forbidden access
            message =
              "Forbidden access. You do not have permission to perform this action.";
            break;
          case 404:
            // Resource not found
            message = "Award or nominee not found.";
            break;
          case 500:
            // Internal server error
            message = "Internal server error. Please try again later.";
            break;
          default:
            // Generic error message
            message = "An unexpected error occurred. Please try again later.";
            break;
        }
      } else if (error.request) {
        // No response received
        message = "Network error. Please check your internet connection.";
      } else {
        // Error setting up request
        message = "An error occurred while setting up the request.";
      }

      Alert.alert("Error", message);
    } finally {
      setVoteModalVisible(false);
      setSelectedCompany(null);
      setButtonLoader(false);
    }
  };

  const fetchNominationSuggestions = useCallback(async () => {
    if (nominationInput.trim() === "") {
      setNominationSuggestions([]);
      return;
    }

    try {
      console.log(nominationInput);
      const headers = { Authorization: `Bearer ${authState.token}` };
      const response = await axi.get(
        `/user/get-search-by-query-string?type=business&query=${nominationInput}`,
        { headers }
      );
      console.log(response.data.results);
      setNominationSuggestions(response.data.results || []);
    } catch (error) {
      console.error("Error fetching nomination suggestions:", error);
    }
  }, [nominationInput, authState.token]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchNominationSuggestions();
    }, 1000);

    return () => clearTimeout(delayDebounceFn);
  }, [nominationInput, fetchNominationSuggestions]);

  return (
    <View style={styles.container}>
      <Header />
      {page === "votes" ? (
        <ScrollView
          style={{ paddingHorizontal: 10, paddingVertical: 10 }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {votingData.map((award) => (
            <View key={award.id} style={styles.awardContainer}>
              <View style={styles.awardHeader}>
                <Text style={styles.awardTitle}>{award.title} 🏅</Text>
                {award.status === "nominations-open" ? (
                  <TouchableOpacity
                    style={styles.nominateButton}
                    onPress={() => openNominationModal(award)}
                  >
                    <Text style={styles.nominateButtonText}>Nominate</Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={styles.nominateButton}
                    onPress={() => openVoteModal(award)}
                  >
                    <Text style={styles.nominateButtonText}>Vote</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          ))}
        </ScrollView>
      ) : (
        <ScrollView style={{ paddingHorizontal: 10 }}>
          {nominations.length === 0 && (
            <Text>You haven't been Nominated Yet.</Text>
          )}
          {Array.isArray(nominations) &&
            nominations.map((award) => (
              <View key={award.id} style={styles.awardContainer}>
                <View style={styles.awardHeader}>
                  <Text style={styles.awardTitle}>{award.title} 🏅</Text>
                </View>
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
              Nominate for {selectedAward?.title}
            </Text>
            <TextInput
              style={styles.input}
              value={nominationInput}
              onChangeText={(text) => {
                setNominationInput(text);
                setNominee(null); // Clear the selected nominee when text changes
              }}
              placeholder="Enter business name"
            />
            <ScrollView>
              {Array.isArray(nominationSuggestions) &&
                nominationSuggestions.map((suggestion) => {
                  const displayText =
                    suggestion.business_name ||
                    suggestion.full_name ||
                    (suggestion.competition_questions &&
                      suggestion.competition_questions.business_name);

                  if (displayText) {
                    return (
                      <TouchableOpacity
                        key={suggestion.id}
                        onPress={() => {
                          setNominationInput(displayText);
                          setNominee(suggestion);
                        }}
                        style={styles.suggestionItem}
                      >
                        <Text>{displayText}</Text>
                      </TouchableOpacity>
                    );
                  }

                  return null;
                })}
            </ScrollView>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={submitNomination}
              disabled={buttonLoader}
            >
              {buttonLoader ? (
                <ActivityIndicator size={"small"} color={"white"} />
              ) : (
                <Text style={styles.modalButtonText}>Submit Nomination</Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalButton, styles.cancelButton]}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.modalButtonText}>Cancel</Text>
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
              Vote for {selectedAward?.title}
            </Text>
            <ScrollView>
              {selectedAward &&
                selectedAward.nominees.map((nominee) => (
                  <TouchableOpacity
                    key={nominee.id}
                    onPress={() => setSelectedCompany(nominee)}
                    style={[
                      styles.suggestionItem,
                      {
                        backgroundColor:
                          selectedCompany === nominee ? "lightgray" : "white",
                      },
                    ]}
                  >
                    <Text>{nominee.business_nominee.business_name}</Text>
                  </TouchableOpacity>
                ))}
            </ScrollView>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={submitVote}
              disabled={buttonLoader}
            >
              {buttonLoader ? (
                <ActivityIndicator size={"small"} color={"white"} />
              ) : (
                <Text style={styles.modalButtonText}>Submit Vote</Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalButton, styles.cancelButton]}
              onPress={() => setVoteModalVisible(false)}
            >
              <Text style={styles.modalButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <View style={styles.bottomTabContainer}>
        <TouchableOpacity
          onPress={() => setPage("votes")}
          style={[styles.bottomTab, page === "votes" && styles.bottomTabActive]}
        >
          <Text style={styles.bottomTabText}>Vote</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setPage("nominations")}
          style={[
            styles.bottomTab,
            page === "nominations" && styles.bottomTabActive,
          ]}
        >
          <Text style={styles.bottomTabText}>Nominations</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
  },
  awardContainer: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: "white",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 2,
  },
  awardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  awardTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  nominateButton: {
    backgroundColor: "green",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  nominateButtonText: {
    color: "white",
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
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  suggestionItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  modalButton: {
    backgroundColor: "green",
    paddingVertical: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  cancelButton: {
    backgroundColor: "#e74c3c",
  },
  modalButtonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  bottomTabContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    borderTopWidth: 1,
    borderColor: "#ddd",
    paddingVertical: 10,
    backgroundColor: "white",
  },
  bottomTab: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  bottomTabActive: {
    borderBottomWidth: 2,
    borderBottomColor: "#3498db",
  },
  bottomTabText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
});

export default Votes;
