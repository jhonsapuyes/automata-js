
import db from '../sqlite/conexionLite.js';
import { supabase } from './conexionSuba.js';

export const syncSupaToLiteVideos = async () => {
  try {
    const { data, error } = await supabase
      .from('automatayt')
      .select('*');

    if (error) {
      console.log("Error obteniendo Supabase:", error);
      return;
    }

    if (!data || data.length === 0) {
      console.log("No hay datos en Supabase");
      return;
    }

    // Iniciar transacción
    await db.execAsync("BEGIN TRANSACTION");

    for (const item of data) {
      try {
        // Verificar si ya existe en SQLite
        const existe = await db.getFirstAsync(
          "SELECT id FROM automatayt WHERE id = ?",
          [item.id]
        );

        if (existe) {
          // Actualizar
          await db.runAsync(
            `UPDATE automatayt 
             SET urlVideo = ?, plataforma = ? 
             WHERE id = ?`,
            [item.urlVideo, item.plataforma, item.id]
          );
        } else {
          // Insertar
          await db.runAsync(
            `INSERT INTO automatayt (id, urlVideo, plataforma, pendiente_sync)
             VALUES (?, ?, ?, 0)`,
            [item.id, item.urlVideo, item.plataforma]
          );
        }

      } catch (err) {
        console.log(`Error en item ${item.id}:`, err.message);
      }
    }

    await db.execAsync("COMMIT");

    console.log("Sync Supabase → SQLite completado 🚀");

  } catch (e) {
    await db.execAsync("ROLLBACK");
    console.log("Error general sync:", e);
  }
};