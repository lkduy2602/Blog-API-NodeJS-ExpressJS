import path from "path";

import express from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import mongoSanitize from "express-mongo-sanitize";
import helmet from "helmet";
import xss from "xss-clean";
import cors from "cors";
import rateLimit from "express-rate-limit";
import hpp from "hpp";

import { errorHandler } from "./middlewares/error";

import "dotenv/config";

import { DBconnection } from "./configs/db";

DBconnection();

import authRoutes from "./routes/auth";
import userRoutes from "./routes/user";
import postRoutes from "./routes/posts";
import commentRoutes from "./routes/comments";

const app = express();

app.use(express.json());

app.use(cookieParser());

app.use(express.static(path.join(__dirname, "./public")));

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(fileUpload());

app.use(mongoSanitize());

app.use(helmet());

app.use(xss());

app.use(cors());

const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 phút
  max: 100, //100 req 10 phút
});

app.use(limiter);

app.use(hpp());

const versionOne = (routeName) => `/api/v1/${routeName}`;

app.use(versionOne("auth"), authRoutes);
app.use(versionOne("users"), userRoutes);
app.use(versionOne("posts"), postRoutes);
app.use(versionOne("comments"), commentRoutes);

app.use(errorHandler);

const HOSTNAME = process.env.HOSTNAME || "localhost";
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Server is running at http://${HOSTNAME}:${PORT}/`);
});

process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`);

  server.close(() => process.exit(1));
});
