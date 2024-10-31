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

    // Obtener la duración del proyecto y su unidad desde localStorage
    const proyectosGuardados = JSON.parse(localStorage.getItem('proyectos')) || [];
    const proyectoActual = proyectosGuardados[proyectosGuardados.length - 1]; // Asumiendo que es el último proyecto guardado

    // Convertir la duración del proyecto a segundos
    let duracionProyectoSegundos = proyectoActual.duracion;
    let unidadProyecto = proyectoActual.unidad; // Guardamos la unidad del proyecto

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

        // Calcular la duración de la actividad en segundos
        const duracionActividad = finActividad - inicioActividad; // Duración en segundos

        // Verificar que la duración de la actividad no sea negativa
        if (duracionActividad < 0) {
            alert('La duración de la actividad no puede ser negativa. Verifica las fechas de inicio y fin.');
            return;
        }

        // Mostrar la duración en la celda correspondiente (solo número + unidad)
        filaEditar.cells[3].textContent = `${duracionActividad} ${unidadProyecto}`;

        // Actualizar el diagrama de Gantt
        const barraGantt = filaEditar.cells[4].querySelector('.barra-gantt');
        const ancho = (duracionActividad / duracionProyectoSegundos) * 100; // Calcula el ancho como porcentaje
        barraGantt.style.width = `${ancho}%`;

        // Actualizar la actividad en el array de actividades
        const actividadIndex = proyectoActual.actividades.findIndex(actividad => actividad.nombre === nombreAnterior);
        if (actividadIndex !== -1) {
            proyectoActual.actividades[actividadIndex] = {
                nombre: nombreActividad,
                inicio: inicioActividad,
                fin: finActividad,
                responsable: responsableActividad,
                duracion: duracionActividad // Guardar la duración en segundos
            };
        }

        // Limpiar la variable de edición
        actividadEditando = null;
        document.getElementById('agregar-actividad').textContent = 'Agregar Actividad'; // Cambiar el texto del botón de nuevo
    } else {
        // Validar que no haya una actividad con el mismo nombre
        const tabla = document.getElementById('tabla-actividades').getElementsByTagName('tbody')[0];
        const actividadesEnTabla = Array.from(tabla.rows).map(row => row.cells[0].textContent); // Obtener nombres de las actividades en la tabla

        if (actividadesEnTabla.includes(nombreActividad)) {
            alert('Ya existe una actividad con ese nombre en este proyecto.');
            return;
        }

        // Crear una nueva fila para la tabla
        const tablaActividades = document.getElementById('tabla-actividades').getElementsByTagName('tbody')[0];
        const nuevaFila = tablaActividades.insertRow();

        // Insertar celdas en la nueva fila
        const celdaNombre = nuevaFila.insertCell(0);
        const celdaInicio = nuevaFila.insertCell(1);
        const celdaFin = nuevaFila.insertCell(2);
        const celdaDuracion = nuevaFila.insertCell(3);
        const celdaGantt = nuevaFila.insertCell(4); // Nueva celda para el diagrama de Gantt
        const celdaResponsable = nuevaFila.insertCell(5);
        const celdaAcciones = nuevaFila.insertCell(6); // Celda para acciones (botones)

        // Llenar las celdas con los datos de la actividad
        celdaNombre.textContent = nombreActividad;
        celdaInicio.textContent = inicioActividad;
        celdaFin.textContent = finActividad;

        // Calcular la duración de la actividad en segundos
        const duracionActividad = finActividad - inicioActividad; // Duración en segundos

        // Verificar que la duración de la actividad no sea negativa
        if (duracionActividad < 0) {
            alert('La duración de la actividad no puede ser negativa. Verifica las fechas de inicio y fin.');
            return;
        }

        // Mostrar la duración en la celda correspondiente (solo número + unidad)
        celdaDuracion.textContent = `${duracionActividad} ${unidadProyecto}`;

        // Crear una barra para el diagrama de Gantt
        const barraGantt = document.createElement('div');
        barraGantt.className = 'barra-gantt';
        const ancho = (duracionActividad / duracionProyectoSegundos) * 100; // Calcula el ancho como porcentaje
        barraGantt.style.width = `${ancho}%`;
        barraGantt.style.backgroundColor = 'lightblue'; // Color de la barra
        barraGantt.style.height = '20px'; // Altura de la barra
        barraGantt.style.borderRadius = '4px'; // Esquinas redondeadas

        // Establecer un margen izquierdo basado en el inicio de la actividad
        const margenIzquierdo = (inicioActividad / duracionProyectoSegundos) * 100; // Calcula el margen izquierdo como porcentaje
        barraGantt.style.marginLeft = `${margenIzquierdo}%`;

        // Agregar la barra al diagrama de Gantt
        celdaGantt.appendChild(barraGantt);
        celdaResponsable.textContent = responsableActividad;

        // Agregar botón para eliminar la actividad
        const btnEliminar = document.createElement('button');
        btnEliminar.textContent = 'Eliminar';
        btnEliminar.onclick = function() {
            // Eliminar la fila correspondiente
            const filaEliminar = this.closest('tr'); // Obtener la fila más cercana
            const actividadEliminar = filaEliminar.cells[0].textContent; // Obtener el nombre de la actividad

            // Eliminar la fila de la tabla
            filaEliminar.parentNode.removeChild(filaEliminar);

            // También eliminar la actividad del proyecto en localStorage
            const actividadIndex = proyectoActual.actividades.findIndex(actividad => actividad.nombre === actividadEliminar);
            if (actividadIndex !== -1) {
                proyectoActual.actividades.splice(actividadIndex, 1); // Eliminar actividad
            }

            // Guardar de nuevo el proyecto actualizado en localStorage
            localStorage.setItem('proyectos', JSON.stringify(proyectosGuardados));
            alert(`Actividad "${actividadEliminar}" eliminada.`);
        };
        celdaAcciones.appendChild(btnEliminar);

        // Agregar botón para editar la actividad
        const btnEditar = document.createElement('button');
        btnEditar.textContent = 'Editar';
        btnEditar.onclick = function() {
            // Rellenar los campos con la información de la actividad
            document.getElementById('nombre-actividad').value = nombreActividad;
            document.getElementById('inicio-actividad').value = inicioActividad;
            document.getElementById('fin-actividad').value = finActividad;
            document.getElementById('responsable-actividad').value = responsableActividad;

            // Cambiar el texto del botón de agregar a "Actualizar"
            document.getElementById('agregar-actividad').textContent = 'Actualizar Actividad';

            // Almacenar la actividad en edición
            actividadEditando = { row: nuevaFila, nombre: nombreActividad }; // Guardar la fila y el nombre
        };
        celdaAcciones.appendChild(btnEditar);

        // Limpiar los campos de entrada
        document.getElementById('nombre-actividad').value = '';
        document.getElementById('inicio-actividad').value = '';
        document.getElementById('fin-actividad').value = '';
        document.getElementById('responsable-actividad').value = '';

        // Guardar la actividad en localStorage
        proyectoActual.actividades.push({
            nombre: nombreActividad,
            inicio: inicioActividad,
            fin: finActividad,
            responsable: responsableActividad,
            duracion: duracionActividad // Guardar la duración en segundos
        });

        // Guardar de nuevo el proyecto actualizado en localStorage
        localStorage.setItem('proyectos', JSON.stringify(proyectosGuardados));
    }

    document.getElementById('guardar-gantt').addEventListener('click', function() {
        // Ocultar la columna de acciones temporalmente
        const accionesColumnas = document.querySelectorAll('td:nth-child(7), th:nth-child(7)');
        accionesColumnas.forEach(col => col.style.display = 'none');
    
        // Capturar la tabla de actividades sin la columna de acciones
        const tabla = document.getElementById('tabla-actividades');
        html2canvas(tabla).then(canvas => {
            // Restaurar la columna de acciones
            accionesColumnas.forEach(col => col.style.display = '');
    
            // Crear un enlace para descargar la imagen
            const link = document.createElement('a');
            link.href = canvas.toDataURL('image/png');
            link.download = 'diagrama_gantt.png';
            link.click();
        });
    });
});
