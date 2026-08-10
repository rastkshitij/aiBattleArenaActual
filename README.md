# AI Battle Arena

AI Battle Arena is a full-stack application that lets a user submit a prompt or problem and compare responses from multiple AI models in real time. The system runs two model-generated solutions in parallel, then uses a judge model to score each answer based on quality, relevance, and reasoning.

This project combines:
- a Node.js + Express backend
- a Vite + React frontend
- MongoDB for chat persistence and user auth
- multiple AI providers through LangChain
- a graph-based orchestration flow for the evaluation pipeline

---

## Project Overview

The application is designed around a competitive evaluation model:

1. A user logs in and creates or selects a chat.
2. A problem is submitted from the frontend.
3. The backend triggers a multi-model generation workflow.
4. Two models generate solutions at the same time.
5. A separate judge model compares both outputs and assigns scores.
6. The results are returned to the frontend and displayed as a battle between Model A and Model B.

This makes the app feel like a lightweight AI arena where different models compete under the same prompt.

---

## Key Features

- User authentication with JWT and cookies
- Persistent chat history in MongoDB
- Multi-model response generation
- Automated judge scoring with structured output
- Frontend UI with battle cards and verdict panel
- Same-origin API usage in production
- Built frontend served through the backend on one port
- CORS enabled with credentials support

---

## Tech Stack

### Backend
- Node.js
- Express
- TypeScript
- MongoDB with Mongoose
- JWT authentication
- CORS + cookie parsing
- LangChain
- LangGraph
- Dotenv configuration

### Frontend
- React
- Vite
- JavaScript
- Axios for API calls
- Framer Motion for UI animation
- Tailwind CSS
- Lucide icons

### AI Layer
- Google Gemini
- Mistral AI
- Cohere
- LangChain agent and structured output tooling

---

## Architecture

### High-Level Architecture

```text
+-------------------+        HTTP/JSON        +--------------------+
|                   | ----------------------> |                    |
| Frontend (React)  |                         | Backend (Express)  |
| Vite App          | <---------------------- | API Routes         |
|                   |                         | Controllers        |
+-------------------+                         | MongoDB Models     |
                                               | AI Graph Engine    |
                                               +----------+---------+
                                                          |
                                                          v
                                              +---------------------+
                                              | AI Providers        |
                                              | - Gemini            |
                                              | - Mistral           |
                                              | - Cohere            |
                                              +---------------------+
```

### Backend Architecture

The backend is organized into logical modules:

- `server.ts` – starts the application and connects to MongoDB
- `src/app.ts` – Express app setup, middleware, routes, and static file serving
- `src/config/config.ts` – environment-based configuration
- `src/config/db.ts` – MongoDB connection logic
- `src/controllers/` – auth, chat, and AI controller logic
- `src/routes/` – API route declarations
- `src/models/` – Mongoose models for `User` and `Chat`
- `src/middleware/` – auth middleware and request guards
- `src/utils/` – utility helpers
- `src/ai/` – model definitions and graph orchestration

### Frontend Architecture

The frontend is a single-page app built with React and Vite.

Key UI pieces:
- `App.jsx` – main application state and logic
- `AuthForm.jsx` – login/register flow
- `Sidebar.jsx` – chat list and navigation
- `ChatWindow.jsx` – battle UI and message rendering
- `WelcomeIntro.jsx` – intro overlay for first-run experience
- `services/api.js` – centralized API client setup

The frontend is responsible for:
- auth and session management
- chat creation and retrieval
- sending prompts to the backend
- rendering returned model results and judge verdicts

---

## AI Model Flow

### Model Configuration

The AI layer is defined in `Backend/src/ai/model.ai.ts`.

The backend creates three provider instances:

- Google Gemini: `gemini-flash-latest`
- Mistral AI: `mistral-medium-latest`
- Cohere: `command-a-03-2025`

These are wrapped using LangChain classes:

```ts
export const geminiModel = new ChatGoogle({
  model: "gemini-flash-latest",
  apiKey: config.GOOGLE_API_KEY,
})

export const mistralAIModel = new ChatMistralAI({
  model: "mistral-medium-latest",
  apiKey: config.MISTRAL_API_KEY,
})

export const cohereModel = new ChatCohere({
  model: "command-a-03-2025",
  apiKey: config.COHERE_API_KEY,
})
```

### Graph Orchestration

The orchestration logic is implemented in `Backend/src/ai/graph.ai.ts` using LangGraph.

The execution flow is:

1. `solution` node
   - Runs Mistral and Cohere in parallel using `Promise.all()`
   - Each model generates a solution for the same problem
2. `judge_node`
   - Receives both generated solutions
   - Uses Gemini as the judge via an agent with structured output
   - Scores both responses from 0 to 10
   - Produces reasoning for each score
3. Return result
   - The final object includes both solutions and the judge verdict

### Judge Logic

The judge is instructed to:
- evaluate both answers on relevance and quality
- provide numeric scores out of 10
- give clear reasoning for each score
- ensure the two models do not receive identical scores

The structured schema used by the judge includes:
- `solution_1_score`
- `solution_2_score`
- `solution_1_reasoning`
- `solution_2_reasoning`

This ensures consistent output and easier frontend rendering.

---

## Backend API

The backend exposes REST endpoints for auth, chat, and AI interactions.

### Auth Routes
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`

### Chat Routes
- `GET /api/chats`
- `POST /api/chats`
- `GET /api/chats/:id`
- `DELETE /api/chats/:id`
- `POST /api/chats/:id/messages`

### AI Routes
- `POST /invoke`

### Health Check
- `GET /health`

---

## Frontend Data Flow

The frontend uses `Frontend/src/services/api.js` to interact with the backend.

Typical request flow:

```text
User enters prompt
    ↓
App.jsx validates session and chat state
    ↓
chatApi.create() or active chat selection
    ↓
aiApi.invoke({ input, chatId })
    ↓
Backend executes AI battle graph
    ↓
Response is sanitized and rendered in ChatWindow.jsx
```

The UI then shows:
- two model answer panels
- a judge verdict section
- score badges and reasoning summaries

---

## Database Model

### User Model
Stores:
- email
- password hash
- timestamps

### Chat Model
Stores:
- chat title
- user reference
- message list
- timestamps

MongoDB is used for persistence so chats and users survive across sessions.

---

## Environment Variables

Create a `.env` file in the Backend folder with the required values.

Example:

```env
PORT=3000
MONGODB_URI=mongodb://127.0.0.1:27017/ai-battle-arena
JWT_SECRET=your-super-secret-key
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:3000
GOOGLE_API_KEY=your_google_api_key
MISTRAL_API_KEY=your_mistral_api_key
COHERE_API_KEY=your_cohere_api_key
```

Notes:
- `PORT` controls the backend port
- `CLIENT_URL` is used for CORS and same-origin-friendly configuration
- AI provider keys are required to run the model evaluation pipeline

---

## Local Setup

### 1. Install backend dependencies

```bash
cd Backend
npm install
```

### 2. Install frontend dependencies

```bash
cd Frontend
npm install
```

### 3. Start MongoDB

```bash
cd Backend
npm run mongo:start
```

### 4. Start the backend

```bash
cd Backend
npm run dev
```

### 5. Build the frontend for production serving

```bash
cd Frontend
npm run build
```

### 6. Open the app

Once the backend is running on port 3000:

```text
http://localhost:3000
```

---

## Same-Port Deployment Model

This project is set up so the backend can serve the frontend from the same port in production.

### Why this is useful
- avoids frontend/backend port conflicts
- makes deployment simpler
- lets the app be served from a single origin
- works well for containerized or single-server deployment

### How it behaves

- During frontend dev mode, Vite runs on port 5173 and proxies API requests to the backend at port 3000
- In production, the backend serves the built frontend files from `Frontend/dist`
- The browser still sees the app at `http://localhost:3000`

This gives a clean user experience while keeping API and frontend code manageable during development.

---

## Project Structure

```text
aiBattleArenaActual/
├── Backend/
│   ├── package.json
│   ├── server.ts
│   ├── tsconfig.json
│   ├── scripts/
│   │   └── start-local-mongo.js
│   └── src/
│       ├── ai/
│       │   ├── graph.ai.ts
│       │   └── model.ai.ts
│       ├── config/
│       │   ├── config.ts
│       │   └── db.ts
│       ├── controllers/
│       │   ├── ai.controller.ts
│       │   ├── auth.controller.ts
│       │   └── chat.controller.ts
│       ├── middleware/
│       │   └── auth.middleware.ts
│       ├── models/
│       │   ├── Chat.ts
│       │   └── User.ts
│       ├── routes/
│       │   ├── ai.routes.ts
│       │   ├── auth.routes.ts
│       │   └── chat.routes.ts
│       ├── types/
│       │   └── express.d.ts
│       ├── utils/
│       │   └── token.ts
│       └── app.ts
│
├── Frontend/
│   ├── package.json
│   ├── vite.config.js
│   ├── index.html
│   ├── public/
│   └── src/
│       ├── app/
│       │   ├── App.css
│       │   └── App.jsx
│       ├── components/
│       │   ├── AuthForm.jsx
│       │   ├── ChatWindow.jsx
│       │   ├── Sidebar.jsx
│       │   └── WelcomeIntro.jsx
│       ├── services/
│       │   └── api.js
│       └── main.jsx
│
├── .gitignore
├── README.md
└── package-lock.json (if present)
```

---

## Production Notes

For deployment, the recommended flow is:

1. install backend dependencies
2. install frontend dependencies
3. run frontend build
4. start the backend server
5. serve the app through the backend on a single port

This keeps the deployment model simpler and avoids moving parts across multiple ports.

---

## Project Summary

AI Battle Arena is a real-time AI comparison application where multiple language models face off on the same prompt and are judged automatically. It combines modern web architecture with a graph-driven AI orchestration model to create a production-style interactive benchmarking experience.

The app demonstrates:
- multi-model evaluation
- structured AI judge scoring
- web app + API architecture
- persistent user and chat data
- modern frontend UX with battle simulation design

---

## Author / Contact

Project created and maintained by:
- rastkshitij
- Email: rastkshitij@gmail.com

---

## License

This project currently does not declare an explicit license in the repository. Please check with the project owner before commercial or public reuse.
