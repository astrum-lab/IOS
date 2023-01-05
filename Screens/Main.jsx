import {
  SafeAreaView,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  useWindowDimensions,
  Text,
} from 'react-native';
import React, {useCallback, useMemo, useRef} from 'react';
import {useTheme} from '../ThemeContext';
import BottomSheet from '@gorhom/bottom-sheet';
import 'react-native-gesture-handler';

import Header from './Components/Header';
import Card from './Components/Card';
import TopTab from './Components/TopTab';
import Footer from './Components/Footer';

const Main = () => {
  const {theme, themeType} = useTheme();

  const {width, height} = useWindowDimensions();

  const bottomSheetRef = useRef(null);

  // variables
  const snapPoints = useMemo(() => ['70%'], []);

  const handleSnapPress = () => {
    bottomSheetRef.current?.snapToIndex(0);
  };
  const handleSnapClose = () => {
    bottomSheetRef.current?.close();
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
  });

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

      <BottomSheet ref={bottomSheetRef} index={0} snapPoints={snapPoints}>
        <View style={styles.contentContainer}>
          <Text>Awesome 🎉</Text>
        </View>
      </BottomSheet>
    </SafeAreaView>
  );
};

export default Main;
