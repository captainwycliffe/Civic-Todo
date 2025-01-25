const express = require("express");
const { db } = require("../db/database");
const router = express.Router();

router.get("/", (req, res) => {
  db.all("SELECT * FROM todos", (err, rows) => {
    if (err) {
      res.status(500).json({ error: "Failed to retrieve todos" });
    } else {
      res.json(rows);
    }
  });
});

router.get("/:id", (req, res) => {
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

// Create a new todo
router.post("/", (req, res) => {
  const todos = Array.isArray(req.body) ? req.body : [req.body];
  const query = "INSERT INTO todos (title, completed) VALUES (?, ?)";
  const createdTodos = [];

  const insertTodo = (index) => {
    if (index >= todos.length) {
      return res.status(201).json(createdTodos);
    }

    const { title, completed } = todos[index];
    db.run(query, [title, completed ? 1 : 0], function (err) {
      if (err) {
        return res.status(500).json({ error: "Failed to create todos" });
      }
      createdTodos.push({ id: this.lastID, title, completed });
      insertTodo(index + 1);
    });
  };

  insertTodo(0);
});

// Update an existing todo
router.put("/:id", (req, res) => {
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

// Delete a todo
router.delete("/:id", (req, res) => {
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

module.exports = router;
