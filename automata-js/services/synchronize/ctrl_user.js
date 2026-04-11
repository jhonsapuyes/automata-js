

import { supabase } from './conexionSuba.js';

export const actualizarDataUser = async (userState, deviceId,userId) => {
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
