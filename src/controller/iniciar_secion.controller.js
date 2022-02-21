const API_URL = "http://localhost:3001";

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