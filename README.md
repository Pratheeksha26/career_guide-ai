# 🚀 Career Guidance AI Chatbot

A state-of-the-art career guidance platform powered by Artificial Intelligence. This comprehensive ecosystem helps students and professionals navigate their career paths through intelligent counseling, resume optimization, and high-fidelity interview simulations.

---

## ✨ Key Features

### 🤖 AI Career Assistant
- **Contextual Guidance**: Engage in deep, meaningful conversations about career choices, stream selections, and industry trends.
- **Persistent Chat History**: Securely save and manage multiple chat sessions with personalized titles and easy retrieval.
- **Smart Formatting**: Rich markdown support for clear, structured advice.

### 📄 Intelligent Resume Analyzer
- **PDF Text Extraction**: Seamlessly upload and parse PDF resumes.
- **AI-Powered Analysis**: Get instant feedback on your skills, project highlights, and formatting.
- **Persistent Storage**: Uploaded files are saved securely, allowing you to return to your review sessions at any time.

### 🎥 AI Mock Interviewer (New!)
- **Immersive Interface**: High-fidelity webcam and microphone integration for realistic simulations.
- **Real-time Transcription**: Powered by the Web Speech API for instant verbal feedback.
- **Behavioral Analysis**: Evaluates **answer quality (STAR method)**, **confidence** (analyzing filler words), **posture**, and **attire**.
- **Comprehensive Scorecard**: Receive detailed performance reports with specific "Pro-Tips" for improvement.

### 🔐 2-Step Verification (2FA)
- **Email Confirmation**: Secure login and registration with 6-digit OTP codes.
- **Stateless Verification**: High security with temporary verification tokens.
- **Auto-Sync**: Automatically handles verified status in the user profile.

### 🧠 Aptitude Training
- **Topic-wise Practice**: Tackle quantitative, logical, verbal, and data interpretation questions.
- **Progress Tracking**: Real-time scoring and difficulty-based question selection.
- **Tips & Tricks**: Access expert strategies for common placement and entrance exam topics.

---

## 🛠️ Tech Stack

### Frontend
- **React.js**: Robust component-based UI.
- **Vite**: Ultra-fast build tool and development server.
- **Vanilla CSS**: Premium, custom aesthetics with an earthy, professional theme.
- **React Icons**: Industry-standard iconography.

### Backend
- **Node.js & Express**: High-performance API architecture.
- **PostgreSQL**: Robust, relational database for secure and structured data management.
- **Sequelize ORM**: Powerful database abstraction layer with JSONB support.
- **Groq API**: Leveraging Llama 3 models for ultra-fast, intelligent AI analysis.
- **Nodemailer**: Integrated email service for secure 2FA delivery.
- **JWT**: Secure, stateless authentication.

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v18 or higher)
- **PostgreSQL** (Local instance or Neon/RDS connection string)
- **Groq API Key** (Get one at [console.groq.com](https://console.groq.com))
- **SMTP Server** (Gmail or similar for 2FA emails)

### Installation & Setup

1. **Clone the repository**:
   ```bash
   git clone <your-repo-link>
   cd career-guidance-chatbot
   ```

2. **Backend Configuration**:
   ```bash
   cd backend
   npm install
   ```
   Create a `.env` file in the `backend` directory:
   ```env
   PORT=8080
   DATABASE_URL=your_postgresql_connection_string
   JWT_SECRET=your_super_secret_key
   GROQ_API_KEY=your_groq_api_key
   
   # Email settings
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_app_password
   ```

3. **Frontend Configuration**:
   ```bash
   cd ../frontend
   npm install
   ```

### Running the Application

You will need two terminal windows:

**Terminal 1 (Backend):**
```bash
cd backend
npm run dev
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm start
```

Access the platform at: [http://localhost:5000](http://localhost:5000)

---

## 🔐 Environment Variables Summary

| Variable | Description | Default |
| :--- | :--- | :--- |
| `PORT` | Backend server port | `8080` |
| `DATABASE_URL` | Connection string for PostgreSQL | Required |
| `JWT_SECRET` | Secret key for token signing | Required |
| `GROQ_API_KEY` | API key from Groq Cloud Console | Required |
| `EMAIL_USER` | SMTP username for 2FA | Required |
| `EMAIL_PASS` | SMTP password for 2FA | Required |

---

## 📁 Project Structure

```text
career-guidance-chatbot/
├── backend/            # Express.js Server
│   ├── controllers/    # Business logic (AI analysis, auth)
│   ├── models/         # Mongoose Schemas (Interview, User, Chat)
│   ├── routes/         # API Endpoints
│   ├── services/       # External integrations (Groq, Files)
│   └── uploads/        # Secure storage for resumes & chat files
├── frontend/           # React Frontend
│   ├── src/
│   │   ├── api/        # Axios configuration
│   │   ├── components/ # Reusable UI components
│   │   ├── pages/      # Main application views
│   └── public/         # Static assets
└── README.md           # Documentation
```

---

## ⚖️ License
Distributed under the MIT License. See `LICENSE` for more information.
