import "dotenv/config"

export default {
    host: 'db4free.net',
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: 'todoproj'
}