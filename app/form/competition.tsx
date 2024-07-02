import React, { useState, useLayoutEffect } from "react";
import { StyleSheet, Text, View, TextInput, ScrollView } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import ActionButton from "../../components/actionButton";
import RadioButtonRN from "radio-buttons-react-native";
import { useNavigation } from "@react-navigation/native";
import CheckBox from "react-native-check-box";
import { axi } from "../context/AuthContext";

const Competition = () => {
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  const [formData, setFormData] = useState({
    haveCurrentInvestors: false,
    investorsInfo: "",
    haveDebts: false,
    debtsInfo: "",
    haveCurrentEmployees: false,
  });

  const [isAgreementChecked, setIsAgreementChecked] = useState(false);

  const options = [
    { label: "yes", state: true },
    { label: "no", state: false },
  ];

  const submitHandler = async () => {
    try {
      // Uncomment the line below once axi is configured
      // const response = await axi.post("/pitch/update-pitch?step=competition_questions", formData);
      console.log("Form submitted successfully:", formData);
      navigation.navigate("/form/review/personalreview"); // Navigate to the next screen after submission
    } catch (error) {
      console.error("Error submitting form:", error);
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
                    investorsInfo: newText,
                  }))
                }
              />
            )}
          </View>
          <View style={styles.question}>
            <Text style={styles.boldText}>
              Do you have any existing debt or liabilities which we should be
              aware of?
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
              I electronically sign and reconfirm my agreement to the Terms and
              conditions
            </Text>
          </View>
        </View>
      </ScrollView>
      <View style={styles.actionButtonContainer}>
        <ActionButton
          text={"Save and continue"}
          onPress={submitHandler}
          link={"/form/review/personalreview"}
        />
      </View>
    </View>
  );
};

export default Competition;

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
});
