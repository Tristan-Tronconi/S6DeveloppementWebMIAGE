const express = require('express');
const app = express();
const dotenv = require('dotenv');
const connectDB = require("./config/db.js");
dotenv.config();
const port = process.env.PORT || 4000;
const useDB = connectDB();

const path = require("path");

const whatWasLeftOpenDistPath = path.join(__dirname, "..", "frontend", "whatWasLeftOpen", "dist");

app.use("/whatWasLeftOpen/src", (req, res) => {
  res.status(404).send("Not found");
});
app.use("/whatWasLeftOpen",express.static(whatWasLeftOpenDistPath));
// app.use(
//   "/whatWasLeftOpen",
//   (req, res, next) => {
//     res.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
//     res.set("Pragma", "no-cache");
//     res.set("Expires", "0");
//     next();
//   },
//   express.static(whatWasLeftOpenDistPath, {
//     etag: false,
//     lastModified: false,
//     maxAge: 0,
//   })
// );
app.use("/",express.static(path.join(__dirname, "..", "frontend", "acceuil")));
app.use("/demineur",express.static(path.join(__dirname, "..", "frontend", "demineur")));
app.use("/hack&slash",express.static(path.join(__dirname, "..", "frontend", "hack&slash", "Hazard-Arena")));
app.use(express.static(path.join(__dirname, "..", "frontend")));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, "..", "frontend", "acceuil",  "index.html"));
  console.log("acceuil");
});

app.get("/demineur", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "frontend", "demineur", "Jeu_demineur.html"));
  console.log("demineur");
});

app.get("/hack&slash", (req, res) => {
  res.sendFile(path.join(__dirname, "..","frontend", "hack&slash", "Hazard-Arena", "index.html"));
  console.log("hack&slash");
});

app.get("/whatWasLeftOpen", (req, res) => {
  res.sendFile(path.join(whatWasLeftOpenDistPath, "index.html"));
  console.log("whatWasLeftOpen");
});

app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});