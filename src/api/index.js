require('dotenv').config()
const express = require('express')
const { connectDB } = require('../config/db.js')
const eventsRouter = require('./routes/events.js')
const usersRouter = require('./routes/users.js')
const cors = require('cors')
const app = express()

connectDB()

app.use(cors())

app.use(express.json())

/* app.use('/api/v1/events', eventsRouter)
app.use('/api/v1/users', usersRouter) */

module.exports = app
