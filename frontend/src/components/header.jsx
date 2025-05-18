import React, {useEffect} from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { logout, reset } from '../features/auth/authSlice'

const Header = () => {

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const { userInfo, user } = useSelector((state) => state.auth)

    const handleLogout = () => {
        dispatch(logout())
        dispatch(reset())
        navigate("/home")
    }

    return (
        <nav className="w-full bg-white shadow">
            <ul className="flex 
                           flex-row 
                           items-center 
                           justify-between
                           px-4 
                           py-2 
                           md:px-8">
                <NavLink className="text-lg font-bold" to="/home">Logo</NavLink>
                {user ? (
                    <div className="flex items-center space-x-6">

                        <NavLink to="/home" onClick={handleLogout} className="text-base">Logout</NavLink>

                        <div className="relative group">

                            <button className="flex items-center space-x-2 focus:outline-none">
                                Profile
                            </button>

                            <div className="absolute 
                                            right-0 mt-2 w-56
                                          bg-white border
                                          border-gray-200 
                                            rounded-lg
                                            shadow-lg p-4 z-50    
                                            opacity-0
                                            group-hover:opacity-100 
                                            pointer-events-none
                                            group-hover:pointer-events-auto
                                            transition-opacity duration-200">
                                 
                                <h1 className="font-semibold
                                             text-gray-800 
                                               mb-1 text-center">
                                    {userInfo.first_name} {userInfo.last_name}
                                </h1>
                                <h2 className='text-center'> {userInfo.is_staff && <p>Administrator</p>}</h2>
                                <p className="text-gray-500 text-sm">{userInfo.email}</p>
                                <p> From: {userInfo.date_joined && new Date(userInfo.date_joined).toLocaleDateString()}</p>

                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex 
                                    items-center 
                                    space-x-6">
                        <NavLink className="text-base" to="/login">Log In</NavLink>
                        <NavLink className="text-base" to="/signup">Sign Up</NavLink>
                    </div>
                )}
            </ul>
        </nav>
    )
}

export default Header