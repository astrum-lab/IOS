import React, {useState} from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {TabView, SceneMap, TabBar} from 'react-native-tab-view';
import {useWindowDimensions} from 'react-native';
import {useTheme} from '../../ThemeContext';
import Orders from './Orders';
import Transfers from './Transfers';

const TopTab = () => {
  const layout = useWindowDimensions();

  const [index, setIndex] = useState(0);
  const renderScene = SceneMap({
    first: Transfers,
    second: Orders,
  });

  const {width, height} = useWindowDimensions();

  const {theme, themeType} = useTheme();

  const [routes] = useState([
    {
      key: 'first',
      title: 'Transfers',
    },
    {
      key: 'second',
      title: 'Orders',
    },
  ]);

  const styles = StyleSheet.create({
    container: {
      width: (width / 100) * 90,
      height: (height / 100) * 45,
      marginTop: 20,
      borderRadius: 15,
    },
  });

  return (
    <View style={styles.container}>
      <TabView
        navigationState={{index, routes}}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{width: layout.width}}
        renderTabBar={props => (
          <TabBar
            {...props}
            indicatorStyle={{
              backgroundColor: theme.colors.button,
              height: height === 667 ? 30 : 40,
              marginBottom: 5,
              width: '45%',
              marginLeft: '2%',
              borderRadius: 10,
            }}
            style={{
              backgroundColor: theme.colors.swiperBackground,
              borderRadius: 15,
              height: height === 667 ? 40 : 50,
              display: 'flex',
            }}
            renderLabel={({route, focused, color}) => (
              <Text
                style={{
                  color: focused
                    ? themeType === 'light'
                      ? '#5733d1'
                      : '#ffffff'
                    : '#A8A8A8',
                  fontFamily: 'Fredoka-Medium',
                  fontSize: height === 667 ? 14 : 16,
                  marginBottom: height === 667 ? 10 : 0,
                }}>
                {route.title}
              </Text>
            )}
          />
        )}
      />
    </View>
  );
};

export default TopTab;
