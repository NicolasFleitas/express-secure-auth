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
            messageDiv.textContent = 'Las contraseñas no coinciden';
            messageDiv.className = 'message error';
            messageDiv.style.display = 'block';
            return;
        }

        // UI state
        messageDiv.style.display = 'none';
        messageDiv.className = 'message';
        loader.style.display = 'inline-block';
        submitBtn.disabled = true;

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
                messageDiv.textContent = '¡Registro exitoso! Redirigiendo al login...';
                messageDiv.classList.add('success');
                messageDiv.style.display = 'block';

                setTimeout(() => {
                    window.location.href = '/api/auth/login';
                }, 2000);
            } else {
                messageDiv.textContent = data.error || 'Ocurrió un error al registrarse';
                messageDiv.classList.add('error');
                messageDiv.style.display = 'block';
            }
        } catch (error) {
            console.error('Error:', error);
            messageDiv.textContent = 'Error de conexión con el servidor';
            messageDiv.classList.add('error');
            messageDiv.style.display = 'block';
        } finally {
            loader.style.display = 'none';
            submitBtn.disabled = false;
        }
    });
});
