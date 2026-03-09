const { body, validationResult } = require('express-validator')

// Middleware común para manejar los errores de validación
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }
    next()
}

const validateRegister = [
    body('email').isEmail().withMessage('Email no válido').normalizeEmail().trim(),
    body('password').isLength({ min: 8 }).withMessage('La contraseña debe tener al menos 8 caracteres').escape().trim(),
    handleValidationErrors
]

const validateLogin = [
    body('email').isEmail().normalizeEmail().trim(),
    body('password').escape().trim(),
    body('sessionType').optional().isIn(['cookie', 'jwt']).withMessage('Tipo de sesión no válido'),
    handleValidationErrors
]

module.exports = { validateRegister, validateLogin }