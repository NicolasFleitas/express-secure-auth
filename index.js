const express = require('express')
const bcrypt = require('bcrypt')
const { Pool, Connection } = require('pg')
require('dotenv').config()
const jwt = require('jsonwebtoken');

const app = express()
app.use(express.json())

// Configuración de la conexión a PostgreSQL
const pool = new Pool({
    connectionString: process.env.DATABASE_URL
})

// ---- ENDPOINT DE REGISTRO ----
app.post('/register', async (req, res) => {
    const { email, password } = req.body

    if (!email || !password) {
        return res.status(400).json({ error: "Email y password son requeridos" })
    }

    try {
        const userExists = await pool.query('SELECT * FROM users WHERE email = $1', [email])
        if (userExists.rowCount.length > 0) {
            return res.status(400).json({ error: "El usuario ya está registrado" })
        }

        const saltRounds = 10
        const hashedPassword = await bcrypt.hash(password, saltRounds)

        const newUser = await pool.query(
            'INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, email, role',
            [email, hashedPassword]
        )

        res.status(201).json({
            message: "Usuario creado con éxito",
            user: newUser.rows[0]
        })

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error interno en el servidor" })
    }
})
// ---- ENDPOINT DE LOGIN ----
app.post('/login', async (req, res) => {
    const { email, password } = req.body

    try {
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email])
        const user = result.rows[0]

        if (!user) {
            return res.status(401).json({ error: "Credenciales inválidas" })
        }

        const isMatch = await bcrypt.compare(password, user.password_hash)

        if (!isMatch) {
            return res.status(401).json({ error: "Credenciales inválidas" })
        }

        const payload = {
            id: user.id,
            email: user.email,
            role: user.role
        }

        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' })

        res.json({
            message: "Login exitoso",
            token: token
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: "Error en el servidor" })
    }
})

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (!token) {
        return res.status(401).json({ error: "Acceso denegado. Token faltante" })
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decodeUser) => {
        if (err) {
            return res.status(403).json({ error: "Token inválido o expirado" })
        }

        // Si es válido, guarda los datos del usuario en el objeto (req)
        // para que las siguiente funciones puedan usarlos
        req.user = decodeUser
        next() // Continuar al siguiente paso
    })
}

app.get('/profile', authenticateToken, (req, res) => {
    res.json({ message: `Bienvenido usuario ${req.user.email},`, data: req.user })
})

const PORT = 3000;
app.listen(PORT, () => console.log(`App corriendo en el puerto ${PORT}`))