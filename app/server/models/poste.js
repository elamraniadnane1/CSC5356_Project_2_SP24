import mongoose from 'mongoose'

const postSchema = mongoose.Schema({
    tweet: { type: String, required: true, default: '' },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    hashTags: { type: [String], default: [] },
    tweetSentiment: {
        score: { type: Number, default: 0 },
        comparative: { type: Number, default: 0 }
    }
})

var PostMessage = mongoose.model('Poste', postSchema)

export default PostMessage
