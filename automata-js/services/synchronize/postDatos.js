
import db from '../conexionLite.js';
import { supabase } from './conexionSuba.js';

export const actualizarVideosSupa = async () => {
  try {
    const pendientes = await db.getAllAsync(
      "SELECT * FROM automatayt WHERE pendiente_sync = 1"
    );

    if (pendientes.length === 0) {
      console.log("Nada que sincronizar");
      return;
    }

    for (const item of pendientes) {
      try {
        const { error } = await supabase
          .from('automatayt')
          .upsert({
            id: item.id,
            urlVideo: item.urlVideo,
            plataforma: item.plataforma
          });

        if (error) {
          console.log("Error subiendo:", error);
          continue;
        }

        await db.runAsync(
          "UPDATE automatayt SET pendiente_sync = 0 WHERE id = ?",
          [item.id]
        );

      } catch (err) {
        console.log(`Error en item ${item.id}:`, err.message);
      }
    }

    console.log("Sync completado 🚀");

  } catch (e) {
    console.log("Error general sync:", e);
  }
};