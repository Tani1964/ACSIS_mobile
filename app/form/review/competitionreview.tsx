import { ScrollView, StyleSheet, Text, View } from "react-native";
import React, { useState,useLayoutEffect } from "react";
import { AntDesign } from "@expo/vector-icons";
import ActionButton from "@/components/actionButton";
import PropTypes from "prop-types";
import { Link } from "expo-router";
import { useNavigation } from '@react-navigation/native';

const CompetitionReviewItem = ({ label, value, onEdit }) => (
  <View style={styles.itemContainer}>
    <View style={styles.itemHeader}>
      <Text style={styles.itemLabel}>{label}</Text>
      <View style={styles.editButton}>
        <Link href="/form/competition">
          <AntDesign name="edit" size={24} color="#196100" />
          <Text style={styles.editText}>Edit</Text>
        </Link>
      </View>
    </View>
    <Text style={styles.itemValue}>{value}</Text>
  </View>
);

CompetitionReviewItem.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onEdit: PropTypes.func.isRequired,
};

const CompetitionReviewScreen = () => {
  const navigation = useNavigation();
  const competitionReviewData = [
    {
      label: "Does your company have any current investors?",
      value: "Yes, we have several.",
      onEdit: () => console.log("Edit business description"),
    },
    {
      label: "Do you have any existing debt or liabilities which we should be aware of?",
      value: "No, we are debt-free.",
      onEdit: () => console.log("Edit competition interest"),
    },
    {
      label: "Does your company currently employ people?",
      value: "Yes, we have 10 employees.",
      onEdit: () => console.log("Edit investment plan"),
    },
    
  ];

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Competition Review</Text>
      <ScrollView>
        {competitionReviewData.map((item, index) => (
          <CompetitionReviewItem
            key={index}
            label={item.label}
            value={item.value}
            onEdit={item.onEdit}
          />
        ))}
      </ScrollView>
      <ActionButton text="Submit Application" link="/form/review/submittion" />
    </View>
  );
};

export default CompetitionReviewScreen;

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
  itemContainer: {
    borderBottomColor: "lightgrey",
    borderBottomWidth: 1,
    paddingVertical: 20,
  },
  itemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  itemLabel: {
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
  itemValue: {
    marginTop: 8,
  },
});
