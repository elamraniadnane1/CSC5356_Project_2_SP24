import { combineReducers } from 'redux'

import posts from './posts'
import auth from './auth'
import tweets from './recomendedTweets'

export default combineReducers({ posts, auth, tweets })
