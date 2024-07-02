import React, { useEffect, useState, useLayoutEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  ScrollView,
  Pressable,
  Platform,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import {
  Ionicons,
  AntDesign,
  SimpleLineIcons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import ActionButton from "../../components/actionButton";
import RadioButtonRN from "radio-buttons-react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useAuth } from "../context/AuthContext";
import { useNavigation } from "@react-navigation/native";
import { axi } from "../context/AuthContext";

const Personal = () => {
  const [loading, setLoading] = useState(false);
  const { authState } = useAuth();
  const navigation = useNavigation();

  useEffect(() => {
    if (!authState?.authenticated) {
      navigation.navigate("auth/mainAuth/signin");
    }
  }, [authState, navigation]);

  const formatDate = (rawDate) => {
    const date = new Date(rawDate);
    const year = date.getFullYear();
    const month = (`0${date.getMonth() + 1}`).slice(-2);
    const day = (`0${date.getDate()}`).slice(-2);
    return `${year}-${month}-${day}`;
  };

  const [date, setDate] = useState(new Date());
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    dateOfBirth: formatDate(date),
    nationality: "",
    ethnicity: "",
    requiresDisabilitySupport: false,
    disabilityInfo: "",
  });
  const [showPicker, setShowPicker] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  const disabilityOptions = [
    { label: "Yes", state: true },
    { label: "No", state: false },
  ];

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowPicker(Platform.OS === "ios");
    setDate(currentDate);
    setFormData((prevState) => ({
      ...prevState,
      dateOfBirth: formatDate(currentDate),
    }));
  };

  const submitHandler = async () => {
    setLoading(true);
    try {
      const headers = { Authorization: `Bearer ${authState.token}` };
      console.log(formData);
      // const response = await axi.post("/pitch/initiate-pitch", formData, { headers });
      // Alert.alert("Success", "Your personal information has been saved.");
      const result = axi.get("/pitch/get-pitch", { headers }).then((res) => {
        const data = res.data.pitch.personal_information;
        setFormData({
          fullName: data.fullName,
          email: data.email,
          phoneNumber: data.phoneNumber,
          dateOfBirth: data.dateOfBirth,
          nationality: data.nationality,
          ethnicity: data.ethnicity,
          requiresDisabilitySupport: data.requiresDisabilitySupport,
          disabilityInfo: data.disabilityInfo,
        });
      });

      navigation.navigate("form/proffessional");
    } catch (error) {
      Alert.alert(
        "Error",
        "There was an error saving your information. Please try again."
      );
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const toggleDatePicker = () => {
    setShowPicker(!showPicker);
  };

  const confirmIOSDate = () => {
    setFormData((prevState) => ({
      ...prevState,
      dateOfBirth: formatDate(date),
    }));
    toggleDatePicker();
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.innerContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 16 }}
          >
            <View style={styles.header}>
              <Text style={styles.headerTextActive}>
                Personal Information <AntDesign name="right" size={13} color="black" />
              </Text>
              <Text style={styles.headerText}>
                Professional Background <AntDesign name="right" size={13} color="black" />
              </Text>
              <Text style={styles.headerText}>
                Competition Questions <AntDesign name="right" size={15} color="black" />
              </Text>
            </View>
          </ScrollView>
          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Ionicons name="person-outline" size={24} color="lightgrey" />
              <TextInput
                style={styles.inputField}
                placeholder="Full Name"
                value={formData.fullName}
                onChangeText={(newText) =>
                  setFormData((prevState) => ({ ...prevState, fullName: newText }))
                }
              />
            </View>
            <View style={styles.inputContainer}>
              <AntDesign name="mail" size={24} color="lightgrey" />
              <TextInput
                style={styles.inputField}
                placeholder="Email address"
                value={formData.email}
                onChangeText={(newText) =>
                  setFormData((prevState) => ({ ...prevState, email: newText }))
                }
              />
            </View>
            <View style={styles.inputContainer}>
              <AntDesign name="phone" size={24} color="lightgrey" />
              <TextInput
                style={styles.inputField}
                placeholder="Phone number with country code"
                value={formData.phoneNumber}
                onChangeText={(newText) =>
                  setFormData((prevState) => ({ ...prevState, phoneNumber: newText }))
                }
              />
            </View>
            <View style={styles.inputContainer}>
              <Pressable
                onPress={toggleDatePicker}
                style={{ flexDirection: "row", alignItems: "center" }}
              >
                <AntDesign name="calendar" size={24} color="lightgrey" />
                <TextInput
                  style={styles.inputField}
                  placeholder="Date of Birth"
                  value={formData.dateOfBirth}
                  editable={false}
                  pointerEvents="none"
                />
              </Pressable>
              {showPicker && (
                <DateTimePicker
                  mode="date"
                  value={date}
                  display="spinner"
                  onChange={onChange}
                />
              )}
              {showPicker && Platform.OS === "ios" && (
                <View style={styles.pickerButtonContainer}>
                  <Pressable
                    style={styles.pickerButton}
                    onPress={toggleDatePicker}
                  >
                    <Text>Cancel</Text>
                  </Pressable>
                  <Pressable
                    style={styles.pickerButton}
                    onPress={confirmIOSDate}
                  >
                    <Text>Confirm</Text>
                  </Pressable>
                </View>
              )}
            </View>
            <View style={styles.inputContainer}>
              <SimpleLineIcons name="globe" size={24} color="lightgrey" />
              <TextInput
                style={styles.inputField}
                placeholder="Nationality"
                value={formData.nationality}
                onChangeText={(newText) =>
                  setFormData((prevState) => ({ ...prevState, nationality: newText }))
                }
              />
            </View>
            <View style={styles.inputContainer}>
              <MaterialCommunityIcons
                name="account-group-outline"
                size={24}
                color="lightgrey"
              />
              <TextInput
                style={styles.inputField}
                placeholder="Ethnicity"
                value={formData.ethnicity}
                onChangeText={(newText) =>
                  setFormData((prevState) => ({ ...prevState, ethnicity: newText }))
                }
              />
            </View>
            <Text style={{ fontWeight: "bold" }}>
              Do you require any disability support?
            </Text>
            <RadioButtonRN
              data={disabilityOptions}
              box={false}
              selectedBtn={(e) =>
                setFormData((prevState) => ({
                  ...prevState,
                  requiresDisabilitySupport: e.state,
                }))
              }
              icon={<AntDesign name="rocket1" size={25} color="#196100" />}
            />
            {formData.requiresDisabilitySupport && (
              <TextInput
                style={styles.textArea}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                placeholder="Please specify..."
                value={formData.disabilityInfo}
                onChangeText={(newText) =>
                  setFormData((prevState) => ({ ...prevState, disabilityInfo: newText }))
                }
              />
            )}
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

export default Personal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 100,
    paddingTop: 30,
  },
  innerContainer: {
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 20,
  },
  headerTextActive: {
    fontSize: 13,
    color: "#196100",
    marginHorizontal: 10,
  },
  headerText: {
    fontSize: 13,
    color: "grey",
    marginHorizontal: 10,
  },
  form: {
    flexDirection: "column",
    gap: 20,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 6,
    borderColor: "lightgrey",
    borderWidth: 1,
    borderRadius: 10,
  },
  inputField: {
    flex: 1,
    height: 40,
    paddingHorizontal: 10,
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
  pickerButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  pickerButton: {
    padding: 10,
    backgroundColor: "lightgrey",
    borderRadius: 10,
    margin: 10,
  },
});

