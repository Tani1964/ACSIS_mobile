import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { useRoute } from '@react-navigation/native';

const ViewEvent = () => {
  const route = useRoute();
  const { itemId } = route.params;

  return (
    <View style={styles.container}>
      <Text>Event ID: {itemId}</Text>
    </View>
  );
};

export default ViewEvent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
