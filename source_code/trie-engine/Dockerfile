# Sử dụng ảnh Python bản nhẹ
FROM python:3.10-slim

# Thư mục làm việc trong container
WORKDIR /app

# Copy requirements và cài đặt thư viện
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy toàn bộ code thuật toán vào
COPY . .

# Mở cổng 8000
EXPOSE 8000

# Lệnh khởi chạy server khi container bật lên
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]