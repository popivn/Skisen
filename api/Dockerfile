# Sử dụng Python 3.10 làm base image
FROM python:3.10-slim

# Cài đặt system dependencies
RUN apt-get update && apt-get install -y \
    libgl1-mesa-glx \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

# Tạo thư mục làm việc
WORKDIR /app

# Copy requirements.txt
COPY requirements.txt .

# Cài đặt các dependencies Python
RUN pip install --no-cache-dir -r requirements.txt

# Copy mã nguồn
COPY . .

# Expose port
EXPOSE 5000

# Chạy ứng dụng
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "5000"]
