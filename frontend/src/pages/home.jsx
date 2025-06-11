import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import Header from '../components/header'
import {useSelector } from 'react-redux'

const Home = () => {

    const { userInfo, user } = useSelector((state) => state.auth)


  return (
    <>
      <Header />
      <div></div>
      <h1 className='text-3xl text-blue-500 font-bold'>DevCraft</h1>
        {user ? (
          <>
            <h1>Creat your first Project:</h1>
            <NavLink to="/projects">Projects</NavLink>
          </>
        ) : (
          []
        )}

    </>
  )
}

export default Home