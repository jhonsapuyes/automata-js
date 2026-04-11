

import { useEffect, useRef, useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import LoginWebViewModal from "../components/LoginWebViewModal.js";
import VideoPreview from "../components/videoPreview.js";
import BarraSuperior from "./header.js";
import LoginScreen from "./loginApp.js"; // Importar el nuevo componente

import { syncSupaToLiteVideos } from '../../services/synchronize/getVideo.js';
import { obtenerVideos } from '../../services/synchronize/listarVideo.js';
import { syncLiteToSupabase } from '../../services/synchronize/postDatos.js';
import { guardarVideoSupa } from '../../services/synchronize/postVideo.js';

import BotonesAccion from "../components/btnHandle.js";

import AsyncStorage from "@react-native-async-storage/async-storage";
import AgregarCampania from "./agregarPublicidad.js";

import { loginUser } from '../../services/functions/modulo1.js';
import { actualizarDataUser } from '../../services/synchronize/ctrl_user.js';


export default function HomeScreen() {

  const [userD, setUserD] = useState([]); // Estado para controlar el login
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Estado para controlar el login
  const [modalLogin, setModalLogin] = useState(false);
  const [urlWebview, setUrlWebview] = useState("https://www.youtube.com/");
  const [datos, setDatos] = useState([]);
  const [numero, setNumero] = useState(0);
  const [suscribirbtn, setSuscribirbtn] = useState(false);

  const [ojo, setOjo] = useState(require("../../imgs/ojo roja.jpeg"));
  const [bocina, setBocina] = useState(require("../../imgs/bocina gris.jpeg"));
  const [btnuse, setBtnuse] = useState(false);
  const [webviewKey, setWebviewKey] = useState(0);

  const TIMEVISTAVIDEO = 15;

  const AUTOMATION_DURATION_MINUTES = 10;
  const AUTOMATION_DURATION_MS = AUTOMATION_DURATION_MINUTES * 60 * 1000;
  const [isAutomating, setIsAutomating] = useState(false);
  const [remainingTime, setRemainingTime] = useState(AUTOMATION_DURATION_MS);
  const automationTimeoutRef = useRef(null);
  const countdownIntervalRef = useRef(null);
  const videoIntervalRef = useRef(null);


  useEffect(() => {
    if (isLoggedIn) {
      cargarDatos();
      //guardarVideoSupa()
      sincronize_users()
      syncSupaToLiteVideos()
    }
  }, [isLoggedIn]);
  const cargarDatos = async () => {
    //let datos= await listarVideos();
    //let dataUrls = datos.map(item => item.urlVideo);
    let dataUrls = await obtenerVideos();
    console.log(dataUrls,"index")

    setDatos(dataUrls);   
  };
  const sincronize_users = async () => {
    syncLiteToSupabase()
  }

  

  const abrirVideo = (url,suscribir) => {
    setUrlWebview(url);
    setWebviewKey(prev => prev + 1);
    setModalLogin(true);

    if (!isAutomating && suscribir == false) {
      setNumero(prev =>
        prev === 0 ? datos.length - 1 : prev - 1
      );
    }
  };
  const handleModalClose= () =>{
    setModalLogin(false);
  }

  const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
  };
  const iniciarAutomatizacion = () => {
    if (!datos || datos.length === 0) return;
    let index = numero;
    // 🔥 abrir primer video
    abrirVideo(datos[index]);
    // 🔁 cambiar videos cada X tiempo
    videoIntervalRef.current = setInterval(async () => {
      index = (index + 1) % datos.length;
      setNumero(index); 
      abrirVideo(datos[index]);
    }, (TIMEVISTAVIDEO*1000)); // ⏱ cambia cada 10 segundos (ajústalo)

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
        cargarDatos()
        break;
    }
  };
  const agregarPubli = (datoIn) => {
    //postVideo(datoIn);
    guardarVideoSupa(datoIn)
  };


  const closeApp = async () => {
    let getUserD= await loginUser(userD[0],userD[1])
    let ptuser= getUserD[1];
    
    const idDeviceUse = await AsyncStorage.getItem('device_id');

    actualizarDataUser("desactivada",idDeviceUse,ptuser)
    
    setIsLoggedIn(false);
    setUserD([])
  }
  const handleLoginSuccess = async (data) => {
    setUserD(data)
    setIsLoggedIn(data[2]);
  };

  if (isLoggedIn == false) {
    return <LoginScreen onLoginSuccess={handleLoginSuccess} />;
  }
  
  return (
    <View style={styles.container}>
      <View>
        <LoginWebViewModal 
          key={webviewKey} // 🔥 IMPORTANTE
          visible={modalLogin}
          url={urlWebview}
          onClose={handleModalClose}
          suscribirbtn={suscribirbtn}
          timeV={TIMEVISTAVIDEO}
        />
      </View>

      <View style={styles.header}>
        <BarraSuperior onClose={() => closeApp()}/>
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

// codigo bueno
