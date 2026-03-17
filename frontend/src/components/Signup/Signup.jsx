import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Signup() {
    const [ username, setUsername ] = useState('')
    const [ email, setEmail ] = useState('')
    const [ password, setPassword ] = useState('')
    const [ confirmPassword, setConfirmPassword ] = useState('')
    const [ error, setError ] = useState(null)

    const navigate = useNavigate()

    async function handleSubmit(e) {
        e.preventDefault()

        if (password != confirmPassword) {
            return alert("Senhas não coincidem");
        }

        const response = await fetch('http://127.0.0.1:5000/signup', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({username: username, email: email, password: password})
        });

        const data = await response.json()
        console.log(data)

        if (response.ok) {
            navigate("/login")
        } else {
            setError(data.message)
        }

    }

    return (
        <>
            <h1>Tela de Cadastro</h1>
            <form onSubmit={handleSubmit}>
                <label htmlFor="">Username:</label>
                <input 
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <label htmlFor="">Email:</label>
                <input 
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <label htmlFor="">Password:</label>
                <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)} 
                />
                <label htmlFor="">Confirm Password:</label>
                <input 
                    type="password" 
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)} 
                />

                {error && <p style={{color: 'red'}}>{error}</p>}
                <button type="submit">Cadastrar</button>
            </form>
        </>
    )
}

export default Signup