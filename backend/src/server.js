import express from "express";
import cors from "cors";
// Removed fs and path imports
import validateRoute from "./routes/validate.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use("/validate", validateRoute);

const PORT = 5000;

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});