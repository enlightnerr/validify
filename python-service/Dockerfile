FROM python:3.10-slim

WORKDIR /app

# Install standard dependencies
COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Expose FastAPI port
EXPOSE 8000

# Run uvicorn on all network interfaces
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
