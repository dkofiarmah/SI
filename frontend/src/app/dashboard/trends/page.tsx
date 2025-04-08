'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  TrendingUp, 
  BarChart4, 
  LineChart, 
  PieChart, 
  Activity, 
  ArrowUpRight, 
  ArrowDownRight,
  Minus, 
  Layers, 
  Calendar, 
  Download, 
  Share2,
  Map,
  PanelLeft,
  Zap,
  BrainCircuit,
  Target,
  Info,
  Timer,
  BarChart,
  ExternalLink,
  Briefcase,
  Shield,
  User
} from 'lucide-react';
import TrendAnalysis from '@/components/TrendAnalysis';
import DashboardHeader from '@/components/DashboardHeader';
import EnhancedDashboardCard from '@/components/EnhancedDashboardCard';
import { useStore } from '@/lib/store';

// Define types for trend configuration
type TrendConfiguration = {
  id: string;
  name: string;
  visibleDatasets: string[];
  chartType: 'line' | 'bar';
  timeframe: string;
  region?: string;
  country?: string;
  compareMode?: boolean;
  compareWith?: string;
  createdAt: Date;
  lastUsed?: Date;
};

// User type for role-based views
type UserType = 'security' | 'economic' | 'diplomatic' | 'media' | 'general';

// Type for prediction models
type PredictionModel = {
  id: string;
  name: string;
  description: string;
  accuracy: number;
  lastRun: Date;
};

// Type for predicted trend
type PredictedTrend = {
  id: string;
  metric: string;
  metricLabel: string;
  currentValue: number;
  predictedValue: number;
  confidenceInterval: [number, number];
  predictionDate: Date;
  category: string;
  trend: 'up' | 'down' | 'stable';
  confidenceScore: number;
};

export default function TrendsPage() {
  const router = useRouter();
  const { userPreferences } = useStore();
  
  // State for filters and selection
  const [selectedRegion, setSelectedRegion] = useState('East Africa');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedTimeframe, setSelectedTimeframe] = useState('30');
  const [userType, setUserType] = useState<UserType>('general');
  
  // State for available regions and countries
  const [availableRegions] = useState(['East Africa', 'West Africa', 'North Africa', 'Southern Africa', 'Central Africa']);
  const [availableCountries, setAvailableCountries] = useState<string[]>([]);
  const [comparisonEnabled, setComparisonEnabled] = useState(true);
  
  // State for saved configurations
  const [savedConfigurations, setSavedConfigurations] = useState<TrendConfiguration[]>([]);
  
  // State for predictive analysis
  const [showPredictions, setShowPredictions] = useState(false);
  const [predictionTimeframe, setPredictionTimeframe] = useState('90');
  const [predictedTrends, setPredictedTrends] = useState<PredictedTrend[]>([]);
  const [predictionModels, setPredictionModels] = useState<PredictionModel[]>([]);
  const [selectedPredictionModel, setSelectedPredictionModel] = useState<string>('');
  
  // State for cross-regional analysis
  const [showRegionalComparison, setShowRegionalComparison] = useState(false);
  const [comparisonRegions, setComparisonRegions] = useState<string[]>([]);
  
  // State for loading status
  const [isLoading, setIsLoading] = useState(true);
  
  // Set available countries based on selected region
  useEffect(() => {
    // Set countries based on region - simulated data
    const getCountriesByRegion = (region: string) => {
      switch(region) {
        case 'East Africa':
          return ['Kenya', 'Tanzania', 'Uganda', 'Rwanda', 'Ethiopia', 'Somalia'];
        case 'West Africa':
          return ['Nigeria', 'Ghana', 'Senegal', 'Côte d\'Ivoire', 'Mali', 'Burkina Faso'];
        case 'North Africa':
          return ['Egypt', 'Morocco', 'Tunisia', 'Algeria', 'Libya'];
        case 'Southern Africa':
          return ['South Africa', 'Botswana', 'Namibia', 'Zimbabwe', 'Mozambique'];
        case 'Central Africa':
          return ['Cameroon', 'DR Congo', 'Central African Republic', 'Chad', 'Gabon'];
        default:
          return [];
      }
    };
    
    setAvailableCountries(getCountriesByRegion(selectedRegion));
    setSelectedCountry(''); // Reset selected country when region changes
  }, [selectedRegion]);
  
  // Initialize with saved configurations and preferences
  useEffect(() => {
    // Simulate loading saved configurations from API
    setTimeout(() => {
      // Mock saved configurations
      const mockConfigurations: TrendConfiguration[] = [
        {
          id: 'config-1',
          name: 'Economic Indicators - East Africa',
          visibleDatasets: ['gdp-growth', 'inflation', 'fdi', 'unemployment'],
          chartType: 'line',
          timeframe: '90',
          region: 'East Africa',
          country: '',
          compareMode: false,
          createdAt: new Date(2025, 3, 1),
          lastUsed: new Date(2025, 3, 3)
        },
        {
          id: 'config-2',
          name: 'Security Trend Comparison',
          visibleDatasets: ['security-incidents', 'crime-rate', 'border-security'],
          chartType: 'bar',
          timeframe: '180',
          region: 'West Africa',
          country: 'Nigeria',
          compareMode: true,
          compareWith: 'East Africa',
          createdAt: new Date(2025, 2, 15),
          lastUsed: new Date(2025, 3, 2)
        },
        {
          id: 'config-3',
          name: 'Political Stability Analysis',
          visibleDatasets: ['political-stability', 'corruption-perception', 'governance-effectiveness'],
          chartType: 'line',
          timeframe: '365',
          region: 'North Africa',
          compareMode: false,
          createdAt: new Date(2025, 1, 10)
        }
      ];
      
      setSavedConfigurations(mockConfigurations);
      
      // Set user type based on user preferences if available
      if (userPreferences.userType) {
        switch(userPreferences.userType.toLowerCase()) {
          case 'security analyst':
            setUserType('security');
            break;
          case 'economic advisor':
            setUserType('economic');
            break;
          case 'diplomatic officer':
            setUserType('diplomatic');
            break;
          case 'media analyst':
            setUserType('media');
            break;
          default:
            setUserType('general');
        }
      }
      
      // Generate mock predicted trends
      generatePredictedTrends();
      
      // Generate mock prediction models
      setPredictionModels([
        {
          id: 'model-1',
          name: 'Time Series Forecasting',
          description: 'ARIMA-based model for economic indicator prediction',
          accuracy: 0.87,
          lastRun: new Date(2025, 3, 3)
        },
        {
          id: 'model-2',
          name: 'ML Ensemble Model',
          description: 'Gradient boosting ensemble with multiple indicator correlation',
          accuracy: 0.91,
          lastRun: new Date(2025, 3, 2)
        },
        {
          id: 'model-3',
          name: 'Neural Network Predictor',
          description: 'Recurrent neural network with attention mechanism',
          accuracy: 0.89,
          lastRun: new Date(2025, 3, 1)
        }
      ]);
      setSelectedPredictionModel('model-2');
      
      setIsLoading(false);
    }, 800);
  }, [userPreferences]);
  
  // Generate predicted trends for the selected metrics
  const generatePredictedTrends = () => {
    // Mock predicted trends with realistic data
    const mockPredictions: PredictedTrend[] = [
      {
        id: 'pred-1',
        metric: 'gdp-growth',
        metricLabel: 'GDP Growth',
        currentValue: 5.2,
        predictedValue: 5.7,
        confidenceInterval: [5.3, 6.1],
        predictionDate: new Date(2025, 6, 4), // 3 months from now
        category: 'economic',
        trend: 'up',
        confidenceScore: 0.85
      },
      {
        id: 'pred-2',
        metric: 'inflation',
        metricLabel: 'Inflation Rate',
        currentValue: 6.8,
        predictedValue: 5.9,
        confidenceInterval: [5.2, 6.5],
        predictionDate: new Date(2025, 6, 4),
        category: 'economic',
        trend: 'down',
        confidenceScore: 0.78
      },
      {
        id: 'pred-3',
        metric: 'political-stability',
        metricLabel: 'Political Stability',
        currentValue: 65,
        predictedValue: 68,
        confidenceInterval: [64, 72],
        predictionDate: new Date(2025, 6, 4),
        category: 'political',
        trend: 'up',
        confidenceScore: 0.72
      },
      {
        id: 'pred-4',
        metric: 'security-incidents',
        metricLabel: 'Security Incidents',
        currentValue: 23,
        predictedValue: 18,
        confidenceInterval: [15, 22],
        predictionDate: new Date(2025, 6, 4),
        category: 'security',
        trend: 'down',
        confidenceScore: 0.81
      },
      {
        id: 'pred-5',
        metric: 'public-sentiment',
        metricLabel: 'Public Sentiment',
        currentValue: 58,
        predictedValue: 62,
        confidenceInterval: [58, 65],
        predictionDate: new Date(2025, 6, 4),
        category: 'social',
        trend: 'up',
        confidenceScore: 0.76
      }
    ];
    
    setPredictedTrends(mockPredictions);
  };
  
  // Save a new configuration
  const handleSaveConfiguration = (config: TrendConfiguration) => {
    setSavedConfigurations(prev => [config, ...prev]);
    // In a real app, you'd save this to the server
  };
  
  // Apply a saved configuration
  const applyConfiguration = (config: TrendConfiguration) => {
    setSelectedRegion(config.region || 'East Africa');
    setSelectedCountry(config.country || '');
    setSelectedTimeframe(config.timeframe);
    // Update the lastUsed timestamp
    setSavedConfigurations(prev => 
      prev.map(c => c.id === config.id ? {...c, lastUsed: new Date()} : c)
    );
  };
  
  // Toggle regional comparison view
  const toggleRegionalComparison = () => {
    setShowRegionalComparison(!showRegionalComparison);
    if (!showRegionalComparison && comparisonRegions.length === 0) {
      // Default to comparing with other regions
      setComparisonRegions(['West Africa', 'North Africa']);
    }
  };
  
  // Get the trend icon based on direction
  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    if (trend === 'up') return <ArrowUpRight className="h-4 w-4 text-green-600" />;
    if (trend === 'down') return <ArrowDownRight className="h-4 w-4 text-red-600" />;
    return <Minus className="h-4 w-4 text-gray-600" />;
  };
  
  // Get text color class based on trend direction
  const getTrendColorClass = (trend: 'up' | 'down' | 'stable', metric: string) => {
    // For some metrics like inflation, a decrease is positive
    const inversedMetrics = ['inflation', 'unemployment', 'security-incidents', 'crime-rate'];
    const isInversed = inversedMetrics.includes(metric);
    
    if ((trend === 'up' && !isInversed) || (trend === 'down' && isInversed)) {
      return 'text-green-600';
    }
    if ((trend === 'down' && !isInversed) || (trend === 'up' && isInversed)) {
      return 'text-red-600';
    }
    return 'text-gray-600';
  };
  
  return (
    <div className="flex flex-col min-h-full">
      <DashboardHeader
        title="Trend Analysis"
        description="Analyze and predict trends across various indicators and regions"
        showInfoTip
        infoTipContent="This page provides comprehensive trend analysis with predictive capabilities and cross-regional comparison. Save and reuse your favorite analysis configurations."
        bgColor="white"
        sticky
      >
        <div className="flex items-center space-x-3">
          {/* Region Selector */}
          <div className="relative">
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="bg-white border border-gray-300 rounded-md py-2 pl-3 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              {availableRegions.map((region) => (
                <option key={region} value={region}>
                  {region}
                </option>
              ))}
            </select>
          </div>
          
          {/* Country Selector */}
          <div className="relative">
            <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="bg-white border border-gray-300 rounded-md py-2 pl-3 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="">All Countries</option>
              {availableCountries.map((country) => (
                <option key={country} value={country}>
                  {country}
                </option>
              ))}
            </select>
          </div>
          
          {/* Timeframe Selector */}
          <div className="relative">
            <select
              value={selectedTimeframe}
              onChange={(e) => setSelectedTimeframe(e.target.value)}
              className="bg-white border border-gray-300 rounded-md py-2 pl-3 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 90 days</option>
              <option value="180">Last 180 days</option>
              <option value="365">Last 365 days</option>
            </select>
          </div>
          
          {/* User Type Selector */}
          <div className="relative">
            <select
              value={userType}
              onChange={(e) => setUserType(e.target.value as UserType)}
              className="bg-white border border-gray-300 rounded-md py-2 pl-3 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="general">General View</option>
              <option value="security">Security Focus</option>
              <option value="economic">Economic Focus</option>
              <option value="diplomatic">Diplomatic Focus</option>
              <option value="media">Media Focus</option>
            </select>
          </div>
          
          {/* Download Button */}
          <button 
            className="flex items-center text-sm bg-white border border-gray-300 rounded-md py-2 px-3 hover:bg-gray-50"
            title="Download analysis data"
          >
            <Download className="h-4 w-4 mr-1.5 text-gray-600" />
            Export
          </button>
        </div>
      </DashboardHeader>
      
      <div className="flex flex-col md:flex-row flex-1 p-6 gap-6">
        {/* Main Content Area */}
        <div className="md:w-3/4 space-y-6">
          {/* Main Trend Analysis Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                <TrendingUp className="h-6 w-6 mr-2 text-blue-600" />
                Trend Analysis Dashboard
              </h2>
              
              <TrendAnalysis
                selectedRegion={selectedRegion}
                selectedCountry={selectedCountry}
                timeframe={selectedTimeframe}
                userType={userType}
                comparisonEnabled={comparisonEnabled}
                onSaveConfiguration={handleSaveConfiguration}
                savedConfigurations={savedConfigurations}
              />
            </div>
          </div>
          
          {/* Predictive Analysis Section */}
          <EnhancedDashboardCard
            title="Predictive Analysis"
            icon={<BrainCircuit className="h-5 w-5 text-purple-600" />}
            onRefresh={generatePredictedTrends}
            isLoading={isLoading}
            status="normal"
            infoTooltip="This section shows predictive forecasts for key metrics based on historical data and machine learning models."
            isCollapsible={true}
            onCollapseChange={setShowPredictions}
          >
            {showPredictions && (
              <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-4 mb-2">
                  <div className="flex items-center gap-3">
                    <div className="text-sm font-medium text-gray-700">Prediction Model:</div>
                    <select
                      value={selectedPredictionModel}
                      onChange={(e) => setSelectedPredictionModel(e.target.value)}
                      className="text-sm border border-gray-300 rounded px-2 py-1 bg-white"
                    >
                      {predictionModels.map(model => (
                        <option key={model.id} value={model.id}>{model.name} ({Math.round(model.accuracy * 100)}% accuracy)</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="text-sm font-medium text-gray-700">Forecast Horizon:</div>
                    <select
                      value={predictionTimeframe}
                      onChange={(e) => setPredictionTimeframe(e.target.value)}
                      className="text-sm border border-gray-300 rounded px-2 py-1 bg-white"
                    >
                      <option value="30">30 days</option>
                      <option value="90">90 days</option>
                      <option value="180">180 days</option>
                      <option value="365">1 year</option>
                    </select>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {predictedTrends.map(prediction => (
                    <div key={prediction.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium text-gray-800">{prediction.metricLabel}</h3>
                        <div className={`flex items-center ${getTrendColorClass(prediction.trend, prediction.metric)}`}>
                          {getTrendIcon(prediction.trend)}
                          <span className="text-sm font-medium ml-1">
                            {prediction.trend === 'up' ? '+' : prediction.trend === 'down' ? '-' : ''}
                            {Math.abs(((prediction.predictedValue - prediction.currentValue) / prediction.currentValue) * 100).toFixed(1)}%
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-baseline justify-between mb-1">
                        <div className="text-sm text-gray-600">Current:</div>
                        <div className="font-bold">{prediction.currentValue.toFixed(1)}</div>
                      </div>
                      
                      <div className="flex items-baseline justify-between mb-1">
                        <div className="text-sm text-gray-600">Predicted:</div>
                        <div className="font-bold">{prediction.predictedValue.toFixed(1)}</div>
                      </div>
                      
                      <div className="flex items-baseline justify-between mb-3">
                        <div className="text-sm text-gray-600">Range:</div>
                        <div className="text-sm text-gray-700">
                          {prediction.confidenceInterval[0].toFixed(1)} - {prediction.confidenceInterval[1].toFixed(1)}
                        </div>
                      </div>
                      
                      <div className="mt-2 pt-2 border-t border-gray-100 flex justify-between items-center">
                        <div className="text-xs text-gray-500">
                          {Math.round(prediction.confidenceScore * 100)}% confidence
                        </div>
                        <button className="text-xs text-blue-600 hover:underline">
                          Details
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="bg-purple-50 border border-purple-100 rounded-md p-3 mt-4">
                  <div className="flex items-center text-purple-800 mb-1">
                    <Zap className="h-4 w-4 mr-2 text-purple-600" />
                    <h3 className="font-medium">AI-Generated Insight</h3>
                  </div>
                  <p className="text-sm text-purple-700">
                    The forecasting model predicts improving economic conditions in {selectedCountry || selectedRegion} over the next {predictionTimeframe} days, with GDP growth likely to increase by up to 0.5%. Security metrics are expected to improve, with incidents projected to decrease by 21%.
                  </p>
                </div>
              </div>
            )}
          </EnhancedDashboardCard>
          
          {/* Cross-Regional Comparison */}
          <EnhancedDashboardCard
            title="Cross-Regional Comparison"
            icon={<Map className="h-5 w-5 text-emerald-600" />}
            isLoading={isLoading}
            status="normal"
            infoTooltip="Compare trends across multiple regions to identify patterns and differences."
            isCollapsible={true}
            onCollapseChange={toggleRegionalComparison}
          >
            {showRegionalComparison && (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="text-sm font-medium text-gray-700">Compare regions:</div>
                    <select
                      multiple
                      value={comparisonRegions}
                      onChange={(e) => {
                        const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
                        setComparisonRegions(selectedOptions);
                      }}
                      className="text-sm border border-gray-300 rounded px-2 py-1 bg-white"
                      size={3}
                    >
                      {availableRegions.filter(r => r !== selectedRegion).map(region => (
                        <option key={region} value={region}>{region}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="flex gap-2">
                    <button className="text-sm bg-white border border-gray-300 rounded px-3 py-1 hover:bg-gray-50 flex items-center">
                      <BarChart className="h-3.5 w-3.5 mr-1.5 text-gray-600" />
                      Bar
                    </button>
                    <button className="text-sm bg-blue-50 border border-blue-200 rounded px-3 py-1 text-blue-700 flex items-center">
                      <LineChart className="h-3.5 w-3.5 mr-1.5 text-blue-600" />
                      Line
                    </button>
                  </div>
                </div>
                
                {/* Regional Comparison Chart (placeholder) */}
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 h-80 flex items-center justify-center">
                  <div className="text-center">
                    <div className="bg-blue-100 rounded-full p-3 w-12 h-12 flex items-center justify-center mx-auto mb-3">
                      <Layers className="h-6 w-6 text-blue-600" />
                    </div>
                    <h3 className="text-gray-700 font-medium mb-2">Regional Comparison Chart</h3>
                    <p className="text-sm text-gray-600 max-w-md">
                      Compare key metrics across {selectedRegion} and {comparisonRegions.join(', ')}
                    </p>
                  </div>
                </div>
                
                {/* Key Differences Table */}
                <div>
                  <h3 className="font-medium text-gray-800 mb-2">Key Regional Differences</h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full border-collapse">
                      <thead>
                        <tr className="bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          <th className="py-3 px-4 border-b border-gray-200">Metric</th>
                          <th className="py-3 px-4 border-b border-gray-200">{selectedRegion}</th>
                          {comparisonRegions.map(region => (
                            <th key={region} className="py-3 px-4 border-b border-gray-200">{region}</th>
                          ))}
                          <th className="py-3 px-4 border-b border-gray-200">Variance</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="py-3 px-4 border-b border-gray-200 font-medium">GDP Growth</td>
                          <td className="py-3 px-4 border-b border-gray-200 text-green-600">5.2%</td>
                          <td className="py-3 px-4 border-b border-gray-200">4.1%</td>
                          <td className="py-3 px-4 border-b border-gray-200">3.8%</td>
                          <td className="py-3 px-4 border-b border-gray-200 text-green-600">+1.1%</td>
                        </tr>
                        <tr>
                          <td className="py-3 px-4 border-b border-gray-200 font-medium">Inflation Rate</td>
                          <td className="py-3 px-4 border-b border-gray-200 text-yellow-600">6.8%</td>
                          <td className="py-3 px-4 border-b border-gray-200">7.2%</td>
                          <td className="py-3 px-4 border-b border-gray-200">8.1%</td>
                          <td className="py-3 px-4 border-b border-gray-200 text-green-600">-1.3%</td>
                        </tr>
                        <tr>
                          <td className="py-3 px-4 border-b border-gray-200 font-medium">Political Stability</td>
                          <td className="py-3 px-4 border-b border-gray-200">65</td>
                          <td className="py-3 px-4 border-b border-gray-200">58</td>
                          <td className="py-3 px-4 border-b border-gray-200">61</td>
                          <td className="py-3 px-4 border-b border-gray-200 text-green-600">+4</td>
                        </tr>
                        <tr>
                          <td className="py-3 px-4 border-b border-gray-200 font-medium">Security Incidents</td>
                          <td className="py-3 px-4 border-b border-gray-200">23</td>
                          <td className="py-3 px-4 border-b border-gray-200">35</td>
                          <td className="py-3 px-4 border-b border-gray-200">19</td>
                          <td className="py-3 px-4 border-b border-gray-200 text-green-600">-12</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </EnhancedDashboardCard>
        </div>
        
        {/* Sidebar Area */}
        <div className="md:w-1/4 space-y-6">
          {/* Saved Configurations Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
            <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-blue-600" />
              Saved Configurations
            </h3>
            
            {savedConfigurations.length > 0 ? (
              <div className="space-y-3">
                {savedConfigurations.map(config => (
                  <div key={config.id} className="border border-gray-200 rounded-md p-3 hover:border-blue-300 hover:bg-blue-50 transition-colors cursor-pointer" onClick={() => applyConfiguration(config)}>
                    <h4 className="font-medium text-gray-800 mb-1">{config.name}</h4>
                    <div className="text-xs text-gray-600 space-y-1">
                      <div className="flex justify-between">
                        <span>Region:</span>
                        <span className="font-medium">{config.region}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Timeframe:</span>
                        <span className="font-medium">{config.timeframe} days</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Chart type:</span>
                        <span className="font-medium capitalize">{config.chartType}</span>
                      </div>
                    </div>
                    <div className="mt-2 pt-2 border-t border-gray-100 flex justify-between items-center">
                      <span className="text-xs text-gray-500">
                        {config.lastUsed 
                          ? `Last used: ${config.lastUsed.toLocaleDateString()}` 
                          : `Created: ${config.createdAt.toLocaleDateString()}`}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center p-4 bg-gray-50 rounded-md">
                <p className="text-sm text-gray-600">
                  No saved configurations yet.
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Save your current view settings for quick access later.
                </p>
              </div>
            )}
          </div>
          
          {/* Role-Based Insights */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
            <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
              <Target className="h-5 w-5 mr-2 text-indigo-600" />
              {userType === 'general' ? 'Role-Based Insights' : `${userType.charAt(0).toUpperCase() + userType.slice(1)} Insights`}
            </h3>
            
            <div className="space-y-4">
              {userType === 'security' && (
                <>
                  <div className="p-3 bg-red-50 border border-red-100 rounded-md">
                    <div className="flex items-center mb-1">
                      <Shield className="h-4 w-4 text-red-600 mr-1.5" />
                      <h4 className="font-medium text-red-800">Security Alert</h4>
                    </div>
                    <p className="text-sm text-red-700">
                      Security incidents in northern regions show decreasing trend (23% improvement), but border security index requires attention.
                    </p>
                  </div>
                  
                  <div className="p-3 bg-gray-50 border border-gray-200 rounded-md">
                    <h4 className="font-medium text-gray-800 mb-1">Security-Political Correlation</h4>
                    <p className="text-sm text-gray-600">
                      Strong correlation (0.78) detected between political stability index and security incident frequency.
                    </p>
                  </div>
                </>
              )}
              
              {userType === 'economic' && (
                <>
                  <div className="p-3 bg-green-50 border border-green-100 rounded-md">
                    <div className="flex items-center mb-1">
                      <BarChart className="h-4 w-4 text-green-600 mr-1.5" />
                      <h4 className="font-medium text-green-800">Economic Outlook</h4>
                    </div>
                    <p className="text-sm text-green-700">
                      Positive economic indicators across {selectedRegion} with GDP growth at 5.2% and FDI increasing by 15.3%.
                    </p>
                  </div>
                  
                  <div className="p-3 bg-gray-50 border border-gray-200 rounded-md">
                    <h4 className="font-medium text-gray-800 mb-1">Inflation Analysis</h4>
                    <p className="text-sm text-gray-600">
                      Inflation expected to decrease by 0.9% over next quarter based on current trend patterns.
                    </p>
                  </div>
                </>
              )}
              
              {userType === 'diplomatic' && (
                <div className="p-3 bg-blue-50 border border-blue-100 rounded-md">
                  <div className="flex items-center mb-1">
                    <Briefcase className="h-4 w-4 text-blue-600 mr-1.5" />
                    <h4 className="font-medium text-blue-800">Diplomatic Relations</h4>
                  </div>
                  <p className="text-sm text-blue-700">
                    Political stability improving by 3 points indicates favorable conditions for diplomatic initiatives in {selectedRegion}.
                  </p>
                </div>
              )}
              
              {userType === 'media' && (
                <div className="p-3 bg-purple-50 border border-purple-100 rounded-md">
                  <div className="flex items-center mb-1">
                    <PanelLeft className="h-4 w-4 text-purple-600 mr-1.5" />
                    <h4 className="font-medium text-purple-800">Media Environment</h4>
                  </div>
                  <p className="text-sm text-purple-700">
                    Media freedom index has improved to 68, showing gradual improvement in press conditions in {selectedRegion}.
                  </p>
                </div>
              )}
              
              {userType === 'general' && (
                <div className="space-y-3">
                  <div className="p-3 bg-gray-50 border border-gray-200 rounded-md flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center">
                      <Shield className="h-4 w-4 text-red-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800">Security View</h4>
                      <p className="text-xs text-gray-600">
                        Focus on security metrics and threats
                      </p>
                    </div>
                    <button 
                      className="ml-auto text-xs text-blue-600 hover:underline"
                      onClick={() => setUserType('security')}
                    >
                      Select
                    </button>
                  </div>
                  
                  <div className="p-3 bg-gray-50 border border-gray-200 rounded-md flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                      <Briefcase className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800">Economic View</h4>
                      <p className="text-xs text-gray-600">
                        Focus on economic indicators
                      </p>
                    </div>
                    <button 
                      className="ml-auto text-xs text-blue-600 hover:underline"
                      onClick={() => setUserType('economic')}
                    >
                      Select
                    </button>
                  </div>
                </div>
              )}
              
              <div className="flex justify-between items-center pt-2">
                <span className="text-xs text-gray-500">
                  {userType !== 'general' ? 'Insights tailored for your role' : 'Select a role for tailored insights'}
                </span>
                <button
                  onClick={() => router.push('/dashboard/profile/preferences')}
                  className="text-xs text-blue-600 hover:underline flex items-center"
                >
                  <User className="h-3 w-3 mr-1" />
                  Profile
                </button>
              </div>
            </div>
          </div>
          
          {/* Quick Links */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
            <h3 className="font-semibold text-gray-800 mb-3">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="/dashboard/reports" className="text-sm text-blue-600 hover:underline flex items-center">
                  <ExternalLink className="h-3.5 w-3.5 mr-2" />
                  View Related Reports
                </a>
              </li>
              <li>
                <a href="/dashboard/alerts" className="text-sm text-blue-600 hover:underline flex items-center">
                  <ExternalLink className="h-3.5 w-3.5 mr-2" />
                  Configure Trend Alerts
                </a>
              </li>
              <li>
                <a href="/dashboard/data-sources" className="text-sm text-blue-600 hover:underline flex items-center">
                  <ExternalLink className="h-3.5 w-3.5 mr-2" />
                  Manage Data Sources
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}