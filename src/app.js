const express = require('express')
const authRoutes = require('./routes/authRoutes')
const adminRoutes = require('./routes/adminRoutes')

const app = express()
app.use(express.json())

// Prefijo para todas las rutas de auth

app.use('/api/auth', authRoutes)
app.use('/api/admin', adminRoutes)

module.exports = app