import axios from "axios"

const BACKEND_DOMAIN = "http://localhost:8000"
const REGISTER_URL = `${BACKEND_DOMAIN}/api/v1/auth/users/`
const LOGIN_URL = `${BACKEND_DOMAIN}/api/v1/auth/jwt/create/`
const ACTIVATE_URL = `${BACKEND_DOMAIN}/api/v1/auth/users/activation/`
const RESET_PASSWORD_URL = `${BACKEND_DOMAIN}/api/v1/auth/users/reset_password/`
const RESET_PASSWORD_CONFIRM_URL = `${BACKEND_DOMAIN}/api/v1/auth/users/reset_password_confirm/`

const register = async (userData) => {
    const config = {
        headers:{
            "Content-Type": "application/json"
        }
    }

    const response = await axios.post(REGISTER_URL, userData, config)
    return response.data
}

const authService = { register }
export default authService