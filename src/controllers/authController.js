const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../models/User')
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
    const { email, password } = req.body

    try {
        const user = await User.findByEmail(email)

        if (!user || !(await bcrypt.compare(password, user.password_hash))) {
            return res.status(401).json({ error: "Crendenciales inválidas" })
        }

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
            { expiresIn: '1h' }
        )

        // Confuguración de la Cookie Segura
        res.cookie('session_token', token, {
            httpOnly: true, // Protege contra XSS (JS no puede leerla)
            secure: 'strict', // Protege contra CSRF
            maxAge: 3600000 // 1 hora en milisegundos
        })

        return res.json({
            message: "Login exitoso",
            token,
            user: {
                id: user.id,
                email: user.email,
                role: user.role
            }
        })

    } catch (error) {
        console.error("Login Error: ", error)
        res.status(500).json({ error: "Error interno en el servidor" })
    }
}
