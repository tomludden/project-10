const mongoose = require('mongoose')

const eventSchema = new mongoose.Schema(
  {
    eventName: { type: String, required: true },
    eventPosterImg: { type: String },
    date: { type: String, required: true },
    location: { type: String, required: true },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users',
      required: true
    },
    attending: [{ type: mongoose.Schema.Types.ObjectId, ref: 'users' }]
  },
  {
    timestamps: true,
    collection: 'events'
  }
)

const Event = mongoose.model('Event', eventSchema, 'events')
module.exports = Event
