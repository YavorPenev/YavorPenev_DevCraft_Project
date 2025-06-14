import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useSelector, useDispatch } from "react-redux"
import { resetPasswordConfirm } from '../../features/auth/authSlice'
import Loading from '../../components/Loading'

const ResetPasswordConfirm = () => {

    const { uid, token } = useParams()
    const [formData, setFormData] = useState({
        'new_password': '',
        're_new_password': ''
    })

    const { new_password, re_new_password } = formData

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const { isLoading, isError, isSuccess, message } = useSelector((state) => state.auth)


    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value
        })
        )
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        const userData = {
            uid,
            token,
            new_password,
            re_new_password
        }

        dispatch(resetPasswordConfirm(userData))
    }

    useEffect(() => {
        if (isError) {
            toast.error(message)
        }
        if (isSuccess) {
            navigate("/home")
            toast.success("Your password was reset successfully.")

        }
    }, [isError, isSuccess, message, navigate, dispatch])

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-600 to-indigo-800 flex justify-center items-center p-4">
            <div className="w-full max-w-md bg-white rounded-xl shadow-2xl overflow-hidden">
                <div className="px-8 py-6">
                    <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">Reset Password</h1>

                    {isLoading && <Loading />}

                    <form className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                            <input
                                type="password"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                placeholder="Enter new password"
                                name="new_password"
                                onChange={handleChange}
                                value={new_password}
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                            <input
                                type="password"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                placeholder="Confirm new password"
                                name="re_new_password"
                                onChange={handleChange}
                                value={re_new_password}
                                required
                            />
                        </div>

                        <button
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg shadow transition-colors"
                            type="submit"
                            onClick={handleSubmit}
                        >
                            Reset Password
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default ResetPasswordConfirm