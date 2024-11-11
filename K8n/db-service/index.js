const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const fs = require("fs");
const path = "/app"; // or "/data" depending on your volume mount path

// Ensure the directory exists before opening the database
if (!fs.existsSync(path)) {
  fs.mkdirSync(path, { recursive: true });
}

const app = express();
const db = new sqlite3.Database(`${path}/fitness.db`, (err) => {
  if (err) {
    console.error("Error opening database:", err.message);
    return;
  }
  console.log("Connected to the SQLite database.");
});

app.use(express.json());

db.serialize(() => {
  db.run(
    `CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, name TEXT, age INTEGER, goal TEXT)`
  );
  db.run(
    `CREATE TABLE IF NOT EXISTS workouts (id INTEGER PRIMARY KEY, name TEXT, duration INTEGER)`
  );
  db.run(
    `CREATE TABLE IF NOT EXISTS activities (id INTEGER PRIMARY KEY, userId INTEGER, workoutId INTEGER, date TEXT, caloriesBurned INTEGER)`
  );
});

app.get("/data/:table", (req, res) => {
  const table = req.params.table;
  db.all(`SELECT * FROM ${table}`, [], (err, rows) => {
    if (err) return res.status(500).send(err.message);
    res.json(rows);
  });
});

app.post("/data/:table", (req, res) => {
  const table = req.params.table;
  const data = req.body;
  const keys = Object.keys(data).join(",");
  const values = Object.values(data)
    .map((val) => `'${val}'`)
    .join(",");

  db.run(`INSERT INTO ${table} (${keys}) VALUES (${values})`, function (err) {
    if (err) return res.status(500).send(err.message);
    res.json({ id: this.lastID });
  });
});

app.listen(3004, () => console.log("Database Service running on port 3004"));
