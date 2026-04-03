# Lumo AI

**Lumo** is an advanced AI-powered conversational agent that seamlessly integrates with your Google Workspace to automate and streamline your everyday tasks. Built with a modern agentic architecture using LangGraph and powered by Gemini 2.5 Pro, Lumo can manage your calendar, coordinate and manage spreadsheets, execute email automation, and interact with the web based on your natural language instructions.

## 🚀 Key Features

*   **Deep Google Workspace Integration (OAuth2):**
    *   **Google Calendar:** Naturally schedule, read, edit, and delete calendar events.
    *   **Google Sheets:** Tell Lumo to create, update, read, and manage spreadsheets without leaving the chat.
    *   **Gmail:** Read recent emails and utilize LLM-based email automation to draft and manage responses.
    *   **YouTube:** Automatically create custom YouTube playlists.
*   **Intelligent Conversational Engine:**
    *   Powered by Google's **Gemini 2.5 Pro** via LangChain.
    *   Agentic workflow utilizing **LangGraph** (StateGraph) with dynamic tool nodes to autonomously deduce the right actions for complex requests.
    *   Persistent context tracking using LangGraph's Memory Saver to remember conversation history across sessions.
    *   Integrated real-time web search capabilities equipped by **Tavily**.
*   **Utility Tools:**
    *   Automatic PDF generation from data.
    *   Web scraping and automation possibilities using Puppeteer.

## 🛠️ Tech Stack

### Frontend (`/Client`)
*   **Framework:** React 19 + Vite
*   **Styling:** Tailwind CSS (v4)
*   **State Management:** Zustand
*   **Routing:** React Router v7
*   **Markdown:** `react-markdown` to neatly render LLM responses.
*   **Icons:** Lucide React

### Backend (`/Server`)
*   **Runtime Framework:** Node.js + Express (v5)
*   **Database:** MongoDB + Mongoose
*   **AI SDKs:** `@langchain/google-genai`, `@langchain/groq`, `@langchain/langgraph`, `@langchain/tavily`
*   **Authentication:** Google OAuth2 Client (`googleapis`) + JSON Web Tokens (JWT)
*   **Additional Packages:** Puppeteer, Cloudinary, Socket.io, Zod.

## 📂 Project Architecture

```
Lumo/
├── Client/                 # Frontend React Application
│   ├── src/
│   │   ├── Components/     # Reusable UI components
│   │   ├── Pages/          # Application views (e.g., Chat interface)
│   │   ├── Zustand/        # Global state management config
│   │   └── ...
│   └── package.json
└── Server/                 # Backend Express Service
    ├── src/
    │   ├── config/         # LangGraph workflows, LLM tool bindings, DB strings
    │   ├── controllers/    # Route controllers (Auth, Chat execution)
    │   ├── Middleware/     # JWT Authorization checks
    │   ├── Model/          # MongoDB Mongoose schemas (User)
    │   ├── routes/         # Express endpoint definitions
    │   └── utils/          # Formatting and JWT helper functions
    ├── index.js            # Express app entry point
    └── package.json
```

## 📦 Getting Started

### Prerequisites

To run this application, ensure you have the following environment resources prepared:
*   **Node.js** (v18+)
*   **MongoDB** connection URI
*   **Google Cloud Console Project** with the following configured:
    *   OAuth 2.0 Web Client credentials (Client ID & Secret).
    *   APIs Enabled: Google Calendar API, Google Sheets API, Gmail API, YouTube Data API v3.
*   **Gemini API Key** (from Google AI Studio)
*   **Tavily API Key** (for web search)

### Setting up the Backend

1.  Navigate to the Server directory:
    ```bash
    cd Server
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Create a `.env` file in the `Server` root directory replicating these environment properties:
    ```env
    PORT=5000
    MONGO_URI=your_mongodb_connection_string
    GCID=your_google_client_id
    GSECRET=your_google_client_secret
    REDIRECT_URL=http://localhost:5000/api/callback
    GEMINI_API_KEY=your_gemini_api_key
    TAVILY=your_tavily_api_key
    # Add other requisite secrets (Cloudinary, JWT secret, etc.)
    ```
4.  Start the Express server:
    ```bash
    npm run dev
    ```

### Setting up the Frontend

1.  Navigate to the Client directory:
    ```bash
    cd Client
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the Vite local development server:
    ```bash
    npm run dev
    ```

## 🔒 Authentication Flow Notice

Lumo heavily relies on Google OAuth Authentication to securely act on behalf of your Google account.
*Note: If the application's OAuth consent screen is not yet officially verified by Google, you may be presented with an "Unverified App" warning during login. You can bypass this securely during local development by proceeding explicitly to the app.*
