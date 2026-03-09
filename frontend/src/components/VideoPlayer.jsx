import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

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
    }, []);

    if (video == null) {
        return (
            <p>Loading...</p>
        )
    };

    return (
        <>
            <h2>Video</h2>
            <div>
                <h3>{video.title}</h3>
                {video.resume == null ? (
                    <p>Esse video não possui um resumo...</p>
                ) : (
                    <p>{video.resume}</p>
                )}
                <iframe 
                    src={video.url}
                    title={video.title}
                    width="400px"
                    height="250px"
                />
            </div>
        </>
    )
}

export default VideoPlayer