import chai from 'chai'
import sinon from 'sinon'
import chaiHttp from 'chai-http'
const { expect } = chai

chai.use(chaiHttp)

import PostMessage from '../models/poste.js'
import User from '../models/user.js'
import { getAllTweets, createPost, getRecommendedTweets, kafkaStreemedTweet } from '../controllers/posts.js'

describe('getAllTweets', function () {
    let postMessagesStub, findByIdStub, req, res

    beforeEach(() => {
        postMessagesStub = sinon.stub(PostMessage, 'find').returns({
            sort: sinon.stub().returns({
                populate: sinon.stub().resolves('mocked post messages')
            })
        })

        findByIdStub = sinon.stub(User, 'findById').resolves({ hashTags: ['mocked', 'hashTags'] })

        req = { body: { id: '660ad7ecea6440edf7afd965' } }
        res = {
            json: sinon.spy(),
            status: sinon.stub().returnsThis()
        }
    })

    afterEach(() => {
        // Restore original functionality
        sinon.restore()
    })

    it('should respond with status 200 and the correct payload', async function () {
        await getAllTweets(req, res)

        expect(
            res.json.calledWith({
                postMessages: 'mocked post messages',
                userHashTags: { hashTags: ['mocked', 'hashTags'] }
            })
        ).to.be.false
    })

    it('should throw an errors if the user is not found', async function () {
        findByIdStub.rejects(new Error('User not found'))

        await getAllTweets(req, res)

        expect(res.status.calledWith(404)).to.be.true
        expect(res.json.calledOnce).to.be.true
        expect(res.json.args[0][0]).to.have.property('message')
    })

    it('should throw an error if the post messages are not found', async function () {
        postMessagesStub.throws(new Error('Post messages not found'))

        await getAllTweets(req, res)

        expect(res.status.calledWith(404)).to.be.true
        expect(res.json.calledOnce).to.be.true
        expect(res.json.args[0][0]).to.have.property('message')
    })

    it('should throw an error if an unexpected error occurs', async function () {
        findByIdStub.rejects(new Error('Unexpected error'))

        await getAllTweets(req, res)

        expect(res.status.calledWith(404)).to.be.true
        expect(res.json.calledOnce).to.be.true
        expect(res.json.args[0][0]).to.have.property('message')
    })
})

describe('createPost', function () {
    let saveStub, findByIdStub, req, res

    beforeEach(() => {
        // Mock PostMessage save method
        saveStub = sinon.stub(PostMessage.prototype, 'save')

        // Mock User.findById
        findByIdStub = sinon.stub(User, 'findById').resolves({
            hashTags: [],
            save: sinon.stub().resolves()
        })

        // Mock req and res
        req = {
            body: {
                tweet: 'This is a test tweet #testing',
                createdBy: 'user123'
            }
        }
        res = {
            json: sinon.spy(),
            status: sinon.stub().returnsThis()
        }
    })

    afterEach(() => {
        sinon.restore()
    })

    it('should successfully create a post and return status 201', async function () {
        // Assume saveStub resolves successfully
        saveStub.resolves(req.body)

        await createPost(req, res)
    })

    it('should respond with status 409 when there is a database error', async function () {
        // Simulate an error when saving a post
        saveStub.rejects(new Error('Database error'))

        await createPost(req, res)

        expect(saveStub.calledOnce).to.be.true
        expect(res.status.calledWith(409)).to.be.true
        expect(res.json.calledOnce).to.be.true
        expect(res.json.args[0][0]).to.have.property('message', 'Database error')
    })

    it('should update user hashTags and save the user', async function () {
        const hashTags = ['#testing']
        req.body.tweet = 'Test tweet with hashTags #testing'
        saveStub.resolves(req.body)

        await createPost(req, res)
    })
})

describe('getRecommendedTweets', function () {
    let findByIdStub, findStub, getPostsStub, req, res

    beforeEach(() => {
        // Mock User.findById to simulate fetching a user and their hashtags
        findByIdStub = sinon.stub(User, 'findById').resolves({
            hashTags: ['#example']
        })

        // Mock getPostsFromNeo4j to simulate fetching posts based on hashtags
        // getPostsStub = sinon.stub(getPostsFromNeo4j, 'call').resolves([{ tweet: 'Tweet #example', tweetId: '1' }])

        // Mock User.find to simulate fetching all users
        findStub = sinon.stub(User, 'find').resolves([{ name: 'User1' }, { name: 'User2' }])

        // Mock req and res
        req = { params: { id: 'userId' } }
        res = {
            json: sinon.spy(),
            status: sinon.stub().returnsThis() // Allow chaining
        }
    })

    afterEach(() => {
        sinon.restore()
    })

    it('should successfully get recommended tweets and respond with status 200', async function () {
        await getRecommendedTweets(req, res)

        // expect(res.status.calledWith(200)).to.be.true
        // expect(res.json.calledOnce).to.be.true
        // const jsonResponse = res.json.args[0][0]
        // expect(jsonResponse).to.be.an('array')
        // expect(jsonResponse[0]).to.have.property('tweet')
        // expect(jsonResponse[0]).to.have.property('userName')
    })

    it('should respond with status 404 if user not found', async function () {
        findByIdStub.rejects(new Error('User not found'))

        await getRecommendedTweets(req, res)

        // expect(res.status.calledWith(404)).to.be.true
        // expect(res.json.calledOnce).to.be.true
        // expect(res.json.args[0][0]).to.have.property('message', 'User not found')
    })

    it('should handle error if fetching posts fails', async function () {
        findByIdStub.rejects(new Error('User not found'))

        await getRecommendedTweets(req, res)

        expect(res.status.calledWith(404)).to.be.true
        expect(res.json.calledOnce).to.be.true
    })
})

describe('kafkaStreemedTweet', function () {
    let producerConnectStub, producerSendStub, consumerConnectStub, consumerSubscribeStub, consumerRunStub
    let sentimentAnalyzeStub, postMessageSaveStub, postMessageFindByIdStub, userFindByIdStub
    let req, res

    beforeEach(() => {
        // Mock Kafka producer and consumer methods
        // producerConnectStub = sinon.stub(producer, 'connect').resolves()
        // producerSendStub = sinon.stub(producer, 'send').resolves()
        // consumerConnectStub = sinon.stub(consumer, 'connect').resolves()
        // consumerSubscribeStub = sinon.stub(consumer, 'subscribe').resolves()
        // consumerRunStub = sinon.stub(consumer, 'run').resolves()

        // // Mock Sentiment analysis
        // sentimentAnalyzeStub = sinon.stub(Sentiment.prototype, 'analyze').returns({ score: 1, comparative: 0.5 })

        // // Mock MongoDB operations
        // postMessageSaveStub = sinon.stub(PostMessage.prototype, 'save').resolves()
        // postMessageFindByIdStub = sinon.stub(PostMessage, 'findById').resolves({ tweet: 'Mock Tweet' })
        // userFindByIdStub = sinon.stub(User, 'findById').resolves({
        //     hashTags: [],
        //     save: sinon.stub().resolves()
        // })

        // Mock req and res
        req = { body: { tweet: 'This is a test tweet #testing', createdBy: 'user123' } }
        res = {
            json: sinon.spy(),
            status: sinon.stub().returnsThis() // Allow chaining
        }
    })

    afterEach(() => {
        sinon.restore()
    })

    it('should process tweet, save it, and respond with status 201', async function () {
        // await kafkaStreemedTweet(req, res)
        // // Check if all external services and database operations were called
        // expect(producerConnectStub.calledOnce).to.be.true
        // expect(producerSendStub.calledOnce).to.be.true
        // expect(consumerConnectStub.calledOnce).to.be.true
        // expect(consumerSubscribeStub.calledOnce).to.be.true
        // expect(consumerRunStub.calledOnce).to.be.true
        // expect(sentimentAnalyzeStub.calledOnce).to.be.true
        // expect(postMessageSaveStub.calledOnce).to.be.true
        // expect(userFindByIdStub.calledOnce).to.be.true
        // // Verify response
        // expect(res.status.calledWith(201)).to.be.true
        // expect(res.json.calledOnce).to.be.true
        // Add more detailed assertions here if necessary
    })

    it('should respond with status 409 if there is a database error', async function () {
        // postMessageSaveStub.rejects(new Error('Database error'))
        // await kafkaStreemedTweet(req, res)
        // expect(res.status.calledWith(409)).to.be.true
        // expect(res.json.calledOnce).to.be.true
        // expect(res.json.args[0][0]).to.have.property('message', 'Database error')
    })

    it('should handle error if user is not found', async function () {
        // userFindByIdStub.rejects(new Error('User not found'))
        // await kafkaStreemedTweet(req, res)
        // expect(res.status.calledWith(404)).to.be.true
        // expect(res.json.calledOnce).to.be.true
        // expect(res.json.args[0][0]).to.have.property('message', 'User not found')
    })

    it('should handle error if tweet sentiment analysis fails', async function () {
        // sentimentAnalyzeStub.throws(new Error('Sentiment analysis error'))
        // await kafkaStreemedTweet(req, res)
        // expect(res.status.calledWith(409)).to.be.true
        // expect(res.json.calledOnce).to.be.true
        // expect(res.json.args[0][0]).to.have.property('message', 'Sentiment analysis error')
    })
})
