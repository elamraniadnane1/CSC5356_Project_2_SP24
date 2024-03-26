import React from 'react'

import ErrorPage from './Components/ErrorPage'
import HomePage from './Components/HomePage'
import Auth from './Components/Auth'
import SignIN from './Components/SignIN'

import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { Link } from 'react-router-dom'

const SignIn = () => {
    return (
        <div className='format'>
            <Link to='/auth'>
                <button className='btn3'>Account</button>
            </Link>
        </div>
    )
}

const App = () => {
    return (
        <>
            <Router>
                <Switch>
                    <Route exact path='/'>
                        <SignIn />
                        <HomePage />
                    </Route>
                    <Route exact path='/auth'>
                        <SignIn />
                        <Auth />
                    </Route>
                    <Route exact path='/sign-in'>
                        <SignIn />
                        <SignIN />
                    </Route>

                    <Route exact path='*'>
                        <ErrorPage />
                    </Route>
                </Switch>
            </Router>
        </>
    )
}

export default App
