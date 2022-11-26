import { request, response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';

const validarJWT =  async ( req = request, res = response, next) => {

    // x-token es un nombre que nos hemos inventado y es el que tiene que venir en el header
    const token = req.header('x-token');

    // si no existe x-token en el header
    if(!token){

        return res.status(401).json({
            msg: 'Acceso denegado por falta de credenciales'
        });
    }


    // verificar si el token es valido
    try {
        
        // obtenemos el uid del usuario
        const {uid} = jwt.verify(token, process.env.PRIVATEKEY);

        // buscamos la info del usuario en bd con el uid
        const usuario = await User.findById(uid);

        // verificamos que exista el usuario y no sea nulo
        if( !usuario ){
            return res.status(401).json({
                msg: 'Acceso denegado por credenciales inválidas'
            });
        }

        // verificamos que no sea un usuario borrado
        if ( !usuario.state ){
            return res.status(401).json({
                msg: 'Acceso denegado por credenciales inválidas'
            });
        }

        // lo añadimos a la request que será pasada por los siguientes middlewares
        req.usuario = usuario;

        next();

    } catch (error) {

        console.log(error);
        res.status(401).json({
            msg: 'Acceso denegado por credenciales inválidas'
        });
        
    }


}


export{
    validarJWT
}