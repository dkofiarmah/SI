import React, { useState, useEffect, useRef } from 'react';
import { 
  AlertTriangle, MapPin, ExternalLink, Database, Info
} from 'lucide-react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import DataSourceSelector from './DataSourceSelector';
import DataSourceInfoPanel from './DataSourceInfoPanel';
import { DataSource } from '@/types/dataSource';
import { getRecommendedDataSources } from '@/lib/utils/dataSources';

// Ensure the mapbox token is set
if (!mapboxgl.accessToken) {
  mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || "";
}

interface ThreatData {
  region: string;
  severity: number;
  incidents: number;
  trend: 'increasing' | 'decreasing' | 'stable';
}

interface Props {
  selectedRegion: string;
  selectedCountry?: string;
  timeframe?: string;
  height?: string;
  enableDataSourceSelection?: boolean;
}

// Region coordinates map for centering the map based on region
const regionCoordinates: Record<string, [number, number]> = {
  'East Africa': [36.8219, -1.2921], // Kenya/Nairobi area
  'North Africa': [25.2048, 25.2222], // Egypt/Libya area
  'West Africa': [3.3792, 6.5244],    // Nigeria/Lagos area
  'Central Africa': [18.5555, 4.3947], // Central African area
  'Southern Africa': [28.0473, -26.2041], // South Africa/Johannesburg area
  'Middle East': [45.0792, 23.8859],   // Saudi Arabia area
  'All Regions': [25.0, 0.0]          // Center of Africa
};

// Country coordinates map
const countryCoordinates: Record<string, [number, number]> = {
  'Kenya': [36.8219, -1.2921],
  'Nigeria': [3.3792, 6.5244],
  'Egypt': [31.2357, 30.0444],
  'South Africa': [28.0473, -26.2041],
  'Ethiopia': [38.7578, 9.0222],
  'Ghana': [-0.1869, 5.6037],
  'Tanzania': [39.2083, -6.7924],
  'Saudi Arabia': [45.0792, 23.8859],
  'UAE': [54.3773, 24.4539]
};

// Default zoom levels
const regionZoom = 4;
const countryZoom = 5.5;

export default function ThreatIntelligenceHeatmap({ 
  selectedRegion, 
  selectedCountry, 
  timeframe = '30',
  height = '400px',
  enableDataSourceSelection = false
}: Props) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<mapboxgl.Map | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [threatCount, setThreatCount] = useState<number>(0);
  const [selectedDataSources, setSelectedDataSources] = useState<string[]>([
    'savannah-core', 'security-incidents', 'news-aggregation'
  ]);
  const [showDataSourceSelector, setShowDataSourceSelector] = useState(false);
  const [showDataSourceInfo, setShowDataSourceInfo] = useState(false);

  // Get region-specific threat data
  const getRegionThreatData = () => {
    // Base data for East Africa (Kenya)
    const baseData = [
      { longitude: 36.8219, latitude: -1.2921, severity: 5 },  // Nairobi
      { longitude: 39.6682, latitude: -4.0435, severity: 3 },  // Mombasa
      { longitude: 34.7619, latitude: -0.4167, severity: 4 },  // Kisumu
      { longitude: 35.2833, latitude: -0.5167, severity: 2 },  // Nakuru
    ];

    // Region-specific data
    const regionData: Record<string, Array<{longitude: number, latitude: number, severity: number}>> = {
      'North Africa': [
        { longitude: 31.2357, latitude: 30.0444, severity: 4 }, // Cairo
        { longitude: 29.9187, latitude: 31.2001, severity: 3 }, // Alexandria
        { longitude: 10.1815, latitude: 36.8065, severity: 2 }, // Tunis
      ],
      'West Africa': [
        { longitude: 3.3792, latitude: 6.5244, severity: 5 },   // Lagos
        { longitude: 7.4951, latitude: 9.0579, severity: 3 },   // Abuja
        { longitude: -0.1869, latitude: 5.6037, severity: 2 },  // Accra
      ],
      'Southern Africa': [
        { longitude: 28.0473, latitude: -26.2041, severity: 3 }, // Johannesburg
        { longitude: 18.4241, latitude: -33.9249, severity: 2 }, // Cape Town
        { longitude: 31.0218, latitude: -17.8292, severity: 4 }, // Harare
      ],
      'Central Africa': [
        { longitude: 15.2663, latitude: -4.4419, severity: 5 },  // Kinshasa
        { longitude: 11.5174, latitude: 3.8480, severity: 4 },   // Yaoundé
        { longitude: 18.5555, latitude: 4.3947, severity: 3 },   // Bangui
      ],
      'Middle East': [
        { longitude: 45.0792, latitude: 23.8859, severity: 3 },  // Riyadh
        { longitude: 54.3773, latitude: 24.4539, severity: 2 },  // Abu Dhabi
        { longitude: 51.5310, latitude: 25.2854, severity: 4 },  // Doha
      ]
    };

    // If a specific country is selected, filter data to only that country
    if (selectedCountry) {
      // This is a simplified approach; in a real app, you'd have country-specific data
      // For now, we'll just return a subset of the regional data
      const countrySubset = regionData[selectedRegion] || baseData;
      return countrySubset.slice(0, 2); // Return fewer points to represent country-level focus
    }

    // Return data for the selected region, or default to East Africa
    return regionData[selectedRegion] || baseData;
  };

  const mockThreatData = getRegionThreatData();

  useEffect(() => {
    if (!mapContainerRef.current) return;

    setLoading(true);

    // Calculate map center based on selected region/country
    let center: [number, number];
    let zoom: number;

    if (selectedCountry && countryCoordinates[selectedCountry]) {
      center = countryCoordinates[selectedCountry];
      zoom = countryZoom;
    } else if (regionCoordinates[selectedRegion]) {
      center = regionCoordinates[selectedRegion];
      zoom = regionZoom;
    } else {
      center = [36.8219, -1.2921]; // Default to Nairobi
      zoom = 5;
    }

    try {
      const mapInstance = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: 'mapbox://styles/mapbox/light-v11',
        center: center,
        zoom: zoom,
        minZoom: 3,
        maxZoom: 15,
        attributionControl: false,
      });

      mapInstance.addControl(new mapboxgl.AttributionControl({
        compact: true
      }), 'bottom-right');

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

        // Add heatmap layer
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

        // Add point layer for better visibility of threat locations
        mapInstance.addLayer({
          id: 'threat-points',
          type: 'circle',
          source: 'threats',
          paint: {
            'circle-radius': 6,
            'circle-color': '#e53e3e',
            'circle-stroke-width': 1,
            'circle-stroke-color': 'white',
            'circle-opacity': 0.7
          }
        });

        setThreatCount(mockThreatData.length);
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

  const handleDataSourceChange = (sourceIds: string[]) => {
    setSelectedDataSources(sourceIds);
    console.log('Data sources changed:', sourceIds);
  };

  const getRecommendedSourcesForCurrentView = () => {
    return getRecommendedDataSources(selectedRegion, 'security')
      .map(source => source.id);
  };

  return (
    <div className="relative h-full">
      <div 
        ref={mapContainerRef} 
        className="w-full rounded-lg overflow-hidden"
        style={{ height }}
      />
      
      {loading && (
        <div className="absolute inset-0 bg-gray-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent"></div>
        </div>
      )}
      
      {enableDataSourceSelection && (
        <div className="absolute top-3 right-3 z-10 flex items-center space-x-2">
          <button
            onClick={() => setShowDataSourceSelector(!showDataSourceSelector)}
            className="bg-white rounded-md shadow-sm px-2 py-1 text-xs flex items-center border border-gray-300"
          >
            <Database className="h-3 w-3 mr-1" />
            Data Sources ({selectedDataSources.length})
          </button>
          
          {selectedDataSources.length > 0 && (
            <button
              onClick={() => setShowDataSourceInfo(!showDataSourceInfo)}
              className="bg-white rounded-md shadow-sm px-2 py-1 text-xs flex items-center border border-gray-300"
            >
              <Info className="h-3 w-3 mr-1" />
              Info
            </button>
          )}
        </div>
      )}
      
      {showDataSourceSelector && (
        <div className="absolute top-12 right-3 z-20 w-80">
          <DataSourceSelector
            selectedSources={selectedDataSources}
            onChange={handleDataSourceChange}
            options={{
              allowMultiple: true,
              requiredTypes: ['security', 'intelligence', 'news', 'social'],
              suggestedSources: getRecommendedSourcesForCurrentView(),
              filterDefaults: {
                types: ['security', 'intelligence', 'news', 'social'],
                minReliability: 70
              }
            }}
            showQualityScore={true}
            className="shadow-lg"
          />
        </div>
      )}
      
      {showDataSourceInfo && (
        <div className="absolute top-12 right-3 z-20 w-80">
          <DataSourceInfoPanel
            dataSourceIds={selectedDataSources}
            onClose={() => setShowDataSourceInfo(false)}
            className="shadow-lg"
          />
        </div>
      )}
      
      <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm p-2 rounded-md shadow-sm border border-gray-200 text-xs">
        <div className="flex items-center text-gray-700">
          <MapPin className="h-3 w-3 mr-1 text-red-500" />
          <span className="font-semibold">{threatCount} Security Alerts</span>
        </div>
        <div className="mt-1 text-gray-500 text-[10px]">
          Last {timeframe} days
        </div>
      </div>
      
      <div className="mt-3 text-xs text-gray-500 flex justify-between items-center">
        <div className="flex items-center">
          <span className="inline-block w-3 h-3 bg-gradient-to-r from-blue-500 via-yellow-500 to-red-500 rounded-full mr-2"></span>
          <span>Low to High Risk Areas</span>
        </div>
        <div>Updated April 3, 2025</div>
      </div>
    </div>
  );
}