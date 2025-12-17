# UrbanNest - A Real Estate Marketplace

A full-stack real estate marketplace application built with the MERN stack (MongoDB, Express.js, React, Node.js). This platform allows users to list, search, and manage property listings for sale or rent.

## Features

- **Advanced Authentication**: Secure user sign-up and sign-in with JWT (JSON Web Tokens) and Google OAuth integration integration.
- **Real-time Listings**: Create, read, update, and delete (CRUD) property listings.
- **Advanced Search**: Filter properties by type (rent/sale), amenities (parking, furnished), and sort by price or date.
- **Image Uploads**: Multiple image uploads for property listings using Firebase Storage.
- **User Profile**: Manage your account profile, update details, and manage your listings.
- **Contact Landlord**: Direct communication channel to contact property owners via email.
- **Responsive Design**: Fully responsive, mobile-friendly UI built with Tailwind CSS.

## Tech Stack

### Frontend
- **React**: UI library for building the user interface.
- **Vite**: Next Generation Frontend Tooling for fast builds.
- **Redux Toolkit**: State management for user authentication and global states.
- **Tailwind CSS**: Utility-first CSS framework for styling.
- **React Router DOM**: Client-side routing.
- **Firebase**: Used for Google Auth and Image Storage.
- **Swiper**: Touch-enabled mobile slider for image galleries.

### Backend
- **Node.js**: JavaScript runtime environment.
- **Express.js**: Web framework for Node.js.
- **MongoDB**: NoSQL database for flexible data storage.
- **Mongoose**: Object Data Modeling (ODM) library for MongoDB and Node.js.
- **JWT**: Secure authentication via JSON Web Tokens.
- **Bcryptjs**: Password hashing for security.

## Architecture

The application follows a standard Model-View-Controller (MVC) architectural pattern on the backend and a Component-based architecture on the frontend.

- **API Layer**: `api/` directory contains the Express server, routes, controllers, and database models.
- **Client Layer**: `client/` directory contains the React application, pages, components, and Redux logic.

## Prerequisites

Before running the project locally, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v16+)
- [MongoDB](https://www.mongodb.com/) (Local or Atlas URL)

## Environment Variables

Create a `.env` file in the `api` directory with the following variables:

```env
MONGO=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_string
```

Create a `.env` file in the `client` directory (or use `client/src/firebase.js` config directly) for Firebase:

```env
VITE_FIREBASE_API_KEY=your_firebase_api_key
# Add other firebase config keys as needed based on firebase.js
```

## Local Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/mern-estate.git
   cd mern-estate
   ```

2. **Install Dependencies**

   **Server:**
   ```bash
   cd api
   npm install
   ```

   **Client:**
   ```bash
   cd ../client
   npm install
   ```

3. **Start the Development Servers**

   **Server (Terminal 1):**
   ```bash
   cd api
   npm run dev
   ```
   *Server runs on port 5000*

   **Client (Terminal 2):**
   ```bash
   cd client
   npm run dev
   ```
   *Client runs on http://localhost:5173*

4. **Access the App**
   Open your browser and navigate to `http://localhost:5173`.
