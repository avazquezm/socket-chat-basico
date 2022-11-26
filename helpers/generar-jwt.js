import jwt from 'jsonwebtoken';
import User from '../models/user.js';


// JWT Trabaja en base a promesas por eso usaremos un return Promise
const generarJWT = (uid = '') => {

    return new Promise( (resolve , reject) =>{

        const payload = { uid };

        jwt.sign(payload, process.env.PRIVATEKEY, {
            expiresIn: '4h'
        }, (err, token) => {

            if(err){
                console.log(err);
                reject('No se pudo generar el token');
            } else{
                resolve(token);
            }

        });

    });

}


// Comprobar token valido para sockets
const comprobarJWT = async(token) =>{
    try {

        if(!token){
            return;
        }

         // obtenemos el uid del usuario
         const {uid} = jwt.verify(token, process.env.PRIVATEKEY);
         // buscamos la info del usuario en bd con el uid
         const usuario = await User.findById(uid);
 
         // verificamos que exista el usuario y no sea nulo
         if( !usuario ){
             return;
         }
         // verificamos que no sea un usuario borrado
         if ( !usuario.state ){
             return;
         }
 
         return usuario;
        
    } catch (error) {
        return;
    }
}

export {
    generarJWT,
    comprobarJWT
}