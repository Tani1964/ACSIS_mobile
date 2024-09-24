import { View, Text, StyleSheet, ActivityIndicator, Alert, RefreshControl, ScrollView } from 'react-native';
import React, { useState, useEffect } from 'react';
import Header from '../../components/header';
import { WebView } from 'react-native-webview';
import MainAdvert from '@/components/mainAdvert';


const Home = () => {
  const [hasError, setHasError] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [key, setKey] = useState(0); // To force reload of WebView

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
    setKey(prevKey => prevKey + 1); // Change the key to force reload
    setHasError(false); // Reset the error state
    setRefreshing(false); // Stop refreshing after reloading
  };

  return (
    <View style={styles.container}>
      <Header />
      <ScrollView 
        contentContainerStyle={styles.content} 
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {hasError ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>Failed to load content.</Text>
          </View>
        ) : (
          <WebView
            key={key}
            source={{ uri: 'https://widgets.sociablekit.com/linkedin-page-posts/iframe/25427584' }} // Replace with your desired URL
            style={styles.webview}
            startInLoadingState={true}
            renderLoading={() => <ActivityIndicator color="#196100" size="large" style={styles.loadingIndicator} />}
            onError={handleError}
          />
        )}
        <View style={styles.sponsors}>
          <MainAdvert filter={"general"}/>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flexGrow: 1, // Ensure content stretches to fill the ScrollView
  },
  loadingIndicator: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -25 }, { translateY: -25 }],
  },
  sponsors: {
    position: 'absolute', // Absolute positioning to overlap the WebView
    top: 0, // Adjust as needed to control the overlap position
    left: 0,
    right: 0,
    height: "18%", // Adjust height as needed
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white', // Semi-transparent background to overlap but still show the WebView content
    zIndex: 1, // Ensure it appears above the WebView
  },
  sponsorText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  webview: {
    flex: 1,
    height: 400, // Ensure the WebView has a defined height
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
