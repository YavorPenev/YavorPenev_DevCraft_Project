import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from 'react-toastify'
import { useDispatch, useSelector } from 'react-redux'
import Loading from "../../components/Loading"
import { resetPassword } from "../../features/auth/authSlice"

const ResetPassword = () => {

    const [formData, setFormData] = useState({
        "email": "",
    })

    const { email } = formData

    const dispatch = useDispatch()
    const navigate = useNavigate()

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
            email
        }
        dispatch(resetPassword(userData))
    }

    useEffect(() => {
        if (isError) {
            toast.error(message)
        }
        if (isSuccess) {
            navigate("/home")
            toast.success("A reset password email has been sent to you.")

        }


    }, [isError, isSuccess, message, navigate, dispatch])


    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-600 to-indigo-800 flex justify-center items-center p-4">
            <div className="w-full max-w-md bg-white rounded-xl shadow-2xl overflow-hidden">
                <div className="px-8 py-6">
                    <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">Reset Password</h1>

                    <form className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                            <input
                                type="email"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                placeholder="Enter your email"
                                name="email"
                                onChange={handleChange}
                                value={email}
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

                    {isLoading && <Loading />}
                </div>
            </div>
        </div>
    )
}

export default ResetPassword