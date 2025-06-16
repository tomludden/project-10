const isAuth = require('../../middlewares/auth')
const { uploadPoster } = require('../../middlewares/file')

const {
  getEvents,
  getEventById,
  postEvent,
  updateEvent,
  deleteEvent,
  attendEvent,
  unattendEvent
} = require('../controllers/events')

const eventsRouter = require('express').Router()

eventsRouter.get('/', getEvents)
eventsRouter.get('/:id', getEventById)
eventsRouter.post('/', isAuth, uploadPoster.single('poster'), postEvent)
eventsRouter.put('/:id', isAuth, uploadPoster.single('poster'), updateEvent)
eventsRouter.delete('/:id', isAuth, deleteEvent)
eventsRouter.post('/:id/attend', isAuth, attendEvent)
eventsRouter.delete('/:id/attend', isAuth, unattendEvent)

module.exports = eventsRouter
