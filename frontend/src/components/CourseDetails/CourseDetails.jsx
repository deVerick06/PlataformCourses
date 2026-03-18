import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import styles from "./CourseDetails.module.css";

function CourseDetails() {
    const { id } = useParams();
    const [course, setCourse] = useState(null)
    console.log(id)

    const navigate = useNavigate()
    const role = localStorage.getItem("role")
    const plan_type = localStorage.getItem("plan_type")

    async function getDetailsCourse() {
        const token = localStorage.getItem("token");

        const response = await fetch(`http://127.0.0.1:5000/courses/${id}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if (response.status === 401) {
            localStorage.removeItem("token");
            navigate("/login")
            return
        }

        const data = await response.json();
        setCourse(data);
        console.log(data); //DEBUG
    }

    useEffect(() => {
        getDetailsCourse();
    }, []);

    async function handleEnroll(e) {
        e.preventDefault()

        const token = localStorage.getItem("token")
        
        const response = await fetch(`http://127.0.0.1:5000/courses/${id}/enroll`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })

        if (response.status === 401) {
            localStorage.removeItem("token");
            navigate("/login");
            return
        }

        if (response.ok) {
            getDetailsCourse()
        }
    } 

    function renderEnrollButton() {
        if (course.is_enrolled === true) {
            return null
        }

        if (course.is_premium === true && plan_type !== 'premium') {
            return (
                <>
                    <p style={{ color: 'goldenrod' }}>Assine o Premium para acessar:</p>
                    <button className={styles.enrollBtn} onClick={() => navigate("/plans")}></button>
                </>
            )
        }

        return (
            <>
                <button className={styles.enrollBtn} onClick={() => handleEnroll()}>Matricular-se</button>
            </>
        )
    }

    function goToPage(video_id) {
        navigate(`/assistir/${video_id}`)
    }

    if (course === null) {
        return (
            <h2>Carregando detalhes do curso...</h2>
        )
    }

    return (
        <div className={styles.container}>
            <div className={styles.layoutGrid}>
                <div className={styles.mainContent}>
                    <h1>{course.title}</h1>
                    {role === 'admin' && (<button onClick={() => navigate(`/courses/${id}/add-video`)} style={{ width: '150px' }} >Adicionar Aula</button>)}
                    {course.description == '' ? (
                        <p className={styles.description}>Sem descrição...</p>
                    ) : (
                        <p className={styles.description}>{course.description}</p>
                    )}
                    {course.videos.length === 0 ? (
                        <p>Nenhum video foi adicionado ainda...</p>
                    ) : (
                        <div className={styles.videoList}>
                            {course.videos.map((video) => (
                                <div key={video.id} className={styles.videoCard}>
                                    <div>
                                        <h3 className={styles.videoTitle}>{video.title}</h3>
                                        {video.resume == null ? (
                                            <p style={{ color: 'gray', fontSize: '14px' }}>Sem resumo...</p>
                                        ) : (
                                            <p style={{ color: 'gray', fontSize: '14px' }}>{video.resume}</p>
                                        )}
                                    </div>
                                    <button className={styles.watchBtn} onClick={() => goToPage(video.id)}>Assistir aula</button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                <div className={styles.sidebar}>
                    {renderEnrollButton()}
                </div>
            </div>
        </div>
    )
}

export default CourseDetails