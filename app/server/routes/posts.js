import express from 'express'

import { getPosts, createPost, deletePost, getRecommendedTweets } from '../controllers/posts.js'

const router = express.Router()

router.get('/:id', getPosts)
router.get('/recommended/:id', getRecommendedTweets)
router.post('/', createPost)
router.delete('/:id', deletePost)

export default router
