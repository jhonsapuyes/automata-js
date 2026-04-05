
import db from '../conexionLite.js';
import { supabase } from './conexionSuba.js';


export const actualizarusuariosLite = async () => {

  const { data, error } = await supabase
    .from('usuarios')
    .select('*');

  //console.log("SUPABASE:", data, error);

  if (error) {
    console.log("Error Supabase:", error);
    return;
  }

  try {
    await db.execAsync("BEGIN;");

    const query = `
      INSERT OR REPLACE INTO usuarios 
      (id, name, password, usuarioType, plaforma, pendiente_sync)
      VALUES (?, ?, ?, ?, ?, 0);
    `;

    for (const user of data) {
      await db.runAsync(query, [
        user.id,
        user.name,
        user.password,
        user.usuarioType,
        user.plaforma
      ]);
    }

    await db.execAsync("COMMIT;");
  } catch (e) {
    await db.execAsync("ROLLBACK;");
    console.log("Error sync:", e);
    throw e;
  }
};