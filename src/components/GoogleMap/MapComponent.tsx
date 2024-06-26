import React from "react";
import {GoogleMap, Marker, useJsApiLoader} from "@react-google-maps/api";
import {googleMapsKey} from "../../config/ApiKeys";
import styles from "./MapComponent.module.css";
import Loading from "../Loading/Loading";

type MapData = {
    lat: number
    lng: number
}

type MapDataProps = MapData & {
    updateFields: (fields: Partial<MapData>) => void;
    updateMarkerPosition: (position: { lat: number; lng: number }) => void;
}

const MapComponent: React.FC<MapDataProps> = ({lat, lng, updateFields, updateMarkerPosition}) => {

    const {isLoaded} = useJsApiLoader({
        googleMapsApiKey: googleMapsKey
    });

    const handleMapClick = (event: google.maps.MapMouseEvent) => {
        if (event.latLng) {
            const lat = event.latLng.lat();
            const lng = event.latLng.lng();
            updateMarkerPosition({lat, lng});
            updateFields({lat, lng});
        }
    };

    if (!isLoaded) {
        return <Loading/>
    }

    return (
        <>
            <h2 className={styles['header']}>Resource Data</h2>
            <p>Please put a marker on the map where you would like your panels.</p>

            {isLoaded && (

                <GoogleMap
                    mapContainerStyle={{width: "100%", height: "400px"}}
                    zoom={4}
                    center={{lat: lat || 44.85, lng: lng || 24.86667}}
                    onClick={handleMapClick}
                >
                    {lat && lng && <Marker position={{lat, lng}} draggable/>}
                </GoogleMap>
            )}
        </>
    )
};

export default MapComponent;
