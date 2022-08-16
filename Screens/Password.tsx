import {
  SafeAreaView,
  Image,
  Text,
  View,
  TouchableOpacity,
  Vibration,
  Dimensions,
} from "react-native";
import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import Toast from "react-native-root-toast";
import tw from "twrnc";

// api
import api from "../api";

// style
import style from "../style";
import * as LocalAuthentication from "expo-local-authentication";

const Password = () => {
  const [user, setUser]: any = useState("");
  const [isUser, setIsUser] = useState(false);
  const [password, setPassword] = useState("");
  const [pass, setPass] = useState("");
  const [ownPassword, setOwnPassword] = useState("");
  const [passwordStatus, setPasswordStatus] = useState("Create Password");

  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  const dispatch = useDispatch();
  const navigation = useNavigation();

  useEffect(() => {
    (async () => {
      await LocalAuthentication.hasHardwareAsync();
    })();
  });

  const handleBiometricAuth = async () => {
    const biometricAuth = await LocalAuthentication.authenticateAsync({
      promptMessage: "Please authenticate",
      disableDeviceFallback: true,
      cancelLabel: "Cancel",
    });
    if (biometricAuth.success) {
      navigation.navigate("Main" as never);
    } else {
      Toast.show("Authentication failed", {
        duration: Toast.durations.SHORT,
        position: Toast.positions.BOTTOM,
        shadow: true,
        animation: true,
        hideOnPress: true,
        delay: 0,
      });
    }
  };

  useEffect(() => {
    passwordStatus === "Enter Password" ? handleBiometricAuth() : null;
  }, []);

  const getUser = () => {
    try {
      AsyncStorage.getItem("token").then(async (token: string) => {
        await api
          .get("/user", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then((res) => {
            setUser(res.data);
            AsyncStorage.setItem("user", JSON.stringify(res.data));
            dispatch({ type: "SET_USER", user: JSON.stringify(res.data) });
          })
          .catch((error) => {
            console.error(`error at getUser api: \n${error}`);
          });
      });
    } catch (error) {
      console.error(`Error at HomeScreen getUserFunction: \n ${error.message}`);
    }
  };

  useEffect(() => {
    try {
      AsyncStorage.getItem("password").then((res) => {
        if (res) {
          setIsUser(true);
          setPassword(res);
        } else {
          setIsUser(false);
        }
      });
    } catch (error) {
      console.error("Error at Password: " + error.message);
    }
    getUser();
  }, []);

  useEffect(() => {
    if (isUser) {
      setPasswordStatus("Enter Password");
    } 
  }, [isUser]);

  useEffect(() => {
    if (isUser) {
      setPasswordStatus("Enter Password");
      if (pass.length === 4 && pass === password) {
        navigation.navigate("Main" as never);
      } else if (pass.length === 4 && pass !== password) {
        Vibration.vibrate();
        Toast.show("Password is incorrect", {
          duration: Toast.durations.SHORT,
          position: Toast.positions.BOTTOM,
          shadow: true,
          animation: true,
          hideOnPress: true,
          delay: 0,
        });
        setTimeout(() => {
          setPass("");
        }, 200);
      }
    }
    if (pass.length === 4 && passwordStatus === "Create Password") {
      setPasswordStatus("Confirm Password");
      setOwnPassword(pass);
      setTimeout(() => {
        setPass("");
      });
    }
    if (pass.length === 4 && passwordStatus === "Confirm Password") {
      if (pass === ownPassword) {
        AsyncStorage.setItem("password", pass);
        setTimeout(() => {
          setPass("");
        }, 200);
        navigation.navigate("Main" as never);
      } else {
        setTimeout(() => {
          setPass("");
        }, 200);
        Vibration.vibrate(200);
      }
    }
  }, [pass]);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#fff",
        paddingTop: 5,
      }}
    >
      <Image
        source={require("../assets/wallet.png")}
        style={{ width: 150, height: 36 }}
      />
      <Text
        style={[
          style.textPrimary,
          { fontSize: 25, color: "#000", marginTop: 15 },
        ]}
      >
        Hello, {user.name}
      </Text>
      <Text
        style={{
          color: "#707070",
          marginTop: 5,
          fontSize: 14,
          marginBottom: 20,
        }}
      >
        {passwordStatus}
      </Text>

      <View style={tw`w-full flex flex-row justify-center items-center`}>
        <View style={tw`w-1/2 flex flex-row justify-around items-center`}>
          <View
            style={{
              width: 30,
              height: 38,
              backgroundColor: "#F1F1F1",

              borderRadius: 10,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <View
              style={{
                width: 8,
                height: 8,
                backgroundColor: "#ACABAB",
                borderRadius: 100,
                opacity: pass.length >= 1 ? 1 : 0,
              }}
            />
          </View>
          <View
            style={{
              width: 30,
              height: 38,
              backgroundColor: "#F1F1F1",

              borderRadius: 10,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <View
              style={{
                width: 8,
                height: 8,
                backgroundColor: "#ACABAB",
                borderRadius: 100,
                opacity: pass.length >= 2 ? 1 : 0,
              }}
            />
          </View>
          <View
            style={{
              width: 30,
              height: 38,
              backgroundColor: "#F1F1F1",

              borderRadius: 10,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <View
              style={{
                width: 8,
                height: 8,
                backgroundColor: "#ACABAB",
                borderRadius: 100,
                opacity: pass.length >= 3 ? 1 : 0,
              }}
            />
          </View>
          <View
            style={{
              width: 30,
              height: 38,
              backgroundColor: "#F1F1F1",

              borderRadius: 10,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <View
              style={{
                width: 8,
                height: 8,
                backgroundColor: "#ACABAB",
                borderRadius: 100,
                opacity: pass.length >= 4 ? 1 : 0,
              }}
            />
          </View>
        </View>
      </View>
      <View
        style={tw`
        flex w-full justify-center
        items-center pl-1
      `}
      >
        <View style={tw`flex flex-row  justify-center w-4/6  flex-wrap`}>
          {numbers.map((number) => (
            <TouchableOpacity
              key={number}
              style={tw`w-12 h-12 flex justify-center items-center mx-4 my-2`}
              onPress={() => {
                setPass(pass + number);
              }}
            >
              <Text
                style={[
                  tw`text-center text-2xl`,
                  { fontFamily: "FredokaLight" },
                ]}
              >
                {number}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={tw`flex flex-row justify-center w-4/6 flex-wrap`}>
          {passwordStatus === "Enter Password" ? (
            <TouchableOpacity
              style={[
                tw`w-12 h-12 flex justify-center items-center mx-4 my-2 `,
              ]}
              onPress={() => {
                handleBiometricAuth();
              }}
            >
              <Image
                source={require("../assets/finger-scan.png")}
                style={{
                  width: 30,
                  height: 30,
                }}
              />
            </TouchableOpacity>
          ) : (
            <View
              style={tw`w-12 h-12 flex justify-center items-center mx-4 my-2 `}
            />
          )}

          <TouchableOpacity
            style={tw`w-12 h-12 flex justify-center items-center mx-4 my-2`}
            onPress={() => {
              setPass(pass + 0);
            }}
          >
            <Text
              style={[tw`text-center text-2xl`, { fontFamily: "FredokaLight" }]}
            >
              0
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              pass.length != 0
                ? setPass(pass.substring(0, pass.length - 1))
                : null;
            }}
            style={tw`w-12 h-12 flex justify-center items-center mx-4 my-2`}
          >
            <Image
              source={require("../assets/backspace.png")}
              style={{ width: 30, height: 30 }}
            />
          </TouchableOpacity>
        </View>
      </View>
  {
    passwordStatus === "Enter Password" ? (
      <TouchableOpacity
      onPress={() => {
        AsyncStorage.clear();
        navigation.navigate("Login" as never);
      }}
    >
      <Text
        style={{
          color: "#5733d1",
          fontSize: 14,
          fontFamily: "FredokaLight",
          marginTop: 50,
        }}
      >
        Forgot Password
      </Text>
    </TouchableOpacity>)
    : null
  }
    </SafeAreaView>
  );
};

export default Password;