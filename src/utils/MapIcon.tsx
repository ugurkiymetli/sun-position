import L from "leaflet";

type colors =
  | "black"
  | "blue"
  | "gold"
  | "green"
  | "grey"
  | "orange"
  | "red"
  | "violet"
  | "yellow";

export default function CustomIcon(color: colors) {
  return L.icon({
    iconSize: [25, 41],
    iconAnchor: [10, 41],
    popupAnchor: [2, -40],
    iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-${color}.png`,
    shadowUrl: "https://unpkg.com/leaflet@1.6/dist/images/marker-shadow.png",
  });
}
