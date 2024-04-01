import mongoose from 'mongoose'
import users_seed from './records2.js'
// @ts-ignore
import UserModal from '../models/User.js'
import bcrypt from 'bcryptjs'

const mongoURI = 'mongodb+srv://maimmadiayoub:lina2015@cluster0.zmaftjc.mongodb.net/tweets'

mongoose
    .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.error(err))

const seed = async () => {
    try {
        const hashedPassword = await bcrypt.hash('12345', 12)

        for (const user of users_seed.users) {
            await UserModal.create({
                name: user.userName,
                email: `user${users_seed.users.indexOf(user)}@twitter.com`,
                password: hashedPassword
            })

            console.log(`imported ${user.userName} successfully!`)
        }
    } catch (error) {
        console.error(error)
    }
}

seed()
