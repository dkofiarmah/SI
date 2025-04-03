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

    try {
      const mapInstance = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: 'mapbox://styles/mapbox/light-v11',
        center: [36.8219, -1.2921], // Center on Nairobi
        zoom: 5,
        minZoom: 3,
        maxZoom: 15,
        width: mapContainerRef.current.offsetWidth,
        height: mapContainerRef.current.offsetHeight,
      });

      mapInstance.on('error', (error) => {
        console.error('Mapbox error:', error);
        setLoading(false);
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

      const handleResize = () => {
        if (mapInstance) {
          mapInstance.resize();
        }
      };

      window.addEventListener('resize', handleResize);
      return () => {
        window.removeEventListener('resize', handleResize);
        mapInstance?.remove();
      };
    } catch (error) {
      console.error('Error initializing map:', error);
      setLoading(false);
    }
  }, [selectedRegion, selectedCountry, timeframe]);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-bold text-lg text-gray-800 flex items-center">
          <AlertTriangle className="h-5 w-5 mr-2 text-red-500" />
          Threat Intelligence
        </h2>
      </div>
      <div className="flex-1 min-h-[300px] relative rounded-lg overflow-hidden">
        {loading && (
          <div className="absolute inset-0 bg-gray-50 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent"></div>
          </div>
        )}
        <div ref={mapContainerRef} className="absolute inset-0" />
      </div>
    </div>
  );
}