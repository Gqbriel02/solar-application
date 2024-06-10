import React from "react";
import {GoogleMap, Marker, useJsApiLoader} from "@react-google-maps/api";
import {googleMapsKey} from "../../config/ApiKeys";
import styles from "./MapComponent.module.css";

type MapData = {
    lat: number
    lng: number
}

type MapDataProps = MapData & {
    updateFields: (fields: Partial<MapData>) => void;
    updateMarkerPosition: (position: { lat: number; lng: number }) => void;
}

const MapComponent: React.FC<MapDataProps> = ({lat, lng, updateFields, updateMarkerPosition}) => {
    /*const [markerPosition, setMarkerPosition] = useState<{ lat: number; lng: number } | null>(null);*/

    const {isLoaded} = useJsApiLoader({
        googleMapsApiKey: googleMapsKey
    });

    const handleMapClick = (event: google.maps.MapMouseEvent) => {
        /*console.log("Map clicked:", event.latLng);*/
        if (event.latLng) {
            const lat = event.latLng.lat();
            const lng = event.latLng.lng();
            /*  console.log("Latitude: ", lat);
                console.log("Longitude: ", lng);*/
            updateMarkerPosition({lat, lng});
            updateFields({lat, lng});
        }
    };

    if (!isLoaded) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <div className={styles['header']}>Resource Data</div>
            <div>Please put a marker on the map where you would like your panels.</div>

            {isLoaded && (

                <GoogleMap
                    mapContainerStyle={{width: "100%", height: "400px"}}
                    zoom={4}
                    center={{lat: 44.85, lng: 24.86667}}
                    onClick={handleMapClick}
                >
                    {/*{markerPosition && <Marker position={markerPosition} draggable/>}*/}
                    {lat && lng && <Marker position={{lat, lng}} draggable/>}
                </GoogleMap>
            )}
        </>
    )
};

export default MapComponent;
