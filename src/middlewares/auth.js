const jwt = require('jsonwebtoken')
const User = require('../api/models/users.js') // Adjust path as needed

const isAuth = async (req, res, next) => {
  try {
    console.log('Headers:', req.headers)

    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res
        .status(401)
        .json({ message: 'No token provided or malformed header' })
    }

    const token = authHeader.split(' ')[1]
    console.log('Token:', token)

    if (!process.env.SECRET_KEY) {
      console.error('SECRET_KEY not defined')
      return res.status(500).json({ message: 'Server configuration error' })
    }

    const payload = jwt.verify(token, process.env.SECRET_KEY)
    console.log('Decoded Payload:', payload)

    const userId = payload.id
    if (!userId) {
      return res.status(401).json({ message: 'Invalid token payload' })
    }

    const user = await User.findById(userId)
    if (!user) {
      return res.status(401).json({ message: 'User not found' })
    }

    console.log('User:', user)

    req.user = user
    next()
  } catch (error) {
    console.error('Auth error:', error.message)
    return res
      .status(401)
      .json({ message: 'Unauthorized', error: error.message })
  }
}

module.exports = isAuth
