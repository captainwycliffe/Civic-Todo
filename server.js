const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const { db, initializeDB } = require("./db/database");
const todoRoutes = require("./routes/todoRoutes");

dotenv.config();

const app = express();

app.use(cors());
app.use(bodyParser.json());

initializeDB();

app.use("/api/todos", todoRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

app.get("/", (req, res) => {
  res.send("Welcome to the To-Do List API");
});

app.get("/todos", (req, res) => {
  db.all("SELECT * FROM todos", (err, rows) => {
    if (err) {
      res.status(500).json({ error: "Failed to retrieve todos" });
    } else {
      res.json(rows);
    }
  });
});

app.get("/todos/:id", (req, res) => {
  const { id } = req.params;
  db.get("SELECT * FROM todos WHERE id = ?", [id], (err, row) => {
    if (err) {
      res.status(500).json({ error: "Failed to retrieve the todo" });
    } else if (!row) {
      res.status(404).json({ error: "Todo not found" });
    } else {
      res.json(row);
    }
  });
});

app.post("/todos", (req, res) => {
  const { title, completed } = req.body;
  const query = "INSERT INTO todos (title, completed) VALUES (?, ?)";
  db.run(query, [title, completed ? 1 : 0], function (err) {
    if (err) {
      res.status(500).json({ error: "Failed to create todo" });
    } else {
      res.status(201).json({ id: this.lastID, title, completed });
    }
  });
});

app.put("/todos/:id", (req, res) => {
  const { id } = req.params;
  const { title, completed } = req.body;
  const query = "UPDATE todos SET title = ?, completed = ? WHERE id = ?";
  db.run(query, [title, completed ? 1 : 0, id], function (err) {
    if (err) {
      res.status(500).json({ error: "Failed to update todo" });
    } else if (this.changes === 0) {
      res.status(404).json({ error: "Todo not found" });
    } else {
      res.json({ id, title, completed });
    }
  });
});

app.delete("/todos/:id", (req, res) => {
  const { id } = req.params;
  const query = "DELETE FROM todos WHERE id = ?";
  db.run(query, [id], function (err) {
    if (err) {
      res.status(500).json({ error: "Failed to delete todo" });
    } else if (this.changes === 0) {
      res.status(404).json({ error: "Todo not found" });
    } else {
      res.json({ message: "Todo deleted successfully" });
    }
  });
});
