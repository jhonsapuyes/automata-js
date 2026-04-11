
import { supabase } from './conexionSuba.js';


export const guardarVideoSupa = async (video) => {
  try {
    const { error } = await supabase
      .from('automatayt')
      .insert([
        {
          urlVideo: video,
          plataforma: "automata yt-1"
        }
      ]);

    if (error) {
      console.log("Error subiendo:", error.message);
      return false;
    }

    console.log("Video guardado en Supabase 🚀");
    return true;

  } catch (e) {
    console.log("Error general:", e.message);
    return false;
  }
};