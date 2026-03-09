import { FormUtils } from './form-utils.js';

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const messageDiv = document.getElementById('message');
    const submitBtn = document.getElementById('submitBtn');
    const loader = document.getElementById('loader');

    // Get CSRF token from data attribute on the form
    const csrfToken = loginForm.getAttribute('data-csrf');

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // UI state
        FormUtils.setLoading({ submitBtn, loader, messageDiv }, true);

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const sessionType = document.getElementById('sessionType').value;

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-csrf-token': csrfToken
                },
                body: JSON.stringify({ email, password, sessionType })
            });

            const data = await response.json();

            if (response.ok) {
                FormUtils.showMessage(messageDiv, '¡Login exitoso! Redirigiendo...', 'success');

                setTimeout(() => {
                    window.location.href = '/api/auth/profile';
                }, 1500);
            } else {
                FormUtils.showMessage(messageDiv, data.error || 'Ocurrió un error al iniciar sesión', 'error');
            }
        } catch (error) {
            console.error('Error:', error);
            FormUtils.showMessage(messageDiv, 'Error de conexión con el servidor', 'error');
        } finally {
            FormUtils.setLoading({ submitBtn, loader }, false);
        }
    });
});
