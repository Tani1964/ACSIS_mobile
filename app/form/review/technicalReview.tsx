import { AntDesign, Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Link } from "expo-router";
import * as SecureStore from "expo-secure-store";
import React, { useEffect, useLayoutEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { axi, useAuth } from "../../context/AuthContext";

const TechnicalReview = () => {
  const navigation = useNavigation();
  const [data, setData] = useState({});
  const { authState } = useAuth();
  const [loading, setLoading] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "",
    });
  }, [navigation]);

  const route = useRoute();
  const { id } = route.params;

  useEffect(() => {
    if (!id) {
      console.error("ID is undefined");
      return;
    }

    const checkAuthAndFetchData = async () => {
      try {
        const auth = await authState.authenticated;
        if (!auth) {
          navigation.navigate("auth/mainAuth/signin");
          return;
        }

        const token = await SecureStore.getItemAsync("token");
        if (!token) {
          navigation.navigate("auth/mainAuth/signin");
          return;
        }

        const headers = {
          Authorization: `Bearer ${authState.token}`,
          "ngrok-skip-browser-warning": "true",
        };
        const response = await axi.get(`/pitch/get-pitch/${id}`, { headers });
        setData(response.data.pitch.technical_agreement);
      } catch (error) {
        console.error(error);
      }
    };

    checkAuthAndFetchData();
  }, [authState, id, navigation]);

  const submitHandler = async () => {
    setLoading(true);
    try {
      const headers = {
        Authorization: `Bearer ${authState.token}`,
        "ngrok-skip-browser-warning": "true",
      };
      const response = await axi.post(
        `/pitch/submit-pitch/${id}`,
        {},
        {
          headers,
        }
      );
      Alert.alert("Success", "Your application has been submitted.");
      navigation.navigate("form/review/submittion");
    } catch (error) {
      Alert.alert(
        "Error",
        "There was an error saving your information. Please try again."
      );
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={{ display: "flex" }}>
        
        <Text style={styles.header}>Technical Questions</Text>
      </View>
      <ScrollView>
        <View style={styles.infoItem}>
          <View style={styles.infoHeader}>
            <Text style={styles.infoLabel}>
              Does your company have any current investors?
            </Text>
            <View style={styles.editButton}>
              <Link href="/form/technical">
                <AntDesign name="edit" size={24} color="#196100" />
                <Text style={styles.editText}>Edit</Text>
              </Link>
            </View>
          </View>
          <Text style={styles.infoValue}>
            {data.have_current_investors ? "Yes" : "No"}
          </Text>
        </View>
        <View style={styles.infoItem}>
          <View style={styles.infoHeader}>
            <Text style={styles.infoLabel}>
              Does your company currently employ people?
            </Text>
            <View style={styles.editButton}>
              <Link href="/form/technical">
                <AntDesign name="edit" size={24} color="#196100" />
                <Text style={styles.editText}>Edit</Text>
              </Link>
            </View>
          </View>
          <Text style={styles.infoValue}>
            {data.have_current_employees ? "Yes" : "No"}
          </Text>
        </View>
        <View style={styles.infoItem}>
          <View style={styles.infoHeader}>
            <Text style={styles.infoLabel}>
              Do you have any existing debt or liability which we should be
              aware of?
            </Text>
            <View style={styles.editButton}>
              <Link href="/form/technical">
                <AntDesign name="edit" size={24} color="#196100" />
                <Text style={styles.editText}>Edit</Text>
              </Link>
            </View>
          </View>
          <Text style={styles.infoValue}>{data.have_debts ? "Yes" : "No"}</Text>
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
            <Text style={styles.actionButtonText}>Submit</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default TechnicalReview;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingHorizontal: 30,
  },
  header: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
  },
  infoItem: {
    borderBottomColor: "lightgrey",
    borderBottomWidth: 1,
    paddingVertical: 20,
  },
  infoHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  infoLabel: {
    fontWeight: "bold",
  },
  editButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  editText: {
    color: "#196100",
    marginLeft: 5,
  },
  infoValue: {
    marginTop: 8,
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
});
