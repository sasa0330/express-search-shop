const express = require("express");
const app = express();
const port = process.env.PORT || 3001;

app.get("/", (req, res) => res.send('Hello'));

// http://localhost:3000/api/v1/list にアクセスしてきたときに
// TODOリストを返す
app.get('/api/todo', (req, res) => {
  // クライアントに送るJSONデータ
  const todoList = [
    { title: 'JavaScriptを勉強する', done: true },
    { title: 'Node.jsを勉強する', done: false },
    { title: 'Web APIを作る', done: false }
  ];

  // JSONを送信する
  res.json(todoList);
});

app.listen(port, () => console.log(`app listening on port ${port}!`));
