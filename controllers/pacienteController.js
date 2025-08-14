import Paciente from '../models/Paciente.js';

// Función para agregar un nuevo paciente
const agregarPaciente = async (req, res) => {
    // Creamos una nueva instancia del modelo Paciente con los datos del cuerpo de la solicitud
    const paciente = new Paciente(req.body);
    // Asignamos el ID del veterinario autenticado al campo "veterinario" del paciente
    paciente.veterinario = req.veterinario._id;

    try {
        // Guardamos el paciente en la base de datos
        const pacienteAlmacenado = await paciente.save();
        res.json(pacienteAlmacenado);
    } catch (error) {
        console.error(error);
    }
};

// Función para obtener todos los pacientes del veterinario autenticado
const obtenerPacientes = async (req, res) => {
    // Buscamos todos los pacientes que pertenecen al veterinario autenticado
    // Utilizamos el método find() de Mongoose para buscar pacientes y filtramos por el ID del veterinario
    // Utilizamos el método where() para filtrar los pacientes por el ID del veterinario
    // "req.veterinario._id" es el ID del veterinario autenticado que se asignó en el middleware de autenticación
    const pacientes = await Paciente.find().where('veterinario').equals(req.veterinario._id);
    res.json(pacientes);
}

// Función para obtener un paciente específico por su ID
const obtenerPaciente = async (req, res) => {
    // Obtenemos el ID del paciente de los parámetros de la solicitud
    const { id } = req.params;
    // Buscamos el paciente por su ID
    const paciente = await Paciente.findById(id);

    // Verificamos si el paciente no existe
    if(!paciente){
        return res.status(404).json({ msg: 'Paciente no encontrado' });
    }

    // Verificamos si el paciente no pertenece al veterinario autenticado
    if(paciente.veterinario._id.toString() !== req.veterinario._id.toString()){
        return res.json({ msg: 'Acción no válida' });
    }

    res.json(paciente);
};

// Función para actualizar un paciente existente por su ID
const actualizarPaciente = async (req, res) => {
    // Obtenemos el ID del paciente de los parámetros de la solicitud
    const { id } = req.params;
    // Buscamos el paciente por su ID
    const paciente = await Paciente.findById(id);

    // Verificamos si el paciente no existe
    if(!paciente){
        return res.status(404).json({ msg: 'Paciente no encontrado' });
    }

    // Verificamos si el paciente no pertenece al veterinario autenticado
    if(paciente.veterinario._id.toString() !== req.veterinario._id.toString()){
        return res.json({ msg: 'Acción no válida' });
    }

    //Actualizamos el paciente pasandole los nuevos valores y si no se le pasan, que use los que ya tiene
    paciente.nombre = req.body.nombre || paciente.nombre;
    paciente.propietario = req.body.propietario || paciente.propietario;
    paciente.email = req.body.email || paciente.email;
    paciente.fecha = req.body.fecha || paciente.fecha;
    paciente.sintomas = req.body.sintomas || paciente.sintomas;

    try {
        // Guardamos los cambios del paciente en la base de datos
        const pacienteActualizado = await paciente.save();
        res.json(pacienteActualizado);
    } catch (error) {
        console.log(error);
    }
}

// Función para eliminar un paciente existente por su ID
const eliminarPaciente = async (req, res) => {
    // Obtenemos el ID del paciente de los parámetros de la solicitud
    const { id } = req.params;
    // Buscamos el paciente por su ID
    const paciente = await Paciente.findById(id);

    // Verificamos si el paciente no existe
    if(!paciente){
        return res.status(404).json({ msg: 'Paciente no encontrado' });
    }

    // Verificamos si el paciente no pertenece al veterinario autenticado
    if(paciente.veterinario._id.toString() !== req.veterinario._id.toString()){
        return res.json({ msg: 'Acción no válida' });
    }

    try {
        // Eliminamos el paciente de la base de datos
        await Paciente.deleteOne();
        res.json({ msg: 'Paciente eliminado' });
    } catch (error) {
        console.log(error);
    }
}

export {
    agregarPaciente,
    obtenerPacientes,
    obtenerPaciente,
    actualizarPaciente,
    eliminarPaciente
}