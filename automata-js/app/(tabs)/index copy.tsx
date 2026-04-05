
// CODIGO DEL BOT DE AUTOMATIZACION DE VISTAS DE YOUTUBE con login

import { useEffect, useRef, useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
//import { apiFetch } from "../../services/peticion_api.js";
//import { enviarDato } from "../../services/post_publicitar.js";
import AgregarCampania from "./agregarPublicidad.js";
import BarraSuperior from "./header.js";
//import LoginScreen from "./loginApp.js"; // Importar el nuevo componente
import LoginWebViewModal from "../components/LoginWebViewModal.js";
import VideoPreview from "../components/videoPreview.js";

import { iniciarDB, listarVideos, pedirDatos } from '../../services/functions/modulo1.js';


export default function HomeScreen() {

  useEffect(() => {
    iniciarDB();
    //loginUser("anderson","pass yt-1")
    //crearUsuario("usuario","password");
    //updateUser("ander","pass",1);
    //borrarUsuario(4); 
    pedirDatos();
    //publicarVideo("https://youtu.be/LCfUHUqXuJE?si=t_J1aDAmlahBhfin");
    //listarVideos();
    console.log("REFRESH", "index")
  }, []);

  const AUTOMATION_DURATION_MINUTES = 1;
  const AUTOMATION_DURATION_MS = AUTOMATION_DURATION_MINUTES * 60 * 1000;

  const [isLoggedIn, setIsLoggedIn] = useState(true); // Estado para controlar el login
  const [modalLogin, setModalLogin] = useState(false);
  const [urlWebview, setUrlWebview] = useState("https://www.youtube.com/");
  const [datos, setDatos] = useState([]);
  const [numero, setNumero] = useState(0);

  const [isAutomating, setIsAutomating] = useState(false);
  const [remainingTime, setRemainingTime] = useState(AUTOMATION_DURATION_MS);
  const automationTimeoutRef = useRef(null);
  const countdownIntervalRef = useRef(null);

  const [ojo, setOjo] = useState(require("../../imgs/ojo gris.jpeg"));
  const [bocina, setBocina] = useState(require("../../imgs/bocina gris.jpeg"));
  const [estrella, setEstrella] = useState(require("../../imgs/estrella gris.jpeg"));
  const [mano, setMano] = useState(require("../../imgs/mano gris.jpeg"));
  const [suscrito, setSuscrito] = useState(require("../../imgs/suscrito gris.jpeg"));
  const [btnuse, setBtnuse] = useState(["Suscribirse","true","true","true","false"]);

  useEffect(() => {
    if (isLoggedIn) {
      cargarDatos();
    }
  }, [isLoggedIn]);

  const cargarDatos = async () => {
    let datos= await listarVideos();
    let dataUrls = datos.map(item => item.urlVideo);
    setDatos(dataUrls);    
  };

  //const publicidad = async (ptr1) => {
  //  const respuesta = await enviarDato(ptr1);
  //  if (respuesta) {
  //    setDatos(respuesta);
  //    cargarDatos();
  //  }
  //};

  const abrirVideo = (url) => {
    setUrlWebview(url);
    setModalLogin(true);
    console.log(numero)
    if (!isAutomating) {
      (numero == 0) ? setNumero(datos.length-1) : setNumero(numero - 1)
    }
    console.log(numero)
  };

  const handleModalClose = () => {
    setModalLogin(false);
    if (isAutomating) {
      const nextNumero = (numero + 1) % datos.length;
      setNumero(nextNumero);
      if (datos.length > 0) {
        const nextUrl = datos[nextNumero][1];
        setTimeout(() => {
          abrirVideo(nextUrl);
        }, 1000);
      }
    }
  };

  const toggleAutomation = () => {
    setIsAutomating(prev => !prev);
    if (!isAutomating && datos.length > 0) {
      abrirVideo(datos[numero][1]);
      setRemainingTime(AUTOMATION_DURATION_MS);
      automationTimeoutRef.current = setTimeout(() => {
        setIsAutomating(false);
        setModalLogin(false);
        alert(`Automatización detenida después de ${AUTOMATION_DURATION_MINUTES} minutos.`);
      }, AUTOMATION_DURATION_MS);

      countdownIntervalRef.current = setInterval(() => {
        setRemainingTime(prevTime => {
          if (prevTime <= 1000) {
            clearInterval(countdownIntervalRef.current);
            return 0;
          }
          return prevTime - 1000;
        });
      }, 1000);
    } 
    else if (isAutomating) {
      setModalLogin(false);
      if (automationTimeoutRef.current) {
        clearTimeout(automationTimeoutRef.current);
        automationTimeoutRef.current = null;
      }
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
        countdownIntervalRef.current = null;
      }
      setRemainingTime(AUTOMATION_DURATION_MS);
    }
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



  const cambiarImagen = (index) => {
    function resetState() {
      setEstrella(require("../../imgs/estrella gris.jpeg"));
      setBocina(require("../../imgs/bocina gris.jpeg"));
      setOjo(require("../../imgs/ojo gris.jpeg"));
      setMano(require("../../imgs/mano gris.jpeg"));
      setSuscrito(require("../../imgs/suscrito gris.jpeg"));
    }
    switch (index) {
      case 1:
        resetState();
        setSuscrito(require("../../imgs/suscrito roja.jpeg"));
        setBtnuse(["Suscribirse","true","true","true","false"]);
        break;
      case 2:
        resetState();
        setMano(require("../../imgs/mano roja.jpeg"));
        setBtnuse(["Me Gusta","true","true","true","false"]);
        break;
      case 3:
        resetState();
        setOjo(require("../../imgs/ojo roja.jpeg"));
        setBtnuse(["Comenzar a Reproducir","true","false","true","false"]);
        break;
      case 4:
        resetState();
        setBocina(require("../../imgs/bocina roja.jpeg"));
        setBtnuse(["Añadir Campaña","false","false","false","true"]);
        break;
      case 5:
        resetState();
        setEstrella(require("../../imgs/estrella roja.jpeg"));
        setBtnuse(["Añadir Campaña","false","false","false","false"]);
        break;
    }
  };

  useEffect(() => {
    cambiarImagen(1); 
  }, []);

  const agregarPubli = (datoIn) => {
    publicidad(datoIn);
  };

  const handleLoginSuccess = (data) => {
    setIsLoggedIn(data);
  };

  // Si no está logueado, mostrar la pantalla de Login
  if (!isLoggedIn) {
    return <LoginScreen onLoginSuccess={handleLoginSuccess} />;
  }

  useEffect(() => {
  if (remainingTime === 0) {
    handleModalClose();
  }
}, [remainingTime]);

  // Si está logueado, mostrar el contenido original de HomeScreen
  return (
    <View style={styles.container}>
      <LoginWebViewModal 
        visible={modalLogin}
        url={urlWebview}
        onClose={handleModalClose}
      />

      <View style={styles.header}>
        <BarraSuperior />
      </View>

      {(btnuse[3] == "true") ? <VideoPreview numero={numero} datosBD={datos} onPress={(url) => abrirVideo(url)} /> : null}

      {(btnuse[4] == "true") ? <AgregarCampania onAgregar={agregarPubli} /> : null}

      <TouchableOpacity
      style={{marginVertical:"5%",backgroundColor:"#6eb4bcfd",paddingHorizontal:"2%",justifyContent: 'center',alignItems: 'center',borderRadius: 10}}
      onPress={toggleAutomation}
      >
        <Text style={{fontSize:20,color:"white", fontWeight:"bold",}}>
          {isAutomating ? "Detener Automatización" : "Iniciar Automatización"}
        </Text>
      </TouchableOpacity>

      {isAutomating && (
        <Text style={styles.countdownText}>Tiempo restante: {formatTime(remainingTime)}</Text>
      )}

      <View style={styles.imageButtonsContainer} >
        <View style={styles.imageButtonWrapper}> 
          <TouchableOpacity  onPress={() => cambiarImagen(1)}>                                                                     
          <Image
            source={suscrito}
            style={styles.imageButton}
            resizeMode="contain"
          />
          </TouchableOpacity>
        </View>
        
        <View style={styles.imageButtonWrapper}>  
          <TouchableOpacity  onPress={() => cambiarImagen(2)}>                                                      
          <Image
            source={mano}
            style={styles.imageButton}
            resizeMode="contain"
          />
          </TouchableOpacity>
        </View>
        
        <View style={styles.imageButtonWrapper}> 
          <TouchableOpacity  onPress={() => cambiarImagen(3)}>                                        
          <Image
            source={ojo}
            style={styles.imageButton}
            resizeMode="contain"
          />
          </TouchableOpacity>
        </View>
        
        <View style={styles.imageButtonWrapper}>    
          <TouchableOpacity  onPress={() => cambiarImagen(4)}>                         
          <Image
            source={bocina}
            style={styles.imageButton}
            resizeMode="contain"
          />
          </TouchableOpacity>
        </View>
        
        <View style={styles.imageButtonWrapper}>   
          <TouchableOpacity  onPress={() => cambiarImagen(5)}>             
          <Image
            source={estrella}
            style={styles.imageButton}
            resizeMode="contain"
          />
          </TouchableOpacity>
        </View>
      </View>

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