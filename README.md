# 🏛️ Indian Law Penal Code API

A comprehensive RESTful backend API for managing, searching, and analyzing the Indian Penal Code (IPC). Built with Node.js, Express, and MongoDB, this project features a robust MVC architecture, secure authentication, and advanced search/filtering capabilities.

## ✨ Features

- **Robust Authentication:** Secure user registration, login, and stateful token blacklisting using JWTs. Includes OTP-based email verification and password reset flows.
- **Law Management (CRUD):** Full management of Indian Penal Code sections, including the ability to archive, restore, and track update history.
- **Advanced Search & Filters:** Full-text search across laws and categories. Filter laws by act, state, bailability, cognizability, and court.
- **Analytics & Stats:** Aggregation pipelines to fetch system-wide statistics, popular laws, and category breakdowns.
- **Admin Privileges:** Role-based access control allowing admins to ban/unban users, monitor system health, and manage system cache.
- **Security & Middlewares:** Global rate limiting, request logging, and centralized asynchronous error handling.

## 🛠️ Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB & Mongoose (ODM)
- **Security:** bcryptjs (password hashing), jsonwebtoken (JWT), express-rate-limit
- **Testing:** Native Node.js assert tests & Postman

## 🚀 Getting Started

### 1. Prerequisites
- Node.js (v18 or higher)
- MongoDB (Local instance or MongoDB Atlas)

### 2. Installation
Clone the repository and install the backend dependencies:
```bash
git clone https://github.com/DhruvOzha85/indian_law_penal_code_DhruvOzha85.git
cd indian_law_penal_code_DhruvOzha85/backend
npm install
```

### 3. Environment Variables
Create a `.env` file in the `backend` directory with the following variables:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRES_IN=7d
NODE_ENV=development
```

### 4. Database Seeding (Optional)
To populate your MongoDB database with the initial dataset of Indian laws:
```bash
node src/scripts/seed.js
```

### 5. Running the Server
Start the development server with hot-reloading (nodemon):
```bash
npm run dev
```
*(The server will start on `http://localhost:5000`)*

## 📡 API Testing

### Automated Tests
You can run the built-in API integration tests to ensure all core routes are functioning properly:
```bash
# Ensure your server is running in a separate terminal first!
npm run test:api
```

### Manual Testing with Postman
A complete Postman collection is included in the project for easy manual testing.
1. Open Postman.
2. Import the collection located at: `backend/postman/indian-law-penal-code.postman_collection.json`.
3. Set your base URL to `http://localhost:5000` and start testing the endpoints!

## 📁 Project Architecture

The backend follows a strict MVC (Model-View-Controller) structure for clean separation of concerns:
- `/src/config`: Database connection setup.
- `/src/controllers`: Core business logic for handling requests and responses.
- `/src/middlewares`: Security, error handling, auth validation, and request logging.
- `/src/models`: Mongoose database schemas (User, Law, TokenBlacklist, etc.).
- `/src/routes`: Express router definitions mapping URLs to controllers.
- `/src/utils`: Reusable helper functions like standardized API responses and async wrappers.

---
*Developed by Dhruv Ozha*
