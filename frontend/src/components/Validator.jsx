import { useState } from "react";
import axios from "axios";

const Validator = () => {
    const [mstrUrl, setMstrUrl] = useState("");
    const [metabaseUrl, setMetabaseUrl] = useState("");
    const [mstrPdf, setMstrPdf] = useState(null);
    const [metabasePdf, setMetabasePdf] = useState(null);
    
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleValidate = async () => {
        // Must provide either both URLs or both PDFs (or one URL/one PDF mixed logic depending on use case)
        if (!mstrUrl && !mstrPdf && !metabaseUrl && !metabasePdf) {
            setError("Please provide at least URLs or PDFs to validate.");
            return;
        }

        setLoading(true);
        setError("");
        
        const formData = new FormData();
        if (mstrUrl) formData.append("mstrUrl", mstrUrl);
        if (metabaseUrl) formData.append("metabaseUrl", metabaseUrl);
        if (mstrPdf) formData.append("mstrPdf", mstrPdf);
        if (metabasePdf) formData.append("metabasePdf", metabasePdf);

        try {
            const res = await axios.post("http://localhost:5000/validate", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            setResult(res.data);
        } catch (err) {
            console.error(err);
            setError("Validation request failed. Ensure the backend is running.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <h1>Report Validation Agent</h1>
                <p>Ensure visual and data consistency between MSTR and Metabase</p>
            </div>

            <div className="input-section">
                {error && <div style={{ color: "var(--danger)", marginBottom: "10px", fontWeight: "600" }}>{error}</div>}
                
                <div className="input-row">
                    <div className="input-group">
                        <label>MicroStrategy (MSTR) URL / PDF</label>
                        <input
                            type="text"
                            placeholder="https://mstr-report-url.com (URL)"
                            value={mstrUrl}
                            onChange={(e) => setMstrUrl(e.target.value)}
                        />
                        <div style={{marginTop: "8px", fontSize: "0.85rem"}}>
                           <label style={{ marginRight: '10px' }}>Or Upload PDF:</label>
                           <input type="file" accept="application/pdf" onChange={(e) => setMstrPdf(e.target.files[0])} />
                        </div>
                    </div>
                    
                    <div className="input-group">
                        <label>Metabase URL / PDF</label>
                        <input
                            type="text"
                            placeholder="https://metabase-report-url.com (URL)"
                            value={metabaseUrl}
                            onChange={(e) => setMetabaseUrl(e.target.value)}
                        />
                        <div style={{marginTop: "8px", fontSize: "0.85rem"}}>
                           <label style={{ marginRight: '10px' }}>Or Upload PDF:</label>
                           <input type="file" accept="application/pdf" onChange={(e) => setMetabasePdf(e.target.files[0])} />
                        </div>
                    </div>
                </div>

                <div className="input-group" style={{ alignItems: "flex-end", marginTop: "10px" }}>
                    <button className="validate-btn" onClick={handleValidate} disabled={loading}>
                        {loading && <div className="spinner"></div>}
                        {loading ? "Validating..." : "Start Validation"}
                    </button>
                </div>
            </div>

            {result && (
                <div className="results-section">
                    <div className="result-card ui-validation">
                        <div className="result-header">
                            <h3>UI Validation</h3>
                            <span className={`status-badge status-${result.ui.status === "N/A" ? "PASS" : result.ui.status}`} style={{ background: result.ui.status === "N/A" ? "#475569" : undefined, color: result.ui.status === "N/A" ? "#f8fafc" : undefined }}>
                                {result.ui.status}
                            </span>
                        </div>
                        
                        {result.ui.status !== "N/A" ? (
                            <>
                                <div className="stat-row">
                                    <span>Mismatched Pixels</span>
                                    <span className="stat-val">{result.ui.mismatch.toLocaleString()}</span>
                                </div>

                                {result.ui.diffImage && (
                                    <div className="diff-preview">
                                        <h4>Difference Highlight</h4>
                                        <div className="diff-image-wrapper">
                                            <img src={`http://localhost:5000${result.ui.diffImage}`} alt="Visual Diff" />
                                        </div>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="stat-row" style={{ color: "var(--text-secondary)" }}>
                                <span>URL inputs missing. Skipped image verification.</span>
                            </div>
                        )}
                    </div>

                    <div className="result-card data-validation">
                        <div className="result-header">
                            <h3>Data Validation (PDF)</h3>
                            <span className={`status-badge status-${result.pdf.status}`}>
                                {result.pdf.status}
                            </span>
                        </div>
                        
                        <ul className="pdf-details">
                            {result.pdf.details.map((item, index) => (
                                <li key={index}>
                                    <span>{item.key}</span>
                                    <span style={{ 
                                        color: item.status === "PASS" ? "var(--success)" : "var(--danger)",
                                        fontWeight: "600"
                                    }}>
                                        {item.status}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Validator;