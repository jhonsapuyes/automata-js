
// CODIGO DEL BOT DE AUTOMATIZACION DE VISTAS DE YOUTUBE con login

import { useEffect, useRef, useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import LoginWebViewModal from "../components/LoginWebViewModal.js";
import VideoPreview from "../components/videoPreview.js";
import BarraSuperior from "./header.js";

import { listarVideos, postVideo } from '../../services/functions/modulo1.js';

import BotonesAccion from "../components/btnHandle.js";

import AgregarCampania from "./agregarPublicidad.js";


export default function HomeScreen() {

  const [isLoggedIn, setIsLoggedIn] = useState(true); // Estado para controlar el login
  const [modalLogin, setModalLogin] = useState(false);
  const [urlWebview, setUrlWebview] = useState("https://www.youtube.com/");
  const [datos, setDatos] = useState([]);
  const [numero, setNumero] = useState(0);
  const [suscribirbtn, setSuscribirbtn] = useState(false);

  const [ojo, setOjo] = useState(require("../../imgs/ojo roja.jpeg"));
  const [bocina, setBocina] = useState(require("../../imgs/bocina gris.jpeg"));
  const [btnuse, setBtnuse] = useState(false);
  const [webviewKey, setWebviewKey] = useState(0);

  const AUTOMATION_DURATION_MINUTES = 1;
  const AUTOMATION_DURATION_MS = AUTOMATION_DURATION_MINUTES * 60 * 1000;
  const [isAutomating, setIsAutomating] = useState(false);
  const [remainingTime, setRemainingTime] = useState(AUTOMATION_DURATION_MS);
  const automationTimeoutRef = useRef(null);
  const countdownIntervalRef = useRef(null);
  const videoIntervalRef = useRef(null);


  useEffect(() => {
    if (isLoggedIn) {
      cargarDatos();
    }
  }, [isLoggedIn]);
  const cargarDatos = async () => {
    let datos= await listarVideos();
    let dataUrls = datos.map(item => item.urlVideo);
    setDatos(dataUrls);   
    console.log(datos.length,"index") 
    console.log(datos,"index") 

  };

  const abrirVideo = (url,suscribir) => {
    setUrlWebview(url);
    setWebviewKey(prev => prev + 1);
    setModalLogin(true);

    if(suscribir == false){
      setNumero(prev =>
        prev === 0 ? datos.length - 1 : prev - 1
      );
    }
  };
  const handleModalClose= () =>{
    setModalLogin(false);
  }


  const iniciarAutomatizacion = () => {
    if (!datos || datos.length === 0) return;
    let index = numero;
    // 🔥 abrir primer video
    abrirVideo(datos[index]);
    // 🔁 cambiar videos cada X tiempo
    videoIntervalRef.current = setInterval(() => {
      index = (index + 1) % datos.length;
      abrirVideo(datos[index]);
    }, 12000); // ⏱ cambia cada 10 segundos (ajústalo)

    // ⏳ contador regresivo
    countdownIntervalRef.current = setInterval(() => {
      setRemainingTime(prevTime => {
        if (prevTime <= 1000) {
          detenerAutomatizacion();
          return 0;
        }
        return prevTime - 1000;
      });
    }, 1000);

    // ⏱ tiempo total de automatización
    automationTimeoutRef.current = setTimeout(() => {
      detenerAutomatizacion();
      alert(`Automatización detenida después de ${AUTOMATION_DURATION_MINUTES} minutos.`);
    }, AUTOMATION_DURATION_MS);
  };
  const detenerAutomatizacion = () => {
    setIsAutomating(false);
    setModalLogin(false);

    if (automationTimeoutRef.current) {
      clearTimeout(automationTimeoutRef.current);
      automationTimeoutRef.current = null;
    }

    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
      countdownIntervalRef.current = null;
    }

    if (videoIntervalRef.current) {
      clearInterval(videoIntervalRef.current);
      videoIntervalRef.current = null;
    }

    setRemainingTime(AUTOMATION_DURATION_MS);
  };
  const toggleAutomation = () => {
    setIsAutomating(prev => {
      const newState = !prev;

      if (newState) {
        setRemainingTime(AUTOMATION_DURATION_MS);
        iniciarAutomatizacion();
      } else {
        detenerAutomatizacion();
      }

      return newState;
    });
  };
  const formatTime = (ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };
  useEffect(() => {
    return () => {
      if (automationTimeoutRef.current) clearTimeout(automationTimeoutRef.current);
      if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
    };
  }, []);

  const cambiarImagen = (used) => {
    setBtnuse(used);

    function resetState() {
      setBocina(require("../../imgs/bocina gris.jpeg"));
      setOjo(require("../../imgs/ojo gris.jpeg"));
    }

    switch (used) {
      case true:
        resetState();
        setBocina(require("../../imgs/bocina roja.jpeg"));
        break;
      case false:
        resetState();
        setOjo(require("../../imgs/ojo roja.jpeg"));
        break;
    }
  };
  const agregarPubli = (datoIn) => {
    //console.log(datoIn)
    postVideo(datoIn);
  };
  
  return (
    <View style={styles.container}>
      <View>
        <LoginWebViewModal 
          key={webviewKey} // 🔥 IMPORTANTE
          visible={modalLogin}
          url={urlWebview}
          onClose={handleModalClose}
          suscribirbtn={suscribirbtn}
        />
      </View>

      <View style={styles.header}>
        <BarraSuperior />
      </View>

      
      {(btnuse == false) ? <VideoPreview 
      numero={numero} 
      datosBD={datos} 
      onPress={(url) => abrirVideo(url,false)} 
      onSuscribir={() => setSuscribirbtn(false)}
      /> : null}

      <View>
        <BotonesAccion
          btnuse={btnuse}
          datos={datos}
          numero={numero}
          onAbrirVideo={(url) => abrirVideo(url,true)}
          onCambiarNumero={(nuevo) => setNumero(nuevo)}
          onSuscribir={() => setSuscribirbtn(true)}
        />
      </View>

      <View>
        {(btnuse == false) ? 
          <TouchableOpacity
          style={{marginVertical:"1%",backgroundColor:"#6eb4bcfd",paddingHorizontal:"2%",justifyContent: 'center',alignItems: 'center',borderRadius: 10}}
          onPress={toggleAutomation}
          >
            <Text style={{fontSize:20,color:"white", fontWeight:"bold",}}>
              {isAutomating ? "Detener Automatización" : "Iniciar Automatización"}
            </Text>
          </TouchableOpacity>
        : null}
        {isAutomating && (
          <Text style={styles.countdownText}>Tiempo restante: {formatTime(remainingTime)} {isAutomating}</Text>
        )}
      </View>

      <View style={styles.imageButtonsContainer} >
        <View style={styles.imageButtonWrapper}> 
          <TouchableOpacity  onPress={() => cambiarImagen(false)}>                                                                     
          <Image
            source={ojo}
            style={styles.imageButton}
            resizeMode="contain"
          />
          </TouchableOpacity>
        </View>

        <View style={styles.imageButtonWrapper}> 
          <TouchableOpacity  onPress={() => cambiarImagen(true)}>                                                                     
          <Image
            source={bocina}
            style={styles.imageButton}
            resizeMode="contain"
          />
          </TouchableOpacity>
        </View>
      </View>

      {(btnuse == true) ? <AgregarCampania onAgregar={agregarPubli} /> : null}



      <View style={styles.footer}></View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    height: "100%"
  },
  header: {
    backgroundColor: "red",
    width: "100%",
    height: 100
  },
  countdownText: {
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 10,
    color: "blue",
  },
  imageButtonsContainer: {
    flexDirection: 'row',
    margin: 0
  },
  imageButtonWrapper: {
    width: 70,
    height: 70,
    margin: 4
  },
  imageButton: {
    width: "100%",
    height: "100%",
  },
  footer: {
    position: "absolute",
    bottom: 0,
    backgroundColor: "red",
    height: 45,
    width: "100%"
  }
});