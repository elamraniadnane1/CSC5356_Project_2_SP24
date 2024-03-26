import mongoose from 'mongoose'

const postSchema = mongoose.Schema({
    id: Number,
    tweet: String
})

var PostMessage = mongoose.model('Poste', postSchema)

export default PostMessage
