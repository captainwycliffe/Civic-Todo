const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'todos.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Failed to connect to database:', err.message);
  } else {
    console.log('Connected to the SQLite database.');
  }
});

console.log("DB Path: ", dbPath); 


const initializeDB = () => {
  const query = `
    CREATE TABLE IF NOT EXISTS todos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      completed BOOLEAN NOT NULL
    )
  `;
  db.run(query, (err) => {
    if (err) {
      console.error('Error initializing database:', err.message);
    }
  });
};

module.exports = { db, initializeDB };
