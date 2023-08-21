import { LatLngLiteral } from "leaflet";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import { Geo } from "../utils/types";
import { useEffect, useState } from "react";
import { getDistance, getMapCenter, getZoomLevel } from "../utils/utils";
import "leaflet/dist/leaflet.css";
import CustomIcon from "../utils/MapIcon";

export interface MapProps {
  city1: string;
  coordinates1: Geo;
  city2: string;
  coordinates2: Geo;
}

export default function Map({
  city1,
  coordinates1,
  city2,
  coordinates2,
}: MapProps) {
  const [zoomLevel, setZoomLevel] = useState(0);

  const [mapCenter, setMapCenter] = useState<LatLngLiteral>(
    getMapCenter(coordinates1, coordinates2)
  );

  const marker1Pos: LatLngLiteral = {
    lat: coordinates1?.lat,
    lng: coordinates1?.lng,
  };

  const marker2Pos: LatLngLiteral = {
    lat: coordinates2?.lat,
    lng: coordinates2?.lng,
  };

  const distance = getDistance(coordinates1, coordinates2);

  const minZoom = 2;
  const maxZoom = 12;
  const zoomRange = Math.min(
    maxZoom,
    Math.max(minZoom, Math.floor(16 - Math.log2(distance)))
  );

  useEffect(() => {
    setMapCenter(getMapCenter(coordinates1, coordinates2));
    const distance = getDistance(coordinates1, coordinates2);
    const zoom = getZoomLevel(distance);
    setZoomLevel(zoom);
  }, [coordinates1, coordinates2]);

  return (
    <div id="selected-cities-map">
      <MapContainer
        key={`${mapCenter.lat}-${mapCenter.lng}-${zoomRange}`}
        center={mapCenter}
        zoom={7}
        className="map-container"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={marker1Pos} icon={CustomIcon("red")}>
          <Popup>{city1}</Popup>
        </Marker>
        <Marker position={marker2Pos} icon={CustomIcon("blue")}>
          <Popup>{city2} </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
