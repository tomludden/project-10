require('dotenv').config()
const express = require('express')
const { connectDB } = require('./src/config/db')
const eventsRouter = require('./src/api/routes/events')
const usersRouter = require('./src/api/routes/users')
const cors = require('cors')
const cloudinary = require('cloudinary').v2

const app = express()

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
})

connectDB()

app.use(cors())

app.use(express.json())

app.use('/api/v1/events', eventsRouter)
app.use('/api/v1/users', usersRouter)

app.listen(3000, () => {
  console.log('SUCCESSFULLY CONNECTED TO SERVER AT http://localhost:3000')
})
