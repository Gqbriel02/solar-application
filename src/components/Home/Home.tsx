import React, {FormEvent, useState} from "react";
import styles from './Home.module.css';
import {useMultistepForm} from "../Form/useMultistepForm";
import MapComponent from "../GoogleMap/MapComponent";
import SystemInfo from "../Form/SystemInfo";
import Results from "../Form/Results";

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

    function updateFields(fields: Partial<FormData>) {
        setData(prev => {
            return {...prev, ...fields};
        });
    }

    function updateMarkerPosition(position: { lat: number; lng: number }) {
        setMarkerPosition(position);
        updateFields({lat: position.lat, lng: position.lng});
    }

    const {steps, currentStepIndex, step, isFirstStep, isLastStep, back, next, goTo} =
        useMultistepForm([
            <MapComponent {...data} updateFields={updateFields} updateMarkerPosition={updateMarkerPosition}/>,
            <SystemInfo {...data} updateFields={updateFields}/>,
            <Results {...data} reset={reset}/>,
        ]);

    function onSubmit(e: FormEvent) {
        e.preventDefault();
        if (!isLastStep) return next();
        alert("Successfully finished");
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
