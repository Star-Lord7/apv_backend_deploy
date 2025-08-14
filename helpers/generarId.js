const generarId = () => {
    // Genera un ID único basado en la fecha actual y un número aleatorio
    return Date.now().toString(32) + Math.random().toString(32).substring(2);
};

export default generarId;