const api = "https://backactasunicoroba.herokuapp.com";
let contadorPuntosEntrada=0;
let idActaModificando=null;

function validarRegistro() {
  var cedula = document.getElementById("cedula").value;
  var contraseña = document.getElementById("contraseña").value;
  var nombre = document.getElementById("nombres").value;
  var apellido = document.getElementById("apellidos").value;
  var telefono = document.getElementById("telefono").value;
  var direccion = document.getElementById("direccion").value;
  var cargo = document.getElementById("cargo").value;

  if (
    cedula == "" ||
    contraseña == "" ||
    nombre == "" ||
    apellido == "" ||
    telefono == "" ||
    direccion == "" ||
    cargo == "Seleccione su cargo"
  ) {
    location.reload(true);
  } else {
    const aux = {
      cedula: cedula,
      contraseña: contraseña,
      nombre: nombre,
      apellido: apellido,
      telefono: telefono,
      direccion: direccion,
      cargo: cargo,
    };
    console.log(aux);
    registrarse(aux);
  }
}

async function registrarse(datosUsuario) {
  console.log(datosUsuario);
  try {
    let el = document.getElementById("respuesta");
    const respuesta = await axios.post(`${api}/usuario`, datosUsuario);
    console.log(respuesta.data);
    el.textContent = respuesta.data;
    setTimeout(() => {
      el.textContent = "";
    }, 600);
    limpiar();
  } catch (error) {
    limpiar();
    console.log(error.response);
  }
}

function limpiar() {
  var cedula = document.getElementById("cedula");
  var contraseña = document.getElementById("contraseña");
  var nombre = document.getElementById("nombres");
  var apellido = document.getElementById("apellidos");
  var telefono = document.getElementById("telefono");
  var direccion = document.getElementById("direccion");
  var cargo = document.getElementById("cargo");

  cedula.value = null;
  contraseña.value = null;
  nombre.value = null;
  apellido.value = null;
  telefono.value = null;
  direccion.value = null;
  cargo.value = null;
}

function validarLogin() {
  var cedula = document.getElementById("cedula-login").value;
  var contraseña = document.getElementById("contraseña-login").value;

  if (cedula == "" || contraseña == "") {
    location.reload(true);
  } else {
    const aux = {
      cedula: cedula,
      contraseña: contraseña,
    };

    loguear(aux);
  }
}

async function loguear(datosUsuario) {
  try {
    const respuesta = await axios.get(
      `${api}/usuario/${datosUsuario.cedula}`,
      datosUsuario
    );
    if (respuesta.status == 200) {
      if (
        respuesta.data.cedula == datosUsuario.cedula &&
        respuesta.data.contraseña == datosUsuario.contraseña
      ) {
       
        document.getElementById("link-to-dash").click();
      }
    }
  } catch (error) {
    console.log(error);
  }
}

async function getUsers(datosUsuario) {
  try {
    const respuesta = await axios.get(`${api}/usuarios`);
    if (respuesta.status == 200) {
      if (
        respuesta.data.cedula == datosUsuario.cedula &&
        respuesta.data.contrasena == datosUsuario.contrasena
      ) {
        document.getElementById("link-to-dash").click();
      }
    }
  } catch (error) {
    console.log(error);
  }
}

async function cargarUsuariosDisponibles() {
  try {
    const resp = await axios.get(`${api}/usuarios`);
    const slect = document.getElementById("usuariosDB");
    for (const key in resp.data) {
      console.log(key);
      slect.insertAdjacentHTML(
        "beforeend",
        `
            <option   value="${resp.data[key].nombre}">${resp.data[key].nombre}</option>
            
            `
      );
    }
  } catch (error) {
    console.log(error);
  }
}

function nuevoPuntoAccion() {
  const pt = document.getElementById("puntos-accion");
    pt.insertAdjacentHTML(
      "beforeend",
      `
      <div class="container-r-crear">
        <div class="registro-item r-crear w-100 p-action">
          <input type="checkbox" id="check-p-${contadorPuntosEntrada}">
          <input type="text" placeholder="Tarea" id="tarea-p-${contadorPuntosEntrada}">
          <div class="c-f-vencimiento" >
              <span>Fecha de vencimiento</span>
              <input type="date" id="fecha-p-${contadorPuntosEntrada}" >
          </div>
          
          <input type="text" placeholder="Progreso" id="progreso-p-${contadorPuntosEntrada}">
          
         
        </div>
    </div>
            
        `
    );
        contadorPuntosEntrada+=1;
}






async function crearActa() {
  try {
    let puntosA = [];
    let objT={};
   for (let i =0; i<contadorPuntosEntrada; i++) {
     const chck = document.getElementById(`check-p-${i}`)
     const tar = document.getElementById(`tarea-p-${i}`)
     const fech = document.getElementById(`fecha-p-${i}`)
     const prog = document.getElementById(`progreso-p-${i}`)
    let ax = null;
    if(chck.checked==true){ax='checked'}
     objT = {
       check:ax,
       tarea:tar.value,
       fecha:fech.value,
       progreso:prog.value,
     }
     puntosA.push(objT);
  }


  const nomOrg = document.getElementById(`nombre-organizador`).value
  const carOrg = document.getElementById(`cargo-organizador`).value
  const fecha = document.getElementById(`fecha`).value
  const hora = document.getElementById(`hora`).value
  const asistentes = document.getElementById(`usuariosDB`).options
  const agenda = document.getElementById(`agenda`).value
  const notas = document.getElementById(`notas`).value

  const Nasistentes  =[];
    for (let index = 0; index < asistentes.length; index++) {
      if(asistentes[index].selected){
        Nasistentes.push(asistentes[index].value)
      }
      
    }
  

  const ob = {
    nombreOrganizador:nomOrg,
    cargoOrganizador:carOrg,
    fecha:fecha,
    hora:hora,
    participantes:Nasistentes,
    agenda:agenda,
    notasReunion:notas,
    puntosAccion:puntosA,
  }
    const resp = await axios.post(`${api}/acta`,ob);
    document.getElementById('crear-sms').textContent = resp.data;
    setTimeout(()=>{
      document.getElementById('crear-sms').textContent = '';
    },1000)

    console.log(resp)
   
    
  } catch (error) {
    console.log(error);
  }
}


async function cargamodificarActa() {
  try {

    const resp = await axios.get(`${api}/actas`);
    const pt = document.getElementById("list-actas");
    console.log(resp.data)
    for (const key in resp.data) {
      pt.insertAdjacentHTML(
      "beforeend",
      `
          <option   value="${key}">${resp.data[key].nombreOrganizador}-${resp.data[key].fecha}</option>
          
          `
    );
    }

  } catch (error) {
    console.log(error);
  }
}


async function pintarmodificarActa() {
  try {

    const resp = await axios.get(`${api}/actas`);
    const pt = document.getElementById("list-actas").value;
    idActaModificando =resp.data[pt]._id;



    const nomOrg = document.getElementById(`nombre-organizador`).value = resp.data[pt].nombreOrganizador;
  const carOrg = document.getElementById(`cargo-organizador`).value= resp.data[pt].cargoOrganizador;
  const fecha = document.getElementById(`fecha`).value= resp.data[pt].fecha;
  const hora = document.getElementById(`hora`).value= resp.data[pt].hora;
  
  const agenda = document.getElementById(`agenda`).value= resp.data[pt].agenda;
  const notas = document.getElementById(`notas`).value= resp.data[pt].notasReunion;


    cargarUsuariosDisponibles();

    const pAct = document.getElementById("puntos-accion");
    contadorPuntosEntrada = 0;
    for (contadorPuntosEntrada; contadorPuntosEntrada < resp.data[pt].puntosAccion.length; contadorPuntosEntrada++) {
     
      pAct.insertAdjacentHTML(
      "beforeend",
      `<div class="container-r-crear">
        <div class="registro-item r-crear w-100 p-action">
          <input type="checkbox" id="check-p-${contadorPuntosEntrada}" }'>
          <input type="text" placeholder="Tarea" id="tarea-p-${contadorPuntosEntrada}"  value='${resp.data[pt].puntosAccion[contadorPuntosEntrada].tarea}'>
          <div class="c-f-vencimiento" >
              <span>Fecha de vencimiento</span>
              <input type="date" id="fecha-p-${contadorPuntosEntrada}"  value='${resp.data[pt].puntosAccion[contadorPuntosEntrada].fecha}'>
          </div>
          
          <input type="text" placeholder="Progreso" id="progreso-p-${contadorPuntosEntrada}"  value='${resp.data[pt].puntosAccion[contadorPuntosEntrada].progreso}'>
          
         
        </div>
    </div>`
    
    );
    if (resp.data[pt].puntosAccion[contadorPuntosEntrada].check==true){
      document.getElementById(`check-p-${contadorPuntosEntrada}`).checked =true;
    }
    
    
      
    }
    const asincritos = document.getElementById("lista-asistentes-inscritos");
    for (const key in resp.data[pt].participantes) {
      

  
      asincritos.insertAdjacentHTML(
      "beforeend",
      `
      <li style="margin-left:10px;" >${resp.data[pt].participantes[key]}</li>
            
        `
    );
    }
    document.getElementById('btn-Modificar-acta').style.display = 'flex';
    document.getElementById('selector-modificar').style.display = 'none';

  } catch (error) {
    console.log(error);
  }
}


async function capturarYModificarActa() {
  try {
    let puntosA = [];
    let objT={};
   for (let i =0; i<contadorPuntosEntrada; i++) {
     const chck = document.getElementById(`check-p-${i}`)
     const tar = document.getElementById(`tarea-p-${i}`)
     const fech = document.getElementById(`fecha-p-${i}`)
     const prog = document.getElementById(`progreso-p-${i}`)
     
    
    
     objT = {
       check:chck.checked,
       tarea:tar.value,
       fecha:fech.value,
       progreso:prog.value,
     }
     puntosA.push(objT);
  }


  const nomOrg = document.getElementById(`nombre-organizador`).value
  const carOrg = document.getElementById(`cargo-organizador`).value
  const fecha = document.getElementById(`fecha`).value
  const hora = document.getElementById(`hora`).value
  const asistentes = document.getElementById(`usuariosDB`).options
  const agenda = document.getElementById(`agenda`).value
  const notas = document.getElementById(`notas`).value

  const Nasistentes  =[];
    for (let index = 0; index < asistentes.length; index++) {
      if(asistentes[index].selected){
        Nasistentes.push(asistentes[index].value)
      }
      
    }
  

  const ob = {
    nombreOrganizador:nomOrg,
    cargoOrganizador:carOrg,
    fecha:fecha,
    hora:hora,
    participantes:Nasistentes,
    agenda:agenda,
    notasReunion:notas,
    puntosAccion:puntosA,
  }
  console.log("datos")
  console.log(ob)
    const resp = await axios.put(`${api}/acta/${idActaModificando}`,ob);
    document.getElementById('crear-sms').textContent = resp.data;
    setTimeout(()=>{
      document.getElementById('crear-sms').textContent = '';
    },1000)

    console.log(resp)
    document.getElementById("link-to-dash").click();
    
  } catch (error) {
    console.log(error);
  }
}


async function pintarVerActa() {
  try {

    const resp = await axios.get(`${api}/actas`);
    const pt = document.getElementById("list-actas").value;
    idActaModificando =resp.data[pt]._id;



    const nomOrg = document.getElementById(`nombre-organizador`).value = resp.data[pt].nombreOrganizador;
  const carOrg = document.getElementById(`cargo-organizador`).value= resp.data[pt].cargoOrganizador;
  const fecha = document.getElementById(`fecha`).value= resp.data[pt].fecha;
  const hora = document.getElementById(`hora`).value= resp.data[pt].hora;
  
  const agenda = document.getElementById(`agenda`).value= resp.data[pt].agenda;
  const notas = document.getElementById(`notas`).value= resp.data[pt].notasReunion;


  const asincritos = document.getElementById("lista-asistentes-inscritos");
  for (const key in resp.data[pt].participantes) {
    


    asincritos.insertAdjacentHTML(
    "beforeend",
    `
    <li style="margin-left:10px;" >${resp.data[pt].participantes[key]}</li>
          
      `
  );}

    const pAct = document.getElementById("puntos-accion");
    contadorPuntosEntrada = 0;
    for (contadorPuntosEntrada; contadorPuntosEntrada < resp.data[pt].puntosAccion.length; contadorPuntosEntrada++) {
     
      pAct.insertAdjacentHTML(
      "beforeend",
      `<div class="container-r-crear">
        <div class="registro-item r-crear w-100 p-action">
          <input disabled type="checkbox" id="check-p-${contadorPuntosEntrada}" }'>
          <input disabled type="text" placeholder="Tarea" id="tarea-p-${contadorPuntosEntrada}"  value='${resp.data[pt].puntosAccion[contadorPuntosEntrada].tarea}'>
          <div class="c-f-vencimiento" >
              <span>Fecha de vencimiento</span>
              <input disabled type="date" id="fecha-p-${contadorPuntosEntrada}"  value='${resp.data[pt].puntosAccion[contadorPuntosEntrada].fecha}'>
          </div>
          
          <input disabled type="text" placeholder="Progreso" id="progreso-p-${contadorPuntosEntrada}"  value='${resp.data[pt].puntosAccion[contadorPuntosEntrada].progreso}'>
          
         
        </div>
    </div>`
    
    );
    if (resp.data[pt].puntosAccion[contadorPuntosEntrada].check==true){
      document.getElementById(`check-p-${contadorPuntosEntrada}`).checked =true;
    }
    
    
      
    }
    




    document.getElementById('btn-Modificar-acta').style.display = 'flex';
    document.getElementById('selector-modificar').style.display = 'none';

  } catch (error) {
    console.log(error);
  }
}

async function descargar() {
  try {

    const resp = await axios.get(`${api}/actas`);
    const pt = document.getElementById("list-actas").value;
    const API2 = `${api}/descargaracta/${resp.data[pt]._id}`;
   
    return axios.get(API2,{responseType: 'blob'}).then((response) => {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `IADH-${idA}.pdf`);
      document.body.appendChild(link);
      link.click();
    });
    document.getElementById("link-to-dash").click();
  } catch (error) {
    console.log(error);
  }
}


