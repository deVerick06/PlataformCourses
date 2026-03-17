import { Link, useNavigate } from "react-router-dom";

function Navbar() {
    const token = localStorage.getItem("token");
    const navigate = useNavigate();

    function logout({ children }) {
        localStorage.clear();
        navigate("/login");
        return
    }

    return (
        <>
            <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #414141', padding: '14px 40px' }}>
                <div style={{ fontSize: '18px', fontWeight: '600' }} >Logo</div>

                <div style={{ display: 'flex', gap: '24px' }}>
                    <Link to="/home">Home</Link>
                    <Link to="/my-dashboard">Dashboard</Link>
                    <Link to="/plans">Planos</Link>
                </div>

                <div>Perfil <button onClick={() => logout()}>Logout</button></div>
            </nav>

            <main style={{ padding: '20px' }}>
                {children}
            </main>
        </>
    )
}

export default Navbar