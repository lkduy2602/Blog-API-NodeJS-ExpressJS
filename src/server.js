import path from "path";

import express from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import "dotenv/config";

const app = express();

app.use(express.json());

app.use(cookieParser());

app.use(express.static(path.join(__dirname, "public")));

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

const hostname = process.env.HOSTNAME || "localhost";
const port = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send("<h1>Hello World</h1>");
});

const server = app.listen(port, () => {
  console.log(`Server is running at http://${hostname}:${port}/`);
});
