import React, { useState, useEffect } from 'react'

const LoginNav = ({ header, socket }) => {
    const [notification, setNotification] = useState("")

    useEffect(() => {
        socket.on("addProductResponse", data => {
            setNotification(`@${data.owner} just added ${data.name} worth $${Number(data.price).toLocaleString()}`)
        })
    }, [socket])

    useEffect(() => {
        socket.on("bidProductResponse", data => {
            setNotification(`@${data.last_bidder} just bid ${data.name} for $${Number(data.amount).toLocaleString()}`)
            console.log("hello world")
        })
    }, [socket])

    return (
        <div>
            <div className='notification'>
                <p className='alert'>{notification}</p>
            </div>

            <nav className='navbar'>
                <div className='nav'>
                    <div className='logonname'>
                        <img src='https://img.lovepik.com/free-png/20210928/lovepik-agricultural-logo-png-image_401740052_wh1200.png' className='logo' alt='logo' />
                        <h4>Kohdy's Auction App</h4>
                    </div>


                </div>
            </nav >

        </div>

    )
}

export default LoginNav
