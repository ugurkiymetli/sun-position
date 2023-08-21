import L, { LatLngLiteral } from "leaflet";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import { Geo } from "../utils/types";
import "leaflet/dist/leaflet.css";

export interface MapProps {
  coordinates1: Geo | undefined;
  coordinates2: Geo | undefined;
  city1: string;
  city2: string;
}

export default function Map({
  coordinates1,
  coordinates2,
  city1,
  city2,
}: MapProps) {
  const mapCenter: LatLngLiteral =
    coordinates1?.lat &&
    coordinates1.lng &&
    coordinates2?.lat &&
    coordinates2.lng
      ? {
          lat: (coordinates1.lat + coordinates2.lat) / 2,
          lng: (coordinates1.lng + coordinates2.lng) / 2,
        }
      : { lat: 0, lng: 0 };

  const zoomLevel = 4;
  const marker1Pos: LatLngLiteral =
    coordinates1?.lat && coordinates1?.lng
      ? {
          lat: coordinates1?.lat,
          lng: coordinates1?.lng,
        }
      : { lat: 0, lng: 0 };
  const marker2Pos: LatLngLiteral =
    coordinates2?.lat && coordinates2.lng
      ? {
          lat: coordinates2?.lat,
          lng: coordinates2?.lng,
        }
      : { lat: 0, lng: 0 };

  const icon = L.icon({
    iconUrl: "assets/images/marker-icon.png",
    iconSize: new L.Point(35, 46),
  });
  console.log(mapCenter);

  return (
    <div id="selected-cities-map">
      <MapContainer
        key={`${coordinates1?.lat},${coordinates1?.lng} - ${coordinates2?.lat},${coordinates2?.lng}`}
        center={mapCenter}
        zoom={zoomLevel}
        className="map-container"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={marker1Pos} icon={icon}>
          <Popup>{city1}</Popup>
        </Marker>
        <Marker position={marker2Pos} icon={icon}>
          <Popup>{city2} </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
