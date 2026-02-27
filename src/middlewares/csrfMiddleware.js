const { doubleCsrf } = require('csrf-csrf')

const {
    doubleCsrfProtection,
    generateCsrfToken,
} = doubleCsrf({
    getSecret: () => process.env.CSRF_SECRET,
    // v4 requiere getSessionIdentifier para construir el HMAC del token
    getSessionIdentifier: (req) => req.ip ?? 'anonymous',
    cookieName: "x-csrf-token",
    cookieOptions: {
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production",
    },
    getCsrfTokenFromRequest: (req) => req.headers["x-csrf-token"], // El cliente lo envía aquí
})

module.exports = { doubleCsrfProtection, generateCsrfToken }
