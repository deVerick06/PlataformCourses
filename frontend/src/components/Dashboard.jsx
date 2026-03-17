import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

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
        <>
            <h2>Meu Dashboard:</h2>
            {myCourses.length === 0 ? (
                <p>Você não se matriculou em nenhum curso ainda</p>
            ) : (
                <div style={{ display: 'flex', gap: '20px', margin: '10px' }}>
                    {myCourses.map((course) => (
                        <div key={course.id} style={{ border: '1px solid #252525ff', padding: '15px' }}>
                            <h3>{course.title}</h3>
                            <span style={{ fontSize: '15px', color: "grey" }}>
                                {course.category}
                            </span>
                            <br />
                            <button onClick={() => navigate(`/courses/${course.course_id}`)}>Continuar</button>
                        </div>
                    ))}
                </div>
            )}
        </>
    )
}

export default Dashboard;