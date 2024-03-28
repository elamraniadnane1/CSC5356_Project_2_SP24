import mongoose from 'mongoose'

const userSchema = mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    hashTags: { type: [String], required: false }
})

export default mongoose.model('User', userSchema)
