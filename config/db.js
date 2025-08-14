// Importamos el ORM "mongoose" para manejar la conexión a MongoDB
import mongoose from "mongoose";

// Creamos una función asíncrona para conectar a la base de datos
const conectarDB = async () => {
    try {
        // Intentamos realizar la conexión a la base de datos usando la url de MongoDB
        const db = await mongoose.connect(process.env.MONGO_URI, {
            // Parametros de configuración para la conexión
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        // Creamos una constante para la URL de conexión
        const url = `${db.connection.host}:${db.connection.port}`;
        console.log(`Conectado a la base de datos en: ${url}`);
    } catch (error) {
        console.error("Error al conectar a la base de datos:", error);
        process.exit(1);
    }
};

export default conectarDB;