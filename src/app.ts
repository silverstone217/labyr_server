import express from "express";
import routes from "./routes";
import { config } from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
import cookieParser from "cookie-parser";

config();

const app = express();

// Middleware
app.use(express.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:3001"],
    credentials: true,
  }),
);

// api
app.use("/api", routes);

export default app;
