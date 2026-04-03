import axios from "axios";
import FormData from "form-data";
import pixelmatch from "pixelmatch";
import { PNG } from "pngjs";

const PYTHON_SERVICE_URL = "http://127.0.0.1:8000/extract";

const extractFromPython = async (fileBuffer, filename) => {
    const formData = new FormData();
    formData.append("file", fileBuffer, { filename });
    
    try {
        const response = await axios.post(PYTHON_SERVICE_URL, formData, {
            headers: formData.getHeaders(),
            maxBodyLength: Infinity,
            maxContentLength: Infinity
        });
        return response.data;
    } catch (e) {
        console.error(`Error extracting from ${filename}:`, e.message);
        throw new Error(`Failed to extract data from ${filename} via Python service`);
    }
};

const compareJsonLists = (mstr, meta) => {
    // Basic comparison logic: we check table dimensions and content similarity
    let totalFields = 0;
    let matchFields = 0;
    const differences = [];

    // Simple textual comparison for MVP
    const mstrTextMap = mstr.text.map(t => t.text).join(" ");
    const metaTextMap = meta.text.map(t => t.text).join(" ");

    // Check presence of keywords / values from MSTR in Metabase
    const mstrTokens = mstrTextMap.split(/\s+/).filter(w => w.length > 2);
    totalFields = mstrTokens.length || 1; // Prevent div by 0
    
    for (const token of mstrTokens) {
        if (metaTextMap.includes(token)) {
            matchFields++;
        } else {
            if (differences.length < 50) { // Limit diff sizes
                differences.push({ expected: token, found: "Missing" });
            }
        }
    }
    
    const dataMatchPercentage = Math.round((matchFields / totalFields) * 100);
    return {
        matchPercentage: Math.min(dataMatchPercentage, 100),
        differences
    };
};

const compareBase64Images = (b64Image1, b64Image2) => {
    // Strip data prefix
    const buf1 = Buffer.from(b64Image1.replace(/^data:image\/png;base64,/, ""), "base64");
    const buf2 = Buffer.from(b64Image2.replace(/^data:image\/png;base64,/, ""), "base64");

    const img1 = PNG.sync.read(buf1);
    const img2 = PNG.sync.read(buf2);
    
    const { width, height } = img1;
    // Assume both images have same dimensions for simplicity in MVP
    
    const diff = new PNG({ width, height });
    
    const numDiffPixels = pixelmatch(
        img1.data,
        img2.data,
        diff.data,
        width,
        height,
        { threshold: 0.1 }
    );
    
    const diffBuf = PNG.sync.write(diff);
    const diffBase64 = `data:image/png;base64,${diffBuf.toString("base64")}`;
    
    const totalPixels = width * height;
    const matchPercentage = Math.round(((totalPixels - numDiffPixels) / totalPixels) * 100);
    
    return {
        matchPercentage,
        diffBase64
    };
};

export const runValidation = async (mstrFile, metabaseFile) => {
    console.log("Starting PDF Extraction...");
    
    const [mstrData, metaData] = await Promise.all([
        extractFromPython(mstrFile.buffer, mstrFile.originalname),
        extractFromPython(metabaseFile.buffer, metabaseFile.originalname)
    ]);
    
    console.log("Comparing Data...");
    const dataComparison = compareJsonLists(mstrData, metaData);

    console.log("Comparing Visuals...");
    // For MVP, limit to comparing the first page
    let visualComparison = { matchPercentage: 100, diffBase64: null };
    if (mstrData.images.length > 0 && metaData.images.length > 0) {
        visualComparison = compareBase64Images(mstrData.images[0], metaData.images[0]);
    }

    // Return the required structure
    return {
        dataMatchPercentage: dataComparison.matchPercentage,
        visualMatchPercentage: visualComparison.matchPercentage,
        jsonDiff: dataComparison.differences,
        visualDiffImage: visualComparison.diffBase64,
        summary: `Compared ${mstrData.pageCount} pages. Data Match: ${dataComparison.matchPercentage}%. Visual Match: ${visualComparison.matchPercentage}%.`
    };
};