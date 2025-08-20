import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import path from 'path'
import connectDB from './config/db'
import authRoutes from './routes/authRoutes'
import invoiceRoutes from './routes/invoiceRoutes'
import fs from 'fs';

dotenv.config({ path: path.resolve(__dirname, '..', '.env') })

const app = express()

// Connect to MongoDB
connectDB()

// Middleware
app.use(cors({
    origin: 'https://levitation-frontend-3qz8.vercel.app',
}))
app.use(express.json())

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/invoices', invoiceRoutes)

const PORT = process.env.PORT || 5000

const cacheDir = path.join(process.cwd(), '.cache', 'puppeteer');
if (!fs.existsSync(cacheDir)) {
  fs.mkdirSync(cacheDir, { recursive: true });
}
process.env.PUPPETEER_CACHE_DIR = cacheDir;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))


