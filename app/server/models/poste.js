import mongoose from 'mongoose'

const postSchema = mongoose.Schema({
    tweet: { type: String, required: true, default: '' },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    hashTags: { type: [String], default: [] }
})

var PostMessage = mongoose.model('Poste', postSchema)

export default PostMessage
