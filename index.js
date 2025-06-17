require('dotenv').config()
const express = require('express')
const cors = require('cors')
const { connectDB } = require('./src/config/db.js')
const eventsRouter = require('./src/api/routes/events.js')
const usersRouter = require('./src/api/routes/users.js')

const app = express()

connectDB()

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || '*'
  })
)

app.use(express.json())

app.get('/', (req, res) => {
  res.send('API is running')
})

app.use('/api/v1/events', eventsRouter)
app.use('/api/v1/users', usersRouter)

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' })
})

app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ message: 'Server error' })
})

const PORT = process.env.PORT || 10000
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
