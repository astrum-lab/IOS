import {
  SafeAreaView,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  useWindowDimensions,
  Text,
  Share,
  TextInput,
} from 'react-native';
import React, {useMemo, useRef, useEffect, useState} from 'react';
import {useTheme} from '../ThemeContext';
import BottomSheet from '@gorhom/bottom-sheet';
import QRCode from 'react-native-qrcode-svg';
import {getUser} from '../utils/auth';
import {getUserByWallet} from '../utils/transaction';
import Header from './Components/Header';
import Card from './Components/Card';
import TopTab from './Components/TopTab';
import Footer from './Components/Footer';
import Clipboard from '@react-native-clipboard/clipboard';
import Copy from '../assets/copy.png';
import ShareIcon from '../assets/share-icon.png';
import PasteIcon from '../assets/paste-icon.png';
import {Read} from '../utils/storage/crud';

const Main = () => {
  const {theme, themeType} = useTheme();
  const [user, setUser] = useState();
  const [wallet, setWallet] = useState('');
  const [walletUser, setWalletUser] = useState('');
  const {width, height} = useWindowDimensions();

  const bottomSheetRef = useRef(null);
  const bottomSheetSendRef = useRef(null);

  const snapPoints = useMemo(() => ['70%'], []);

  const handleCopyWallet = () => {
    Clipboard.setString(user?.wallet);
    bottomSheetRef.current?.close();
  };

  const handlePasteWallet = async () => {
    const text = await Clipboard.getString();
    setWallet(text);
  };

  const handleSnapPress = () => {
    bottomSheetRef.current?.snapToIndex(0);
  };

  const handleSnapSendPress = () => {
    bottomSheetSendRef.current?.snapToIndex(0);
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'flex-start',
      alignItems: 'center',
      backgroundColor: theme.colors.backgroundSecondary,
    },
    transactionButtons: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: (width / 100) * 90,
      marginTop: height === 667 ? -20 : 20,
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
    bottomSheetContainer: {
      display: 'flex',
      justifyContent: 'flex-start',
      alignItems: 'center',
      zIndex: 1,
      height: '100%',
      backgroundColor: theme.colors.backgroundSecondary,
    },
    textRecieve: {
      fontFamily: 'Fredoka-Light',
      fontSize: 30,
      color: theme.colors.text,
    },
    qrCodeBg: {
      backgroundColor: theme.colors.background,
      width: 300,
      height: 300,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 20,
      marginTop: 40,
    },
    input: {
      width: (width / 100) * 75,
      height: 40,
      backgroundColor: theme.colors.background,
      borderRadius: 10,
      marginTop: 40,
      display: 'flex',
      justifyContent: 'space-around',
      alignItems: 'center',
      flexDirection: 'row',
    },
    wallet: {
      fontFamily: 'Fredoka-Medium',
      fontSize: 13,
      color: theme.colors.inputText,
    },
    copyImg: {
      width: 20,
      height: 20,
    },
    shareBtn: {
      backgroundColor: theme.colors.primary,
      width: (width / 100) * 75,
      height: 40,
      borderRadius: 10,
      marginTop: 20,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row',
    },
    shareText: {
      fontFamily: 'Fredoka-Light',
      fontSize: 20,
      color: '#fff',
      marginRight: 10,
    },
    textInput: {
      width: (width / 100) * 90,
      height: 40,
      backgroundColor: theme.colors.input,
      borderRadius: 10,
      marginTop: 10,
      paddingLeft: 10,
      paddingRight: 30,
      fontFamily: 'Fredoka-Light',
    },
    inputView: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row',
      height: 40,
      marginBottom: 30,
    },
    walletUserView: {
      display: 'flex',
      justifyContent: 'flex-start',
      alignItems: 'center',
      flexDirection: 'row',
      width: (width / 100) * 90,
      paddingLeft: 15,
    },
    send: {
      fontFamily: 'Fredoka-Medium',
      fontSize: 25,
      color: theme.colors.text,
      marginTop: 20,
    },
  });

  useEffect(() => {
    const GetUser = async () => {
      try {
        const user = await getUser();
        setUser(user);
      } catch (error) {
        console.log(error);
      }
    };
    GetUser();
  }, []);

  useEffect(() => {
    const GetUserByWallet = async () => {
      try {
        const user = await getUserByWallet(wallet);
        setWalletUser(user.fio);
      } catch (error) {
        console.log(error);
      }
    };
    GetUserByWallet();
  }, [wallet]);

  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <Card />
      <View style={styles.transactionButtons}>
        <TouchableOpacity
          style={styles.transactionButton}
          onPress={handleSnapPress}>
          <Image
            source={
              themeType === 'light'
                ? require('../assets/add.png')
                : require('../assets/add-white.png')
            }
            style={styles.btnImg}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.transactionButton}
          onPress={handleSnapSendPress}>
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
      <BottomSheet
        ref={bottomSheetRef}
        snapPoints={snapPoints}
        enablePanDownToClose
        index={-1}
        style={{
          backgroundColor: theme.colors.backgroundSecondary,
        }}
        handleStyle={{
          backgroundColor: theme.colors.backgroundSecondary,
        }}>
        <View style={styles.bottomSheetContainer}>
          <Text style={styles.textRecieve}>Recieve</Text>
          <View style={styles.qrCodeBg}>
            <QRCode
              value={user?.wallet}
              size={250}
              logoBackgroundColor="transparent"
            />
          </View>
          <View style={styles.input}>
            <Text style={styles.wallet}>{user?.wallet}</Text>
            <TouchableOpacity onPress={handleCopyWallet}>
              <Image source={Copy} style={styles.copyImg} />
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={styles.shareBtn}
            onPress={() =>
              Share.share({
                message: user?.wallet,
              })
            }>
            <Text style={styles.shareText}>Share</Text>
            <Image source={ShareIcon} style={styles.copyImg} />
          </TouchableOpacity>
        </View>
      </BottomSheet>
      <BottomSheet
        ref={bottomSheetSendRef}
        snapPoints={snapPoints}
        enablePanDownToClose
        index={-1}
        style={{
          backgroundColor: theme.colors.backgroundSecondary,
        }}
        handleStyle={{
          backgroundColor: theme.colors.backgroundSecondary,
        }}>
        <View style={styles.bottomSheetContainer}>
          <Text style={styles.send}>Send</Text>
          <View style={styles.inputView}>
            <TextInput
              style={styles.textInput}
              value={wallet}
              onChangeText={setWallet}
              placeholder="Wallet Adress"
            />
            <TouchableOpacity
              style={{
                marginBottom: -40,
                marginLeft: -30,
              }}
              onPress={handlePasteWallet}>
              <Image source={PasteIcon} style={styles.copyImg} />
            </TouchableOpacity>
          </View>
          <View style={styles.walletUserView}>
            <Text
              style={{
                fontFamily: 'Fredoka-Light',
                color: theme.colors.text,
              }}>
              {walletUser}
            </Text>
          </View>
          <TextInput
            style={styles.textInput}
            value={wallet => {
              return wallet.toLocaleString('fi-FI');
            }}
            onChangeText={setWallet}
            placeholder="12 312 ASC"
            keyboardType="number-pad"
          />
        </View>
      </BottomSheet>
    </SafeAreaView>
  );
};

export default Main;
