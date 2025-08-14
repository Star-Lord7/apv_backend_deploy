import express from 'express';
import { 
    registrar, 
    perfil, 
    confirmar, 
    autenticar,
    olvidePassword,
    comprobarToken,
    nuevoPassword,
    actualizarPerfil,
    actualizarPassword
} from '../controllers/veterinarioController.js';
import checkAuth from '../middleware/authMiddleware.js';

const router = express.Router(); // Creamos una instancia del enrutador de Express

// Rutas publicas
router.post('/', registrar); // Ruta para registrar veterinarios
router.get('/confirmar/:token', confirmar); // Ruta para confirmar la cuenta del veterinario usando un token
router.post('/login', autenticar); // Ruta para autenticar al veterinario
router.post('/olvide-password', olvidePassword); // Ruta para solicitar un cambio de contraseña
 // Ruta para comprobar el token y establecer una nueva contraseña
router.route('/olvide-password/:token').get(comprobarToken).post(nuevoPassword);

// Ruta protegida para obtener el perfil del veterinario autenticado
// Usamos el middleware checkAuth para verificar la autenticación del veterinario
router.get('/perfil', checkAuth, perfil);
router.put('/perfil/:id', checkAuth, actualizarPerfil); // Ruta para actualizar el perfil del veterinario autenticado
router.put('/actualizar-password', checkAuth, actualizarPassword); // Ruta para actualizar la contraseña del veterinario autenticado

export default router;