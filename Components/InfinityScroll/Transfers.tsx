import { View, SectionList, Text, Image, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import tw from "twrnc";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch } from "react-redux";
import api from "../../api";

const Transfers = ({ show }) => {
  const [page, setPage] = useState(1);
  const [data, setData] = useState([]);
  const [userOnce, setUserOnce] = useState(true);
  const [user, setUser]: any = useState({});
  const dispatch = useDispatch();
  useEffect(() => {
    try {
      AsyncStorage.getItem("token").then((token) => {
        api
          .get(`/transfers?page=${page}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then((e) => {
            let array = [];
            Object.keys(e.data).map((key, i) => {
              return array.push({
                date: key,
                data: Object.values(e.data)[i],
              });
            });
            setData([...data, ...array]);
          });
      });
    } catch (error) {
      console.error("Error at getTransfers" + error.message);
    }
  }, [page]);

  useEffect(() => {
    if (userOnce) {
      try {
        AsyncStorage.getItem("user").then((user) => {
          setUser(JSON.parse(user));
        });
      } catch (error) {
        console.error("Error at getTransfers" + error.message);
      }
    }
    setUserOnce(false);
  }, []);

  const Date = ({ item }) => (
    <View
      style={[
        tw`h-5 w-full justify-center pl-4`,
        { backgroundColor: "#fff00" },
      ]}
    >
      <Text>{item.date}</Text>
    </View>
  );

  const Button = ({ item }) => {
    return (
      <TouchableOpacity
        style={[
          tw`h-14 w-11/12 my-4 flex flex-row justify-start items-center self-center rounded-xl`,
          {
            backgroundColor: "#efefef",
          },
        ]}
        onPress={() => {
          show(JSON.stringify(item));
        }}
      >
        <Image
          source={
            item.status === "failed"
              ? require("../../assets/warn.png")
              : item.wallet_to == user.wallet
              ? require("../../assets/import.png")
              : require("../../assets/export.png")
          }
          style={tw`h-12 w-12 mx-2`}
        />
        <View style={tw`flex flex-col -mt-2 items-start`}>
          <Text
            style={[
              tw`text-lg`,
              {
                fontFamily: "FredokaLight",
              },
            ]}
          >
            {item.title}
          </Text>
          <Text
            style={[
              tw`text-xs`,
              {
                fontFamily: "FredokaLight",
              },
            ]}
          >
            {item.amount}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={tw`w-full h-full bg-white`}>
      <SectionList
        sections={data}
        renderItem={({ item }) => <Button item={item} />}
        renderSectionHeader={({ section }) => <Date item={section} />}
        onEndReached={() => {
          setPage(page + 1);
        }}
        onEndReachedThreshold={0.5}
        stickySectionHeadersEnabled={false}
      />
    </View>
  );
};

export default Transfers;
