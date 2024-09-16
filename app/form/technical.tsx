import React, { useState, useLayoutEffect, useEffect, useMemo } from "react";
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
import RadioGroup from 'react-native-radio-buttons-group';

const technical = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [selectedId, setSelectedId] = React.useState();
  const [selectedId2, setSelectedId2] = React.useState();
  const [selectedId3, setSelectedId3] = React.useState();
  const { authState } = useAuth();
  const route = useRoute();
  const { id } = route.params;

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
    {id:1, label: "yes", state: true },
    {id:2, label: "no", state: false },
  ];

  const submitHandler = async () => {
    if (!isAgreementChecked) {
      Alert.alert("Error", "You must agree to the terms and conditions to proceed.");
      return;
    }
    setLoading(true);
    try {
      const headers = { Authorization: `Bearer ${authState.token}`, "ngrok-skip-browser-warning": "true" };

      console.log({ ...formData, hasSignedTechnicalAgreement: isAgreementChecked, haveCurrentEmployees: options.find(option => option.id === selectedId3)?.state , haveCurrentInvestors: options.find(option => option.id === selectedId)?.state, haveDebts: options.find(option => option.id === selectedId2)?.state})
     
      const response = await axi.patch(
        `/pitch/update-pitch/${id}/technical_agreement`,
        { ...formData, hasSignedTechnicalAgreement: isAgreementChecked, haveCurrentEmployees: options.find(option => option.id === selectedId3)?.state , haveCurrentInvestors: options.find(option => option.id === selectedId)?.state, haveDebts: options.find(option => option.id === selectedId2)?.state},
        { headers }
      );
      Alert.alert("Success", "Your competition information has been saved.");
      navigation.navigate("updateform/review/personalreview", { id });
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
        Alert.alert("Update failed", "Network error. Please check your internet connection.");
      }
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
          <Text style={styles.pageLinkText}>
            Competition Questions <AntDesign name="right" size={15} color="black" />
          </Text>
          <Text style={styles.activePageLinkText}>
              Technical Questions{" "}
              <AntDesign name="right" size={13} color="black" />
            </Text>
        </View>
      </ScrollView>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.questionsContainer}>
          <View style={styles.question}>
            <Text style={styles.boldText}>
              Does your company have any current investors?
            </Text>
            {/* <RadioButtonRN
              data={options}
              box={false}
              selectedBtn={(e) =>
                setFormData((prevState) => ({
                  ...prevState,
                  haveCurrentInvestors: e.state,
                }))
              }
              icon={<AntDesign name="rocket1" size={25} color="#196100" />}
            /> */}
            <RadioGroup
              radioButtons={options}
              onPress={setSelectedId}
              selectedId={selectedId}
              containerStyle={styles.radioGroup}
              radioButtonStyle={styles.radioButton}
            />
            {options.find(option => option.id === selectedId)?.state && (
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
            {/* <RadioButtonRN
              data={options}
              box={false}
              selectedBtn={(e) =>
                setFormData((prevState) => ({
                  ...prevState,
                  haveDebts: e.state,
                }))
              }
              icon={<AntDesign name="rocket1" size={25} color="#196100" />}
            /> */}
            <RadioGroup
            radioButtons={options}
            onPress={setSelectedId2}
            selectedId={selectedId2}
            containerStyle={styles.radioGroup}
            radioButtonStyle={styles.radioButton}
          />
            {options.find(option => option.id === selectedId2)?.state && (
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
            {/* <RadioButtonRN
              data={options}
              box={false}
              selectedBtn={(e) =>
                setFormData((prevState) => ({
                  ...prevState,
                  haveCurrentEmployees: e.state,
                }))
              }
              icon={<AntDesign name="rocket1" size={25} color="#196100" />}
            /> */}
            <RadioGroup
            radioButtons={options}
            onPress={setSelectedId3}
            selectedId={selectedId3}
            containerStyle={styles.radioGroup}
            radioButtonStyle={styles.radioButton}
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
    borderRadius: 100,
    paddingVertical: 15,
    alignItems: "center",
  },
  actionButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },radioGroup: {
    flexDirection: 'row',
    // justifyContent: 'space-between',
    gap: 4
  },
  radioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
});
