import express from "express";
import mongoose from "mongoose";
import http from "http";
import bodyParser from "body-parser";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";

import services from "./utils/services.js";
import UserRoute from "./route/user.js";
import ChatRoute from "./route/chat.js";

import { Server } from "socket.io";
import { socketManager } from "./socketManager/socketManager.js";

dotenv.config("./.env")

const app = express();
app.use(cors());
export const PORT = process.env.PORT || 5000;

// Connect to MongoDB
mongoose
  .connect(process.env.mongoURI, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => console.log("Connected to DB"));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );

  next();
});

// to log which api is hitting
app.use(morgan("dev"));

// body parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

// Routes
app.use("/api/user", UserRoute);
app.use("/api/chat", ChatRoute);
app.get("/", (req, res) => res.status(200).send("Yes its working"));

const server = http.createServer(app);

export const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.on("connection", socketManager(io));

server.listen(PORT, () => console.log(`Listening on port ${PORT}`));
