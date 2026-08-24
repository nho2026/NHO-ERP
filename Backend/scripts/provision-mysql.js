import 'dotenv/config'
import mysql from 'mysql2/promise'

const required = ['MYSQL_ROOT_PASSWORD', 'MYSQL_APP_USER', 'MYSQL_APP_PASSWORD', 'MYSQL_DATABASE']
const missing = required.filter((name) => !process.env[name])
if (missing.length) {
  console.error(`Missing required environment values: ${missing.join(', ')}`)
  console.error('Set them in Backend/.env, then run npm run setup again.')
  process.exit(1)
}

const database = process.env.MYSQL_DATABASE
const appUser = process.env.MYSQL_APP_USER
const appPassword = process.env.MYSQL_APP_PASSWORD
const connection = await mysql.createConnection({
  host: process.env.MYSQL_ROOT_HOST ?? '127.0.0.1',
  user: process.env.MYSQL_ROOT_USER ?? 'root',
  password: process.env.MYSQL_ROOT_PASSWORD,
  multipleStatements: true,
})

try {
  await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database.replaceAll('`', '')}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`)
  await connection.query(`CREATE USER IF NOT EXISTS ?@'localhost' IDENTIFIED BY ?`, [appUser, appPassword])
  await connection.query(`CREATE USER IF NOT EXISTS ?@'127.0.0.1' IDENTIFIED BY ?`, [appUser, appPassword])
  await connection.query(`GRANT ALL PRIVILEGES ON \`${database.replaceAll('`', '')}\`.* TO ?@'localhost'`, [appUser])
  await connection.query(`GRANT ALL PRIVILEGES ON \`${database.replaceAll('`', '')}\`.* TO ?@'127.0.0.1'`, [appUser])
  await connection.query('FLUSH PRIVILEGES')
  console.log(`MySQL database '${database}' and app user '${appUser}' are ready.`)
} finally {
  await connection.end()
}
