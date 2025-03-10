# FOTF Products Platform

A subscription management platform for DayZ server products with username-based authentication.

## Features

- Username/password authentication
- Admin dashboard for product management
- User subscription management
- MongoDB database for secure data storage

## Project Structure

- `/src` - Frontend React application
- `/server` - Express backend API

## Setup

### Prerequisites

- Node.js 16+
- MongoDB Atlas account

### Backend Setup

1. Navigate to the server directory
   ```
   cd server
   ```

2. Install dependencies
   ```
   npm install
   ```

3. Configure the `.env` file with your MongoDB connection string
   ```
   MONGODB_URI=mongodb+srv://<your_username>:<your_password>@<your_cluster>.mongodb.net/fotfproducts?retryWrites=true&w=majority
   JWT_SECRET=your-secret-key-replace-in-production
   PORT=5000
   ```

4. Start the server
   ```
   npm run dev
   ```

### Frontend Setup

1. Install dependencies in the project root
   ```
   npm install
   ```

2. Start the development server
   ```
   npm run dev
   ```

## Admin User

The system automatically creates an admin user on first startup:
- Username: FOTFAdminDev
- Password: FOTFAdmin1970!@!

## API Endpoints

### Authentication
- POST `/api/auth/signup` - Create a new user
- POST `/api/auth/login` - Login with username/password

### Products
- GET `/api/products` - Get all products
- POST `/api/products` - Create a product (admin only)
- PUT `/api/products/:id` - Update a product (admin only)
- DELETE `/api/products/:id` - Delete a product (admin only)

### Subscriptions
- GET `/api/subscriptions` - Get user's subscriptions
- POST `/api/subscriptions` - Create a subscription
- PUT `/api/subscriptions/:id/cancel` - Cancel a subscription

### Admin
- GET `/api/admin/users` - Get all users (admin only)
- GET `/api/admin/subscriptions` - Get all subscriptions (admin only) 