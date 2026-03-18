import { Link, useNavigate } from "react-router-dom";
import styles from "./Navbar.module.css"

function Navbar({ children }) {
    const token = localStorage.getItem("token");
    const navigate = useNavigate();

    function logout() {
        localStorage.clear();
        navigate("/login");
        return
    }

    return (
        <>
            <nav className={styles.navbar}>
                <div className={styles.logo}>Logo</div>

                <div className={styles.navLinks}>
                    <Link to="/home">Home</Link>
                    <Link to="/my-dashboard">Dashboard</Link>
                    <Link to="/plans">Planos</Link>
                </div>

                <div className={styles.profileArea}>Perfil <button className={styles.logoutBtn} onClick={() => logout()}>Logout</button></div>
            </nav>

            <main className={styles.mainContent}>
                {children}
            </main>
        </>
    )
}

export default Navbar