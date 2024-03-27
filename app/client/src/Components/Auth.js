import React, { useEffect, useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { signin, signup } from '../actions/auth'

const Auth = () => {
    const dispatch = useDispatch()
    const history = useHistory()
    const [name, setusername] = useState('')
    const [email, setemail] = useState('')
    const [password, setpassword] = useState('')
    const [isSignup, setisSignup] = useState(false)
    const [isLoggedIn, setIsLoggedIn] = useState(false)

    useEffect(() => {
        const token = localStorage.getItem('profile')
        if (token) {
            setIsLoggedIn(true)
        }
    }, [])

    const signUpEvent = (e) => {
        e.preventDefault()
        const formData = { name, email, password }
        setusername('')
        setemail('')
        setpassword('')
        if (!isSignup) {
            dispatch(signup(formData, history))
        } else {
            dispatch(signin(formData, history))
        }
    }

    const tokenData = JSON.parse(localStorage.getItem('profile'))
    const username = tokenData?.result.name
    const useremail = tokenData?.result.email

    return (
        <>
            {isLoggedIn ? (
                <>
                    <section className='exam section'>
                        <div className='title'>
                            <h2 id='Add'>
                                Welcome {username}
                                <a className='scroll-link'></a>
                            </h2>
                            <h4>{useremail}</h4>
                            <br />
                            <br />
                        </div>

                        <div className='d-flex justify-content-center pt-4'>
                            <Link to='/'>
                                <button className='btn3'>Home</button>
                            </Link>
                        </div>

                        <div className='d-flex justify-content-center pt-4'>
                            <button
                                className='btn3'
                                onClick={() => {
                                    localStorage.removeItem('profile')
                                    setIsLoggedIn(false)
                                }}
                            >
                                Log out
                            </button>
                        </div>
                    </section>
                </>
            ) : (
                <>
                    <>
                        <section className='exam section'>
                            <br />
                            <br />
                            <br />
                            <div className='title'>
                                <h2 id='Add'>
                                    Sign up
                                    <a className='scroll-link'></a>
                                </h2>
                                <div className='underline'></div>
                                <br />
                                <br />
                            </div>
                        </section>
                        <div className='uperuper'>
                            <div className='container myowncontainer'>
                                <form autoComplete='off' onSubmit={signUpEvent}>
                                    <div className='row pt-5 mx-auto'>
                                        <div className='col-8 form-group mx-auto'>
                                            <input
                                                type='text'
                                                required
                                                className='form-control'
                                                placeholder='User Name'
                                                value={name}
                                                onChange={(e) => {
                                                    setusername(e.target.value)
                                                }}
                                            />
                                        </div>
                                        <div className='col-8 form-group pt-2 mx-auto'>
                                            <input
                                                type='email'
                                                className='form-control'
                                                placeholder='Email'
                                                value={email}
                                                onChange={(e) => {
                                                    setemail(e.target.value)
                                                }}
                                            />
                                        </div>
                                        <div className='col-8 form-group pt-2 mx-auto'>
                                            <input
                                                type='password'
                                                required
                                                className='form-control'
                                                placeholder='Password'
                                                value={password}
                                                onChange={(e) => {
                                                    setpassword(e.target.value)
                                                }}
                                            />
                                        </div>

                                        <div className='d-flex justify-content-center pt-4'>
                                            <input type='submit' className='btn3' value='Sign up'></input>
                                        </div>
                                    </div>
                                </form>
                                <div className='d-flex justify-content-center pt-4'>
                                    <Link to='/'>
                                        <button className='btn3'>Home</button>
                                    </Link>
                                </div>

                                <div>
                                    <br />
                                    <h6 className='text-center'>Already have an account? </h6>
                                    <Link to='/sign-in'>
                                        <button className='btn4'>Sign In</button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </>
                </>
            )}
        </>
    )
}

export default Auth
