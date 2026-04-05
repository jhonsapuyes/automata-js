import { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";

export default function AgregarCampania({ onAgregar }) {

  const [nombre, setNombre] = useState("");

  const agregar = () => {
    if (!nombre.trim()) return;

    if (typeof onAgregar === "function") {
      onAgregar(nombre);
    }

    setNombre("");
  };

  return (
    <View  style={{backgroundColor:"red",width:"100%", height:"69%", paddingTop:"2%"}}>
      
      <View style={{backgroundColor: "#ffffff"}}>
        <View style={{padding: 0,backgroundColor: "#8271711e",margin: 0,alignItems: "center",borderRadius: 20}}>
          
          <TextInput
            placeholder="Nombre de la campaña"
            value={nombre}
            onChangeText={setNombre}
            style={{width:"90%",textAlign: "center",borderWidth: 2,borderColor: "red",borderRadius: 8,padding: 10,marginVertical: 14,}}
          />

          <TouchableOpacity
            onPress={agregar}
            style={{width:"40%",backgroundColor: "red",padding: 12,borderRadius: 8,alignItems: "center",marginBottom:"3%"}}
          >
            <Text style={{ color: "#fff", fontWeight: "bold" }}>
              Agregar campaña
            </Text>
          </TouchableOpacity>

        </View>
      </View>

      <View style={{backgroundColor:"red",width:"100%", height:"86%", padding:5}}></View>

    </View>
  );
}