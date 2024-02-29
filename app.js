import express from "express";
import { config } from "dotenv";
import userRouter from "./routes/user.js";
import taskRouter from "./routes/task.js";
import cookieParser from "cookie-parser";
import cors from "cors";

export const app = express();

config({
    path: "./data/config.env"
})

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: [process.env.FRONTEND_URL],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));

// USING ROUTES
app.use('/api/v1/users', userRouter);
app.use('/api/v1/tasks', taskRouter);


app.get('/', (req, res) => {
    res.send('Hello World');
})

app.use((err, req, res, next) => {

})