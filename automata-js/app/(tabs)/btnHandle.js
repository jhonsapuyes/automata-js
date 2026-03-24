import { Text, TouchableOpacity, View } from "react-native";

export default function BotonesAccion({
  btnuse = ["Suscribirse", true, true],
  datos = [],
  numero = 0,
  onAbrirVideo,
  onCambiarNumero
}) {

  return (
    
    <View
      style={{
        width: "100%",
        marginVertical: 24,
        flexDirection: "row",
        justifyContent: "center",
      }}
    >

      {/* BOTÓN SUSCRIBIRSE */}
      {btnuse[1] == "true"? (
        <TouchableOpacity
          style={{
            marginHorizontal: 7,
            borderColor: "red",
            borderWidth: 3,
            paddingHorizontal: 10,
            paddingVertical: 3,
            borderRadius: 10,
          }}
          onPress={() => onAbrirVideo && onAbrirVideo(datos[numero]?.[1])}
        >
          <Text style={{ fontSize: 27, color: "red" }}>
            {btnuse[0]}
          </Text>
        </TouchableOpacity>
      ):null}

      {/* BOTÓN SIGUIENTE */}
      {btnuse[2] == "true"? (
        <TouchableOpacity
          style={{
            marginHorizontal: 7,
            borderColor: "red",
            borderWidth: 3,
            paddingHorizontal: 10,
            paddingVertical: 3,
            borderRadius: 10,
          }}
          onPress={() => {
            if (!datos.length) return;

            const nuevo =
              numero === 0 ? datos.length - 1 : numero - 1;

            onCambiarNumero && onCambiarNumero(nuevo);
          }}
        >
          <Text style={{ fontSize: 27, color: "red" }}>
            Ver Siguiente
          </Text>
        </TouchableOpacity>
      ):null}

    </View>
  );
}