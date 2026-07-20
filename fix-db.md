# Cấu hình Prisma với PrismaPg (Prisma 7+)

## 0. Cài đặt

```bash
npm install @prisma/client @prisma/adapter-pg
npm install -D prisma
```

---

## 1. Schema (`prisma/schema.prisma`)

> **Lưu ý:** Không khai báo `url` trực tiếp trong file `schema.prisma`.

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
}
```

---

## 2. Cấu hình (`prisma.config.ts`)

Đưa thông tin kết nối vào file cấu hình riêng biệt.

```typescript
import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: process.env.DATABASE_URL,
  },
});
```

---

## 3. Khởi tạo Prisma Client

> **Lưu ý:** PrismaPg yêu cầu một instance của `pg.Pool` thay vì truyền trực tiếp object chứa `connectionString`.

```javascript
const { Pool } = require("pg");
const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({
  adapter,
});

module.exports = prisma;
```

---

# Các lệnh thao tác với Prisma Client

## Generate Prisma Client

```bash
npx prisma generate
```

## Migration (Production-ready)

```bash
npx prisma migrate dev
```

## Đồng bộ schema nhanh (Development)

```bash
npx prisma db push
```

---

# Các lỗi thường gặp và cách khắc phục

## 1. Lỗi: `Cannot find module...`

### Nguyên nhân

- Sai `provider`
- Sai đường dẫn import Prisma Client

### Cách khắc phục

Đảm bảo sử dụng:

```prisma
generator client {
  provider = "prisma-client-js"
}
```

Và import:

```javascript
const { PrismaClient } = require("@prisma/client");
```

---

## 2. Lỗi: `PrismaClientInitializationError`

### Nguyên nhân

Truyền object config trực tiếp vào `PrismaPg`.

**Sai:**

```javascript
const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});
```

### Cách khắc phục

Khởi tạo `Pool` trước:

```javascript
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);
```

---

## 3. Lỗi: `The datasource property url is no longer supported`

### Nguyên nhân

Prisma 7+ không còn hỗ trợ khai báo `url` trong `schema.prisma`.

**Sai:**

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

### Cách khắc phục

Chuyển cấu hình sang `prisma.config.ts`:

```typescript
export default defineConfig({
  datasource: {
    url: process.env.DATABASE_URL,
  },
});
```

---

# Tóm tắt

| Thành phần | Cấu hình |
|------------|----------|
| Schema | Chỉ khai báo `provider` |
| Kết nối DB | `prisma.config.ts` |
| Adapter | `new PrismaPg(pool)` |
| Pool | `new Pool({ connectionString })` |
| Generate | `npx prisma generate` |
| Migration | `npx prisma migrate dev` |
| Đồng bộ nhanh | `npx prisma db push` |