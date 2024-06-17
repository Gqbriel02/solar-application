import axios from 'axios';
import {weatherApiKey} from '../config/ApiKeys';

const API_URL = 'https://developer.nrel.gov/api/pvwatts/v8.json';

interface PvwattsParams {
    system_capacity: number;
    module_type: number;
    losses: number;
    array_type: number;
    tilt: number;
    azimuth: number;
    lat: number;
    lon: number;
}

export interface PvwattsResponse {
    inputs: any;
    errors: any[];
    warnings: any[];
    version: string;
    ssc_info: any;
    station_info: any;
    outputs: {
        ac_monthly: number[];
        poa_monthly: number[];
        solrad_monthly: number[];
        dc_monthly: number[];
        ac_annual: number;
        solrad_annual: number;
        capacity_factor: number;
    };
}

const getDataset = (lat: number, lon: number): string => {
    // Simple check for USA (latitude between roughly 24 and 50, longitude between roughly -125 and -66)
    if (lat >= 24 && lat <= 50 && lon >= -125 && lon <= -66) {
        return 'nsrdb';
    } else {
        return 'intl';
    }
};

const getPvwattsData = async (params: PvwattsParams): Promise<PvwattsResponse> => {
    try {
        const dataset = getDataset(params.lat, params.lon);
        /*console.log('API request parameters:', params);*/
        const response = await axios.get(API_URL, {
            params: {
                api_key: weatherApiKey,
                system_capacity: params.system_capacity,
                module_type: params.module_type,
                losses: params.losses,
                array_type: params.array_type,
                tilt: params.tilt,
                azimuth: params.azimuth,
                lat: params.lat,
                lon: params.lon,
                dataset: dataset
            },
        });
        /*console.log('data din api: ', response.data);*/
        return response.data;
    } catch (error) {
        throw new Error('Error fetching data from PVWatts API');
    }
};

export {getPvwattsData};
