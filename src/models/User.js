const pool = require('../config/db')

const create = async (email, passwordHash) => {
    const result = await pool.query(
        'INSERT INTO users (email, password_hash) values ($1, $2) RETURNING id, email, role',
        [email, passwordHash]
    )
    return result.rows[0]
}

const findByEmail = async (email) => {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email])
    return result.rows[0]
}

const findAll = async () => {
    const result = await pool.query('SELECT id, email, role, created_at FROM users')
    return result.rows
}

const deleteById = async (id) => {
    const result = await pool.query('DELETE FROM users WHERE id = $1', [id])
    return result.rowCount > 0
}

module.exports = {
    create,
    findByEmail,
    findAll,
    deleteById
}
