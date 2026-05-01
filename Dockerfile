# Sử dụng Node.js bản chính thức
FROM node:18-alpine

# Tạo thư mục làm việc
WORKDIR /app

# Copy các file quản lý thư viện vào trước
COPY package*.json ./

# Cài đặt thư viện
RUN npm install

# Copy toàn bộ code vào
COPY . .

# Build ứng dụng (nếu bạn dùng Vite)
RUN npm run build

# Mở cổng 8080 (Cloud Run mặc định dùng cổng này)
EXPOSE 8080

# Lệnh khởi chạy ứng dụng
CMD ["npm", "run", "preview", "--", "--port", "8080", "--host"]
