import { request, response } from "express";
import { loadFile } from '../helpers/load-file.js'
import Product from "../models/product.js";
import User from "../models/user.js";

import fs from "fs";

import {v2 as cloudinary} from 'cloudinary';

import path from 'path';
import {fileURLToPath} from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const uploadFile = async(req = request, res = response) => {

    // imagenes
    try {
        const filename = await loadFile(req.files, ['jpg', 'png', 'jpeg'], 'img');  

        res.json({
         name: filename
        });
    } catch (error) {
        return res.status(400).json({
            error
        });
    }

}

// const updateImg = async( req = request, res = response ) =>{

//     const {id, coleccion} = req.params;

//     let modelo;

//     switch (coleccion) {
//         case 'users':
            
//             modelo = await User.findById(id);

//             if (!modelo){
//                 return res.status(400).json({
//                     msg: `No existe un usuario con el id ${id}`
//                 });
//             }

//             break;

//         case 'products':
        
//             modelo = await Product.findById(id);

//             if (!modelo){
//                 return res.status(400).json({
//                     msg: `No existe un usuario con el id ${id}`
//                 });
//             }

//             break;
    
//         default:
//             return res.status(500).json({msg:'No se ha implementado la colección'});
//     }


//     // Limpiar imagenes previas
//     try {
//         if(modelo.img){
//             // Si existe el valor en bbdd, borrar el archivo fisico
//             const uploadPath = path.join( __dirname, '../uploads/', coleccion, modelo.img);

//             console.log(uploadPath);
//             //verificamos que aún exista ese archivo en el server
//             if(fs.existsSync(uploadPath)){
//                 //borramos
//                 fs.unlinkSync(uploadPath);
//                 console.log('borrado', uploadPath);
//             }

//         }
//     } catch (error) {
//         res.status(500).json({
//             msg:'No existe la img en el servidor'
//         });
//     }

//     modelo.img = await loadFile(req.files, ['jpg', 'png', 'jpeg'], coleccion);  
//     await modelo.save();

//     res.json(modelo);

// }


// CLOUDINARY
const updateImg = async( req = request, res = response ) =>{

    const {id, coleccion} = req.params;

    let modelo;

    switch (coleccion) {
        case 'users':
            
            modelo = await User.findById(id);

            if (!modelo){
                return res.status(400).json({
                    msg: `No existe un usuario con el id ${id}`
                });
            }

            break;

        case 'products':
        
            modelo = await Product.findById(id);

            if (!modelo){
                return res.status(400).json({
                    msg: `No existe un usuario con el id ${id}`
                });
            }

            break;
    
        default:
            return res.status(500).json({msg:'No se ha implementado la colección'});
    }


    // Limpiar imagenes previas
    try {
        if(modelo.img){

            // Extraemos el nombre de todo el url de la img
            const name_id = modelo.img.split('/').at(-1).split('.').at(0);
            
            // borrar (podriamos poner await o dejarlo como un proceso que se lance a parte)
            cloudinary.uploader.destroy(name_id)


        }
    } catch (error) {
        res.status(500).json({
            msg:'No existe la img en el servidor'
        });
    }

    const {tempFilePath} = req.files.file;
    
    

    try {
        
        const {secure_url} = await cloudinary.uploader.upload(tempFilePath);
        modelo.img = secure_url;

    
    } catch (error) {
        console.log('ERROR',error);
    }

    res.json(modelo);
    await modelo.save();



}

const showImg = async( req = request, res = response ) =>{
    
   
    const {id, coleccion} = req.params;

    let modelo;

    switch (coleccion) {
        case 'users':
            
            modelo = await User.findById(id);

            if (!modelo){
                return res.status(400).json({
                    msg: `No existe un usuario con el id ${id}`
                });
            }

            break;

        case 'products':
        
            modelo = await Product.findById(id);

            if (!modelo){
                return res.status(400).json({
                    msg: `No existe un producto con el id ${id}`
                });
            }

            break;
    
        default:
            return res.status(500).json({msg:'No se ha implementado la colección'});
    }


    // Limpiar imagenes previas
    try {
        if(modelo.img){
            // Si existe el valor en bbdd, borrar el archivo fisico
            const uploadPath = path.join( __dirname, '../uploads/', coleccion, modelo.img);
            //verificamos que aún exista ese archivo en el server
            if(fs.existsSync(uploadPath)){
                // enviamos el archivo
                return res.sendFile(uploadPath);
            }

        }
    } catch (error) {
        res.status(500).json({
            msg:'No existe la img en el servidor'
        });
    }

    const defaultPath = path.join( __dirname, '../assets/no-image.jpg');
    res.sendFile(defaultPath);
}

export{
    uploadFile,
    updateImg,
    showImg
}