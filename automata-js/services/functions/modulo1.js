

import { Alert } from 'react-native';
import { initAutomataYTTable, initUsuariosTable } from '../sqlite/conexionLite.js';
import { Usuarios } from '../sqlite/controller.js';
import { supaLogin } from '../synchronize/loginSupa.js';

  export const iniciarDB = async () => {
    try {
        await initUsuariosTable();
        await initAutomataYTTable();
    } 
    catch (error) {
      Alert.alert("Error al iniciar❌", error);
    }
  };

  export const pedirDatos = async () => {
    let respData= await Usuarios.getAll();
  };

  export const listarVideos = async () => {
    let respData= await Usuarios.getVideos();
    return respData;
  };


  export const postVideo = async (urlVideo) => {
    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms)); 

    let respData= null;
    let initData= await Usuarios.getVideos();
    
    let urlused= urlVideo.split('?')[0];
    
    await Usuarios.postVideo(urlused);
    await sleep(1000);


    let endData= await Usuarios.getVideos();

    (initData.length < endData.length)? respData=true:respData=false;

    return respData;
  };

  export const loginUser = async (name, password) => {
    let loginUse= false;
    let respData= await Usuarios.getOne(name, password);

    if (respData == false || respData[5] == false){
      let respSupa= await supaLogin(name, password)
      loginUse= respSupa
    }
    else if(respData == true || respData[5] == true){
      loginUse= respData;
    }
    return loginUse;
  };

  export const updateUser = async (name, password, userState, sync, id) => {
    await Usuarios.update(name, password, userState, sync, id);
  };






