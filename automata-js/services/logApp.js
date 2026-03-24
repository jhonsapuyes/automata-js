


const BASE_URL = "https://silver-penguin-235702.hostingersite.com/end_points/index.php"; // cambia por tu api

export async function log_app(pt1) {
    try {
    const respuesta = await fetch(`${BASE_URL}`,         
        {
          method: "POST",
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify({"api":"ft_admin","requestType":"getOne","dataIN":pt1})
    });

    const data = await respuesta.json();
    let salida_datos= data["data"]
    if(salida_datos != "error"){
      return true;
    }
    else{
      return false;
    }

  } catch (error) {
    console.log("Error en API:", error);
    return null;
  }
}

