

import { Image, StyleSheet, TouchableOpacity, View } from "react-native";

export default function BarraSuperior({ onClose }) {
  return (
      <View style={styles.barra}>

        <TouchableOpacity 
          style={{ backgroundColor: "red", width: "20%"}} 
          onPress={onClose}
          activeOpacity={0.7}
        >
          <Image
            source={require("../../imgs/shutdown.png")}
            style={{width: "100%",height:"57%"}}
            resizeMode="contain"
          />
        </TouchableOpacity>

          <Image
            source={require("../../imgs/logo app.png")}
            style={{width: "80%", aspectRatio: 7,
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