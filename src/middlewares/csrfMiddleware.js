const { doubleCsrf } = require('csrf-csrf')

const {
    doubleCsrfProtection,
    generateToken,
} = doubleCsrf({
    getSecret: () => process.env.CSRF_SECRET,
    cookieName: "x-csrf-token",
    cookieOptions: {
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production",
    },
    getTokenFromRequest: (req) => req.headers["x-csrf-token"], // El cliente lo envía aqui
})

module.exports = { doubleCsrfProtection, generateToken }
