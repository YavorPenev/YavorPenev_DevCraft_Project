import React, { useEffect } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { logout, reset } from '../features/auth/authSlice'
import { VscAccount } from "react-icons/vsc";

const Header = () => {

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const { userInfo, user } = useSelector((state) => state.auth)

    const handleLogout = () => {
        dispatch(logout())
        dispatch(reset())
        navigate("/home")
    }

    const [showDropdown, setShowDropdown] = React.useState(false);
    
    const toggleDropdown = () => {
        setShowDropdown(!showDropdown);
    };
    
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (showDropdown && !event.target.closest('.profile-container')) {
                setShowDropdown(false);
            }
        };
        
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [showDropdown]);

    return (
        <nav className="w-full bg-gray-900 shadow">
            <ul className="flex flex-row items-center justify-between px-2 py-2 md:px-4">
                <NavLink className="text-3xl gap-2 text-cyan-500 font-bold items-center flex flex-row" to="/home">
                    <img src="../../../public/logo1.svg" alt="Logo" className="h-10 w-11" />
                    <h1 className=''>DevCraft</h1>
                </NavLink>
                {user ? (
                    <div className="flex items-center space-x-6">
                        <NavLink className="text-base text-cyan-400 font-bold" to="/ideas">Ideas</NavLink>
                        <NavLink className="text-base text-cyan-400 font-bold" to="/useful-sources">Useful Sources </NavLink>
                        <NavLink className="text-base text-cyan-400 font-bold" to="/code-fragments">Code Fragments </NavLink>

                        <NavLink to="/home" onClick={handleLogout} className="text-base text-cyan-400 font-bold">Logout</NavLink>

                        <div className="relative profile-container">
                            <button 
                                className="flex items-center space-x-2 focus:outline-none text-cyan-400 font-bold"
                                onClick={toggleDropdown}
                            >
                                <VscAccount className='h-8 w-8' />
                            </button>
                            {showDropdown && (
                                <div className="absolute right-0 mt-2 w-64 bg-gray-900 border border-cyan-400 rounded-lg shadow-lg p-4 z-50">
                                    <h1 className="font-bold text-cyan-400 mb-1 text-center text-lg">
                                        {userInfo.first_name} {userInfo.last_name}
                                    </h1>
                                    <h2 className='text-center text-sm text-cyan-300'>
                                        {userInfo.is_staff && <span>Administrator</span>}
                                    </h2>
                                    <p className="text-gray-300 text-sm text-center">{userInfo.email}</p>
                                    <p className="text-gray-400 text-xs text-center mt-2">
                                        From: {userInfo.date_joined && new Date(userInfo.date_joined).toLocaleDateString()}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center space-x-6">
                        <NavLink className="text-base text-cyan-400 font-bold" to="/login">Log In</NavLink>
                        <NavLink className="text-base text-cyan-400 font-bold" to="/signup">Sign Up</NavLink>
                    </div>
                )}
            </ul>
        </nav>
    )
}

export default Header