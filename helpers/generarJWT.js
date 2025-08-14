import jwt from 'jsonwebtoken';

// Función para generar un token JWT que se usará para autenticar al usuario usando su ID
const generarJWT = (id) => {
    // Usamos la librería jsonwebtoken para firmar el token con el ID del usuario y una clave secreta
    // La clave secreta se almacena en las variables de entorno
    return jwt.sign({id}, process.env.JWT_SECRET,{
        expiresIn: '30d' // El token expirará en 30 días
    });
};

export default generarJWT;