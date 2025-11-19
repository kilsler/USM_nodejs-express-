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
    const offset = (page - 1) * limit;
    limit = Number(limit);
    page = Number(page);
    let query = `
    SELECT 
      t.id,
      t.title,
      t.completed,
      c.name AS category,
      t.due_date
    FROM todos t
    INNER JOIN categories c ON t.category_id = c.id
  `;

    const conditions = [];
    const params = [];

    if (status === 'active') {
        conditions.push('t.completed = FALSE');
    } else if (status === 'completed') {
        conditions.push('t.completed = TRUE');
    }

    if (search) {
        conditions.push('(t.title LIKE ? OR c.name LIKE ?)');
        params.push(`%${search}%`, `%${search}%`);
    }

    if (conditions.length > 0) {
        query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' ORDER BY t.due_date ASC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const [rows] = await pool.query(query, params);
    return rows;
}


export async function getAllByUser(user_id, { limit = 10, page = 1, search = null, status = null } = {}) {
    const offset = (page - 1) * limit;
    limit = Number(limit);
    page = Number(page);
    let query = `
    SELECT 
      t.id,
      t.title,
      t.completed,
      c.name AS category,
      t.due_date
    FROM todos t
    INNER JOIN categories c ON t.category_id = c.id
    WHERE user_id = ?
  `;

    const conditions = [];
    const params = [user_id];

    if (status === 'active') {
        conditions.push('t.completed = FALSE');
    } else if (status === 'completed') {
        conditions.push('t.completed = TRUE');
    }

    if (search) {
        conditions.push('(t.title LIKE ? OR c.name LIKE ?)');
        params.push(`%${search}%`, `%${search}%`);
    }

    if (conditions.length > 0) {
        query += ' AND ' + conditions.join(' AND ');
    }

    query += ' ORDER BY t.due_date ASC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const [rows] = await pool.query(query, params);
    return rows;
}

export async function getByIdToDo(id) {
    const [rows] = await pool.query('SELECT * FROM todos Where id = ?', [id]);
    return rows;
}


export async function addToDo(title, category_id, due_date, user_id) {
    const [result] = await pool.query(
        'INSERT INTO todos (title, completed,category_id,due_date,user_id) VALUES (?, ?, ?, ?, ?)',
        [title, false, category_id, due_date, user_id]
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
