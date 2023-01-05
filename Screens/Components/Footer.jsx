import {
  View,
  useWindowDimensions,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import React from 'react';
import useStore from '../../store';
import {useTheme} from '../../ThemeContext';

// images
import WalletPurple from '../../assets/wallet-purple.png';
import WalletGray from '../../assets/wallet-gray.png';
import DiscoverPurple from '../../assets/discover.png';
import DiscoverGray from '../../assets/discover-gray.png';
import SettingsPurple from '../../assets/setting-purple.png';
import SettingsGray from '../../assets/setting-gray.png';
import WalletWhite from '../../assets/wallet-white.png';
import DiscoverWhite from '../../assets/search-white.png';
import SettingsWhite from '../../assets/settings-white.png';

const Footer = () => {
  const {route, setRoute} = useStore();

  const handleRoute = route => setRoute(route);

  const {width} = useWindowDimensions();
  const {theme, themeType} = useTheme();

  const styles = StyleSheet.create({
    container: {
      width: width,
      height: 80,
      backgroundColor: theme.colors.footer,
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'center',
      position: 'absolute',
      bottom: 0,
      borderColor: theme.colors.border,
      borderTopWidth: 1,
    },
    icon: {
      width: 35,
      height: 35,
    },
  });

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => handleRoute('home')}>
        <Image
          style={styles.icon}
          source={
            route === 'home'
              ? WalletPurple
              : themeType === 'light'
              ? WalletGray
              : WalletWhite
          }
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => handleRoute('discover')}>
        <Image
          style={styles.icon}
          source={
            route === 'discover'
              ? DiscoverPurple
              : themeType === 'light'
              ? DiscoverGray
              : DiscoverWhite
          }
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => handleRoute('settings')}>
        <Image
          style={styles.icon}
          source={
            route === 'settings'
              ? SettingsPurple
              : themeType === 'light'
              ? SettingsGray
              : SettingsWhite
          }
        />
      </TouchableOpacity>
    </View>
  );
};

export default Footer;
