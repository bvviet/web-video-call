# Web Video Call Project

This project is a web-based video call application built with **Node.js** and **Express** for the backend, and **Next.js** for the frontend. The platform provides real-time communication features leveraging WebRTC and Socket.IO.

## Features

-   **Real-time video and audio calls**
-   **Room management** (create, join, and leave rooms)
-   **Chat functionality** within video call rooms
-   **Responsive UI** for both desktop and mobile
-   **Screen sharing** between two users

---

## Tech Stack

### Frontend

-   **Next.js**
    -   React framework for server-side rendering and dynamic routing.
-   **TailwindCSS**
    -   Utility-first CSS framework for fast and responsive styling.
-   **WebRTC API**
    -   For peer-to-peer communication.

### Backend

-   **Node.js**
    -   JavaScript runtime for server-side logic.
-   **Express.js**
    -   Web framework for building APIs and managing Socket.IO connections.
-   **Socket.IO**
    -   Enables real-time, bi-directional communication between the server and clients.
-   **MongoDB**
    -   Database for storing user information, room details, and call history.

---

## Installation and Setup

### Prerequisites

-   **Node.js** (version 16 or above)
-   **MongoDB** (local or cloud instance)

### Steps

1. Clone the repository:

    ```bash
    git clone https://github.com/your-repo/web-video-call.git
    cd web-video-call
    ```

2. Install dependencies for both the frontend and backend:

    ```bash
    # Install backend dependencies
    cd backend
    npm install

    # Install frontend dependencies
    cd ../frontend
    npm install
    ```

3. Set up environment variables:

    - Backend (`backend/.env`):
        ```env
        PORT=5000
        MONGO_URI=mongodb://localhost:27017/web-video-call
        JWT_SECRET=your_jwt_secret
        ```
    - Frontend (`frontend/.env.local`):
        ```env
        NEXT_PUBLIC_API_URL=http://localhost:5000
        ```

4. Start the backend server:

    ```bash
    cd backend
    npm start
    ```

5. Start the frontend server:

    ```bash
    cd ../frontend
    npm run dev
    ```

6. Access the application in your browser:
    ```
    http://localhost:3000
    ```

---

## Project Structure

### Backend (`/backend`)

-   **`server.js`**: Entry point for the backend application.
-   **`routes/`**: Contains API routes for user authentication and room management.
-   **`models/`**: Mongoose models for MongoDB collections.
-   **`controllers/`**: Logic for handling requests.
-   **`sockets/`**: Socket.IO implementation for real-time features.

### Frontend (`/frontend`)

-   **`pages/`**: Next.js page components.
-   **`components/`**: Reusable React components (e.g., VideoPlayer, ChatBox).
-   **`hooks/`**: Custom React hooks (e.g., useSocket, useAuth).
-   **`styles/`**: Global and component-specific CSS.

---

## Key Functionalities

### 1. Video and Audio Call

-   Uses WebRTC for establishing peer-to-peer connections.
-   Manages call initiation, joining, and ending.

### 2. Room Management

-   Rooms are dynamically created and managed on the backend.
-   Users can join or leave rooms in real time.

### 3. Chat Feature

-   Real-time text messaging during calls via Socket.IO.

### 4. Screen Sharing

-   Enables users to share their screens during a call.

---

## Future Enhancements

-   Add **recording and playback** functionality.
-   Introduce **push notifications** for incoming calls.
-   Implement **advanced analytics** for call quality monitoring.

---

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Commit your changes and push to your branch.
4. Submit a pull request with a detailed description of your changes.

---

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.
