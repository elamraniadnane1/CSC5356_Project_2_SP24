import PostMessage from '../models/poste.js'
import User from '../models/user.js'
import getPostesFromNeo4j, { postTweetToNeo4j } from './neo4j.js'
import { Kafka } from 'kafkajs'

import Sentiment from 'sentiment'

const kafka = new Kafka({
    clientId: 'my-app',
    brokers: ['localhost:9092']
})

const producer = kafka.producer()
const consumer = kafka.consumer({ groupId: 'test-group' })

export const kafkaStreemedTweet = async (req, res) => {
    await producer.connect()

    const post = req.body
    const { tweet, createdBy } = req.body

    var sentiment = new Sentiment()

    const result = sentiment.analyze(tweet)
    const tweetSentiment = { score: result.score, comparative: result.comparative }

    await producer.send({
        topic: 'tweet-sentiment-analysis',
        messages: [{ value: JSON.stringify({ tweet, createdBy, tweetSentiment }) }]
    })

    await consumer.connect()

    await consumer.subscribe({ topic: 'tweet-sentiment-analysis', fromBeginning: true })

    const hashTags = tweet.split(' ').filter((word) => word.startsWith('#'))
    const newPost = new PostMessage({ ...post, tweetSentiment })
    await newPost.save()
    const postedTweet = await PostMessage.findById(newPost._id).select('tweet createdBy tweetSentiment')
    const user = await User.findById(createdBy)
    user.hashTags = [...new Set([...user.hashTags, ...hashTags])]
    await user.save()

    let kafkaStreamedTweet = null
    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            console.log('\nKafka Streamed Tweet:\n', {
                value: message.value.toString()
            })
            kafkaStreamedTweet = JSON.parse(message.value.toString())
        }
    })

    const neo4jUpdatedGraph = await postTweetToNeo4j(tweet, createdBy, result.score, result.comparative)

    try {
        return res.status(201).json({ kafkaStreamedTweet, user, sentimentResult: result, postedTweet, neo4jUpdatedGraph })
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

    const newPost = new PostMessage(post)
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

export const getAllTweets = async (req, res) => {
    try {
        const { id } = req.params

        const postMessages = await PostMessage.find().sort({ _id: -1 }).populate('createdBy')
        const userHashTags = await User.findById(id).select('hashTags')

        res.status(200).json({ postMessages, userHashTags })
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
}
