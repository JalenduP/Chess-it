# Chess-It ♟️

A full-stack chess application with real-time multiplayer gameplay, ELO rating system, and AI integration using Stockfish engine.

## 🚀 Features

### Core Gameplay
- Real-time Multiplayer Chess - Play against other users with live updates
- Stockfish AI Integration - Challenge the powerful chess engine at various difficulty levels
- ELO Rating System - Track your skill level and climb the ranks
- Game History & Analytics - View detailed statistics and game replays with Recharts

### User Experience
- Smooth Animations - Enhanced visuals with GSAP animations
- Modern UI/UX - Beautiful interface built with React and Tailwind CSS
- Responsive Design - Play seamlessly across all devices
- Real-time Notifications - Stay updated with game events and challenges

### Technical Features
- JWT Authentication - Secure user authentication and authorization
- WebSocket Support - Real-time communication for live games
- MongoDB Database - Persistent data storage for users and games
- Email Notifications - Account verification and game updates via Nodemailer

## 🛠️ Tech Stack

### Backend
- Node.js - Runtime environment
- Express.js - Web framework
- MongoDB with Mongoose - Database and ODM
- Socket.IO - Real-time bidirectional communication
- JWT - Authentication tokens
- bcryptjs - Password hashing
- Stockfish - Chess engine integration
- chess.js - Chess logic and move validation
- Nodemailer - Email service integration

### Frontend
- React 19 - UI library with latest features
- React Router DOM - Client-side routing
- Tailwind CSS - Utility-first CSS framework
- GSAP - Advanced animations
- React Chessboard - Chess board component
- Axios - HTTP client for API calls
- Socket.IO Client - Real-time communication
- Recharts - Data visualization for game analytics
- Lucide React & React Icons - Beautiful icon library

## 📁 Project Structure

```bash
chess-it/
├── backend/
│   ├── config/                 # Database and app configuration
│   ├── controllers/            # Route controllers
│   ├── engine/stockfish/       # Stockfish chess engine integration
│   ├── middleware/             # Authentication & validation middleware
│   ├── models/                 # MongoDB models (User, Game, etc.)
│   ├── routes/                 # API routes
│   ├── services/               # Business logic services
│   ├── sockets/                # WebSocket event handlers
│   ├── utils/                  # Utility functions
│   ├── server.js               # Main server entry point
│   ├── stockfish-ws.js         # Stockfish WebSocket server
│   └── package.json
│
├── frontend/
│   ├── public/                 # Static assets
│   ├── src/                    # React source code
│   │   ├── components/         # Reusable React components
│   │   ├── pages/              # Page components
│   │   ├── hooks/              # Custom React hooks
│   │   ├── utils/              # Frontend utilities
│   │   └── styles/             # CSS and Tailwind styles
│   ├── package.json
│   ├── tailwind.config.js
│   └── postcss.config.js
│
└── README.md
```

## ⚙️ Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- Stockfish chess engine

### Backend Setup

1. Navigate to backend directory
   ```bash
   cd backend
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Environment Configuration
   
   Create a `.env` file in the backend directory with the following variables:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/chess-it
   JWT_SECRET=your_jwt_secret_key_here
   EMAIL_SERVICE=gmail
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_app_password
   NODE_ENV=development
   CLIENT_URL=http://localhost:3000
   ```

4. Start the backend server
   
   Development mode:
   ```bash
   npm run dev
   ```
   
   Production mode:
   ```bash
   npm start
   ```

### Frontend Setup

1. Navigate to frontend directory
   ```bash
   cd frontend
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Environment Configuration (Optional)
   
   Create a `.env` file in the frontend directory if needed:
   ```env
   REACT_APP_API_URL=http://localhost:5000
   REACT_APP_WS_URL=ws://localhost:5000
   ```

4. Start the development server
   ```bash
   npm start
   ```

5. Build for production
   ```bash
   npm run build
   ```

## 🎮 Usage

### Starting the Application

1. Start MongoDB (if using local instance)
   ```bash
   mongod
   ```

2. Start Backend Server
   ```bash
   cd backend
   npm run dev
   ```

3. Start Frontend Development Server
   ```bash
   cd frontend
   npm start
   ```

4. Access the Application
   - Open your browser and navigate to `http://localhost:3000`
   - The backend API will be available at `http://localhost:5000`

### Game Modes

- Play vs AI: Challenge Stockfish at various difficulty levels
- Multiplayer: Play against other users in real-time

## 📊 ELO Rating System

The application implements a standard ELO rating system:
- Initial rating: 1500
- K-factor: 32 for new players (<30 games), 16 for established players
- Rating updates after each completed game

Chess-It - Elevate your chess game with modern technology and real-time competition! ♟️
