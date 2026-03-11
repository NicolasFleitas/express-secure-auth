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

// Prefijo para todas las rutas de admin
app.use('/api/admin', adminRoutes)

// Redirigir la raíz al login o al perfil si ya está autenticado
app.get('/', (req, res) => {
    if (req.cookies.session_token) {
        return res.redirect('/api/auth/profile')
    }
    res.redirect('/api/auth/login')
})

module.exports = app