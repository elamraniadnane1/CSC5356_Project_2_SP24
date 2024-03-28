import React, { useEffect, useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { createPost, getPosts } from '../actions/posts'

const HomePage = () => {
    const dispatch = useDispatch()
    const history = useHistory()
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [tweet, setTweet] = useState('')
    const [activeTab, setActiveTab] = useState('default')
    const tokenData = JSON.parse(localStorage.getItem('profile'))

    const fetchData = async (id) => {
        try {
            await dispatch(getPosts(id))
        } catch (error) {
            console.error('Error fetching posts:', error)
        }
    }

    useEffect(() => {
        const token = localStorage.getItem('profile')
        if (token) {
            setIsLoggedIn(true)
        }
    }, [])

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
        fetchData(tokenData?.result._id)
    }, [dispatch])

    const posts = useSelector((state) => state.posts)

    const filteredPosts = posts?.postMessages?.filter((post) => posts?.userHashTags?.hashTags?.some((hashTag) => post.tweet.includes(hashTag)))

    return (
        <main>
            <section id='home' className='exam section'>
                <div className='title'>
                    <h2 id='Home' className='typewriter'>
                        <span className='typewriter2'>Twitter</span>
                        <a className='scroll-link'></a>
                    </h2>
                    <h4>
                        <span>{isLoggedIn ? 'Welcome to the Twitter page' : 'Please sign in so you can tweet and see others tweets'}</span>
                    </h4>
                </div>

                {isLoggedIn && (
                    <>
                        <div className='uperuper'>
                            <div className='container myowncontainer'>
                                <form onSubmit={posteTweet}>
                                    <div className='row pt-5 mx-auto'>
                                        <div className='col-8 form-group mx-auto'>
                                            <input type='text' required className='form-control' placeholder='Tweet something...' value={tweet} onChange={(e) => setTweet(e.target.value)} />
                                        </div>
                                        <div className='d-flex justify-content-center pt-4'>
                                            <input type='submit' className='btn3' value='Tweet'></input>
                                        </div>
                                    </div>
                                </form>
                            </div>
                            <div>
                                <div className='flex-container'>
                                    <button className='btn5' onClick={() => setActiveTab('default')}>
                                        All Tweets
                                    </button>
                                    <button className='btn5' onClick={() => setActiveTab('filtered')}>
                                        For You Tweets
                                    </button>
                                </div>
                                <p>Total of: {activeTab === 'default' ? `${posts?.postMessages?.length}` : `${filteredPosts?.length}`} tweets</p>
                                {(activeTab === 'default' ? posts?.postMessages : filteredPosts)?.map((post) => (
                                    <div key={post?._id}>
                                        <h5>{post?.createdBy.name}</h5>
                                        <p>{post?.tweet}</p>
                                    </div>
                                ))}
                                {activeTab === 'default' ? posts?.postMessages?.length === 0 && <p>No tweets</p> : filteredPosts.length === 0 && <p>No tweets</p>}
                            </div>
                        </div>
                    </>
                )}
            </section>
        </main>
    )
}

export default HomePage
