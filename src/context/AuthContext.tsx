import React, {createContext, useEffect, useState} from 'react';
import {auth} from '../config/Firebase';

export const AuthContext = createContext<AuthContextType>({
    isAuthenticated: false,
    setIsAuthenticated: () => {
    },
    currentUser: null,
    setCurrentUser: () => {
    },
    loading: true
});

interface AuthContextType {
    isAuthenticated: boolean;
    setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
    currentUser: any;
    setCurrentUser: React.Dispatch<React.SetStateAction<any>>;
    loading: boolean;
}

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [currentUser, setCurrentUser] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(true);


    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                /*console.log('e logat')*/
                setIsAuthenticated(true);
                setCurrentUser(user);
            } else {
                /*console.log('nu mai e logat')*/
                setIsAuthenticated(false);
                setCurrentUser(null);
            }
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    return (
        <AuthContext.Provider value={{isAuthenticated, setIsAuthenticated, currentUser, setCurrentUser, loading}}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;