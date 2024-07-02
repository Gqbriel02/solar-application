import React, {FormEvent, useRef, useState} from "react";
import styles from './Home.module.css';
import {useMultistepForm} from "../Form/useMultistepForm";
import MapComponent from "../GoogleMap/MapComponent";
import SystemInfo from "../Form/SystemInfo";
import Results from "../Form/Results";
import {db, auth} from "../../config/Firebase";
import {collection, addDoc} from "firebase/firestore";
import {useAuthState} from 'react-firebase-hooks/auth';
import {PvwattsResponse} from '../../services/PVWattsService';
import Error from '../Error/Error'

export type FormData = {
    lat: number;
    lng: number;
    dcSystemSize: number;
    moduleType: number;
    arrayType: number;
    systemLosses: number;
    tilt: number;
    azimuth: number;
};

const INITIAL_DATA: FormData = {
    lat: 0,
    lng: 0,
    dcSystemSize: 0,
    moduleType: 0,
    arrayType: 0,
    systemLosses: 14,
    tilt: 20,
    azimuth: 180,
};

function Home() {
    const [data, setData] = useState(INITIAL_DATA);
    const [markerPosition, setMarkerPosition] = useState({lat: 0, lng: 0});
    const [reset, setReset] = useState(false);
    const [results, setResults] = useState<PvwattsResponse | null>(null);
    const [location, setLocation] = useState<string>('');
    const [user] = useAuthState(auth);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [isSaved, setIsSaved] = useState<boolean>(false);

    const systemInfoRef = useRef<any>(null);

    function updateFields(fields: Partial<FormData>) {
        setData(prev => {
            return {...prev, ...fields};
        });
        setIsSaved(false);
    }

    function updateMarkerPosition(position: { lat: number; lng: number }) {
        setMarkerPosition(position);
        updateFields({lat: position.lat, lng: position.lng});
        /*console.log("Pozitie pin: ", markerPosition);*/
    }

    function handleResultsFetched(results: PvwattsResponse, location: string) {
        setResults(results);
        setLocation(location);
    }

    const {steps, currentStepIndex, step, isFirstStep, isLastStep, back, next, goTo} =
        useMultistepForm([
            <MapComponent {...data} updateFields={updateFields} updateMarkerPosition={updateMarkerPosition}/>,
            <SystemInfo {...data} ref={systemInfoRef} updateFields={updateFields}/>,
            <Results {...data} reset={reset} onResultsFetched={handleResultsFetched}/>,
        ]);

    async function onSubmit(e: FormEvent) {
        e.preventDefault();
        if (loading) return;
        setError(null);

        if (currentStepIndex === 0) {
            if (data.lat === 0 && data.lng === 0) {
                setError('Please place a marker on the map.');
                return;
            }
        }

        if (currentStepIndex === 1) {
            if (systemInfoRef.current && !systemInfoRef.current.validate()) {
                return;
            }
        }

        if (!isLastStep) return next();

        if (isLastStep && user && results) {
            setLoading(true);
            try {
                const solarCollectionRef = collection(db, 'solarData');
                await addDoc(solarCollectionRef, {
                    userId: user.uid,
                    inputs: {
                        array_type: data.arrayType,
                        azimuth: data.azimuth,
                        lat: data.lat,
                        lon: data.lng,
                        losses: data.systemLosses,
                        module_type: data.moduleType,
                        system_capacity: data.dcSystemSize,
                        tilt: data.tilt
                    },
                    outputs: {
                        ac_annual: results.outputs.ac_annual,
                        ac_monthly: results.outputs.ac_monthly,
                        capacity_factor: results.outputs.capacity_factor,
                        dc_monthly: results.outputs.dc_monthly,
                        poa_monthly: results.outputs.poa_monthly,
                        solrad_annual: results.outputs.solrad_annual,
                        solrad_monthly: results.outputs.solrad_monthly,
                    },
                    station_info: results.station_info,
                    location: `${location} (${data.lat}, ${data.lng})`
                });
                alert("Data saved successfully");
                setIsSaved(true);
            } catch (err) {
                console.error("Error adding document: ", err);
                alert("Error saving data");
            } finally {
                setLoading(false);
            }
        }
    }

    function resetForm() {
        setData(INITIAL_DATA);
        setMarkerPosition({lat: 0, lng: 0});
        goTo(0);
        setReset(prev => !prev);
        setIsSaved(false);
    }

    return (
        <div className={styles['container']}>
            <form onSubmit={onSubmit}>
                <div className={styles['steps']}>
                    {currentStepIndex + 1} / {steps.length}
                </div>
                <div className={styles['step']}>
                    {step}
                </div>
                <Error errorMessage={error}/>
                <div className={styles['buttons']}>
                    {!isFirstStep && (
                        <button type="button" className={styles['back-button']} onClick={back}>
                            Back
                        </button>
                    )}
                    <button type="submit" className={styles['button']}
                            disabled={loading || (isLastStep && isSaved)}>{isLastStep ? "Save" : "Next"}</button>
                    {isLastStep && (
                        <button type="button" className={styles['reset-button']} onClick={resetForm}>
                            Reset
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
}

export default Home;
