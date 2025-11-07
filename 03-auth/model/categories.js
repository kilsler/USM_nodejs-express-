import mysql from "mysql2/promise";
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


export async function getAllCategories() {
    const [rows] = await pool.query("SELECT * FROM categories ORDER BY id DESC");
    return rows;
}

export async function getCategoryById(id) {
    const [rows] = await pool.query("SELECT * FROM categories WHERE id = ?", [id]);
    return rows[0];
}

export async function createCategory(name) {
    const [result] = await pool.query(
        "INSERT INTO categories (name) VALUES (?)",
        [name]
    );
    return { id: result.insertId, name };
}

export async function updateCategory(id, name) {
    const [result] = await pool.query(
        "UPDATE categories SET name = ? WHERE id = ?",
        [name, id]
    );
    return result.affectedRows > 0;
}

export async function deleteCategory(id) {
    const [result] = await pool.query("DELETE FROM categories WHERE id = ?", [id]);
    return result.affectedRows > 0;
}
