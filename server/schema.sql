CREATE DATABASE react_native_todo;

USE react-react_native_todo;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255),
  email VARCHAR(255),
  password VARCHAR(255)
)

SHOW TABLES;

CREATE TABLE todos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255),
  completed BOOLEAN DEFAULT false,
  user_id INT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
)

DESCRIBE todos;

CREATE TABLE shared_todos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  todo_id INT,
  user_id INT,
  shared_with_id INT,
  FOREIGN KEY (todo_id) REFERENCES todos(id),
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (shared_with_id) REFERENCES users(id) ON DELETE CASCADE
)

-- insert two users into the users table
INSERT INTO users(name, email, password) VALUES ('Adam', 'user1@example.com', 'password1');
INSERT INTO users(name, email, password) VALUES ('이재하', 'user2@example.com', 'password2');

SELECT * FROM users where id = 2;

-- insert todos into the todos table
INSERT INTO todos (title, user_id) VALUES 
("running", 1),
("presentation", 1),
("shopping", 1),
("reading books", 1),
("riding a bike", 1),
("cooking dinner", 1),
("coding", 1),
("listening a podcase", 1),
("cleaning house", 1),
("sleeping", 1);

-- share todo 1 of user 1 with user2
INSERT INTO shared_todos (todo_id, user_id, shared_with_id)
VALUES(1, 1, 2);

-- get todos including shared todos by id
SELECT todos.*, shared_todos.shared_with_id
FROM todos
LEFT JOIN shared_todos ON todos.id = shared_todos.todo_id
WHERE todos.user_id = [user_id] OR shared_todos.shared_with_id = [user_id];

SELECT todos.*, shared_todos.shared_with_id
FROM todos
LEFT JOIN shared_todos ON todos.id = shared_todos.todo_id
WHERE todos.user_id = 2 OR shared_todos.shared_with_id = 2;