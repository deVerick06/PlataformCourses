import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

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
        <>
            <form onSubmit={handleSubmit}>
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
                {teachers.length == 0 ? (
                    <select value={teacher_id} onChange={(e) => setTeacher_ID(e.target.value)} required>
                        <option value="">Nenhum</option>
                    </select>
                ) : (
                    <select value={teacher_id} onChange={(e) => setTeacher_ID(e.target.value)} required>
                        <option value="" disabled>Selecione um Professor...</option>
                        {teachers.map((teacher) => (
                            <option value={teacher.id}>{teacher.username}</option>
                        ))}
                    </select>
                )}
                {categories.length == 0 ? (
                    <select value={category_id} onChange={(e) => setCategory_ID(e.target.value)} required>
                        <option value="">Nenhum</option>
                    </select>
                ) : (
                    <select value={category_id} onChange={(e) => setCategory_ID(e.target.value)} required>
                        <option value="" disabled>Selecione um Categoria...</option>
                        {categories.map((category) => (
                            <option value={category.id}>{category.name}</option>
                        ))}
                    </select>
                )}
                <textarea value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
                <button type="submit">Enviar</button>
            </form>
        </>
    )
};

export default CreateCourse;