import React, { useState, useLayoutEffect, useEffect, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  ScrollView,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { axi } from "../context/AuthContext";
import { useAuth } from "../context/AuthContext";
import { SafeAreaView } from "react-native-safe-area-context";

const Competition = () => {
  const navigation = useNavigation();
  const { authState } = useAuth();
  const route = useRoute();
  const { id } = route.params;

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    businessName: "",
    businessDescription: "",
    reasonOfInterest: "",
    investmentPrizeUsagePlan: "",
    impactPlanWithInvestmentPrize: "",
    summaryOfWhyYouShouldParticipate: "",
  });

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "",
    });
  }, [navigation]);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const auth = await authState.authenticated;
        if (!auth) {
          navigation.navigate("auth/mainAuth/signin");
        }
      } catch (error) {
        console.error(error);
      }
    };

    const fetchData = async () => {
      setLoading(true); // Start loading
      try {
        const headers = { Authorization: `Bearer ${authState.token}` };
        const response = await axi.get(`/pitch/get-pitch/${id}`, { headers });
        const data = response.data.pitch.competition_questions;
        data && setFormData({
          businessName: data.business_name,
          businessDescription: data.business_description,
          reasonOfInterest: data.reason_of_interest,
          investmentPrizeUsagePlan: data.investment_prize_usage_plan,
          impactPlanWithInvestmentPrize: data.impact_plan_with_investment_prize,
          summaryOfWhyYouShouldParticipate: data.summary_of_why_you_should_participate,
        });
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false); // Stop loading
      }
    };

    checkAuth();
    fetchData();
  }, [authState.authenticated, id, navigation]);

  const validateForm = () => {
    return Object.values(formData).every((value) => value);
  };

  const submitHandler = useCallback(async () => {
    if (!validateForm()) {
      Alert.alert("Validation Error", "All fields are required.");
      return;
    }
    setLoading(true);
    try {
      const headers = { Authorization: `Bearer ${authState.token}` };
      await axi.patch(
        `/pitch/update-pitch/${id}/competition_questions`,
        formData,
        { headers }
      );
      Alert.alert("Success", "Your competition information has been saved.");
      navigation.navigate("updateform/technical", { id });
    } catch (error) {
      if (error.response) {
        const statusCode = error.response.status;
        if (statusCode === 400) {
          Alert.alert("Update Error", "Try again later.");
        } else if (statusCode === 401) {
          navigation.navigate("auth/mainAuth/signin");
        } else if (statusCode === 422) {
          Alert.alert("Update failed", "Make sure to input the right entries.");
        } else if (statusCode === 404) {
          Alert.alert("Pitch not found");
        } else {
          Alert.alert("Update Error", "Try again later.");
        }
      } else {
        Alert.alert("Login Failed", "Network error. Please check your internet connection.");
      }
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, [authState.authenticated, formData, id, navigation]);

  const handleChange = (name, value) => {
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#196100" style={styles.loader} />
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <SafeAreaView>
            <View style={styles.questionsContainer}>
              {[
                { label: "Business Name", name: "businessName", placeholder: "Business name" },
                { label: "Please provide a brief description of your Business", name: "businessDescription", placeholder: "(200 words max)" },
                { label: "Why are you interested in this competition?", name: "reasonOfInterest", placeholder: "(200 words max)" },
                { label: "How do you plan to use the investment prize if you win?", name: "investmentPrizeUsagePlan", placeholder: "(200 words max)" },
                { label: "What impact do you hope to achieve with investment into your vision?", name: "impactPlanWithInvestmentPrize", placeholder: "(200 words max)" },
                { label: "Please provide a short summary of why you should be given the opportunity to be on PITCH IT TO CLINCH IT", name: "summaryOfWhyYouShouldParticipate", placeholder: "(200 words max)" },
              ].map(({ label, name, placeholder }) => (
                <View key={name} style={styles.question}>
                  <Text style={styles.boldText}>{label}</Text>
                  <TextInput
                    style={styles.textArea}
                    textAlignVertical="top"
                    placeholder={placeholder}
                    value={formData[name]}
                    onChangeText={(text) => handleChange(name, text)}
                  />
                </View>
              ))}
            </View>
          </SafeAreaView>
        </ScrollView>
      )}
      <View style={styles.actionButtonContainer}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={submitHandler}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.actionButtonText}>Save and continue</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Competition;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 100, // Ensure there's space for the button
    paddingTop: 30,
    paddingHorizontal: 30
  },
  pageLinks: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 20,
  },
  pageLinkText: {
    fontSize: 13,
    color: "grey",
    marginHorizontal: 10,
  },
  activePageLinkText: {
    fontSize: 13,
    color: "#196100",
    marginHorizontal: 10,
  },
  questionsContainer: {
    flexDirection: "column",
    gap: 20,
  },
  question: {
    marginBottom: 20,
  },
  boldText: {
    fontWeight: "bold",
  },
  textArea: {
    height: "auto",
    borderWidth: 1,
    borderColor: "lightgrey",
    borderRadius: 10,
    marginTop: 10,
    padding: 10,
  },
  actionButtonContainer: {
    padding: 20,
    backgroundColor: "white",
  },
  actionButton: {
    backgroundColor: "#196100",
    borderRadius: 100,
    paddingVertical: 15,
    alignItems: "center",
  },
  actionButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
