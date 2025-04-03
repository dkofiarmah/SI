import React, { useState, useEffect, useCallback, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { 
  Globe, Filter, Download, Share2, 
  Zap, MapPin, AlertTriangle, Eye,
  Sliders, Layers, Search, PlusCircle,
  MinusCircle, BarChart2, FileText, 
  ExternalLink, AlertCircle, Database,
  ArrowUp, ArrowDown, ArrowRight
} from 'lucide-react';
import EnhancedDashboardCard from './EnhancedDashboardCard';

// Initialize Mapbox with your access token
mapboxgl.accessToken = 'YOUR_MAPBOX_TOKEN'; // Replace with your actual Mapbox token

interface StabilityMapProps {
  selectedRegion?: string;
  selectedCountry?: string;
}

type RegionStability = {
  id: string;
  region: string;
  score: number;
  trend: 'improving' | 'declining' | 'stable';
  riskLevel: 'Low' | 'Medium' | 'High' | 'Extreme';
  incidents: number;
  sources: number;
  lastUpdated: Date;
  confidence: number;
  coordinates?: [number, number]; // [longitude, latitude]
};

// Region coordinates mapping
const regionCoordinates: Record<string, [number, number]> = {
  'East Africa': [36.8219, -1.2921],      // Kenya/Nairobi area
  'West Africa': [3.3792, 6.5244],        // Nigeria/Lagos area
  'North Africa': [31.2357, 30.0444],     // Egypt/Cairo area
  'Central Africa': [15.2663, -4.4419],   // DRC/Kinshasa area
  'Southern Africa': [28.0473, -26.2041], // South Africa/Johannesburg area
  'Horn of Africa': [38.7578, 9.0222],    // Ethiopia/Addis Ababa area
  'Middle East': [45.0792, 23.8859],      // Saudi Arabia area
  'All Regions': [25.0, 0.0]              // Center of Africa
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
  'Uganda': [32.2903, 0.3476],
  'Rwanda': [30.0587, -1.9403],
  'DRC': [15.2663, -4.4419],
  'Angola': [13.2343, -8.8147],
  'Zimbabwe': [31.0522, -17.8292],
  'Mozambique': [35.5562, -17.8252],
  'Zambia': [28.2826, -15.4067],
  'Botswana': [24.6282, -20.9013],
  'Namibia': [16.5992, -22.5648],
  'Saudi Arabia': [45.0792, 23.8859],
  'UAE': [54.3773, 24.4539]
};

// Default zoom levels
const regionZoom = 4;
const countryZoom = 5.5;
const defaultZoom = 2.8;

export default function StabilityMap({ 
  selectedRegion = 'All Regions', 
  selectedCountry = '' 
}: StabilityMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [activeLayers, setActiveLayers] = useState<string[]>(['political', 'economic']);
  const [viewMode, setViewMode] = useState<'map' | 'heat' | 'list'>('map');
  const [mapView, setMapView] = useState<'standard' | 'satellite' | 'terrain'>('standard');
  const [showLegend, setShowLegend] = useState(true);
  const [selectedRegionData, setSelectedRegionData] = useState<RegionStability | null>(null);
  const [regionsData, setRegionsData] = useState<RegionStability[]>([]);
  const [anomalyDetected, setAnomalyDetected] = useState(false);
  const [showDetailedAnalysis, setShowDetailedAnalysis] = useState(false);
  const [showDataSources, setShowDataSources] = useState(false);
  
  // Data source information
  const dataSources = [
    {
      name: 'World Bank Indicators',
      reliability: 92,
      lastUpdated: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), // 15 days ago
      url: 'https://data.worldbank.org/'
    },
    {
      name: 'Regional Press Analysis',
      reliability: 78,
      lastUpdated: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    },
    {
      name: 'Local Government Reports',
      reliability: 85,
      lastUpdated: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    },
    {
      name: 'Intelligence Network Data',
      reliability: 88,
      lastUpdated: new Date(), // Today
    }
  ];
  
  // Insight recommendations with correct priority type
  const insights = [
    {
      text: anomalyDetected ? 
        `Unusual stability pattern detected in ${regionsData.find(r => r.score < 4.5)?.region || 'Central Africa'}. Recommend closer monitoring.` :
        `${regionsData.filter(r => r.trend === 'improving').length} of ${regionsData.length} regions show improving stability trends this month.`,
      priority: anomalyDetected ? 'high' as const : 'medium' as const,
      actionText: anomalyDetected ? 'View Risk Report' : 'Analyze Trends',
      onAction: () => setShowDetailedAnalysis(true)
    },
    {
      text: 'Historical data suggests potential seasonal variation in Southern Africa stability metrics.',
      priority: 'low' as const,
      actionText: 'View Historical Comparison',
      onAction: () => console.log('Viewing historical comparison')
    }
  ];
  
  // Fetch stability data and initialize the map
  const fetchStabilityData = useCallback(() => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      // Generate random stability data for regions
      const regions = [
        'East Africa', 
        'West Africa', 
        'North Africa', 
        'Southern Africa', 
        'Central Africa',
        'Horn of Africa'
      ];
      
      const newRegionsData: RegionStability[] = regions.map(region => {
        const isSelectedRegion = selectedRegion === region || selectedRegion === 'All Regions';
        
        // Randomize scores but make them more realistic based on region
        let baseScore = 0;
        switch(region) {
          case 'East Africa': baseScore = 6.5; break;
          case 'West Africa': baseScore = 5.8; break;
          case 'North Africa': baseScore = 7.2; break;
          case 'Southern Africa': baseScore = 8.1; break;
          case 'Central Africa': baseScore = 4.6; break;
          case 'Horn of Africa': baseScore = 5.2; break;
          default: baseScore = 6.0;
        }
        
        // Add some randomness but stay within realistic range
        const randomVariation = (Math.random() * 1.4) - 0.7; // -0.7 to +0.7
        const score = Math.min(Math.max(baseScore + randomVariation, 0), 10);
        
        // Determine risk level based on score
        let riskLevel: 'Low' | 'Medium' | 'High' | 'Extreme';
        if (score >= 7.5) riskLevel = 'Low';
        else if (score >= 5.5) riskLevel = 'Medium';
        else if (score >= 3.5) riskLevel = 'High';
        else riskLevel = 'Extreme';
        
        // Determine trend - 20% improving, 20% declining, 60% stable
        const trendRandom = Math.random();
        let trend: 'improving' | 'declining' | 'stable';
        if (trendRandom < 0.2) trend = 'improving';
        else if (trendRandom < 0.4) trend = 'declining';
        else trend = 'stable';
        
        // Generate random incidents count - higher for lower stability
        const incidentsBase = Math.round((10 - score) * 5);
        const incidents = incidentsBase + Math.floor(Math.random() * 10);
        
        // Random sources count between 8 and 25
        const sources = Math.floor(Math.random() * 18) + 8;
        
        // Random confidence level - generally higher for more stable regions
        const confidenceBase = 50 + (score * 3);
        const confidence = Math.min(Math.floor(confidenceBase + (Math.random() * 15)), 98);
        
        // Random last updated time in the past 48 hours
        const lastUpdated = new Date();
        lastUpdated.setHours(lastUpdated.getHours() - (Math.random() * 48));
        
        // Get coordinates for the region
        const coordinates = regionCoordinates[region];
        
        return {
          id: region.toLowerCase().replace(/\s+/g, '-'),
          region,
          score,
          trend,
          riskLevel,
          incidents,
          sources,
          lastUpdated,
          confidence,
          coordinates
        };
      });
      
      setRegionsData(newRegionsData);
      
      // Set selected region data if applicable
      if (selectedRegion !== 'All Regions') {
        const found = newRegionsData.find(r => r.region === selectedRegion);
        if (found) setSelectedRegionData(found);
      } else {
        setSelectedRegionData(null);
      }
      
      setLastUpdated(new Date());
      setAnomalyDetected(Math.random() > 0.7); // 30% chance of anomaly
      setIsLoading(false);
      
      // Update map markers if map is initialized
      if (mapRef.current) {
        updateMapMarkers(newRegionsData);
      }
      
    }, 1500);
  }, [selectedRegion, selectedCountry]);
  
  // Initialize the map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;
    
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
      // Default to center of Africa
      center = [25, 0];
      zoom = defaultZoom;
    }
    
    // Set different map style based on mapView state
    let mapStyle = 'mapbox://styles/mapbox/light-v11'; // Default standard view
    if (mapView === 'satellite') {
      mapStyle = 'mapbox://styles/mapbox/satellite-v9';
    } else if (mapView === 'terrain') {
      mapStyle = 'mapbox://styles/mapbox/outdoors-v12';
    }
    
    // Create new map instance
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: mapStyle,
      center: center,
      zoom: zoom,
      attributionControl: false
    });
    
    // Add zoom and navigation controls
    map.addControl(new mapboxgl.NavigationControl(), 'top-right');
    
    // Save map instance to ref
    mapRef.current = map;
    
    // Add event listeners
    map.on('load', () => {
      // Add a source for the heatmap data
      map.addSource('stability-data', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: []
        }
      });
      
      // Add a heatmap layer
      map.addLayer({
        id: 'stability-heat',
        type: 'heatmap',
        source: 'stability-data',
        paint: {
          'heatmap-weight': [
            'interpolate',
            ['linear'],
            ['get', 'stability'],
            0, 0,
            10, 1
          ],
          'heatmap-intensity': 1,
          'heatmap-color': [
            'interpolate',
            ['linear'],
            ['heatmap-density'],
            0, 'rgba(0, 0, 255, 0)',
            0.2, 'rgb(0, 255, 0)',
            0.4, 'rgb(255, 255, 0)',
            0.6, 'rgb(255, 165, 0)',
            0.8, 'rgb(255, 0, 0)'
          ],
          'heatmap-radius': 30,
          'heatmap-opacity': viewMode === 'heat' ? 0.8 : 0
        }
      });
      
      // Fetch data when map is ready
      fetchStabilityData();
    });
    
    // Cleanup on unmount
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);
  
  // Update map when view mode changes
  useEffect(() => {
    if (!mapRef.current) return;
    
    const updateMapStyle = () => {
      // Update heatmap visibility
      mapRef.current?.setPaintProperty(
        'stability-heat',
        'heatmap-opacity',
        viewMode === 'heat' ? 0.8 : 0
      );
      
      // Update markers visibility (handled in updateMapMarkers)
      updateMapMarkers(regionsData);
    };

    // Check if style is loaded
    if (mapRef.current.isStyleLoaded()) {
      updateMapStyle();
    } else {
      mapRef.current.once('style.load', updateMapStyle);
    }
  }, [viewMode, regionsData]);
  
  // Update map style when mapView changes
  useEffect(() => {
    if (!mapRef.current) return;
    
    // Set different map style based on mapView state
    let mapStyle = 'mapbox://styles/mapbox/light-v11'; // Default standard view
    if (mapView === 'satellite') {
      mapStyle = 'mapbox://styles/mapbox/satellite-v9';
    } else if (mapView === 'terrain') {
      mapStyle = 'mapbox://styles/mapbox/outdoors-v12';
    }
    
    mapRef.current.setStyle(mapStyle);
  }, [mapView]);
  
  // Update map center and zoom when selected region/country changes
  useEffect(() => {
    if (!mapRef.current) return;
    
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
      // Default to center of Africa
      center = [25, 0];
      zoom = defaultZoom;
    }
    
    mapRef.current.flyTo({
      center: center,
      zoom: zoom,
      essential: true,
      duration: 1500
    });
    
    // Fetch new data for the selected region/country
    fetchStabilityData();
    
  }, [selectedRegion, selectedCountry, fetchStabilityData]);
  
  // Update map markers
  const updateMapMarkers = (data: RegionStability[]) => {
    if (!mapRef.current) return;
    
    // Remove existing markers
    const markersToRemove = document.querySelectorAll('.stability-marker');
    markersToRemove.forEach(marker => marker.remove());
    
    if (viewMode === 'map') {
      // Add new markers
      data.forEach(region => {
        if (!region.coordinates) return;
        
        // Create marker element
        const markerEl = document.createElement('div');
        markerEl.className = 'stability-marker';
        markerEl.style.width = '20px';
        markerEl.style.height = '20px';
        markerEl.style.borderRadius = '50%';
        
        // Set marker color based on stability score
        if (region.score >= 7.5) {
          markerEl.style.backgroundColor = 'rgba(34, 197, 94, 0.8)'; // Green
        } else if (region.score >= 5.5) {
          markerEl.style.backgroundColor = 'rgba(234, 179, 8, 0.8)'; // Yellow
        } else if (region.score >= 3.5) {
          markerEl.style.backgroundColor = 'rgba(249, 115, 22, 0.8)'; // Orange
        } else {
          markerEl.style.backgroundColor = 'rgba(239, 68, 68, 0.8)'; // Red
        }
        
        // Add animation for incidents
        if (region.incidents > 10) {
          const pulseEl = document.createElement('div');
          pulseEl.className = 'stability-marker-pulse';
          pulseEl.style.width = '100%';
          pulseEl.style.height = '100%';
          pulseEl.style.borderRadius = '50%';
          pulseEl.style.backgroundColor = markerEl.style.backgroundColor;
          pulseEl.style.position = 'absolute';
          pulseEl.style.top = '0';
          pulseEl.style.left = '0';
          pulseEl.style.animation = 'pulse 1.5s ease-out infinite';
          markerEl.appendChild(pulseEl);
          
          // Add pulse animation style
          if (!document.getElementById('pulse-animation')) {
            const style = document.createElement('style');
            style.id = 'pulse-animation';
            style.innerHTML = `
              @keyframes pulse {
                0% { opacity: 1; transform: scale(1); }
                100% { opacity: 0; transform: scale(2.5); }
              }
            `;
            document.head.appendChild(style);
          }
        }
        
        // Inner circle with number of incidents
        const innerEl = document.createElement('div');
        innerEl.className = 'stability-marker-inner';
        innerEl.style.width = '16px';
        innerEl.style.height = '16px';
        innerEl.style.borderRadius = '50%';
        innerEl.style.backgroundColor = 'white';
        innerEl.style.position = 'absolute';
        innerEl.style.top = '2px';
        innerEl.style.left = '2px';
        innerEl.style.display = 'flex';
        innerEl.style.alignItems = 'center';
        innerEl.style.justifyContent = 'center';
        innerEl.style.fontSize = '8px';
        innerEl.style.fontWeight = 'bold';
        innerEl.style.color = '#333';
        innerEl.textContent = region.incidents.toString();
        markerEl.appendChild(innerEl);
        
        // Add marker to map
        const marker = new mapboxgl.Marker(markerEl)
          .setLngLat(region.coordinates)
          .addTo(mapRef.current!);
        
        // Add popup
        const popup = new mapboxgl.Popup({
          closeButton: false,
          closeOnClick: false,
          offset: 15
        });
        
        markerEl.addEventListener('mouseenter', () => {
          popup.setLngLat(region.coordinates!)
            .setHTML(`
              <div style="font-family: sans-serif; padding: 5px;">
                <div style="font-weight: bold; margin-bottom: 4px;">${region.region}</div>
                <div>Stability: <b>${region.score.toFixed(1)}/10</b></div>
                <div>Risk Level: <b>${region.riskLevel}</b></div>
                <div>Incidents: <b>${region.incidents}</b></div>
              </div>
            `)
            .addTo(mapRef.current!);
        });
        
        markerEl.addEventListener('mouseleave', () => {
          popup.remove();
        });
        
        markerEl.addEventListener('click', () => {
          setSelectedRegionData(region);
        });
      });
    }
    
    // Update GeoJSON for heatmap
    if (mapRef.current.getSource('stability-data')) {
      const features = data.map(region => {
        if (!region.coordinates) return null;
        return {
          type: 'Feature',
          properties: {
            stability: region.score,
            incidents: region.incidents,
            region: region.region
          },
          geometry: {
            type: 'Point',
            coordinates: region.coordinates
          }
        };
      }).filter(Boolean);
      
      (mapRef.current.getSource('stability-data') as mapboxgl.GeoJSONSource).setData({
        type: 'FeatureCollection',
        features: features as any
      });
    }
  };
  
  // Toggle map layer
  const toggleLayer = (layer: string) => {
    setActiveLayers(prev => 
      prev.includes(layer) 
        ? prev.filter(l => l !== layer)
        : [...prev, layer]
    );
  };
  
  // Zoom controls
  const zoomIn = () => {
    if (mapRef.current) {
      mapRef.current.zoomIn();
    }
  };
  
  const zoomOut = () => {
    if (mapRef.current) {
      mapRef.current.zoomOut();
    }
  };
  
  const resetZoom = () => {
    if (mapRef.current) {
      mapRef.current.flyTo({
        center: regionCoordinates[selectedRegion] || [25, 0],
        zoom: selectedRegion === 'All Regions' ? defaultZoom : regionZoom,
        essential: true,
        duration: 1000
      });
    }
  };
  
  // Calculate average stability score
  const averageStabilityScore = regionsData.length > 0
    ? regionsData.reduce((sum, region) => sum + region.score, 0) / regionsData.length
    : 0;
  
  // Determine overall trend
  const improvingRegions = regionsData.filter(r => r.trend === 'improving').length;
  const decliningRegions = regionsData.filter(r => r.trend === 'declining').length;
  let overallTrend: 'up' | 'down' | 'stable' = 'stable';
  
  if (improvingRegions > decliningRegions && improvingRegions > regionsData.length / 3) {
    overallTrend = 'up';
  } else if (decliningRegions > improvingRegions && decliningRegions > regionsData.length / 3) {
    overallTrend = 'down';
  }
  
  // Calculate percent change for trend (simulated)
  const percentChange = overallTrend === 'up' ? Math.round(Math.random() * 10 + 5) :
    overallTrend === 'down' ? -Math.round(Math.random() * 10 + 5) : 0;
  
  // Create trend data for the card
  const trendData = {
    direction: overallTrend,
    value: averageStabilityScore.toFixed(1),
    label: 'stability index',
    percentChange: percentChange,
    comparedTo: 'previous quarter'
  };
  
  // Raw data information for download
  const rawData = {
    available: true,
    recordCount: regionsData.length * 15,
    downloadUrl: '#download-stability-data',
    sampleData: {
      region: 'East Africa',
      timestamp: new Date().toISOString(),
      score: 6.5
    }
  };
  
  // Additional card actions
  const cardActions = (
    <>
      <button className="w-full text-left px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100 rounded flex items-center">
        <Download className="h-3.5 w-3.5 mr-2 text-gray-500" />
        Export Map Data
      </button>
      <button className="w-full text-left px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100 rounded flex items-center">
        <Share2 className="h-3.5 w-3.5 mr-2 text-gray-500" />
        Share Analysis
      </button>
      <button className="w-full text-left px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100 rounded flex items-center">
        <Search className="h-3.5 w-3.5 mr-2 text-gray-500" />
        Find Location
      </button>
      <button className="w-full text-left px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100 rounded flex items-center">
        <FileText className="h-3.5 w-3.5 mr-2 text-gray-500" />
        Generate Report
      </button>
      <div className="border-t border-gray-100 my-1"></div>
      <button className="w-full text-left px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100 rounded flex items-center">
        <Sliders className="h-3.5 w-3.5 mr-2 text-gray-500" />
        Advanced Settings
      </button>
    </>
  );
  
  // Metric description for tooltips
  const metricDescription = "The Stability Index measures overall regional stability on a scale of 0-10. It combines political, economic, social, and security factors from multiple data sources. Higher scores indicate greater stability.";
  
  // Benchmarks for context
  const benchmarks = [
    { label: "Global Average", value: "6.2" },
    { label: "African Average", value: "5.7" },
    { label: "High Income Regions", value: "8.4" },
    { label: "Post-Conflict Zones", value: "3.2" }
  ];
  
  // Detailed analysis section
  const renderDetailedAnalysis = () => {
    if (!showDetailedAnalysis) return null;
    
    return (
      <div className="mt-4 bg-gray-50 border border-gray-200 rounded-lg p-4">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-medium text-gray-800">Detailed Stability Analysis</h3>
          <button 
            onClick={() => setShowDetailedAnalysis(false)}
            className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-200"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Regional Trend Analysis</h4>
            <div className="grid grid-cols-3 gap-3">
              {regionsData.map((region, idx) => (
                <div key={idx} className="border border-gray-200 rounded p-2 bg-white">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-800">{region.region}</span>
                    <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                      region.riskLevel === 'Low' ? 'bg-green-100 text-green-800' :
                      region.riskLevel === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                      region.riskLevel === 'High' ? 'bg-orange-100 text-orange-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {region.riskLevel}
                    </span>
                  </div>
                  <div className="mt-1.5 flex justify-between items-center text-sm">
                    <div>Score: <span className="font-medium">{region.score.toFixed(1)}</span></div>
                    <div className="flex items-center">
                      {region.trend === 'improving' && <ArrowUp className="h-3 w-3 text-green-500 mr-1" />}
                      {region.trend === 'declining' && <ArrowDown className="h-3 w-3 text-red-500 mr-1" />}
                      {region.trend === 'stable' && <ArrowRight className="h-3 w-3 text-gray-500 mr-1" />}
                      <span className="capitalize text-xs">
                        {region.trend}
                      </span>
                    </div>
                  </div>
                  <div className="w-full h-1.5 bg-gray-200 rounded-full mt-1.5 overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${
                        region.score >= 7.5 ? 'bg-green-500' :
                        region.score >= 5.5 ? 'bg-yellow-500' :
                        region.score >= 3.5 ? 'bg-orange-500' :
                        'bg-red-500'
                      }`}
                      style={{ width: `${region.score * 10}%` }}
                    ></div>
                  </div>
                  <div className="mt-1.5 grid grid-cols-2 gap-1 text-xs text-gray-600">
                    <div>Incidents: {region.incidents}</div>
                    <div>Confidence: {region.confidence}%</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Key Factors Affecting Stability</h4>
            <ul className="text-sm space-y-1.5 pl-5 list-disc text-gray-700">
              <li>Political transitions in East and West Africa regions</li>
              <li>Economic growth and trade developments across the continent</li>
              <li>Climate-related challenges affecting agricultural productivity</li>
              <li>International investments in infrastructure development</li>
              <li>Security operations and cross-border cooperation initiatives</li>
            </ul>
          </div>
          
          <div className="flex justify-end gap-3">
            <button className="px-3 py-1.5 border border-gray-300 rounded text-sm hover:bg-gray-50 text-gray-700">
              Download Full Analysis
            </button>
            <button className="px-3 py-1.5 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">
              Share Report
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  return (
    <EnhancedDashboardCard
      title="Stability Index Map"
      icon={<Globe className="h-5 w-5 text-blue-600" />}
      lastUpdated={lastUpdated}
      status={anomalyDetected ? 'warning' : 'normal'}
      trend={trendData}
      isLoading={isLoading}
      refreshInterval={120}
      onRefresh={fetchStabilityData}
      infoTooltip="The Stability Index Map provides real-time stability scores across regions. Scores range from 0-10, with higher values indicating greater stability."
      actions={cardActions}
      isCollapsible={true}
      onFullScreenToggle={() => console.log('Toggle fullscreen for Stability Map')}
      allowFavorite={true}
      className="overflow-hidden"
      // New enhanced props
      insights={insights}
      dataSources={dataSources}
      dataFreshnessCritical={true}
      rawData={rawData}
      metricDescription={metricDescription}
      benchmarks={benchmarks}
      isRealTime={false}
      shareableLink="https://example.com/stability-map/share/abc123"
      alertThreshold={4.0}
    >
      {/* View Mode Selector */}
      <div className="flex items-center gap-2 mb-4">
        <div className="bg-gray-100 rounded-md flex p-1">
          <button 
            onClick={() => setViewMode('map')}
            className={`px-3 py-1.5 rounded text-sm font-medium ${viewMode === 'map' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-700'}`}
          >
            Map View
          </button>
          <button 
            onClick={() => setViewMode('heat')}
            className={`px-3 py-1.5 rounded text-sm font-medium ${viewMode === 'heat' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-700'}`}
          >
            Heatmap
          </button>
          <button 
            onClick={() => setViewMode('list')}
            className={`px-3 py-1.5 rounded text-sm font-medium ${viewMode === 'list' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-700'}`}
          >
            List View
          </button>
        </div>
        
        {viewMode !== 'list' && (
          <div className="bg-gray-100 rounded-md flex p-1 ml-auto">
            <button 
              onClick={() => setMapView('standard')}
              className={`px-3 py-1.5 rounded text-xs ${mapView === 'standard' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-700'}`}
              title="Standard Map"
            >
              Standard
            </button>
            <button 
              onClick={() => setMapView('satellite')}
              className={`px-3 py-1.5 rounded text-xs ${mapView === 'satellite' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-700'}`}
              title="Satellite View"
            >
              Satellite
            </button>
            <button 
              onClick={() => setMapView('terrain')}
              className={`px-3 py-1.5 rounded text-xs ${mapView === 'terrain' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-700'}`}
              title="Terrain View"
            >
              Terrain
            </button>
          </div>
        )}
      </div>
      
      {/* Map View */}
      {viewMode !== 'list' && (
        <div className="relative rounded-lg overflow-hidden border border-gray-200 bg-gray-50 h-[400px]">
          {/* Mapbox Map Container */}
          <div ref={mapContainerRef} className="w-full h-full" />
          
          {/* Loading overlay */}
          {isLoading && (
            <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center z-10">
              <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
                <p className="mt-2 text-sm text-gray-600">Loading stability data...</p>
              </div>
            </div>
          )}
          
          {/* Controls Overlay */}
          <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
            <button 
              onClick={zoomIn}
              className="p-1.5 bg-white rounded-md shadow-sm hover:bg-gray-50"
              title="Zoom In"
            >
              <PlusCircle className="h-4 w-4 text-gray-700" />
            </button>
            <button 
              onClick={zoomOut}
              className="p-1.5 bg-white rounded-md shadow-sm hover:bg-gray-50"
              title="Zoom Out"
            >
              <MinusCircle className="h-4 w-4 text-gray-700" />
            </button>
            <button 
              onClick={resetZoom}
              className="p-1.5 bg-white rounded-md shadow-sm hover:bg-gray-50"
              title="Reset Zoom"
            >
              <Zap className="h-4 w-4 text-gray-700" />
            </button>
            <div className="h-px bg-gray-200 my-1"></div>
            <button 
              onClick={() => setShowLegend(!showLegend)}
              className={`p-1.5 rounded-md shadow-sm hover:bg-gray-50 ${showLegend ? 'bg-blue-50 text-blue-600' : 'bg-white text-gray-700'}`}
              title={showLegend ? "Hide Legend" : "Show Legend"}
            >
              <Layers className="h-4 w-4" />
            </button>
          </div>
          
          {/* Layers Control */}
          <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm p-2 rounded-md shadow-sm border border-gray-200 z-10">
            <div className="text-xs font-medium mb-1.5 text-gray-700">Layers:</div>
            <div className="space-y-1">
              <label className="flex items-center text-xs">
                <input 
                  type="checkbox" 
                  checked={activeLayers.includes('political')}
                  onChange={() => toggleLayer('political')}
                  className="mr-1.5 h-3 w-3"
                />
                Political Stability
              </label>
              <label className="flex items-center text-xs">
                <input 
                  type="checkbox" 
                  checked={activeLayers.includes('economic')}
                  onChange={() => toggleLayer('economic')}
                  className="mr-1.5 h-3 w-3"
                />
                Economic Indicators
              </label>
              <label className="flex items-center text-xs">
                <input 
                  type="checkbox" 
                  checked={activeLayers.includes('security')}
                  onChange={() => toggleLayer('security')}
                  className="mr-1.5 h-3 w-3"
                />
                Security Incidents
              </label>
            </div>
          </div>
          
          {/* Legend */}
          {showLegend && (
            <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm p-2 rounded-md shadow-sm border border-gray-200 z-10">
              <div className="text-xs font-medium mb-1.5 text-gray-700">
                Stability Index:
              </div>
              <div className="flex items-center gap-1 h-4">
                <div className="w-16 h-2 bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 rounded"></div>
                <div className="flex justify-between text-xs text-gray-600 w-16">
                  <span>0</span>
                  <span>10</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-x-2 gap-y-1 mt-1 text-xs">
                <div className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-red-500 mr-1"></div>
                  <span>High Risk</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-yellow-500 mr-1"></div>
                  <span>Medium Risk</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-green-500 mr-1"></div>
                  <span>Low Risk</span>
                </div>
                {viewMode === 'map' && (
                  <div className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-blue-500 mr-1"></div>
                    <span>Selected</span>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* Region Info Overlay */}
          {selectedRegionData && (
            <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm p-3 rounded-md shadow-sm border border-gray-200 max-w-xs z-10">
              <h3 className="font-medium text-sm flex items-start gap-1.5">
                <MapPin className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5" />
                <span>{selectedRegionData.region}</span>
              </h3>
              
              <div className="flex justify-between items-center mt-2">
                <div className="text-sm">Stability Score:</div>
                <div className="font-medium text-sm flex items-center gap-1">
                  {selectedRegionData.score.toFixed(1)} / 10
                  {selectedRegionData.trend === 'improving' && <ArrowUp className="h-3 w-3 text-green-500" />}
                  {selectedRegionData.trend === 'declining' && <ArrowDown className="h-3 w-3 text-red-500" />}
                </div>
              </div>
              
              <div className="w-full h-2 bg-gray-200 rounded-full mt-1 overflow-hidden">
                <div 
                  className={`h-full rounded-full ${
                    selectedRegionData.score >= 7.5 ? 'bg-green-500' :
                    selectedRegionData.score >= 5.5 ? 'bg-yellow-500' :
                    selectedRegionData.score >= 3.5 ? 'bg-orange-500' :
                    'bg-red-500'
                  }`}
                  style={{ width: `${selectedRegionData.score * 10}%` }}
                ></div>
              </div>
              
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>High Risk</span>
                <span>Low Risk</span>
              </div>
              
              <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-2 text-sm">
                <div>
                  <span className="text-gray-500 text-xs">Risk Level:</span>
                  <div className={`font-medium ${
                    selectedRegionData.riskLevel === 'Low' ? 'text-green-700' :
                    selectedRegionData.riskLevel === 'Medium' ? 'text-yellow-700' :
                    selectedRegionData.riskLevel === 'High' ? 'text-orange-700' :
                    'text-red-700'
                  }`}>
                    {selectedRegionData.riskLevel}
                  </div>
                </div>
                <div>
                  <span className="text-gray-500 text-xs">Incidents:</span>
                  <div className="font-medium">{selectedRegionData.incidents}</div>
                </div>
                <div>
                  <span className="text-gray-500 text-xs">Data Sources:</span>
                  <div className="font-medium">{selectedRegionData.sources}</div>
                </div>
                <div>
                  <span className="text-gray-500 text-xs">Confidence:</span>
                  <div className="font-medium">{selectedRegionData.confidence}%</div>
                </div>
              </div>
              
              <button className="mt-3 w-full py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm flex items-center justify-center">
                <Eye className="h-3.5 w-3.5 mr-1.5" />
                View Detailed Report
              </button>
            </div>
          )}
        </div>
      )}
      
      {/* List View */}
      {viewMode === 'list' && (
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Region
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stability Score
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Risk Level
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trend
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Incidents
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Confidence
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {regionsData.map((region) => (
                <tr key={region.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2.5 whitespace-nowrap">
                    <div className="font-medium text-sm text-gray-800">{region.region}</div>
                  </td>
                  <td className="px-4 py-2.5 whitespace-nowrap">
                    <div className="flex items-center">
                      <div 
                        className={`h-2 w-10 rounded-full mr-2 ${
                          region.score >= 7.5 ? 'bg-green-500' :
                          region.score >= 5.5 ? 'bg-yellow-500' :
                          region.score >= 3.5 ? 'bg-orange-500' :
                          'bg-red-500'
                        }`}
                      ></div>
                      <span className="text-sm">{region.score.toFixed(1)}</span>
                    </div>
                  </td>
                  <td className="px-4 py-2.5 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      region.riskLevel === 'Low' ? 'bg-green-100 text-green-800' :
                      region.riskLevel === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                      region.riskLevel === 'High' ? 'bg-orange-100 text-orange-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {region.riskLevel}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 whitespace-nowrap">
                    <div className="flex items-center">
                      {region.trend === 'improving' && <ArrowUp className="h-4 w-4 text-green-500 mr-1" />}
                      {region.trend === 'declining' && <ArrowDown className="h-4 w-4 text-red-500 mr-1" />}
                      {region.trend === 'stable' && <ArrowRight className="h-4 w-4 text-gray-500 mr-1" />}
                      <span className="text-sm capitalize">{region.trend}</span>
                    </div>
                  </td>
                  <td className="px-4 py-2.5 whitespace-nowrap text-sm">
                    {region.incidents}
                  </td>
                  <td className="px-4 py-2.5 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${
                            region.confidence >= 80 ? 'bg-green-500' :
                            region.confidence >= 60 ? 'bg-yellow-500' :
                            'bg-red-500'
                          }`}
                          style={{ width: `${region.confidence}%` }}
                        ></div>
                      </div>
                      <span className="text-sm ml-2">{region.confidence}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      {/* Detailed Analysis */}
      {renderDetailedAnalysis()}
      
      {/* Summary Stats */}
      <div className="mt-4 grid grid-cols-4 gap-4">
        <div className="bg-blue-50 rounded-lg p-3 border border-blue-100">
          <div className="text-xs text-blue-700">Average Stability</div>
          <div className="text-xl font-medium text-blue-700 mt-1 flex items-center">
            {averageStabilityScore.toFixed(1)}
            <span className="text-xs ml-1">/ 10</span>
          </div>
        </div>
        <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
          <div className="text-xs text-gray-700">Regions Monitored</div>
          <div className="text-xl font-medium text-gray-700 mt-1">{regionsData.length}</div>
        </div>
        <div className={`rounded-lg p-3 border ${
          improvingRegions > decliningRegions ? 'bg-green-50 border-green-100' :
          decliningRegions > improvingRegions ? 'bg-red-50 border-red-100' :
          'bg-yellow-50 border-yellow-100'
        }`}>
          <div className={`text-xs ${
            improvingRegions > decliningRegions ? 'text-green-700' :
            decliningRegions > improvingRegions ? 'text-red-700' :
            'text-yellow-700'
          }`}>Regional Trends</div>
          <div className={`text-xl font-medium mt-1 ${
            improvingRegions > decliningRegions ? 'text-green-700' :
            decliningRegions > improvingRegions ? 'text-red-700' :
            'text-yellow-700'
          }`}>
            {improvingRegions > decliningRegions ? `${improvingRegions} Improving` :
            decliningRegions > improvingRegions ? `${decliningRegions} Declining` :
            'Stable'}
          </div>
        </div>
        <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
          <div className="text-xs text-gray-700">Total Incidents</div>
          <div className="text-xl font-medium text-gray-700 mt-1 flex items-center">
            {regionsData.reduce((sum, region) => sum + region.incidents, 0)}
            <AlertTriangle className="h-4 w-4 ml-1 text-yellow-500" />
          </div>
        </div>
      </div>
      
      {/* Anomaly Warning (only if detected) */}
      {anomalyDetected && !showDetailedAnalysis && (
        <div className="mt-4 bg-yellow-50 rounded-lg p-3 border border-yellow-200">
          <div className="flex items-start">
            <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5 mr-2 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-yellow-800">Stability Anomaly Detected</h4>
              <p className="text-sm text-yellow-700 mt-1">
                Unusual stability fluctuations detected in {regionsData.find(r => r.score < 4.5)?.region || 'multiple regions'}. This may indicate emerging risks that require immediate attention.
              </p>
              <div className="mt-2 flex gap-2">
                <button 
                  onClick={() => setShowDetailedAnalysis(true)}
                  className="bg-yellow-200 hover:bg-yellow-300 text-yellow-800 px-3 py-1 rounded text-sm inline-flex items-center"
                >
                  <Zap className="h-3.5 w-3.5 mr-1.5" />
                  Run In-Depth Analysis
                </button>
                <button className="bg-white border border-yellow-300 hover:bg-yellow-50 text-yellow-800 px-3 py-1 rounded text-sm inline-flex items-center">
                  <Eye className="h-3.5 w-3.5 mr-1.5" />
                  View Detected Patterns
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Chart Preview */}
      <div className="mt-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-gray-700 flex items-center">
            <BarChart2 className="h-4 w-4 mr-1.5 text-blue-600" />
            Stability Trends (6 Months)
          </h3>
          <button className="text-xs text-blue-600 hover:underline">View Full Chart</button>
        </div>
        <div className="h-24 bg-gray-50 rounded-lg border border-gray-200 flex items-end justify-between px-6 py-3">
          {/* Simple bar chart visualization */}
          {regionsData.map((region, idx) => (
            <div key={idx} className="flex flex-col items-center">
              <div 
                className={`w-8 rounded-t ${
                  region.score >= 7.5 ? 'bg-green-400' :
                  region.score >= 5.5 ? 'bg-yellow-400' :
                  region.score >= 3.5 ? 'bg-orange-400' :
                  'bg-red-400'
                }`}
                style={{ height: `${Math.max(region.score * 6, 5)}px` }}
              ></div>
              <span className="text-xs mt-1 text-gray-500">{region.region.split(' ')[0]}</span>
            </div>
          ))}
        </div>
      </div>
      
      {/* Data reliability and sources note */}
      <div className="mt-4 border-t border-gray-100 pt-3">
        <div className="flex justify-between items-center text-xs text-gray-500">
          <div className="flex items-center">
            <div className="flex items-center mr-3">
              <div className="w-2 h-2 rounded-full bg-green-500 mr-1.5"></div>
              <span>Verified data</span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 rounded-full bg-yellow-500 mr-1.5"></div>
              <span>Preliminary data</span>
            </div>
          </div>
          <button 
            onClick={() => setShowDataSources(true)}
            className="text-blue-600 hover:underline flex items-center"
          >
            <Database className="h-3 w-3 mr-1" />
            Data sources info
          </button>
        </div>
      </div>
    </EnhancedDashboardCard>
  );
}

// Add X component if it's not imported from lucide-react
export const X = ({ className = "h-6 w-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 6 6 18"></path>
    <path d="m6 6 12 12"></path>
  </svg>
);
