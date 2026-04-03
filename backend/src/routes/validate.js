import express from "express";
import multer from "multer";
import path from "path";
import { runValidation } from "../agent/runValidation.js";

const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(process.cwd(), "outputs"));
    },
    filename: (req, file, cb) => {
        if (file.fieldname === "mstrPdf") {
            cb(null, "mstr.pdf");
        } else if (file.fieldname === "metabasePdf") {
            cb(null, "metabase.pdf");
        } else {
            cb(null, file.originalname);
        }
    }
});

const upload = multer({ storage });

router.post("/", upload.fields([{ name: 'mstrPdf', maxCount: 1 }, { name: 'metabasePdf', maxCount: 1 }]), async (req, res) => {
    const { mstrUrl = "", metabaseUrl = "" } = req.body || {};
    const hasMstrPdf = !!(req.files && req.files['mstrPdf']);
    const hasMetabasePdf = !!(req.files && req.files['metabasePdf']);

    try {
        const result = await runValidation(mstrUrl, metabaseUrl, hasMstrPdf, hasMetabasePdf);
        res.json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Validation failed" });
    }
});

export default router;