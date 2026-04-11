import { useEffect, useState } from "react";
import { Image, TouchableOpacity, View } from "react-native";

export default function VideoPreview({ numero = 0, datosBD = [], onPress, onSuscribir }) {

  const [thumbnail, setThumbnail] = useState(null);

  // ✅ SIEMPRE definido
  const url = datosBD?.[numero];

  useEffect(() => {
    if (!url) return;

    const match = url.match(/(?:v=|shorts\/|youtu\.be\/)([0-9A-Za-z_-]{11})/);
    const videoId = match ? match[1] : null;

    if (videoId) {
      setThumbnail(`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`);
    }
  }, [url]);

  // ✅ después de hooks
  if (!url) return null;

  return (
    <View style={{width:"100%",height:500, flexDirection:"column", paddingTop:"2%", backgroundColor:"red"}}>  
      <TouchableOpacity
        style={{ width: "100%", height: "100%" }}
        onPress={() => {
          onPress && onPress(url);
          onSuscribir && onSuscribir();
        }}
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
