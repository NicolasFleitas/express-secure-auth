const express = require('express')
const router = express.Router()
const adminController = require('../controllers/adminController')
const authenticateToken = require('../middlewares/authMiddleware')
const authorizeRoles = require('../middlewares/roleMiddleware')

// Solo los Administradores pueden acceder a estas rutas
// Primero verifica que el token sea valido, LUEGO el rol

router.get('/users',
    authenticateToken,
    authorizeRoles(['admin']),
    adminController.getAllUsers
)

router.delete('/users/:id',
    authenticateToken,
    authorizeRoles(['admin']),
    adminController.deleteUser
)

module.exports = router