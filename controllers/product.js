import { request, response } from "express";
import Product from "../models/product.js";


const obtenerProductos = async(req = request, res = response) => {

    // opciones de paginación
    const opt = {
        page: 1,
        limit: 5,
        customLabels:{
            docs:'productos'
        },
        populate: [{
            path: 'user',
            select: 'nombre'
        },
        {
            path: 'category',
            select: 'name'
        }]
    }

    //populate(join) obtebemos el User y además seleccionamos solo el nombre

    // Filtramos los registros state=false ya que son "eliminados"
    const productos = await Product.paginate( {state:true}, opt);

    res.json(productos);
}

const obtenerProducto = async(req = request, res = response) => {


    const id = req.params.id;

    const product = await Product.findById(id)
                                .populate('user','nombre')
                                .populate('category','name');

    res.json(product);
}

const crearProducto = async (req = request, res = response) =>{

    // descartamos campos que no queremos
    const {state, user, name, ...body} = req.body;

    const upperName = name.toUpperCase();

    const productDB = await Product.findOne({name: upperName, state:true});

    if (productDB){

        return res.status(400).json({
            msg: `El producto ${ upperName } ya existe`
        });

    }

    // generar valores a guardar
    const data = {
        name: upperName,
        user: req.usuario._id,
        ...body
    }

    const product = new Product(data);

    // Guardat DB
    await product.save();

    res.status(201).json(product);
}

const actualizarProducto = async(req = request, res = response) => {

    const id = req.params.id;
    const {state, user, ...body} = req.body;

    if(body.name){

        body.name = body.name.toUpperCase();
    }

    const product = await Product.findByIdAndUpdate(id, {...body}, {'new':true});

    res.json(product);
}

const borrarProducto =  async(req = request, res = response) => {

    const { id } = req.params;

    const product = await Product.findByIdAndUpdate(id, {state : false}, {'new':true});

    res.json(product);

}

export{
    crearProducto,
    obtenerProductos,
    obtenerProducto,
    actualizarProducto,
    borrarProducto
}