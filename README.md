# NoteFlow: Multi-Tenant SaaS Notes Application

NoteFlow is a secure, multi-tenant SaaS application that allows different companies to manage their notes and users in complete isolation. It features role-based access control, subscription plan limits, and a modern, responsive user interface built with React and Tailwind CSS.



## ✨ Features

* **Multi-Tenancy**: Secure data isolation ensures that data from one tenant is never accessible to another.
* **Role-Based Access Control**:
    * **Admin**: Can manage subscriptions.
    * **Member**: Can perform CRUD (Create, Read, Update, Delete) operations on notes.
* **Subscription Plans**:
    * **Free Plan**: Limited to a maximum of 3 notes per tenant.
    * **Pro Plan**: Unlimited notes.
* **JWT Authentication**: Secure, token-based authentication for all users.
* **Responsive UI**: A clean, modern, and responsive user interface built with React and Tailwind CSS.

***

## 🏛️ Multi-Tenancy Approach

This application uses a **Shared Schema with a `tenantId`** approach for multi-tenancy.

* **How it Works**: Each tenant (e.g., Acme, Globex) is a document in the `tenants` collection. Every user and note document contains a `tenantId` field that creates a hard link to its parent tenant.
* **Data Isolation**: All database queries in the backend are programmatically filtered by the `tenantId` of the currently authenticated user. This strict filtering at the API level guarantees that a user from one tenant can never access data belonging to another.
* **Why this approach?**: It's an efficient and scalable model that simplifies database management and reduces infrastructure costs compared to schema-per-tenant or database-per-tenant models, while still providing robust, logical data separation.

***

## 🛠️ Tech Stack

* **Frontend**: React, Vite, Tailwind CSS
* **Backend**: Node.js, Express.js
* **Database**: MongoDB (with Mongoose)
* **Authentication**: JSON Web Tokens (JWT)
* **Deployment**: Vercel

***

## 🚀 Getting Started

### Prerequisites

* Node.js (v18 or newer)
* npm or yarn
* MongoDB instance (local or from a cloud provider like MongoDB Atlas)
* A Vercel account for deployment

### Local Development Setup

1.  **Clone the Repository**:
    ```bash
    git clone https://github.com/Spandey34/NoteFlow
    cd NoteFlow
    ```

2.  **Backend Setup (`/backend` folder)**:
    ```bash
    cd api
    npm install
    ```
    Create a `.env` file in the `/api` directory and add your environment variables:
    ```env
    MONGODB_URI=your_mongodb_connection_string
    JWT_SECRET=a_very_strong_and_secret_key
    ```
    Seed the database with initial tenants and users:
    ```bash
    node seed.js
    ```
    Start the backend server:
    ```bash
    npm run dev 
    ```
    The API will be running at `http://localhost:3001`.

3.  **Frontend Setup (`/frontend` folder)**:
    Open a new terminal window.
    ```bash
    cd frontend
    npm install
    ```
    Create a `.env.local` file in the `/frontend` directory:
    ```env
    VITE_BACKEND_URL=http://localhost:3001
    ```
    Start the frontend development server:
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:5173`.

### Deployment to Vercel

1.  **Push to GitHub**: Ensure your project is pushed to a GitHub repository.
2.  **Import to Vercel**: Import the repository into your Vercel dashboard. Vercel will automatically detect the monorepo structure.
3.  **Configure Environment Variables**: In your Vercel project's settings, add the same backend environment variables (`MONGODB_URI`, `JWT_SECRET`) you used locally.
4.  **Deploy**: Trigger a deployment. Vercel will build and deploy both the backend API and the frontend application.

***

## 🔑 Test Accounts

The database is seeded with the following accounts (all with password: **`password`**):

* **Tenant: Acme**
    * `admin@acme.test` (Admin)
    * `user@acme.test` (Member)
* **Tenant: Globex**
    * `admin@globex.test` (Admin)
    * `user@globex.test` (Member)

***

## 📋 API Endpoints

All endpoints are prefixed with `/api`.

| Method | Endpoint                    | Description                           | Access  |
| :----- | :-------------------------- | :------------------------------------ | :------ |
| GET    | `/health`                   | Checks the health of the API server.  | Public  |
| POST   | `/auth/login`               | Authenticates a user and returns a JWT. | Public  |
| GET    | `/notes`                    | Get all notes for the user's tenant.  | Member  |
| POST   | `/notes`                    | Create a new note.                    | Member  |
| GET    | `/notes/:id`                | Get a specific note by its ID.        | Member  |
| PUT    | `/notes/:id`                | Update a specific note.               | Member  |
| DELETE | `/notes/:id`                | Delete a specific note.               | Member  |
| POST   | `/tenants/:slug/upgrade`    | Upgrades a tenant to the Pro plan.    | Admin   |
