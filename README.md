# VIIIbits Onboarding Platform

## 🚀 Deploy to Vercel

### Prerequisites
- [Vercel account](https://vercel.com)
- [MongoDB Atlas](https://cloud.mongodb.com) free cluster (for the database)

### Steps

1. **Create MongoDB Atlas cluster** and get your connection string:
   ```
   mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/viiibits-onboarding
   ```

2. **Push this folder to a GitHub repo**

3. **Import the repo on Vercel** → it will auto-detect the `vercel.json`

4. **Set Environment Variables** in Vercel Project Settings → Environment Variables:
   ```
   JWT_SECRET=your-strong-secret-here
   MONGO_URI=mongodb+srv://...your Atlas URI...
   ```

5. **Deploy** — Vercel will build the frontend and deploy the backend as serverless functions.

### Default Admin Login
```
Email:    admin@viiibits.com
Password: Admin@123
```

---

## 💻 Local Development

### 1. Start Backend
```bash
cd server
npm install
# Create a .env file (copy from .env.example and fill in values)
npm run dev
# Runs on http://localhost:5000
```

### 2. Start Frontend
```bash
cd client
npm install
npm run dev
# Runs on http://localhost:5173
```
