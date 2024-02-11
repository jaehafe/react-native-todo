import express, { NextFunction, Request, Response } from 'express';
import {
  getTodo,
  shareTodo,
  deleteTodo,
  getTodosByID,
  createTodo,
  toggleCompleted,
  getUserByEmail,
  getUserByID,
  getSharedTodoByID,
} from './database';
import bodyParser from 'body-parser';
import cors from 'cors';

const corsOptions = {
  origin: 'http://127.0.0.1:5173',
  credentials: true,
};

const developers = [
  { id: 1, name: 'John Doe', apiKey: 'abcdef123456' },
  { id: 2, name: 'Jane Doe', apiKey: 'ghijkl789012' },
];

interface CustomRequest extends Request {
  developer?: { id: number; name: string; apiKey: string };
}

const ckeckApiKey = (req: CustomRequest, res: Response, next: NextFunction) => {
  const apiKey = req.headers['x-api-key'];
  const developer = developers.find((d) => d.apiKey === apiKey);
  if (!developer) {
    return res.status(401).json({ message: 'Unauthorized, invalid Api Key' });
  }
  req.developer = developer;

  next();
};

const app = express();
app.use(bodyParser.json());
app.use(express.json());
app.use(cors(corsOptions));
// app.use(ckeckApiKey);

app.get('/todos/:id', async (req, res) => {
  const todos = await getTodosByID(Number(req.params.id));
  res.status(200).send(todos);
});

app.get('/todos/shared_todos/:id', async (req, res) => {
  const todo = await getSharedTodoByID(req.params.id);
  const author = await getUserByID(todo.user_id);
  const shared_with = await getUserByID(todo.shared_with_id);
  res.status(200).send({ author, shared_with });
});

app.get('/users/:id', async (req, res) => {
  const user = await getUserByID(req.params.id);
  res.status(200).send(user);
});

app.put('/todos/:id', async (req, res) => {
  const { value } = req.body;
  const todo = await toggleCompleted(req.params.id, value);
  res.status(200).send(todo);
});

app.delete('/todos/:id', async (req, res) => {
  await deleteTodo(req.params.id);
  res.send({ message: 'Todo deleted successfully' });
});

app.post('/todos/shared_todos', async (req, res) => {
  const { todo_id, user_id, email } = req.body;
  // const { todo_id, user_id, shared_with_id } = req.body;
  const userToShare = await getUserByEmail(email);
  const sharedTodo = await shareTodo(todo_id, user_id, userToShare.id);
  res.status(201).send(sharedTodo);
});

app.get('/todos/:id', async (req, res) => {
  const id = req.params.id;
  const todo = await getTodo(Number(id));
  res.status(200).send(todo);
});

app.post('/todos', async (req, res) => {
  const { user_id, title } = req.body;
  const todo = await createTodo(user_id, title);
  res.status(201).send(todo);
});

app.listen(8080, () => {
  console.log('Server running on port 8080');
});
