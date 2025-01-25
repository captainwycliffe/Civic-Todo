const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Initialize SQLite database
const dbPath = path.resolve(__dirname, 'todos.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Failed to connect to database:', err.message);
  } else {
    console.log('Connected to the SQLite database.');
  }
});

console.log("DB Path: ", dbPath); // Log the actual database path


// Initialize database schema (create table if not exists)
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

// Export the db object and initialization function
module.exports = { db, initializeDB };
