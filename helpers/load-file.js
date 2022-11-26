import path from 'path';
import {fileURLToPath} from 'url';
import {v4 as uuidv4} from 'uuid';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const loadFile = ( files, extValidas, folder = '' ) =>{

    return new Promise( (resolve, reject) =>{
    
        const file = files.file;

        const ext = file.name.split('.').at(-1);

        // const extValidas = ['png', 'jpg', 'jpeg'];


        // Validar extension del archivo
        if(!extValidas.includes(ext)){

            return reject(`La extension ${ext} no está soportada`);
        }

        // console.log(ext);

        const hashName = uuidv4() + '.' + ext;

        const uploadPath = path.join( __dirname, '../uploads/', folder, hashName);
    
        file.mv(uploadPath, (err) => {

            if (err) {
                return reject(err);
            }
        
            resolve(hashName)

        });
    });

}


export{
    loadFile
}