import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Home(){
    const [courses, setCourses] = useState([]);

    const navigate = useNavigate();

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

    return (
        <>
            <h1>Vitrini de Curso</h1>
            {courses.length === 0 ? (
                <p>Nenhum curso cadastrado ainda.</p>
            ) : (
                <div style={{ display: 'flex', gap: '20px', marginTop: '20px' }}>
                    {courses.map((course) => (
                        <div key={course.id} style={{ border: '1px solid #ccc', padding: '15px' }}>
                            <h3>{course.title}</h3>
                            <span style={{ fontSize: '12px', color: 'gray' }}>
                                {course.category}
                            </span>
                            <br />
                            <button onClick={() => pageDetails(course.id)}>Ver Aulas</button>
                        </div>
                    ))}

                </div>
            )}
        </>
    )
}

export default Home