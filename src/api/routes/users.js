const isAuth = require('../../middlewares/auth')
const { uploadAvatar } = require('../../middlewares/file')

const {
  getUsers,
  getUserById,
  register,
  login,
  updateUser,
  deleteUser
} = require('../controllers/users')

const usersRouter = require('express').Router()

usersRouter.get('/', isAuth, getUsers)
usersRouter.get('/:id', isAuth, getUserById)
usersRouter.put('/:id', isAuth, uploadAvatar.single('avatar'), updateUser)
usersRouter.post('/register', uploadAvatar.single('avatar'), register)
usersRouter.post('/login', login)

usersRouter.delete('/:id', isAuth, deleteUser)

usersRouter.post(
  '/login',
  (req, res, next) => {
    console.log('🚀 Login route hit with body:', req.body)
    next()
  },
  login
)

module.exports = usersRouter
