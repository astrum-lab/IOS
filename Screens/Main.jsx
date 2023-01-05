import {
  SafeAreaView,
  View,
  StyleSheet,
  Dimensions,
  Image,
  TouchableOpacity,
} from 'react-native';
import {useEffect} from 'react';
import React from 'react';
import {useTheme} from '../ThemeContext';
import useStore from '../store/index';
import {Text} from './Components/Responsive';

import Header from './Components/Header';
import Card from './Components/Card';
import TopTab from './Components/TopTab';
import Footer from './Components/Footer';

const Main = () => {
  const {theme, themeType} = useTheme();

  useEffect(() => {}, []);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'flex-start',
      alignItems: 'center',
      backgroundColor: theme.colors.backgroundSecondary,
    },
    card: {
      width: (Dimensions.get('window').width / 100) * 90,
      height: 200,
      borderRadius: 15,
      resizeMode: 'contain',
      position: 'absolute',
    },
    cardholder: {
      position: 'relative',
      height: 200,
      width: (Dimensions.get('window').width / 100) * 90,
      borderRadius: 15,
    },
    balanceText: {
      fontFamily: 'Fredoka-Light',
      fontSize: 20,
      color: 'white',
      marginTop: 20,
      marginLeft: 20,
    },
    transactionButtons: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: (Dimensions.get('window').width / 100) * 90,
      marginTop: 20,
    },
    transactionButton: {
      backgroundColor: theme.colors.button,
      width: 107,
      height: 41,
      borderRadius: 10,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    btnImg: {
      width: 30,
      height: 30,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <Card />
      <View style={styles.transactionButtons}>
        <TouchableOpacity style={styles.transactionButton}>
          <Image
            source={
              themeType === 'light'
                ? require('../assets/add.png')
                : require('../assets/add-white.png')
            }
            style={styles.btnImg}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.transactionButton}>
          <Image
            source={
              themeType === 'light'
                ? require('../assets/send.png')
                : require('../assets/send-white.png')
            }
            style={styles.btnImg}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.transactionButton}>
          <Image
            source={
              themeType === 'light'
                ? require('../assets/scanner.png')
                : require('../assets/scanner-white.png')
            }
            style={styles.btnImg}
          />
        </TouchableOpacity>
      </View>
      <TopTab />
      <Footer />
    </SafeAreaView>
  );
};

export default Main;
