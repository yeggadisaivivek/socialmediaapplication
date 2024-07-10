import React from 'react'
import { useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import Head from '../Head'
import Logo from '../Logo'
import Logout from './Logout'



function Navbar() {
    const authStatus = useSelector((state) => state.auth.status)
    const navigate = useNavigate()

    const navItems = [
        {
            name: "Home",
            slug: "/",
            active: true
        },
        {
            name: "Login",
            slug: "/login",
            active: !authStatus
        },
        {
            name: "Signup",
            slug: "/signup",
            active: !authStatus
        },
        {
            name: "All Posts",
            slug: "/all-posts",
            active: authStatus
        },
        {
            name: "Add Post",
            slug: "/add-post",
            active: authStatus
        }
    ]

  return (
    <header className='py-3 shadow bg-gray-500'>
        <Head>
            <nav className='flex'>
                <div className='mr-4'>
                    <Link to="/">
                        <Logo />
                    </Link>
                </div>
                <ul className='flex ml-auto'>
                    {
                        navItems.map((item) => item.active ? (
                            <li key={item.name}>
                                <button
                                onClick={() => navigate(item.slug)}
                                className='inline-bock px-6 py-2 duration-200 hover:bg-blue-100 rounded-full'
                                >
                                    {item.name}
                                </button>
                            </li>
                        ) : null)
                    }
                    {authStatus && (
                        <li>
                            <Logout />
                        </li>
                    )}
                </ul>
            </nav>
        </Head>
    </header>
  )
}

export default Navbar