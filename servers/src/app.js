import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import bodyParser from "body-parser";
import morgan from "morgan";
import userRouter from "../routes/user.routes.js";
import questionRouter from "../routes/question.routes.js";

// Initialize express app
const app = express();
const allowedOrigin = 'http://localhost:5173';

// Trust the proxy settings
app.set("trust proxy", true);

const corsOptions = {
  origin: allowedOrigin,
  credentials: true, // This allows cookies and credentials to be sent in cross-origin requests
};

app.use(cors(corsOptions));
app.use(morgan('dev'));

dotenv.config({
  path: "../.env" // Ensure this path is correct for your environment
});
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use(bodyParser.json({ limit: '50mb' })); // Adjust the limit as needed
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true })); // Adjust the limit as needed

app.use("/api/v1/question", questionRouter);
app.use("/api/v1/user", userRouter);

// Optional: handle undefined routes
// app.all("*", (req, res) => {
//   throw new ApiError(404, "Page not found");
// });

export default app;
