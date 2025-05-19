const mongoose = require('mongoose')

const eventschema = new mongoose.Schema(
  {
    title: { type: String, unique: true, required: true },
    eventPosterImg: { type: String, required: false },
    date: { type: Date, required: true },
    location: { type: String, required: true },
    description: { type: String, required: true },
    assistants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'users' }]
  },
  {
    timestamps: true,
    collection: 'events'
  }
)

const Book = mongoose.model('events', eventschema, 'events')
module.exports = Book
