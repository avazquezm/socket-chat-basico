import {response, request, json} from 'express'; 
import User from '../models/user.js';
import bcrypt from 'bcryptjs';
import { generarJWT } from '../helpers/generar-jwt.js';
import { googleVerify } from '../helpers/google-verify.js';

const login = async(req = request, res = response) => {

    const { email, password } = req.body;

    try {
        
        // Verificar si el email existe
        const usuario = await User.findOne({email, state : true});

        if( !usuario ){
            return res.status(400).json({
                msg: 'Usuario o password incorrectos'
            });
        }

        // Verificar contraseña
        const validPassword = bcrypt.compareSync(password, usuario.password);

        if (!validPassword){
            return res.status(400).json({
                msg: 'Usuario o password incorrectos --pwd'
            });
        }

        // Generar JWT
        const token = await generarJWT(usuario.id);


        res.json({
            usuario,
            token
        });


    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Parece que algo salió mal, hable con el administrador'
        });
    }


}

const googleSignIn = async( req = request, res = response ) => {

    const { id_token } = req.body;

    try {
        
        const {name, picture, email} = await googleVerify( id_token );

        // Verificar si ya existe ese correo en nuestra DB
        let usuario = await User.findOne({email});

        //Si no existe el usuario lo creamos
        if (!usuario){
            // No necesita password porque ya sabemos que es un SignIn de google valido
            const data ={
                nombre: name, 
                email,
                password: '$google-password',
                img: picture,
                role: 'USER_ROLE',
                google: true
            };

            usuario = new User( data );

            console.log(usuario);

            await usuario.save();
        }

        //Si el estado es false significa que está borrado o bloqueado
        if (!usuario.state){

            return res.status(401).json({
                msg: 'Este usuario fue bloqueado/eliminado, hable con el administrador'
            });

        }

        // Generar JWT
        const token = await generarJWT(usuario.id);

        res.json({
            usuario,
            token
        });


    } catch (error) {
        
        return res.status(400).json({
            msg: 'El ID Token no se pudo verificar'
        });

    }

}

const refreshToken = async(req = request, res = response) => {

    const usuario  = req.usuario;

    // Generar JWT
    const token = await generarJWT(usuario.id);


    res.json({
        usuario,
        token
    });

}


export{
    login,
    googleSignIn,
    refreshToken
}