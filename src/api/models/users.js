const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema(
  {
    userName: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    avatar: { type: String, required: false },
    attending: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Event'
        }
      ],
      default: []
    }
  },
  {
    timestamps: true,
    collection: 'users'
  }
)

userSchema.pre('save', function (next) {
  if (!this.isModified('password')) return next()
  this.password = bcrypt.hashSync(this.password, 10)
  next()
})

userSchema.pre('save', function (next) {
  if (Array.isArray(this.attending)) {
    this.attending = [...new Set(this.attending.map((id) => id.toString()))]
  }
  next()
})

const User = mongoose.model('users', userSchema, 'users')
module.exports = User
