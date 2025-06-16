const Event = require('../models/events')

const getEvents = async (req, res) => {
  try {
    const events = await Event.find().populate('attending', 'userName avatar')
    return res.status(200).json(events)
  } catch (err) {
    console.error('Error in getEvents:', err)
    return res.status(500).json({ message: 'Server error loading events' })
  }
}

const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate(
      'attending',
      'userName avatar'
    )
    if (!event) {
      return res.status(404).json({ message: 'Event not found' })
    }
    return res.status(200).json(event)
  } catch (err) {
    console.error('Error in getEventById:', err)
    return res.status(500).json({ message: err.message })
  }
}

const postEvent = async (req, res) => {
  try {
    const { eventName, date, location } = req.body
    if (!eventName || !date || !location) {
      return res
        .status(400)
        .json({ message: 'Event name, date, and location are required.' })
    }

    const newEvent = new Event({
      eventName,
      date,
      location,
      createdBy: req.user._id,
      eventPosterImg: req.file?.path || null
    })

    const saved = await newEvent.save()
    return res.status(201).json(saved)
  } catch (err) {
    console.error('Error creating event:', err)
    return res.status(400).json({
      message: 'Error creating event',
      message: err.message
    })
  }
}

const updateEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
    if (!event) {
      return res.status(404).json({ message: 'Event not found' })
    }

    if (req.body.eventName) event.eventName = req.body.eventName
    if (req.body.date) event.date = req.body.date
    if (req.body.location) event.location = req.body.location

    if (req.file) {
      event.eventPosterImg = req.file.path
    }

    await event.save()
    return res.status(200).json(event)
  } catch (err) {
    console.error('Update failed:', err)
    return res.status(400).json({ message: err.message })
  }
}

const deleteEvent = async (req, res) => {
  try {
    const userId = req.user._id
    const eventId = req.params.id

    const event = await Event.findById(eventId)
    if (!event) {
      return res.status(404).json({ message: 'Event not found' })
    }

    if (!event.createdBy.equals(userId)) {
      return res
        .status(403)
        .json({ message: 'You are not allowed to delete this event' })
    }

    await Event.findByIdAndDelete(eventId)
    return res.status(200).json({ message: 'Event deleted successfully' })
  } catch (err) {
    console.error('Error deleting event:', err)
    return res
      .status(500)
      .json({ message: 'Server error while deleting event' })
  }
}

const attendEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
    if (!event) {
      return res.status(404).json({ message: 'Event not found' })
    }

    const userId = req.user._id
    if (!event.attending.some((id) => id.equals(userId))) {
      event.attending.push(userId)
      await event.save()
    }

    return res.status(200).json({ message: 'Marked as attending', event })
  } catch (err) {
    console.error('Error attending event:', err)
    return res.status(400).json({ message: err.message })
  }
}

const unattendEvent = async (req, res) => {
  try {
    const userId = req.user._id
    const eventId = req.params.id

    const event = await Event.findById(eventId)
    if (!event) {
      return res.status(404).json({ message: 'Event not found' })
    }

    const isUserAttending = event.attending.some((attendeeId) =>
      attendeeId.equals(userId)
    )
    if (!isUserAttending) {
      return res
        .status(400)
        .json({ message: 'You are not attending this event' })
    }

    event.attending = event.attending.filter(
      (attendeeId) => !attendeeId.equals(userId)
    )
    await event.save()

    return res.status(200).json({
      message: 'You have been removed from the event attendance list'
    })
  } catch (err) {
    console.error('Error removing attendance:', err)
    return res
      .status(500)
      .json({ message: 'Server error while removing attendance' })
  }
}

module.exports = {
  getEvents,
  getEventById,
  postEvent,
  updateEvent,
  deleteEvent,
  attendEvent,
  unattendEvent
}
