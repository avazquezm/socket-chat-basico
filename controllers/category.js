import { request, response } from "express";
import Category from "../models/category.js";


const obtenerCategorias = async(req = request, res = response) => {

    // opciones de paginación
    const opt = {
        page: 1,
        limit: 5,
        customLabels:{
            docs:'categorias'
        },
        populate: {
            path: 'user',
            select: 'nombre'
        }
    }

    //populate(join) obtebemos el User y además seleccionamos solo el nombre

    // Filtramos los registros state=false ya que son "eliminados"
    const categorias = await Category.paginate( {state:true}, opt);

    res.json(categorias);
}

const obtenerCategoria = async(req = request, res = response) => {

    const id = req.params.id;

    const category = await Category.findById(id).populate('user','nombre');

    res.json(category);
}

const crearCategoria = async (req = request, res = response) =>{

    const name = req.body.name.toUpperCase();

    const categoryDB = await Category.findOne({name});

    if (categoryDB){

        return res.status(400).json({
            msg: `La categoria ${ name } ya existe`
        });

    }

    // generar valores a guardar
    const data = {
        name,
        user: req.usuario._id
    }

    const category = new Category(data);

    // Guardat DB
    await category.save();

    res.status(201).json(category);
}

const actualizarCategoria = async(req = request, res = response) => {

    const id = req.params.id;
    const name = req.body.name.toUpperCase();

    const categoria = await Category.findByIdAndUpdate(id, {name}, {'new':true});

    res.json(categoria);
}

const borrarCategoria =  async(req = request, res = response) => {

    const { id } = req.params;

    const categoria = await Category.findByIdAndUpdate(id, {state : false}, {'new':true});

    res.json(categoria);

}

export{
    crearCategoria,
    obtenerCategorias,
    obtenerCategoria,
    actualizarCategoria,
    borrarCategoria
}