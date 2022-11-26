import {Schema, model} from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const CategorySchema = Schema({

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
    }

});

CategorySchema.methods.toJSON = function() {

    //excluimos los parametros que no queremos mostrar del usuario
    const {__v, ...category} = this.toObject();

    return category;

}

// Para usar la paginación del plugin de mongoose MODEL.paginate()
CategorySchema.plugin(mongoosePaginate);

export default model('Category', CategorySchema);