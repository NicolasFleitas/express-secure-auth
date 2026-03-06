const jwt = require('jsonwebtoken')
const { decrypt } = require('../utils/cryptoUtils')

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization']
    // Buscamos el token en la cabecera Authorization O en la cookie session_token
    const token = (authHeader && authHeader.split(' ')[1]) || req.cookies.session_token

    if (!token) return res.status(401).json({ error: "Acceso denegado. Se requiere token o sesión activa." })

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) return res.status(403).json({ error: "Token inválido" })

        try {
            // Deciframos los datos para que req.user sea legible
            req.user = {
                id: decrypt(decoded.sub),
                email: decrypt(decoded.mail),
                role: decoded.role
            }
            next()
        } catch (error) {
            return res.status(403).json({ error: "Fallo en el descifrado de identidad" })
        }
    })
}

module.exports = authenticateToken