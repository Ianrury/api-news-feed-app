# Dokumentasi Backend News Feed App

Aplikasi backend untuk News Feed, dibangun menggunakan Node.js, Express, TypeScript, dan Prisma dengan database PostgreSQL.

## Daftar Isi
- [Fitur Utama](#fitur-utama)
- [Teknologi yang Digunakan](#teknologi-yang-digunakan)
- [Prasyarat](#prasyarat)
- [Panduan Instalasi](#panduan-instalasi)
- [Struktur Project](#struktur-project)
- [Dokumentasi API](#dokumentasi-api)
- [Skema Database](#skema-database)
- [Keamanan](#keamanan)
- [Penanganan Error](#penanganan-error)

## Fitur Utama

- Sistem Autentikasi
  - Registrasi pengguna baru
  - Login pengguna
  - Proteksi rute menggunakan JWT
- Manajemen Postingan
  - Membuat postingan baru
  - Membaca postingan
  - Mendapatkan feed dari pengguna yang diikuti
- Sistem Follow
  - Follow pengguna lain
  - Unfollow pengguna
  - Melihat daftar follower
  - Melihat daftar following

## Teknologi yang Digunakan

- **Runtime Environment**: Node.js
- **Framework**: Express.js
- **Bahasa Pemrograman**: TypeScript
- **ORM**: Prisma
- **Database**: PostgreSQL
- **Autentikasi**: JWT (JSON Web Tokens)
- **Package Manager**: npm
- **Development Tools**: 
  - nodemon (hot reload)
  - tsx (TypeScript execution)
  - bcrypt (password hashing)

## Prasyarat

Sebelum menginstall project ini, pastikan Anda telah menginstall:

1. Node.js (versi 16 atau lebih tinggi)
2. PostgreSQL (versi 12 atau lebih tinggi)
3. npm (Node Package Manager)
4. Git

## Panduan Instalasi

### 1. Clone Repository

```bash
# Clone repository dari GitHub
git clone https://github.com/Ianrury/api-news-feed-app.git

# Masuk ke direktori backend
cd api-news-feed-app/backend
```

### 2. Install Dependencies

```bash
# Install semua dependencies yang diperlukan
npm install
```

### 3. Konfigurasi Environment

Buat file `.env` di root directory dengan isi sebagai berikut:

```env
# Database Configuration
DATABASE_URL="postgresql://username:password@localhost:5432/news_feed_db"

# JWT Configuration
JWT_SECRET="ganti-dengan-secret-key-anda"

# Server Configuration (optional)
PORT=3000
```

### 4. Setup Database

```bash
# Jalankan migrasi database
npx prisma migrate dev

# Generate Prisma Client
npx prisma generate
```

### 5. Menjalankan Aplikasi

```bash
# Mode Development (dengan hot reload)
npm run dev

# Mode Production
npm run build  # Build aplikasi
npm start      # Jalankan aplikasi
```

## Struktur Project

```
backend/
├── prisma/                 # Konfigurasi dan migrasi Prisma
│   ├── schema.prisma      # Skema database
│   └── migrations/        # File migrasi database
├── src/
│   ├── controllers/       # Logic handler untuk setiap route
│   │   ├── authController.ts
│   │   ├── postController.ts
│   │   └── followController.ts
│   ├── middleware/        # Middleware
│   │   └── auth.ts       # Middleware autentikasi
│   ├── routes/           # Definisi route API
│   │   ├── authRoutes.ts
│   │   ├── postRoutes.ts
│   │   └── followRoutes.ts
│   ├── utils/            # Utility functions
│   │   └── prisma.ts     # Konfigurasi Prisma client
│   └── index.ts          # Entry point aplikasi
├── package.json          # Dependencies dan scripts
└── tsconfig.json        # Konfigurasi TypeScript
```

## Dokumentasi API

### Autentikasi

#### Register Pengguna Baru
- **URL**: `/auth/register`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "username": "string",
    "password": "string"
  }
  ```
- **Response Success**:
  ```json
  {
    "status": "success",
    "data": {
      "id": "number",
      "username": "string",
      "token": "string"
    }
  }
  ```

#### Login Pengguna
- **URL**: `/auth/login`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "username": "string",
    "password": "string"
  }
  ```
- **Response Success**:
  ```json
  {
    "status": "success",
    "data": {
      "token": "string"
    }
  }
  ```

### Postingan

#### Membuat Postingan Baru
- **URL**: `/posts`
- **Method**: `POST`
- **Headers**: 
  ```
  Authorization: Bearer <token>
  ```
- **Body**:
  ```json
  {
    "content": "string"
  }
  ```
- **Response Success**:
  ```json
  {
    "status": "success",
    "data": {
      "id": "number",
      "content": "string",
      "createdAt": "date",
      "userId": "number"
    }
  }
  ```

#### Mendapatkan Feed
- **URL**: `/posts`
- **Method**: `GET`
- **Headers**: 
  ```
  Authorization: Bearer <token>
  ```
- **Query Parameters**:
  - `page` (optional): nomor halaman
  - `limit` (optional): jumlah item per halaman
- **Response Success**:
  ```json
  {
    "status": "success",
    "data": {
      "posts": [
        {
          "id": "number",
          "content": "string",
          "createdAt": "date",
          "user": {
            "id": "number",
            "username": "string"
          }
        }
      ],
      "pagination": {
        "currentPage": "number",
        "totalPages": "number",
        "totalItems": "number"
      }
    }
  }
  ```

### Sistem Follow

#### Follow Pengguna
- **URL**: `/follow/:userId`
- **Method**: `POST`
- **Headers**: 
  ```
  Authorization: Bearer <token>
  ```
- **Response Success**:
  ```json
  {
    "status": "success",
    "message": "Berhasil follow pengguna"
  }
  ```

#### Unfollow Pengguna
- **URL**: `/follow/:userId`
- **Method**: `DELETE`
- **Headers**: 
  ```
  Authorization: Bearer <token>
  ```
- **Response Success**:
  ```json
  {
    "status": "success",
    "message": "Berhasil unfollow pengguna"
  }
  ```

## Skema Database

### Tabel Users
```prisma
model User {
  id           Int       @id @default(autoincrement())
  username     String    @unique
  passwordHash String    @map("password_hash")
  createdAt    DateTime  @default(now()) @map("created_at")
  
  // Relasi
  posts        Post[]
  followers    Follow[]  @relation("followee")
  following    Follow[]  @relation("follower")

  @@map("users")
}
```

### Tabel Posts
```prisma
model Post {
  id        Int      @id @default(autoincrement())
  userId    Int      @map("user_id")
  content   String
  createdAt DateTime @default(now()) @map("created_at")
  
  // Relasi
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("posts")
}
```

### Tabel Follows
```prisma
model Follow {
  followerId Int      @map("follower_id")
  followeeId Int      @map("followee_id")
  createdAt  DateTime @default(now()) @map("created_at")
  
  // Relasi
  follower   User     @relation("follower", fields: [followerId], references: [id], onDelete: Cascade)
  followee   User     @relation("followee", fields: [followeeId], references: [id], onDelete: Cascade)

  @@id([followerId, followeeId])
  @@map("follows")
}
```

## Keamanan

1. **Password Hashing**
   - Menggunakan bcrypt untuk hashing password
   - Salt rounds: 10

2. **Autentikasi**
   - Menggunakan JWT (JSON Web Token)
   - Token expires dalam 24 jam
   - Token validation di setiap protected route

3. **Validasi Input**
   - Validasi username (minimum 3 karakter)
   - Validasi password (minimum 6 karakter)
   - Sanitasi input untuk mencegah XSS

4. **Database Security**
   - Menggunakan Prisma ORM untuk mencegah SQL injection
   - Cascade delete untuk menjaga integritas data

## Penanganan Error

### Kode Status HTTP
- 200: Sukses
- 201: Berhasil membuat data baru
- 400: Bad Request (input tidak valid)
- 401: Unauthorized (token tidak valid/expired)
- 403: Forbidden (tidak memiliki akses)
- 404: Not Found (data tidak ditemukan)
- 500: Internal Server Error

### Format Response Error
```json
{
  "status": "error",
  "message": "Pesan error yang informatif",
  "errors": [
    "Detail error (optional)"
  ]
}
```

## Pengembangan

Untuk berkontribusi pada project ini:

1. Fork repository
2. Buat branch fitur baru (`git checkout -b fitur/nama-fitur`)
3. Commit perubahan (`git commit -m 'Menambahkan fitur baru'`)
4. Push ke branch (`git push origin fitur/nama-fitur`)
5. Buat Pull Request

## Lisensi

Project ini dilisensikan di bawah Lisensi ISC.
