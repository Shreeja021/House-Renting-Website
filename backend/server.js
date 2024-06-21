import express from "express";
import "dotenv/config";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/userRoutes.js"
import propertyRoutes from "./routes/propertyRoutes.js"
import connectDB from "./db/connectDB.js";

const app = express()
const PORT = process.env.PORT || 8080;

connectDB()

// middleware
app.use(express.json({ limit: "50mb" })); // To parse JSON data in req.body
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// routes
app.use("/api/user", userRoutes)
app.use("/api/property", propertyRoutes)

app.listen(PORT, () => console.log(`Server is listening on PORT: ${PORT}`));