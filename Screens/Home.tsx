import {
  View,
  Text,
  SafeAreaView,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  RefreshControl,
  ActivityIndicator,
  Share,
  TextInput,
  BackHandler,
  Alert,
} from "react-native";
import React, { useRef } from "react";
import { useDispatch } from "react-redux";
import tw from "twrnc";
import Tabs from "../Components/Tabs";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Modalize } from "react-native-modalize";
import QRCode from "react-native-qrcode-svg";
import * as Clipboard from "expo-clipboard";
import Toast from "react-native-root-toast";
import { BarCodeScanner } from "expo-barcode-scanner";
import Modal from "react-native-modal";

import Footer from "../Components/Footer";

// style
import style from "../style";
import api from "../api";

const wait = (timeout: number) => {
  return new Promise((resolve) => setTimeout(resolve, timeout));
};

const width = Dimensions.get("window").width;
const height = Dimensions.get("window").height;

const Home = () => {
  const [refreshing, setRefreshing] = React.useState(false);
  const [user, setUser]: any = React.useState({});
  const [hasPermission, setHasPermission] = React.useState(null);
  const [scanned, setScanned] = React.useState(false);
  const [isModalVisible, setModalVisible] = React.useState(false);
  const [walletAddress, setWalletAddress] = React.useState("");
  const [name, setName] = React.useState("");
  const [token, setToken] = React.useState("");
  const [message, setMessage] = React.useState("");
  const [transfer, setTransfer]: any = React.useState({});

  const shoModalizeRef = useRef(null);

  const handleExit = () => {
    Alert.alert(
      "Do you want to exit?",
      "",
      [
        { text: "Cancel", style: "cancel" },
        { text: "OK", onPress: () => BackHandler.exitApp() },
      ],
      { cancelable: false }
    );
    return true;
  };

  const show = (e: string) => {
    shoModalizeRef.current?.open();
    setTransfer(JSON.parse(e));
    console.log(e);
  };

  React.useEffect(() => {
    BackHandler.addEventListener("hardwareBackPress", handleExit);
    return () => {
      BackHandler.removeEventListener("hardwareBackPress", handleExit);
    };
  }, []);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const dispatch = useDispatch();

  dispatch({ type: "SET_ROUTE", payload: "home" });

  const modalizeRef = useRef<Modalize>(null);

  const onOpen = () => {
    modalizeRef.current?.open();
  };

  const sendModalRef = useRef<Modalize>(null);

  const sendOpen = () => {
    sendModalRef.current?.open();
  };

  const onShare = async () => {
    await Share.share({
      message: user.wallet,
    });
  };

  React.useEffect(() => {
    try {
      AsyncStorage.getItem("token").then((token) => {
        if (token) {
          setToken(token);
          dispatch({ type: "SET_TOKEN", payload: token });
        }
        AsyncStorage.getItem("user").then((user) => {
          if (user) {
            setUser(JSON.parse(user));
            dispatch({ type: "SET_USER", payload: JSON.parse(user) });
          }
        });
      });
    } catch (error) {
      console.error(`Error at HomeScreen useEffect: \n${error.message}`);
    }
  }, []);

  React.useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  const checkWallet = async () => {
    try {
      api
        .post(
          "/wallet",
          { address: walletAddress },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((res) => {
          setName(res.data.fio);
        })
        .catch((err) => {
          console.error(err.message);
        });
    } catch (error) {
      console.error(error.message);
    }
  };

  React.useEffect(() => {
    if (walletAddress.length == 32) {
      checkWallet();
    }
    if (walletAddress.length == 0) {
      setName("Connect");
    }
  }, [walletAddress]);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    wait(2000).then(() => setRefreshing(false));
  }, []);

  if (!user) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  const handleBarCodeScanned = ({ type, data }) => {
    setWalletAddress(data);
    setModalVisible(false);
    sendModalRef.current?.open();
  };

  const handleSend = async () => {
    try {
      api.post(
        "/wallet/transfer",
        {
          wallet_to: walletAddress,
          amount: 1,
          comment: message,
          type: "",
          title: "",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (error) {
      console.error(`Error at HomeScreen handleSend: \n${error.message}`);
    }
  };

  const parseData = (data: string) => {
    // from "2022-07-26T02:21:49.000000Z"
    // to "2022/07/26 02:21"
    const date = new Date(data);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    return `${year}/${month}/${day} ${hours}:${minutes}`;
  };
  return (
    <ScrollView
      style={{ flex: 1, width: width, height: height }}
      contentContainerStyle={{ flexGrow: 1 }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <SafeAreaView style={{ flex: 1 }}>
        <View style={style.cardastro}>
          <Image
            source={require("../assets/coin.png")}
            style={{ width: 50, height: 50 }}
          />
          <Text
            style={[style.textPrimary, { fontWeight: "bold", fontSize: 24 }]}
          >
            {user && user.balance} ASC
          </Text>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-around",
              width: "70%",
            }}
          >
            <TouchableOpacity onPress={onOpen}>
              <Image
                source={require("../assets/plus.png")}
                style={{ width: 50, height: 50 }}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={sendOpen}>
              <Image
                source={require("../assets/arrow-up.png")}
                style={{ width: 50, height: 50 }}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                toggleModal();
              }}
            >
              <Image
                source={require("../assets/scanner.png")}
                style={{ width: 50, height: 50 }}
              />
            </TouchableOpacity>
          </View>
        </View>
        <View style={tw`w-full h-full flex justify-center flex-row`}>
          <Tabs show={show} />
        </View>
        <Footer />
        <Modalize
          ref={modalizeRef}
          snapPoint={height * 0.8}
          modalHeight={height * 0.8}
          scrollViewProps={{ showsVerticalScrollIndicator: false }}
          modalStyle={{
            backgroundColor: "#efefef",
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
          }}
        >
          <View style={tw`flex flex-col items-center h-full`}>
            <Text style={[style.textPrimary, tw`text-black my-4`]}>
              Receive
            </Text>
            <View
              style={[
                tw`p-5 bg-white rounded-xl mb-8`,
                {
                  width: width * 0.8,
                  height: width * 0.8,
                },
              ]}
            >
              <QRCode
                value={`${user.wallet}`}
                size={width * 0.7}
                backgroundColor="white"
                color="black"
              />
            </View>
            <View
              style={tw`flex flex-row w-4/5 justify-around items-center bg-white h-8 rounded-lg mb-4`}
            >
              <Text>{user.wallet}</Text>
              <TouchableOpacity
                onPress={() => {
                  Clipboard.setString(`${user.wallet}`);
                  Toast.show("Copied to clipboard", {
                    duration: Toast.durations.SHORT,
                    position: Toast.positions.BOTTOM,
                    shadow: true,
                    animation: true,
                    hideOnPress: true,
                    delay: 0,
                  });
                }}
              >
                <Image
                  source={require("../assets/document-copy.png")}
                  style={{ width: 19.5, height: 19.5 }}
                />
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={[
                tw`rounded-xl flex flex-row justify-center items-center p-2 w-4/5`,
                { backgroundColor: "#5733d1" },
              ]}
              onPress={onShare}
            >
              <Text
                style={[style.textPrimary, { color: "white", marginRight: 10 }]}
              >
                Share
              </Text>
              <Image
                source={require("../assets/export.png")}
                style={{ width: 19.5, height: 19.5 }}
              />
            </TouchableOpacity>
          </View>
        </Modalize>

        {/* Send Modal */}
        <Modalize
          ref={sendModalRef}
          snapPoint={height * 0.8}
          modalHeight={height * 0.8}
          scrollViewProps={{ showsVerticalScrollIndicator: false }}
          modalStyle={{
            backgroundColor: "#efefef",
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
          }}
        >
          <View style={tw`flex flex-col items-center h-full`}>
            <Text style={[style.textPrimary, tw`text-black mt-4`]}>Send</Text>
            <View
              style={tw`bg-white flex flex-row justify-between items-center w-11/12 rounded-xl my-4 px-4 h-10`}
            >
              <TextInput
                style={[
                  style.textPrimary,
                  tw`text-black my-4 text-base z-10 relative h-11`,
                ]}
                placeholder="Enter wallet address"
                value={walletAddress}
                onChangeText={(text) => {
                  setWalletAddress(text);
                }}
              />
              <TouchableOpacity
                onPress={async () => {
                  // paste address
                  const address = await Clipboard.getStringAsync();
                  setWalletAddress(address);
                }}
              >
                <Image
                  source={require("../assets/document-normal.png")}
                  style={{ width: 19.5, height: 19.5 }}
                />
              </TouchableOpacity>
            </View>
            <View style={tw`w-full pl-6`}>
              <Text style={tw`text-gray-400`}>{name}</Text>
            </View>

            <TextInput
              style={tw`text-black my-4 text-base bg-white rounded-xl w-11/12 h-10 px-4`}
              placeholder="1 234   ASC"
              keyboardType="number-pad"
            />
            <View style={tw` bg-white w-11/12 rounded-xl  mb-4 p-4`}>
              <TextInput
                placeholder="Enter message"
                multiline={true}
                style={{
                  height: height * 0.2,
                }}
                value={message}
                onChangeText={(text) => {
                  setMessage(text);
                }}
              />
            </View>
            <TouchableOpacity
              style={[
                tw`rounded-xl flex flex-row justify-center items-center p-2 w-4/5`,
                { backgroundColor: "#5733d1" },
              ]}
              onPress={() => {
                handleSend();
                console.log("send");
              }}
            >
              <Text
                style={[style.textPrimary, { color: "white", marginRight: 10 }]}
              >
                Send
              </Text>
              <Image
                source={require("../assets/export.png")}
                style={{ width: 19.5, height: 19.5 }}
              />
            </TouchableOpacity>
          </View>
        </Modalize>

        <Modal
          isVisible={isModalVisible}
          hasBackdrop={true}
          style={tw`flex flex-col justify-around items-center h-full`}
        >
          <BarCodeScanner
            onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
            style={{
              height: width * 0.8,
              width: width * 0.8,
            }}
          />
          <TouchableOpacity
            onPress={() => setModalVisible(false)}
            style={[
              tw`w-4/5 h-11 rounded-xl flex flex-row justify-center items-center p-2`,
              { backgroundColor: "#5733d1" },
            ]}
          >
            <Text
              style={[style.textPrimary, { color: "white", marginRight: 10 }]}
            >
              Cancel
            </Text>
          </TouchableOpacity>
        </Modal>

        <Modalize
          ref={shoModalizeRef}
          snapPoint={height * 0.8}
          modalHeight={height * 0.8}
          scrollViewProps={{ showsVerticalScrollIndicator: false }}
          modalStyle={{
            backgroundColor: "#efefef",
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
          }}
        >
          <View style={tw`flex flex-col items-center h-full`}>
            <Image
              source={require("../assets/logo.png")}
              style={{
                width: 200,
                height: 50,
                marginTop: 10,
              }}
            />
            <View style={[tw`w-full bg-gray-300 mt-3`, { height: 1 }]} />
            <View style={tw`w-full flex flex-row mt-2`}>
              <Image
                source={
                  transfer.status === "failed"
                    ? require("../assets/warn.png")
                    : transfer.wallet_to == user.wallet
                    ? require("../assets/import.png")
                    : require("../assets/export.png")
                }
                style={tw`h-12 w-12 mx-2`}
              />
              <View style={tw`flex flex-col`}>
                <Text
                  style={[
                    style.textPrimary,
                    tw`text-black text-base`,
                    { fontSize: 22 },
                  ]}
                >
                  {transfer.title}
                </Text>
                <Text style={[style.textPrimary, tw`text-black text-base`]}>
                  {transfer.amount} ASC
                </Text>
              </View>
            </View>
            <Text
              style={[
                style.textPrimary,
                tw`w-full text-left ml-10 mt-4`,
                { color: "#5d5d5d" },
              ]}
            >
              Service
            </Text>
            <Text
              style={[
                style.textPrimary,
                tw`w-full text-left ml-10 text-black text-base`,
              ]}
            >
              {transfer.type}
            </Text>

            <Text
              style={[
                style.textPrimary,
                tw`w-full text-left ml-10 mt-4`,
                { color: "#5d5d5d" },
              ]}
            >
              Date and time
            </Text>
            <Text
              style={[
                style.textPrimary,
                tw`w-full text-left ml-10 text-black text-base`,
              ]}
            >
              {parseData(transfer.date)}
            </Text>

            <Text
              style={[
                style.textPrimary,
                tw`w-full text-left ml-10 mt-4`,
                { color: "#5d5d5d" },
              ]}
            >
              Receiver's name
            </Text>
            <Text
              style={[
                style.textPrimary,
                tw`w-full text-left ml-10 text-black text-base`,
              ]}
            >
              {transfer.fio}
            </Text>

            <Text
              style={[
                style.textPrimary,
                tw`w-full text-left ml-10 mt-4`,
                { color: "#5d5d5d" },
              ]}
            >
              Receiver's wallet
            </Text>
            <Text
              style={[
                style.textPrimary,
                tw`w-full text-left ml-10 text-black text-base`,
              ]}
            >
              {transfer.wallet_to}
            </Text>

            <Text
              style={[
                style.textPrimary,
                tw`w-full text-left ml-10 mt-4`,
                { color: "#5d5d5d" },
              ]}
            >
              Comment
            </Text>
            <Text
              style={[
                style.textPrimary,
                tw`w-full text-left ml-10 text-black text-base`,
              ]}
            >
              {transfer.comment}
            </Text>

            <Text
              style={[
                style.textPrimary,
                tw`w-full text-left ml-10 mt-4`,
                { color: "#5d5d5d" },
              ]}
            >
              Status
            </Text>
            <Text
              style={[
                style.textPrimary,
                tw`w-full text-left ml-10 text-black text-base ${
                  transfer.status === "failed"
                    ? "text-red-500"
                    : "text-green-500"
                }`,
              ]}
            >
              {transfer.status}
            </Text>
          </View>
        </Modalize>
      </SafeAreaView>
    </ScrollView>
  );
};

export default Home;
