import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import conectarDB from './config/db.js';
import veterinarioRoutes from './routes/veterinarioRoutes.js';
import pacienteRoutes from './routes/pacienteRoutes.js';

const app = express(); // Creamos una instancia de express y configuramos una ruta básica

app.use(express.json()); // Middleware para parsear el cuerpo de las solicitudes en formato JSON

dotenv.config(); // Cargamos las variables de entorno desde el archivo .env

conectarDB(); // Conectamos a la base de datos

const dominiosPermitidos = [process.env.FRONTEND_URL]; // Lista de dominios permitidos para CORS

const corsOptions = {
    origin: function(origin, callback){
        // Si el "origin" esta registrado en "dominiosPermitidos", permitimos la solicitud
        if(dominiosPermitidos.indexOf(origin) !== -1){
            callback(null, true); // Si el origen está permitido, continuamos
        }else{
            callback(new Error('No permitido por CORS')); // Si no está permitido, lanzamos un error
        }
    }
}

app.use(cors(corsOptions)); // Configuramos CORS para permitir solicitudes desde los dominios especificados

// Configuramos la ruta principal de la API
app.use('/api/veterinarios', veterinarioRoutes);
app.use('/api/pacientes', pacienteRoutes);

const PORT = process.env.PORT || 4000;

// Iniciamos el servidor en el puerto 4000
app.listen(PORT, () => {
    console.log(`Servidor funcionando en el puerto ${PORT}`);
})