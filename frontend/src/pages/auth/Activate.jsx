
const Activate = () => {



    const handleSubmit = (e) => {
        e.preventDefault()
    }

    return (
        <div>
            <div>
                <h1 >Activate your Account </h1>


                <button type="submit" onClick={handleSubmit}>Activate Account</button>
            </div>
        </div>
    )
}
export default Activate;
