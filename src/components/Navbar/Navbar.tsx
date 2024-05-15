import { Link, useNavigate } from "react-router-dom"
import Logo from "../../assets/images/logo.svg"
import LogoutIcon from "../../assets/images/logout.svg"
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import styles from "./Navbar.module.css";
const Navbar = () => {
    const navigate = useNavigate();
    const { isAuthenticated, setIsAuthenticated } = useContext(AuthContext);
    console.log("Am I authenticated? from navbar", isAuthenticated);
    if (!isAuthenticated) {
        return null;
    }

    return (
        <nav className={styles['navigation']}>
            <Link to={'/'}> <img src={Logo} alt="logo" className={styles['logo']} /> </Link>
            <div>
                <Link to="/"> Home </Link>
                <Link to="/about-us"> About Us </Link>
                <Link to="/reports"> Reports </Link>
            </div>
            <button className={styles['logout']} type="button" onClick={() => { setIsAuthenticated(false); navigate("/login"); }} >
                <img src={LogoutIcon} alt="logout" />
            </button>
        </nav>
    );
}

export { Navbar };


