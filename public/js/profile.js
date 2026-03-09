document.addEventListener('DOMContentLoaded', () => {
    const logoutBtn = document.getElementById('logoutBtn');

    if (logoutBtn) {
        logoutBtn.addEventListener('click', async () => {
            try {
                const response = await fetch('/api/auth/logout', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-csrf-token': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
                    }
                });
                if (response.ok) {
                    localStorage.removeItem('token');
                    window.location.href = '/api/auth/login';
                } else {
                    console.error('Error al cerrar sesión:', response.statusText);
                }
            } catch (error) {
                console.error('Error al cerrar sesión:', error);
            }
        });
    }
});
