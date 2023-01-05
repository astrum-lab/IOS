import {
  View,
  Image,
  StyleSheet,
  useWindowDimensions,
  Platform,
} from 'react-native';
import React from 'react';
import Wallet from '../../assets/wallet.png';

const Header = () => {
  const {width, height} = useWindowDimensions();

  const styles = StyleSheet.create({
    container: {
      width: width,
      paddingLeft: (width / 100) * 5,
      marginTop: 10,
      marginBottom: 10,
    },
    imageContainer: {
      width: Math.floor(height / 5.6),
      height: height / 22,
    },
    walletImage: {
      width: '100%',
      height: '100%',
      resizeMode: 'contain',
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image style={styles.walletImage} source={Wallet} />
      </View>
    </View>
  );
};

export default Header;
