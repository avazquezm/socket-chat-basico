import Category from '../models/category.js';
import Product from '../models/product.js';
import Role from '../models/role.js';
import User from '../models/user.js';


const isValidRole = async(role = '') =>{
    const existsRole = await Role.findOne({role});

    if(!existsRole){
        //Lanzamos el error que captura el custom check
        throw new Error(`El rol ${role} no existe`);
    }

    
  return true;
}

const existsEmail = async(email='') =>{
      // Verificar si el correo existe
      const existsEmail = await User.findOne({email}); //buscar en DB si existe un usuario con ese correo

      if(existsEmail){

        throw new Error('Ese correo ya está registrado');
      }

      
  return true;
  
}


const existsUserById = async(id) =>{
    // Verificar si el usuario existe
    const existsUser = await User.findById(id); //buscar en DB si existe un usuario con ese id

    if(!existsUser){

      throw new Error('Ese id de usuario no existe');
    }

    
  return true;

}

const existsCategoryById = async(id) =>{
  // Verificar si el correo existe
  const existsCategory = await Category.findById(id); //buscar en DB si existe un usuario con ese correo

  
  if(!existsCategory){
    
    throw new Error('Ese id de categoria no existe');
  }

  
  return true;

}

const existsProductById = async(id) =>{
  // Verificar si el correo existe
  const existsProduct = await Product.findById(id); //buscar en DB si existe un usuario con ese correo
  
  if(!existsProduct){
    
    throw new Error('Ese id de producto no existe');
  }

  return true;

}

// Validar colecciones permitidas
const allowedCollections = (collection = '', collections = []) => {

  const included = collections.includes(collection);

  if ( !included ){
    throw new Error(`La colección ${collection} no está incluida`);
  }

  return true;

}

export{
    isValidRole,
    existsEmail,
    existsUserById,
    existsCategoryById,
    existsProductById,
    allowedCollections
}
