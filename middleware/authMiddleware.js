import jwt from 'jsonwebtoken';
import Veterinario from '../models/Veterinario.js';

// Función para verificar la autenticación del veterinario
// Esta función se usará como middleware para proteger las rutas que requieren autenticación
const checkAuth = async (req, res, next) => {
    let token;
    // Verificamos si el token está presente en los headers de la solicitud junto con el prefijo 'Bearer'
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1]; // Extraemos el token del header

            // Verificamos el token usando la clave secreta almacenada en las 
            // variables de entorno y lo guardamos en "decoded"
            const decoded = jwt.verify(token, process.env.JWT_SECRET); 

             // Buscamos al veterinario en la base de datos usando el ID del token y excluimos
             // los campos sensibles (password, token, confirmado). Creamos una sesion para el
             // veterinario autenticado y lo asignamos a "req.veterinario"
            req.veterinario = await Veterinario.findById(decoded.id).select(
                '-password -token -confirmado'
            );

            return next(); // Llamamos a next() para continuar con la siguiente función de middleware o ruta

        } catch (error) {
            const e = new Error('Token no válido');
            return res.status(403).json({ msg: e.message });
        }
    }

    // Verificamos si el token no está presente
    if(!token) {
        // Si el token no está presente, enviamos un error 403 (Forbidden) al cliente
        const error = new Error('Token no válido o inexistente');
        res.status(403).json({ msg: error.message });
    }

    next();
};

export default checkAuth;