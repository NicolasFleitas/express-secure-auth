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
        messageDiv.style.display = 'none';
        messageDiv.className = 'message';
        loader.style.display = 'inline-block';
        submitBtn.disabled = true;

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
                messageDiv.textContent = '¡Login exitoso! Redirigiendo...';
                messageDiv.classList.add('success');
                messageDiv.style.display = 'block';

                if (sessionType === 'jwt' && data.token) {
                    localStorage.setItem('token', data.token);
                    console.log('Token JWT guardado:', data.token);
                }

                setTimeout(() => {
                    window.location.href = '/api/auth/profile';
                }, 1500);
            } else {
                messageDiv.textContent = data.error || 'Ocurrió un error al iniciar sesión';
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
