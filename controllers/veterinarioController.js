import Veterinario from "../models/Veterinario.js";
import generarJWT from "../helpers/generarJWT.js";
import generarId from "../helpers/generarId.js";
import emailRegistro from "../helpers/emailRegistro.js";
import emailOlvidePassword from "../helpers/emailOlvidePassword.js";

// Función para registrar un veterinario
const registrar = async (req, res) => {
    // Desestructuramos el  cuerpo de la solicitud
    const { email, nombre } = req.body;

    // Prevenir usuarios duplicados
    //Usamos "findOne" para buscar un veterinario con el mismo email ya que permite buscar un documento en la colección
    // y lo asignamos a la variable "existeUsuario"
    const existeUsuario = await Veterinario.findOne({ email });

    // Verificamos si existe un usuario con el mismo email
    if(existeUsuario){
        // Si el usuario ya existe, almacenamos el error en la variable "error"
        const error = new Error('Usuario ya registrado');
        // Y enviamos un error 400 (Bad Request) al cliente con el mensaje de error
        return res.status(400).json({ msg: error.message });
    }

    try {
        //Guardar un Nuevo Veterinario usando "req.body" que contiene los datos del veterinario
        const veterinario = new Veterinario(req.body);

        // Guardamos el veterinario en la base de datos con el método "save" y usamos "await" para esperar la respuesta
        // Si no se usa "await", la respuesta se enviará antes de que se complete la operación de guardado
        const veterinarioGuardado = await veterinario.save();

        // Enviamos el email
        // Llamamos a la función "emailRegistro" para enviar el correo de registro y le pasamos los datos necesarios
        emailRegistro({
            email,
            nombre,
            token: veterinarioGuardado.token
        });

        // Le enviamos la respuesta al cliente con el veterinario guardado
        res.json(veterinarioGuardado);
    } catch (error) {
        console.log(error);
    }
}

const perfil = (req, res) => {
    // Obtenemos el veterinario autenticado de la solicitud ya que la información del veterinario 
    // autenticado se almacena en "req.veterinario" por el middleware "checkAuth"
    const { veterinario } = req;
    res.json(veterinario); // Enviamos la información del veterinario autenticado al cliente
}

// Función para confirmar la cuenta del veterinario
const confirmar = async (req, res) => {
    // Obtenemos el token de la URL desestructurando "req.params" que es donde 
    // se encuentran los parámetros de la ruta
    const { token } = req.params;
    // Buscamos el veterinario con el token proporcionado usando "findOne"
    // y lo almacenamos en la variable "usuarioConfirmar"
    const usuarioConfirmar = await Veterinario.findOne({ token });

    // Verificamos si se encontró el veterinario con el token proporcionado
    if(!usuarioConfirmar) {
        // Si no se encuentra el token, almacenamos el error en la variable "error"
        const error = new Error('Token no válido');
        // Y enviamos un error 404 (Not Found) al cliente con el mensaje de error
        return res.status(404).json({ msg: error.message });
    }

    try {
        // Limpiamos el token al momento de confirmar la cuenta para que no se pueda usar nuevamente
        usuarioConfirmar.token = null; 
        usuarioConfirmar.confirmado = true; // Marcamos al veterinario como confirmado en la BD
        await usuarioConfirmar.save(); // Guardamos los cambios en la base de datos

        res.json({msg: 'Usuario confirmado correctamente'});
    } catch (error) {
        console.log(error);
    }
};

// Función para autenticar al veterinario
const autenticar = async (req, res) => {
    const { email, password } = req.body;

    //Comprobar si un usuario existe usando "findOne" para buscar un veterinario con el email proporcionado
    // y lo asignamos a la variable "usuario"
    const usuario = await Veterinario.findOne({ email })

    // Verificamos si el veterinario existe
    if(!usuario) {
        // Si no se encuentra el veterinario, almacenamos el error en la variable "error"
        const error = new Error('El usuario no existe');
        // Y enviamos un error 404 (Not Found) al cliente con el mensaje de error
        return res.status(404).json({ msg: error.message });
    }

    // Comprobar si el veterinario está confirmado
    if(!usuario.confirmado){
        const error = new Error('Tu cuenta no ha sido confirmada');
        return res.status(403).json({ msg: error.message });
    }

    // Revisar el password
    if(await usuario.comprobarPassword(password)){
        // Autenticar
        res.json({
            _id: usuario.id,
            nombre: usuario.nombre,
            email: usuario.email,
            token: generarJWT(usuario.id)
        }); // Enviamos el usuario autenticado al cliente
    }else{
        const error = new Error('Contraseña incorrecta');
        return res.status(403).json({ msg: error.message });
    }
};

// Función para solicitar un cambio de contraseña
const olvidePassword = async (req, res) => {
    // Desestructuramos el cuerpo de la solicitud para obtener el email
    const { email } = req.body;
    // Buscamos al veterinario con el email proporcionado usando "findOne"
    const existeVeterinario = await Veterinario.findOne({ email });

    // Verificamos si el veterinario existe
    if(!existeVeterinario){
        // Si no se encuentra el usuario, almacenamos el error en la variable "error"
        const error = new Error('El usuario no existe');
        return res.status(404).json({ msg: error.message });
    }

    try {
        existeVeterinario.token = generarId(); // Generamos un nuevo token usando la función "generarId"
        await existeVeterinario.save(); // Guardamos el veterinario con el nuevo token en la base de datos

        // Enviamos un Email con instrucciones
        emailOlvidePassword({
            email,
            nombre: existeVeterinario.nombre,
            token: existeVeterinario.token
        })

        res.json({ msg: 'Hemos enviado un email con las instrucciones' });
    } catch (error) {
        console.log(error);
    }
}

// Función para comprobar el token y permitir establecer una nueva contraseña
const comprobarToken = async (req, res) => {
    // Obtenemos el token de la URL desestructurando "req.params"
    const token = req.params.token;

    // Buscamos al usuario con el token proporcionado usando "findOne"
    const tokenValido = await Veterinario.findOne({ token });

    // Verificamos si el token es válido
    if(tokenValido){
        //El token es valido y el usuario existe
        res.json({ msg: 'Token válido y el usuario existe'});
    }else{
        const error = new Error('Token no válido');
        return res.status(404).json({ msg: error.message });
    }
}

// Función para establecer una nueva contraseña
const nuevoPassword = async (req, res) => {
    console.log("BODY RECIBIDO:", req.body);
    // Obtenemos el token de la URL desestructurando "req.params"
    const {token} = req.params;

    const { password } = req.body; // Obtenemos la nueva contraseña del cuerpo de la solicitud

    const veterinario = await Veterinario.findOne({ token }); // Buscamos al veterinario con el token proporcionado

    // Verificamos si el veterinario no existe
    if(!veterinario){
        const error = new Error('Hubo un error');
        return res.status(400).json({ msg: error.message });
    }

    try {
        veterinario.token = null; // Limpiamos el token para que no se pueda usar nuevamente
        veterinario.password = password; // Establecemos la nueva contraseña
        await veterinario.save(); // Guardamos los cambios en la base de datos
        res.json({ msg: 'Contraseña modificada correctamente' }); // Enviamos una respuesta al cliente
    } catch (error) {
        console.log(error);
    }
}

// Función para actualizar el perfil
const actualizarPerfil = async (req, res) => {
    // Buscamos al veterinario por su ID
    const veterinario = await Veterinario.findById(req.params.id);
    if(!veterinario){
        const error = new Error('Hubo un error al actualizar el perfil');
        return res.status(404).json({ msg: error.message });
    }

    // Verificamos si el email ya esta en uso
    const { email } = req.body;
    if(veterinario.email !== email){
        const existeEmail = await Veterinario.findOne({ email });
        if(existeEmail){
            const error = new Error('Ese email ya está en uso');
            return res.status(400).json({ msg: error.message });
        }
    }

    try {
        veterinario.nombre = req.body.nombre; // Asignamos el nombre
        veterinario.email = req.body.email; // Asignamos el email
        veterinario.web = req.body.web; // Asignamos la web
        veterinario.telefono = req.body.telefono; // Asignamos el teléfono

        const veterinarioActualizado = await veterinario.save(); // Guardamos los cambios
        res.json(veterinarioActualizado);
    } catch (error) {
        console.log(error);
    }
}

const actualizarPassword = async (req, res) => {
    //Leemos los datos
    const { id } = req.veterinario; // Obtenemos el ID del veterinario autenticado desde "req.veterinario"
    const { pwd_actual, pwd_nuevo } = req.body;

    //Comprobamos que el veterinario exista
    const veterinario = await Veterinario.findById(id);
    if(!veterinario){
        const error = new Error('Hubo un erro');
        return res.status(404).json({ msg: error.message });
    }

    // Comprobamos su password
    if(await veterinario.comprobarPassword(pwd_actual)){
        //Almacenamos el nuevo password
        veterinario.password = pwd_nuevo;
        await veterinario.save();
        res.json({ msg: 'Password actualizado correctamente' });
    }else{
        const error = new Error('El Password actual es incorrecto');
        return res.status(404).json({ msg: error.message });
    }

}

export {
    registrar,
    perfil,
    confirmar,
    autenticar,
    olvidePassword,
    comprobarToken,
    nuevoPassword,
    actualizarPerfil,
    actualizarPassword
}