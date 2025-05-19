const { isAuth } = require('../../middlewares/auth')

const {
  getevents,
  getBookById,
  postBook,
  updateBook,
  deleteBook
} = require('../controllers/events')

const eventsRouter = require('express').Router()

eventsRouter.get('/', getevents)
eventsRouter.get('/:id', getBookById)
eventsRouter.post('/', isAuth, postBook)
eventsRouter.put('/:id', isAuth, updateBook)
eventsRouter.delete('/:id', isAuth, deleteBook)

module.exports = eventsRouter
