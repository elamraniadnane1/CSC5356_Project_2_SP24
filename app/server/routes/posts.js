import express from 'express'

import { getAllTweets, createPost, getRecommendedTweets, kafkaStreemedTweet } from '../controllers/posts.js'

const router = express.Router()

router.get('/:id', getAllTweets)
router.get('/recommended/:id', getRecommendedTweets)
router.post('/sentiment', kafkaStreemedTweet)
router.post('/', createPost)

export default router
