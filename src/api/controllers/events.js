const Book = require('../models/events')

const getevents = async (req, res, next) => {
  try {
    const events = await Book.find()
    return res.status(200).json(events)
  } catch (error) {
    return res.status(400).json('error')
  }
}

const getBookById = async (req, res, next) => {
  try {
    const { id } = req.params
    const Book = await Book.findById(id)
    return res.status(200).json(Book)
  } catch (error) {
    return res.status(400).json('error')
  }
}

const postBook = async (req, res, next) => {
  try {
    const newBook = new Book(req.body)
    const Book = await newBook.save()
    return res.status(201).json(Book)
  } catch (error) {
    return res.status(400).json('error')
  }
}

const updateBook = async (req, res, next) => {
  try {
    const { id } = req.params
    const newBook = new Book(req.body)
    newBook._id = id
    const BookUpdated = await Book.findByIdAndUpdate(id, newBook, {
      new: true
    })
    return res.status(200).json(BookUpdated)
  } catch (error) {
    return res.status(400).json('error')
  }
}

const deleteBook = async (req, res, next) => {
  try {
    const { id } = req.params
    const Book = await Book.findByIdAndDelete(id)
    return res.status(200).json({
      mensaje: 'Ha sido eliminado con éxito',
      BookEliminado: Book
    })
  } catch (error) {
    return res.status(400).json('error')
  }
}

module.exports = {
  getevents,
  getBookById,
  postBook,
  updateBook,
  deleteBook
}
