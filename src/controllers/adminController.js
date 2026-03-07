const User = require('../models/User')
const LoginAttempt = require('../models/LoginAttempt')
const { generateCsrfToken } = require('../middlewares/csrfMiddleware')

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll()
        const loginAttempts = await LoginAttempt.findRecent(20)
        const csrfToken = generateCsrfToken(req, res)

        res.render('admin/users', {
            users,
            loginAttempts,
            csrfToken,
            user: req.user,
            message: req.query.message || null,
            error: req.query.error || null
        })
    } catch (error) {
        console.error("Error in getAllUsers:", error)
        res.status(500).render('error', { error: "Error al obtener usuarios" })
    }
}

exports.deleteUser = async (req, res) => {
    const { id } = req.params

    try {
        const deleted = await User.deleteById(id)

        if (deleted) {
            res.json({ message: 'Usuario eliminado correctamente' })
        } else {
            res.status(404).json({ error: 'Usuario no encontrado' })
        }
    } catch (error) {
        console.error("Error deleting user:", error)
        res.status(500).json({ error: 'Error al eliminar usuario' })
    }
}