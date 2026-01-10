const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const pool = require('../config/db')

exports.register = async (req, res) => {
    const { email, password } = req.body
    try {
        const hashedPassword = await bcrypt.hash(password, 10)
        const result = await pool.query(
            'INSERT INTO users (email, password_hash) values ($1, $2) RETURNING id, email, role',
            [email, hashedPassword]
        )
        res.status(201).json(result.rows[0])
    } catch (error) {
        res.status(500).json({ error: "Error al registrar usuario" })
    }
}

exports.login = async (req, res) => {
    const { email, password } = req.body

    try {
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email])
        const user = result.rows[0]

        if (!user && !(await bcrypt.compare(password, user.password_hash))) {
            res.status(401).json({ error: "Crendenciales inválidas" })
        }

        // Generación del JWT
        const payload = {
            id: user.id,
            email: user.email,
            role: user.role
        }

        const token = jwt.sign(
            payload,
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