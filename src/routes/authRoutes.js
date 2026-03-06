const express = require('express')
const router = express.Router()
const authController = require('../controllers/authController')
const authenticateToken = require('../middlewares/authMiddleware')
const { authLimiter } = require('../middlewares/rateLimiter')
const { doubleCsrfProtection, generateCsrfToken } = require('../middlewares/csrfMiddleware')
const { validateRegister, validateLogin } = require('../middlewares/validatorMiddleWare')

router.get('/csrf-token', (req, res) => {
    res.json({ csrfToken: generateCsrfToken(req, res) })
})

router.post('/register',
    doubleCsrfProtection,
    validateRegister,
    authLimiter,
    authController.register
)
router.post('/login', doubleCsrfProtection, validateLogin, authLimiter, authController.login)
router.post('/logout', authController.logout)

// Ruta de prueba protegida
router.get('/profile', authenticateToken, (req, res) => {
    res.json({ user: req.user })
})

module.exports = router