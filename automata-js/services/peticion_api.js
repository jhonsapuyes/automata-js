

const BASE_URL = "https://silver-penguin-235702.hostingersite.com/end_points/index.php"; // cambia por tu api

export async function apiFetch(endpoint, method = "GET", body = null) {
  try {
    const respuesta = await fetch(`${BASE_URL}`,         
        {
          method: "POST",
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify({"api": "payclick_js","requestType": "getAll"})
    });

    const data = await respuesta.json();
    let salida_datos= data["data"]
    return salida_datos;

  } catch (error) {
    console.log("Error en API:", error);
    return null;
  }
}

