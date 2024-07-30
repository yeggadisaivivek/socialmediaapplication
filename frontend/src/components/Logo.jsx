import React from 'react'
import logo from '../metadata/pictures/logo.webp'

function Logo({width}) {
  return (
    <img src={logo} alt='logo' style={{width}}/>
  )
}

export default Logo