import express from 'express'

import { getPosts, createPost, deletePost } from '../controllers/posts.js'

const router = express.Router()

router.get('/:id', getPosts)
router.post('/', createPost)
router.delete('/:id', deletePost)

export default router
