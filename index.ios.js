import * as React from 'react';
import {AppRegistry} from 'react-native';
import {name as appName} from './app.json';
import App from './Screens/App';
import Password from './Screens/Password';
import Main from './Screens/Main';
import {ThemeContextProvider} from './ThemeContext';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
const Stack = createNativeStackNavigator();

const Root = () => {
  return (
    <ThemeContextProvider>
      <Stack.Navigator>
        <Stack.Screen
          name="App"
          component={App}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Password"
          component={Password}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Main"
          component={Main}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
    </ThemeContextProvider>
  );
};

AppRegistry.registerComponent(appName, () => Root);
