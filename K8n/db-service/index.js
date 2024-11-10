const express = require("express");
const sqlite3 = require("sqlite3").verbose();

const app = express();
const db = new sqlite3.Database("/app/fitness.db");

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
