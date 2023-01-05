import {
  View,
  Text,
  Image,
  StyleSheet,
  SafeAreaView,
  Vibration,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {getUser} from '../utils/auth';
import wallet from '../assets/wallet.png';
import {useNavigation} from '@react-navigation/native';
import {useTheme} from '../ThemeContext';
import {Create, Read} from '../utils/storage/crud';
import useStore from '../store';
import biometric from '../assets/biometric.png';
import biometricWhite from '../assets/biometric-white.png';
import deletepic from '../assets/delete.png';
import deletepicWhite from '../assets/deletePic-white.png';

const Password = () => {
  const [password, setPassword] = useState('');
  const [passwordStatus, setPasswordStatus] = useState('');
  const [name, setName] = useState('');

  const {theme, themeType} = useTheme();
  const navigation = useNavigation();
  const {setUser} = useStore();

  const numBtns = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  useEffect(() => {


    const GetUser = async () => {
      try {
        const res = await getUser();
        setName(res.name);
        setUser(res);
      } catch (err) {
        console.log(err);
        navigation.navigate('App');
      }
    };
    GetUser();

    Read('password').then(old => {
      if (!old) {
        setPasswordStatus('Create password');
      } else {
        setPasswordStatus('Enter password');
      }
    });
  }, []);

  const handlePassword = num => {
    setPassword(password + num);
    if (password.length === 3 && passwordStatus === 'Create password') {
      setPasswordStatus('Confirm password');
      Create('cashedPassword', password);
      setTimeout(() => {
        setPassword('');
      }, 500);
    }
    if (password.length === 3 && passwordStatus === 'Confirm password') {
      Read('cashedPassword').then(old => {
        if (old === password) {
          Create('password', password);
          setPasswordStatus('Password created');
          navigation.navigate('Main');
        } else {
          setPasswordStatus('Wrong password');
        }
      });

      setTimeout(() => {
        setPassword('');
      }, 500);
    }

    if (password.length === 3 && passwordStatus === 'Enter password') {
      Read('password').then(old => {
        if (old === password) {
          navigation.navigate('Main');
        } else {
          Vibration.vibrate(500);
          setPasswordStatus('Wrong password');
        }
      });

      setTimeout(() => {
        setPassword('');
      }, 500);
    }
  };

  const deleteBtn = () => {
    setPassword(password.slice(0, -1));
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.colors.background,
    },
    walletPic: {
      width: 150,
      height: 35.66,
    },
    nameText: {
      fontFamily: 'Fredoka-Light',
      fontSize: 20,
      marginTop: 20,
      color: theme.colors.text,
    },
    passwordstatus: {
      fontFamily: 'Fredoka-Light',
      fontSize: 14,
      marginTop: 5,
      color: theme.colors.text,
    },
    passwordField: {
      backgroundColor: theme.colors.passwordField,
      marginTop: 10,
      height: 39,
      width: 30,
      borderRadius: 10,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    passwordDot: {
      backgroundColor: theme.colors.passwordDot,
      width: 10,
      height: 10,
      borderRadius: 100,
    },
    passwordContainer: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      width: 175,
    },
    passcode: {
      width: 250,
      height: 376,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginTop: 40,
    },
    passcodeBtn: {
      width: 50,
      height: 50,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 16,
      marginLeft: 16,
      marginBottom: 35,
    },
    passcodeBtnText: {
      fontFamily: 'Fredoka-Light',
      fontSize: 34,
      color: theme.colors.passwordBtnText,
    },
    forgotPassword: {
      fontFamily: 'Fredoka-Medium',
      fontSize: 14,
      color: theme.colors.primary,
    },
    walletImage: {
      width: 150,
      height: 35.66,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <Image source={wallet} style={styles.walletImage} />
      <Text style={styles.nameText}>Hello, {name}</Text>
      <Text style={styles.passwordstatus}>{passwordStatus}</Text>
      <View style={styles.passwordContainer}>
        <View style={styles.passwordField}>
          {password.length >= 1 ? (
            <View style={styles.passwordDot}></View>
          ) : null}
        </View>
        <View style={styles.passwordField}>
          {password.length >= 2 ? (
            <View style={styles.passwordDot}></View>
          ) : null}
        </View>
        <View style={styles.passwordField}>
          {password.length >= 3 ? (
            <View style={styles.passwordDot}></View>
          ) : null}
        </View>
        <View style={styles.passwordField}>
          {password.length >= 4 ? (
            <View style={styles.passwordDot}></View>
          ) : null}
        </View>
      </View>
      <View style={styles.passcode}>
        {numBtns.map((item, key) => {
          return (
            <TouchableOpacity
              style={styles.passcodeBtn}
              key={key}
              onPress={() => handlePassword(item)}>
              <Text style={styles.passcodeBtnText}>{item}</Text>
            </TouchableOpacity>
          );
        })}
        <TouchableOpacity style={styles.passcodeBtn}>
          <Image
            source={themeType === 'light' ? biometric : biometricWhite}
            style={{width: 34, height: 34}}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.passcodeBtn}
          onPress={() => handlePassword(0)}>
          <Text style={styles.passcodeBtnText}>0</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.passcodeBtn} onPress={deleteBtn}>
          <Image
            source={themeType === 'light' ? deletepic : deletepicWhite}
            style={{width: 34, height: 34}}
          />
        </TouchableOpacity>
        <TouchableOpacity>
          <Text style={styles.forgotPassword}>Forgot password?</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Password;
