let actividadEditando = null; // Variable para almacenar la actividad en edición

document.getElementById('agregar-actividad').addEventListener('click', function() {
    const nombreActividad = document.getElementById('nombre-actividad').value.trim();
    const inicioActividad = parseFloat(document.getElementById('inicio-actividad').value.trim());
    const finActividad = parseFloat(document.getElementById('fin-actividad').value.trim());
    const responsableActividad = document.getElementById('responsable-actividad').value.trim();

    // Validar que los campos no estén vacíos
    if (nombreActividad === '' || isNaN(inicioActividad) || isNaN(finActividad) || responsableActividad === '') {
        alert('Por favor, completa todos los campos.');
        return;
    }

    // Obtener la lista de proyectos guardados y el proyecto actual
    const proyectosGuardados = JSON.parse(localStorage.getItem('proyectos')) || [];
    const proyectoActual = proyectosGuardados[proyectosGuardados.length - 1]; // Asumiendo que es el último proyecto guardado

    let duracionProyectoSegundos = proyectoActual.duracion;
    let unidadProyecto = proyectoActual.unidad;

    // Validar que el fin no exceda la duración del proyecto
    if (finActividad > duracionProyectoSegundos) {
        alert(`El fin de la actividad no puede exceder la duración del proyecto (${duracionProyectoSegundos} segundos).`);
        return;
    }

    // Si estamos editando una actividad
    if (actividadEditando) {
        const filaEditar = actividadEditando.row; // Fila que se está editando
        const nombreAnterior = actividadEditando.nombre; // Nombre anterior de la actividad

        // Actualizar los valores de la fila editada
        filaEditar.cells[0].textContent = nombreActividad;
        filaEditar.cells[1].textContent = inicioActividad;
        filaEditar.cells[2].textContent = finActividad;

        // Calcular la duración de la actividad
        const duracionActividad = finActividad - inicioActividad;

        // Mostrar la duración en la celda correspondiente
        filaEditar.cells[3].textContent = `${duracionActividad} ${unidadProyecto}`;

        // Actualizar la barra del diagrama de Gantt
        const barraGantt = filaEditar.cells[4].querySelector('.barra-gantt');
        const ancho = (duracionActividad / duracionProyectoSegundos) * 100; 
        barraGantt.style.width = `${ancho}%`;

        // Actualizar la actividad en localStorage
        const actividadIndex = proyectoActual.actividades.findIndex(actividad => actividad.nombre === nombreAnterior);
        if (actividadIndex !== -1) {
            proyectoActual.actividades[actividadIndex] = {
                nombre: nombreActividad,
                inicio: inicioActividad,
                fin: finActividad,
                responsable: responsableActividad,
                duracion: duracionActividad
            };
        }

        actividadEditando = null;
        document.getElementById('agregar-actividad').textContent = 'Agregar Actividad';
    } else {
        const tabla = document.getElementById('tabla-actividades').getElementsByTagName('tbody')[0];
        const actividadesEnTabla = Array.from(tabla.rows).map(row => row.cells[0].textContent);

        if (actividadesEnTabla.includes(nombreActividad)) {
            alert('Ya existe una actividad con ese nombre en este proyecto.');
            return;
        }

        const tablaActividades = document.getElementById('tabla-actividades').getElementsByTagName('tbody')[0];
        const nuevaFila = tablaActividades.insertRow();

        const celdaNombre = nuevaFila.insertCell(0);
        const celdaInicio = nuevaFila.insertCell(1);
        const celdaFin = nuevaFila.insertCell(2);
        const celdaDuracion = nuevaFila.insertCell(3);
        const celdaGantt = nuevaFila.insertCell(4);
        const celdaResponsable = nuevaFila.insertCell(5);
        const celdaAcciones = nuevaFila.insertCell(6);

        celdaNombre.textContent = nombreActividad;
        celdaInicio.textContent = inicioActividad;
        celdaFin.textContent = finActividad;

        const duracionActividad = finActividad - inicioActividad;
        celdaDuracion.textContent = `${duracionActividad} ${unidadProyecto}`;

        const barraGantt = document.createElement('div');
        barraGantt.className = 'barra-gantt';
        const ancho = (duracionActividad / duracionProyectoSegundos) * 100;
        barraGantt.style.width = `${ancho}%`;
        barraGantt.style.backgroundColor = 'lightblue';
        barraGantt.style.height = '20px';
        barraGantt.style.borderRadius = '4px';

        const margenIzquierdo = (inicioActividad / duracionProyectoSegundos) * 100;
        barraGantt.style.marginLeft = `${margenIzquierdo}%`;

        celdaGantt.appendChild(barraGantt);
        celdaResponsable.textContent = responsableActividad;

        const btnEliminar = document.createElement('button');
        btnEliminar.textContent = 'Eliminar';
        btnEliminar.onclick = function() {
            const filaEliminar = this.closest('tr');
            const actividadEliminar = filaEliminar.cells[0].textContent;
            filaEliminar.parentNode.removeChild(filaEliminar);

            const actividadIndex = proyectoActual.actividades.findIndex(actividad => actividad.nombre === actividadEliminar);
            if (actividadIndex !== -1) {
                proyectoActual.actividades.splice(actividadIndex, 1);
            }

            localStorage.setItem('proyectos', JSON.stringify(proyectosGuardados));
            alert(`Actividad "${actividadEliminar}" eliminada.`);
        };
        celdaAcciones.appendChild(btnEliminar);

        const btnEditar = document.createElement('button');
        btnEditar.textContent = 'Editar';
        btnEditar.onclick = function() {
            document.getElementById('nombre-actividad').value = nombreActividad;
            document.getElementById('inicio-actividad').value = inicioActividad;
            document.getElementById('fin-actividad').value = finActividad;
            document.getElementById('responsable-actividad').value = responsableActividad;

            document.getElementById('agregar-actividad').textContent = 'Actualizar Actividad';

            actividadEditando = { row: nuevaFila, nombre: nombreActividad };
        };
        celdaAcciones.appendChild(btnEditar);

        document.getElementById('nombre-actividad').value = '';
        document.getElementById('inicio-actividad').value = '';
        document.getElementById('fin-actividad').value = '';
        document.getElementById('responsable-actividad').value = '';

        proyectoActual.actividades.push({
            nombre: nombreActividad,
            inicio: inicioActividad,
            fin: finActividad,
            responsable: responsableActividad,
            duracion: duracionActividad
        });

        localStorage.setItem('proyectos', JSON.stringify(proyectosGuardados));
    }
});
