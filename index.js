require('dotenv').config()
const express = require('express')
const cors = require('cors')
const { connectDB } = require('./src/config/db.js')
const eventsRouter = require('./src/api/routes/events.js')
const usersRouter = require('./src/api/routes/users.js')

const app = express()

// Connect to DB
connectDB()

// CORS setup
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || '*'
  })
)

// Middleware
app.use(express.json())

// Health check route
app.get('/', (req, res) => {
  res.send('API is running')
})

// API routes
app.use('/api/v1/events', eventsRouter)
app.use('/api/v1/users', usersRouter)

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' })
})

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ message: 'Server error' })
})

// Start server
const PORT = process.env.PORT || 10000
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
