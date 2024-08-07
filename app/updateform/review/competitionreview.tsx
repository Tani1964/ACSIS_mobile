import { ScrollView, StyleSheet, Text, View, TouchableOpacity, ActivityIndicator } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import ActionButton from "@/components/actionButton";
import { Link } from "expo-router";
import React, { useState, useLayoutEffect, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { axi, useAuth } from "../../context/AuthContext";
import { useLocalSearchParams } from "expo-router";
import { useRoute } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";


const competitionReview = () => {
  const navigation = useNavigation();
  const [data, setData] = useState({});
  const { authState } = useAuth();
  const [loading, setLoading] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);
  const route = useRoute();
  const { id } = route.params;

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
    const getData = async () => {
      const headers = { Authorization: `Bearer ${authState.token}` };
      const response = await axi.get(`/pitch/get-pitch/${id}`, {
        headers,
      });
      setData(response.data.pitch.competition_questions);
      console.log(response);
    };
    checkAuth();
    getData();
  }, []);

  return (
    <View style={styles.container}>
      <View style={{display:"flex"}}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="close" size={24} color="black" />
        </TouchableOpacity>
      <Text style={styles.header}>Competition Questions</Text>
      </View>
      <ScrollView>
        <View style={styles.infoItem}>
          <View style={styles.infoHeader}>
            <Text style={styles.infoLabel}>
              Please provide a brief description of your business
            </Text>
            {/* <View style={styles.editButton}>
              <Link href="/updateform/competition">
                <AntDesign name="edit" size={24} color="#196100" />
                <Text style={styles.editText}>Edit</Text>
              </Link>
            </View> */}
          </View>
          <Text style={styles.infoValue}>{data.business_description}</Text>
        </View>
        <View style={styles.infoItem}>
          <View style={styles.infoHeader}>
            <Text style={styles.infoLabel}>
              Why are you interested in this competition?
            </Text>
            {/* <View style={styles.editButton}>
              <Link href="/updateform/competition">
                <AntDesign name="edit" size={24} color="#196100" />
                <Text style={styles.editText}>Edit</Text>
              </Link>
            </View> */}
          </View>
          <Text style={styles.infoValue}>{data.reason_of_interest}</Text>
        </View>
        <View style={styles.infoItem}>
          <View style={styles.infoHeader}>
            <Text style={styles.infoLabel}>
              How do you plan to use the investment prize if you win?
            </Text>
            {/* <View style={styles.editButton}>
              <Link href="/updateform/competition">
                <AntDesign name="edit" size={24} color="#196100" />
                <Text style={styles.editText}>Edit</Text>
              </Link>
            </View> */}
          </View>
          <Text style={styles.infoValue}>{data.investment_prize_usage_plan}</Text>
        </View>
        <View style={styles.infoItem}>
          <View style={styles.infoHeader}>
            <Text style={styles.infoLabel}>
              What impact do you hope to achieve with investment into your
              vision?
            </Text>
            {/* <View style={styles.editButton}>
              <Link href="/updateform/competition">
                <AntDesign name="edit" size={24} color="#196100" />
                <Text style={styles.editText}>Edit</Text>
              </Link>
            </View> */}
          </View>
          <Text style={styles.infoValue}>{data.impact_plan_with_investment_prize}</Text>
        </View>
        <View style={styles.infoItem}>
          <View style={styles.infoHeader}>
            <Text style={styles.infoLabel}>
              Please provide a short summary of why you should be given the
              opportunity to be on PITCH IT TO CLINCH IT
            </Text>
            {/* <View style={styles.editButton}>
              <Link href="/updateform/competition">
                <AntDesign name="edit" size={24} color="#196100" />
                <Text style={styles.editText}>Edit</Text>
              </Link>
            </View> */}
          </View>
          <Text style={styles.infoValue}>{data.summary_of_why_you_should_participate}</Text>
        </View>
      </ScrollView>
      <View style={styles.actionButtonContainer}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() =>(
            console.log(id),
            navigation.navigate("updateform/review/technicalReview", { id: id })
            )
          }
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

export default competitionReview;

const styles = StyleSheet.create({
  container: {
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
