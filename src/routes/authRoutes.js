const express = require('express')
const router = express.Router()
const authController = require('../controllers/authController')
const authenticateToken = require('../middlewares/authMiddleware')
const { authLimiter } = require('../middlewares/rateLimiter')

router.post('/register', authLimiter, authController.register)
router.post('/login', authLimiter, authController.login)

// Ruta de prueba protegida
router.get('/profile', authenticateToken, (req, res) => {
    res.json({ user: req.user })
})

module.exports = router