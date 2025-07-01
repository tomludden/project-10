require('dotenv').config()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../../api/models/users.js')

const getUsers = async (req, res, next) => {
  try {
    const users = await User.find().populate('attending')
    return res.status(200).json(users)
  } catch (error) {
    return res.status(400).json({ message: 'Failed to fetch users' })
  }
}

const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).populate('attending')
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }
    return res.status(200).json(user)
  } catch (error) {
    return res
      .status(400)
      .json({ message: 'Invalid user ID format or request' })
  }
}

const register = async (req, res) => {
  try {
    const { userName, email, password } = req.body
    const avatarPath = req.file?.path

    const existingUserByEmail = await User.findOne({ email })
    const existingUserByName = await User.findOne({ userName })
    if (existingUserByEmail || existingUserByName) {
      return res.status(400).json({ message: 'User already exists' })
    }

    /* const hashedPassword = await bcrypt.hash(password, 10) */

    const user = new User({
      userName,
      email,
      password: password,
      avatar: avatarPath
    })

    await user.save()

    const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, {
      expiresIn: '1y'
    })

    res.status(201).json({
      user: {
        _id: user._id,
        userName: user.userName,
        email: user.email,
        avatar: user.avatar,
        attending: user.attending
      },
      token
    })
  } catch (error) {
    res.status(500).json({ message: 'Registration failed' })
  }
}

const login = async (req, res) => {
  console.log('🛬 Login route hit with body:', req.body)
  console.log('🔑 Login function start, received:', req.body)

  const { userName, password } = req.body
  if (!userName || !password) {
    console.log('❌ Missing username or password')
    return res
      .status(400)
      .json({ message: 'Username and password are required' })
  }

  try {
    console.log('🛬 Login route hit with body:', req.body)
    const { userName, password } = req.body
    console.log('🧪 Received username:', userName)
    console.log('🧪 Received password:', password)

    const user = await User.findOne({ userName })
    if (!user) {
      console.log('❌ No user found for username:', userName)
      return res.status(400).json({ message: 'Username or password incorrect' })
    }

    console.log('🔐 User found. DB password hash:', user.password)
    console.log('🔑 Comparing input password:', password)

    const isMatch = await bcrypt.compare(password, user.password)
    console.log('🔍 bcrypt.compare result:', isMatch)

    if (!isMatch) {
      console.log('❌ Password does not match')
      return res.status(400).json({ message: 'Username or password incorrect' })
    }

    if (!process.env.SECRET_KEY) {
      console.log('❌ SECRET_KEY not set in environment variables')
      return res.status(500).json({ message: 'Server configuration error' })
    }

    const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, {
      expiresIn: '1y'
    })
    console.log('✅ JWT token generated')

    return res.status(200).json({
      token,
      user: {
        _id: user._id,
        userName: user.userName,
        email: user.email,
        avatar: user.avatar,
        attending: user.attending
      }
    })
  } catch (err) {
    console.error('🔥 Login error:', err)
    return res.status(500).json({ message: 'Server error during login' })
  }
}

const updateUser = async (req, res) => {
  try {
    const { userName, email, password, eventId, remove, attending } = req.body

    const user = await User.findById(req.params.id)
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    if (userName) user.userName = userName
    if (email) user.email = email
    if (password && password.trim().length > 0) {
      user.password = await bcrypt.hash(password, 10)
    }

    if (req.file) {
      user.avatar = req.file.path
    }

    if (eventId) {
      let newAttending = Array.isArray(user.attending)
        ? [...user.attending]
        : []

      if (remove === true || remove === 'true') {
        newAttending = newAttending.filter(
          (id) => id.toString() !== eventId.toString()
        )
      } else if (
        !newAttending.find((id) => id.toString() === eventId.toString())
      ) {
        newAttending.push(eventId)
      }

      user.attending = newAttending
    }

    if (attending) {
      try {
        user.attending = JSON.parse(attending)
      } catch {
        return res.status(400).json({ message: 'Invalid attending format' })
      }
    }

    await user.save()

    const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, {
      expiresIn: '1y'
    })

    return res.status(200).json({ user, token })
  } catch (err) {
    return res.status(500).json({ message: 'Server error', error: err.message })
  }
}

const deleteUser = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id)

    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' })
    }

    res.status(200).json({ message: 'User deleted successfully' })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

module.exports = {
  getUsers,
  getUserById,
  register,
  updateUser,
  deleteUser,
  login
}
