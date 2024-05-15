import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Home from './components/Home/Home';
import Login from './components/Auth/Login/Login';
import Register from './components/Auth/Register/Register';
import { Navbar } from './components/Navbar/Navbar';
import { AuthContext } from './context/AuthContext';
import Content from "./components/Content/Content";

function App() {
    const { isAuthenticated } = useContext(AuthContext);
    return (
        <>
            {isAuthenticated && <Navbar />}

            <Routes>
                <Route path="/login" element={isAuthenticated ? <Navigate to="/" /> : <Login />} />
                <Route
                    path="/register"
                    element={isAuthenticated ? <Navigate to="/" /> : <Register />}
                />
                <Route element={<Content />}>
                    <Route
                        path="/"
                        element={isAuthenticated ? <Home /> : <Navigate to="/login" />}
                    />
                </Route>
            </Routes>

        </>
    );
}

export default App;
