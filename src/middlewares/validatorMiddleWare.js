const { body, validationResult } = require('express-validator')

// Middleware común para manejar los errores de validación
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        // Enviar tanto la lista completa como el primer error como 'error' para compatibilidad con el frontend
        const errorList = errors.array()
        return res.status(400).json({ 
            error: errorList[0].msg, 
            errors: errorList 
        })
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