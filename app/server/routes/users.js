import express from 'express'
const router = express.Router()

import { signin, signup } from '../controllers/user.js'

// more app routes
router.post('/signin', signin)
router.post('/signup', signup)

export default router
