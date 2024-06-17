import {Link, useLocation, useNavigate} from "react-router-dom"
import Logo from "../../assets/images/logo.svg"
import LogoutIcon from "../../assets/images/logout.svg"
import {useContext} from "react";
import {AuthContext} from "../../context/AuthContext";
import styles from "./Navbar.module.css";
import {signOutUser} from "../../services/AuthService";

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const {isAuthenticated, setIsAuthenticated, currentUser} = useContext(AuthContext);

    if (!isAuthenticated) {
        return null;
    }

    const handleLogout = async () => {
        try {
            await signOutUser();
            setIsAuthenticated(false);
            navigate("/login");
        } catch (error) {
            console.error("Failed to sign out:", error);
        }
    };

    const handleHomeClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        e.preventDefault();
        if (location.pathname === "/") {
            window.location.reload();
        } else {
            navigate("/", {replace: true});
        }
    };

    return (
        <nav className={styles['navigation']}>
            <Link to={'/'} onClick={handleHomeClick}> <img src={Logo} alt="logo" className={styles['logo']}/> </Link>
            <div className={styles['links']}>
                <Link to="/" onClick={handleHomeClick}> Home </Link>
                <Link to="/about-us"> About us </Link>
                <Link to="/contact"> Contact us </Link>
                <Link to="/reports"> Reports </Link>
            </div>
            <div className={styles['user-info']}>
                {currentUser && <span>{currentUser.email}</span>}
                <button className={styles['logout']} type="button" onClick={handleLogout}>
                    <img src={LogoutIcon} alt="logout"/>
                </button>
            </div>
        </nav>
    );
}

export {Navbar};


