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
import RadioGroup from 'react-native-radio-buttons-group';

const Technical = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false); // Form submission loading
  const [dataLoading, setDataLoading] = useState(true); // Data fetching loading
  const { authState } = useAuth();
  const route = useRoute();
  const { id } = route.params;
  
  const [selectedId, setSelectedId] = React.useState();
  const [selectedId2, setSelectedId2] = React.useState();
  const [selectedId3, setSelectedId3] = React.useState();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "",
    });
  }, [navigation]);

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
      try {
        const headers = { Authorization: `Bearer ${authState.token}` };
        const response = await axi.get(`/pitch/get-pitch/${id}`, { headers });
        const data = response.data.pitch.technical_agreement;
        data && setFormData({
          haveCurrentInvestors: data.haveCurrentInvestors,
          haveCurrentInvestorsDescription: data.haveCurrentInvestorsDescription,
          haveDebts: data.haveDebts,
          debtsInfo: data.debtsInfo,
          haveCurrentEmployees: data.haveCurrentEmployees,
          haveCurrentEmployeesDescription: data.haveCurrentEmployeesDescription,
          hasSignedTechnicalAgreement: data.hasSignedTechnicalAgreement,
        });
        setSelectedId(
          data.haveCurrentInvestors? 1 :2 
        );
        setSelectedId2(data.haveDebts ? 1 : 2);
        setSelectedId3(data.haveCurrentEmployees ? 1 : 2);
        setIsAgreementChecked(data.hasSignedTechnicalAgreement);
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
        } 
        console.log(error);
      } finally {
        setDataLoading(false); // Hide loader after fetching data
      }
    };

    checkAuth();
    fetchData();
  }, [authState.authenticated, authState.token, id, navigation]);

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
      const headers = { Authorization: `Bearer ${authState.token}` };
      
      
      const response = await axi.patch(
        `/pitch/update-pitch/${id}/technical_agreement`,
        { ...formData, hasSignedTechnicalAgreement: isAgreementChecked, haveCurrentEmployees: options.find(option => option.id === selectedId3)?.state , haveCurrentInvestors: options.find(option => option.id === selectedId)?.state, haveDebts: options.find(option => option.id === selectedId2)?.state},
        { headers }
      );
      Alert.alert("Success", "Your competition information has been saved.");
      navigation.navigate("updateform/review/personalreview", { id });
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setLoading(false);
    }
  };

  if (dataLoading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#196100" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.questionsContainer}>
          <View style={styles.question}>
            <Text style={styles.boldText}>
              Does your company have any current investors?
            </Text>
            <RadioGroup
              radioButtons={options}
              onPress={setSelectedId}
              selectedId={selectedId}
              containerStyle={styles.radioGroup}
              radioButtonStyle={styles.radioButton}
            />
            {options.find(option => option.id === selectedId)?.state  && (
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
                value={formData.haveCurrentInvestorsDescription}
              />
            )}
          </View>
          <View style={styles.question}>
            <Text style={styles.boldText}>
              Do you have any existing debt or liabilities which we should be aware of?
            </Text>
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
                value={formData.debtsInfo}
              />
            )}
          </View>
          <View style={styles.question}>
            <Text style={styles.boldText}>
              Does your company currently employ people?
            </Text>
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

export default Technical;

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
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
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
