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
    timestamps: true
    /* collection: 'users' */
  }
)

userSchema.pre('save', async function (next) {
  try {
    // Deduplicate 'attending' array
    if (Array.isArray(this.attending)) {
      this.attending = [...new Set(this.attending.map((id) => id.toString()))]
    }

    next()
  } catch (err) {
    next(err)
  }
})

userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password)
}

const User = mongoose.model('User', userSchema)
module.exports = User
