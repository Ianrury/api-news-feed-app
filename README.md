# News Feed App Backend

This is the backend service for the News Feed application, built with Node.js, Express, TypeScript, and Prisma with PostgreSQL database.

## Features

- User authentication (register, login)
- Post management (create, read)
- Follow system (follow/unfollow users)
- News feed generation based on followed users

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **ORM**: Prisma
- **Database**: PostgreSQL
- **Authentication**: JWT (JSON Web Tokens)

## Prerequisites

Before running this project, make sure you have:

- Node.js (v16 or higher)
- PostgreSQL database
- npm or yarn package manager

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Ianrury/api-news-feed-app.git
   cd api-news-feed-app/backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with the following content:
   ```
   DATABASE_URL="postgresql://username:password@localhost:5432/news_feed_db"
   JWT_SECRET="your-jwt-secret"
   ```

4. Run database migrations:
   ```bash
   npx prisma migrate dev
   ```

## Available Scripts

- `npm run dev` - Start the development server with hot-reload
- `npm run build` - Build the TypeScript code
- `npm start` - Start the production server

## API Endpoints

### Authentication
- `POST /auth/register` - Register a new user
- `POST /auth/login` - Login user

### Posts
- `GET /posts` - Get all posts for the news feed
- `POST /posts` - Create a new post
- `GET /posts/:userId` - Get posts from a specific user

### Follow System
- `POST /follow/:userId` - Follow a user
- `DELETE /follow/:userId` - Unfollow a user
- `GET /follow/followers` - Get list of followers
- `GET /follow/following` - Get list of users being followed

## Database Schema

### User
```prisma
model User {
  id           Int       @id @default(autoincrement())
  username     String    @unique
  passwordHash String
  createdAt    DateTime  @default(now())
  posts        Post[]
  followers    Follow[]  @relation("followee")
  following    Follow[]  @relation("follower")
}
```

### Post
```prisma
model Post {
  id        Int      @id @default(autoincrement())
  userId    Int
  content   String
  createdAt DateTime @default(now())
  user      User     @relation(fields: [userId], references: [id])
}
```

### Follow
```prisma
model Follow {
  followerId Int
  followeeId Int
  createdAt  DateTime @default(now())
  follower   User     @relation("follower")
  followee   User     @relation("followee")
  @@id([followerId, followeeId])
}
```

## Error Handling

The API uses standard HTTP status codes:
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Internal Server Error

## Security

- Password hashing using bcrypt
- JWT-based authentication
- Request validation
- Protected routes using middleware

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License.
