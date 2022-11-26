import { request, response } from "express"

const isAdminRole = (req = request, res = response, next) => {


    // error interno del backend, no debería llegar a null el token
    if ( !req.usuario ){
        return res.status(500).json({
            msg: 'Se quiere validar el rol admin sin token'
        });
    }

    const { role, nombre } = req.usuario;

    if ( role !== 'ADMIN_ROLE' ){
        return res.status(401).json({
            msg: `${nombre} no es un administrador`
        });
    }

    next();

}

// Necesitamos recibir los roles por param y a su vez que funcione como un middleware con re,res y next
// Para eso creamos la funcion con el param roles y dentro devolvemos la funcion que hará de middleware
const hasRole = ( ...roles ) => {

    return (req = request, res = response, next) => {

         // error interno del backend, no debería llegar a null el token
        if ( !req.usuario ){
            return res.status(500).json({
                msg: 'Se quiere validar el rol admin sin token'
            });
        }

        // Comprobar si el rol está permitido
        if ( !roles.includes(req.usuario.role) ){
            return res.status(401).json({
                msg: `El servicio solo es accesible por los roles: ${roles}`
            });
        }

        console.log(roles);
        next();

    }

}

export{
    isAdminRole,
    hasRole
}