# Start of Selection
# Build stage
FROM python:3.11-slim as builder

# Install system dependencies
RUN apt-get update && apt-get install -y \
    libgl1-mesa-glx \
    libglib2.0-0 \
    git \
    build-essential \
    python3-dev \
    python3-pip \
    python3-setuptools \
    && rm -rf /var/lib/apt/lists/*

# Upgrade pip and setuptools to latest version
RUN pip install --upgrade pip setuptools wheel

# Create working directory
WORKDIR /app

# Copy requirements.txt
COPY requirements.txt .

# Install Python dependencies
RUN apt-get install -y python3-distutils && \
    pip install --no-cache-dir -r requirements.txt

# Final stage
FROM python:3.11-slim

# Install necessary system dependencies
RUN apt-get update && apt-get install -y \
    libgl1-mesa-glx \
    libglib2.0-0 \
    git \
    libhdf5-dev \
    libprotobuf-dev \
    protobuf-compiler \
    && rm -rf /var/lib/apt/lists/*

# Copy installed dependencies from builder
COPY --from=builder /usr/local/lib/python3.11/site-packages /usr/local/lib/python3.11/site-packages
COPY --from=builder /usr/local/bin /usr/local/bin

# Create working directory
WORKDIR /app

# Copy source code
COPY . .

# Create static directory if it doesn't exist
RUN mkdir -p static/gradcam

# Expose port
EXPOSE 5000

# Run application with reload flag for development
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "5000", "--reload"]
# End of Selection
