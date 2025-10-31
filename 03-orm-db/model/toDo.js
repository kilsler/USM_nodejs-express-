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


export async function getAllToDo({ limit = 10, page = 1, search = null, status = null } = {}) {
    let query = 'SELECT * FROM todos';
    if (search || status) {
        query += " WHERE "
        if (status === 'active') {
            query += ' completed = false AND';
        } else if (status === 'completed') {
            query += ' WHERE completed = true AND';
        }
        if (search) {
            query += " title LIKE \"%" + search + "%\"";
        }
    }
    query += ' LIMIT ' + limit + ' OFFSET ' + (page - 1) * 10;
    console.log(query)
    const [rows] = await pool.query(query);
    return rows;
}

export async function getByIdToDo(id) {
    const [rows] = await pool.query('SELECT * FROM todos Where id = ?', [id]);
    return rows;
}


export async function addToDo(title, category_id, due_date) {
    const [result] = await pool.query(
        'INSERT INTO todos (title, completed,category_id,due_date) VALUES (?, ?, ?, ?)',
        [title, false, category_id, due_date]
    );
    return { id: result.insertId, title, completed: false };
}

export async function updateToDo(id, { title, completed, category_id, due_date }) {
    const result = await pool.query(
        "UPDATE todos SET title = ?, completed = ?, category_id = ?, due_date = ?  WHERE id = ?",
        [title, completed, category_id, due_date, id]
    )
    return result[0].affectedRows > 0;
}

export async function toggleToDo(id) {
    const [rows] = await pool.query('SELECT completed FROM todos WHERE id = ?', [id]);
    if (rows.length === 0) return null;

    const newStatus = !rows[0].completed;
    await pool.query('UPDATE todos SET completed = ? WHERE id = ?', [newStatus, id]);
    return { id, completed: newStatus };
}

export async function removeToDo(id) {
    const [result] = await pool.query('DELETE FROM todos WHERE id = ?', [id]);
    return result[0].affectedRows > 0;
}
