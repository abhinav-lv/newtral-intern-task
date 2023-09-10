import cors from "cors";
import path from "path";
import { connect as connectToDb } from "mongoose";
import session from "express-session";
import authRoute from "./routes/auth";
import userRoute from "./routes/user";
import { redisStore } from "./redisStore";
import { config as envConfig } from "dotenv";
import { authMiddleware } from "./controllers/auth";
import express, { Request, Response } from "express";

envConfig();
const app = express();
const clientBuildDirectory = path.join(__dirname, "/../client/dist");
// console.log(clientBuildDirectory);

// Connect to DB
connectToDb(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/newtral")
    .then((_) => console.log("Connected to MongoDB"))
    .catch((err) => console.log(err.message));

// Middleware
app.use(express.json());
app.use(cors());
app.use(
    session({
        store: redisStore,
        secret: process.env.SESSION_SECRET as string,
        resave: false,
        saveUninitialized: false,
        cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 }, // 24 hours
    })
);
app.use(express.static(clientBuildDirectory));

app.use("/api/auth", authRoute);
app.use("/api/user", userRoute);

app.get("*", authMiddleware, (req: Request, res: Response) => {
    res.sendFile(path.join(clientBuildDirectory, "/index.html"));
});

app.listen(process.env.PORT || 5000, () =>
    console.log(`Server started on port ${process.env.PORT || 5000}`)
);
