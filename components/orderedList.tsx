import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const OrderedList = ({ items }) => {
  return (
    <View style={styles.list}>
      {items.map((item:string, index:number) => (
        <View key={index} style={styles.listItem}>
          <Text style={styles.index}>{index + 1}.</Text>
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
  index: {
    fontSize: 16,
    marginRight: 10,
  },
  itemText: {
    fontSize: 16,
  },
});

export default OrderedList;
