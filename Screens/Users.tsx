import {
  SafeAreaView,
  FlatList,
  View,
  TextInput,
  Image,
  Text,
  TouchableOpacity,
  Dimensions,
  BackHandler,
} from "react-native";
import React, { useState, useEffect, useRef } from "react";
import tw from "twrnc";
import { Modalize } from "react-native-modalize";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Clipboard from "expo-clipboard";
import Toast from "react-native-root-toast";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import Modal from "react-native-modal";
import QRCode from "react-native-qrcode-svg";

import Footer from "../Components/Footer";
import api from "../api";
import style from "../style";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [user, setUser]: any = useState("");
  const [modal, setModal] = useState(false);
  const [imageModal, setImageModal] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [message, setMessage] = useState("");
  const [name, setName] = useState("Connect");

  const navigation = useNavigation();
  const dispatch = useDispatch();

  const state = useSelector((state: any) => state);

  const { token } = state.reducer;

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

  useEffect(() => {
    if (walletAddress.length == 32) {
      checkWallet();
    }
    if (walletAddress.length == 0) {
      setName("Connect");
    }
  }, [walletAddress]);

  const handleBackButton = () => {
    navigation.navigate("Main" as never);
    dispatch({ type: "SET_ROUTE", payload: "home" });
    return true;
  };

  const _handleModal = () => {
    setModal(!modal);
  };

  const _handleImageModal = () => {
    setImageModal(!imageModal);
  };

  useEffect(() => {
    return () => {
      BackHandler.removeEventListener("hardwareBackPress", handleBackButton);
    };
  }, []);

  const ref = useRef<Modalize>(null);
  const sendModalRef = useRef<Modalize>(null);

  const height = Dimensions.get("window").height;
  const width = Dimensions.get("window").width;

  const handleModal = () => {
    ref.current?.open();
  };

  useEffect(() => {
    try {
      AsyncStorage.getItem("token").then((token) => {
        api
          .get("/users", {
            headers: { Authorization: `Bearer ${token}` },
          })
          .then((res) => {
            const users = Object.values(res.data);
            const searchUsers = users.filter((user: any) => {
              return (
                user.name.toLowerCase().includes(search.toLowerCase()) ||
                user.last_name.toLowerCase().includes(search.toLowerCase()) ||
                user.qwasar.toLowerCase().includes(search.toLowerCase())
              );
            });
            setUsers(searchUsers);
          });
      });
    } catch (error) {
      console.log(error);
    }
  }, [search]);

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

  return (
    <SafeAreaView
      style={[
        tw`
        flex-1 w-full h-full flex flex-col items-center`,
        {
          backgroundColor: "#f1f1f1",
        },
      ]}
    >
      <View
        style={tw`
        bg-white w-11/12 h-10 flex flex-row justify-start items-center rounded-xl pl-2
      `}
      >
        <Image
          source={require("../assets/search-normal.png")}
          style={tw`h-5 w-5 mr-2`}
        />
        <TextInput
          placeholder="Search"
          placeholderTextColor={"#8c8c8c"}
          style={[
            tw`h-11 text-black w-full`,
            {
              fontFamily: "FredokaLight",
            },
          ]}
          value={search}
          onChangeText={(text) => setSearch(text)}
        />
      </View>
      <FlatList
        data={users}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={tw`
            bg-white w-full h-14 flex flex-row justify-start items-center rounded-xl pl-2 my-2 self-center
          `}
            onPress={() => {
              handleModal();
              setUser(item);
            }}
          >
            <Image
              source={
                item.photo
                  ? { uri: "https://api.astrocoin.uz" + item.photo }
                  : require("../assets/profile-circle.png")
              }
              style={tw`h-12 w-12 rounded-full mr-2`}
            />
            <View>
              <Text style={[{ fontFamily: "FredokaMedium" }]}>{item.name}</Text>
              <Text
                style={{
                  fontFamily: "FredokaLight",
                  color: "#8c8c8c",
                  marginTop: 2,
                }}
              >
                {item.balance}
              </Text>
            </View>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id}
        style={tw`w-11/12 h-4/5 flex-grow-0 p-2`}
      />
      <Footer />
      <Modalize
        ref={ref}
        snapPoint={height * 0.8}
        modalHeight={height * 0.8}
        modalStyle={{
          backgroundColor: "#f1f1f1",
        }}
      >
        <View style={tw`flex flex-col justify-center items-center`}>
          {user.photo ? (
            <TouchableOpacity onPress={_handleImageModal}>
              <Image
                source={{ uri: "https://api.astrocoin.uz" + user.photo }}
                style={tw`w-56 h-56 rounded-full my-2`}
              />
            </TouchableOpacity>
          ) : (
            <Image
              source={require("../assets/profile-circle.png")}
              style={tw`w-56 h-56 rounded-full my-2`}
            />
          )}

          <TouchableOpacity
            style={tw`
            bg-white w-11/12 h-14 flex flex-row justify-start items-center rounded-xl pl-2 my-2 self-center
          `}
            onPress={() => {
              setWalletAddress(user.wallet);

              sendModalRef.current?.open();
              ref.current?.close();
            }}
          >
            <Image
              source={require("../assets/arrow-up-gray.png")}
              style={tw`w-12 h-12 mr-2`}
            />
            <Text
              style={{
                fontFamily: "FredokaLight",
                color: "#8c8c8c",
                fontSize: 22,
              }}
            >
              Send
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={tw`
            bg-white w-11/12 h-14 flex flex-row justify-start items-center rounded-t-xl pl-2  self-center
          `}
          >
            <Image
              source={require("../assets/dollar.png")}
              style={tw`w-12 h-12 mr-2`}
            />
            <Text
              style={{
                fontFamily: "FredokaLight",
                color: "#8c8c8c",
                fontSize: 22,
              }}
            >
              {user.balance} ASC
            </Text>
          </TouchableOpacity>
          <View
            style={[
              tw`w-11/12 bg-gray-400`,
              {
                height: 1,
              },
            ]}
          />
          <TouchableOpacity
            style={tw`
            bg-white w-11/12 h-14 flex flex-row justify-start items-center pl-2  self-center
          `}
            onPress={() => {
              Clipboard.getStringAsync(user.qwasar);
              Toast.show("Username copied", {
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
              source={require("../assets/security-user.png")}
              style={tw`w-12 h-12 mr-2`}
            />
            <Text
              style={{
                fontFamily: "FredokaLight",
                color: "#8c8c8c",
                fontSize: 22,
              }}
            >
              {user.qwasar}
            </Text>
          </TouchableOpacity>
          <View
            style={[
              tw`w-11/12 bg-gray-400`,
              {
                height: 1,
              },
            ]}
          />
          <TouchableOpacity
            style={tw`
            bg-white w-11/12 h-14 flex flex-row justify-start rounded-b-xl items-center pl-2  self-center
          `}
            onPress={() => {
              _handleModal();
            }}
            onLongPress={async () => {
              await Clipboard.setStringAsync(user.wallet);
              Toast.show("User wallet copied", {
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
              source={require("../assets/empty-wallet-gray.png")}
              style={tw`w-12 h-12 mr-2`}
            />

            <Text
              style={{
                fontFamily: "FredokaLight",
                color: "#8c8c8c",
                fontSize: 18,
              }}
            >
              {user.wallet}
            </Text>
          </TouchableOpacity>
        </View>
      </Modalize>
      <Modal
        isVisible={modal}
        hasBackdrop={true}
        onBackdropPress={() => {
          _handleModal();
        }}
      >
        <View style={tw`flex flex-col justify-center items-center`}>
          <View
            style={[
              tw`p-5 bg-white rounded-xl mb-8`,
              {
                width: width * 0.8,
                height: width * 0.8,
                marginLeft: width * 0.1,
                marginRight: width * 0.1,
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
        </View>
      </Modal>
      <Modal
        isVisible={imageModal}
        hasBackdrop={true}
        onBackdropPress={() => {
          _handleImageModal();
        }}
      >
        <View style={tw`flex flex-col justify-center items-center`}>
          <Image
            source={{ uri: "https://api.astrocoin.uz" + user.photo }}
            style={{
              width: width * 0.97,
              height: width * 0.97,
              borderRadius: 10,
            }}
          />
        </View>
      </Modal>

      {/* send modal */}
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
    </SafeAreaView>
  );
};

export default Users;
