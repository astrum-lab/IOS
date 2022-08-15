import {
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Vibration,
} from "react-native";
import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import * as Linking from "expo-linking";
import AsyncStorage from "@react-native-async-storage/async-storage";

import api from "../api";

// style
import style from "../style";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigation = useNavigation();

  async function handleSubmit(email: string, password: string) {
    try {
      api
        .post("/login", {
          email,
          password,
        })
        .then((res) => {
          AsyncStorage.setItem("token", res.data.token);
          navigation.navigate("Password" as never);
        });
    } catch (error) {
      console.error(`Error at Login handleSubmit: \n${error.message}`);
      Vibration.vibrate(200);
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={style.container}
    >
      <View style={style.flexible}>
        <Image
          source={require("../assets/logo.png")}
          style={{
            width: 101,
            height: 25,
          }}
        />
        <View
          style={{
            height: 31,
            width: 4,
            backgroundColor: "#00ebb0",
          }}
        />
        <Text
          style={[
            style.textPrimary,
            {
              fontFamily: "FredokaMedium",
            },
          ]}
        >
          Sign In
        </Text>
      </View>
      <TextInput
        style={[style.input]}
        placeholder="E-mail"
        placeholderTextColor="#bebebe"
        value={email}
        onChangeText={(text) => setEmail(text)}
        autoCapitalize="none"
      />
      <TextInput
        style={[style.input]}
        placeholder="Password"
        placeholderTextColor="#bebebe"
        value={password}
        onChangeText={(text) => setPassword(text)}
        secureTextEntry={true}
      />
      <View style={{ width: "80%", paddingLeft: 5, marginTop: 20 }}>
        <TouchableOpacity>
          <Text style={[style.textPrimary, { fontSize: 15 }]}>
            Forgot your password?
          </Text>
        </TouchableOpacity>
      </View>
      <View style={[style.flexible, { justifyContent: "space-between" }]}>
        <TouchableOpacity
          style={[
            style.button,
            {
              backgroundColor: "rgba(87, 51, 209, 0.2)",
            },
          ]}
          onPress={() => {
            Linking.openURL("https://astrocoin.uz/qwasar-check");
          }}
        >
          <Text style={[style.textPrimary, { fontSize: 15, color: "#5733d1" }]}>
            Sign Up
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={style.button}
          onPress={() => {
            handleSubmit(email, password);
          }}
        >
          <Text style={[style.textPrimary, { fontSize: 15, color: "#fff" }]}>
            Sign In
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default Login;
