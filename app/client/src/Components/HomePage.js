import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min'
import { createPost } from '../api'

const HomePage = () => {
    const dispatch = useDispatch()
    const history = useHistory()
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [tweet, setTweet] = useState('')

    useEffect(() => {
        const token = localStorage.getItem('profile')
        if (token) {
            setIsLoggedIn(true)
        }
    }, [])

    const tokenData = JSON.parse(localStorage.getItem('profile'))

    const posteTweet = (e) => {
        e.preventDefault()
        const formData = { tweet, createdBy: tokenData?.result._id }
        setTweet('')

        dispatch(createPost(formData, history))
    }

    return (
        <main>
            <section id='home' className='exam section'>
                <br />
                <div className='title'>
                    <h2 id='Home' className='typewriter'>
                        <span className='typewriter2'>Twitter page</span>

                        <a className='scroll-link'></a>
                    </h2>
                </div>
            </section>
        </main>
    )
}

export default HomePage
