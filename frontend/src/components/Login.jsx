import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login(){
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const navigate = useNavigate();

    async function testForm(e) {
        e.preventDefault();

        const response = await fetch("http://127.0.0.1:5000/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email: email, password: password })
        });

        const data = await response.json();
        console.log(data)

        if (response.ok) {
            localStorage.setItem("token", data.access_token);
            navigate("/home");
        } else {
            alert("Erro: "+ data.message);
        }
    }

    return (
        <>
            <h1>Tela de Login</h1>
            <form onSubmit={testForm}>
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

                <button type="submit">Entrar</button>
            </form>
        </>
    )
}

export default Login