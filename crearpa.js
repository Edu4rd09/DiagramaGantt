function guardarProyecto(event) {
    event.preventDefault(); // Evitar el envío del formulario

    const nombreProyecto = document.getElementById('nombreProyecto').value.trim().toLowerCase(); // Convertir a minúsculas
    const duracion = parseFloat(document.getElementById('duracion').value.trim());
    const unidadTiempo = document.getElementById('unidadTiempo').value;

    // Obtener proyectos guardados del localStorage
    const proyectosGuardados = JSON.parse(localStorage.getItem('proyectos')) || [];

    // Validar que no haya un proyecto con el mismo nombre
    const proyectoExistente = proyectosGuardados.find(proyecto => proyecto.nombre.toLowerCase() === nombreProyecto);
    if (proyectoExistente) {
        alert('Ya existe un proyecto con ese nombre.');
        return;
    }

    // Crear un nuevo proyecto
    const nuevoProyecto = {
        nombre: nombreProyecto,
        fechaCreacion: new Date().toISOString(), // Agregar fecha de creación
        duracion: duracion,
        unidad: unidadTiempo,
        actividades: [] // Inicializar la lista de actividades
    };

    // Guardar el nuevo proyecto en localStorage
    proyectosGuardados.push(nuevoProyecto);
    localStorage.setItem('proyectos', JSON.stringify(proyectosGuardados));

    // Redirigir a agregar actividades
    window.location.href = 'agregar_actividades.html';
}
