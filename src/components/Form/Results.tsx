import React, {useEffect, useState} from 'react';
import {getPvwattsData, PvwattsResponse} from '../../services/PVWattsService';
import {FormData} from '../Home/Home';
import {FormWrapper} from "./FormWrapper";

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

        fetchResults();
    }, [lat, lng, dcSystemSize, moduleType, arrayType, systemLosses, tilt, azimuth, reset]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <FormWrapper title={'Results'}>
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
