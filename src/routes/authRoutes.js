const express = require('express')
const router = express.Router()
const authController = require('../controllers/authController')
const authenticateToken = require('../middlewares/authMiddleware')
const { authLimiter, apiLimiter } = require('../middlewares/rateLimiter')
const { doubleCsrfProtection, generateCsrfToken } = require('../middlewares/csrfMiddleware')
const { validateRegister, validateLogin } = require('../middlewares/validatorMiddleWare')

// Limite general para todas las rutas (protección contra saturación)
router.use(apiLimiter)

router.get('/csrf-token', (req, res) => {
    res.json({ csrfToken: generateCsrfToken(req, res) })
})

router.get('/login', (req, res) => {
    const token = generateCsrfToken(req, res)
    res.render('login', { csrfToken: token })
})

router.get('/register', (req, res) => {
    const token = generateCsrfToken(req, res)
    res.render('register', { csrfToken: token })
})

// --- Rutas POST ---

router.post('/register',
    authLimiter,           // 1. Evitar ataques de fuerza bruta/spam
    doubleCsrfProtection,  // 2. Verificar que viene de nuestro sitio
    validateRegister,      // 3. Validar formato de datos
    authController.register
)

router.post('/login',
    authLimiter,
    doubleCsrfProtection,
    validateLogin,
    authController.login
)

router.post('/logout',
    doubleCsrfProtection,
    authController.logout
)

// Ruta de perfil protegida (Vista)
router.get('/profile', authenticateToken, (req, res) => {
    const token = generateCsrfToken(req, res)
    res.render('profile', { user: req.user, csrfToken: token })
})

module.exports = router
