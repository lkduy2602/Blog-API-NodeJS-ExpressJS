# Blog-API-NodeJS-ExpressJS

Blog API này là một CRUD cơ bản có thêm phân quyền và xác thực với JWT được viết bằng NodeJS với framework ExpressJS và sử dụng NoSQL MongoDB Atlas

## Các Chức Năng Chính

- Xác thực và phân quyền với JWT (Lấy lại mật khẩu dùng Email)
- CRUD User, Post, Comment
- Tải lên ảnh banner
- Có thể bình luận vào bài viết
- Phân trang và tìm kiếm
- API Security với các thư viện NPM

## Tài Liệu API

- Tài liệu API với [PostMan](https://documenter.getpostman.com/view/20545218/2s7YYsc41K)

## Config File dotenv

```
NODE_ENV = development

HOSTNAME = localhost
PORT = 8080

MONGO_URI = mongodb+srv://account:password/database-name?retryWrites=true&w=majority

#JWT
JWT_SECRET =
JWT_EXPIRE = 30d # day
JWT_COOKIE_EXPIRE = 30 # day

#SMTP Email
SMTP_HOST =
SMTP_PORT =
SMTP_EMAIL =
SMTP_PASSWORD =
FROM_EMAIL = lkduy@gmail.com
FROM_NAME = Lê Khánh Duy

#Upload Image
MAX_FILE_UPLOAD =
FILE_UPLOAD_PATH =
```

## Các Công Nghệ Chính

- NodeJS
- MongoDB

## Tài Liệu Tham Khảo

- Code này dựa theo [Github](https://github.com/techreagan/blog-api)
