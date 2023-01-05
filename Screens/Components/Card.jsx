import {View, Image, StyleSheet, useWindowDimensions} from 'react-native';
import React from 'react';
import CardBackground from '../../assets/card-background.png';
import Coin from '../../assets/coin-half.png';

const Card = () => {
  const {width, height} = useWindowDimensions();

  const styles = StyleSheet.create({
    container: {
      width: (width / 100) * 90,
      height: width * 0.45,
      borderRadius: 15,
    },
    img: {
      width: (width / 100) * 90,
      height: (height / 100) * 21,
      borderRadius: 15,
    },
    coin: {
      width: 90,
      height: (height / 100) * 21 - 10,
      zIndex: 1,
      borderTopRightRadius: 15,
      position: 'absolute',
      right: 0,
    },
    innerView: {},
  });

  return (
    <View style={styles.container}>
      <Image source={CardBackground} blurRadius={50} style={styles.img} />
      <Image
        source={Coin}
        blurRadius={3}
        style={styles.coin}
        resizeMode="cover"
      />
      <View style={styles.innerView}></View>
    </View>
  );
};

export default Card;
