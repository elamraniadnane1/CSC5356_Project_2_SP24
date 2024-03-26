import express from 'express'
import bodyParser from 'body-parser'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'

import postRoutes from './routes/posts.js'
import userRoutes from './routes/users.js'

// App setup
const app = express()
dotenv.config()

app.use(bodyParser.json({ limit: '30mb', extended: true }))
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }))
app.use(cors())

app.use('/tweets', postRoutes)
app.use('/user', userRoutes)

app.get('/', (req, res) => {
    res.send('Welcome to the twitter API')
})

// MongoDB link with express back-end
const CONNECTION_URL = process.env.CONNECTION_URL

const PORT = process.env.PORT || 5000

mongoose
    .connect(CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => app.listen(PORT, () => console.log(`Server Running onChange: http://localhost:${PORT}`)))
    .catch((error) => console.log('error msg', error.message))

mongoose.set('strictQuery', true)
