

import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync('miDB.db'); // ✅ nueva forma

export const initUsuariosTable = async () => {
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS usuarios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      password TEXT,
      usuarioType TEXT,
      plaforma TEXT
    );
  `);
};

export const initAutomataYTTable = async () => {
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS automatayt (
      id INTEGER PRIMARY KEY,
      urlVideo TEXT,
      plataforma TEXT,
      pendiente_sync INTEGER DEFAULT 0
    );
  `);
};

export default db;

  //(async () => {
  //  const db = await SQLite.openDatabaseAsync('miDB.db');
  //  const result = await db.getAllAsync(
  //    "SELECT name FROM sqlite_master WHERE type='table';"
  //  );
  //  console.log(result);
  //})();

//agregar columna
//const columnas = await db.getAllAsync("PRAGMA table_info(usuarios);");
//const existe = columnas.some(col => col.name === "email");
//if (!existe) {
//  await db.execAsync(`ALTER TABLE usuarios ADD COLUMN email TEXT;`);
//}

//borrar tabla
//await db.execAsync(`
//  DROP TABLE IF EXISTS usuarios;
//`);

