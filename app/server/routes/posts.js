import express from 'express'

import { getPosts, createPost, deletePost, getRecommendedTweets, kafkaStreem } from '../controllers/posts.js'

const router = express.Router()

router.post('/', createPost)
router.post('/sentiment', kafkaStreem)
router.get('/:id', getPosts)
router.get('/recommended/:id', getRecommendedTweets)
router.delete('/:id', deletePost)

export default router
