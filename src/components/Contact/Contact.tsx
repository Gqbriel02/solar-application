import React, {FormEvent, useState} from 'react';
import {db, auth} from '../../config/Firebase';
import {addDoc, collection} from 'firebase/firestore';
import {useAuthState} from 'react-firebase-hooks/auth';
import styles from './Contact.module.css';
import Error from '../Error/Error';
import Loading from '../Loading/Loading';

const Contact = () => {
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [severity, setSeverity] = useState('Normal');
    const [subjectError, setSubjectError] = useState('');
    const [messageError, setMessageError] = useState('');
    const [user] = useAuthState(auth);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!user) {
            alert("Please log in to send a message.");
            return;
        }

        let isValid = true;

        if (!subject.trim()) {
            setSubjectError("Subject cannot be empty or just spaces.");
            isValid = false;
        } else {
            setSubjectError('');
        }

        if (!message.trim()) {
            setMessageError("Message cannot be empty or just spaces.");
            isValid = false;
        } else {
            setMessageError('');
        }

        if (!isValid) return;

        setLoading(true);

        try {
            await addDoc(collection(db, "messages"), {
                userId: user.uid,
                subject: subject.trim(),
                message: message.trim(),
                severity
            });

            alert("Message sent successfully!");
            setSubject('');
            setMessage('');
            setSeverity('Normal');
        } catch (error) {
            console.error("Error sending message: ", error);
            alert("Failed to send message. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles['container']}>
            <div className={styles['header']}>
                <h2> Contact </h2>
            </div>
            {loading ? (
                <Loading/>
            ) : (
                <form onSubmit={handleSubmit}>
                    <div className={styles['inputGroup']}>
                        <label htmlFor="subject">Subject:</label>
                        <input
                            type="text"
                            id="subject"
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                        />
                        <Error errorMessage={subjectError} ariaLive="assertive"/>
                    </div>
                    <div className={styles['inputGroup']}>
                        <label htmlFor="message">Message:</label>
                        <textarea
                            id="message"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                        />
                        <Error errorMessage={messageError} ariaLive="assertive"/>
                    </div>
                    <div className={styles['inputGroup']}>
                        <label htmlFor="severity">Severity:</label>
                        <select
                            id="severity"
                            value={severity}
                            onChange={(e) => setSeverity(e.target.value)}
                        >
                            <option value="Normal">Normal</option>
                            <option value="Important">Important</option>
                            <option value="Urgent">Urgent</option>
                        </select>
                    </div>
                    <button type="submit" className={styles['button']}>Send Message</button>
                </form>
            )}
        </div>
    );
};

export default Contact;