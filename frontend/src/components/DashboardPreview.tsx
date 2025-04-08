import React from 'react';
import { AlertTriangle, BarChart3, Globe, MapPin, PieChart } from 'lucide-react';

export default function DashboardPreview() {
  return (
    <div className="w-full h-full bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
      {/* Dashboard Header */}
      <div className="bg-blue-600 p-3 text-white flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Globe className="h-5 w-5" />
          <span className="font-semibold">Savannah Intel Dashboard</span>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <span className="px-2 py-1 bg-blue-700 rounded">East Africa</span>
          <span className="px-2 py-1 bg-blue-700 rounded">West Africa</span>
          <span className="px-2 py-1 bg-blue-700 rounded">North Africa</span>
        </div>
      </div>
      
      {/* Dashboard Content */}
      <div className="grid grid-cols-12 gap-3 p-3 bg-gray-50 h-full">
        {/* Map Panel */}
        <div className="col-span-7 bg-white rounded border border-gray-200 p-2 flex flex-col">
          <div className="text-sm font-medium text-gray-700 flex items-center gap-1 mb-2">
            <MapPin className="h-4 w-4 text-blue-600" />
            <span>Regional Intelligence Map</span>
          </div>
          <div className="flex-grow bg-blue-50 rounded relative">
            {/* Map Visualization Mockup */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative w-4/5 h-4/5">
                <div className="absolute w-24 h-24 rounded-full bg-red-400 opacity-20 top-1/4 left-1/4"></div>
                <div className="absolute w-32 h-32 rounded-full bg-yellow-400 opacity-20 top-1/3 right-1/4"></div>
                <div className="absolute w-20 h-20 rounded-full bg-blue-400 opacity-20 bottom-1/4 right-1/3"></div>
                <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="absolute top-1/3 right-1/4 w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="absolute bottom-1/4 right-1/3 w-3 h-3 bg-blue-500 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Right Panel */}
        <div className="col-span-5 flex flex-col gap-3">
          {/* Alerts Panel */}
          <div className="bg-white rounded border border-gray-200 p-2">
            <div className="text-sm font-medium text-gray-700 flex items-center gap-1 mb-2">
              <AlertTriangle className="h-4 w-4 text-amber-500" />
              <span>Critical Alerts</span>
            </div>
            <div className="space-y-2">
              <div className="bg-red-50 p-2 rounded text-xs border-l-2 border-red-500">
                Security incident reported in Nairobi (High Risk)
              </div>
              <div className="bg-amber-50 p-2 rounded text-xs border-l-2 border-amber-500">
                Election protests scheduled for Lagos (Medium Risk)
              </div>
            </div>
          </div>
          
          {/* Economic Panel */}
          <div className="bg-white rounded border border-gray-200 p-2 flex-grow">
            <div className="text-sm font-medium text-gray-700 flex items-center gap-1 mb-2">
              <BarChart3 className="h-4 w-4 text-green-600" />
              <span>Economic Indicators</span>
            </div>
            <div className="flex items-end justify-between h-24 px-2">
              <div className="flex flex-col items-center">
                <div className="w-6 bg-blue-400 rounded-t h-10"></div>
                <span className="text-xs mt-1 text-gray-600">Q1</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-6 bg-blue-500 rounded-t h-16"></div>
                <span className="text-xs mt-1 text-gray-600">Q2</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-6 bg-blue-600 rounded-t h-8"></div>
                <span className="text-xs mt-1 text-gray-600">Q3</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-6 bg-blue-700 rounded-t h-20"></div>
                <span className="text-xs mt-1 text-gray-600">Q4</span>
              </div>
            </div>
          </div>
          
          {/* Stability Panel */}
          <div className="bg-white rounded border border-gray-200 p-2">
            <div className="text-sm font-medium text-gray-700 flex items-center gap-1 mb-2">
              <PieChart className="h-4 w-4 text-indigo-600" />
              <span>Stability Index</span>
            </div>
            <div className="flex justify-between items-center px-4">
              <div className="flex flex-col items-center">
                <div className="h-4 w-16 rounded-full bg-gradient-to-r from-red-500 to-green-500"></div>
                <span className="text-xs mt-1 text-gray-600">East Africa</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="h-4 w-16 rounded-full bg-gradient-to-r from-yellow-500 to-green-500"></div>
                <span className="text-xs mt-1 text-gray-600">West Africa</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="h-4 w-16 rounded-full bg-gradient-to-r from-amber-500 to-green-500"></div>
                <span className="text-xs mt-1 text-gray-600">North Africa</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
