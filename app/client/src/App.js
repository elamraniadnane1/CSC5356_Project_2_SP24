import React, { useEffect, useState } from 'react'

import ErrorPage from './Components/ErrorPage'
import HomePage from './Components/HomePage'
import Auth from './Components/Auth'
import SignIN from './Components/SignIN'

import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { Link } from 'react-router-dom'

const SignIn = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false)

    useEffect(() => {
        const token = localStorage.getItem('profile')
        if (token) {
            setIsLoggedIn(true)
        }
    }, [])

    const tokenData = JSON.parse(localStorage.getItem('profile'))
    const username = tokenData?.result.name

    return (
        <div className='format'>
            <Link to='/auth'>{isLoggedIn ? <button className='btn9'>{username}</button> : <button className='btn3'>Sign In</button>}</Link>
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
