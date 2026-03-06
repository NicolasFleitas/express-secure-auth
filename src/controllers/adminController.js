const User = require('../models/User')

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll()
        res.json({ users })
    } catch (error) {
        res.status(500).json({ error: "Error al obtener usuarios" })
    }
}

exports.deleteUser = async (req, res) => {
    const { id } = req.params

    try {
        const deleted = await User.deleteById(id)

        if (deleted) {
            res.json({ message: `Usuario con ID ${id} eliminado correctamente` })
        } else {
            res.status(404).json({ error: "Usuario no encontrado" })
        }
    } catch (error) {
        res.status(500).json({ error: "Error al eliminar usuario" })
    }
}