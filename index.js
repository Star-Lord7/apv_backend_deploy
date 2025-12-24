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

const dominiosPermitidos = [process.env.FRONTEND_URL];

const corsOptions = {
    origin: function (origin, callback) {

        // Permitir solicitudes sin origen (como las realizadas desde Postman o curl)
        if (!origin) {
            return callback(null, true);
        }

        // Verificamos si el origen de la solicitud está en la lista de dominios permitidos
        if (dominiosPermitidos.includes(origin)) {
            return callback(null, true);
        }

        callback(new Error('No permitido por CORS'));
    }
};

app.use(cors(corsOptions)); // Configuramos CORS para permitir solicitudes desde los dominios especificados

// Configuramos la ruta principal de la API
app.use('/api/veterinarios', veterinarioRoutes);
app.use('/api/pacientes', pacienteRoutes);

const PORT = process.env.PORT || 4000;

// Iniciamos el servidor en el puerto 4000
app.listen(PORT, () => {
    console.log(`Servidor funcionando en el puerto ${PORT}`);
})