import mongoose from 'mongoose';

const pacienteSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
    },
    propietario: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    fecha: {
        type: Date,
        required: true,
        default: Date.now,
    },
    sintomas: {
        type: String,
        required: true,
    },
    veterinario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Veterinario',
    }
},{
    timestamps: true,
});

// Creamos el modelo Paciente para que se comunique con la Base de Datos en
// donde el primer parametro es el nombre del modelo y el segundo es el esquema
const Paciente = mongoose.model('Paciente', pacienteSchema);
export default Paciente;