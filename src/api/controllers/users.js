require('dotenv').config()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../../api/models/users.js')

// Get all users
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
    console.error('GET USER BY ID ERROR:', error)
    return res
      .status(400)
      .json({ message: 'Invalid user ID format or request' })
  }
}

const register = async (req, res) => {
  try {
    const { userName, email, password } = req.body
    const avatarPath = req.file?.path

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = new User({
      userName,
      email,
      password: hashedPassword,
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
    console.error('Registration error:', error)
    res.status(500).json({ message: 'Registration failed' })
  }
}

// Login user
const login = async (req, res) => {
  const { userName, password } = req.body
  console.log('Login attempt with username:', userName)

  if (!userName || !password) {
    return res
      .status(400)
      .json({ message: 'Username and password are required' })
  }

  try {
    const user = await User.findOne({ userName })
    if (!user) {
      return res.status(400).json({ message: 'Username or password incorrect' })
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(400).json({ message: 'Username or password incorrect' })
    }

    if (!process.env.SECRET_KEY) {
      console.error('SECRET_KEY not defined')
      return res.status(500).json({ message: 'JWT configuration error' })
    }

    const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, {
      expiresIn: '1y'
    })

    res.status(200).json({
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
    console.error('Login error:', err)
    res.status(500).json({ message: 'Server error during login' })
  }
}

// Update user
const updateUser = async (req, res) => {
  try {
    let updateData = {}
    const { userName, email, password, eventId, remove, attending } = req.body

    if (userName) updateData.userName = userName
    if (email) updateData.email = email
    if (password && password.trim().length > 0) {
      const hashedPassword = await bcrypt.hash(password, 10)
      updateData.password = hashedPassword
    }

    if (eventId) {
      const existingUser = await User.findById(req.params.id)
      if (!existingUser) {
        return res.status(404).json({ message: 'User not found' })
      }
      let newAttending = Array.isArray(existingUser.attending)
        ? [...existingUser.attending]
        : []

      if (remove === true || remove === 'true') {
        newAttending = newAttending.filter(
          (id) => id.toString() !== eventId.toString()
        )
      } else {
        if (!newAttending.find((id) => id.toString() === eventId.toString())) {
          newAttending.push(eventId)
        }
      }
      updateData.attending = newAttending
    }

    if (attending) {
      try {
        updateData.attending = JSON.parse(attending)
      } catch (err) {
        return res.status(400).json({ message: 'Invalid attending format' })
      }
    }

    if (req.file) {
      updateData.avatar = req.file.path
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true }
    )

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' })
    }

    const token = jwt.sign({ id: updatedUser._id }, process.env.SECRET_KEY, {
      expiresIn: '1y'
    })

    console.log('Updated user in DB:', updatedUser)
    return res.status(200).json({ user: updatedUser, token })
  } catch (err) {
    console.error('Error updating user:', err)
    return res
      .status(500)
      .json({ message: 'Server error', message: err.message })
  }
}

const deleteUser = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id)

    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' })
    }

    console.log('User deleted from DB:', deletedUser)
    res.status(200).json({ message: 'User deleted successfully' })
  } catch (error) {
    console.error('Error deleting user:', error)
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

// Exports
module.exports = {
  getUsers,
  getUserById,
  register,
  updateUser,
  deleteUser,
  login
}
