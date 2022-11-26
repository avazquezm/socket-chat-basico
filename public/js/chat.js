//Se podría optimizar y poner en una función para no ir copiando las URL entre archivos
const url = (window.location.hostname.includes('localhost'))
  ? 'http://localhost:8080/api/auth/'
  : 'https://node-restserver-production-a7fd.up.railway.app/api/auth/';


// Inicializamos user y socket
let user = null;
let socket = null;

// Referencias HTML
const txtUid = document.querySelector('#txtUid');
const txtMsg= document.querySelector('#txtMsg');
const ulUsuarios = document.querySelector('#ulUsuarios');
const ulMensajes = document.querySelector('#ulMensajes');
const btnEnviar = document.querySelector('#btnEnviar');
const btnSalir = document.querySelector('#btnSalir');


//Validar el token de localStorage
const validarJWT = async() => {

    const token = localStorage.getItem('token');

    if( !token ) {
        window.location = 'index.html';
        throw new Error('No existe token');
    }

    // Creamos la petición al servidor
    const params = {
        method: 'GET',
        headers: { 'x-token': token },
      };

    const myRequest = new Request(url, params);

    fetch(myRequest)
    .then((resp) => resp.json())
    .then((data) => {
        localStorage.setItem('token', data.token);
        user = data.usuario; //Obtenemos la info del usuario conectado!
        document.title = user.nombre;
    })
    .catch(console.warn);

    await conectarSocket();
}


const conectarSocket = async() => {
    // Enviamos info sobre el token para validar la conexión con los sockets en el server
    socket = io({
        'extraHeaders': {
            'x-token': localStorage.getItem('token')
        }
    });

    socket.on('connect', ()=>{
        console.log('Sockets Online');
    });

    socket.on('disconnect', ()=>{
        console.log('Sockets offline');
    });

    socket.on('recibir-mensajes', dibujarMensajes);

    //cuando no se especifica el parametro a la función es el callback pasado por param
    socket.on('usuarios-activos', dibujarUsuarios); 

    socket.on('mensaje-privado', (payload)=>{
        console.log(payload);
    });
}

const dibujarUsuarios = (usuarios = []) => {

    let usersHTML = '';

    usuarios.forEach( ({nombre, uid}) => {
        usersHTML += `
        <li>
            <p>
                <h5 class="text-success"> ${ nombre } </h5>
                <span class="fs-6 text-muted">${ uid }</span>
            </p>
        </li>
        `;
    });

    ulUsuarios.innerHTML = usersHTML;

}

const dibujarMensajes = (mensajes = []) => {

    let msgHTML = '';

    mensajes.forEach( ({nombre, mensaje}) => {
        msgHTML += `
        <li>
            <p>
                <span class="badge bg-primary"> ${ nombre } </span>
                <span class="fs-6">${ mensaje }</span>
            </p>
        </li>
        `;
    });

    ulMensajes.innerHTML = msgHTML;

}


btnEnviar.addEventListener( 'click', () => {

    const mensaje = txtMsg.value;
    const uid = txtUid.value;

    if(!mensaje || mensaje.length === 0) return;
    
    socket.emit( 'enviar-mensaje', {mensaje, uid});
    txtMsg.value='';

});


const main = async() => {

    //Validar JWT
    await validarJWT();

}


main();


