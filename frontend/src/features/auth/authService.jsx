import axios, { HttpStatusCode } from "axios"

const BACKEND_DOMAIN = "http://localhost:8000"

const REGISTER_URL = `${BACKEND_DOMAIN}/api/v1/auth/users/`
const LOGIN_URL = `${BACKEND_DOMAIN}/api/v1/auth/jwt/create/`
const ACTIVATE_URL = `${BACKEND_DOMAIN}/api/v1/auth/users/activation/`
const RESET_PASSWORD_URL = `${BACKEND_DOMAIN}/api/v1/auth/users/reset_password/`
const RESET_PASSWORD_CONFIRM_URL = `${BACKEND_DOMAIN}/api/v1/auth/users/reset_password_confirm/`
const GET_USER_INFO = `${BACKEND_DOMAIN}/api/v1/auth/users/me/`

const register = async (userData) => {
    const config = {
        headers: {
            "Content-Type": "application/json"
        }
    }

    const response = await axios.post(REGISTER_URL, userData, config)
    return response.data
}


const login = async (userData) => {
    const config = {
        headers: {
            "Content-Type": "application/json"
        }
    }

    const response = await axios.post(LOGIN_URL, userData, config)
    if (response.data) {
        localStorage.setItem("user", JSON.stringify(response.data))
    }

    return response.data
}


const logout = () => {
    localStorage.removeItem("user")
}


const activate = async (userData) => {
    const config = {
        headers: {
            "Content-Type": "application/json"
        }
    }

    const response = await axios.post(ACTIVATE_URL, userData, config)


    return response.data
}


const resetpass = async (userData) => {
    const config = {
        headers: {
            "Content-Type": "application/json"
        }
    }

    const response = await axios.post(RESET_PASSWORD_URL, userData, config)

    return response.data
}


const resetpassconf = async (userData) => {
    const config = {
        headers: {
            "Content-Type": "application/json"
        }
    }

    const response = await axios.post(RESET_PASSWORD_CONFIRM_URL, userData, config)

    return response.data, HttpStatusCode
}


const getUserInfo = async (accessToken) => {
    const config = {
        headers: {
            "Authorization": `Bearer ${accessToken}`
        }
    }

    const response = await axios.get(GET_USER_INFO, config)

    return response.data
}

const authService = { register, login, logout, activate, resetpass, resetpassconf, getUserInfo}
export default authService