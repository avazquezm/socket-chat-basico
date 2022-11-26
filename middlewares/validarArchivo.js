import { request, response } from "express"



const validateFile = (req = request, res = response, next) =>{

    // Comprobamos que venga el objeto files y además que venga nuestro archivo llamado "file"
    if (!req.files || Object.keys(req.files).length === 0 || !req.files.file) {
        return res.status(400).json({
            msg:'No hay archivos para cargar'});
    }

    next();

}


export{
    validateFile
}