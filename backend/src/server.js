import "dotenv/config";
import express from "express";
import cors from "cors";
// Removed fs and path imports
import validateRoute from "./routes/validate.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use("/validate", validateRoute);

// Health check route for Render
app.get("/", (req, res) => {
    res.status(200).send("OK");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Server running on port ${PORT}`);
});