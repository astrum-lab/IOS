import { View, Image } from "react-native";
import React from "react";

const Header = (props: any) => {
  return (
    <View
      style={{
        width: "100%",
        justifyContent: "flex-start",
      }}
    >
      <Image
        source={require("../assets/wallet.png")}
        style={{
          width: 113,
          height: 27,
          marginLeft: 20,
          marginTop: -15,
        }}
      />
    </View>
  );
};

export default Header;
