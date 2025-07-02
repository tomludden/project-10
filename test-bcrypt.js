const bcrypt = require('bcrypt')

const plain = 's123'
const hash = '$2b$10$...' // Copy the exact hash from your DB

bcrypt.compare(plain, hash).then((result) => {
  console.log('Match?', result)
})
