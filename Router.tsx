import { StatusBar } from "expo-status-bar";
import React from "react";
import { ActivityIndicator, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useFonts } from "expo-font";
import { Provider as ReduxProvider } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { RootSiblingParent } from "react-native-root-siblings";

// Screens
import Home from "./Screens/Home";
import Login from "./Screens/Login";
import Password from "./Screens/Password";
import Users from "./Screens/Users";
import Settings from "./Screens/Settings";

// components
import Header from "./Components/Header";

// store
import store from "./redux/store";

const Stack = createNativeStackNavigator();

let isUser: any;

AsyncStorage.getItem("password").then((res) => {
  if (res) {
    isUser = true;
  } else {
    isUser = false;
  }
});

const Router = () => {
  const [loaded] = useFonts({
    FredokaLight: require("./assets/fonts/Fredoka-Light.ttf"),
    FredokaMedium: require("./assets/fonts/Fredoka-Medium.ttf"),
  });

  if (!loaded) {
    return (
      <View
        style={{
          flex: 1,
          width: "100%",
          height: "100%",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <>
      <RootSiblingParent>
        <ReduxProvider store={store()}>
          <NavigationContainer>
            <Stack.Navigator initialRouteName="Login"
              screenOptions={{
                animation: 'none',
              }}
            >
              <Stack.Screen
                name="Main"
                component={Home}
                options={{
                  gestureEnabled: false,
                  headerTitle: (props) => <Header {...props} />,
                  headerStyle: {
                    backgroundColor: "#f1f1f1",
                  },
                  headerShadowVisible: false,
                  headerBackVisible: false,
                }}
              />
              <Stack.Screen
                name="Login"
                component={isUser ? Password : Login}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="Password"
                options={{ headerShown: false }}
                component={Password}
              />
              <Stack.Screen
                name="Users"
                options={{
                  gestureEnabled: false,
                  headerTitle: (props) => <Header {...props} />,
                  headerStyle: {
                    backgroundColor: "#f1f1f1",
                  },
                  headerShadowVisible: false,
                  headerBackVisible: false,
                }}
                component={Users}
              />
              <Stack.Screen
                name="Settings"
                options={{
                  gestureEnabled: false,
                  headerTitle: (props) => <Header {...props} />,
                  headerStyle: {
                    backgroundColor: "#f1f1f1",
                  },
                  headerShadowVisible: false,
                  headerBackVisible: false,
                }}
                component={Settings}
              />

            </Stack.Navigator>
            <StatusBar backgroundColor="#f1f1f1" />
          </NavigationContainer>
        </ReduxProvider>
      </RootSiblingParent>
    </>
  );
};

export default Router;
