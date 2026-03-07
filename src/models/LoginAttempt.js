const pool = require('../config/db')

const create = async (email, ipAddress, success) => {
    const result = await pool.query(
        'INSERT INTO login_attempts (email, ip_address, success) VALUES ($1, $2, $3) RETURNING *',
        [email, ipAddress, success]
    )
    return result.rows[0]
}

const findRecent = async (limit = 50) => {
    const result = await pool.query(
        'SELECT * FROM login_attempts ORDER BY created_at DESC LIMIT $1',
        [limit]
    )
    return result.rows
}

const findFailedRecent = async (limit = 20) => {
    const result = await pool.query(
        'SELECT * FROM login_attempts WHERE success = false ORDER BY created_at DESC LIMIT $1',
        [limit]
    )
    return result.rows
}

module.exports = {
    create,
    findRecent,
    findFailedRecent
}
