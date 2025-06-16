require('dotenv').config()
const express = require('express')
const { connectDB } = require('./src/config/db')
const eventsRouter = require('./src/api/routes/events.js')
const usersRouter = require('./src/api/routes/users.js')
const cors = require('cors')
const app = express()

connectDB()

app.use(
  cors({
    origin: 'https://musical-fudge-fc073b.netlify.app/', // 👈 exact Netlify frontend URL
    credentials: true // if you're using cookies or Authorization headers
  })
)

app.use(express.json())

app.use('/api/v1/events', eventsRouter)
app.use('/api/v1/users', usersRouter)

app.listen(3000, () => {
  console.log('http://localhost:3000')
})
