const express = require('express');
const fs = require('fs');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

const dataFilePath = path.join(__dirname, 'data.json');

// Отдать HTML
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Получить все задачи
app.get('/todos', (req, res) => {
  const todos = JSON.parse(fs.readFileSync(dataFilePath, 'utf8'));
  res.json(todos);
});

// Добавить задачу
app.post('/todos', (req, res) => {
  const todos = JSON.parse(fs.readFileSync(dataFilePath, 'utf8'));
  const newTodo = {
    id: Date.now(),
    text: req.body.text,
    done: false
  };
  todos.push(newTodo);
  fs.writeFileSync(dataFilePath, JSON.stringify(todos, null, 2));
  res.json(newTodo);
});

// Удалить задачу
app.delete('/todos/:id', (req, res) => {
  let todos = JSON.parse(fs.readFileSync(dataFilePath, 'utf8'));
  todos = todos.filter(todo => todo.id !== Number(req.params.id));
  fs.writeFileSync(dataFilePath, JSON.stringify(todos, null, 2));
  res.json({ message: 'Deleted' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running http://localhost:${PORT}`));
