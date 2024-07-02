import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import React from 'react';
import Header from '../../components/header';
import { WebView } from 'react-native-webview';

const Home = () => {
  return (
    <View style={styles.container}>
      <Header />
      <View style={styles.content}>
        {/* <WebView
          source={{ uri: 'https://widgets.sociablekit.com/linkedin-page-posts/iframe/25427584' }} // Replace with your desired URL
          style={styles.webview}
          startInLoadingState={true}
          renderLoading={() => <ActivityIndicator color="blue" size="large" style={styles.loadingIndicator} />}
        /> */}
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
});

export default Home;
