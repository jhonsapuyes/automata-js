

import db from './conexionLite';

const crearUsuario = async (name, password) => {
  try {
    const result = await db.runAsync(
      "INSERT INTO usuarios (name, password, usuarioType, plaforma) VALUES (?, ?, ?, ?);",
      [name, password, "admin", "automata yt-1"]
    );

    return result;
  } 
  catch (error) {
    console.log(error);
    throw error;
  }
};

const obtenerUsuarios = async () => {
  try {
    const result = await db.getAllAsync("SELECT * FROM usuarios;");
    return result;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const obtenerUsuario = async (name, password) => {
  try {
    const result = await db.getFirstAsync(
      "SELECT * FROM usuarios WHERE name = ? AND password = ?;",
      [name, password]
    );
    // {"id": 1, "name": "ander", "password": "pass", "plaforma": "automata yt-1", "usuarioType": "admin"}
    let respData=[result["plaforma"],result["usuarioType"],result["name"],true];
    return respData; // 👈 un solo objeto (o null)
  } 
  catch (error) {
    return false;
  }
};

const actualizarUsuario = async (name, password, id) => {
  try {
    const result = await db.runAsync(
      "UPDATE usuarios SET name = ?, password = ? WHERE id = ?;",
      [name, password, id]
    );

    return result;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const eliminarUsuario = async (id) => {
  try {
    const result = await db.runAsync(
      "DELETE FROM usuarios WHERE id = ?;",
      [id]
    );

    return result;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const insertarVideo = async (urlVideo) => {
  await db.runAsync(
    `INSERT INTO automatayt (urlVideo, plataforma, pendiente_sync)
     VALUES (?, "automata yt-1", 1);`,
    [urlVideo]
  );
};

const obtenerVideos = async () => {
  try {
    const result = await db.getAllAsync("SELECT * FROM automatayt;");
    return result;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const eliminarVideos = async (id) => {
  try {
    const result = await db.runAsync(
      "DELETE FROM automatayt WHERE id = ?;",
      [id]
    );

    return result;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const actualizarVideos = async (url, sync, id) => {
  try {
    const result = await db.runAsync(
      "UPDATE automatayt SET urlVideo = ?, pendiente_sync = ? WHERE id = ?;",
      [url, sync, id]
    );

    return result;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

//eliminarVideos(4)
//actualizarVideos("https://youtu.be/LCfUHUqXuJE",1,2);
//insertarVideo("https://youtu.be/C4m7NbapD2Y");
//obtenerVideos()

export const Usuarios = {
  getOne: obtenerUsuario,
  getAll: obtenerUsuarios,
  create: crearUsuario,
  update: actualizarUsuario,
  delete: eliminarUsuario,
  getVideos: obtenerVideos,
  postVideo: insertarVideo
};