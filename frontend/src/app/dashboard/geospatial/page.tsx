'use client';

import React, { useState, useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import {
  Filter, Target, Activity, Map as MapIcon,
  Info, Layers, Plus, Clock, ChevronLeft, AlertTriangle,
  TrendingUp, Building, MessageSquare, SlidersHorizontal,
  Download, Share2, Eye
} from 'lucide-react';
import DashboardHeader from '@/components/DashboardHeader';
import {
  regions, countriesByRegion, citiesByCountry,
  allCountries, mockLocationData,
  type Region, type Country, type City
} from '@/data/mock/data';
import { FeatureCollection, Geometry, GeoJsonProperties } from 'geojson';

mapboxgl.accessToken = 'pk.eyJ1IjoiZGthcm1haDEiLCJhIjoiY205MDhpMDNpMGp3MzJuc2k5aWdtb2RzaCJ9.ogW0y2fJwQxSPozD4eu-9Q';

// Enhanced GeoJSON data with more test points
const securityIncidentsGeoJSON: FeatureCollection = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [36.8219, -1.2921] // Nairobi
      },
      properties: {
        id: 'sec1',
        title: 'Security incident in Nairobi',
        type: 'Security Incident',
        location: 'Nairobi Area',
        date: '2023-10-15',
        description: 'Minor security incident reported near central business district',
        severity: 'low'
      }
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [39.6682, -4.0435] // Mombasa
      },
      properties: {
        id: 'sec2',
        title: 'Port security alert',
        type: 'Security Incident',
        location: 'Mombasa Port',
        date: '2023-10-10',
        description: 'Security alert at shipping terminal',
        severity: 'medium'
      }
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [34.7619, -0.4167] // Kisumu
      },
      properties: {
        id: 'sec3',
        title: 'Lake region security alert',
        type: 'Security Incident',
        location: 'Kisumu Area',
        date: '2023-10-18',
        description: 'Increased security presence near lake',
        severity: 'medium'
      }
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [35.2833, -0.5167] // Nakuru
      },
      properties: {
        id: 'sec4',
        title: 'Agricultural protest',
        type: 'Security Incident',
        location: 'Nakuru',
        date: '2023-10-20',
        description: 'Farmers protest over prices',
        severity: 'low'
      }
    }
  ]
};

const infrastructureGeoJSON: FeatureCollection = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [39.2, -3.5] // Coastal region
      },
      properties: {
        id: 'inf1',
        title: 'New highway project',
        type: 'Infrastructure Project',
        location: 'Coastal Region',
        status: 'In progress',
        budget: '$120M',
        completion: '2025'
      }
    },
    {
      type: 'Feature',
      geometry: {
        type: 'LineString',
        coordinates: [
          [36.8219, -1.2921], // Nairobi
          [36.9170, -0.2873]  // North toward Mt. Kenya
        ]
      },
      properties: {
        id: 'inf2',
        title: 'Railway expansion',
        type: 'Infrastructure Project',
        location: 'Central Region',
        status: 'Planned',
        budget: '$85M'
      }
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [35.2833, -0.5167] // Nakuru
      },
      properties: {
        id: 'inf3',
        title: 'Water treatment plant',
        type: 'Infrastructure Project',
        location: 'Nakuru',
        status: 'Completed',
        budget: '$45M',
        completion: '2023'
      }
    }
  ]
};

const economicActivityGeoJSON: FeatureCollection = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [36.8144, -1.2834] // Westlands, Nairobi
      },
      properties: {
        id: 'eco1',
        title: 'Business growth center',
        type: 'Economic Activity Spike',
        location: 'Westlands',
        growth: '+12%',
        sector: 'Technology'
      }
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [36.0833, 0.2833] // Thika
      },
      properties: {
        id: 'eco2',
        title: 'Manufacturing hub',
        type: 'Economic Activity Spike',
        location: 'Thika',
        growth: '+8%',
        sector: 'Manufacturing'
      }
    }
  ]
};

const regionBounds: Record<string, [[number, number], [number, number]]> = {
  'East Africa': [[30, -5], [42, 5]],
  'North Africa': [[20, 25], [35, 35]],
  'West Africa': [[-15, 5], [0, 15]],
  'Southern Africa': [[15, -35], [35, -20]],
  'Central Africa': [[10, -5], [30, 10]]
};

type LocationData = {
  type: string;
  country?: string;
  region?: string;
  population: string;
  stabilityIndex: number;
  recentEvents: Array<{
    id: number;
    type: string;
    title: string;
    date: string;
    impact: string;
  }>;
  keyIndicators: {
    [key: string]: string;
  };
};

export default function GeospatialPage() {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const securityLayerRef = useRef<any>(null);
  const infrastructureLayerRef = useRef<any>(null);
  const economicLayerRef = useRef<any>(null);
  const testIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const layerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const [granularity, setGranularity] = useState<'region' | 'country' | 'city'>('region');
  const [selectedRegion, setSelectedRegion] = useState<Region>('East Africa');
  const [selectedCountry, setSelectedCountry] = useState<Country>('');
  const [selectedCity, setSelectedCity] = useState<City>('');
  const [activeLayers, setActiveLayers] = useState(['securityIncidents', 'infrastructure']);
  const [selectedDataPoint, setSelectedDataPoint] = useState<null | { id: string; type: string; location: string }>(null);
  const [showGuide, setShowGuide] = useState(true);
  const [isTesting, setIsTesting] = useState(false);

  const availableCountries = selectedRegion && selectedRegion !== 'All Regions' 
    ? (countriesByRegion[selectedRegion as keyof typeof countriesByRegion] || [] as Country[]) 
    : allCountries;
  const availableCities = selectedCountry 
    ? (citiesByCountry[selectedCountry as keyof typeof citiesByCountry] || [] as City[]) 
    : [];

  const getCurrentLocationName = () => {
    if (granularity === 'city' && selectedCity) return selectedCity;
    if (granularity === 'country' && selectedCountry) return selectedCountry;
    if (granularity === 'region' && selectedRegion) return selectedRegion;
    return 'All Regions';
  };

  const currentLocationName = getCurrentLocationName();
  const locationData: LocationData = 
    mockLocationData[currentLocationName as keyof typeof mockLocationData] || 
    mockLocationData['East Africa' as keyof typeof mockLocationData];

  const testGeospatialExploration = () => {
    if (!map.current) return;
    
    setIsTesting(true);
    
    // Clear any existing intervals
    if (testIntervalRef.current) clearInterval(testIntervalRef.current);
    if (layerIntervalRef.current) clearInterval(layerIntervalRef.current);

    // Test 1: Fly to different locations
    const testLocations = [
      { center: [36.8219, -1.2921] as [number, number], zoom: 10, name: "Nairobi", type: "Capital City" }, // Nairobi
      { center: [39.6682, -4.0435] as [number, number], zoom: 12, name: "Mombasa", type: "Coastal City" }, // Mombasa
      { center: [34.7619, -0.4167] as [number, number], zoom: 9, name: "Kisumu", type: "Lake City" },   // Kisumu
      { center: [37.0833, 0.1667] as [number, number], zoom: 8, name: "Mt. Kenya", type: "Mountain Region" } // Mt. Kenya
    ];

    // Cycle through locations every 3 seconds
    let currentIndex = 0;
    testIntervalRef.current = setInterval(() => {
      const location = testLocations[currentIndex];
      map.current?.flyTo({
        center: location.center,
        zoom: location.zoom,
        essential: true
      });
      
      setSelectedDataPoint({
        id: 'test-' + currentIndex,
        type: 'Test Location: ' + location.type,
        location: location.name
      });
      
      currentIndex = (currentIndex + 1) % testLocations.length;
    }, 3000);

    // Test 2: Toggle layers automatically
    const testLayers = ['securityIncidents', 'economicActivity', 'infrastructure'];
    let layerIndex = 0;
    layerIntervalRef.current = setInterval(() => {
      setActiveLayers([testLayers[layerIndex]]);
      layerIndex = (layerIndex + 1) % testLayers.length;
    }, 3000);
  };

  const stopTest = () => {
    if (testIntervalRef.current) clearInterval(testIntervalRef.current);
    if (layerIntervalRef.current) clearInterval(layerIntervalRef.current);
    testIntervalRef.current = null;
    layerIntervalRef.current = null;
    setIsTesting(false);
    setSelectedDataPoint(null);
  };

  const toggleLayer = (layerId: string) => {
    setActiveLayers(prev =>
      prev.includes(layerId) ? prev.filter(l => l !== layerId) : [...prev, layerId]
    );
  };

  const updateLayerVisibility = () => {
    if (!map.current) return;
    
    // Security incidents layer
    if (securityLayerRef.current) {
      const visibility = activeLayers.includes('securityIncidents') ? 'visible' : 'none';
      map.current.setLayoutProperty(securityLayerRef.current, 'visibility', visibility);
      map.current.setLayoutProperty('security-heatmap', 'visibility', visibility);
    }
    
    // Infrastructure layers
    if (infrastructureLayerRef.current) {
      const visibility = activeLayers.includes('infrastructure') ? 'visible' : 'none';
      infrastructureLayerRef.current.forEach((layerId: string) => {
        map.current?.setLayoutProperty(layerId, 'visibility', visibility);
      });
    }
    
    // Economic activity layer
    if (economicLayerRef.current) {
      const visibility = activeLayers.includes('economicActivity') ? 'visible' : 'none';
      map.current.setLayoutProperty(economicLayerRef.current, 'visibility', visibility);
    }
  };

  useEffect(() => {
    updateLayerVisibility();
  }, [activeLayers]);

  useEffect(() => {
    if (map.current) return;
    
    if (mapContainer.current) {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/light-v11',
        center: [36.8219, -1.2921],
        zoom: 5
      });

      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
      map.current.addControl(new mapboxgl.FullscreenControl(), 'top-right');

      map.current.on('load', () => {
        map.current?.addSource('security-incidents', {
          type: 'geojson',
          data: securityIncidentsGeoJSON
        });

        map.current?.addSource('infrastructure', {
          type: 'geojson',
          data: infrastructureGeoJSON
        });

        map.current?.addSource('economic-activity', {
          type: 'geojson',
          data: economicActivityGeoJSON
        });

        // Add security incidents layer
        map.current?.addLayer({
          id: 'security-incidents-layer',
          type: 'circle',
          source: 'security-incidents',
          paint: {
            'circle-radius': 8,
            'circle-color': '#DC2626',
            'circle-opacity': 0.8,
            'circle-stroke-width': 1,
            'circle-stroke-color': '#FFFFFF'
          }
        });

        // Add heatmap layer for security incidents
        map.current?.addLayer({
          id: 'security-heatmap',
          type: 'heatmap',
          source: 'security-incidents',
          maxzoom: 15,
          paint: {
            'heatmap-weight': [
              'interpolate',
              ['linear'],
              ['get', 'severity'],
              0, 0,
              6, 1
            ],
            'heatmap-intensity': [
              'interpolate',
              ['linear'],
              ['zoom'],
              0, 1,
              9, 3
            ],
            'heatmap-color': [
              'interpolate',
              ['linear'],
              ['heatmap-density'],
              0, 'rgba(33,102,172,0)',
              0.2, 'rgb(103,169,207)',
              0.4, 'rgb(209,229,240)',
              0.6, 'rgb(253,219,199)',
              0.8, 'rgb(239,138,98)',
              1, 'rgb(178,24,43)'
            ],
            'heatmap-radius': [
              'interpolate',
              ['linear'],
              ['zoom'],
              0, 2,
              9, 20
            ],
            'heatmap-opacity': [
              'interpolate',
              ['linear'],
              ['zoom'],
              7, 1,
              9, 0
            ]
          }
        });

        // Add infrastructure layers
        map.current?.addLayer({
          id: 'infrastructure-points-layer',
          type: 'circle',
          source: 'infrastructure',
          filter: ['==', ['geometry-type'], 'Point'],
          paint: {
            'circle-radius': 8,
            'circle-color': '#1D4ED8',
            'circle-opacity': 0.8,
            'circle-stroke-width': 1,
            'circle-stroke-color': '#FFFFFF'
          }
        });

        map.current?.addLayer({
          id: 'infrastructure-lines-layer',
          type: 'line',
          source: 'infrastructure',
          filter: ['==', ['geometry-type'], 'LineString'],
          paint: {
            'line-color': '#1D4ED8',
            'line-width': 3,
            'line-opacity': 0.8
          }
        });

        // Add economic activity layer
        map.current?.addLayer({
          id: 'economic-activity-layer',
          type: 'circle',
          source: 'economic-activity',
          paint: {
            'circle-radius': 8,
            'circle-color': '#F59E0B',
            'circle-opacity': 0.8,
            'circle-stroke-width': 1,
            'circle-stroke-color': '#FFFFFF'
          }
        });

        // Set layer refs
        securityLayerRef.current = 'security-incidents-layer';
        infrastructureLayerRef.current = ['infrastructure-points-layer', 'infrastructure-lines-layer'];
        economicLayerRef.current = 'economic-activity-layer';

        // Set initial layer visibility
        updateLayerVisibility();

        // Add click handlers for all layers
        const layerClickHandler = (e: mapboxgl.MapLayerMouseEvent) => {
          if (e.features && e.features[0]) {
            const properties = e.features[0].properties;
            if (properties) {
              setSelectedDataPoint({
                id: properties.id,
                type: properties.type,
                location: properties.location
              });
            }
          }
        };

        map.current?.on('click', 'security-incidents-layer', layerClickHandler);
        map.current?.on('click', 'infrastructure-points-layer', layerClickHandler);
        map.current?.on('click', 'economic-activity-layer', layerClickHandler);

        // Change cursor on hover
        const pointerEnter = () => {
          if (map.current) map.current.getCanvas().style.cursor = 'pointer';
        };
        const pointerLeave = () => {
          if (map.current) map.current.getCanvas().style.cursor = '';
        };

        map.current?.on('mouseenter', 'security-incidents-layer', pointerEnter);
        map.current?.on('mouseleave', 'security-incidents-layer', pointerLeave);
        map.current?.on('mouseenter', 'infrastructure-points-layer', pointerEnter);
        map.current?.on('mouseleave', 'infrastructure-points-layer', pointerLeave);
        map.current?.on('mouseenter', 'economic-activity-layer', pointerEnter);
        map.current?.on('mouseleave', 'economic-activity-layer', pointerLeave);
      });
    }

    return () => {
      stopTest();
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!map.current) return;

    if (selectedRegion && selectedRegion !== 'All Regions' && regionBounds[selectedRegion as keyof typeof regionBounds]) {
      map.current.fitBounds(regionBounds[selectedRegion as keyof typeof regionBounds], {
        padding: 50,
        duration: 1000
      });
    }
  }, [selectedRegion, selectedCountry, selectedCity, granularity]);

  return (
    <div className="flex flex-col h-full">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-20 flex-shrink-0">
        <DashboardHeader
          title="Geospatial Analysis"
          description="Interactive mapping and spatial analysis tools"
          showInfoTip
          infoTipContent="Analyze geographic data patterns, risks, and opportunities across regions. Combine multiple data layers for comprehensive insights."
          bgColor="white"
          sticky
        >
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600 font-medium">
              Location: {currentLocationName}
            </span>
            <div className="flex border border-gray-200 rounded-md overflow-hidden">
              <button className="p-1.5 hover:bg-gray-100 text-gray-600 border-r border-gray-200">
                <Download className="h-5 w-5" />
              </button>
              <button className="p-1.5 hover:bg-gray-100 text-gray-600">
                <Share2 className="h-5 w-5" />
              </button>
            </div>
          </div>
        </DashboardHeader>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Map Area */}
        <div className="flex-1 relative">
          <div ref={mapContainer} className="absolute inset-0" />

          {/* User Guide Overlay */}
          {showGuide && (
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-white/90 backdrop-blur-sm p-4 rounded-lg shadow-lg border border-blue-200 max-w-lg text-sm z-10">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center">
                  <Info className="h-5 w-5 text-blue-600 mr-2" />
                  <h3 className="font-medium text-blue-900">Getting Started with Geospatial Analysis</h3>
                </div>
                <button 
                  onClick={() => setShowGuide(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ×
                </button>
              </div>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-center">
                  <MapIcon className="h-4 w-4 mr-2 text-blue-500" />
                  Use the granularity controls to zoom between region, country, and city level
                </li>
                <li className="flex items-center">
                  <Layers className="h-4 w-4 mr-2 text-blue-500" />
                  Toggle different data layers to visualize various metrics
                </li>
                <li className="flex items-center">
                  <Target className="h-4 w-4 mr-2 text-blue-500" />
                  Click on map points to view detailed information
                </li>
                <li className="flex items-center">
                  <Plus className="h-4 w-4 mr-2 text-blue-500" />
                  Import your own data to overlay on the map
                </li>
              </ul>
            </div>
          )}

          {/* Details Panel */}
          {selectedDataPoint && (
            <div className="absolute top-4 right-4 w-64 bg-white/90 backdrop-blur-sm p-3 rounded-lg shadow-lg border border-gray-200 z-30">
              <button 
                onClick={() => setSelectedDataPoint(null)} 
                className="absolute top-1 right-1 p-0.5 rounded hover:bg-gray-200"
              >
                <ChevronLeft className="h-4 w-4 text-gray-500"/>
              </button>
              <h4 className="text-sm font-semibold mb-1">{selectedDataPoint.type}</h4>
              <p className="text-xs text-gray-600 mb-2">Location: {selectedDataPoint.location}</p>
              <p className="text-sm text-gray-700">
                {selectedDataPoint.id.startsWith('test-') 
                  ? `Test exploration point showing ${selectedDataPoint.location} features`
                  : `Details: Analysis of point ${selectedDataPoint.id}. Click "View Full Details" for comprehensive information.`}
              </p>
              <button className="text-xs text-blue-600 hover:underline mt-1">
                View Full Details
              </button>
            </div>
          )}

          {/* Location Data Panel */}
          {!selectedDataPoint && locationData && (
            <div className="absolute top-4 left-4 w-64 bg-white/90 backdrop-blur-sm p-3 rounded-lg shadow-lg border border-gray-200 z-30 max-h-[80%] overflow-y-auto">
              <h4 className="text-md font-semibold mb-2 text-gray-800">
                {currentLocationName} ({locationData.type})
              </h4>
              {locationData.country && (
                <p className="text-xs text-gray-500 mb-1">Country: {locationData.country}</p>
              )}
              {locationData.region && (
                <p className="text-xs text-gray-500 mb-2">Region: {locationData.region}</p>
              )}
              
              <div className="mb-3 space-y-1">
                <p className="text-sm">
                  <strong>Population:</strong> {locationData.population}
                </p>
                <p className="text-sm">
                  <strong>Stability Index:</strong> 
                  <span className={`font-medium ${
                    locationData.stabilityIndex > 7 ? 'text-green-600' : 
                    locationData.stabilityIndex > 5 ? 'text-yellow-600' : 
                    'text-red-600'
                  }`}>
                    {locationData.stabilityIndex} / 10
                  </span>
                </p>
              </div>

              <h5 className="text-sm font-medium mb-1 text-gray-700">Key Indicators:</h5>
              <ul className="list-disc list-inside space-y-1 text-xs text-gray-600 mb-3">
                {Object.entries(locationData.keyIndicators).map(([key, value]) => (
                  <li key={key}><strong>{key}:</strong> {value}</li>
                ))}
              </ul>

              <h5 className="text-sm font-medium mb-1 text-gray-700">Recent Events:</h5>
              <ul className="space-y-1 text-xs text-gray-600">
                {locationData.recentEvents.slice(0, 3).map(event => (
                  <li key={event.id} className="border-l-2 pl-1.5 border-gray-300">
                    {event.title} ({event.date})
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Controls Sidebar */}
        <aside className="w-72 bg-white border-l border-gray-200 p-4 overflow-y-auto flex-shrink-0">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">Controls</h2>

          {/* Location Selection */}
          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Granularity
              </label>
              <select 
                value={granularity}
                onChange={(e) => setGranularity(e.target.value as 'region' | 'country' | 'city')}
                className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="region">Region</option>
                <option value="country">Country</option>
                <option value="city">City/District</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Region
              </label>
              <select
                value={selectedRegion}
                onChange={(e) => {
                  setSelectedRegion(e.target.value);
                  setSelectedCountry('');
                  setSelectedCity('');
                }}
                disabled={granularity !== 'region'}
                className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                {regions.map(r => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Country
              </label>
              <select
                value={selectedCountry}
                onChange={(e) => {
                  setSelectedCountry(e.target.value);
                  setSelectedCity('');
                }}
                disabled={granularity !== 'country'}
                className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                <option value="">-- Select Country --</option>
                {availableCountries.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select City/District
              </label>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                disabled={granularity !== 'city'}
                className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                <option value="">-- Select City/District --</option>
                {availableCities.map(ci => (
                  <option key={ci} value={ci}>{ci}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Layer Toggles */}
          <div className="mb-6">
            <h3 className="text-md font-medium text-gray-700 mb-2">Data Layers</h3>
            <div className="space-y-1">
              {[
                { id: 'securityIncidents', label: 'Security Incidents', icon: AlertTriangle, color: 'text-red-500' },
                { id: 'economicActivity', label: 'Economic Activity', icon: TrendingUp, color: 'text-green-500' },
                { id: 'infrastructure', label: 'Infrastructure', icon: Building, color: 'text-blue-500' },
                { id: 'sentiment', label: 'Social Sentiment', icon: MessageSquare, color: 'text-purple-500' },
                { id: 'customData', label: 'Custom Data Layer', icon: Layers, color: 'text-indigo-500' },
              ].map(layer => (
                <label 
                  key={layer.id}
                  htmlFor={layer.id}
                  className="flex items-center p-2 rounded-md hover:bg-gray-50 cursor-pointer group relative"
                >
                  <input
                    type="checkbox"
                    id={layer.id}
                    checked={activeLayers.includes(layer.id)}
                    onChange={() => toggleLayer(layer.id)}
                    className="mr-3 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <layer.icon className={`h-4 w-4 mr-1.5 ${layer.color}`} />
                  <span className="text-sm text-gray-700">{layer.label}</span>
                  
                  <div className="hidden group-hover:block absolute left-full ml-2 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white text-xs rounded p-2 w-48 z-20">
                    Click to toggle visibility of {layer.label.toLowerCase()} data on the map
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Time Slider */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
              <Clock className="h-4 w-4 mr-1.5"/>Time Range
            </label>
            <input 
              type="range" 
              min="0" 
              max="100" 
              defaultValue="80" 
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Past Year</span>
              <span>Now</span>
            </div>
          </div>

          {/* Analysis Tools */}
          <div className="mb-6">
            <h3 className="text-md font-medium text-gray-700 mb-2 flex items-center">
              <Activity className="h-4 w-4 mr-1.5 text-blue-600"/>
              Analysis Tools
            </h3>
            <div className="space-y-2">
              {isTesting ? (
                <button 
                  onClick={stopTest}
                  className="w-full flex items-center justify-between p-2 bg-red-50 hover:bg-red-100 rounded-md text-sm text-red-700"
                >
                  <span className="flex items-center">
                    <Eye className="h-4 w-4 mr-1.5 text-red-600"/>
                    Stop Test Exploration
                  </span>
                  <ChevronLeft className="h-4 w-4 text-red-400" />
                </button>
              ) : (
                <button 
                  onClick={testGeospatialExploration}
                  className="w-full flex items-center justify-between p-2 bg-blue-50 hover:bg-blue-100 rounded-md text-sm text-blue-700"
                >
                  <span className="flex items-center">
                    <Eye className="h-4 w-4 mr-1.5 text-blue-600"/>
                    Test Geospatial Exploration
                  </span>
                  <ChevronLeft className="h-4 w-4 text-blue-400" />
                </button>
              )}
              <button className="w-full flex items-center justify-between p-2 bg-gray-50 hover:bg-gray-100 rounded-md text-sm">
                <span className="flex items-center">
                  <Target className="h-4 w-4 mr-1.5 text-blue-600"/>
                  Hotspot Analysis
                </span>
                <ChevronLeft className="h-4 w-4 text-gray-400" />
              </button>
              <button className="w-full flex items-center justify-between p-2 bg-gray-50 hover:bg-gray-100 rounded-md text-sm">
                <span className="flex items-center">
                  <Activity className="h-4 w-4 mr-1.5 text-blue-600"/>
                  Trend Detection
                </span>
                <ChevronLeft className="h-4 w-4 text-gray-400" />
              </button>
              <button className="w-full flex items-center justify-between p-2 bg-gray-50 hover:bg-gray-100 rounded-md text-sm">
                <span className="flex items-center">
                  <SlidersHorizontal className="h-4 w-4 mr-1.5 text-blue-600"/>
                  Custom Analysis
                </span>
                <ChevronLeft className="h-4 w-4 text-gray-400" />
              </button>
            </div>
          </div>

          {/* Export Options */}
          <div className="border-t border-gray-200 pt-4">
            <div className="flex space-x-2">
              <button className="flex-1 flex items-center justify-center px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50">
                <Download className="h-4 w-4 mr-1.5 text-gray-500"/>
                Export
              </button>
              <button className="flex-1 flex items-center justify-center px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50">
                <Share2 className="h-4 w-4 mr-1.5 text-gray-500"/>
                Share
              </button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}