import express from "express";
import authRoutes from "./routes/auth.route.js";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import {} from "dotenv/config";
import userRoutes from "./routes/user.route.js";
import postRouter from "./routes/posts.route.js";
import commentRouter from "./routes/comment.route.js";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
const app = express();
const PORT = process.env.PORT || 3000;
const router = express.Router();
const __dirname = path.resolve();
app.use(cors());

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

mongoose
  .connect(process.env.MONGO)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB Connection Error:", err));

app.use("/api/auth", authRoutes);

app.use("/api/users", userRoutes);
app.use("/api/post", postRouter);
app.use("/api/comment", commentRouter);
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "dist", "index.html"));
});
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});
app.listen(PORT, () => {
  console.log(`app listening on http://localhost:${PORT}`);
});
