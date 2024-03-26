import React from 'react'
import ReactDOM from 'react-dom'

import './css/index.css'
import './css/core.css'

import App from './App'

import thunk from 'redux-thunk'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware, compose } from 'redux'
import { BrowserRouter as Router } from 'react-router-dom'

import reducers from './reducers'
const store = createStore(reducers, compose(applyMiddleware(thunk)))

ReactDOM.render(
    <React.StrictMode>
        <Provider store={store}>
            <Router>
                <App />
            </Router>
        </Provider>
    </React.StrictMode>,
    document.getElementById('root')
)
