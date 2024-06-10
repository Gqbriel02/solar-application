import React, {useEffect, useState} from 'react';
import {useParams, useNavigate} from 'react-router-dom';
import {doc, getDoc} from 'firebase/firestore';
import {db} from '../../../config/Firebase';
import styles from './DetailedReport.module.css';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    BarChart,
    Bar
} from 'recharts';

const months = ["Jan", "Feb", "Mar", "Apr", "May", "June",
    "July", "Aug", "Sep", "Oct", "Nov", "Dec"];

const moduleTypeMapping: { [key: number]: string } = {
    0: 'Standard',
    1: 'Premium',
    2: 'Thin film'
};

const arrayTypeMapping: { [key: number]: string } = {
    0: 'Fixed - Open Rack',
    1: 'Fixed - Roof Mounted',
    2: '1-Axis',
    3: '1-Axis Backtracking',
    4: '2-Axis'
};

interface DetailedSolarData {
    userId: string;
    location: string;
    inputs: {
        array_type: string;
        azimuth: string;
        lat: string;
        lon: string;
        losses: string;
        module_type: string;
        system_capacity: string;
        tilt: string;
    };
    outputs: {
        ac_annual: number;
        ac_monthly: number[];
        capacity_factor: number;
        dc_monthly: number[];
        poa_monthly: number[];
        solrad_annual: number;
        solrad_monthly: number[];
    };
    station_info: {
        city: string;
        distance: number;
        elev: number;
        lat: number;
        location: string;
        lon: number;
        solar_resource_file: string;
        state: string;
        tz: number;
        weather_data_source: string;
    };
}

const DetailedReport = () => {
    const {id} = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [solarData, setSolarData] = useState<DetailedSolarData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchSolarData = async () => {
            if (!id) {
                setError('No Solar ID provided');
                setLoading(false);
                return;
            }

            const solarDocRef = doc(db, 'solarData', id);
            try {
                const solarDoc = await getDoc(solarDocRef);
                if (solarDoc.exists()) {
                    setSolarData(solarDoc.data() as DetailedSolarData);
                } else {
                    setError('Solar data not found');
                }
            } catch (err) {
                setError('Failed to fetch solar data');
                console.error(err);
            }
            setLoading(false);
        };

        fetchSolarData();
    }, [id]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    const chartData = solarData?.outputs.ac_monthly.map((ac, index) => ({
        month: months[index],
        AC: ac,
        DC: solarData.outputs.dc_monthly[index]
    }));

    const solarRadiationData = solarData?.outputs.solrad_monthly.map((solrad, index) => ({
        month: months[index],
        SolarRadiation: solrad,
        AnnualAverage: solarData.outputs.solrad_annual
    }));

    const poaMonthlyData = solarData?.outputs.poa_monthly.map((poa, index) => ({
        month: months[index],
        POA: poa
    }));

    return (
        <div className={styles.detailedReport}>
            <button className={styles.backButton} onClick={() => navigate('/reports')}>Back</button>
            <div>
                {solarData && (
                    <>
                        <h2 className={styles.location}>The solar data for this location
                            -{'>'} {solarData.location} </h2>

                        <div className={styles.container}>
                            <h3>System Characteristics</h3>
                            <table className={styles.systemTable}>
                                <tbody>
                                <tr>
                                    <th>Characteristic</th>
                                    <th>Value</th>
                                </tr>
                                <tr>
                                    <td>System Capacity (kW)</td>
                                    <td>{solarData.inputs.system_capacity}</td>
                                </tr>
                                <tr>
                                    <td>Array Type</td>
                                    <td>{arrayTypeMapping[parseInt(solarData.inputs.array_type)]}</td>
                                </tr>
                                <tr>
                                    <td>Losses (%)</td>
                                    <td>{solarData.inputs.losses}</td>
                                </tr>
                                <tr>
                                    <td>Module Type</td>
                                    <td>{moduleTypeMapping[parseInt(solarData.inputs.module_type)]}</td>
                                </tr>
                                <tr>
                                    <td>Tilt (degrees)</td>
                                    <td>{solarData.inputs.tilt}</td>
                                </tr>
                                <tr>
                                    <td>Azimuth (degrees)</td>
                                    <td>{solarData.inputs.azimuth}</td>
                                </tr>
                                </tbody>
                            </table>
                        </div>

                        <div className={styles.acChart}>
                            <div className={styles.chartContainer}>
                                <ResponsiveContainer width="100%" height={300}>
                                    <LineChart data={chartData} margin={{top: 5, right: 30, left: 20, bottom: 5}}>
                                        <CartesianGrid strokeDasharray="3 3"/>
                                        <XAxis dataKey="month"/>
                                        <YAxis/>
                                        <Tooltip/>
                                        <Legend/>
                                        <Line type="monotone" dataKey="AC" stroke="#8884d8" activeDot={{r: 8}}/>
                                        <Line type="monotone" dataKey="DC" stroke="#82ca9d"/>
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                            <div className={styles.acAnnualCard}>
                                <h3>Annual Alternating Current Output</h3>
                                <p>{solarData.outputs.ac_annual.toFixed(2)} kWh</p>
                            </div>
                        </div>

                        <div className={styles.solarRadiationChart}>
                            <div className={styles.chartContainer}>
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={solarRadiationData}
                                              margin={{top: 5, right: 30, left: 20, bottom: 5}}>
                                        <CartesianGrid strokeDasharray="3 3"/>
                                        <XAxis dataKey="month"/>
                                        <YAxis/>
                                        <Tooltip/>
                                        <Legend/>
                                        <Bar dataKey="SolarRadiation" fill="#ffc658"/>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                            <div className={styles.solarAnnualCard}>
                                <h3>Annual Solar Radiation</h3>
                                <p>{solarData.outputs.solrad_annual.toFixed(2)} kWh/m²/day</p>
                            </div>
                        </div>
                        <div className={styles.poaChart}>
                            <div className={styles.chartContainer}>
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={poaMonthlyData} margin={{top: 5, right: 30, left: 20, bottom: 5}}>
                                        <CartesianGrid strokeDasharray="3 3"/>
                                        <XAxis dataKey="month"/>
                                        <YAxis/>
                                        <Tooltip/>
                                        <Legend/>
                                        <Bar dataKey="POA" fill="#8884d8"/>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                            <div className={styles.poaAnnualCard}>
                                <h3>Annual Plane of Array Irradiance</h3>
                                <p>{solarData.outputs.poa_monthly.reduce((acc, value) => acc + value, 0).toFixed(2)} kWh/m²</p>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default DetailedReport;
