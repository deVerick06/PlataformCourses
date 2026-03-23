import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Login.module.css";

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
            localStorage.setItem("role", data.role);
            localStorage.setItem("plan_type", data.plan_type);
            navigate("/home");
        } else {
            alert("Erro: "+ data.message);
        }
    }

    return (
        <div className={styles.pageContainer}>
            <div className={styles.loginCard}>
                <h1 className={styles.title}>Tela de Login</h1>
                <form onSubmit={testForm} className={styles.form}>
                    <label className={styles.label} htmlFor="email">Email:</label>
                    <input 
                        id="email"
                        type="email"
                        value={email}
                        className={styles.input}
                        placeholder="seu@email.com"
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <label className={styles.label} htmlFor="password">Password:</label>
                    <input 
                        id="password"
                        className={styles.input}
                        type="password" 
                        value={password}
                        placeholder="********"
                        onChange={(e) => setPassword(e.target.value)} 
                    />

                    <button className={styles.button} type="submit">Entrar</button>
                </form>
            </div>
        </div>
    )
}

export default Login