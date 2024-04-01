import PostMessage from '../models/poste.js'
import User from '../models/user.js'
import { getPostsFromNeo4j, postTweetToNeo4j } from './neo4j.js'
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

    const tweetSentimentResult = sentiment.analyze(tweet)
    const tweetSentiment = { score: tweetSentimentResult.score, comparative: tweetSentimentResult.comparative }

    const newPost = new PostMessage({ ...post, tweetSentiment })
    await newPost.save()
    const postedTweet = await PostMessage.findById(newPost._id).select('tweet')

    const hashTags = tweet.split(' ').filter((word) => word.startsWith('#'))
    const user = await User.findById(createdBy)
    user.hashTags = [...new Set([...user.hashTags, ...hashTags])]
    await user.save()

    await producer.send({
        topic: 'tweet-sentiment-analysis',
        messages: [{ value: JSON.stringify({ tweet, createdBy, tweetSentiment }) }]
    })

    await consumer.connect()

    await consumer.subscribe({ topic: 'tweet-sentiment-analysis', fromBeginning: true })

    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            console.log('\nKafka Streamed Tweet:\n', {
                topic,
                partition,
                value: message.value.toString()
            })

            const kafkaStreamedTweet = JSON.parse(message.value.toString())
            await postTweetToNeo4j(kafkaStreamedTweet?.tweet, kafkaStreamedTweet?.createdBy, tweetSentimentResult.score, tweetSentimentResult.comparative)
        }
    })

    try {
        return res.status(201).json({ user, postedTweet, tweetSentimentResult })
    } catch (error) {
        return res.status(409).json({ message: error.message })
    }
}

export const getRecommendedTweets = async (req, res) => {
    try {
        const { id } = req.params

        const userHashTags = await User.findById(id).select('hashTags')
        const hashTags = userHashTags.hashTags

        const forYouPosts = await getPostsFromNeo4j(hashTags)
        const allUsers = await User.find()

        forYouPosts.map((post) => {
            post.userName = allUsers[Math.floor(Math.random() * allUsers.length)].name
        })

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
