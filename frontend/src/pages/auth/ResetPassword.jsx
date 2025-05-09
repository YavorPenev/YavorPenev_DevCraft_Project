import { useEffect, useState } from "react"


const ResetPassword = () => {

    const [formData, setFormData] = useState({
        "email": "",
    })

    const { email } = formData



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
    }



    return (
        <>
                <form>
                    <input type="text"
                        placeholder="email"
                        name="email"
                        onChange={handleChange}
                        value={email}
                        required
                    />

                    <button type="submit" onClick={handleSubmit}>Reset Password</button>
                </form>
        </>
    )
}

export default ResetPassword