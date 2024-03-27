import mongoose from 'mongoose'
import PosteModel from '../models/poste.js'
import UserModel from '../models/user.js'
import tweetsSeed from './records.js'
import bcrypt from 'bcryptjs'

const mongoURI = 'mongodb+srv://maimmadiayoub:lina2015@cluster0.zmaftjc.mongodb.net/tweets'

mongoose
    .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.error(err))

const seed = async () => {
    try {
        const hashedPassword = await bcrypt.hash('lina2015', 12)

        for (const user of users_seed.users) {
            await UserModel.create({
                name: user.userName,
                email: `user${users_seed.users.indexOf(user)}@twitter.com`,
                password: hashedPassword
            })

            console.log(`Imported ${user.userName} successfully!`)
        }

        // Now, let's create posts for users
        const users = await UserModel.find()

        for (let i = 0; i < users.length; i++) {
            const user = users[i]
            const tweet = tweetsSeed.tweets[i % tweetsSeed.tweets.length]

            // Ensure the tweet field is provided when creating a post
            await PosteModel.create({
                tweet: tweet.tweet,
                createdBy: user._id,
                hashTags: tweet.hashTags
            })

            console.log(`Inserted "${tweet.tweet}" successfully for user ${user.name}`)
        }
    } catch (error) {
        console.error(error)
    }
}

seed()
