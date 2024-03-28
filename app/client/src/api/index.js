import axios from 'axios'

// API for this application, hosted in the PaaS --> Heroku
const API = axios.create({ baseURL: 'http://localhost:5000' })

// Axios funcs for geting, posting, deteling, and updating posts.

export const fetchPosts = (id) => API.get(`/tweet/${id}`)
export const createPost = (newPost) => API.post('/tweet', newPost)
export const deletePost = (id) => API.delete(`/tweet/${id}`)
export const updatePost = (id, post) => API.patch(`/tweet/${id}`, post)

// Sign in and sign up options
export const signIn = (formData) => API.post('/user/signin', formData)
export const signUp = (formData) => API.post('/user/signup', formData)
