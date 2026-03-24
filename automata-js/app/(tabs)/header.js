

import { Image, StyleSheet, View } from "react-native";

export default function BarraSuperior() {
  return (
      <View style={styles.barra}>
          <Image
            source={require("../../imgs/logo app.png")}
            style={{width: "100%", aspectRatio: 7,
          }}
            resizeMode="cover"
          />

      </View>
  );
}

const styles = StyleSheet.create({

  barra: {
    width: "100%",
    height: "100%",
    flexDirection: "row",
    marginTop: "10%",
    backgroundColor:"gold"
  },
});