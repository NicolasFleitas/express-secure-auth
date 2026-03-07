document.addEventListener('DOMContentLoaded', () => {
    // Event delegation for delete buttons
    document.addEventListener('click', async (e) => {
        if (e.target.classList.contains('delete-btn')) {
            const userId = e.target.getAttribute('data-user-id');
            await deleteUser(userId);
        }
    });
});

async function deleteUser(userId) {
    if (!confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
        return;
    }

    // Obtenemos el token desde el meta tag definido en el HTML
    const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');

    if (!csrfToken) {
        alert('Error de seguridad: Token CSRF no encontrado.');
        return;
    }

    try {
        const response = await fetch(`/api/admin/users/${userId}`, {
            method: 'DELETE',
            headers: {
                'x-csrf-token': csrfToken,
                'Content-Type': 'application/json'
            }
        });

        const data = await response.json();

        if (response.ok) {
            alert(data.message || 'Usuario eliminado');
            window.location.reload();
        } else {
            alert('Error: ' + (data.error || 'No se pudo eliminar el usuario'));
        }
    } catch (error) {
        console.error('Delete Error:', error);
        alert('Error de conexión al intentar eliminar el usuario');
    }
}
