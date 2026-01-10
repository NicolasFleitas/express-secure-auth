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

        if (user && await bcrypt.compare(password, user.password_hash)) {
            const token = jwt.sign(
                { id: user.id, email: user.email, role: user.role },
                process.env.JWT_SECRET,
                { expiresIn: '1h' }
            )
            return res.json({ token })
        }
        res.status(401).json({ error: "Crendenciales inválidas" })
    } catch (error) {
        res.status(500).json({ error: "Error en el login" })
    }
}