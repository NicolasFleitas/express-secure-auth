const express = require('express')
const helmet = require('helmet')
const path = require('path')
const cookieParser = require('cookie-parser')
const authRoutes = require('./routes/authRoutes')
const adminRoutes = require('./routes/adminRoutes')

const app = express()
app.use(helmet())
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, '..', 'public')))

// Configurar EJS
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

// Prefijo para todas las rutas de auth

app.use('/api/auth', authRoutes)
app.use('/api/admin', adminRoutes)

module.exports = app