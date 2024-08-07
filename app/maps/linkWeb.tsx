import { StyleSheet, Text, View, ActivityIndicator } from "react-native";
import React, {useLayoutEffect} from "react";
import { WebView } from "react-native-webview";
import { useRoute } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";

const linkWeb = () => {
  const navigation = useNavigation()
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "",
    });
  }, [navigation]);

  const route = useRoute();
  const { link } = route.params;

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <WebView
          source={{ uri: link }} // Replace with your desired URL
          style={styles.webview}
          startInLoadingState={true}
          renderLoading={() => (
            <ActivityIndicator
              color="blue"
              size="large"
              style={styles.loadingIndicator}
            />
          )}
        />
      </View>
    </View>
  );
};

export default linkWeb;

const styles = StyleSheet.create({
  webview: {
    flex: 1,
  },
  loadingIndicator: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -25 }, { translateY: -25 }],
  },
  content: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
});
