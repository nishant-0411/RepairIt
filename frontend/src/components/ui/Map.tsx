"use client";

import { useState, useMemo } from "react";
import Map, { Marker, Popup, NavigationControl, GeolocateControl } from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";
import { Star, CheckCircle, Navigation } from "lucide-react";
import Link from "next/link";
import { TechnicianCardProps } from "./TechnicianCard";

export interface MapTechnician extends TechnicianCardProps {
  lat: number;
  lng: number;
}

interface MapComponentProps {
  technicians: MapTechnician[];
  centerLat?: number;
  centerLng?: number;
}

export function TechnicianMap({ 
  technicians, 
  centerLat = 40.7128, 
  centerLng = -74.0060 
}: MapComponentProps) {
  const [popupInfo, setPopupInfo] = useState<MapTechnician | null>(null);

  // Use a default token for demo purposes if env var is not set, 
  // normally you wouldn't expose a fallback like this in production
  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "";

  return (
    <div className="w-full h-[600px] lg:h-[800px] rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 relative shadow-sm">
      {!process.env.NEXT_PUBLIC_MAPBOX_TOKEN && (
        <div className="absolute top-0 left-0 w-full bg-amber-500/90 text-white text-xs font-semibold py-1.5 px-4 text-center z-10 backdrop-blur-sm">
          Mapbox token is missing. Please add NEXT_PUBLIC_MAPBOX_TOKEN to your environment variables.
        </div>
      )}
      
      <Map
        initialViewState={{
          longitude: centerLng,
          latitude: centerLat,
          zoom: 11,
          pitch: 45,
        }}
        mapStyle="mapbox://styles/mapbox/light-v11"
        mapboxAccessToken={mapboxToken}
        style={{ width: "100%", height: "100%" }}
      >
        <GeolocateControl position="top-right" />
        <NavigationControl position="top-right" />

        {technicians.map((tech) => (
          <Marker
            key={tech.id}
            longitude={tech.lng}
            latitude={tech.lat}
            anchor="bottom"
            onClick={(e: any) => {
              e.originalEvent.stopPropagation();
              setPopupInfo(tech);
            }}
          >
            <div className="cursor-pointer group flex flex-col items-center">
              <div className={`px-3 py-1.5 rounded-full shadow-lg border-2 border-white dark:border-zinc-900 transition-all duration-300 ${popupInfo?.id === tech.id ? 'bg-zinc-900 text-white scale-110' : 'bg-blue-600 text-white group-hover:scale-110 group-hover:bg-blue-700'}`}>
                <span className="font-extrabold text-sm">${tech.hourlyRate}</span>
              </div>
              <div className={`w-2.5 h-2.5 rotate-45 -mt-1.5 shadow-lg border-r-2 border-b-2 border-white dark:border-zinc-900 transition-colors ${popupInfo?.id === tech.id ? 'bg-zinc-900' : 'bg-blue-600 group-hover:bg-blue-700'}`}></div>
            </div>
          </Marker>
        ))}

        {popupInfo && (
          <Popup
            anchor="top"
            longitude={popupInfo.lng}
            latitude={popupInfo.lat}
            onClose={() => setPopupInfo(null)}
            closeOnClick={false}
            className="z-50"
            maxWidth="320px"
          >
            <div className="p-1 -mx-2 -my-1 w-[260px]">
              <div className="flex gap-3 mb-3">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-zinc-100 flex-shrink-0 border border-zinc-200">
                  {popupInfo.avatarUrl ? (
                    <img src={popupInfo.avatarUrl} alt={popupInfo.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-blue-600 font-bold text-xl bg-blue-50">
                      {popupInfo.name.charAt(0)}
                    </div>
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-bold text-base leading-tight text-zinc-900">{popupInfo.name}</h3>
                    {popupInfo.isVerified && (
                      <CheckCircle className="w-4 h-4 text-blue-500 flex-shrink-0" />
                    )}
                  </div>
                  <div className="flex items-center gap-1 mt-1 text-xs font-medium text-zinc-600">
                    <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                    <span>{popupInfo.rating.toFixed(1)}</span>
                    <span className="text-zinc-400">({popupInfo.reviewsCount})</span>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-between items-center bg-zinc-50 p-2.5 rounded-xl border border-zinc-100">
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-500">Rate</span>
                  <span className="font-extrabold text-blue-600">${popupInfo.hourlyRate}<span className="text-xs font-medium text-zinc-400">/hr</span></span>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-500">Distance</span>
                  <div className="flex items-center gap-1 text-zinc-700 font-semibold">
                    <Navigation className="w-3 h-3" />
                    {popupInfo.distanceKm} km
                  </div>
                </div>
              </div>
              
              <Link 
                href={`/technicians/${popupInfo.id}`}
                className="block w-full mt-3 py-2 bg-zinc-900 hover:bg-zinc-800 text-white text-center font-semibold rounded-lg text-sm transition-colors"
              >
                View Profile
              </Link>
            </div>
          </Popup>
        )}
      </Map>
    </div>
  );
}
