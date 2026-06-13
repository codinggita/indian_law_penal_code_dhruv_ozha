# LexIndia - Full Stack Legal Dashboard

LexIndia is a comprehensive, API-driven web application designed to simplify the Indian Penal Code and make complex laws easily accessible to everyone. It includes a user-facing law directory, an advanced search engine, and a fully functional Admin Dashboard for managing legal records, analytics, and platform users.

<!-- Note to developer: Add a screenshot of your project here by uploading an image to GitHub and pasting the link below -->
<!-- ![LexIndia Screenshot](YOUR_IMAGE_LINK_HERE) -->

---

## 🚀 Key Features

### User-Facing Features
- **Secure Authentication**: JWT-based login and registration, complete with auto-login using persisted tokens in local storage.
- **Law Directory & Search**: Browse through legal records. Includes a powerful Search Engine with debounced inputs and local session storage that remembers your past queries and active filters.
- **Advanced Filtering**: Narrow down legal codes by Category (e.g., Criminal, Civil, Corporate), Court Level, Bailable/Non-Bailable status, and Cognizable nature.
- **Bookmarking System**: Authenticated users can save their favorite laws to their profile for quick access later.
- **Responsive UI/UX**: Built with Tailwind CSS v4 and Framer Motion for buttery-smooth animations, skeleton loaders, and a fully mobile-optimized navigation bar.
- **Theme System**: Full Light and Dark Mode toggle, reading from user system preferences and saving manually toggled choices via local storage.

### Admin Dashboard Features
- **Role-Based Access Control (RBAC)**: Strict frontend and backend route guards ensure that only authorized 'admin' accounts can access sensitive panels.
- **Law Management (CRUD)**: Create, Read, Update, and Delete laws directly from the UI. Integrated with React Query for instant, optimistic UI updates without page reloads.
- **User Management**: Admins can view all registered users and adjust roles.
- **Analytics Engine**: Backend MongoDB aggregation pipelines that calculate real-time platform statistics (e.g., total laws, user signups, laws by category) and display them via intuitive Recharts graphs.

### Technical & Performance Optimizations
- **Code Splitting**: React `lazy()` and `Suspense` are heavily utilized. The app code is split into logical chunks so users only download the code they need for the page they are viewing.
- **React Error Boundary**: A global fallback screen ensures that rendering crashes are caught elegantly, avoiding the "white screen of death."
- **SEO Optimized**: `react-helmet-async` injects dynamic `<title>` and `<meta name="description">` tags on every page, critical for Google Search indexing.

---

## 🛠️ Technology Stack

### Frontend (Client-Side)
- **Framework**: React 19 + Vite
- **Styling**: Tailwind CSS (v4) for utility-first styling. Custom CSS Variables implemented for dynamic theming.
- **State Management**: 
  - **Zustand**: Handles global authentication state cleanly without the boilerplate of Redux.
  - **React Query (TanStack Query v5)**: Manages all asynchronous API state, caching, data fetching, and optimistic UI updates.
- **Routing**: React Router DOM (v7) with nested layouts and protected route guards.
- **Forms & Validation**: `react-hook-form` coupled with `zod` for robust schema validation and excellent performance.
- **Icons & Animations**: `lucide-react` for SVG icons and `framer-motion` for micro-interactions and page transitions.

### Backend (Server-Side)
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (managed via Mongoose ODM)
- **Authentication**: JWT (JSON Web Tokens) with short-lived access tokens and bcrypt for secure password hashing.
- **Architecture**: Strict MVC (Model-View-Controller) structure.

---

## 📦 System Architecture & Folder Structure

### Backend Directory (`/backend`)
```text
/backend
├── /src
│   ├── /controllers     # Business logic (authController, lawController, analyticsController)
│   ├── /middlewares     # authMiddleware (JWT verification), errorMiddleware
│   ├── /models          # Mongoose Schemas (User, Law)
│   ├── /routes          # Express Router definitions
│   └── /scripts         # DB Seeders (seed.js)
├── .env                 # Environment variables (git-ignored)
└── server.js            # Express application entry point
```

### Frontend Directory (`/frontend`)
```text
/frontend
├── /src
│   ├── /api             # Axios instances and API service wrappers
│   ├── /components      # Reusable UI pieces
│   │   ├── /auth        # ProtectedRoute wrapper
│   │   ├── /layout      # Navbar, Sidebar, Footer, PageWrapper (Helmet)
│   │   ├── /shared      # LawCard, SearchBar
│   │   └── /ui          # Buttons, Badges, Modals, Spinners, ErrorBoundaries
│   ├── /hooks           # Custom React hooks
│   ├── /pages           # Route components mapped by feature (admin, auth, laws, user)
│   ├── /store           # Zustand stores (authStore.js)
│   └── /styles          # globals.css (Tailwind @theme setup)
├── App.jsx              # Main router and Suspense boundary
└── main.jsx             # React entry point, QueryClient, and ThemeProvider
```

---

## 🔌 API Endpoints Summary

The Express backend exposes the following RESTful API routes under `/api/v1`:

### Authentication (`/auth`)
- `POST /register` - Create a new user account.
- `POST /login` - Authenticate a user and return a JWT.
- `GET /me` - Get current authenticated user profile.
- `GET /bookmarks` - Fetch the user's bookmarked laws.
- `POST /bookmarks/:lawId` - Toggle (add/remove) a bookmark.

### Laws (`/laws`)
- `GET /` - Fetch paginated laws (supports `q`, `category`, `bailable`, `court` query strings).
- `GET /:id` - Fetch a specific law by MongoDB `_id`.
- `POST /` - Create a new law *(Admin only)*.
- `PUT /:id` - Update an existing law *(Admin only)*.
- `DELETE /:id` - Delete a law *(Admin only)*.

### Analytics (`/analytics`)
- `GET /dashboard` - Fetch aggregate platform statistics *(Admin only)*.

---

## ⚙️ Setup & Installation Instructions

Follow these steps to run the LexIndia project locally on your machine.

### Prerequisites
- **Node.js**: v18 or higher recommended.
- **MongoDB**: A running local MongoDB server or a free MongoDB Atlas cluster URI.

### 1. Backend Setup
1. Open a terminal and navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install the required Node packages:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root of the `backend` folder and add the following configuration:
   ```env
   NODE_ENV=development
   PORT=5000
   MONGO_URI=mongodb+srv://<username>:<password>@cluster0...
   JWT_SECRET=your_super_secret_jwt_key_here
   JWT_EXPIRE=30d
   ```
4. Start the backend development server (uses `nodemon` for hot-reloading):
   ```bash
   npm run dev
   ```
   *The console should indicate that the server is running on port 5000 and connected to MongoDB.*

### 2. Frontend Setup
1. Open a new, separate terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install the required Node packages:
   ```bash
   npm install
   ```
3. Set up the frontend environment variables. Create a `.env` file in the `frontend` folder:
   ```env
   VITE_API_URL=http://localhost:5000/api/v1
   ```
4. Start the Vite development server:
   ```bash
   npm run dev
   ```

### 3. Usage & Admin Access
1. Open your browser and navigate to `http://localhost:5173`.
2. To test the Admin features, register a new user account via the UI.
3. Open your MongoDB database (e.g., using MongoDB Compass) and find the newly created user in the `users` collection.
4. Manually change the `role` field from `"user"` to `"admin"`.
5. Refresh the website—you will now see the **Admin Dashboard** badge in the navigation bar!
