import React, { useEffect } from "react";
import { Text, View, Button } from "react-native";
import Header from "../../components/header";
import { useAuth } from "../context/AuthContext";

const events = () => {
  const { authState, setAuthState } = useAuth();

  const changeAuthState = () => {
    setAuthState({ ...authState, authenticated: !authState.authenticated });
    console.log(authState)
  
  }
  useEffect(() => {
    setAuthState({ ...authState, authenticated: true });
    console.log(authState);
  }, []);
  return (
    <View>
      <Header />
      <Text>events</Text>
      <Button title="change auth state" onPress={changeAuthState} />
    </View>
  );
};

export default events;
