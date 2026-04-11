

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

    let respData=[
      result["plaforma"],result["id"],result["name"],
      result["password"],result["usuarioType"],true,
      result["userState"],result["plaforma"]];
    return respData; // 👈 un solo objeto (o null)
  } 
  catch (error) {
    return false;
  }
};

const actualizarUsuario = async (userState, deviceId,userId) => {
  try {
    const { data, error } = await supabase
      .from('usuarios')
      .update({
        userState: userState,
        deviceId: deviceId
      })
      .eq('id', userId) // 👈 importante

    if (error) {
      console.log('Error:', error.message);
      return null;
    }

    console.log('Usuario actualizado:', data);
    return data;

  } catch (err) {
    console.log('Error inesperado:', err);
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

obtenerUsuarios()

export const Usuarios = {
  getOne: obtenerUsuario,
  getAll: obtenerUsuarios,
  create: crearUsuario,
  update: actualizarUsuario,
  delete: eliminarUsuario,
  getVideos: obtenerVideos,
  postVideo: insertarVideo
};