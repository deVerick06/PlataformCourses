import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Signup() {
    const [ username, setUsername ] = useState('')
    const [ email, setEmail ] = useState('')
    const [ password, setPassword ] = useState('')
    const [ role, setRole ] = useState('')

    const navigate = useNavigate()

    async function handleSubmit(e) {
        e.preventDefault()

        const response = await fetch('http://127.0.0.1:5000/signup', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({username: username, email: email, password: password, role: role})
        });

        const data = await response.json()
        console.log(data)

        if (response.ok) {
            navigate("/login")
        } else {
            alert("Erro: "+ data.message)
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
                <label htmlFor="">Role:</label>
                <input 
                    type="text"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                />

                <button type="submit">Cadastrar</button>
            </form>
        </>
    )
}

export default Signup