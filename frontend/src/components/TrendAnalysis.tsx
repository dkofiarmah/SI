'use client';

import React, { useState, useEffect, useRef, useCallback, useReducer } from 'react';
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
  Filler,
  ChartOptions,
  ScriptableContext,
  TooltipItem
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import annotationPlugin from 'chartjs-plugin-annotation';
import { 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight, 
  Minus,
  Calendar, 
  AlertCircle, 
  AlertTriangle, 
  ShieldAlert,
  Info, 
  Save, 
  BarChart, 
  Activity,
  Settings, 
  Download, 
  RefreshCw,
  PieChart,
  BrainCircuit,
  Target,
  Plus,
  X,
  Eye,
  EyeOff,
  ExternalLink,
  Zap,
  Layers
} from 'lucide-react';
import EnhancedDashboardCard from './EnhancedDashboardCard';
import { calculateTrendMetrics, analyzeEconomicImpact, analyzeSentimentTrends } from '@/lib/utils/analysis';
import type { ChartData, ScriptableContext, TooltipCallbacks } from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  annotationPlugin
);

type UserType = 'security' | 'economic' | 'diplomatic' | 'media' | 'general';

type TrendMetric = {
  id: string;
  label: string;
  category: 'economic' | 'political' | 'security' | 'social' | 'environmental';
  value: number;
  previousValue: number;
  change: number;
  changeType: 'positive' | 'negative' | 'neutral';
  unit: string;
  color: string;
  relevantUserTypes: UserType[];
  description?: string;
};

type Anomaly = {
  id: string;
  metricId: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  description: string;
  timestamp: Date;
  possibleCauses: string[];
  potentialImpact: string;
  confidence: number;
};

type AnomalyAlert = {
  anomaly: Anomaly;
  metric: TrendMetric;
};

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

type ChartType = 'line' | 'bar';

// Define more specific types for chart options
interface ChartCustomOptions extends ChartOptions<ChartType> {
  scales: {
    y: {
      type: 'linear';
      display: boolean;
      position: 'left';
      title: {
        display: boolean;
        text: string;
        font: {
          size: number;
          weight: string;
          family: string;
        };
        color: string;
        padding: { bottom: number };
      };
      grid: {
        color: string;
        display: boolean;
      };
      border: {
        display: boolean;
      };
      ticks: {
        color: string;
        font: {
          size: number;
          family: string;
        };
        padding: number;
      };
    };
    y1: {
      type: 'linear';
      display: boolean;
      position: 'right';
      grid: {
        display: boolean;
      };
      border: {
        display: boolean;
      };
      ticks: {
        color: string;
        font: {
          size: number;
          family: string;
        };
        padding: number;
      };
    };
    x: {
      grid: {
        color: string;
        display: boolean;
      };
      border: {
        display: boolean;
      };
      ticks: {
        color: string;
        maxRotation: number;
        minRotation: number;
        font: {
          size: number;
          family: string;
        };
        padding: number;
        maxTicksLimit: number;
      };
    };
  };
}

interface ChartDataset {
  label: string;
  data: (number | null)[];
  borderColor: string;
  backgroundColor: string;
  yAxisID?: string;
  fill?: boolean;
  tension?: number;
  borderWidth?: number;
  pointRadius?: number;
  pointHoverRadius?: number;
  borderRadius?: number;
  barPercentage?: number;
  categoryPercentage?: number;
  barThickness?: number;
}

interface TrendChartData {
  labels: string[];
  datasets: ChartDataset[];
}

interface TrendAnalysisProps {
  selectedRegion: string;
  selectedCountry?: string;
  timeframe: string;
  userType: UserType;
  comparisonEnabled?: boolean;
  onSaveConfiguration?: (config: TrendConfiguration) => void;
  savedConfigurations?: TrendConfiguration[];
}

// Add before the component
interface TooltipCallbackContext {
  dataset: {
    label?: string;
  };
  parsed: {
    y: number | null;
  };
}

interface ChartTooltipCallbacks {
  labelPointStyle(context: TooltipCallbackContext): {
    pointStyle: 'circle';
    rotation: number;
  };
  label(context: TooltipCallbackContext): string;
}

// Add these type definitions before the component
interface TrendState {
  isLoading: boolean;
  lastUpdated: Date;
  activeChartType: 'line' | 'bar';
  trendMetrics: TrendMetric[];
  visibleMetrics: string[];
  anomalies: Anomaly[];
  activeAnomalyAlerts: AnomalyAlert[];
  selectedCategory: string | null;
  showConfigurationModal: boolean;
  configurationName: string;
  comparisonMode: boolean;
  comparisonRegion: string;
  trendData: ChartData<'line' | 'bar'> | null;
  showInfoPanel: boolean;
  selectedMetricInfo: TrendMetric | null;
}

// Add at the beginning of the file after imports
type StateAction = 
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'UPDATE_METRICS'; payload: TrendMetric[] }
  | { type: 'SET_VISIBLE_METRICS'; payload: string[] }
  | { type: 'SET_CHART_TYPE'; payload: 'line' | 'bar' }
  | { type: 'TOGGLE_COMPARISON_MODE' }
  | { type: 'SET_COMPARISON_REGION'; payload: string }
  | { type: 'SET_SELECTED_CATEGORY'; payload: string | null }
  | { type: 'SET_CONFIGURATION_NAME'; payload: string }
  | { type: 'SET_SHOW_CONFIGURATION_MODAL'; payload: boolean }
  | { type: 'SET_SHOW_INFO_PANEL'; payload: boolean }
  | { type: 'SET_SELECTED_METRIC_INFO'; payload: TrendMetric | null }
  | { type: 'SET_ANOMALIES'; payload: Anomaly[] }
  | { type: 'SET_ACTIVE_ANOMALY_ALERTS'; payload: AnomalyAlert[] }
  | { type: 'SET_TREND_DATA'; payload: ChartData<'line' | 'bar'> | null };

const stateReducer = (state: TrendState, action: StateAction): TrendState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'UPDATE_METRICS':
      return { ...state, trendMetrics: action.payload };
    case 'SET_VISIBLE_METRICS':
      return { ...state, visibleMetrics: action.payload };
    case 'SET_CHART_TYPE':
      return { ...state, activeChartType: action.payload };
    case 'TOGGLE_COMPARISON_MODE':
      return { ...state, comparisonMode: !state.comparisonMode };
    case 'SET_COMPARISON_REGION':
      return { ...state, comparisonRegion: action.payload };
    case 'SET_SELECTED_CATEGORY':
      return { ...state, selectedCategory: action.payload };
    case 'SET_CONFIGURATION_NAME':
      return { ...state, configurationName: action.payload };
    case 'SET_SHOW_CONFIGURATION_MODAL':
      return { ...state, showConfigurationModal: action.payload };
    case 'SET_SHOW_INFO_PANEL':
      return { ...state, showInfoPanel: action.payload };
    case 'SET_SELECTED_METRIC_INFO':
      return { ...state, selectedMetricInfo: action.payload };
    case 'SET_ANOMALIES':
      return { ...state, anomalies: action.payload };
    case 'SET_ACTIVE_ANOMALY_ALERTS':
      return { ...state, activeAnomalyAlerts: action.payload };
    case 'SET_TREND_DATA':
      return { ...state, trendData: action.payload };
    default:
      return state;
  }
};

export default function TrendAnalysis({
  selectedRegion,
  selectedCountry = '',
  timeframe = '30',
  userType = 'general',
  comparisonEnabled = false,
  onSaveConfiguration,
  savedConfigurations = []
}: TrendAnalysisProps) {
  const [state, dispatch] = useReducer(stateReducer, {
    isLoading: true,
    lastUpdated: new Date(),
    activeChartType: 'line',
    trendMetrics: [],
    visibleMetrics: [],
    anomalies: [],
    activeAnomalyAlerts: [],
    selectedCategory: null,
    showConfigurationModal: false,
    configurationName: '',
    comparisonMode: false,
    comparisonRegion: '',
    trendData: null,
    showInfoPanel: false,
    selectedMetricInfo: null
  });

  // Maximum number of metrics to display at once to prevent chart overcrowding
  const MAX_VISIBLE_METRICS = 5;
  
  // Refs
  const configNameInputRef = useRef<HTMLInputElement>(null);

  // Define the regions array before it's used
  const regions = ['North America', 'Europe', 'Asia Pacific', 'Latin America', 'Middle East & Africa'];

  // Get time labels based on selected timeframe
  const getTimeLabels = () => {
    const now = new Date();
    const labels = [];
    const days = parseInt(timeframe);
    
    // For shorter timeframes, show daily labels
    if (days <= 30) {
      for (let i = days - 1; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        labels.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
      }
    } 
    // For medium timeframes, show weekly labels
    else if (days <= 90) {
      const weeks = Math.ceil(days / 7);
      for (let i = weeks - 1; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - (i * 7));
        labels.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
      }
    }
    // For long timeframes, show monthly labels
    else {
      const months = Math.ceil(days / 30);
      for (let i = months - 1; i >= 0; i--) {
        const date = new Date(now);
        date.setMonth(date.getMonth() - i);
        labels.push(date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }));
      }
    }
    
    return labels;
  };
  
  // Generate trend metrics appropriate for the user type
  const generateTrendMetrics = useCallback(() => {
    // Create base metrics
    const baseMetrics: TrendMetric[] = [
      // Economic metrics
      {
        id: 'gdp-growth',
        label: 'GDP Growth',
        category: 'economic',
        value: 5.2,
        previousValue: 4.8,
        change: 0.4,
        changeType: 'positive',
        unit: '%',
        color: 'rgb(16, 185, 129)',
        relevantUserTypes: ['economic', 'general', 'diplomatic'],
        description: 'Annual GDP growth rate showing economic expansion or contraction.'
      },
      {
        id: 'inflation',
        label: 'Inflation Rate',
        category: 'economic',
        value: 6.8,
        previousValue: 7.2,
        change: -0.4,
        changeType: 'positive',
        unit: '%',
        color: 'rgb(245, 158, 11)',
        relevantUserTypes: ['economic', 'general', 'diplomatic'],
        description: 'Consumer price inflation showing purchasing power trends.'
      },
      {
        id: 'fdi',
        label: 'Foreign Investment',
        category: 'economic',
        value: 15.3,
        previousValue: 12.8,
        change: 2.5,
        changeType: 'positive',
        unit: '%',
        color: 'rgb(59, 130, 246)',
        relevantUserTypes: ['economic', 'diplomatic'],
        description: 'Year-over-year change in foreign direct investment.'
      },
      {
        id: 'unemployment',
        label: 'Unemployment',
        category: 'economic',
        value: 7.9,
        previousValue: 8.2,
        change: -0.3,
        changeType: 'positive',
        unit: '%',
        color: 'rgb(107, 114, 128)',
        relevantUserTypes: ['economic', 'general', 'diplomatic'],
        description: 'Percentage of workforce without employment.'
      },
      
      // Political metrics
      {
        id: 'political-stability',
        label: 'Political Stability',
        category: 'political',
        value: 65,
        previousValue: 62,
        change: 3,
        changeType: 'positive',
        unit: '',
        color: 'rgb(79, 70, 229)',
        relevantUserTypes: ['diplomatic', 'security', 'general'],
        description: 'Index measuring political stability from 0-100.'
      },
      {
        id: 'governance-effectiveness',
        label: 'Governance Effectiveness',
        category: 'political',
        value: 58,
        previousValue: 55,
        change: 3,
        changeType: 'positive',
        unit: '',
        color: 'rgb(139, 92, 246)',
        relevantUserTypes: ['diplomatic', 'general'],
        description: 'Index measuring effectiveness of governance from 0-100.'
      },
      {
        id: 'corruption-perception',
        label: 'Corruption Index',
        category: 'political',
        value: 42,
        previousValue: 39,
        change: 3,
        changeType: 'positive',
        unit: '',
        color: 'rgb(236, 72, 153)',
        relevantUserTypes: ['diplomatic', 'security'],
        description: 'Perception index measuring corruption levels from 0-100.'
      },
      
      // Security metrics
      {
        id: 'security-incidents',
        label: 'Security Incidents',
        category: 'security',
        value: 23,
        previousValue: 31,
        change: -8,
        changeType: 'positive',
        unit: '',
        color: 'rgb(239, 68, 68)',
        relevantUserTypes: ['security', 'diplomatic', 'general'],
        description: 'Number of significant security incidents reported.'
      },
      {
        id: 'crime-rate',
        label: 'Crime Rate',
        category: 'security',
        value: 12.4,
        previousValue: 13.8,
        change: -1.4,
        changeType: 'positive',
        unit: '%',
        color: 'rgb(248, 113, 113)',
        relevantUserTypes: ['security', 'general'],
        description: 'Rate of reported crimes per 1,000 people.'
      },
      {
        id: 'border-security',
        label: 'Border Security Index',
        category: 'security',
        value: 72,
        previousValue: 68,
        change: 4,
        changeType: 'positive',
        unit: '',
        color: 'rgb(220, 38, 38)',
        relevantUserTypes: ['security', 'diplomatic'],
        description: 'Index measuring border security effectiveness from 0-100.'
      },
      
      // Social metrics
      {
        id: 'public-sentiment',
        label: 'Public Sentiment',
        category: 'social',
        value: 58,
        previousValue: 52,
        change: 6,
        changeType: 'positive',
        unit: '',
        color: 'rgb(16, 185, 129)',
        relevantUserTypes: ['media', 'diplomatic', 'general'],
        description: 'Index of public sentiment from news and social media (0-100).'
      },
      {
        id: 'social-cohesion',
        label: 'Social Cohesion',
        category: 'social',
        value: 61,
        previousValue: 59,
        change: 2,
        changeType: 'positive',
        unit: '',
        color: 'rgb(52, 211, 153)',
        relevantUserTypes: ['media', 'security', 'diplomatic'],
        description: 'Measure of social cohesion and stability from 0-100.'
      },
      {
        id: 'media-freedom',
        label: 'Media Freedom',
        category: 'social',
        value: 68,
        previousValue: 65,
        change: 3,
        changeType: 'positive',
        unit: '',
        color: 'rgb(6, 182, 212)',
        relevantUserTypes: ['media', 'diplomatic'],
        description: 'Index measuring press freedom from 0-100.'
      },
      
      // Environmental metrics
      {
        id: 'environmental-risks',
        label: 'Environmental Risks',
        category: 'environmental',
        value: 42,
        previousValue: 38,
        change: 4,
        changeType: 'negative',
        unit: '',
        color: 'rgb(5, 150, 105)',
        relevantUserTypes: ['general', 'diplomatic'],
        description: 'Index of environmental risk factors from 0-100.'
      },
      {
        id: 'resource-stability',
        label: 'Resource Stability',
        category: 'environmental',
        value: 65,
        previousValue: 62,
        change: 3,
        changeType: 'positive',
        unit: '',
        color: 'rgb(4, 120, 87)',
        relevantUserTypes: ['economic', 'diplomatic'],
        description: 'Measure of stability in key resource availability from 0-100.'
      }
    ];
    
    // Apply regional variations to make data more realistic
    let adjustedMetrics = baseMetrics.map(metric => {
      let adjusted = {...metric};
      
      // Apply regional adjustments
      if (selectedRegion === 'East Africa') {
        if (metric.category === 'economic') {
          adjusted.value *= 1.05;
          adjusted.previousValue *= 1.05;
        }
        if (metric.id === 'security-incidents') {
          adjusted.value *= 0.9;
          adjusted.previousValue *= 0.9;
        }
      } else if (selectedRegion === 'West Africa') {
        if (metric.category === 'security') {
          adjusted.value *= 1.15;
          adjusted.previousValue *= 1.15;
        }
      } else if (selectedRegion === 'North Africa') {
        if (metric.category === 'political') {
          adjusted.value *= 0.95;
          adjusted.previousValue *= 0.95;
        }
      }
      
      // Apply country-specific adjustments
      if (selectedCountry === 'Kenya') {
        if (metric.id === 'gdp-growth') {
          adjusted.value = 5.7;
          adjusted.previousValue = 5.2;
          adjusted.change = 0.5;
        }
        if (metric.id === 'political-stability') {
          adjusted.value = 70;
          adjusted.previousValue = 65;
          adjusted.change = 5;
        }
      } else if (selectedCountry === 'Nigeria') {
        if (metric.id === 'inflation') {
          adjusted.value = 15.2;
          adjusted.previousValue = 16.8;
          adjusted.change = -1.6;
        }
      }
      
      // Recalculate change and change type
      adjusted.change = adjusted.value - adjusted.previousValue;
      
      // Determine if change is positive or negative based on the metric
      // For some metrics like inflation, a decrease is positive
      if (metric.id === 'inflation' || metric.id === 'unemployment' || 
          metric.id === 'security-incidents' || metric.id === 'crime-rate' ||
          metric.id === 'environmental-risks') {
        adjusted.changeType = adjusted.change < 0 ? 'positive' : 
                              adjusted.change > 0 ? 'negative' : 'neutral';
      } else {
        adjusted.changeType = adjusted.change > 0 ? 'positive' : 
                              adjusted.change < 0 ? 'negative' : 'neutral';
      }
      
      return adjusted;
    });
    
    dispatch({ type: 'UPDATE_METRICS', payload: adjustedMetrics });
    
    // Set visible metrics based on user type
    let initialVisibleMetrics: string[] = [];
    
    switch(userType) {
      case 'security':
        initialVisibleMetrics = adjustedMetrics
          .filter(m => m.category === 'security' || m.id === 'political-stability')
          .map(m => m.id);
        break;
      case 'economic':
        initialVisibleMetrics = adjustedMetrics
          .filter(m => m.category === 'economic' || m.id === 'political-stability')
          .map(m => m.id);
        break;
      case 'diplomatic':
        initialVisibleMetrics = adjustedMetrics
          .filter(m => m.category === 'political' || m.id === 'security-incidents' || m.id === 'public-sentiment')
          .map(m => m.id);
        break;
      case 'media':
        initialVisibleMetrics = adjustedMetrics
          .filter(m => m.category === 'social' || m.id === 'political-stability')
          .map(m => m.id);
        break;
      default: // general
        initialVisibleMetrics = adjustedMetrics
          .filter(m => ['gdp-growth', 'political-stability', 'security-incidents', 'public-sentiment'].includes(m.id))
          .map(m => m.id);
    }
    
    dispatch({ type: 'SET_VISIBLE_METRICS', payload: initialVisibleMetrics.slice(0, MAX_VISIBLE_METRICS) });
    
    // Generate chart data
    generateChartData(adjustedMetrics, initialVisibleMetrics.slice(0, MAX_VISIBLE_METRICS));
  }, [selectedRegion, selectedCountry, userType]);
  
  // Generate sample anomalies
  const generateAnomalies = useCallback(() => {
    // Create realistic anomalies based on region and timeframe
    const sampleAnomalies: Anomaly[] = [
      {
        id: 'anomaly-1',
        metricId: 'political-stability',
        severity: 'medium',
        description: 'Unusual drop in political stability detected in mid-March',
        timestamp: new Date(2025, 2, 15), // March 15, 2025
        possibleCauses: [
          'Regional election disputes',
          'Cabinet reshuffle announcement',
          'Opposition coalition changes'
        ],
        potentialImpact: 'May affect short-term governance effectiveness and foreign relations',
        confidence: 0.75
      },
      {
        id: 'anomaly-2',
        metricId: 'inflation',
        severity: 'high',
        description: 'Sudden spike in inflation rate exceeding 3-year trend boundaries',
        timestamp: new Date(2025, 3, 2), // April 2, 2025
        possibleCauses: [
          'Global oil price fluctuations',
          'Currency devaluation',
          'Supply chain disruptions'
        ],
        potentialImpact: 'Reduced consumer purchasing power and potential economic slowdown',
        confidence: 0.82
      },
      {
        id: 'anomaly-3',
        metricId: 'security-incidents',
        severity: 'critical',
        description: 'Unusual clustering of security incidents in northern regions',
        timestamp: new Date(2025, 3, 1), // April 1, 2025
        possibleCauses: [
          'Increased cross-border movement',
          'Seasonal migration patterns',
          'Organized group activity'
        ],
        potentialImpact: 'May indicate emerging security challenge requiring coordinated response',
        confidence: 0.88
      }
    ];
    
    // Filter anomalies relevant to the selected region and within timeframe
    const filteredAnomalies = sampleAnomalies.filter(anomaly => {
      const now = new Date();
      const daysAgo = parseInt(timeframe);
      const cutoffDate = new Date();
      cutoffDate.setDate(now.getDate() - daysAgo);
      
      return anomaly.timestamp >= cutoffDate;
    });
    
    dispatch({ type: 'SET_ANOMALIES', payload: filteredAnomalies });
    
    // Create anomaly alerts by matching anomalies with their metrics
    const alerts: AnomalyAlert[] = filteredAnomalies.map(anomaly => {
      const metric = state.trendMetrics.find(m => m.id === anomaly.metricId);
      return {
        anomaly,
        metric: metric!
      };
    }).filter(alert => alert.metric !== undefined);
    
    dispatch({ type: 'SET_ACTIVE_ANOMALY_ALERTS', payload: alerts });
  }, [timeframe, state.trendMetrics]);
  
  // Memoize the refresh handler to prevent setState in render
  const handleRefresh = useCallback(() => {
    dispatch({ type: 'SET_LOADING', payload: true });
    generateTrendMetrics();
    generateAnomalies();
    dispatch({ type: 'SET_LOADING', payload: false });
  }, [generateTrendMetrics, generateAnomalies]);
  
  // Generate mock trend data based on user type and region
  useEffect(() => {
    dispatch({ type: 'SET_LOADING', payload: true });
    
    // Simulate API call
    setTimeout(() => {
      // Generate metrics tailored to the user type
      generateTrendMetrics();
      // Generate sample anomalies
      generateAnomalies();
      
      dispatch({ type: 'SET_LOADING', payload: false });
    }, 800);
  }, [selectedRegion, selectedCountry, timeframe, userType, state.comparisonMode, state.comparisonRegion, generateTrendMetrics, generateAnomalies]);
  
  // Generate chart data for the trends
  const generateChartData = (metrics: TrendMetric[], visible: string[]): void => {
    const timeLabels = getTimeLabels();
    
    // Generate random but realistic data for each metric
    const datasets = metrics
      .filter(metric => visible.includes(metric.id))
      .map(metric => {
        // Generate realistic trend data
        const data = generateTrendDataForMetric(metric, timeLabels.length);
        
        // Base styling for all chart types
        const baseConfig = {
          label: metric.label,
          data: data,
          borderColor: metric.color,
          backgroundColor: state.activeChartType === 'line' 
            ? `${metric.color}20` // 20% opacity for line chart fills
            : metric.color, // Full color for bar charts
          tension: 0.4,
          yAxisID: metric.category === 'economic' ? 'y' : 'y1',
        };
        
        // Extended styling based on chart type
        if (state.activeChartType === 'line') {
          return {
            ...baseConfig,
            fill: true,
            borderWidth: 3,
            pointRadius: 0,
            pointHoverRadius: 6,
          };
        } else {
          // Bar chart specific styling
          return {
            ...baseConfig,
            fill: true,
            borderWidth: 1,
            borderRadius: 4,
            barPercentage: 0.6,
            categoryPercentage: 0.8,
            barThickness: Math.max(8, Math.min(20, 90 / timeLabels.length)), // Responsive bar width
          };
        }
      });
    
    dispatch({ type: 'SET_TREND_DATA', payload: { labels: timeLabels, datasets } });
  };
  
  // Helper function to generate realistic trend data for a metric
  const generateTrendDataForMetric = (metric: TrendMetric, dataPoints: number) => {
    const data = [];
    let value = metric.previousValue;
    const finalValue = metric.value;
    
    // Determine the average step to reach the final value
    const avgStep = (finalValue - value) / dataPoints;
    
    // Add some randomness to make the data look more realistic
    for (let i = 0; i < dataPoints; i++) {
      // Add some noise to the trend
      const noise = (Math.random() - 0.5) * Math.abs(avgStep) * 3;
      
      // Make sure we end up at the final value
      if (i === dataPoints - 1) {
        value = finalValue;
      } else {
        value += avgStep + noise;
        
        // Add occasional anomalies for more realistic data
        if (Math.random() > 0.95) {
          value += (Math.random() - 0.5) * Math.abs(avgStep) * 10;
        }
      }
      
      data.push(value.toFixed(1));
    }
    
    return data;
  };
  
  // Add type for chart options
type TrendChartOptions = ChartCustomOptions;

const getChartOptions = (): TrendChartOptions => {
  const options: TrendChartOptions = {
    responsive: true,
    interaction: {
      mode: 'index',
      intersect: false
    },
    plugins: {
      legend: {
        position: 'top',
        align: 'start',
        labels: {
          usePointStyle: true,
          boxWidth: 8,
          boxHeight: 8,
          padding: 15,
          font: { 
            size: 11,
            weight: '500',
            family: "'Inter', sans-serif"
          },
          color: '#334155'
        }
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        titleColor: '#111827',
        bodyColor: '#374151',
        borderColor: 'rgba(0, 0, 0, 0.1)',
        borderWidth: 1,
        padding: 12,
        cornerRadius: 6,
        boxPadding: 6,
        usePointStyle: true,
        callbacks: {
          labelPointStyle: function(context: TooltipCallbackContext): { pointStyle: 'circle'; rotation: number; } {
            return {
              pointStyle: 'circle',
              rotation: 0
            };
          },
          label: function(context: TooltipCallbackContext): string {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              const value = context.parsed.y;
              label += typeof value === 'number' ? value.toFixed(1) : value;
              const metric = state.trendMetrics.find(m => m.label === context.dataset.label);
              if (metric?.unit) {
                label += metric.unit;
              }
            }
            return label;
          }
        }
      }
    },
    scales: {
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        title: {
          display: true,
          text: 'Economic Metrics',
          font: { 
            size: 12,
            weight: '600',
            family: "'Inter', sans-serif"
          },
          color: '#334155',
          padding: { bottom: 10 }
        },
        grid: {
          color: 'rgba(203, 213, 225, 0.7)',
          display: true
        },
        border: {
          display: false
        },
        ticks: {
          color: '#64748b',
          font: {
            size: 10,
            family: "'Inter', sans-serif"
          },
          padding: 8
        }
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        grid: {
          display: false
        },
        border: {
          display: false
        },
        ticks: {
          color: '#64748b',
          font: {
            size: 10,
            family: "'Inter', sans-serif"
          },
          padding: 8
        }
      },
      x: {
        grid: {
          color: 'rgba(203, 213, 225, 0.4)',
          display: true
        },
        border: {
          display: false
        },
        ticks: {
          color: '#64748b',
          maxRotation: 45,
          minRotation: 0,
          font: {
            size: 10,
            family: "'Inter', sans-serif"
          },
          padding: 5,
          maxTicksLimit: 12
        }
      }
    },
    elements: {
      line: {
        tension: 0.4,
        borderWidth: 3,
        fill: true,
        borderJoinStyle: 'round'
      },
      point: {
        radius: 0,
        hoverRadius: 6,
        hitRadius: 6,
        borderWidth: 2,
        hoverBorderWidth: 2,
        hoverBorderColor: 'white'
      }
    }
  };

  return options;
};

// Update helper functions to use the type-safe state update
const toggleMetricVisibility = (metricId: string) => {
  const newVisibleMetrics = state.visibleMetrics.includes(metricId)
    ? state.visibleMetrics.filter(id => id !== metricId)
    : state.visibleMetrics.length >= MAX_VISIBLE_METRICS
      ? [...state.visibleMetrics.slice(1), metricId]
      : [...state.visibleMetrics, metricId];
  
  dispatch({ type: 'SET_VISIBLE_METRICS', payload: newVisibleMetrics });
  generateChartData(state.trendMetrics, newVisibleMetrics);
};

const toggleComparisonMode = () => {
  dispatch({ type: 'TOGGLE_COMPARISON_MODE' });
};

const saveCurrentConfiguration = () => {
  if (!state.configurationName.trim()) {
    if (configNameInputRef.current) {
      configNameInputRef.current.focus();
    }
    return;
  }
  
  const newConfig: TrendConfiguration = {
    id: `config-${Date.now()}`,
    name: state.configurationName,
    visibleDatasets: state.visibleMetrics,
    chartType: state.activeChartType,
    timeframe,
    region: selectedRegion,
    country: selectedCountry,
    compareMode: state.comparisonMode,
    compareWith: state.comparisonRegion,
    createdAt: new Date(),
    lastUsed: new Date()
  };
  
  onSaveConfiguration?.(newConfig);
  dispatch({ type: 'SET_CONFIGURATION_NAME', payload: '' });
  dispatch({ type: 'SET_SHOW_CONFIGURATION_MODAL', payload: false });
};

const showMetricInfo = (metric: TrendMetric) => {
  dispatch({ type: 'SET_SELECTED_METRIC_INFO', payload: metric });
  dispatch({ type: 'SET_SHOW_INFO_PANEL', payload: true });
};

  // Filter metrics by category
  const filteredMetrics = state.selectedCategory 
    ? state.trendMetrics.filter(metric => metric.category === state.selectedCategory)
    : state.trendMetrics;
  
  // Get card actions for dashboard card
  const getCardActions = (): JSX.Element => (
    <>
      <button className="w-full text-left px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100 rounded flex items-center">
        <Download className="h-3.5 w-3.5 mr-2 text-gray-500" />
        Export Data
      </button>
      <button className="w-full text-left px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100 rounded flex items-center">
        <BrainCircuit className="h-3.5 w-3.5 mr-2 text-gray-500" />
        Run AI Analysis
      </button>
      <button className="w-full text-left px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100 rounded flex items-center">
        <Target className="h-3.5 w-3.5 mr-2 text-gray-500" />
        Set Alerts
      </button>
    </>
  );
  
  // Get the trend status for the dashboard card based on anomalies
  const getTrendStatus = (): 'critical' | 'warning' | 'normal' => {
    if (state.activeAnomalyAlerts.some(a => a.anomaly.severity === 'critical')) {
      return 'critical';
    }
    if (state.activeAnomalyAlerts.some(a => a.anomaly.severity === 'high')) {
      return 'warning';
    }
    return 'normal';
  };
  
  // Determine overall trend direction for the dashboard card
  const getOverallTrend = () => {
    // Count positive and negative trends
    const positiveCount = state.trendMetrics.filter((m: TrendMetric) => 
      state.visibleMetrics.includes(m.id) && m.changeType === 'positive'
    ).length;
    
    const negativeCount = state.trendMetrics.filter((m: TrendMetric) => 
      state.visibleMetrics.includes(m.id) && m.changeType === 'negative'
    ).length;
    
    if (positiveCount > negativeCount) {
      return {
        direction: 'up' as const,
        value: 'Positive',
        label: 'overall trend'
      };
    } else if (negativeCount > positiveCount) {
      return {
        direction: 'down' as const,
        value: 'Negative',
        label: 'overall trend'
      };
    }
    
    return {
      direction: 'stable' as const,
      value: 'Stable',
      label: 'overall trend'
    };
  };
  
  // Render the configuration modal
  const renderConfigurationModal = () => {
    if (!state.showConfigurationModal) return null;
    
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg w-[500px] p-6">
          <h3 className="text-lg font-bold mb-4">Save Current Configuration</h3>
          
          <div className="mb-4">
            <label htmlFor="configName" className="block text-sm font-medium text-gray-700 mb-1">
              Configuration Name
            </label>
            <input
              ref={configNameInputRef}
              id="configName"
              type="text"
              value={state.configurationName}
              onChange={(e) => dispatch({ type: 'SET_CONFIGURATION_NAME', payload: e.target.value })}
              placeholder="My Trend Analysis Configuration"
              className="w-full p-2 border border-gray-300 rounded-md"
              autoFocus
            />
          </div>
          
          <div className="bg-gray-50 border border-gray-100 rounded-md p-4 mb-4">
            <h4 className="font-medium text-sm mb-2">Configuration Details</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Chart Type: {state.activeChartType === 'line' ? 'Line Chart' : 'Bar Chart'}</li>
              <li>• Visible Metrics: {state.visibleMetrics.length}</li>
              <li>• Time Range: {timeframe} days</li>
              <li>• Region: {selectedRegion}</li>
              {selectedCountry && <li>• Country: {selectedCountry}</li>}
              <li>• Comparison Mode: {state.comparisonMode ? 'Enabled' : 'Disabled'}</li>
            </ul>
          </div>
          
          <div className="flex justify-end gap-2">
            <button
              onClick={() => dispatch({ type: 'SET_SHOW_CONFIGURATION_MODAL', payload: false })}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm"
            >
              Cancel
            </button>
            <button
              onClick={saveCurrentConfiguration}
              className="px-4 py-2 bg-teal-600 text-white rounded-md text-sm hover:bg-teal-700"
            >
              Save Configuration
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  // Render the metric info panel
  const renderInfoPanel = () => {
    if (!state.showInfoPanel || !state.selectedMetricInfo) return null;
    
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg w-[600px] max-h-[80vh] overflow-y-auto p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold flex items-center">
              <span className="w-4 h-4 rounded-full mr-2" style={{ backgroundColor: state.selectedMetricInfo.color }}></span>
              {state.selectedMetricInfo.label}
            </h3>
            <button 
              onClick={() => dispatch({ type: 'SET_SHOW_INFO_PANEL', payload: false })}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm">Current Value</span>
              <span className="font-bold text-lg">{state.selectedMetricInfo.value}{state.selectedMetricInfo.unit}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-gray-600 text-sm">Change</span>
              <span className={`font-medium flex items-center ${
                state.selectedMetricInfo.changeType === 'positive' ? 'text-green-600' :
                state.selectedMetricInfo.changeType === 'negative' ? 'text-red-600' :
                'text-gray-600'
              }`}>
                {state.selectedMetricInfo.changeType === 'positive' ? (
                  <ArrowUpRight className="h-4 w-4 mr-1" />
                ) : state.selectedMetricInfo.changeType === 'negative' ? (
                  <ArrowDownRight className="h-4 w-4 mr-1" />
                ) : (
              <li>• Time Range: {timeframe} days</li>
              <li>• Region: {selectedRegion}</li>
              {selectedCountry && <li>• Country: {selectedCountry}</li>}
              <li>• Comparison Mode: {state.comparisonMode ? 'Enabled' : 'Disabled'}</li>
            </ul>
          </div>
          
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setState(prevState => ({
                ...prevState,
                showConfigurationModal: false
              }))}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm"
            >
              Cancel
            </button>
            <button
              onClick={saveCurrentConfiguration}
              className="px-4 py-2 bg-teal-600 text-white rounded-md text-sm hover:bg-teal-700"
            >
              Save Configuration
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  // Render the metric info panel
  const renderInfoPanel = () => {
    if (!state.showInfoPanel || !state.selectedMetricInfo) return null;
    
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg w-[600px] max-h-[80vh] overflow-y-auto p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold flex items-center">
              <span className="w-4 h-4 rounded-full mr-2" style={{ backgroundColor: state.selectedMetricInfo.color }}></span>
              {state.selectedMetricInfo.label}
            </h3>
            <button 
              onClick={() => setState(prevState => ({
                ...prevState,
                showInfoPanel: false
              }))}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm">Current Value</span>
              <span className="font-bold text-lg">{state.selectedMetricInfo.value}{state.selectedMetricInfo.unit}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-gray-600 text-sm">Change</span>
              <span className={`font-medium flex items-center ${
                state.selectedMetricInfo.changeType === 'positive' ? 'text-green-600' :
                state.selectedMetricInfo.changeType === 'negative' ? 'text-red-600' :
                'text-gray-600'
              }`}>
                {state.selectedMetricInfo.changeType === 'positive' ? (
                  <ArrowUpRight className="h-4 w-4 mr-1" />
                ) : state.selectedMetricInfo.changeType === 'negative' ? (
                  <ArrowDownRight className="h-4 w-4 mr-1" />
                ) : (
                  <Minus className="h-4 w-4 mr-1" />
                )}
                {state.selectedMetricInfo.change > 0 ? '+' : ''}{state.selectedMetricInfo.change}{state.selectedMetricInfo.unit}
              </span>
            </div>
          </div>
          
          <div className="bg-gray-50 rounded-md p-4 mb-4">
            <h4 className="font-medium mb-2">Description</h4>
            <p className="text-sm text-gray-700">{state.selectedMetricInfo.description}</p>
          </div>
          
          {/* Related anomalies */}
          <div className="mb-4">
            <h4 className="font-medium mb-2">Related Anomalies</h4>
            {state.anomalies.filter(a => a.metricId === state.selectedMetricInfo.id).length > 0 ? (
              <ul className="space-y-2">
                {state.anomalies
                  .filter(a => a.metricId === state.selectedMetricInfo.id)
                  .map(anomaly => (
                    <li key={anomaly.id} className={`p-3 rounded-md border ${
                      anomaly.severity === 'critical' ? 'border-red-200 bg-red-50' :
                      anomaly.severity === 'high' ? 'border-orange-200 bg-orange-50' :
                      anomaly.severity === 'medium' ? 'border-yellow-200 bg-yellow-50' :
                      'border-blue-200 bg-blue-50'
                    }`}>
                      <div className="flex items-center mb-1">
                        {anomaly.severity === 'critical' ? (
                          <ShieldAlert className="h-4 w-4 text-red-600 mr-1.5" />
                        ) : anomaly.severity === 'high' ? (
                          <AlertCircle className="h-4 w-4 text-orange-600 mr-1.5" />
                        ) : (
                          <AlertTriangle className="h-4 w-4 text-yellow-600 mr-1.5" />
                        )}
                        <span className="font-medium text-sm">
                          {anomaly.severity.charAt(0).toUpperCase() + anomaly.severity.slice(1)} Anomaly Detected
                        </span>
                      </div>
                      <p className="text-sm mb-2">{anomaly.description}</p>
                      <div className="text-xs flex justify-between">
                        <span>{anomaly.timestamp.toLocaleDateString()}</span>
                        <span>{Math.round(anomaly.confidence * 100)}% confidence</span>
                      </div>
                    </li>
                  ))
                }
              </ul>
            ) : (
              <p className="text-sm text-gray-600">No anomalies detected for this metric.</p>
            )}
          </div>
          
          <div className="flex justify-between">
            <button
              onClick={() => window.open(`/dashboard/trends-analysis/metric/${state.selectedMetricInfo.id}`, '_blank')}
              className="text-blue-600 text-sm hover:underline flex items-center"
            >
              View Detailed Analysis
              <ExternalLink className="h-3.5 w-3.5 ml-1" />
            </button>
            
            <button
              onClick={() => setState(prevState => ({
                ...prevState,
                showInfoPanel: false
              }))}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md text-sm hover:bg-gray-200"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  return (
    <EnhancedDashboardCard
      title={`Trend Analysis - ${selectedCountry || selectedRegion}`}
      icon={<TrendingUp className="h-5 w-5 text-teal-600" />}
      lastUpdated={state.lastUpdated}
      status={getTrendStatus()}
      trend={getOverallTrend()}
      isLoading={state.isLoading}
      refreshInterval={120}
      onRefresh={handleRefresh}
      infoTooltip="This card shows multi-dimensional trend analysis across various metrics, tailored to your role. Anomalies are automatically detected and highlighted."
      actions={getCardActions()}
      isCollapsible={true}
      allowFavorite={true}
    >
      {/* Top Controls Row */}
      <div className="flex flex-wrap justify-between items-center mb-3">
        <div className="flex items-center gap-2">
          <button
            className={`px-2 py-1 text-xs rounded ${state.activeChartType === 'line' ? 'bg-teal-100 text-teal-700' : 'bg-gray-100 text-gray-700'}`}
            onClick={() => {
              setState(prevState => ({
                ...prevState,
                activeChartType: 'line'
              }));
              if (state.trendData) {
                generateChartData(state.trendMetrics, state.visibleMetrics);
              }
            }}
          >
            Line Chart
          </button>
          <button
            className={`px-2 py-1 text-xs rounded ${state.activeChartType === 'bar' ? 'bg-teal-100 text-teal-700' : 'bg-gray-100 text-gray-700'}`}
            onClick={() => {
              setState(prevState => ({
                ...prevState,
                activeChartType: 'bar'
              }));
              if (state.trendData) {
                generateChartData(state.trendMetrics, state.visibleMetrics);
              }
            }}
          >
            Bar Chart
          </button>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => setState(prevState => ({
              ...prevState,
              showConfigurationModal: true
            }))}
            className="flex items-center text-xs px-2 py-1 border border-gray-200 rounded hover:bg-gray-50"
          >
            <Save className="h-3 w-3 mr-1 text-gray-600" />
            Save View
          </button>
          
          {comparisonEnabled && (
            <button
              onClick={toggleComparisonMode}
              className={`flex items-center text-xs px-2 py-1 border rounded ${
                state.comparisonMode 
                  ? 'border-teal-200 bg-teal-50 text-teal-700' 
                  : 'border-gray-200 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Layers className="h-3 w-3 mr-1" />
              {state.comparisonMode ? 'Comparison On' : 'Compare'}
            </button>
          )}
        </div>
      </div>
      
      {/* Comparison Region Selector (if comparison mode is on) */}
      {state.comparisonMode && comparisonEnabled && (
        <div className="mb-4 p-3 bg-teal-50 border border-teal-100 rounded-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Layers className="h-4 w-4 text-teal-600 mr-1.5" />
              <span className="text-sm font-medium text-teal-800">Region Comparison</span>
            </div>
            <button
              onClick={toggleComparisonMode}
              className="text-teal-700 hover:text-teal-900"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          
          <div className="mt-2 flex items-center">
            <span className="text-xs text-teal-600 mr-2">Compare with:</span>
            <select
              value={state.comparisonRegion}
              onChange={(e) => setState(prevState => ({
                ...prevState,
                comparisonRegion: e.target.value
              }))}
              className="text-xs border border-teal-200 rounded bg-white py-1 px-2"
            >
              <option value="">Select a region</option>
              {regions.filter(r => r !== selectedRegion).map(region => (
                <option key={region} value={region}>{region}</option>
              ))}
            </select>
          </div>
        </div>
      )}
      
      {/* Category Filter Buttons */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <span className="text-xs text-gray-500">Filter by:</span>
        <button
          onClick={() => setState(prevState => ({
            ...prevState,
            selectedCategory: null
          }))}
          className={`px-2 py-1 text-xs rounded-full ${
            state.selectedCategory === null 
              ? 'bg-blue-100 text-blue-700' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          All
        </button>
        <button
          onClick={() => setState(prevState => ({
            ...prevState,
            selectedCategory: 'economic'
          }))}
          className={`px-2 py-1 text-xs rounded-full ${
            state.selectedCategory === 'economic' 
              ? 'bg-green-100 text-green-700' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Economic
        </button>
        <button
          onClick={() => setState(prevState => ({
            ...prevState,
            selectedCategory: 'political'
          }))}
          className={`px-2 py-1 text-xs rounded-full ${
            state.selectedCategory === 'political' 
              ? 'bg-purple-100 text-purple-700' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Political
        </button>
        <button
          onClick={() => setState(prevState => ({
            ...prevState,
            selectedCategory: 'security'
          }))}
          className={`px-2 py-1 text-xs rounded-full ${
            state.selectedCategory === 'security' 
              ? 'bg-red-100 text-red-700' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Security
        </button>
        <button
          onClick={() => setState(prevState => ({
            ...prevState,
            selectedCategory: 'social'
          }))}
          className={`px-2 py-1 text-xs rounded-full ${
            state.selectedCategory === 'social' 
              ? 'bg-blue-100 text-blue-700' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Social
        </button>
        <button
          onClick={() => setState(prevState => ({
            ...prevState,
            selectedCategory: 'environmental'
          }))}
          className={`px-2 py-1 text-xs rounded-full ${
            state.selectedCategory === 'environmental' 
              ? 'bg-emerald-100 text-emerald-700' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Environmental
        </button>
      </div>
      
      {/* Anomaly Alerts */}
      {state.activeAnomalyAlerts.length > 0 && (
        <div className="mb-4">
          <h3 className="text-sm font-medium mb-2 flex items-center">
            <AlertTriangle className="h-4 w-4 text-yellow-500 mr-1.5" />
            Detected Anomalies
          </h3>
          <div className="space-y-2">
            {state.activeAnomalyAlerts.map(alert => (
              <div
                key={alert.anomaly.id}
                className={`p-3 rounded-md border ${
                  alert.anomaly.severity === 'critical' ? 'border-red-200 bg-red-50' :
                  alert.anomaly.severity === 'high' ? 'border-orange-200 bg-orange-50' :
                  alert.anomaly.severity === 'medium' ? 'border-yellow-200 bg-yellow-50' :
                  'border-blue-200 bg-blue-50'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-start">
                    {alert.anomaly.severity === 'critical' ? (
                      <ShieldAlert className="h-4 w-4 text-red-600 mr-1.5 mt-0.5" />
                    ) : alert.anomaly.severity === 'high' ? (
                      <AlertCircle className="h-4 w-4 text-orange-600 mr-1.5 mt-0.5" />
                    ) : (
                      <AlertTriangle className="h-4 w-4 text-yellow-600 mr-1.5 mt-0.5" />
                    )}
                    <div>
                      <div className="font-medium text-sm">
                        {alert.metric.label}: {alert.anomaly.description}
                      </div>
                      <div className="text-xs text-gray-600 mt-0.5">
                        {alert.anomaly.timestamp.toLocaleDateString()} • 
                        <span className="ml-1">{Math.round(alert.anomaly.confidence * 100)}% confidence</span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => showMetricInfo(alert.metric)}
                    className="text-xs text-blue-600 hover:underline"
                  >
                    Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Main Chart */}
      <div className="h-60 bg-white border border-gray-200 rounded-md p-4 mb-4">
        {state.trendData ? (
          state.activeChartType === 'line' ? (
            <Line data={state.trendData} options={getChartOptions()} />
          ) : (
            <Bar data={state.trendData} options={getChartOptions()} />
          )
        ) : (
          <div className="h-full flex items-center justify-center">
            <p className="text-gray-500">No data available</p>
          </div>
        )}
      </div>
      
      {/* Metric Toggles */}
      <div>
        <h3 className="text-sm font-medium mb-2">Available Metrics</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {filteredMetrics.map(metric => (
            <div
              key={metric.id}
              onClick={() => toggleMetricVisibility(metric.id)}
              className={`flex items-center p-2 rounded-md text-xs cursor-pointer ${
                state.visibleMetrics.includes(metric.id)
                  ? 'bg-gray-100 border border-gray-200'
                  : 'border border-gray-100 hover:bg-gray-50'
              }`}
            >
              {state.visibleMetrics.includes(metric.id) ? (
                <Eye className="h-3.5 w-3.5 mr-1.5 text-gray-600" />
              ) : (
                <EyeOff className="h-3.5 w-3.5 mr-1.5 text-gray-400" />
              )}
              <span className={state.visibleMetrics.includes(metric.id) ? 'font-medium' : ''}>
                {metric.label}
              </span>
              <div className="ml-auto flex items-center">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    showMetricInfo(metric);
                  }}
                  className="p-0.5 hover:bg-gray-200 rounded"
                >
                  <Info className="h-3 w-3 text-gray-500" />
                </button>
              </div>
            </div>
          ))}
        </div>
        {/* Maximum metrics notification */}
        {state.visibleMetrics.length >= MAX_VISIBLE_METRICS && (
          <div className="mt-2 text-xs text-amber-700 bg-amber-50 p-2 rounded-md border border-amber-200 flex items-center">
            <AlertTriangle className="h-3.5 w-3.5 mr-1.5 text-amber-600" />
            Maximum of {MAX_VISIBLE_METRICS} metrics can be displayed at once for better readability. To add another metric, first remove one.
          </div>
        )}
      </div>
      
      {/* Key Insights */}
      <div className="mt-4 p-3 bg-blue-50 border border-blue-100 rounded-md">
        <p className="font-medium text-blue-800 text-sm mb-1 flex items-center">
          <Zap className="h-4 w-4 mr-1.5" />
          Key Insight
        </p>
        <p className="text-xs text-blue-700">
          {userType === 'security' ? (
            <>Security incidents have decreased by 8% over the past {timeframe} days, showing improvement in overall security measures. Political stability remains a correlated factor.</>
          ) : userType === 'economic' ? (
            <>Economic indicators show positive momentum with GDP growth at 5.2% and falling inflation. Foreign investment has increased 15.3% year-over-year.</>
          ) : userType === 'diplomatic' ? (
            <>Political stability index has improved by 3 points with governance effectiveness following a similar trend. Social sentiment has improved significantly.</>
          ) : userType === 'media' ? (
            <>Media freedom index has improved to 68, with social cohesion showing positive correlation. Public sentiment trend is positive across the region.</>
          ) : (
            <>Multiple indicators show positive trends across {selectedCountry || selectedRegion}, with economic growth and political stability showing strong positive correlation.</>
          )}
        </p>
      </div>
      
      {/* Configuration Modal */}
      {renderConfigurationModal()}
      
      {/* Metric Info Panel */}
      {renderInfoPanel()}
    </EnhancedDashboardCard>
  );
}
