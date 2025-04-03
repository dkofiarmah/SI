import React from 'react';
import { Map, AlertTriangle, Building, BarChart } from 'lucide-react';
import { Doughnut } from 'react-chartjs-2';
import { 
  ChartTypeRegistry, 
  TooltipItem,
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartData,
  ChartOptions
} from 'chart.js';

// Register the required Chart.js components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);

interface StabilityData {
  region: string;
  score: number;
  indicators: {
    name: string;
    value: number;
  }[];
}

interface Props {
  selectedRegion: string;
  selectedCountry?: string;
  data?: StabilityData;
}

interface RiskData {
  label: string;
  count: number;
  color: string;
}

export default function StabilityMap({ selectedRegion, selectedCountry, data }: Props) {
  const riskZones: RiskData[] = [
    { label: 'High Risk', count: 4, color: 'rgb(239, 68, 68)' },
    { label: 'Medium Risk', count: 12, color: 'rgb(234, 179, 8)' },
    { label: 'Low Risk', count: 18, color: 'rgb(34, 197, 94)' }
  ];

  const chartData = {
    labels: riskZones.map(zone => zone.label),
    datasets: [
      {
        data: riskZones.map(zone => zone.count),
        backgroundColor: riskZones.map(zone => zone.color),
        borderColor: riskZones.map(zone => zone.color),
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function(tooltipItem: TooltipItem<'doughnut'>) {
            return `Stability Index: ${tooltipItem.raw}`;
          },
        },
      },
    },
  };

  // Use the region from data if available, otherwise use the selectedRegion and country
  const displayRegion = data?.region || (selectedCountry || selectedRegion);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-bold text-lg text-gray-800">
          Stability Index - {displayRegion}
        </h2>
        <a href="/dashboard/geospatial" className="text-blue-600 text-sm font-medium hover:underline flex items-center">
          <Map className="h-4 w-4 mr-1.5" />
          Geospatial View
        </a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
        <div className="flex items-center justify-center h-60 bg-gray-100 rounded-md border border-gray-200 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <svg width="100%" height="100%" viewBox="0 0 200 150">
              <path d="M50,5 L150,5 L195,75 L150,145 L50,145 L5,75 Z" fill="currentColor" />
              <path d="M100,5 L150,5 L165,40 L100,40 Z" fill="currentColor" opacity="0.7" />
              <path d="M150,5 L195,75 L175,75 L150,45 Z" fill="currentColor" opacity="0.5" />
            </svg>
          </div>
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <div className="w-full h-full">
              <Doughnut data={chartData} options={chartOptions} />
            </div>
          </div>
        </div>

        <div className="grid grid-rows-3 gap-4">
          {riskZones.map((zone, index) => (
            <div 
              key={zone.label}
              className={`p-4 rounded-md border flex items-center justify-between ${
                index === 0 ? 'bg-red-50 border-red-100' :
                index === 1 ? 'bg-yellow-50 border-yellow-100' :
                'bg-green-50 border-green-100'
              }`}
            >
              <div>
                <p className={`text-sm font-medium ${
                  index === 0 ? 'text-red-700' :
                  index === 1 ? 'text-yellow-700' :
                  'text-green-700'
                }`}>
                  {zone.label}
                </p>
                <p className={`font-bold text-lg ${
                  index === 0 ? 'text-red-900' :
                  index === 1 ? 'text-yellow-900' :
                  'text-green-900'
                }`}>
                  {zone.count} Zones
                </p>
              </div>
              {index === 0 && <AlertTriangle className="h-8 w-8 text-red-300" />}
              {index === 1 && <Building className="h-8 w-8 text-yellow-300" />}
              {index === 2 && <BarChart className="h-8 w-8 text-green-300" />}
            </div>
          ))}
        </div>
      </div>

      <div className="text-xs text-gray-500 italic text-center">
        Click "Geospatial View" for detailed geographic analysis
      </div>
    </div>
  );
}
