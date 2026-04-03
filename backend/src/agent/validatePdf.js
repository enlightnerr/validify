import fs from "fs";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const pdfParse = require("pdf-parse");

export const validatePdf = async () => {
    try {
        const mstrBuffer = fs.readFileSync("outputs/mstr.pdf");
        const metaBuffer = fs.readFileSync("outputs/metabase.pdf");

        const mstrData = await pdfParse(mstrBuffer);
        const metaData = await pdfParse(metaBuffer);

        const mstrText = mstrData.text;
        const metaText = metaData.text;

        // Since we don't know the exact PDF structure, let's extract some keywords
        // For MVP, checking if Metabase contains key text from MSTR
        // In a real scenario, we'll parse to JSON.

        const results = [];
        
        // Simple comparison: length and some content
        const lengthDiff = Math.abs(mstrText.length - metaText.length);
        results.push({ key: "Text Length Similarity", status: lengthDiff < 500 ? "PASS" : "FAIL" });

        // Extracting common words to see if they both have similar data density
        const mstrWords = mstrText.split(/\s+/).filter(w => w.length > 3);
        const metaWords = metaText.split(/\s+/).filter(w => w.length > 3);
        
        results.push({ key: "Total Revenue field presence", status: metaText.toLowerCase().includes("revenue") ? "PASS" : "FAIL" });
        results.push({ key: "Total Users field presence", status: metaText.toLowerCase().includes("users") ? "PASS" : "FAIL" });

        return results;
    } catch (e) {
        console.error("PDF validation failed:", e);
        return [{ key: "PDF Processing", status: "FAIL" }];
    }
};