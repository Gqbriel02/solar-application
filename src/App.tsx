import React, {useContext} from 'react';
import {Routes, Route, Navigate} from 'react-router-dom';
import './App.css';
import Home from './components/Home/Home';
import Login from './components/Auth/Login/Login';
import Register from './components/Auth/Register/Register';
import {Navbar} from './components/Navbar/Navbar';
import {AuthContext} from './context/AuthContext';
import Content from "./components/Content/Content";
import Reports from "./components/Reports/Reports";
import DetailedReport from './components/Reports/DetailedReport/DetailedReport';
import AboutUs from './components/AboutUs/AboutUs';
import Contact from './components/Contact/Contact';
import Loading from "./components/Loading/Loading";

function App() {
    const {isAuthenticated, loading} = useContext(AuthContext);

    if (loading) {
        return <Loading/>;
    }

    return (
        <>
            {isAuthenticated && <Navbar/>}

            <Routes>
                <Route path="/login" element={isAuthenticated ? <Navigate to="/"/> : <Login/>}/>
                <Route
                    path="/register"
                    element={isAuthenticated ? <Navigate to="/"/> : <Register/>}
                />
                <Route element={<Content/>}>
                    <Route
                        path="/"
                        element={isAuthenticated ? <Home/> : <Navigate to="/login"/>}
                    />
                    <Route
                        path="/reports"
                        element={isAuthenticated ? <Reports/> : <Navigate to="/login"/>}
                    />
                    <Route path="/reports/:id" element={isAuthenticated ? <DetailedReport/> : <Navigate to="/login"/>}/>
                    <Route
                        path="/about-us"
                        element={isAuthenticated ? <AboutUs/> : <Navigate to="/login"/>}
                    />
                    <Route
                        path="/contact"
                        element={isAuthenticated ? <Contact/> : <Navigate to="/login"/>}
                    />
                </Route>
            </Routes>

        </>
    );
}

export default App;
