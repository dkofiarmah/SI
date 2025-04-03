import React, { useState, useEffect, useRef } from 'react';
import { 
  AlertTriangle
} from 'lucide-react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

interface ThreatData {
  region: string;
  severity: number;
  incidents: number;
  trend: 'increasing' | 'decreasing' | 'stable';
}

interface Props {
  selectedRegion: string;
  selectedCountry: string;
  timeframe: string;
}

export default function ThreatIntelligenceHeatmap({ selectedRegion, selectedCountry, timeframe }: Props) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<mapboxgl.Map | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Mock data for the heatmap based on the props
  const mockThreatData = [
    { longitude: 36.8219, latitude: -1.2921, severity: 5 },  // Nairobi
    { longitude: 39.6682, latitude: -4.0435, severity: 3 },  // Mombasa
    { longitude: 34.7619, latitude: -0.4167, severity: 4 },  // Kisumu
    { longitude: 35.2833, latitude: -0.5167, severity: 2 },  // Nakuru
  ];

  useEffect(() => {
    if (!mapContainerRef.current) return;

    setLoading(true);
    mapboxgl.accessToken = 'pk.eyJ1IjoiZGthcm1haDEiLCJhIjoiY205MDhpMDNpMGp3MzJuc2k5aWdtb2RzaCJ9.ogW0y2fJwQxSPozD4eu-9Q';
    const mapInstance = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [0, 0],
      zoom: 2,
    });

    mapInstance.on('load', () => {
      mapInstance.addSource('threats', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: mockThreatData.map((threat) => ({
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: [threat.longitude, threat.latitude],
            },
            properties: {
              severity: threat.severity,
            },
          })),
        },
      });

      mapInstance.addLayer({
        id: 'threat-heatmap',
        type: 'heatmap',
        source: 'threats',
        paint: {
          'heatmap-weight': ['interpolate', ['linear'], ['get', 'severity'], 0, 0, 5, 1],
          'heatmap-intensity': ['interpolate', ['linear'], ['zoom'], 0, 1, 9, 3],
          'heatmap-color': [
            'interpolate',
            ['linear'],
            ['heatmap-density'],
            0, 'rgba(33,102,172,0)',
            0.2, 'rgb(103,169,207)',
            0.4, 'rgb(209,229,240)',
            0.6, 'rgb(253,219,199)',
            0.8, 'rgb(239,138,98)',
            1, 'rgb(178,24,43)',
          ],
          'heatmap-radius': ['interpolate', ['linear'], ['zoom'], 0, 2, 9, 20],
        },
      });
      
      setLoading(false);
    });

    setMap(mapInstance);

    return () => mapInstance.remove();
  }, [selectedRegion, selectedCountry, timeframe]);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-bold text-lg text-gray-800 flex items-center">
          <AlertTriangle className="h-5 w-5 mr-2 text-red-500" />
          Threat Intelligence
        </h2>
      </div>
      <div ref={mapContainerRef} className="h-60 rounded-lg overflow-hidden" />
    </div>
  );
}