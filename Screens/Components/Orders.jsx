import {
  View,
  Text,
  StyleSheet,
  SectionList,
  Image,
  useWindowDimensions,
  ActivityIndicator,
} from 'react-native';
import React, {useEffect, useState, useRef} from 'react';
import {getOrders} from '../../utils/transaction';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {useTheme} from '../../ThemeContext';

const Orders = () => {
  const sectionListRef = useRef(null);

  const {theme} = useTheme();

  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const {width} = useWindowDimensions();

  const lastIndex = () => {
    let resLength = 0;
    for (let i = 0; i < data.length; i++) {
      resLength = i;
    }
    return resLength;
  };

  const fetchData = async () => {
    setLoading(true);

    let parsedOrders = [];
    const orders = await getOrders(page);

    if (orders.length === 0) {
      setTimeout(() => {
        setLoading(false);
      }, 500);

      setPage(page - 1);

      return;
    }

    for (let [key, value] of Object.entries(orders)) {
      if (value.length > 1) {
        value[0].borderTop = true;
        value[value.length - 1].borderBottom = true;
      } else if (value.length === 1) {
        value[0].borderTop = true;
        value[0].borderBottom = true;
      }
      parsedOrders.push({
        title: key,
        data: value,
      });
    }
    setData(data => [...data, ...parsedOrders]);

    return setLoading(false);
  };

  const infinityScroll = () => {
    setPage(page + 1);

    sectionListRef.current.scrollToLocation({
      animated: true,
      sectionIndex: lastIndex() - 1,
      itemIndex: 0,
      viewPosition: 0,
    });
  };

  useEffect(() => {
    fetchData();
  }, [page]);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 10,
    },
    item: {
      backgroundColor: theme.colors.button,
      padding: 5,
      height: 45,
      width: (width / 100) * 90 - 10,
      marginVertical: 1,
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'flex-start',
      alignItems: 'center',
    },
    transfer: {
      color: theme.colors.text,
      fontFamily: 'Fredoka-Light',
      fontSize: 16,
    },
    amount: {
      fontSize: 12,
      fontFamily: 'Fredoka-Light',
      color: '#565656',
    },
    section: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-start',
      alignItems: 'flex-start',
      marginLeft: 10,
    },
    title: {
      color: '#a1a3a5',
      fontSize: 12,
      fontFamily: 'Fredoka-Light',
    },
    sectionList: {
      width: (width / 100) * 90,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
  });

  const Item = ({item}) => {
    const image = () => {
      if (item.status === 'failed') {
        return require('../../assets/warning.png');
      } else if (item.status === 'returned') {
        return require('../../assets/success.png');
      } else {
        return require('../../assets/error.png');
      }
    };

    const condition = () => {
      if (item.status === 'failed') {
        return '';
      } else if (item.status === 'returned') {
        return '+';
      } else {
        return '-';
      }
    };

    return (
      <TouchableOpacity
        style={
          item.borderTop && item.borderBottom
            ? {
                ...styles.item,
                borderRadius: 10,
              }
            : item.borderTop
            ? {
                ...styles.item,
                borderTopLeftRadius: 10,
                borderTopRightRadius: 10,
              }
            : item.borderBottom
            ? {
                ...styles.item,
                borderBottomLeftRadius: 10,
                borderBottomRightRadius: 10,
              }
            : styles.item
        }>
        <Image source={image()} style={{width: 40, height: 40}} />
        <View style={styles.section}>
          <Text style={styles.transfer}>Transfer</Text>
          <Text style={styles.amount}>
            {condition()}
            {item.amount}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const Title = ({title}) => {
    return (
      <View
        style={{
          width: (width / 100) * 90 - 20,
          marginVertical: 5,
        }}>
        <Text style={styles.title}>{title}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <SectionList
        contentContainerStyle={styles.sectionList}
        sections={data}
        keyExtractor={(item, index) => item + index}
        renderItem={({item}) => <Item item={item} />}
        renderSectionHeader={({section: {title}}) => <Title title={title} />}
        stickySectionHeadersEnabled={false}
        onEndReached={() => {
          infinityScroll();
        }}
        ListFooterComponent={
          loading ? (
            <ActivityIndicator
              size="large"
              color={theme.colors.primary}
              style={{marginVertical: 10}}
            />
          ) : null
        }
        ref={sectionListRef}
      />
    </View>
  );
};

export default Orders;
