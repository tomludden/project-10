const mongoose = require('mongoose')
require('dotenv').config()

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB_URL)
    console.log('SUCCESSFULLY CONNECTED TO DB')
  } catch (error) {
    console.log('error')
  }
}

module.exports = { connectDB }
