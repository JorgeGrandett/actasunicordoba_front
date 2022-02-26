const API_URL = "https://backactasunicoroba.herokuapp.com";

async function iniciarSecion() {
    const cedula = document.querySelector("#cedula").value;
    const pass = document.querySelector("#contraseña").value;
    localStorage.setItem("user", cedula);
    

    //console.log(localStorage.getItem("user"));
    fetch("${API_URL}/usuario/${cedula}")
    .then((response) => response.json())
    .then((usuario) => {
        console.log(usuario);
    });
}