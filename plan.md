## Project Plan

- [ ] **Project Setup**

  - [Done ] Initialize Node.js project (`npm init -y`)
  - [done ] Install dependencies: `express`, `cors`, `dotenv`, `googleapis`
  - [done ] Setup basic Express server (`index.js`)
  - [done ] Create folder structure: `/routes`, `/controllers`, `/utils`
  - [done ] Add `.env` file for secrets (PORT, Google Client ID/Secret)

- [ ] **Google OAuth & Authentication**

  - [ ] Enable Google OAuth 2.0 in Google Cloud Console
  - [ ] Setup `/api/auth/google` route for login
  - [ ] Store access tokens securely (session or DB)
  - [ ] Test authentication flow with Postman

- [ ] **YouTube API Integration**

  - [ ] Enable YouTube Data API v3
  - [ ] Setup `/api/playlist/create` to create private playlist
  - [ ] Setup `/api/playlist/add-video` to add videos to playlist
  - [ ] Return playlist URL to user

- [ ] **Google Calendar API Integration**

  - [ ] Enable Calendar API in Google Cloud Console
  - [ ] Setup `/api/calendar/schedule` route to create events
  - [ ] Handle natural language input ("schedule meeting with Soumen on 28 Sep at 2 PM")
  - [ ] Return confirmation with event link

- [ ] **Google Sheets API Integration**

  - [ ] Enable Google Sheets API
  - [ ] Setup `/api/sheet/create` route
  - [ ] Allow AI to create and fill sheet with provided data
  - [ ] Return sheet link to user

- [ ] **PDF Generation**

  - [ ] Setup `/api/pdf/generate` route
  - [ ] Use `pdfkit` or `reportlab` (if Python microservice) to generate PDF
  - [ ] Return downloadable PDF link

- [ ] **Flashcard & Quiz System**

  - [ ] Design `/api/quiz/generate` route
  - [ ] Generate flashcards from user content
  - [ ] Accept answers (multiple choice or typed)
  - [ ] Evaluate results and send improvement suggestions

- [ ] **Frontend Setup (Optional)**

  - [ ] Setup Vite + React app
  - [ ] Create simple dashboard with:
    - [ ] Playlist management
    - [ ] Calendar view
    - [ ] Quiz/flashcard UI
    - [ ] PDF & sheet generator buttons
  - [ ] Add voice interaction support (basic)

- [ ] **Testing & Deployment**
  - [ ] Test all API routes locally with Postman
  - [ ] Add error handling & validation
  - [ ] Deploy backend to Render/Vercel/Heroku
  - [ ] Deploy frontend (if any)
  - [ ] Write README with setup instructions

---

## Advanced / Future Features

- [ ] **Murf AI Text-to-Speech**

  - [ ] Integrate Murf AI API for natural-sounding AI voice replies
  - [ ] Add "Roger that!" style confirmations for actions
  - [ ] Allow user to pick preferred voice style (male/female, formal/fun)

- [ ] **Voice Command Support**

  - [ ] Integrate Whisper or AssemblyAI for speech-to-text
  - [ ] Allow users to speak commands like "Create a playlist for React tutorials"
  - [ ] Make responses fully voice-enabled for hands-free use

- [ ] **Gamification & Motivation**

  - [ ] Add streak tracking and progress points
  - [ ] Show improvement dashboard for quizzes
  - [ ] Daily motivational voice messages using Murf AI

- [ ] **Collaboration Features**

  - [ ] Share playlists, sheets, or PDFs with classmates/teachers
  - [ ] Collaborative flashcard decks

- [ ] **AI-Powered Insights**

  - [ ] Track study patterns & suggest better scheduling
  - [ ] Automatically summarize YouTube videos before adding to playlist
  - [ ] Generate weekly learning report as PDF + voice summary

- [ ] **Mobile-Friendly Version**
  - [ ] Build PWA (Progressive Web App)
  - [ ] Add offline flashcard/quiz support
