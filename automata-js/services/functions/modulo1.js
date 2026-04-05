

import { initAutomataYTTable, initUsuariosTable } from '../sqlite/conexionLite.js';
import { Usuarios } from '../sqlite/controller.js';

  export const iniciarDB = async () => {
    try {
        await initUsuariosTable();
        await initAutomataYTTable();
    } 
    catch (error) {
        console.log("Error al iniciar❌", error);
    }
  };

  export const pedirDatos = async () => {
    let respData= await Usuarios.getAll();
    console.log(respData, "m1");
  };

  export const listarVideos = async () => {
    let respData= await Usuarios.getVideos();
    return respData;
    //console.log(respData,2)
  };

  const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms)); 

  export const postVideo = async (urlVideo) => {
    let respData= null;
    let initData= await Usuarios.getVideos();
    
    let urlused= urlVideo.split('?')[0];
    
    await Usuarios.postVideo(urlused);
    await sleep(1000);


    let endData= await Usuarios.getVideos();

    (initData.length < endData.length)? respData=true:respData=false;

    console.log(urlused)
    console.log(respData,"m1")
    console.log(endData)
    return respData;
  };

  export const loginUser = async (name, password) => {
    let respData= await Usuarios.getOne(name, password);
    return respData[3];
  };





