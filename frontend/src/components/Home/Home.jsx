import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Home.module.css";

function Home(){
    const [courses, setCourses] = useState([]);

    const navigate = useNavigate();

    const role = localStorage.getItem("role")

    useEffect(() => {
        async function getCourses() {
            const token = localStorage.getItem("token");

            const response = await fetch("http://127.0.0.1:5000/courses", {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            const data = await response.json();
            setCourses(data);
            console.log(data); //DEBUG
        }
        getCourses();
    }, []);

    function pageDetails(course_id) {
        navigate(`/courses/${course_id}`)
    }

    function goToAddCourse() {
        navigate("/courses/add")
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Vitrine de Curso</h1>
                {role === 'admin' && (
                    <button className={styles.adminBtn} onClick={() => goToAddCourse()}>
                        + Adicionar Curso
                    </button>
                )}
            </div>
            {courses.length === 0 ? (
                <p className={styles.emptyMessage}>Nenhum curso cadastrado ainda.</p>
            ) : (
                <div className={styles.grid}>
                    {courses.map((course) => (
                        <div key={course.id} className={styles.card}>
                            <h3 className={styles.cardTitle}>{course.title}</h3>
                            <span className={styles.cardCategory}>
                                {course.category}
                            </span>
                            <br />
                            <button className={styles.detailsBtn} onClick={() => pageDetails(course.id)}>Ver Detalhes</button>
                        </div>
                    ))}

                </div>
            )}
        </div>
    )
}

export default Home