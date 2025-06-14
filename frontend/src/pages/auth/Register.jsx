import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { useDispatch, useSelector } from 'react-redux'
import { register, reset } from '../../features/auth/authSlice'
import { useNavigate } from 'react-router-dom'
import Loading from '../../components/Loading'

const Register = () => {

    const [formData, setFormData] = useState({
        "first_name": "",
        "last_name": "",
        "email": "",
        "password": "",
        "re_password": "",
    })

    const { first_name, last_name, email, password, re_password } = formData

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const { user, isLoading, isError, isSuccess, message } = useSelector((state) => state.auth)

    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value
        })
        )
    }


    const handleSubmit = (e) => {
        e.preventDefault()


        if (password !== re_password) {
            toast.error("Passwords do not match")
        } else {
            const userData = {
                first_name,
                last_name,
                email,
                password,
                re_password
            }
            dispatch(register(userData))
        }
    }

    useEffect(() => {
        if (isError) {
            toast.error(message)
        }

        if (isSuccess || user) {
            navigate("/home")
            toast.success("An activation email has been sent to you. Please check your email!")
        }
        dispatch(reset())
    }, [user, isError, isSuccess, navigate, dispatch])

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-600 to-indigo-800 flex justify-center items-center p-4">
            <div className="w-full max-w-md bg-white rounded-xl shadow-2xl overflow-hidden">
                <div className="px-6 py-4">
                    <h1 className="text-2xl font-bold text-center text-gray-800 mb-4">Create your account</h1>

                    <form className="space-y-3">
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-0.5">First Name</label>
                            <input
                                type="text"
                                className="w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                placeholder="Enter your first name"
                                name="first_name"
                                onChange={handleChange}
                                value={first_name}
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-0.5">Last Name</label>
                            <input
                                type="text"
                                className="w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                placeholder="Enter your last name"
                                name="last_name"
                                onChange={handleChange}
                                value={last_name}
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-0.5">Email</label>
                            <input
                                type="email"
                                className="w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                placeholder="Enter your email"
                                name="email"
                                onChange={handleChange}
                                value={email}
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-0.5">Password</label>
                            <input
                                type="password"
                                className="w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                placeholder="Enter your password"
                                name="password"
                                onChange={handleChange}
                                value={password}
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-0.5">Confirm Password</label>
                            <input
                                type="password"
                                className="w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                placeholder="Retype your password"
                                name="re_password"
                                onChange={handleChange}
                                value={re_password}
                                required
                            />
                        </div>

                        <button
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-1.5 px-4 rounded-lg shadow transition-colors mt-2"
                            type="submit"
                            onClick={handleSubmit}
                        >
                            Sign Up
                        </button>
                    </form>

                    {isLoading && <Loading />}
                </div>
            </div>
        </div>
    )
}

export default Register
