from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
import pdfplumber
import io
import base64

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/extract")
async def extract_pdf_data(file: UploadFile = File(...)):
    # Read file into memory
    content = await file.read()
    
    tables_data = []
    text_data = []
    images_base64 = []
    
    # Extract text and tables using pdfplumber
    with pdfplumber.open(io.BytesIO(content)) as pdf:
        for i, page in enumerate(pdf.pages):
            text = page.extract_text()
            if text:
                text_data.append({"page": i + 1, "text": text})
            
            tables = page.extract_tables()
            if tables:
                tables_data.append({"page": i + 1, "tables": tables})
                
            # Convert page to image using pdfplumber's pypdfium2 integration
            # which produces a PIL image.
            img = page.to_image(resolution=144).original
            img_byte_arr = io.BytesIO()
            img.save(img_byte_arr, format='PNG')
            b64_img = base64.b64encode(img_byte_arr.getvalue()).decode("utf-8")
            images_base64.append(f"data:image/png;base64,{b64_img}")

    return {
        "text": text_data,
        "tables": tables_data,
        "images": images_base64,
        "pageCount": len(images_base64)
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
