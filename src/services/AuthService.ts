import {
    sendPasswordResetEmail,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword
} from 'firebase/auth';
import {auth} from '../config/Firebase';


export async function signIn(email: string, password: string, setError: (error: string) => void, setIsAuthenticated: (authenticated: boolean) => void): Promise<void> {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        console.log(userCredential.user);
        /*await signInWithEmailAndPassword(auth, email, password);*/
        setIsAuthenticated(true);
        return Promise.resolve();
    } catch (error) {
        /*console.log("EROAREAAA: ", error);*/
        return Promise.reject();
    }
}

export function signUp(userCredentials: { [key: string]: string }, setError: (error: string) => void): Promise<void> {
    return new Promise((resolve, reject) => {
        createUserWithEmailAndPassword(auth, userCredentials.email, userCredentials.password)
            .then((userCredential) => {
                console.log(userCredential.user);
                console.log('Registered successfully');
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
    if (email !== null && email !== '') {
        sendPasswordResetEmail(auth, email);
        alert("Email sent! Check your inbox!");
    } else {
        alert("Invalid email address. Please provide a valid email.");
    }
}
