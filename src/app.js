const express = require('express')
const helmet = require('helmet')
const authRoutes = require('./routes/authRoutes')
const adminRoutes = require('./routes/adminRoutes')

const app = express()
app.use(helmet())
app.use(express.json())

// Prefijo para todas las rutas de auth

app.use('/api/auth', authRoutes)
app.use('/api/admin', adminRoutes)

module.exports = app