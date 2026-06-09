# ChatFlow

> A real-time chat application built with React, Node.js, Socket.io, and MongoDB.

🟢 **[Live Demo](https://chatflow-rouge.vercel.app)** — *(First load may take 30–60 seconds — free tier server spins down after inactivity)*

---

## Screenshot

> <img width="1894" height="1025" alt="Screenshot 2026-06-09 111247" src="https://github.com/user-attachments/assets/d2b9d264-7d7e-40d0-a729-7875fd4af9ff" />


---

## Features

- **JWT Authentication** — register, login, persistent sessions via localStorage
- **Real-time Messaging** — instant message delivery using Socket.io WebSockets
- **Group Rooms** — create and join chat rooms, live message history
- **Direct Messages** — private 1-on-1 conversations with deterministic room keying
- **Typing Indicators** — see when others are typing in real time
- **Online Presence** — live online/offline status dots, accurate across multiple tabs
- **Unread Badges** — unread message counts per room and DM, clear on open
- **Dark / Light Theme** — toggle with persistence, no flash on reload
- **Mobile Responsive** — collapsible sidebar, works on any screen size
- **Persistent History** — message history fetched from MongoDB on load

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, React Router v6, plain CSS |
| Real-time | Socket.io (WebSockets) |
| Backend | Node.js, Express |
| Database | MongoDB Atlas, Mongoose |
| Auth | JWT, bcrypt |
| Deployment | Vercel (client), Render (server) |

---

## Architecture Decisions

**Why Socket.io?** Pure WebSockets require manual reconnection logic, room management, and fallback handling. Socket.io handles all of this out of the box, letting me focus on the application logic — typing indicators, presence broadcasting, and deterministic DM room keys.

**Why JWT over sessions?** The client and server are deployed on separate domains (Vercel + Render), so cookie-based sessions would require complex cross-origin configuration. JWT stored in localStorage travels cleanly with every request and socket handshake.

**Why MongoDB?** Chat data is document-shaped — messages have variable metadata, DMs and room messages have different fields. MongoDB's flexible schema fit this better than a rigid relational model, and Atlas's free tier made cloud deployment straightforward.

---

## Running Locally

**Prerequisites:** Node.js 18+, a MongoDB Atlas cluster

**1. Clone the repo**
```bash
git clone https://github.com/Surendra138/chatflow.git
cd chatflow
```

**2. Set up server environment**
```bash
cd server
cp .env.example .env
```
Fill in `server/.env`:
```
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=any_long_random_string
CLIENT_URL=http://localhost:5173
```

**3. Set up client environment**
```bash
cd ../client
cp .env.example .env
```
Fill in `client/.env`:
```
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

**4. Install dependencies and run**
```bash
# Terminal 1 — server
cd server && npm install && npm run dev

# Terminal 2 — client
cd client && npm install && npm run dev
```

App runs at `http://localhost:5173`

---

## Project Structure

```
chatflow/
├── client/                  # React + Vite frontend
│   └── src/
│       ├── pages/           # LoginPage, RegisterPage, RoomPage, DMPage
│       ├── components/      # Layout, chat components, shared UI
│       ├── context/         # AuthContext, SocketContext
│       ├── hooks/           # useMessages, useTyping, usePresence, useTheme
│       └── services/        # API call functions (auth, rooms, messages, users)
│
└── server/                  # Node + Express backend
    └── src/
        ├── models/          # User, Room, Message (Mongoose schemas)
        ├── routes/          # Auth, rooms, messages, users REST endpoints
        ├── middleware/       # JWT verification
        └── socket/          # Socket.io setup + event handlers
```
