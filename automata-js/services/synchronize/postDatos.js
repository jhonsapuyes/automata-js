

import db from '../sqlite/conexionLite.js';
import { supabase } from './conexionSuba.js';

// 🔄 SINCRONIZAR SQLITE → SUPABASE
export const syncLiteToSupabase = async () => {
  try {
    // 1. Obtener usuarios pendientes de sincronizar
    const usuarios = await db.getAllAsync(
      "SELECT * FROM usuarios WHERE pendiente_sync = 1;"
    );

    if (usuarios.length === 0) {
      //console.log("No hay datos para sincronizar");
      return;
    }

    //console.log("Enviando a Supabase:", usuarios);

    // 2. Limpiar datos (opcional pero recomendado)
    const cleanUsuarios = usuarios.map(u => ({
      id: u.id,
      name: u.name,
      password: u.password,
      usuarioType: u.usuarioType,
      plaforma: u.plaforma,
      userState: u.userState
    }));

    // 3. Subir a Supabase
    const { error } = await supabase
      .from('usuarios')
      .upsert(cleanUsuarios, { onConflict: 'id' });

    if (error) {
      console.log("Error subiendo a Supabase:", error);
      return;
    }

    // 4. Marcar como sincronizados en SQLite
    const ids = usuarios.map(u => u.id);
    const placeholders = ids.map(() => '?').join(',');

    await db.runAsync(
      `UPDATE usuarios SET pendiente_sync = 0 WHERE id IN (${placeholders})`,
      ids
    );

    //console.log("Sync completado correctamente 🚀");

  } catch (err) {
    console.log("Error en sync:", err);
  }
};


// 🧪 EJEMPLO: marcar usuario como pendiente de sync
export const marcarPendiente = async (id) => {
  try {
    await db.runAsync(
      "UPDATE usuarios SET pendiente_sync = 1 WHERE id = ?;",
      [id]
    );

    console.log("Usuario marcado para sincronización");
  } catch (error) {
    console.log("Error marcando pendiente:", error);
  }
};


