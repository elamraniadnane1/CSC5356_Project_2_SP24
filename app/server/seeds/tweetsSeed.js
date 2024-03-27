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
        // find all users in the db
        const users = await UserModel.find()

        // iterate over each user
        for (let i = 0; i < users.length; i++) {
            const user = users[i]
            const tweet = tweetsSeed.tweets[i % tweetsSeed.tweets.length] // to loop through tweets if users > tweets

            // create a new post using PosteModel and assign the current user as createdBy
            await PosteModel.create({
                tweet: tweet.tweet,
                createdBy: user._id // assuming _id is the identifier of the user
            })

            console.log(`Inserted "${tweet.tweet}" successfully for user ${user.name}`)
        }
    } catch (error) {
        console.error(error)
    }
}

seed()
