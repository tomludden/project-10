const multer = require('multer')
const cloudinary = require('cloudinary').v2
const { CloudinaryStorage } = require('multer-storage-cloudinary')

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
})

const avatarStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'avatars',
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp', 'gif']
  }
})

const uploadAvatar = multer({ storage: avatarStorage })

const posterStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'eventPosters',
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp', 'gif']
  }
})

const uploadPoster = multer({ storage: posterStorage })

module.exports = {
  uploadAvatar,
  uploadPoster
}
