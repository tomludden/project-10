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
    const { userName, email, password, avatar, attending } = req.body

    // Check if user already exists by username or email
    const existingUser = await User.findOne({
      $or: [{ userName }, { email }]
    })
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' })
    }

    // Hash password explicitly here
    const saltRounds = 10
    const hashedPassword = await bcrypt.hash(password, saltRounds)

    // Create new user with hashed password
    const user = new User({
      userName,
      email,
      password: hashedPassword,
      avatar,
      attending
    })

    await user.save()

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, {
      expiresIn: '1y'
    })

    res.status(201).json({
      user: {
        _id: user._id,
        userName: user.userName,
        email: user.email,
        avatar: user.avatar,
        attending: user.attending || []
      },
      token
    })
  } catch (error) {
    console.error('Registration error:', error)
    res.status(500).json({ message: 'Registration failed' })
  }
}

const login = async (req, res) => {
  try {
    const { userName, password } = req.body

    // Find user by userName
    const user = await User.findOne({ userName })
    if (!user) {
      return res.status(400).json({ message: 'Username or password incorrect' })
    }

    // Use comparePassword method defined on userSchema
    const isMatch = await user.comparePassword(password)
    if (!isMatch) {
      return res.status(400).json({ message: 'Username or password incorrect' })
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, {
      expiresIn: '1y'
    })

    res.status(200).json({
      user: {
        _id: user._id,
        userName: user.userName,
        email: user.email,
        avatar: user.avatar,
        attending: user.attending || []
      },
      token
    })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({ message: 'Login failed' })
  }
}

module.exports = { register, login }

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
