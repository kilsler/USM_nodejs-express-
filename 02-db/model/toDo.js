import mysql from 'mysql2/promise';
import dotenv from "dotenv";
dotenv.config();

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306,
    waitForConnections: true,
    queueLimit: 0,
});
console.log('Подключение к БД:', {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_NAME
});

export async function getAll(status = 'all') {
    let query = 'SELECT * FROM todos';
    if (status === 'active') {
        query += ' WHERE completed = false';
    } else if (status === 'completed') {
        query += ' WHERE completed = true';
    }

    const [rows] = await pool.query(query);
    return rows;
}

export async function add(title) {
    const [result] = await pool.query(
        'INSERT INTO todos (title, completed) VALUES (?, ?)',
        [title, false]
    );
    return { id: result.insertId, title, completed: false };
}

export async function toggle(id) {
    const [rows] = await pool.query('SELECT completed FROM todos WHERE id = ?', [id]);
    if (rows.length === 0) return null;

    const newStatus = !rows[0].completed;
    await pool.query('UPDATE todos SET completed = ? WHERE id = ?', [newStatus, id]);
    return { id, completed: newStatus };
}

export async function remove(id) {
    const [result] = await pool.query('DELETE FROM todos WHERE id = ?', [id]);
    return result.affectedRows > 0;
}

////////
import pool from '../db/pool.js';

export async function getAllUsers() {
  const res = await pool.query('SELECT * FROM users');
  return res.rows;
}

export async function getUserById(id) {
  const res = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
  return res.rows[0]; // возвращаем первый (и единственный) результат
}

export async function addUser(name, email) {
  await pool.query('INSERT INTO users (name, email) VALUES ($1, $2)', [name, email]);
}

export async function getUserById(id) {
  const res = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
  return res.rows[0]; // возвращаем первый (и единственный) результат
}

export async function updateUser(id, name, email) {
  await pool.query('UPDATE users SET name = $1, email = $2 WHERE id = $3', [name, email, id]);
}