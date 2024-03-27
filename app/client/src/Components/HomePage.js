import React, { useEffect, useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { createPost, getPosts } from '../actions/posts'

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
        setTimeout(() => {
            window.location.reload()
        }, 100)
    }
    useEffect(() => {
        const fetchData = async () => {
            try {
                await dispatch(getPosts())
            } catch (error) {
                console.error('Error fetching posts:', error)
            }
        }

        fetchData()
    }, [dispatch])

    const posts = useSelector((state) => state.posts)

    return (
        <main>
            <section id='home' className='exam section'>
                <div className='title'>
                    <h2 id='Home' className='typewriter'>
                        <span className='typewriter2'>Twitter page</span>
                        <a className='scroll-link'></a>
                    </h2>
                    <h4>
                        <span>Please sign in so you can tweet and see tweets</span>
                    </h4>
                </div>

                {isLoggedIn && (
                    <>
                        <div className='uperuper'>
                            <div className='container myowncontainer'>
                                <form onSubmit={posteTweet}>
                                    <div className='row pt-5 mx-auto'>
                                        <div className='col-8 form-group mx-auto'>
                                            <input
                                                type='text'
                                                required
                                                className='form-control'
                                                placeholder='Tweet something...'
                                                value={tweet}
                                                onChange={(e) => {
                                                    setTweet(e.target.value)
                                                }}
                                            />
                                        </div>
                                        <div className='d-flex justify-content-center pt-4'>
                                            <input type='submit' className='btn3' value='Tweet'></input>
                                        </div>
                                    </div>
                                </form>
                            </div>
                            <div>
                                {posts.map((post) => (
                                    <div key={post._id}>
                                        <h5>{post.createdBy.name}</h5>
                                        <p>{post.tweet}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </>
                )}
            </section>
        </main>
    )
}

export default HomePage
