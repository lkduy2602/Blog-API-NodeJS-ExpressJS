import express from "express";
import "dotenv/config";

const app = express();

const hostname = process.env.HOSTNAME || "localhost";
const port = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send("<h1>Hello World</h1>");
});

app.listen(port, () => {
  console.log(`Server is running at http://${hostname}:${port}/`);
});
