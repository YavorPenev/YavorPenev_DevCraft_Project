import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { activate, reset } from '../../features/auth/authSlice'
import { toast } from 'react-toastify'
import Loading from '../../components/Loading'

const Activate = () => {

    const { uid, token } = useParams()
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const { isLoading, isError, isSuccess, message } = useSelector((state) => state.auth)

    const handleSubmit = (e) => {
        e.preventDefault()

        const userData = {
            uid,
            token
        }
        dispatch(activate(userData))
        toast.success("Your account has been activated! You can login now")
    }

    useEffect(() => {
        if (isError) {
            toast.error(message)
        }

        if (isSuccess) {
            navigate("/login")
        }

        dispatch(reset())

    }, [isError, isSuccess, navigate, dispatch])


    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-600 to-indigo-800 flex justify-center items-center p-4">
            <div className="w-full max-w-md bg-white rounded-xl shadow-2xl overflow-hidden">
                <div className="px-8 py-6">
                    <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">Activate your Account</h1>

                    {isLoading && <Loading />}

                    <button
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg shadow transition-colors"
                        type="submit"
                        onClick={handleSubmit}
                    >
                        Activate Account
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Activate