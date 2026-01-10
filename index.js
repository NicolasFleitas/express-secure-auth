const express = require('express')
const bcrypt = require('bcrypt')
const { Pool, Connection } = require('pg')
require('dotenv').config()

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

const PORT = 3000;
app.listen(PORT, () => console.log(`App corriendo en el puerto ${PORT}`))