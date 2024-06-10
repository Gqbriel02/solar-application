import React, {FormEvent, useState} from "react";
import styles from './Home.module.css';
import {useMultistepForm} from "../Form/useMultistepForm";
import MapComponent from "../GoogleMap/MapComponent";
import SystemInfo from "../Form/SystemInfo";
import Results from "../Form/Results";
import {db, auth} from "../../config/Firebase";
import {collection, addDoc} from "firebase/firestore";
import {useAuthState} from 'react-firebase-hooks/auth';
import {PvwattsResponse} from '../../services/PVWattsService';

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
    systemLosses: 0,
    tilt: 0,
    azimuth: 0,
};

function Home() {
    const [data, setData] = useState(INITIAL_DATA);
    const [markerPosition, setMarkerPosition] = useState({lat: 0, lng: 0});
    const [reset, setReset] = useState(false);
    const [results, setResults] = useState<PvwattsResponse | null>(null);
    const [location, setLocation] = useState<string>('');
    const [user] = useAuthState(auth);

    function updateFields(fields: Partial<FormData>) {
        setData(prev => {
            return {...prev, ...fields};
        });
    }

    function updateMarkerPosition(position: { lat: number; lng: number }) {
        setMarkerPosition(position);
        updateFields({lat: position.lat, lng: position.lng});
    }

    function handleResultsFetched(results: PvwattsResponse, location: string) {
        setResults(results);
        setLocation(location);
    }

    const {steps, currentStepIndex, step, isFirstStep, isLastStep, back, next, goTo} =
        useMultistepForm([
            <MapComponent {...data} updateFields={updateFields} updateMarkerPosition={updateMarkerPosition}/>,
            <SystemInfo {...data} updateFields={updateFields}/>,
            <Results {...data} reset={reset} onResultsFetched={handleResultsFetched}/>,
        ]);

    async function onSubmit(e: FormEvent) {
        e.preventDefault();
        if (!isLastStep) return next();
        /*console.log("User:", user);
        console.log("Results:", results);*/
        if (isLastStep && user && results) {
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
            } catch (err) {
                console.error("Error adding document: ", err);
                alert("Error saving data");
            }
        }
    }


    function resetForm() {
        setData(INITIAL_DATA);
        setMarkerPosition({lat: 0, lng: 0});
        goTo(0);
        setReset(prev => !prev);
    }

    return (
        <div className={styles['container']}>
            <form onSubmit={onSubmit}>
                <div className={styles['steps']}>
                    {currentStepIndex + 1} / {steps.length}
                </div>
                {step}
                <div className={styles['buttons']}>
                    {!isFirstStep && (
                        <button type="button" onClick={back}>
                            Back
                        </button>
                    )}
                    <button type="submit">{isLastStep ? "Save" : "Next"}</button>
                    {isLastStep && (
                        <button type="button" onClick={resetForm}>
                            Reset
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
}

export default Home;
