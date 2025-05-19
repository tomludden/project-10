const jwt = require('jsonwebtoken')
require('dotenv').config()

const generarLlave = (id) => {
  return jwt.sign({ id }, process.env.SECRET_KEY, { expiresIn: '1y' })
}

const verificarLlave = (token) => {
  return jwt.verify(token, process.env.SECRET_KEY)
}

module.exports = { generarLlave, verificarLlave }
