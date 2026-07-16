# Kết nối Service với API Gateway

Để API Gateway có thể chuyển tiếp (proxy) request đến một service, cần thực hiện hai bước:

1. Tạo route trong Gateway.
2. Cấu hình proxy trỏ đến service tương ứng.

---

# 1. Tạo route kết nối đến Service

Tạo file route, ví dụ:

```javascript
const express = require("express");

const authProxy = require("../proxy/auth.proxy");
const {
    authRateLimit,
    refreshRateLimit,
} = require("../middleware/rate-limit.middleware");

const router = express.Router();

/**
 * Public APIs
 */

router.post("/login", authRateLimit, authProxy);

router.post("/register", authProxy);

router.post("/refresh", refreshRateLimit, authProxy);

router.use("/", authProxy);

module.exports = router;
```

## Giải thích

### Khởi tạo Router

```javascript
const express = require("express");
const router = express.Router();
```

Tạo một đối tượng `Router` của Express để quản lý các endpoint thuộc Authentication Service.

---

### Import Proxy

```javascript
const authProxy = require("../proxy/auth.proxy");
```

`authProxy` là middleware chịu trách nhiệm chuyển tiếp (proxy) request từ API Gateway đến Authentication Service.

API Gateway không xử lý logic nghiệp vụ của Authentication mà chỉ đóng vai trò trung gian nhận request và chuyển tiếp đến service tương ứng.

---

### Import Rate Limit Middleware

```javascript
const {
    authRateLimit,
    refreshRateLimit,
} = require("../middleware/rate-limit.middleware");
```

Các middleware này dùng để giới hạn số lượng request trong một khoảng thời gian nhằm:

- Giảm nguy cơ spam request.
- Hạn chế brute-force khi đăng nhập.
- Bảo vệ Authentication Service khỏi bị quá tải.

Có hai middleware:

- `authRateLimit`
  - Áp dụng cho API đăng nhập (`/login`).
  - Giới hạn số lần thử đăng nhập.

- `refreshRateLimit`
  - Áp dụng cho API refresh token (`/refresh`).
  - Giới hạn số lần yêu cầu cấp lại Access Token.

---

### Route đăng nhập

```javascript
router.post("/login", authRateLimit, authProxy);
```

Khi client gửi request:

```http
POST /login
```

Request sẽ đi theo thứ tự:

```
Client
    │
    ▼
API Gateway
    │
    ▼
authRateLimit
    │
    ▼
authProxy
    │
    ▼
Authentication Service
```

Nếu số lượng request vượt quá giới hạn, `authRateLimit` sẽ trả về lỗi mà không chuyển request sang Authentication Service.

---

### Route đăng ký

```javascript
router.post("/register", authProxy);
```

Request đăng ký được chuyển trực tiếp đến Authentication Service.

---

### Route Refresh Token

```javascript
router.post("/refresh", refreshRateLimit, authProxy);
```

Route này hoạt động tương tự `/login` nhưng sử dụng middleware `refreshRateLimit` để giới hạn số lượng request refresh token.

---

### Các route còn lại

```javascript
router.use("/", authProxy);
```

`router.use()` sẽ bắt tất cả các request chưa được khai báo phía trên và chuyển tiếp sang Authentication Service.

Ví dụ:

```http
GET /profile
PUT /profile
PATCH /profile
DELETE /profile
```

đều sẽ được proxy đến Authentication Service.

---

# 2. Tạo Proxy

Ví dụ file `auth.proxy.js`:

```javascript
const createProxy = require("./create.proxy");

module.exports = createProxy(
    process.env.AUTH_SERVICE_URL,
    "/auth"
);
```

## Giải thích

### Import hàm tạo Proxy

```javascript
const createProxy = require("./create.proxy");
```

`createProxy` là hàm dùng chung để tạo proxy cho các service.

Thay vì phải cấu hình lại proxy cho từng service, chỉ cần truyền vào:

- URL của service.
- Prefix của route.

---

### Tạo Proxy

```javascript
module.exports = createProxy(
    process.env.AUTH_SERVICE_URL,
    "/auth"
);
```

Trong đó:

#### `process.env.AUTH_SERVICE_URL`

Là địa chỉ của Authentication Service, ví dụ:

```env
AUTH_SERVICE_URL=http://auth-service:3001 nếu chạy docker   
hoặc http://localhost:3001 nếu chạy local.
```

API Gateway sẽ gửi request đến địa chỉ này.

---

#### `"/auth"`

Là tiền tố (prefix) sẽ được thêm vào trước đường dẫn khi request được chuyển sang Authentication Service.

Ví dụ:

Gateway nhận request:

```http
POST /login
```

Sau khi proxy:

```http
POST http://auth-service:3001/auth/login
```

Tương tự:

```http
GET /profile
```

sẽ được chuyển thành:

```http
GET http://auth-service:3001/auth/profile
```

---

# Luồng hoạt động

```
Client
    │
    ▼
API Gateway
    │
    ├── Rate Limit
    ├── Authentication (nếu có)
    ├── Logging (nếu có)
    │
    ▼
authProxy
    │
    ▼
Authentication Service
    │
    ▼
Business Logic
    │
    ▼
Response
    │
    ▼
API Gateway
    │
    ▼
Client
```

## Vai trò của API Gateway

API Gateway đóng vai trò là điểm vào (Entry Point) của hệ thống Microservices.

Các nhiệm vụ chính gồm:

- Nhận request từ client.
- Thực hiện các middleware chung như:
  - Rate Limit.
  - Authentication.
  - Logging.
  - CORS.
- Chuyển tiếp request đến service phù hợp.
- Nhận response từ service và trả về cho client.

Nhờ đó, các service chỉ tập trung xử lý nghiệp vụ mà không cần quan tâm đến việc định tuyến hay các chức năng dùng chung.