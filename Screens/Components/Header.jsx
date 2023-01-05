import {View, Image, StyleSheet, useWindowDimensions} from 'react-native';
import React from 'react';
import Wallet from '../../assets/wallet.png';

const Header = () => {
  const {width} = useWindowDimensions();

  const styles = StyleSheet.create({
    container: {
      width: width,
      paddingLeft: (width / 100) * 5,
      marginTop: 10,
      marginBottom: 10,
    },
    walletImage: {
      width: 150,
      height: 35.66,
    },
  });

  return (
    <View style={styles.container}>
      <Image style={styles.walletImage} source={Wallet} />
    </View>
  );
};

export default Header;
