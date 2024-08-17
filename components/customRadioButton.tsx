import React from "react";
import { TouchableOpacity, View, Text, StyleSheet } from "react-native";
import { AntDesign } from "@expo/vector-icons";

const CustomRadioButton = ({ options, selectedValue, onSelect }) => {
  return (
    <View style={styles.radioContainer}>
      {options.map((option) => (
        <TouchableOpacity
          key={option.value}
          style={styles.radioButton}
          onPress={() => onSelect(option.value)}
        >
          <View
            style={[
              styles.radioCircle,
              selectedValue === option.value && styles.selectedRadioCircle,
            ]}
          >
            {selectedValue === option.value && (
              <AntDesign name="rocket1" size={25} color="#196100" />
            )}
          </View>
          <Text style={styles.radioLabel}>{option.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  radioContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  radioButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  radioCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: "#196100",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  selectedRadioCircle: {
    backgroundColor: "#196100",
  },
  radioLabel: {
    fontSize: 16,
  },
});

export default CustomRadioButton;
