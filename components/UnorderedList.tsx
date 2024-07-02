import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const UnorderedList = ({ items}) => {
  return (
    <View style={styles.list}>
      {items.map((item:any, index:any) => (
        <View key={index} style={styles.listItem}>
          <Text style={styles.bullet}>•</Text>
          <Text style={styles.itemText}>{item}</Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  list: {
    padding: 10,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  bullet: {
    fontSize: 20,
    marginRight: 10,
  },
  itemText: {
    fontSize: 16,
  },
});

export default UnorderedList;
