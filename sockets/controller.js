import { comprobarJWT } from "../helpers/generar-jwt.js";
import { Chat } from '../models/chat.js';

const chat = new Chat();

const socketController = async(socket, io) => {

    // Obtener token de verificación
   const token = socket.handshake.headers['x-token'];
   const usuario = await comprobarJWT(token);

   if ( !usuario ){
    //Desconectamos el socket si no hay usuario
    //significa que no era un token valido o el usuario no existe o está eliminado
    return socket.disconnect();
   }

   //Añadir el nuevo usuario al chat
   chat.conectarUsuario(usuario);
   //Informar de la nueva lista de usuarios a todos
   io.emit('usuarios-activos', chat.usuariosArr);

   //Mostrar los ultimos 10 mensajes del chat nada más conectarse
   socket.emit('recibir-mensajes', chat.ultimos10);

   //Crear la sala privada del usuario para recibir mensajes priados
   socket.join(usuario.id);

   //Si se desconecta lo eliminamos de la lista del chat
   socket.on('disconnect', ()=>{
    chat.desconectarUsuario(usuario.id);
    io.emit('usuarios-activos', chat.usuariosArr);
   });

   socket.on('enviar-mensaje', ({uid, mensaje})=>{

    if(uid){
        //Mensaje privado
        socket.to(uid).emit('mensaje-privado',{
            from: usuario.nombre,
            msg: mensaje
        });
    }else{
        chat.enviarMensaje(usuario.id, usuario.nombre, mensaje);
        io.emit('recibir-mensajes', chat.ultimos10);
    }

   });

}

export{
    socketController
}