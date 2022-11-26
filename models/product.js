import {Schema, model} from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const ProductSchema = Schema({

    name:{
        type: String,
        required: [true, 'El nombre es obligatorio']
    },
    state:{
        type:Boolean,
        default: true,
        required: true
    },
    user:{
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    price:{
        type: Number,
        default: 0
    },
    category:{
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    description:{
        type: String,

    },
    available:{
        type: Boolean,
        default: true
    },
    img:{
        type: String
    }

});

ProductSchema.methods.toJSON = function() {

    //excluimos los parametros que no queremos mostrar del usuario
    const {__v, ...product} = this.toObject();

    return product;

}

// Para usar la paginación del plugin de mongoose MODEL.paginate()
ProductSchema.plugin(mongoosePaginate);

export default model('Product', ProductSchema);