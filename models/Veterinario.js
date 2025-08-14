import mongoose from "mongoose";
import bcrypt from "bcrypt";
import generarId from "../helpers/generarId.js";

const VeterinarioSchema = mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    telefono: {
        type: String,
        default: null,
        trim: true
    },
    web: {
        type: String,
        default: null
    },
    token: {
        type: String,
        default: generarId()
    },
    confirmado: {
        type: Boolean,
        default: false
    }
});

// Middleware para encriptar la contraseña antes de guardar el veterinario
// "pre" es un hook de Mongoose que se ejecuta antes de guardar el documento
VeterinarioSchema.pre('save', async function(next){
    // Verificamos si la contraseña ha sido modificada
    if(!this.isModified('password')) {
        next() // Si la contraseña no ha sido modificada, no hacemos nada
    }
    // Creamos una varible "salt" que contendrá el valor del salt generado por bcrypt
    // "genSalt" genera un salt aleatorio que se usará para encriptar la contraseña
    const salt = await bcrypt.genSalt(10);
    // Encriptamos la contraseña usando bcrypt y el salt generado
    // "this.password" hace referencia al campo password del esquema Veterinario
    this.password = await bcrypt.hash(this.password, salt);
});

// Método para comprobar si la contraseña proporcionada es correcta
// "comprobarPassword" es un método que creamos en el esquema Veterinario
VeterinarioSchema.methods.comprobarPassword = async function(passwordFormulario){
    // Comparamos la contraseña proporcionada (passwordFormulario) con la almacenada 
    // en la base de datos (this.password)
    return await bcrypt.compare(passwordFormulario, this.password);
}

// Creamos el modelo Veterinario para que se comunique con la Base de Datos en
// donde el primer parametro es el nombre del modelo y el segundo es el esquema
const Veterinario = mongoose.model("Veterinario", VeterinarioSchema);
export default Veterinario;