import express from 'express'

import { getPosts, createPost, deletePost, getRecommendedTweets, kafkaStreemedTweet } from '../controllers/posts.js'

const router = express.Router()

router.post('/', createPost)
router.post('/sentiment', kafkaStreemedTweet)
router.get('/:id', getPosts)
router.get('/recommended/:id', getRecommendedTweets)
router.delete('/:id', deletePost)

export default router
