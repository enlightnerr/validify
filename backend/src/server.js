import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import validateRoute from "./routes/validate.js";

const app = express();

app.use(cors());
app.use(express.json());

// Ensure outputs directory exists
const outputsDir = path.join(process.cwd(), "outputs");
if (!fs.existsSync(outputsDir)) {
    fs.mkdirSync(outputsDir, { recursive: true });
}

app.use("/outputs", express.static(outputsDir));
app.use("/validate", validateRoute);

const PORT = 5000;

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});