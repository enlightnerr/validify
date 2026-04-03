import express from "express";
import multer from "multer";
import { runValidation } from "../agent/runValidation.js";

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } }); // 10MB limit

router.post("/", upload.fields([{ name: 'mstrFile', maxCount: 1 }, { name: 'metabaseFile', maxCount: 1 }]), async (req, res) => {
    try {
        const mstrFile = req.files && req.files['mstrFile'] ? req.files['mstrFile'][0] : null;
        const metabaseFile = req.files && req.files['metabaseFile'] ? req.files['metabaseFile'][0] : null;

        if (!mstrFile || !metabaseFile) {
            return res.status(400).json({ error: "Both mstrFile and metabaseFile are required" });
        }

        const result = await runValidation(mstrFile, metabaseFile);
        res.json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Validation failed", details: err.message });
    }
});

export default router;