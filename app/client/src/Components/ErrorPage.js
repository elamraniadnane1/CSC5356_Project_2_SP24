import React from 'react'
import { Link } from 'react-router-dom'
import '../css/errorpage.css'

const ErrorPage = () => {
    return (
        <div className='mainbox'>
            <div className='err'>4</div>
            <div className='far1'>0</div>
            <div className='err3'>4</div>
            <div className='msg'>
                Maybe this page moved? Got deleted? Is hiding out somewhere? Never existed in the first place?
                <br />
                <br />
                <p>
                    Let's go <Link to='/'>home</Link> and try from there.
                </p>
            </div>
        </div>
    )
}

export default ErrorPage
