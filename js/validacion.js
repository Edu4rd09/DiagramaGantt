document.addEventListener("DOMContentLoaded", function() {
    const form = document.getElementById('form');
    const emailInput = document.getElementById('email-input');
    const passwordInput = document.getElementById('password-input');
    const errorMessage = document.getElementById('error-message');

    form.addEventListener('submit', function(event) {
        event.preventDefault(); // Evita el envío del formulario si hay errores
        
        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();

        // Limpiar mensajes de error previos
        errorMessage.textContent = '';

        // Validar el correo electrónico
        if (!validateEmail(email)) {
            errorMessage.textContent = 'Por favor, introduce un correo electrónico válido.';
            return;
        }

        // Validar la contraseña (mínimo 6 caracteres)
        if (password.length < 6) {
            errorMessage.textContent = 'La contraseña debe tener al menos 6 caracteres.';
            return;
        }

        // Aquí puedes agregar la lógica de autenticación, como revisar contra una base de datos o archivo.
        // Por ejemplo, validar con datos de prueba:
        const usuariosValidos = [
            { email: "user1@gmail.com", password: "123456" },
            { email: "user2@gmail.com", password: "password456" }
        ];

        const usuarioEncontrado = usuariosValidos.find(user => user.email === email && user.password === password);

        if (usuarioEncontrado) {
            window.location.href = 'inicio.html'; // Redirige a la página principal
        } else {
            errorMessage.textContent = 'Correo o contraseña incorrectos.';
        }
    });

    // Función para validar el formato del correo electrónico
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
});
