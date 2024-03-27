import mongoose from 'mongoose'
import PosteModel from '../models/poste.js'
import UserModel from '../models/user.js'
import tweetsSeed from './records.js'

const mongoURI = 'mongodb+srv://maimmadiayoub:lina2015@cluster0.zmaftjc.mongodb.net/tweets'

mongoose
    .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.error(err))

const seed = async () => {
    try {
        const users = await UserModel.find()

        for (let i = 0; i < users.length; i++) {
            const user = users[i]
            const tweet = tweetsSeed.tweets[i % tweetsSeed.tweets.length]

            await PosteModel.create({
                tweet: tweet.tweet || 'This is a crazy tweet',
                createdBy: user._id.toString(),
                hashTags: []
            })

            console.log(`Inserted "${tweet.tweet || 'This is a crazy tweet'}" successfully for user ${user.name}`)
        }
    } catch (error) {
        console.error(error)
    }
}

seed()
