# Sử dụng Python 3.9 làm base image
FROM python:3.9-slim

# Cài đặt các dependencies hệ thống
RUN apt-get update && apt-get install -y \
    libgl1-mesa-glx \
    libglib2.0-0 \
    git \
    build-essential \
    python3-dev \
    && rm -rf /var/lib/apt/lists/*

# Tạo thư mục làm việc
WORKDIR /app

# Copy requirements.txt
COPY requirements.txt .

# Cập nhật pip và cài đặt các dependencies Python
RUN pip install --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Copy mã nguồn
COPY . .

# Tạo thư mục static nếu chưa tồn tại
RUN mkdir -p static/gradcam

# Expose port
EXPOSE 5000

# Chạy ứng dụng
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "5000"]
