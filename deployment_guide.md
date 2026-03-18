# 🚀 Project Deployment Guide

Follow these steps to deploy your Career Guidance AI platform from **localhost** to the **cloud**.

## Step 1: Set up MongoDB Atlas (Database)
Your project currently uses a local MongoDB. To make it accessible worldwide, you need a cloud database.
1.  Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2.  Create a **Free Cluster**.
3.  Add a **Database User** (Username & Password).
4.  Whitelist **0.0.0.0/0** (Allow access from any IP for your deployment server).
5.  Get your **Connection String** (`mongodb+srv://...`).

---

## Step 2: Deploy Backend to Render
1.  Log in to [Render](https://render.com).
2.  Create a **New Web Service**.
3.  Connect your GitHub repo: `Pratheeksha26/CareerGuide-AI`.
4.  Set **Root Directory** = `backend`.
5.  **Build Command** = `npm install`.
6.  **Start Command** = `node server.js`.
7.  **Environment Variables**:
    - `MONGODB_URI` = Your Atlas connection string
    - `JWT_SECRET` = A strong secret string
    - `GROQ_API_KEY` = Your Groq key
    - `PORT` = `10000` (Render's default)
8.  Wait for deployment and copy your **Backend URL** (e.g., `https://career-guide-api.onrender.com`).

---

## Step 3: Deploy Frontend to Vercel
1.  Log in to [Vercel](https://vercel.com).
2.  Create a **New Project**.
3.  Connect your GitHub repo: `Pratheeksha26/CareerGuide-AI`.
4.  Set **Root Directory** = `frontend`.
5.  **Build Command** = `npm run build`.
6.  **Output Directory** = `build`.
7.  **Environment Variables**:
    - `REACT_APP_API_URL` = Paste your **Backend URL** from Step 2.
8.  Deploy! You'll get a professional URL like `career-guide-ai.vercel.app`.

---

## Step 4: Final Verification
- Log in to your application via the new Vercel URL.
- Test the **Mock Interview** (camera/mic) and **AI Chat**.
- Your data will now persist in the cloud!

> [!IMPORTANT]
> Since you have a `.gitignore` protecting your keys, you must **manually** add those keys to the Render/Vercel dashboards during setup. They will **not** be automatically read from your local `.env`.
