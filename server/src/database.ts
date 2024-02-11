import mysql, { ResultSetHeader } from 'mysql2';
import dotenv from 'dotenv';
dotenv.config();

const pool = mysql
  .createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
  })
  .promise();

export async function getTodosByID(id: number) {
  const [rows] = await pool.query(
    `
      SELECT todos.*, shared_todos.shared_with_id
      FROM todos
      LEFT JOIN shared_todos ON todos.id = shared_todos.todo_id
      WHERE todos.user_id = ? OR shared_todos.shared_with_id = ?
    `,
    [id, id]
  );
  return rows;
}

export async function getTodo(id: number) {
  const [rows] = await pool.query(`SELECT * FROM todos WHERE id = ?`, [id]);
  return rows[0];
}

export async function getTodoById(id: number) {
  const [row] = await pool.query(`SELECT * FROM todos WHERE id = ?`, [id]);

  return row[0];
}

export async function shareTodo(todo_id: string, user_id: string, shared_with_id: string) {
  const [result] = await pool.query<ResultSetHeader>(
    `
    INSERT INTO shared_todos (todo_id, user_id, shared_with_id)
    VALUES(?, ?, ?);
    `,
    [todo_id, user_id, shared_with_id]
  );
  return result.insertId;
}

export async function getSharedTodoByID(id: string) {
  const [rows] = await pool.query(`SELECT * FROM shared_todos WHERE todo_id = ?`, [id]);
  return rows[0];
}

export async function getUserByID(id: string) {
  const [rows] = await pool.query(`SELECT * FROM users WHERE id = ?`, [id]);
  return rows[0];
}

export async function getUserByEmail(email: string) {
  const [rows] = await pool.query(`SELECT * FROM users WHERE email = ?`, [email]);
  return rows[0];
}

export async function createTodo(user_id: string, title: string) {
  const [result] = await pool.query<ResultSetHeader>(
    `
    INSERT INTO todos (user_id, title)
    VALUES (?, ?)
  `,
    [user_id, title]
  );
  const todoID = result.insertId;
  return getTodo(todoID);
}

export async function deleteTodo(id) {
  const [result] = await pool.query(
    `
    DELETE FROM todos WHERE id = ?;
    `,
    [id]
  );
  return result;
}

export async function toggleCompleted(id, value) {
  const newValue = value === true ? 'TRUE' : 'FALSE';
  const [result] = await pool.query(
    `
    UPDATE todos
    SET completed = ${newValue} 
    WHERE id = ?;
    `,
    [id]
  );
  return result;
}
