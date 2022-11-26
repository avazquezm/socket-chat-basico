import {Schema, model} from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const UserSchema = Schema({

    nombre:{
        type: String,
        required: [true, 'El nombre es obligatorio']
    },
    email:{
        type: String,
        required: [true, 'El correo es obligatorio'],
        unique: true
    },
    password:{
        type: String,
        required: [true, 'La contraseña es obligatorio']
    },
    img:{
        type: String
    },
    role:{
        type: String,
        required: true,
        enum:['ADMIN_ROLE', 'USER_ROLE', 'VENTAS_ROLE'],
        default: 'USER_ROLE'
    },
    state:{
        type: Boolean,
        default: true
    },
    google:{
        type: Boolean,
        default: false
    }

});


// Sobreescribimos el metodo toJSON de esta clase
// Debe ser una function normal y no de flecha => porque debemos usar el  this.  
UserSchema.methods.toJSON = function() {

    //excluimos los parametros que no queremos mostrar del usuario
    const {__v, password, _id, ...usuario} = this.toObject();

    //modificar nombre _id a uid siempre que regresemos la info del usuario
    usuario.uid = _id;
    
    return usuario;

}

// Para usar la paginación del plugin de mongoose MODEL.paginate()
UserSchema.plugin(mongoosePaginate);

export default model('User', UserSchema);