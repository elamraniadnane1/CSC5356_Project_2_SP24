import axios from 'axios'

const API = axios.create({ baseURL: 'http://localhost:5000' })

export const fetchPosts = (id) => API.get(`/tweet/${id}`)
export const createPost = (newPost) => API.post('/tweet', newPost)
export const kafkaStreemedTweet = (newPost) => API.post(`/tweet/sentiment`, newPost)
export const getRecommendedTweets = (id) => API.get(`/tweet/recommended/${id}`)

export const signIn = (formData) => API.post('/user/signin', formData)
export const signUp = (formData) => API.post('/user/signup', formData)
