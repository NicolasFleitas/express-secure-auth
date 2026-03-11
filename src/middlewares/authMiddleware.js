const jwt = require('jsonwebtoken')
const { decrypt } = require('../utils/cryptoUtils')

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization']
    const token = (authHeader && authHeader.split(' ')[1]) || req.cookies.session_token

    if (!token) {
        if (req.accepts('html')) {
            return res.redirect('/api/auth/login')
        }
        return res.status(401).json({ error: "Acceso denegado. Se requiere sesión activa." })
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            // Si el token es inválido o expiró, limpiamos la cookie
            res.clearCookie('session_token')
            
            if (req.accepts('html')) {
                return res.redirect('/api/auth/login')
            }
            return res.status(403).json({ error: "Sesión expirada o inválida" })
        }

        try {
            req.user = {
                id: decrypt(decoded.sub),
                email: decrypt(decoded.mail),
                role: decoded.role
            }
            next()
        } catch (error) {
            res.clearCookie('session_token')
            if (req.accepts('html')) return res.redirect('/api/auth/login')
            return res.status(403).json({ error: "Error de identidad" })
        }
    })
}

module.exports = authenticateToken