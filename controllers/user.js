import {response, request} from 'express'; // Para asignar el type a la response y que nos ayude con los hints
import User from '../models/user.js';
import bcrypt from 'bcryptjs';
 


const userGet = async(req = request, res = response) => {

    // const{ limite = 5, desde = 0 } = req.query;

    // opciones de paginación
    const opt = {
        page: 1,
        limit: 5,
        customLabels:{
            docs:'usuarios'
        }
    }

    // Filtramos los registros state=false ya que son usuarios "eliminados"
    const usuarios = await User.paginate( {state:true}, opt); 

    res.json(usuarios);
}

const userPost = async(req = request, res = response) => {

    const {nombre, email, password, role} = req.body;
    const usuario = new User({nombre, email, password, role} );

    // Encriptar la contraseña
    const salt = bcrypt.genSaltSync(); //por defecto 10 rondas
    usuario.password = bcrypt.hashSync(password, salt);

    // Guardar en DB
    await usuario.save();

    res.json({
        usuario
    });
}

const userPut = async(req = request, res = response) => {

    const { id } = req.params;

    //El campo _id y google lo descartamos
    const { _id, google, password, ...resto } = req.body;

    //Si modifican la contraseña hay que incriptarla
    if (password){
        const salt = bcrypt.genSaltSync(); //por defecto 10 rondas
        resto.password = bcrypt.hashSync(password, salt);
    }

    const usuario = await User.findByIdAndUpdate(id, resto, {'new':true});

    res.json(usuario);
}

const userDelete = async(req = request, res = response) => {

    const { id } = req.params;

    // Borrar físicamente un registro (perdemps entidad referencial con otras tablas)
    // const usuario = await User.findByIdAndDelete(id);

    const usuario = await User.findByIdAndUpdate(id, {state : false}, {'new':true});
    // const usuarioAutenticado = req.usuario;

    res.json({
        usuario
        // usuarioAutenticado
    });

}

const userPatch = (req = request, res = response) => {
    //TODO:
    res.json({
        msg: 'PATCH user controlador'
    });
}

export {
    userGet,
    userPost,
    userPut,
    userPatch,
    userDelete
}