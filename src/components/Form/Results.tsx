import React, {useEffect, useState} from 'react';
import {getPvwattsData, PvwattsResponse} from '../../services/PVWattsService';
import {FormData} from '../Home/Home';
import {FormWrapper} from "./FormWrapper";
import {googleMapsKey} from '../../config/ApiKeys';
import axios from "axios";
import styles from './Results.module.css';
import Loading from '../Loading/Loading';
import Error from '../Error/Error';

type ResultsProps = FormData & {
    reset: boolean;
    onResultsFetched: (results: PvwattsResponse, location: string) => void;
};

const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

function Results({
                     lat,
                     lng,
                     dcSystemSize,
                     moduleType,
                     arrayType,
                     systemLosses,
                     tilt,
                     azimuth,
                     reset,
                     onResultsFetched
                 }: ResultsProps) {
    const [results, setResults] = useState<PvwattsResponse | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [city, setCity] = useState<string>('');

    useEffect(() => {
        const fetchCityName = async (): Promise<string | undefined> => {
            try {
                const response = await axios.get(
                    `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${googleMapsKey}`
                );
                const results = response.data.results;
                if (results.length > 0) {
                    const addressComponents = results[0].address_components;
                    const cityComponent = addressComponents.find((component: { types: string[], long_name: string }) =>
                        component.types.includes('locality')
                    );
                    if (cityComponent) {
                        return cityComponent.long_name;
                    } else {
                        return results[0].formatted_address;
                    }
                }
            } catch (err) {
                return 'Unknown';
            }
        };

        const fetchResults = async (city: string): Promise<void> => {
            setLoading(true);
            setError(null);
            try {
                const data = await getPvwattsData({
                    system_capacity: dcSystemSize,
                    module_type: moduleType,
                    losses: systemLosses,
                    array_type: arrayType,
                    tilt,
                    azimuth,
                    lat,
                    lon: lng,
                });
                setResults(data);
                onResultsFetched(data, city);
            } catch (err) {
                setError('Error fetching data from PVWatts API');
            } finally {
                setLoading(false);
            }
        };

        async function initialize() {
            const cityName = await fetchCityName();
            setCity(cityName || "Unknown");
            fetchResults(cityName || "Unknown");
        }

        initialize();
    }, [lat, lng, dcSystemSize, moduleType, arrayType, systemLosses, tilt, azimuth, reset]);

    if (loading) return <Loading/>;
    if (error) return <Error errorMessage={error}/>

    return (
        <FormWrapper title={`Results for ${city} (${lat}, ${lng})`}>
            {results && (
                <>
                    <table className={styles.resultsTable}>
                        <thead>
                        <tr>
                            <th>Month</th>
                            <th>Solar Radiation (kWh/m²/day)</th>
                            <th>AC Energy (kWh)</th>
                        </tr>
                        </thead>
                        <tbody>
                        {results.outputs.solrad_monthly.map((solrad: number, index: number) => (
                            <tr key={index}>
                                <td>{months[index]}</td>
                                <td>{solrad.toFixed(2)}</td>
                                <td>{results.outputs.ac_monthly[index].toFixed(0)}</td>
                            </tr>
                        ))}
                        <tr className={styles.annualRow}>
                            <td>Annual</td>
                            <td>{results.outputs.solrad_annual.toFixed(2)}</td>
                            <td>{results.outputs.ac_annual.toFixed(0)}</td>
                        </tr>
                        </tbody>
                    </table>
                </>
            )}
        </FormWrapper>
    );
}

export default Results;
