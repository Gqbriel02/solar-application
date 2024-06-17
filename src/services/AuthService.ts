import {
    sendPasswordResetEmail,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut
} from 'firebase/auth';
import {auth} from '../config/Firebase';


export async function signIn(email: string, password: string, setError: (error: string) => void, setIsAuthenticated: (authenticated: boolean) => void): Promise<void> {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        /*console.log('signIn usercredential: ', userCredential.user);*/
        setIsAuthenticated(true);
        return Promise.resolve();
    } catch (error) {
        /*console.log("Eroarea: ", error);*/
        return Promise.reject();
    }
}

export function signUp(userCredentials: { [key: string]: string }, setError: (error: string) => void): Promise<void> {
    return new Promise((resolve, reject) => {
        createUserWithEmailAndPassword(auth, userCredentials.email, userCredentials.password)
            .then((userCredential) => {
                /*console.log(userCredential.user);
                console.log('Registered successfully');*/
                resolve();
            })
            .catch((error) => {
                setError(error.message);
                reject(error);
            });
    });
}

export function resetPassword(): void {
    const email = prompt('Please enter your email:');
    if (email === null) {
        return;
    }
    if (email !== '') {
        sendPasswordResetEmail(auth, email)
            .then(() => {
                alert("Email sent! Check your inbox!");
            })
            .catch((error) => {
                alert("Error: " + error.message);
            });
    } else {
        alert("Invalid email address. Please provide a valid email.");
    }
}

export async function signOutUser(): Promise<void> {
    try {
        await signOut(auth);
        return Promise.resolve();
    } catch (error) {
        return Promise.reject(error);
    }
}

export function getCurrentUser() {
    return auth.currentUser;
}
