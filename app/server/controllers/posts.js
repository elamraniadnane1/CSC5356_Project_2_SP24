import mongoose from 'mongoose'
import PostMessage from '../models/poste.js'

// get all posts that match PostMessage schema
export const getPosts = async (req, res) => {
    try {
        const postMessages = await PostMessage.find()

        res.status(200).json(postMessages)
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
}

// we create a specific post give a body from the front-end
export const createPost = async (req, res) => {
    const post = req.body
    const newPost = new PostMessage(post)
    try {
        await newPost.save()
        req.status(201).json(newPost)
    } catch (error) {
        res.status(409).json({ message: error.message })
    }
}

// delete a specific post givn as ID from the params
export const deletePost = async (req, res) => {
    const { id } = req.params
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No post with id: ${id}`)

    await PostMessage.findByIdAndRemove(id)
    res.json({ message: 'Post deleted successfully.' })
}

// update with id, not implimented yet in the front-end
export const updatePost = async (req, res) => {
    const { id } = req.params
    const post = req.body

    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No post with id: ${id}`)

    const updatedPost = await PostMessage.findByIdAndUpdate(id, { ...post, id }, { new: true })

    res.json(updatedPost)
}
