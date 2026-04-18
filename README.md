# Radix-Dictionary
## 📚 LexiGraph - Radix Dictionary
LexiGraph là một hệ thống từ điển trực quan. Dự án sử dụng cấu trúc dữ liệu Radix Trie để tối ưu hóa tốc độ tra cứu và hiển thị trực tiếp quá trình thuật toán xử lý dữ liệu lên màn hình.
## 🌐 Liên kết dự án 
Demo trực tuyến:[radix-dictionary-application.com](https://radix-dictionary-application.onrender.com/)
## 🏗️ Công nghệ sử dụng
Dự án được chia thành 3 phân hệ hoạt động độc lập:
* Frontend: HTML5, JavaScript, Tailwind CSS, D3.js.
* Trie Engine: Python, FastAPI.
* Database Manager: Java, Spring Boot, PostgreSQL.
## ✨ Tính năng chính
* Tìm kiếm: Tốc độ tìm kiếm đạt $O(k)$ (với $k$ là độ dài từ), nhờ cấu trúc Radix Trie.
* Trực quan hóa đồ thị: Tự động vẽ và cập nhật cấu trúc nén tiền tố của thuật toán lên màn hình mỗi khi thêm/xóa từ.
* Xóa mềm (Lazy Deletion): Node bị xóa sẽ đổi màu (vô hiệu hóa) thay vì bị phá hủy, giúp hệ thống không phải xếp lại cây.Tự động phục hồi: Dữ liệu tự động nạp lại từ PostgreSQL vào RAM mỗi khi server Python khởi động lại.
