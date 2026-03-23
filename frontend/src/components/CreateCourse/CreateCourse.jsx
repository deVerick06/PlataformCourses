import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./CreateCourse.module.css";

function CreateCourse() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [teacher_id, setTeacher_ID] = useState('');
    const [category_id, setCategory_ID] = useState('');
    const [teachers, setTeachers] = useState([]);
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        

        async function getTeachers() {
            const token = localStorage.getItem("token");

            const response = await fetch('http://127.0.0.1:5000/users/teachers', {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            if (response.status === 401) {
                localStorage.removeItem("token");
                navigate("/login");
                return;
            } else if (response.status === 403) {
                alert("Somente administradores podem criar cursos!");
                navigate("/home");
                return
            }

            const data = await response.json();
            setTeachers(data);
            console.log(data); //DEBUG
        }
        getTeachers();

        async function getCategories() {
            const response = await fetch('http://127.0.0.1:5000/categories', {
                method: "GET"
            });

            const data = await response.json();
            setCategories(data);
            console.log(data); //DEBUG
        }
        getCategories();
    }, [])

    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();

        const token = localStorage.getItem("token");

        const response = await fetch('http://127.0.0.1:5000/courses/add', {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                title: title,
                description: description,
                teacher_id: Number(teacher_id),
                category_id: Number(category_id)
            })
        });

        if (response.status == 401) {
            localStorage.removeItem("token");
            console.log("Token has expired");
            navigate("/login");
            return;
        } else if(response.status == 403) {
            alert("Somente administradores podem criar cursos!");
            navigate("/home");
            return;
        }

        const data = await response.json()

        if (response.ok) {
            console.log("Course created");
            navigate("/home");
        } else {
            console.log("Error: ", data.message);
        }
    }

    return (
        <div className={styles.pageContainer}>
            <div className={styles.formCard}>
                <h1 className={styles.title}>Criar Novo Curso</h1>
                <form onSubmit={handleSubmit}>
                    <div className={styles.formGroup}>
                        <label className={styles.label} htmlFor="title">Título do  Curso</label>
                        <input 
                            id="title"
                            className={styles.inputField}
                            type="text" 
                            value={title} 
                            placeholder="Título"
                            onChange={(e) => setTitle(e.target.value)} 
                            required
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label className={styles.label} htmlFor="teacher">Professor Responsável</label>
                        <select 
                            id="teacher"
                            value={teacher_id} 
                            className={styles.inputField}
                            onChange={(e) => setTeacher_ID(e.target.value)} 
                            required
                        >
                            {teachers.length == 0 ? (
                                <option value="">Nenhum professor cadastrado</option>
                            ) : (
                                <>
                                    <option value="" disabled>Selecione um Professor...</option>
                                    {teachers.map((teacher) => (
                                        <option value={teacher.id}>{teacher.username}</option>
                                    ))}
                                </>
                            )}
                        </select>
                    </div>
                    <div className={styles.formGroup}>
                        <label className={styles.label} htmlFor="category">Categoria</label>
                        <select 
                            id="category"
                            className={styles.inputField}
                            value={category_id} 
                            onChange={(e) => setCategory_ID(e.target.value)} 
                            required
                        >
                            {categories.length === 0 ? (
                                <option value="">Nenhuma categoria cadastrada</option>
                            ) : (
                                <>
                                    <option value="" disabled>Selecione uma Categoria...</option>
                                    {categories.map((category) => (
                                        <option key={category.id} value={category.id}>{category.name}</option>
                                    ))}
                                </>
                            )}
                        </select>
                    </div>
                    <div className={styles.formGroup}>
                        <label className={styles.label} htmlFor="description">Descrição do Curso</label>
                        <textarea 
                            id="description"
                            className={`${styles.inputField} ${styles.textareaField}`}
                            value={description} 
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Descreva o que os alunos aprenderão nesse curso..."
                        ></textarea>
                    </div>
                    <button className={styles.submitBtn} type="submit">Cadastrar</button>
                </form>
            </div>
        </div>
    )
};

export default CreateCourse;