import React, {useEffect, useState} from 'react';
import {db, auth} from '../../config/Firebase';
import {collection, query, where, getDocs} from 'firebase/firestore';
import {useNavigate} from 'react-router-dom';
import {useAuthState} from 'react-firebase-hooks/auth';
import styles from './Reports.module.css';

interface SolarDataSummary {
    id: string;
    location: string;
}

const Reports = () => {
    const [solarDataSummaries, setSolarDataSummaries] = useState<SolarDataSummary[]>([]);
    const [user] = useAuthState(auth);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            if (user) {
                const solarCollectionRef = collection(db, 'solarData');
                const q = query(solarCollectionRef, where("userId", "==", user.uid));
                const querySnapshot = await getDocs(q);
                const dataList = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    location: doc.data().location
                }));
                setSolarDataSummaries(dataList);
            }
        };

        fetchData();
    }, [user]);

    return (
        <div className={styles.container}>
            {solarDataSummaries.map((data) => (
                <div key={data.id} className={styles.card} onClick={() => navigate(`/reports/${data.id}`)}>
                    <p>{data.location}</p>
                </div>
            ))}
        </div>
    );
};

export default Reports;
