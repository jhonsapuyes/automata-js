import { Image, TouchableOpacity, View } from "react-native";

export default function VideoPreview({ numero = 0, datosBD = [], onPress, onSuscribir }) {

  if (!datosBD.length || !datosBD[numero]) return null;

  const url = datosBD[numero];
  const videoId =  url.split("/")[3]?.split("?")[0];
  const thumbnail = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
  console.log(url,numero,"vp")

  return (
    <View style={{width:"100%",height:600, margin:0, padding:0, flexDirection: "column", paddingTop:"2%",backgroundColor:"red"}}>  
        <TouchableOpacity
        style={{ width: "100%", height: "100%" }}
        onPress={() => {onPress && onPress(url); onSuscribir && onSuscribir(); }}
        >
        <Image
            source={{ uri: thumbnail }}
            style={{ width: "100%", height: "100%" }}
            resizeMode="cover"
        />
        </TouchableOpacity>
    </View>
  );
}
