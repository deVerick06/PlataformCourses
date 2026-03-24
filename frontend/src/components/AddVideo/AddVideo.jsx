import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import styles from "./AddVideo.module.css";
import { ssrImportKey } from "vite/module-runner";

function AddVideo() {
    const [ title, setTitle ] = useState('');
    const [ resume, setResume ] = useState('');
    const [ url, setUrl ] = useState('');
    const [ error, setError ] = useState(null);
    const { id } = useParams();

    const navigate = useNavigate()

    async function handleSubmit(e) {
        e.preventDefault();

        const token = localStorage.getItem("token");

        const response = await fetch('http://127.0.0.1:5000/videos/add', {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                title: title,
                resume: resume,
                url: url,
                course_id: Number(id)
            })
        });

        if (response.status === 401) {
            localStorage.removeItem("token");
            console.log("Token expired");
            navigate("/login");
            return
        } else if (response.status === 403) {
            alert("Somente administradores podem adicionar videos");
            navigate("/home");
            return
        }

        const data = await response.json();

        if (response.ok) {
            console.log("Video added")
            navigate(`/courses/${id}`)
            return
        } else {
            setError(data.message)
        }
    }

    return (
        <div className={styles.pageContainer}>
            <div className={styles.formCard}>
                <h1>Adicionar Nova Aula</h1>
                <form className={styles.form} onSubmit={handleSubmit}>
                    <div className={styles.formGroup}>
                        <label className={styles.label} htmlFor="title">Título do Vídeo</label>
                        <input 
                            id="title"
                            className={styles.inputField}
                            type="text" 
                            value={title} 
                            onChange={(e) => setTitle(e.target.value)} 
                            placeholder="Ex: Entendendo Variáveis"
                            required 
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label className={styles.label} htmlFor="resume">Resumo</label>
                        <textarea 
                            id="resume"
                            className={`${styles.inputField} ${styles.textareaField}`}
                            value={resume} 
                            onChange={(e) => setResume(e.target.value)}
                            placeholder="Uma breve descrição do que será abordado..."
                        ></textarea>

                    </div>
                    <div className={styles.formGroup}>
                        <label className={styles.label} htmlFor="url">URL do Vídeo</label>
                        <input 
                            id="url"
                            className={styles.inputField}
                            type="text" 
                            placeholder="Ex: https://www.youtube.com/watch?v=..."
                            value={url} onChange={(e) => setUrl(e.target.value)} 
                            required 
                        />
                    </div>

                    {error && <p className={styles.errorText}>{error}</p>}
                    <button className={styles.submitBtn} type="submit">Adicionar Vídeo</button>
                </form>
            </div>
        </div>
    )
}

export default AddVideo