// app.js
require('dotenv').config()
const express = require('express')
const { connectDB } = require('./src/config/db.js')
const eventsRouter = require('./src/api/routes/events.js')
const usersRouter = require('./src/api/routes/users.js')
const cors = require('cors')

const app = express()

connectDB()

app.use(cors())
app.use(express.json())

app.use('/api/v1/events', eventsRouter)
app.use('/api/v1/users', usersRouter)

module.exports = app
