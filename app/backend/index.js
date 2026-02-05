const express = require('express');
const app = express();
const dotenv = require('dotenv');
const connectDB = require("./config/db.js");
dotenv.config();
const port = process.env.PORT || 3000;
connectDB();

const path = require("path");
app.use(express.static(path.join(__dirname, "../frontend/*")));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/acceuil/index.html"));
});

app.get("/demineur", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/demineur/Jeu_demineur.html"));
});

app.get("/hack&slash", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/hack&slash/index.html"));
});

app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});