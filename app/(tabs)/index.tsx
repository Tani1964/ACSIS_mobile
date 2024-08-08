import { View, Text, StyleSheet, ActivityIndicator, Alert,RefreshControl, } from 'react-native';
import React, { useState } from 'react';
import Header from '../../components/header';
import { WebView } from 'react-native-webview';


const Home = () => {
  const [hasError, setHasError] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const handleError = (syntheticEvent) => {
    setHasError(true);
    Alert.alert(
      "Load Error",
      "Failed to load the content. Please check your internet connection or try again later.",
      [{ text: "OK" }]
    );
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchData().then(() => {
      setRefreshing(false); // Stop refreshing after data is fetched
    });
  };

  return (
    <View style={styles.container} refreshControl={
      <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
    }>
      <Header />
      <View style={styles.content}>
        {hasError ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>Failed to load content.</Text>
          </View>
        ) : (
          <WebView
            source={{ uri: 'https://widgets.sociablekit.com/linkedin-page-posts/iframe/25427584' }} // Replace with your desired URL
            style={styles.webview}
            startInLoadingState={true}
            renderLoading={() => <ActivityIndicator color="blue" size="large" style={styles.loadingIndicator} />}
            onError={handleError}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  loadingIndicator: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -25 }, { translateY: -25 }],
  },
  webview: {
    flex: 1,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
  },
});

export default Home;
