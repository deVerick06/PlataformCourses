import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import styles from "./Signup.module.css"

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
        <div className={styles.pageContainer}>
            <div className={styles.signupCard}>
                <h1 className={styles.title}>Tela de Cadastro</h1>
                <form className={styles.form} onSubmit={handleSubmit}>
                    <label className={styles.label} htmlFor="username">Username:</label>
                    <input 
                        id="username"
                        className={styles.input}
                        type="text"
                        value={username}
                        placeholder="Como quer ser chamado?"
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <label className={styles.label} htmlFor="email">Email:</label>
                    <input 
                        id="email"
                        type="email"
                        className={styles.input}
                        value={email}
                        placeholder="seu@email.com"
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <label className={styles.label} htmlFor="password">Password:</label>
                    <input 
                        id="password"
                        type="password" 
                        className={styles.input}
                        value={password}
                        placeholder="********"
                        onChange={(e) => setPassword(e.target.value)} 
                    />
                    <label className={styles.label} htmlFor="confirmPassword">Confirm Password:</label>
                    <input 
                        id="confirmPassword"
                        className={styles.input}
                        type="password"
                        value={confirmPassword}
                        placeholder="********"
                        onChange={(e) => setConfirmPassword(e.target.value)} 
                    />

                    {error && <p className={styles.errorText}>{error}</p>}
                    <button className={styles.button} type="submit">Cadastrar</button>
                </form>

                <p className={styles.loginLink}>
                    Já possui uma conta? <Link to="/login">Faça Login</Link>
                </p>
            </div>
        </div>
    )
}

export default Signup