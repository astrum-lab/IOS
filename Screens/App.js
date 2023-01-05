import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  Vibration,
  SafeAreaView,
  StyleSheet,
  Dimensions,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import astrum from '../assets/astrum.png';
import {useTheme} from '../ThemeContext';
import {login} from '../utils/auth';
import {Create, Read} from '../utils/storage/crud';
import Toast from 'react-native-toast-message';
import {useNavigation} from '@react-navigation/native';
import tw from 'twrnc';

const App = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigation = useNavigation();

  const {theme} = useTheme();

  useEffect(() => {
    Read('token').then(token => {
      if (token) {
        navigation.navigate('Password');
      }
    });
  }, []);

  const handleLogin = async () => {
    try {
      if (email === '' || password === '') {
        console.log('error');
        Vibration.vibrate(100);
      } else {
        const response = await login(email, password);
        if (response.token) {
          Create('token', response.token);
          Toast.show({
            type: 'success',
            text1: 'Success',
            text2: 'You have successfully logged in',
          });
          navigation.navigate('Password');
        }
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error.error,
      });
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      height: Dimensions.get('window').height,
      width: Dimensions.get('window').width,
      justifyContent: 'center',
      alignItems: 'center',
    },
    textInput: {
      width: 320,
      height: 40,
      marginTop: 40,
      paddingLeft: 14,
      paddingRight: 4,
      borderRadius: 10,
      backgroundColor: theme.colors.input,
      fontFamily: 'Fredoka-Light',
      color: theme.colors.text,
    },
    fullView: {
      width: Dimensions.get('window').width,
      paddingLeft: (Dimensions.get('window').width - 320) / 2,
    },
    textStyle: {
      marginTop: 24,
      color: theme.colors.textPrimary,
      fontFamily: 'Fredoka-Light',
    },
    buttonContainer: {
      display: 'flex',
      flexDirection: 'column',
    },
    button: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      width: 360,
      height: 40,
      marginTop: 24,
      paddingLeft: 16,
      paddingRight: 16,
      borderRadius: 10,
      backgroundColor: theme.colors.primary,
      color: theme.colors.primaryText,
    },
    buttonText: {
      color: 'white',
      fontSize: 20,
      fontFamily: 'Fredoka-Light',
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <Toast topOffset={55} />
      <Image source={astrum} style={tw`w-[197px] h-[26px]`} />
      <TextInput
        placeholder="Email"
        placeholderTextColor={theme.colors.inputText}
        autoCapitalize="none"
        style={styles.textInput}
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        placeholder="Password"
        placeholderTextColor={theme.colors.inputText}
        style={[styles.textInput, {marginTop: 24}]}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <View style={styles.fullView}>
        <Text style={styles.textStyle}>Recover</Text>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Sign In</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, {backgroundColor: theme.colors.secondary}]}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default App;
