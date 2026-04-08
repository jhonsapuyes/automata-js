

import { supabase } from './conexionSuba.js';

export const obtenerVideos = async () => {
  const { data, error } = await supabase
    .from('automatayt')
    .select('*'); // trae todas las columnas

  if (error) {
    console.log("Error:", error);
    return null;
  }
    const urls = data.map(item => item.urlVideo);

  return urls;
};