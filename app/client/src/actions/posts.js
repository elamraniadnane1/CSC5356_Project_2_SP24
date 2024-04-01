import * as api from '../api'

export const getPosts = (id) => async (dispatch) => {
    try {
        const { data } = await api.fetchPosts(id)
        dispatch({ type: 'FETCH_ALL', payload: data })
    } catch (error) {
        console.error(error)
    }
}

export const createPost = (post) => async (dispatch) => {
    try {
        const { data } = await api.createPost(post)
        dispatch({ type: 'CREATE', payload: data })
    } catch (error) {
        console.error(error)
    }
}

export const kafkaStreemedTweet = (post) => async (dispatch) => {
    try {
        const { data } = await api.kafkaStreemedTweet(post)
        dispatch({ type: 'KAFKA', payload: data })
    } catch (error) {
        console.error(error)
    }
}

export const getRecommendedTweets = (id) => async (dispatch) => {
    try {
        const { data } = await api.getRecommendedTweets(id)
        dispatch({ type: 'SENTIMENT', payload: data })
    } catch (error) {
        console.error(error)
    }
}
