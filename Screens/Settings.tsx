import {
  View,
  Text,
  SafeAreaView,
  Image,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import React, { useState, useEffect, useRef } from "react";
import Footer from "../Components/Footer";
import tw from "twrnc";
import { useSelector } from "react-redux";
import * as Linking from "expo-linking";
import * as Clipboard from "expo-clipboard";
import Toast from "react-native-root-toast";
import * as ImagePicker from "expo-image-picker";
import { Modalize } from "react-native-modalize";
import api from "../api";

const Settings = () => {
  const [imgSuccess, setImgSuccess] = useState("");
  const state = useSelector((state: any) => state);
  const { user, token } = state.reducer;

  const ref = useRef<Modalize>(null);

  const handleRef = (ref: any) => {
    ref.current?.open();
  };

  const width = Dimensions.get("window").width;

  const [image, setImage]: any = useState();

  const pickImage = async () => {
    let result: any = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
    });

    console.log("result: \n" + JSON.stringify(result));

    if (!result.cancelled) {
      setImage(result.uri);
    }
  };

  const uploadImage = async () => {
    const formData: any = new FormData();
    formData.append("photo", {
      uri: image,
      name: "image.jpg",
      type: "image/jpg",
    });

    const response = await api.post("/user/photo", formData, {
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "multipart/form-data",
      },
    });

    console.log("response: \n" + JSON.stringify(response));

  }


  useEffect(() => {
      if (image) {
        uploadImage();
    }
    console.log("image: \n" + JSON.stringify(user.photo));
  }, [image]);

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
      {user.photo ? (
        <TouchableOpacity
          onPress={() => {
            pickImage();
          }}
        >
          <Image
            source={{ uri: "https://api.astrocoin.uz/" + user.photo }}
            style={{
              width: width * 0.4,
              height: width * 0.4,
              borderRadius: 999,
              marginTop: 5,
              marginBottom: 5,
            }}
          />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity onPress={() => pickImage()}>
          <Image source={require("../assets/profile-circle.png")} />
        </TouchableOpacity>
      )}

      {user.status !== "verified" ? (
        <View
          style={tw`
          flex w-10/12 h-10 mb-2 bg-white rounded-xl justify-start items-center flex-row
        `}
        >
          <Image
            source={require("../assets/send-sqaure-2.png")}
            style={{
              width: 30,
              height: 30,
              marginRight: 10,
              marginLeft: 10,
            }}
          />
          <Text
            style={[
              tw`text-center text-gray-600 text-base text-red-500`,
              {
                fontFamily: "FredokaLight",
              },
            ]}
          >
            Your account is blocked
          </Text>
        </View>
      ) : null}

      <TouchableOpacity
        style={tw`
          flex w-10/12 h-10 bg-white rounded-xl my-1 justify-start items-center flex-row
        `}
        onPress={() => {
          Linking.openURL("https://www.astrocoin.uz/ranks");
        }}
      >
        <Image
          source={require("../assets/send-sqaure-2.png")}
          style={{
            width: 30,
            height: 30,
            marginRight: 10,
            marginLeft: 10,
          }}
        />
        <Text
          style={[
            tw`text-center text-gray-600 text-base`,
            {
              fontFamily: "FredokaLight",
            },
          ]}
        >
          Student Ranks
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={tw`
          flex w-10/12 h-10 bg-white rounded-xl my-1 justify-start items-center flex-row
        `}
        onPress={() => {
          Linking.openURL("https://store.astrocoin.uz/");
        }}
      >
        <Image
          source={require("../assets/shop.png")}
          style={{
            width: 30,
            height: 30,
            marginRight: 10,
            marginLeft: 10,
          }}
        />
        <Text
          style={[
            tw`text-center text-gray-600 text-base`,
            {
              fontFamily: "FredokaLight",
            },
          ]}
        >
          Astrum Store
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={tw`
          flex w-10/12 h-10 bg-white rounded-t-xl mt-1 justify-start items-center flex-row
        `}
        onPress={async () => {
          await Clipboard.setStringAsync(user.qwasar);
          Toast.show("Qwasar copied to clipboard", {
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
          style={{
            width: 30,
            height: 30,
            marginRight: 10,
            marginLeft: 10,
          }}
        />
        <Text
          style={[
            tw`text-center text-gray-600 text-base`,
            {
              fontFamily: "FredokaLight",
            },
          ]}
        >
          {user.qwasar}
        </Text>
      </TouchableOpacity>
      <View
        style={[
          tw`
          w-10/12 bg-gray-300`,
          {
            height: 1,
          },
        ]}
      />
      <TouchableOpacity
        style={tw`
          flex w-10/12 h-10 bg-white justify-start items-center flex-row
        `}
      >
        <Image
          source={require("../assets/teacher.png")}
          style={{
            width: 30,
            height: 30,
            marginRight: 10,
            marginLeft: 10,
          }}
        />
        <Text
          style={[
            tw`text-center text-gray-600 text-base`,
            {
              fontFamily: "FredokaLight",
            },
          ]}
        >
          {user.stack}
        </Text>
      </TouchableOpacity>
      <View
        style={[
          tw`
          w-10/12 bg-gray-300`,
          {
            height: 1,
          },
        ]}
      />
      <TouchableOpacity
        style={tw`
          flex w-10/12 h-10 bg-white rounded-b-xl justify-start items-center flex-row
        `}
        onPress={async () => {
          await Clipboard.setStringAsync(user.wallet);
          Toast.show("Wallet copied to clipboard", {
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
          style={{
            width: 30,
            height: 30,
            marginRight: 10,
            marginLeft: 10,
          }}
        />
        <Text
          style={[
            tw`text-center text-gray-600 text-base`,
            {
              fontFamily: "FredokaLight",
            },
          ]}
        >
          {user.wallet}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={tw`
          flex w-10/12 h-10 bg-white rounded-t-xl mt-4 justify-start items-center flex-row
        `}
        onPress={async () => {
          Linking.openURL("https://astrocoin.uz/update-password");
        }}
      >
        <Image
          source={require("../assets/key-square.png")}
          style={{
            width: 30,
            height: 30,
            marginRight: 10,
            marginLeft: 10,
          }}
        />
        <Text
          style={[
            tw`text-center text-gray-600 text-base`,
            {
              fontFamily: "FredokaLight",
            },
          ]}
        >
          Change password
        </Text>
      </TouchableOpacity>
      <View
        style={[
          tw`
          w-10/12 bg-gray-300`,
          {
            height: 1,
          },
        ]}
      />
      <TouchableOpacity
        style={tw`
          flex w-10/12 h-10 bg-white rounded-b-xl justify-start items-center flex-row
        `}
        onPress={async () => {}}
      >
        <Image
          source={require("../assets/lock.png")}
          style={{
            width: 30,
            height: 30,
            marginRight: 10,
            marginLeft: 10,
          }}
        />
        <Text
          style={[
            tw`text-center text-gray-600 text-base`,
            {
              fontFamily: "FredokaLight",
            },
          ]}
        >
          App Password
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={tw`
          flex w-10/12 h-10 bg-white rounded-xl mt-4 justify-start items-center flex-row
        `}
        onPress={() => {}}
      >
        <Image
          source={require("../assets/logout.png")}
          style={{
            width: 30,
            height: 30,
            marginRight: 10,
            marginLeft: 10,
          }}
        />
        <Text
          style={[
            tw`text-center text-gray-600 text-base text-red-600`,
            {
              fontFamily: "FredokaLight",
            },
          ]}
        >
          App Password
        </Text>
      </TouchableOpacity>

      {/* change password */}
      <Modalize
        ref={ref}
        snapPoint={width * 0.6}
        modalStyle={{
          backgroundColor: "#efefef",
          borderRadius: 10,
          padding: 20,
        }}
      >
        <Text>Hello world</Text>
      </Modalize>
      <Footer />
    </SafeAreaView>
  );
};

export default Settings;
