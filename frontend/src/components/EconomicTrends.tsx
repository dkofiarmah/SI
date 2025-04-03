'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

type EconomicIndicator = {
  label: string;
  value: string;
  trend: 'up' | 'down' | 'neutral';
  color: string;
  borderColor: string;
  bgColor: string;
};

export default function EconomicTrends({
  selectedRegion,
  selectedCountry
}: {
  selectedRegion: string;
  selectedCountry?: string;
}) {
  // Sample economic data - in a real app, this would come from an API
  const monthlyGDP = {
    labels: ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'],
    datasets: [
      {
        label: 'GDP Growth',
        data: [3.2, 3.5, 3.8, 4.2, 4.8, 5.1],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.4,
      }
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
        mode: 'index' as const,
        intersect: false,
      },
    },
    scales: {
      y: {
        beginAtZero: false,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
    interaction: {
      mode: 'nearest' as const,
      axis: 'x' as const,
      intersect: false,
    },
  };

  const indicators: EconomicIndicator[] = [
    {
      label: 'GDP Growth',
      value: selectedCountry ? '+5.1%' : '+3.7%',
      trend: 'up',
      color: 'text-green-700',
      borderColor: 'border-green-500',
      bgColor: 'bg-green-50/50'
    },
    {
      label: 'Inflation',
      value: selectedCountry ? '8.2%' : '5.2%',
      trend: 'up',
      color: 'text-red-700',
      borderColor: 'border-red-500',
      bgColor: 'bg-red-50/50'
    },
    {
      label: 'FDI (YoY)',
      value: selectedCountry ? '$1.8B' : '$24.5B',
      trend: 'up',
      color: 'text-blue-700',
      borderColor: 'border-blue-500',
      bgColor: 'bg-blue-50/50'
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-bold text-lg text-gray-800">
          Economic Trends - {selectedCountry || selectedRegion}
        </h2>
        <Link
          href="/dashboard/report/"
          className="text-blue-600 text-sm font-medium hover:underline flex items-center"
        >
          View Full Report
          <ArrowRight className="h-4 w-4 ml-1.5" />
        </Link>
      </div>

      <div className="flex items-center justify-center h-60 bg-gray-100 rounded-md border border-gray-200 mb-4 p-4">
        <div className="w-full h-full">
          <Line data={monthlyGDP} options={chartOptions} />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {indicators.map((indicator) => (
          <div 
            key={indicator.label} 
            className={`p-3 border-l-4 ${indicator.borderColor} ${indicator.bgColor}`}
          >
            <p className="text-sm text-gray-600">{indicator.label}</p>
            <p className={`font-bold text-lg ${indicator.color}`}>
              {indicator.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
