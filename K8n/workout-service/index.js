const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

const DB_SERVICE_URL = "http://db-service:3004";

app.get("/workouts", async (req, res) => {
  const response = await axios.get(`${DB_SERVICE_URL}/data/workouts`);
  res.json(response.data);
});

app.post("/workouts", async (req, res) => {
  const response = await axios.post(
    `${DB_SERVICE_URL}/data/workouts`,
    req.body
  );
  res.json(response.data);
});

app.listen(3001, () => console.log("Workout Service running on port 3001"));