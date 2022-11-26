import * as dotenv from 'dotenv'; 
dotenv.config();
import ServerMain from './models/server.js';

import {v2 as cloudinary} from 'cloudinary';
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure:true
    });

const server = new ServerMain();

server.listen();
