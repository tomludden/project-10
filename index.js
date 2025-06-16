// api/index.js
const serverlessExpress = require('@vendia/serverless-express')
const app = require('../app') // relative path to app.js

module.exports = serverlessExpress({ app })
