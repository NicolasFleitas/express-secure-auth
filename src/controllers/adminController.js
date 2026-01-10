const pool = require('../config/db')

exports.getAllUsers = async (req, res) => {
    try {
        const result = await pool.query('SELECT id, email, role, created_at FROM users')
        res.json({ users: result.rows })
    } catch (error) {
        res.status(500).json({ error: "Error al obtener usuarios" })
    }
}

exports.deleteUser = async (req, res) => {
    const { id } = req.params

    try {
        await pool.query('DELETE FROM users WHERE id = $1', [id])

        res.json({ message: `Usuario con ID ${id} eliminado correctamente` })
    } catch (error) {
        res.status(500).json({ error: "Error al eliminar usuario" })
    }
}