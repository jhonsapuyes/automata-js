import { supabase } from './conexionSuba.js';

export const supaLogin = async (usuario, password) => {
  const { data, error } = await supabase
    .from('usuarios')
    .select('*')
    .eq('name', usuario) // 👈 CORREGIDO
    .eq('password', password);

  if (error) {
    console.log("Error Supabase:", error);
    alert("Error en la consulta");
    return null;
  }

  if (!data || data.length === 0) {
    alert("No hay datos");
    return false;
  }

  let dataOut=[
    data[0]["plaforma"],data[0]["id"],data[0]["name"],
    data[0]["password"],data[0]["usuarioType"],true,
    data[0]["userState"],data[0]["plaforma"]
  ];

  return dataOut;
};