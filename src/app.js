const express = require('express')
const authRoutes = require('./routes/authRoutes')

const app = express()
app.use(express.json())

// Prefijo para todas las rutas de auth

app.use('/api/auth', authRoutes)

module.exports = app