import React, { useState, useLayoutEffect, useEffect } from "react";
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
import RadioButtonRN from "radio-buttons-react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import CheckBox from "react-native-check-box";
import { axi } from "../context/AuthContext";
import { useAuth } from "../context/AuthContext";
import * as SecureStore from "expo-secure-store";

const technical = () => {
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
    checkAuth();
  }, []);

  const [formData, setFormData] = useState({
    haveCurrentInvestors: false,
    haveCurrentInvestorsDescription: "",
    haveDebts: false,
    debtsInfo: "",
    haveCurrentEmployees: false,
    haveCurrentEmployeesDescription: "",
    hasSignedTechnicalAgreement: false,
  });

  const [isAgreementChecked, setIsAgreementChecked] = useState(false);

  const options = [
    { label: "yes", state: true },
    { label: "no", state: false },
  ];

  const submitHandler = async () => {
    if (!isAgreementChecked) {
      Alert.alert("Error", "You must agree to the terms and conditions to proceed.");
      return;
    }

    setLoading(true);
    try {
      const headers = { Authorization: `Bearer ${authState.token}` };
      const response = await axi.patch(
        `/pitch/update-pitch/${id}/technical_agreement`,
        { ...formData, hasSignedTechnicalAgreement: isAgreementChecked },
        { headers }
      );
      Alert.alert("Success", "Your competition information has been saved.");
      navigation.navigate("form/review/personalreview", { id });
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 16,
        }}
      >
        <View style={styles.pageLinks}>
          <Text style={styles.pageLinkText}>
            Personal Information <AntDesign name="right" size={13} color="black" />
          </Text>
          <Text style={styles.pageLinkText}>
            Professional Background <AntDesign name="right" size={13} color="black" />
          </Text>
          <Text style={styles.activePageLinkText}>
            Competition Questions <AntDesign name="right" size={15} color="black" />
          </Text>
        </View>
      </ScrollView>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.questionsContainer}>
          <View style={styles.question}>
            <Text style={styles.boldText}>
              Does your company have any current investors?
            </Text>
            <RadioButtonRN
              data={options}
              box={false}
              selectedBtn={(e) =>
                setFormData((prevState) => ({
                  ...prevState,
                  haveCurrentInvestors: e.state,
                }))
              }
              icon={<AntDesign name="rocket1" size={25} color="#196100" />}
            />
            {formData.haveCurrentInvestors && (
              <TextInput
                style={styles.textArea}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                placeholder="Please specify..."
                onChangeText={(newText) =>
                  setFormData((prevState) => ({
                    ...prevState,
                    haveCurrentInvestorsDescription: newText,
                  }))
                }
              />
            )}
          </View>
          <View style={styles.question}>
            <Text style={styles.boldText}>
              Do you have any existing debt or liabilities which we should be aware of?
            </Text>
            <RadioButtonRN
              data={options}
              box={false}
              selectedBtn={(e) =>
                setFormData((prevState) => ({
                  ...prevState,
                  haveDebts: e.state,
                }))
              }
              icon={<AntDesign name="rocket1" size={25} color="#196100" />}
            />
            {formData.haveDebts && (
              <TextInput
                style={styles.textArea}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                placeholder="Please specify..."
                onChangeText={(newText) =>
                  setFormData((prevState) => ({
                    ...prevState,
                    debtsInfo: newText,
                  }))
                }
              />
            )}
          </View>
          <View style={styles.question}>
            <Text style={styles.boldText}>
              Does your company currently employ people?
            </Text>
            <RadioButtonRN
              data={options}
              box={false}
              selectedBtn={(e) =>
                setFormData((prevState) => ({
                  ...prevState,
                  haveCurrentEmployees: e.state,
                }))
              }
              icon={<AntDesign name="rocket1" size={25} color="#196100" />}
            />
          </View>
          <View style={styles.agreementContainer}>
            <CheckBox
              value={isAgreementChecked}
              onClick={() => setIsAgreementChecked(!isAgreementChecked)}
              style={styles.agreementCheckbox}
              isChecked={isAgreementChecked}
            />
            <Text style={styles.agreementText}>
              I electronically sign and reconfirm my agreement to the Terms and conditions
            </Text>
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

export default technical;

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
  agreementContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
  },
  agreementCheckbox: {
    marginRight: 8,
  },
  agreementText: {
    flex: 1,
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
