import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function CourseDetails() {
    const { id } = useParams();
    const [course, setCourse] = useState(null)
    console.log(id)

    const navigate = useNavigate()

    useEffect(() => {
        async function getDetailsCourse() {
            const token = localStorage.getItem("token");

            const response = await fetch(`http://127.0.0.1:5000/courses/${id}`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            const data = await response.json();
            setCourse(data);
            console.log(data); //DEBUG
        }
        getDetailsCourse();
    }, []);

    function goToPage(video_id) {
        navigate(`/assistir/${video_id}`)
    }

    if (course == null) {
        return (
            <h2>Carregando detalhes do curso...</h2>
        )
    }

    return (
        <>
            <h1>Detalhes do Curso</h1>
            <div>
                <h3>{course.title}</h3>
                {course.description == '' ? (
                    <p>Sem descrição...</p>
                ) : (
                    <p>{course.description}</p>
                )}
                {course.videos.length === 0 ? (
                    <p>Nenhum video foi adicionado ainda...</p>
                ) : (
                    <div style={{ display: 'grid', gap: '2px' }}>
                        {course.videos.map((video) => (
                            <div key={video.id} style={{ border: '1px solid #000000ff', padding: '5px' }}>
                                <h3>{video.title}</h3>
                                {video.resume == null ? (
                                    <p>Esse video não possui um resumo...</p>
                                ) : (
                                    <p>{video.resume}</p>
                                )}
                                <a href="#">{video.url}</a>
                                <button onClick={() => goToPage(video.id)}>Assistir aula</button>
                            </div>
                        ))}
                    </div>
                )}
                <button>Iniciar Curso</button>
            </div>
        </>
    )
}

export default CourseDetails