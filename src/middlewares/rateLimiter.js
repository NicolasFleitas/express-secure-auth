const rateLimit = require('express-rate-limit')

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 5, // Límite de 5 peticiones por IP
    message: {
        error: "Demasiados intentos de inicio de sesión. Por favor, intente de nuevo en 15 minutos"
    },
    standardHeaders: true, // Retorna info del límite e los headers 'RateLimit-*'
    legacyHeaders: false, // Desactiva los headers 'X-RateLimit-*'
})

// Limitador General: 100 peticiones cada 15 minutos (para evitar DDoS)
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: { error: "Demasiadas peticiones desde esta IP." }
})

module.exports = { authLimiter, apiLimiter }