<div align="center">

# 🏛️ Indian Law Penal Code API

### Full Stack MERN Backend System

[![Node.js](https://img.shields.io/badge/Node.js-18.x-green.svg)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express.js-4.x-lightgrey.svg)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-success.svg)](https://www.mongodb.com/)
[![JWT](https://img.shields.io/badge/JWT-Authentication-blue.svg)](https://jwt.io/)

</div>

---

## 📖 Project Overview

The **Indian Law Penal Code API** is a comprehensive, RESTful backend service designed to manage, search, and analyze legal documents and sections within the Indian Penal Code. Built strictly adhering to the MVC (Model-View-Controller) architecture, it offers a secure, scalable, and highly performant foundation for any web or mobile frontend.

This system provides capabilities tailored for different user roles (Public, Authenticated Users, and Administrators), featuring full-text search, complex querying, detailed analytics, and robust JWT-based security.

---

## 🚀 Key Features

### 🔐 Advanced Authentication & Security
- **JWT Implementation**: Secure token generation with customizable expiration times.
- **Stateful Logout (Token Blacklisting)**: Unlike traditional stateless JWTs, logged-out tokens are stored in a MongoDB `TokenBlacklist` collection to ensure they cannot be reused before they expire.
- **OTP Workflows**: Integrated One-Time Password generation for email verification and secure password resets.
- **Role-Based Access Control (RBAC)**: Distinct permissions for `admin` and `user` roles.
- **Brute Force Protection**: Global rate limiting via `express-rate-limit` to prevent abuse.

### ⚖️ Law Management System
- **Full CRUD Operations**: Create, Read, Update, and Delete legal records.
- **Soft Deletes**: Archive and restore functionality, ensuring data is never accidentally destroyed permanently.
- **Audit Trails**: Built-in update history tracking to see when and how a law was modified.
- **Dynamic Summaries**: Dedicated endpoints that return brief summaries (title, section, punishment) for quick previews.

### 🔍 Search & Filtering Engine
- **Full-Text `$regex` Search**: Instantly query titles, descriptions, and categories.
- **Multi-parameter Filtering**: Narrow down results by Act Name, Category, State, Court type, Bailability, and Cognizability.
- **Pagination & Sorting**: Built-in limit/offset pagination and dynamic sorting (e.g., sort by most viewed).

### 📊 Analytics & Reporting
- **Aggregation Pipelines**: Utilizes MongoDB's powerful aggregation framework to generate real-time statistics.
- **Data Insights**: Fetch breakdowns of laws by category, state, and court.
- **Trending Data**: Identify the most viewed and most bookmarked laws across the platform.

### 👑 Admin Privileges
- **User Management**: View all users, ban/unban malicious accounts, and elevate user roles.
- **System Monitoring**: Endpoints to check server health status, view system logs, and fetch security events.

---

## 🛠️ Tech Stack & Dependencies

| Technology / Package | Purpose |
|----------------------|---------|
| **Node.js** | Server-side JavaScript runtime engine |
| **Express.js** | Fast, unopinionated web framework for Node.js |
| **MongoDB & Mongoose** | NoSQL Database and powerful Object Data Modeling (ODM) library |
| **Bcryptjs** | Cryptographic hashing of user passwords |
| **JsonWebToken (JWT)** | Secure transmission of information as a JSON object |
| **Express-Rate-Limit** | Basic rate-limiting middleware to prevent DDoS attacks |
| **Cors** | Cross-Origin Resource Sharing configuration |
| **Dotenv** | Zero-dependency module that loads environment variables |

---

## 📁 Project Architecture (MVC)

The backend is strictly organized into functional directories to maintain separation of concerns:

```text
backend/
├── postman/                         # Pre-configured Postman collections for API testing
├── src/
│   ├── config/                      # Database and environment configurations
│   ├── controllers/                 # Business logic for Auth, Laws, Admin, and Analytics
│   ├── middlewares/                 # JWT Auth guards, Rate limiters, Global Error Handlers
│   ├── models/                      # Mongoose Schemas (User, Law, TokenBlacklist)
│   ├── routes/                      # Express Router definitions
│   ├── scripts/                     # Automated testing (api.test.js) and DB seeding tools
│   ├── services/                    # Reusable service-level functions (Optional Layer)
│   └── utils/                       # API Response formatters and Async Error wrappers
├── .env                             # Environment variables (Ignored in Git)
├── server.js                        # Main application entry point
└── package.json                     # Dependency manifests and NPM scripts
```

---

## 🗃️ Database Schemas

### User Schema (`models/User.js`)
Handles all authentication and user metadata.
- `name`, `email`, `password` (hashed)
- `role` (enum: user, admin)
- `isBanned`, `isVerified`
- `otp`, `otpExpiry` (for password resets)

### Law Schema (`models/Law.js`)
Stores the legal documentation.
- `sectionNumber`, `title`, `description`
- `actName`, `category`, `state`, `court`
- `bailable`, `cognizable`, `compoundable`
- `views`, `bookmarkCount`, `isArchived`
- `updateHistory` (Array of modification records)

### Token Blacklist Schema (`models/TokenBlacklist.js`)
Maintains session security by expiring instantly upon logout.
- `token` (The JWT string)
- `createdAt` (Automatically expires via TTL index)

---

## 📡 API Endpoints Reference

### 🔐 Authentication
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/v1/auth/register` | Register a new account |
| `POST` | `/api/v1/auth/login` | Authenticate and retrieve JWT |
| `POST` | `/api/v1/auth/logout` | Invalidate current JWT |
| `POST` | `/api/v1/auth/forgot-password` | Request an OTP for password reset |
| `POST` | `/api/v1/auth/reset-password` | Reset password using verified OTP |
| `GET` | `/api/v1/auth/profile` | Retrieve current user's profile |

### 📚 Law Management
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/v1/laws` | Fetch all laws (Supports `?page`, `?limit`, `?sort`) |
| `GET` | `/api/v1/laws/:id` | Fetch details of a specific law |
| `POST` | `/api/v1/laws` | Create a new law (Admin only) |
| `PATCH` | `/api/v1/laws/:id` | Update specific fields of a law (Admin only) |
| `DELETE` | `/api/v1/laws/:id` | Delete a law permanently (Admin only) |
| `PATCH` | `/api/v1/laws/:id/archive` | Soft-delete a law (Admin only) |

### 🔍 Search & Filters
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/v1/search/laws?q=keyword` | Full-text search across laws |
| `GET` | `/api/v1/laws/filter/category/:cat`| Fetch laws by specific category |
| `GET` | `/api/v1/laws/filter/bailable/true`| Fetch all bailable offenses |

### 📊 Analytics & Stats
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/v1/analytics/laws/by-category`| Breakdown of laws per category |
| `GET` | `/api/v1/analytics/laws/most-viewed`| Top trending laws |
| `GET` | `/api/v1/stats/laws/count` | Total active vs repealed laws |

---

## ⚙️ Setup & Installation

Follow these steps to get the server running locally on your machine.

### 1. Prerequisites
Ensure you have the following installed:
- [Node.js](https://nodejs.org/en/download/) (v18.x or higher)
- [MongoDB](https://www.mongodb.com/try/download/community) (Local instance or an Atlas URI)

### 2. Clone the Repository
```bash
git clone https://github.com/DhruvOzha85/indian_law_penal_code_DhruvOzha85.git
cd indian_law_penal_code_DhruvOzha85/backend
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Configure Environment Variables
Create a file named `.env` in the `backend` root folder. Add the following variables, customizing them as needed:
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
MONGO_URI=mongodb://localhost:27017/indian_law_penal_code

# Security (Make sure to use a strong secret in production!)
JWT_SECRET=your_super_secret_jwt_key_12345
JWT_EXPIRES_IN=7d
```

### 5. Seed the Database (Optional)
If you want to start with a pre-populated database of laws, run the seed script:
```bash
node src/scripts/seed.js
```

### 6. Run the Server
To start the server in development mode (which automatically restarts upon file changes using `nodemon`):
```bash
npm run dev
```
You should see a console message indicating: `MongoDB Connected...` and `Server running in development mode on port 5000`.

---

## 🧪 Testing the API

### Automated Integration Tests
The repository includes an automated test script that validates the primary endpoints. Make sure the server is running in one terminal, then open a second terminal and run:
```bash
npm run test:api
```

### Manual Testing via Postman
We have included a comprehensive Postman collection with predefined endpoints, headers, and request bodies.
1. Open [Postman](https://www.postman.com/downloads/).
2. Click **Import** and select the file located at: `backend/postman/indian-law-penal-code.postman_collection.json`.
3. Ensure your local server is running.
4. Set the `baseUrl` variable in Postman to `http://localhost:5000`.
5. You can now execute the pre-configured `Login`, `Register`, and `Law` requests easily!

---

<div align="center">
<i>Designed and developed by Dhruv Ozha</i>
</div>
