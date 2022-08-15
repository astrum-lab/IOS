import {
  View,
  Text,
  TouchableOpacity,
} from "react-native";
import React from "react";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import tw from "twrnc";

// Components
import Transfers from "./InfinityScroll/Transfers";
import Orders from "./InfinityScroll/Orders";

export default function Tabs({ show }) {
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: "first", title: "Transfers" },
    { key: "second", title: "Orders" },
  ]);

  return (
    <View
      style={[
        tw`w-11/12 rounded-3xl mt-4 bg-white`,
        {
          height: "55%",
        },
      ]}
    >
      <TabView
        navigationState={{ index, routes }}
        renderScene={SceneMap({
          first: () => <Transfers show={show} />,
          second: Orders,
        })}
        style={tw`rounded-3xl h-full w-full`}
        onIndexChange={setIndex}
        renderTabBar={(props: any) => {
          return (
            <TabBar
              style={tw`bg-white rounded-t-3xl`}
              {...props}
              indicatorStyle={{
                height: 1,
                backgroundColor: "#5733d1",
              }}
              renderLabel={({ route, focused }) => (
                <>
                  <TouchableOpacity onPress={() => setIndex(0)}>
                    <Text
                      style={[
                        tw`text-lg`,
                        {
                          fontFamily: "FredokaLight",
                          color: focused ? "#5733d1" : "#ccc",
                        },
                      ]}
                    >
                      {route.title}
                    </Text>
                  </TouchableOpacity>
                </>
              )}
            />
          );
        }}
      />
    </View>
  );
}
