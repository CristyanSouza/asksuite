const express = require('express')
const router = express.Router()
const browserService = require('../services/BrowserService.js')

router.post('/search', browserService.search)

module.exports = router
