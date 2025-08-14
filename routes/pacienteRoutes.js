import express from 'express';
import { 
    agregarPaciente,
    obtenerPacientes,
    obtenerPaciente,
    actualizarPaciente,
    eliminarPaciente
} from '../controllers/pacienteController.js';
import checkAuth from '../middleware/authMiddleware.js';

const router = express.Router(); // Creamos una instancia del enrutador de Express

// Definimos las rutas para las operaciones de pacientes
router.route('/')
    // Protegemos las rutas con el middleware de autenticación "checkAuth"
    .post(checkAuth, agregarPaciente)
    .get(checkAuth, obtenerPacientes);

// Definimos las rutas para operaciones específicas de un paciente por su ID
router.route('/:id')
    .get(checkAuth, obtenerPaciente)
    .put(checkAuth, actualizarPaciente)
    .delete(checkAuth, eliminarPaciente);

export default router;