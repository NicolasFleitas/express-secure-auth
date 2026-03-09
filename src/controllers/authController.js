const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const LoginAttempt = require('../models/LoginAttempt')
const { encrypt } = require('../utils/cryptoUtils')

exports.register = async (req, res) => {
    const { email, password } = req.body
    try {
        const hashedPassword = await bcrypt.hash(password, 10)
        const newUser = await User.create(email, hashedPassword)
        res.status(201).json(newUser)
    } catch (error) {
        res.status(500).json({ error: "Error al registrar usuario" })
    }
}

exports.login = async (req, res) => {
    const { email, password, sessionType } = req.body

    try {
        const user = await User.findByEmail(email)

        if (!user || !(await bcrypt.compare(password, user.password_hash))) {
            await LoginAttempt.create(email, req.ip, false)
            return res.status(401).json({ error: "Crendenciales inválidas" })
        }

        await LoginAttempt.create(email, req.ip, true)

        // Ciframos los datos sensibles
        const secureId = encrypt(user.id.toString())
        const secureEmail = encrypt(user.email)

        const token = jwt.sign(
            {
                sub: secureId,
                mail: secureEmail,
                role: user.role
            },
            process.env.JWT_SECRET,
            { expiresIn: '15m' } // 15 minutos
        )

        const responseData = {
            message: "Login exitoso",
            user: {
                id: user.id,
                email: user.email,
                role: user.role
            }
        }

        const cookieOptions = {
            httpOnly: true, // Protege contra XSS
            secure: process.env.NODE_ENV === 'production', // Solo HTTPS en producción
            sameSite: 'strict', // Protege contra CSRF
        }

        // Si el usuario elige 'cookie' (persistente), le damos una duración de 1 hora
        // Si elige 'jwt' (sesión), no ponemos maxAge para que sea una cookie de sesión
        if (sessionType === 'cookie') {
            cookieOptions.maxAge = 3600000 // 1 hora
        }

        res.cookie('session_token', token, cookieOptions)

        return res.json(responseData)

    } catch (error) {
        console.error("Login Error: ", error)
        res.status(500).json({ error: "Error interno en el servidor" })
    }
}

exports.logout = (req, res) => {
    res.clearCookie('session_token')
    res.json({ message: "Sesión cerrada correctamente" })
}
