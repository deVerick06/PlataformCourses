import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import styles from "./Dashboard.module.css";

function Dashboard() {
    const [ myCourses, setMyCourses ] = useState([]);

    const navigate = useNavigate();

    async function getMyCourses() {
        const token = localStorage.getItem("token");

        const response = await fetch("http://127.0.0.1:5000/my-courses", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })

        if (response.status == 401) {
            localStorage.removeItem("token");
            navigate("/login");
            return
        }

        const data = await response.json();
        setMyCourses(data)
        console.log(data) //DEBUG
    }

    useEffect(() => {
        getMyCourses();
    }, []);

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Meu Dashboard:</h2>
            {myCourses.length === 0 ? (
                <p className={styles.emptyMessage}>Você não se matriculou em nenhum curso ainda</p>
            ) : (
                <div className={styles.grid}>
                    {myCourses.map((course) => (
                        <div key={course.id} className={styles.card}>
                            <h3 className={styles.cardTitle}>{course.title}</h3>
                            <span className={styles.category}>
                                {course.category}
                            </span>
                            <br />
                            <button className={styles.button} onClick={() => navigate(`/courses/${course.course_id}`)}>Continuar</button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default Dashboard;