const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

const DB_SERVICE_URL = "http://db-service:3004";

app.post("/track", async (req, res) => {
  const response = await axios.post(
    `${DB_SERVICE_URL}/data/activities`,
    req.body
  );
  res.json(response.data);
});

app.get("/activities", async (req, res) => {
  const response = await axios.get(`${DB_SERVICE_URL}/data/activities`);
  res.json(response.data);
});

app.listen(3003, () => console.log("Tracking Service running on port 3003"));
