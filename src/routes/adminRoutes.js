const express = require('express')
const router = express.Router()
const adminController = require('../controllers/adminController')
const authenticateToken = require('../middlewares/authMiddleware')
const authorizeRoles = require('../middlewares/roleMiddleware')
const { apiLimiter } = require('../middlewares/rateLimiter')
const { doubleCsrfProtection } = require('../middlewares/csrfMiddleware')

// Solo los Administradores pueden acceder a estas rutas
router.use(apiLimiter)

router.get('/users',
    authenticateToken,
    authorizeRoles(['admin']),
    adminController.getAllUsers
)

router.delete('/users/:id',
    doubleCsrfProtection,
    authenticateToken,
    authorizeRoles(['admin']),
    adminController.deleteUser
)

module.exports = router