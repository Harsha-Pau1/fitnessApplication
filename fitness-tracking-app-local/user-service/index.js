const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

const DB_SERVICE_URL = "http://db-service:3004";

app.get("/users", async (req, res) => {
  const response = await axios.get(`${DB_SERVICE_URL}/data/users`);
  res.json(response.data);
});

app.post("/users", async (req, res) => {
  const response = await axios.post(`${DB_SERVICE_URL}/data/users`, req.body);
  res.json(response.data);
});

app.listen(3002, () => console.log("User Service running on port 3002"));
