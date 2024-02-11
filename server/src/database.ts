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

getTodoById(1);
