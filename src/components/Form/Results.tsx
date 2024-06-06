import React, {useEffect, useState} from 'react';
import {getPvwattsData, PvwattsResponse} from '../../services/PVWattsService';
import {FormData} from '../Home/Home';
import {FormWrapper} from "./FormWrapper";
import {googleMapsKey} from '../../config/ApiKeys';
import axios from "axios";

type ResultsProps = FormData & { reset: boolean };

const monthNames = [
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
                 }: ResultsProps) {
    const [results, setResults] = useState<PvwattsResponse | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [city, setCity] = useState<string>('');

    useEffect(() => {
        const fetchResults = async () => {
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
            } catch (err) {
                setError('Error fetching data from PVWatts API');
            } finally {
                setLoading(false);
            }
        };

        const fetchCityName = async () => {
            try {
                const response = await axios.get(
                    `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${googleMapsKey}`
                );
                const results = response.data.results;
                if (results.length > 0) {
                    const addressComponents = results[0].address_components;
                    const cityComponent = addressComponents.find((component: any) =>
                        component.types.includes('locality')
                    );
                    if (cityComponent) {
                        setCity(cityComponent.long_name);
                    } else {
                        setCity(results[0].formatted_address);
                    }
                }
            } catch (err) {
                setCity('Unknown');
            }
        };

        fetchResults();
        fetchCityName();
    }, [lat, lng, dcSystemSize, moduleType, arrayType, systemLosses, tilt, azimuth, reset]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <FormWrapper title={`Results for ${city} (${lat}, ${lng})`}>
            {results && (
                <>
                    <table>
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
                                <td>{monthNames[index]}</td>
                                <td>{solrad.toFixed(2)}</td>
                                <td>{results.outputs.ac_monthly[index].toFixed(0)}</td>
                            </tr>
                        ))}
                        <tr>
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
