import { request, response } from "express";
import { isValidObjectId } from "mongoose";
import Category from "../models/category.js";
import Product from "../models/product.js";
import User from "../models/user.js";

const colecciones = [
    'users',
    'categories',
    'products'
];

const searchUsers = async (termino='', res = response) =>{

    // search by id
    // descartamos los eliminados con state: true
    const isMongoId = isValidObjectId(termino);

    if ( isMongoId ){
        const user = await User.find({_id: termino, state: true});

        return res.json({
            results: (user) ?  user : []
        });
    }

    // search by name $or email
    // and state:true porque solo queremos usuarios activos
    const regexp = new RegExp(termino, 'i');
    const users = await User.find({  
        $or: [{nombre: regexp}, {email: regexp}],
        $and: [{state: true}]
    });

    res.json({
        results: users
    });

}

const searchCategories = async (termino='', res = response) =>{

    
    // search by id
    // descartamos los eliminados con state: true
    const isMongoId = isValidObjectId(termino);

    if ( isMongoId ){
        const category = await Category.find({_id: termino, state: true});

        return res.json({
            results: (category) ? category  : []
        });
    }

    // search by name
    // and state:true porque solo queremos activos
    const regexp = new RegExp(termino, 'i');
    const categories = await Category.find({name: regexp, state: true});

    res.json({
        results: categories
    });

}


const searchProducts = async (termino='', res = response) =>{

    // search by id
    // descartamos los eliminados con state: true
    const isMongoId = isValidObjectId(termino);

    if ( isMongoId ){
        const product = await Product.find({_id: termino, state: true})
                                    .populate('category', 'name');

        return res.json({
            results: (product) ? product : []
        });
    }

    // search by name
    // and state:true porque solo queremos activos
    const regexp = new RegExp(termino, 'i');
    const products = await Product.find({name: regexp, state: true})
                                .populate('category', 'name');

    res.json({
        results: products
    });

}


const search = (req = request, res = response) => {

    const {coleccion, termino} = req.params;

    if(!colecciones.includes(coleccion)){
        return res.status(400).json({
            msg:'No existe la colección buscada'
        });
    }

    switch (coleccion) {
        case 'users':
            searchUsers(termino, res);
            break;

        case 'categories':
            searchCategories(termino, res);
            break;
        case 'products':
            searchProducts(termino, res);
            break;
        default:
            res.status(500).json({
                msg:'Ésta colección no tiene una búsqueda implementada'
            });
            break;
        }

}

export {
    search
}