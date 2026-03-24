import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import styles from "./VideoPlayer.module.css"

function VideoPlayer() {
    const { video_id } = useParams();
    const [video, setVideo] = useState(null)
    console.log(video_id) //DEBUG

    useEffect(() => {
        async function getData() {
            const token = localStorage.getItem("token");

            const response = await fetch(`http://127.0.0.1:5000/videos/${video_id}`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            const data = await response.json();
            setVideo(data)
            console.log(data); //DEBUG
        }
        getData()
    }, [video_id]);

    if (video == null) {
        return (
            <div className={styles.loadingState}>
                Carregando a aula...
            </div>
        )
    };

    return (
        <div className={styles.pageContainer}>
            <div className={styles.videoWrapper}>
                <iframe 
                    className={styles.iframe}
                    src={video.url}
                    title={video.title}
                    allowFullScreen 
                />
            </div>

            <div className={styles.infoSection}>
                <h1 className={styles.title}>{video.title}</h1>
                
                {video.resume == null || video.resume === "" ? (
                    <p className={styles.emptyResume}>Esse vídeo não possui um resumo...</p>
                ) : (
                    <p className={styles.resumeText}>{video.resume}</p>
                )}
            </div>

        </div>
    )
}

export default VideoPlayer