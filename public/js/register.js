import { FormUtils } from './form-utils.js';

document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('registerForm');
    const messageDiv = document.getElementById('message');
    const submitBtn = document.getElementById('submitBtn');
    const loader = document.getElementById('loader');

    // Get CSRF token from data attribute on the form
    const csrfToken = registerForm.getAttribute('data-csrf');

    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        // basic validation
        if (password !== confirmPassword) {
            FormUtils.showMessage(messageDiv, 'Las contraseñas no coinciden', 'error');
            return;
        }

        // UI state
        FormUtils.setLoading({ submitBtn, loader, messageDiv }, true);

        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-csrf-token': csrfToken
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (response.ok) {
                FormUtils.showMessage(messageDiv, '¡Registro exitoso! Redirigiendo al login...', 'success');

                setTimeout(() => {
                    window.location.href = '/api/auth/login';
                }, 2000);
            } else {
                FormUtils.showMessage(messageDiv, data.error || 'Ocurrió un error al registrarse', 'error');
            }
        } catch (error) {
            console.error('Error:', error);
            FormUtils.showMessage(messageDiv, 'Error de conexión con el servidor', 'error');
        } finally {
            FormUtils.setLoading({ submitBtn, loader }, false);
        }
    });
});
