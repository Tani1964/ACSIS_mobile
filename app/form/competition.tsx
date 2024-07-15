import React, { useState, useLayoutEffect, useEffect } from "react";
import { StyleSheet, Text, View, TextInput, ScrollView, Alert, TouchableOpacity, ActivityIndicator } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { axi } from "../context/AuthContext";
import { useAuth } from "../context/AuthContext";

const competition = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const { authState } = useAuth();
  const route = useRoute();
  const { id } = route.params;

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  // useEffect(() => {
  //   const checkAuth = async () => {
  //     try {
  //       const auth = authState.authenticated;
  //       if (!auth) {
  //         navigation.navigate("login");
  //       }
  //       console.log('Authentication status successfully.');
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   };
  //   checkAuth();
  // }, []);

  const [formData, setFormData] = useState({
    business_name: "",
    businessDescription: "",
    reasonOfInterest: "",
    investmentPrizeUsagePlan: "",
    impactPlanWithInvestmentPrize: "",
    summaryOfWhyYouShouldParticipate: "",
  });

  const submitHandler = async () => {
    setLoading(true);
    try {
      const headers = { Authorization: `Bearer ${authState.token}` };
      console.log(formData)
      // const response = await axi.patch(`/pitch/update-pitch/${id}/competition_questions`, formData, { headers });
      Alert.alert("Success", "Yolur competition information has been saved.");
      // navigation.navigate("form/technical", {id:id});
    } catch (error) {
      Alert.alert("Error", "There was an error submitting the form. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Page links */}
        <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 16,
          }}
        >
          <View style={styles.pageLinks}>
            <Text style={styles.pageLinkText}>
              Personal Information{" "}
              <AntDesign name="right" size={13} color="black" />
            </Text>
            <Text style={styles.pageLinkText}>
              Professional Background{" "}
              <AntDesign name="right" size={13} color="black" />
            </Text>
            <Text style={styles.activePageLinkText}>
              Competition Questions{" "}
              <AntDesign name="right" size={15} color="black" />
            </Text>
          </View>
        </ScrollView>
        {/* Questions */}
        <View style={styles.questionsContainer}>
          <View style={styles.question}>
            <Text style={styles.boldText}>
              Business Name
            </Text>
            <TextInput
              style={styles.textArea}
              textAlignVertical="top"
              placeholder="Business name"
              value={formData.business_name}
              onChangeText={(newText) =>
                setFormData((prevState) => ({
                  ...prevState,
                  business_name: newText,
                }))
              }
            />
          </View>
          <View style={styles.question}>
            <Text style={styles.boldText}>
              Please provide a brief description of your Business
            </Text>
            <TextInput
              style={styles.textArea}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              placeholder="(200 words max)"
              value={formData.businessDescription}
              onChangeText={(newText) =>
                setFormData((prevState) => ({
                  ...prevState,
                  businessDescription: newText,
                }))
              }
            />
          </View>
          <View style={styles.question}>
            <Text style={styles.boldText}>
              Why are you interested in this competition?
            </Text>
            <TextInput
              style={styles.textArea}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              placeholder="(200 words max)"
              value={formData.reasonOfInterest}
              onChangeText={(newText) =>
                setFormData((prevState) => ({
                  ...prevState,
                  reasonOfInterest: newText,
                }))
              }
            />
          </View>
          <View style={styles.question}>
            <Text style={styles.boldText}>
              How do you plan to use the investment prize if you win?
            </Text>
            <TextInput
              style={styles.textArea}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              placeholder="(200 words max)"
              value={formData.investmentPrizeUsagePlan}
              onChangeText={(newText) =>
                setFormData((prevState) => ({
                  ...prevState,
                  investmentPrizeUsagePlan: newText,
                }))
              }
            />
          </View>
          <View style={styles.question}>
            <Text style={styles.boldText}>
              What impact do you hope to achieve with investment into your vision?
            </Text>
            <TextInput
              style={styles.textArea}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              placeholder="(200 words max)"
              value={formData.impactPlanWithInvestmentPrize}
              onChangeText={(newText) =>
                setFormData((prevState) => ({
                  ...prevState,
                  impactPlanWithInvestmentPrize: newText,
                }))
              }
            />
          </View>
          <View style={styles.question}>
            <Text style={styles.boldText}>
              Please provide a short summary of why you should be given the opportunity to be on PITCH IT TO CLINCH IT
            </Text>
            <TextInput
              style={styles.textArea}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              placeholder="(200 words max)"
              value={formData.summaryOfWhyYouShouldParticipate}
              onChangeText={(newText) =>
                setFormData((prevState) => ({
                  ...prevState,
                  summaryOfWhyYouShouldParticipate: newText,
                }))
              }
            />
          </View>
        </View>
      </ScrollView>
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

export default competition;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingHorizontal: 20,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 100, // Ensure there's space for the button
    paddingTop: 30,
  },
  pageLinks: {
    flexDirection: "row",
    justifyContent: "center",
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
    borderRadius: 15,
    paddingVertical: 15,
    alignItems: "center",
  },
  actionButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
