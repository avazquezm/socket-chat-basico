import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import routerUser from '../routes/user.js';
import routerAuth from '../routes/auth.js';
import routerCategory from '../routes/category.js';
import routerProduct from '../routes/product.js';
import routerSearch from '../routes/search.js';
import routerUpload from '../routes/upload.js';
import { dbConnection } from '../database/config.js';
import fileupload from 'express-fileupload';
import { socketController } from '../sockets/controller.js';

export default class ServerMain{

    constructor(){
        this.app    = express();
        this.port   = process.env.PORT;
        this.server = createServer(this.app);
        this.io     = new Server(this.server);  

        // Conectar a base de datos
        this.conectarDB();

        // Middlewares 
        this.middlewares();

        // Rutas de mi aplicación
        this.routes();

        // Config Sockets
        this.sockets();
    }

    async conectarDB(){

        await dbConnection();
    }

    middlewares() {

        // CORS
        this.app.use(cors());

        // Lectura y parseo del body
        this.app.use(express.json());

        // Directorio público
        this.app.use(express.static('public'));

        // Carga de archivo
        this.app.use(fileupload({
            useTempFiles : true,
            tempFileDir : '/tmp/',
            createParentPath: true // permite crear la carpeta si no existe
        }));

    }
    

    routes() {
       
        this.app.use('/api/auth', routerAuth);
        this.app.use('/api/buscar', routerSearch);
        this.app.use('/api/categorias', routerCategory);
        this.app.use('/api/file', routerUpload);
        this.app.use('/api/productos', routerProduct);
        this.app.use('/api/usuarios', routerUser);


        
    }

    sockets(){
        
        this.io.on('connection', (socket) => socketController(socket, this.io) );
    }

    listen(){
        this.server.listen(this.port, () => {
            console.log('App listening on port', this.port);
        });
    }

}