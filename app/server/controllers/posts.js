import mongoose from 'mongoose'
import PostMessage from '../models/poste.js'
import User from '../models/user.js'
import getPostesFromNeo4j from './neo4j.js'
import { Kafka } from 'kafkajs'
import Sentiment from 'sentiment'

const kafka = new Kafka({
    clientId: 'my-app',
    brokers: ['localhost:9092']
})

const producer = kafka.producer()

export const kafkaStreem = async (req, res) => {
    const { tweet, createdBy } = req.body

    var sentiment = new Sentiment()

    const result = sentiment.analyze(tweet)

    // await producer.send({
    //     topic: 'tweet-sentiment-analysis',
    //     messages: [{ value: JSON.stringify({ tweet, score, positive, negative }) }]
    // })

    try {
        return res.status(201).json({ tweet, result })
    } catch (error) {
        return res.status(409).json({ message: error.message })
    }
}

export const getRecommendedTweets = async (req, res) => {
    try {
        const { id } = req.params

        const userHashTags = await User.findById(id).select('hashTags')
        const hashTags = userHashTags.hashTags

        const forYouPosts = await getPostesFromNeo4j(hashTags)

        res.status(200).json(forYouPosts)
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
}

export const createPost = async (req, res) => {
    const post = req.body

    const { tweet, createdBy } = req.body
    const hashTags = tweet.split(' ').filter((word) => word.startsWith('#'))

    const newPost = new PostMessage({ ...post, hashTags })
    const user = await User.findById(createdBy)
    user.hashTags = [...new Set([...user.hashTags, ...hashTags])]
    await user.save()

    try {
        await newPost.save()
        return res.status(201).json({ newPost })
    } catch (error) {
        return res.status(409).json({ message: error.message })
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

export const getPosts = async (req, res) => {
    try {
        const { id } = req.params

        const postMessages = await PostMessage.find().sort({ _id: -1 }).populate('createdBy')
        const userHashTags = await User.findById(id).select('hashTags')

        res.status(200).json({ postMessages, userHashTags })
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
}
