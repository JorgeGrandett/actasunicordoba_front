
const api = 'http://localhost:3001';


function validarRegistro() {
    var cedula = document.querySelector("#cedula").value;
    var contraseña = document.querySelector("#contraseña").value;
    var nombre = document.querySelector("#nombres").value;
    var apellido = document.querySelector("#apellidos").value;
    var telefono = document.querySelector("#telefono").value;
    var direccion = document.querySelector("#direccion").value;
    var cargo = document.querySelector("#cargo").value;

    if(cedula == "" || contraseña == "" || nombre == "" || apellido == "" || telefono == "" || direccion == "" || cargo == "Seleccione su cargo"){
        location.reload(true)
    }
    else {
        var aux = {
            cedula: cedula,
            contraseña: contraseña,
            nombre: nombre,
            apellido: apellido,
            telefono: telefono,
            direccion: direccion,
            cargo : cargo
        }
        registrarse (aux);
    }
}

async function registrarse(datosUsuario) {
   
    
    try {
        console.log(JSON.stringify(datosUsuario));
        const respuesta = await axios.post(`${api}/usuario`,JSON.stringify(datosUsuario));
        console.log(respuesta.data);
        /*const mensaje = await respuesta.json();
        console.log(mensaje);*/
    }
    catch (error) {
        console.log(error);
    }
    
}