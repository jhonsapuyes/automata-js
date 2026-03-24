
// CODIGO DEL BOT DE AUTOMATIZACION DE VISTAS DE YOUTUBE



import { useEffect, useRef, useState } from "react";
import { Modal, Text, TouchableOpacity, View } from "react-native";
import { WebView } from "react-native-webview";

export default function LoginWebViewModal({ visible, onClose, url }) {

  const SEGUNDOS_OBLIGATORIOS = 21;

  const [contador, setContador] = useState(SEGUNDOS_OBLIGATORIOS);
  const [bloqueado, setBloqueado] = useState(true);

  const timerRef = useRef(null);

  const iniciarContador = () => {

    clearInterval(timerRef.current);

    if(url == "https://www.youtube.com/"){
        setBloqueado(false);
    }
    else{
        setBloqueado(true);
    }
    setContador(SEGUNDOS_OBLIGATORIOS);

    timerRef.current = setInterval(() => {

      setContador((prev) => {

        if (prev <= 1) {
          clearInterval(timerRef.current);
          setBloqueado(false);
          return 0;
        }

        return prev - 1;
      });

    }, 1000);
  };

  useEffect(() => {

    if (visible) {
      iniciarContador();
    }

    return () => clearInterval(timerRef.current);

  }, [visible]);

  // Nuevo useEffect para llamar a onClose cuando el contador llega a 0 y no está bloqueado
  useEffect(() => {
    if (visible && contador === 0 && !bloqueado) {
      onClose();
    }
  }, [contador, visible, bloqueado, onClose]);

  return (
    <Modal
      visible={visible}
      animationType="slide"
    >
      <View style={{ flex: 1,}}>

        <View style={{ padding: 10, flexDirection: "row", justifyContent: "space-between" }}>

          <TouchableOpacity
            disabled={bloqueado}
            onPress={onClose}
          >
            <Text style={{ fontSize: 18, opacity: bloqueado ? 0.5 : 1 }}>
              Cerrar
            </Text>
          </TouchableOpacity>

          {bloqueado && (
            <Text style={{ fontSize: 16 }}>
              Espera {contador}s
            </Text>
          )}

        </View>

        <View style={{ flex: 1 }}>

          <View
            style={{
              width: "100%",
              height:40,
              position: "absolute",
              top: 4,
              //right: 20,
              backgroundColor: "rgba(0, 0, 0, 0.95)",
              padding: 10,
              borderRadius: 8,
              zIndex: 10
            }}
          >
          </View>

          <WebView
              source={{ uri: url }}
              javaScriptEnabled
              domStorageEnabled
              sharedCookiesEnabled
              thirdPartyCookiesEnabled
              startInLoadingState
              style={{ flex: 1}}

              // reinicia contador cuando cambia la URL
              onNavigationStateChange={() => iniciarContador()}
            />

        </View>

      </View>
    </Modal>
  );
}