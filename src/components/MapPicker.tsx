import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

let customIcon: L.Icon | undefined;
if (typeof window !== "undefined") {
  customIcon = new L.Icon({
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41]
  });
}

function LocationPicker({ position, setPosition }: { position: [number, number] | null, setPosition: (p: [number, number]) => void }) {
  const map = useMapEvents({
    click(e) {
      setPosition([e.latlng.lat, e.latlng.lng]);
    },
  });

  useEffect(() => {
    if (position) {
      map.flyTo(position, map.getZoom() > 14 ? map.getZoom() : 16);
    }
  }, [position, map]);

  return position === null || !customIcon ? null : (
    <Marker position={position} icon={customIcon}></Marker>
  );
}

export default function MapPicker({
  position,
  setPosition,
}: {
  position: [number, number] | null;
  setPosition: (p: [number, number]) => void;
}) {
  // Default to Bangalore, Karnataka (Yeshwanthpur area)
  const defaultCenter: [number, number] = position || [13.0285, 77.5462];
  const defaultZoom = position ? 16 : 13;

  return (
    <MapContainer center={defaultCenter} zoom={defaultZoom} style={{ height: "100%", width: "100%", zIndex: 0 }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      />
      <LocationPicker position={position} setPosition={setPosition} />
    </MapContainer>
  );
}
