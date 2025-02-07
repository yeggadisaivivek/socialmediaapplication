import React from 'react'
import { useDispatch } from 'react-redux'
import { logout } from '../../redux/authSlice';

function Logout() {
    const dispatch = useDispatch();
    const logoutHandler = () => {
        authService.logout().then(() => {
            dispatch(logout());
        })
    }
    return (
        <button className='inline-block px-6 py-2 duration-200 hover:bg-blue-200 rounded-full' onClick={logoutHandler}>
            Logout
        </button>
    )
}

export default Logout