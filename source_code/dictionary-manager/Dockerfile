# BƯỚC 1: Build (Biên dịch code)
FROM gradle:8.5-jdk17 AS build
WORKDIR /app
COPY . .
# Chạy lệnh build của Gradle, bỏ qua bước test để nhanh hơn
RUN gradle clean build -x test

# BƯỚC 2: Run (Chạy ứng dụng)
FROM eclipse-temurin:17-jre-jammy
WORKDIR /app
# Lấy file .jar đã build ở bước 1 sang
COPY --from=build /app/build/libs/*.jar app.jar

# Mở cổng 8080
EXPOSE 8080

# Khởi chạy Spring Boot
ENTRYPOINT ["java", "-jar", "app.jar"]