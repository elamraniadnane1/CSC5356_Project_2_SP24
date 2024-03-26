import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

import UserModal from '../models/user.js'

const secret = 'test'

// sign in server func that gets user info, compare it with stored data, then return answer
export const signin = async (req, res) => {
    const { name, password } = req.body

    try {
        const oldUser = await UserModal.findOne({ name })

        if (!oldUser) return res.status(404).json({ message: "User doesn't exist" })

        const isPasswordCorrect = await bcrypt.compare(password, oldUser.password)

        if (!isPasswordCorrect) return res.status(400).json({ message: 'Invalid credentials' })

        const token = jwt.sign({ name: oldUser.name, id: oldUser._id }, secret, {
            expiresIn: '1h'
        })

        res.status(200).json({ result: oldUser, token })
    } catch (err) {
        res.status(500).json({ message: 'Something went wrong' })
    }
}

// sign up server func that gets user info, incript it, then save it in the local storage
export const signup = async (req, res) => {
    const { name, email, password } = req.body

    try {
        const oldUser = await UserModal.findOne({ email })

        if (oldUser) return res.status(400).json({ message: 'User already exists' })

        const hashedPassword = await bcrypt.hash(password, 12)

        const result = await UserModal.create({
            name,
            email,
            password: hashedPassword
        })

        const token = jwt.sign({ name: result.name, email: result.email, id: result._id }, secret, {
            expiresIn: '1h'
        })

        res.status(201).json({ result, token })
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong' })

        console.error(error)
    }
}
