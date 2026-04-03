import { captureUI } from "./capture.js";
import { compareImages } from "./compareImages.js";
import { validatePdf } from "./validatePdf.js";

export const runValidation = async (mstrUrl, metabaseUrl, hasMstrPdf, hasMetabasePdf) => {
    // Capture concurrently to save time, passing skip flags
    await Promise.all([
        captureUI(mstrUrl, "mstr", hasMstrPdf),
        captureUI(metabaseUrl, "metabase", hasMetabasePdf)
    ]);

    // 🖼️ UI Validation
    let uiStatus = "N/A";
    let mismatch = 0;
    
    // Only attempt UI validation if both URLs were provided
    if (mstrUrl && metabaseUrl) {
        mismatch = compareImages();
        uiStatus = "FAIL";
        if (mismatch === -1) {
            uiStatus = "ERROR";
        } else if (mismatch < 1000) {
            uiStatus = "PASS";
        }
    }

    // 📄 PDF Validation
    // This expects outputs/mstr.pdf and outputs/metabase.pdf to exist
    // They will exist either via upload from multer or from captureUI
    const pdfResults = await validatePdf();

    const pdfStatus = pdfResults.every(r => r.status === "PASS")
        ? "PASS"
        : "FAIL";

    return {
        ui: {
            mismatch,
            status: uiStatus,
            diffImage: uiStatus !== "N/A" && uiStatus !== "ERROR" ? "/outputs/diff.png" : null,
            mstrImage: uiStatus !== "N/A" ? "/outputs/mstr.png" : null,
            metaImage: uiStatus !== "N/A" ? "/outputs/metabase.png" : null
        },
        pdf: {
            status: pdfStatus,
            details: pdfResults
        }
    };
};