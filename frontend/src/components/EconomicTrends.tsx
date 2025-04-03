'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ArrowRight, TrendingUp, BarChart4, DollarSign, 
  Calendar, Download, PieChart, FilterIcon, Target, 
  Percent, ArrowUpRight, ArrowDownRight, Minus
} from 'lucide-react';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import EnhancedDashboardCard from './EnhancedDashboardCard';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

type EconomicIndicator = {
  id: string;
  label: string;
  value: string;
  trend: 'up' | 'down' | 'neutral';
  change: string;
  changeType: 'positive' | 'negative' | 'neutral';
  color: string;
  borderColor: string;
  bgColor: string;
  icon: React.ReactNode;
};

type ChartType = 'line' | 'bar';

export default function EconomicTrends({
  selectedRegion,
  selectedCountry
}: {
  selectedRegion: string;
  selectedCountry?: string;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [selectedIndicator, setSelectedIndicator] = useState<string | null>(null);
  const [activeChartType, setActiveChartType] = useState<ChartType>('line');
  const [timeRange, setTimeRange] = useState<'6m' | '1y' | '3y'>('6m');
  
  // Generate random data for a realistic effect with proper trend
  const generateRandomData = (base: number, volatility: number, trend: number, length: number) => {
    const data = [];
    let value = base;
    
    for (let i = 0; i < length; i++) {
      // Add random variation with trend bias
      value = Math.max(0, value + (Math.random() * volatility * 2 - volatility) + trend);
      data.push(value.toFixed(1));
    }
    
    return data;
  };
  
  // Get time labels based on selected range
  const getTimeLabels = () => {
    const now = new Date();
    const labels = [];
    
    if (timeRange === '6m') {
      // Past 6 months
      for (let i = 5; i >= 0; i--) {
        const month = new Date(now.getFullYear(), now.getMonth() - i, 1);
        labels.push(month.toLocaleDateString('en-US', { month: 'short' }));
      }
    } else if (timeRange === '1y') {
      // Past year (quarterly)
      for (let i = 3; i >= 0; i--) {
        const quarter = new Date(now.getFullYear(), now.getMonth() - (i * 3), 1);
        labels.push(`Q${Math.floor((11 - i * 3) / 3) + 1} ${quarter.getFullYear()}`);
      }
    } else {
      // Past 3 years
      for (let i = 2; i >= 0; i--) {
        labels.push((now.getFullYear() - i).toString());
      }
    }
    
    return labels;
  };
  
  // Generate economic data - in a real app, this would come from an API
  const [economicData, setEconomicData] = useState({
    gdp: generateRandomData(3.0, 0.5, 0.2, 6),
    inflation: generateRandomData(4.5, 0.8, 0.1, 6),
    fdi: generateRandomData(1.5, 0.5, 0.3, 6),
    exports: generateRandomData(8.0, 1.0, -0.1, 6),
    imports: generateRandomData(7.0, 1.2, 0.2, 6)
  });
  
  const timeLabels = getTimeLabels();
  
  // Calculate the overall economic health trend
  const calculateEconomicTrend = () => {
    // Simple algorithm to determine economic health
    const lastGDP = parseFloat(economicData.gdp[economicData.gdp.length - 1]);
    const prevGDP = parseFloat(economicData.gdp[economicData.gdp.length - 2]);
    const lastInflation = parseFloat(economicData.inflation[economicData.inflation.length - 1]);
    const lastFDI = parseFloat(economicData.fdi[economicData.fdi.length - 1]);
    
    // Weight different factors (simplified algorithm)
    const gdpWeight = 0.5;
    const inflationWeight = -0.3; // Higher inflation is negative
    const fdiWeight = 0.2;
    
    const gdpChange = (lastGDP - prevGDP) / prevGDP;
    const score = lastGDP * gdpWeight - lastInflation * inflationWeight + lastFDI * fdiWeight;
    
    // Determine trend direction
    let direction: 'up' | 'down' | 'stable';
    if (gdpChange > 0.1) direction = 'up';
    else if (gdpChange < -0.1) direction = 'down';
    else direction = 'stable';
    
    return {
      direction,
      value: `${(score/10 * 100).toFixed(1)}`,
      label: 'economic health'
    } as const;
  };
  
  const economicTrend = calculateEconomicTrend();
  
  // Prepare chart data based on time range
  const getChartData = () => {
    return {
      labels: timeLabels,
      datasets: [
        {
          label: 'GDP Growth (%)',
          data: economicData.gdp.slice(-timeLabels.length),
          borderColor: 'rgb(59, 130, 246)',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          fill: activeChartType === 'line',
          tension: 0.4,
          borderWidth: 2,
          barThickness: 24
        },
        {
          label: 'Inflation (%)',
          data: economicData.inflation.slice(-timeLabels.length),
          borderColor: 'rgb(239, 68, 68)',
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          fill: activeChartType === 'line',
          tension: 0.4,
          borderWidth: 2,
          barThickness: 24,
          hidden: !selectedIndicator || selectedIndicator === 'gdp'
        },
        {
          label: 'FDI Growth (%)',
          data: economicData.fdi.slice(-timeLabels.length),
          borderColor: 'rgb(16, 185, 129)',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          fill: activeChartType === 'line',
          tension: 0.4,
          borderWidth: 2,
          barThickness: 24,
          hidden: !selectedIndicator || selectedIndicator === 'gdp'
        }
      ]
    };
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top' as const,
        labels: {
          usePointStyle: true,
          boxWidth: 6,
          font: {
            size: 11
          }
        }
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
      },
      title: {
        display: selectedIndicator !== null,
        text: selectedIndicator === 'gdp' ? 'GDP Growth Trend' : 
              selectedIndicator === 'inflation' ? 'Inflation Rate Trend' : 
              selectedIndicator === 'fdi' ? 'Foreign Direct Investment Trend' : '',
        font: {
          size: 14
        }
      }
    },
    scales: {
      y: {
        beginAtZero: false,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
        ticks: {
          callback: function(value: any) {
            return value + '%';
          }
        }
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

  // Prepare indicators with trend icons and colors
  const indicators: EconomicIndicator[] = [
    {
      id: 'gdp',
      label: 'GDP Growth',
      value: selectedCountry ? `${economicData.gdp[economicData.gdp.length - 1]}%` : `${economicData.gdp[economicData.gdp.length - 2]}%`,
      trend: parseFloat(economicData.gdp[economicData.gdp.length - 1]) > parseFloat(economicData.gdp[economicData.gdp.length - 2]) ? 'up' : 'down',
      change: `${(parseFloat(economicData.gdp[economicData.gdp.length - 1]) - parseFloat(economicData.gdp[economicData.gdp.length - 2])).toFixed(1)}%`,
      changeType: parseFloat(economicData.gdp[economicData.gdp.length - 1]) > parseFloat(economicData.gdp[economicData.gdp.length - 2]) ? 'positive' : 'negative',
      color: 'text-blue-700',
      borderColor: 'border-blue-500',
      bgColor: 'bg-blue-50',
      icon: <TrendingUp className="h-4 w-4 text-blue-500" />
    },
    {
      id: 'inflation',
      label: 'Inflation',
      value: `${economicData.inflation[economicData.inflation.length - 1]}%`,
      trend: parseFloat(economicData.inflation[economicData.inflation.length - 1]) < parseFloat(economicData.inflation[economicData.inflation.length - 2]) ? 'up' : 'down',
      change: `${(parseFloat(economicData.inflation[economicData.inflation.length - 1]) - parseFloat(economicData.inflation[economicData.inflation.length - 2])).toFixed(1)}%`,
      changeType: parseFloat(economicData.inflation[economicData.inflation.length - 1]) < parseFloat(economicData.inflation[economicData.inflation.length - 2]) ? 'positive' : 'negative',
      color: 'text-red-700',
      borderColor: 'border-red-500',
      bgColor: 'bg-red-50',
      icon: <Percent className="h-4 w-4 text-red-500" />
    },
    {
      id: 'fdi',
      label: 'FDI (YoY)',
      value: `${economicData.fdi[economicData.fdi.length - 1]}%`,
      trend: parseFloat(economicData.fdi[economicData.fdi.length - 1]) > parseFloat(economicData.fdi[economicData.fdi.length - 2]) ? 'up' : 'down',
      change: `${(parseFloat(economicData.fdi[economicData.fdi.length - 1]) - parseFloat(economicData.fdi[economicData.fdi.length - 2])).toFixed(1)}%`,
      changeType: parseFloat(economicData.fdi[economicData.fdi.length - 1]) > parseFloat(economicData.fdi[economicData.fdi.length - 2]) ? 'positive' : 'negative',
      color: 'text-green-700',
      borderColor: 'border-green-500',
      bgColor: 'bg-green-50',
      icon: <DollarSign className="h-4 w-4 text-green-500" />
    }
  ];

  // Simulate data refresh
  const refreshData = () => {
    setIsLoading(true);
    
    // Simulate API call with timeout
    setTimeout(() => {
      setEconomicData({
        gdp: generateRandomData(3.0, 0.5, 0.2, 6),
        inflation: generateRandomData(4.5, 0.8, 0.1, 6),
        fdi: generateRandomData(1.5, 0.5, 0.3, 6),
        exports: generateRandomData(8.0, 1.0, -0.1, 6),
        imports: generateRandomData(7.0, 1.2, 0.2, 6)
      });
      
      setLastUpdated(new Date());
      setIsLoading(false);
    }, 1500);
  };

  // Automatically refresh data when region/country changes
  useEffect(() => {
    refreshData();
  }, [selectedRegion, selectedCountry]);

  // Additional chart controls and options
  const cardActions = (
    <>
      <button className="w-full text-left px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100 rounded flex items-center">
        <Download className="h-3.5 w-3.5 mr-2 text-gray-500" />
        Export Data
      </button>
      <button className="w-full text-left px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100 rounded flex items-center">
        <PieChart className="h-3.5 w-3.5 mr-2 text-gray-500" />
        Sector Breakdown
      </button>
      <button className="w-full text-left px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100 rounded flex items-center">
        <Target className="h-3.5 w-3.5 mr-2 text-gray-500" />
        Set Alerts
      </button>
    </>
  );

  return (
    <EnhancedDashboardCard
      title={`Economic Trends - ${selectedCountry || selectedRegion}`}
      icon={<BarChart4 className="h-5 w-5 text-blue-600" />}
      lastUpdated={lastUpdated}
      status="normal"
      trend={economicTrend}
      isLoading={isLoading}
      refreshInterval={120}
      onRefresh={refreshData}
      infoTooltip="This card displays key economic indicators and trends for the selected region. Data updates automatically every 2 minutes."
      actions={cardActions}
      isCollapsible={true}
      onFullScreenToggle={() => console.log('Toggle fullscreen for Economic Trends')}
      allowFavorite={true}
    >
      {/* Chart Type Toggle & Time Range Selector */}
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-2">
          <button
            className={`px-2 py-1 text-xs rounded ${activeChartType === 'line' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}
            onClick={() => setActiveChartType('line')}
          >
            Line Chart
          </button>
          <button
            className={`px-2 py-1 text-xs rounded ${activeChartType === 'bar' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}
            onClick={() => setActiveChartType('bar')}
          >
            Bar Chart
          </button>
        </div>
        
        <div className="flex items-center text-sm">
          <span className="mr-2 text-xs text-gray-500">Time Range:</span>
          <select 
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as any)}
            className="text-xs border border-gray-200 rounded px-2 py-1"
          >
            <option value="6m">6 Months</option>
            <option value="1y">1 Year</option>
            <option value="3y">3 Years</option>
          </select>
        </div>
      </div>
      
      {/* Main Chart */}
      <div className="flex items-center justify-center h-60 bg-gray-50 rounded-md border border-gray-200 mb-4 p-4 hover:shadow-sm transition duration-300">
        <div className="w-full h-full">
          {activeChartType === 'line' ? (
            <Line data={getChartData()} options={chartOptions} />
          ) : (
            <Bar data={getChartData()} options={chartOptions} />
          )}
        </div>
      </div>

      {/* Key Indicator Cards */}
      <div className="grid grid-cols-3 gap-4">
        {indicators.map((indicator) => (
          <div 
            key={indicator.id} 
            className={`p-3 border-l-4 ${indicator.borderColor} ${indicator.bgColor} rounded-r cursor-pointer transition-all duration-200 ${
              selectedIndicator === indicator.id ? 'ring-2 ring-blue-300' : 'hover:shadow-sm'
            }`}
            onClick={() => setSelectedIndicator(selectedIndicator === indicator.id ? null : indicator.id)}
          >
            <div className="flex items-center justify-between mb-1">
              <p className="text-sm font-medium text-gray-700 flex items-center gap-1">
                {indicator.icon}
                {indicator.label}
              </p>
              {indicator.trend === 'up' ? (
                <ArrowUpRight className={`h-4 w-4 ${indicator.changeType === 'positive' ? 'text-green-500' : 'text-red-500'}`} />
              ) : indicator.trend === 'down' ? (
                <ArrowDownRight className={`h-4 w-4 ${indicator.changeType === 'positive' ? 'text-green-500' : 'text-red-500'}`} />
              ) : (
                <Minus className="h-4 w-4 text-gray-500" />
              )}
            </div>
            <p className={`font-bold text-lg ${indicator.color}`}>
              {indicator.value}
            </p>
            <p className={`text-xs ${
              indicator.changeType === 'positive' ? 'text-green-600' : 
              indicator.changeType === 'negative' ? 'text-red-600' : 
              'text-gray-500'
            }`}>
              {indicator.changeType === 'positive' ? '+' : ''}{indicator.change} from previous
            </p>
          </div>
        ))}
      </div>
      
      {/* Key Insights / Recommendations */}
      <div className="mt-4 p-3 bg-blue-50 border border-blue-100 rounded-md text-sm">
        <p className="font-medium text-blue-800 mb-1">Key Insight:</p>
        <p className="text-blue-700">
          {economicTrend.direction === 'up' 
            ? `Economic indicators show positive growth momentum for ${selectedCountry || selectedRegion}. FDI continues to strengthen economic outlook.`
            : economicTrend.direction === 'down'
            ? `Economic slowdown detected. Consider monitoring inflation and trade balance closely over the next quarter.`
            : `Economic indicators remain stable. No significant changes detected in growth patterns.`
          }
        </p>
      </div>
      
      <div className="flex justify-end mt-3">
        <Link
          href="/dashboard/report/"
          className="text-blue-600 text-sm font-medium hover:underline flex items-center"
        >
          View Complete Economic Analysis
          <ArrowRight className="h-4 w-4 ml-1.5" />
        </Link>
      </div>
    </EnhancedDashboardCard>
  );
}
