import React from 'react';
import Link from 'next/link';
import { Map, AlertTriangle, Shield, Activity, Globe, Zap } from 'lucide-react';

interface RegionStabilityData {
  name: string;
  stabilityIndex: number;
  riskLevel: 'high' | 'medium' | 'low';
  trend: 'improving' | 'stable' | 'deteriorating';
  keyEvent?: string;
}

export default function StabilityIndexAllRegions() {
  // Mock data for regions - in a real app, this would come from an API
  const regionsData: RegionStabilityData[] = [
    { 
      name: 'East Africa', 
      stabilityIndex: 6.1, 
      riskLevel: 'medium',
      trend: 'stable',
      keyEvent: 'Regional Trade Summit Concluded'
    },
    { 
      name: 'North Africa', 
      stabilityIndex: 5.8, 
      riskLevel: 'medium',
      trend: 'improving',
      keyEvent: 'New Economic Reforms Implemented'
    },
    { 
      name: 'West Africa', 
      stabilityIndex: 5.2, 
      riskLevel: 'medium',
      trend: 'deteriorating',
      keyEvent: 'Port Congestion Reported'
    },
    { 
      name: 'Southern Africa', 
      stabilityIndex: 7.3, 
      riskLevel: 'low',
      trend: 'improving',
      keyEvent: 'Regional Infrastructure Partnership Signed'
    },
    { 
      name: 'Central Africa', 
      stabilityIndex: 4.1, 
      riskLevel: 'high',
      trend: 'deteriorating',
      keyEvent: 'Political Tensions Increasing'
    },
    { 
      name: 'Middle East', 
      stabilityIndex: 6.7, 
      riskLevel: 'medium',
      trend: 'stable',
      keyEvent: 'Energy Transition Projects Advancing'
    }
  ];

  // Helper function to get styles based on stability index
  const getStabilityColor = (index: number) => {
    if (index >= 7) return 'text-green-600';
    if (index >= 5) return 'text-yellow-600';
    return 'text-red-600';
  };

  // Helper function to get trend icon and color
  const getTrendIndicator = (trend: 'improving' | 'stable' | 'deteriorating') => {
    switch (trend) {
      case 'improving':
        return { icon: <Zap className="h-4 w-4 text-green-500" />, color: 'text-green-600' };
      case 'stable':
        return { icon: <Activity className="h-4 w-4 text-blue-500" />, color: 'text-blue-600' };
      case 'deteriorating':
        return { icon: <AlertTriangle className="h-4 w-4 text-red-500" />, color: 'text-red-600' };
    }
  };

  // Helper function to get risk level styles
  const getRiskStyles = (level: 'high' | 'medium' | 'low') => {
    switch (level) {
      case 'high':
        return 'bg-red-50 text-red-700 border-red-100';
      case 'medium':
        return 'bg-yellow-50 text-yellow-700 border-yellow-100';
      case 'low':
        return 'bg-green-50 text-green-700 border-green-100';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-bold text-lg text-gray-800 flex items-center">
          <Shield className="h-5 w-5 mr-2 text-blue-600" />
          Stability Index - All Regions
        </h2>
        <Link 
          href="/dashboard/geospatial" 
          className="text-blue-600 text-sm font-medium hover:underline flex items-center"
        >
          <Map className="h-4 w-4 mr-1.5" />
          Geospatial View
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {regionsData.map(region => (
          <div 
            key={region.name}
            className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center mb-2">
              <Globe className="h-5 w-5 text-gray-500 mr-2" />
              <h3 className="font-medium text-gray-800">{region.name}</h3>
            </div>
            
            <div className="flex justify-between items-center mb-3">
              <div>
                <span className="text-sm text-gray-600">Stability Index:</span>
                <span className={`ml-1 font-bold ${getStabilityColor(region.stabilityIndex)}`}>
                  {region.stabilityIndex.toFixed(1)}/10
                </span>
              </div>
              
              <div className="flex items-center">
                <span className="text-sm mr-1">Trend:</span>
                <span className={`flex items-center ${getTrendIndicator(region.trend).color}`}>
                  {getTrendIndicator(region.trend).icon}
                </span>
              </div>
            </div>
            
            <div className="mb-3 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className={`h-full ${
                  region.stabilityIndex >= 7 ? 'bg-green-500' : 
                  region.stabilityIndex >= 5 ? 'bg-yellow-500' : 
                  'bg-red-500'
                }`}
                style={{ width: `${(region.stabilityIndex / 10) * 100}%` }}
              ></div>
            </div>
            
            <div className="flex justify-between items-center">
              <div 
                className={`text-xs font-medium px-2 py-1 rounded-full ${getRiskStyles(region.riskLevel)}`}
              >
                {region.riskLevel.charAt(0).toUpperCase() + region.riskLevel.slice(1)} Risk
              </div>
              
              {region.keyEvent && (
                <div className="text-xs text-gray-500 italic truncate max-w-[60%]" title={region.keyEvent}>
                  {region.keyEvent}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 text-center">
        <div className="inline-flex items-center text-xs text-gray-500">
          <span className="inline-block w-3 h-3 bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 rounded-full mr-2"></span>
          <span>Updated in real-time as events unfold</span>
        </div>
      </div>
    </div>
  );
}