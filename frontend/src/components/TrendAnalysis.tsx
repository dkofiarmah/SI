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
  ChartOptions
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
import type { ChartData } from 'chart.js';

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

// Define chart data types more precisely
type TrendChartData = ChartData<'line' | 'bar', number[]>;
type LineChartData = ChartData<'line', number[]>;
type BarChartData = ChartData<'bar', number[]>;

interface ChartDataset {
  label: string;
  data: number[];
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

interface TrendAnalysisProps {
  selectedRegion: string;
  selectedCountry?: string;
  timeframe: string;
  userType: UserType;
  comparisonEnabled?: boolean;
  onSaveConfiguration?: (config: TrendConfiguration) => void;
  savedConfigurations?: TrendConfiguration[];
}

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
  trendData: TrendChartData | null;
  showInfoPanel: boolean;
  selectedMetricInfo: TrendMetric | null;
}

interface GenerateTrendDataOptions {
  dataPoints: number;
  finalValue: number;
  previousValue: number;
}

type TrendDirection = 'up' | 'down' | 'stable';

interface TrendInfo {
  direction: TrendDirection;
  value: string;
  label: string;
}

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
  | { type: 'SET_TREND_DATA'; payload: TrendChartData | null };

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

const baseChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: {
      type: 'linear' as const,
      display: true,
      position: 'left' as const,
      grid: {
        color: '#f1f5f9',
        display: true
      },
      border: {
        display: false
      },
      ticks: {
        color: '#64748b',
        font: {
          size: 11,
          family: 'Inter'
        },
        padding: 8
      }
    },
    x: {
      grid: {
        display: false
      },
      border: {
        display: false
      },
      ticks: {
        color: '#64748b',
        font: {
          size: 11,
          family: 'Inter'
        },
        padding: 8
      }
    }
  },
  plugins: {
    legend: {
      display: false
    }
  }
} as const;

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

  const MAX_VISIBLE_METRICS = 5;
  const configNameInputRef = useRef<HTMLInputElement>(null);

  const generateTrendMetrics = useCallback((): TrendMetric[] => {
    // Default metrics for different user types and categories
    const metrics: TrendMetric[] = [
      {
        id: 'economic_growth',
        label: 'Economic Growth',
        category: 'economic',
        value: 3.5,
        previousValue: 2.8,
        change: 0.7,
        changeType: 'positive',
        unit: '%',
        color: '#10B981',
        relevantUserTypes: ['economic', 'general'],
        description: 'Year-over-year economic growth rate'
      },
      {
        id: 'political_stability',
        label: 'Political Stability',
        category: 'political',
        value: 72,
        previousValue: 68,
        change: 4,
        changeType: 'positive',
        unit: '',
        color: '#6366F1',
        relevantUserTypes: ['diplomatic', 'security', 'general'],
        description: 'Political stability index (0-100)'
      },
      {
        id: 'security_incidents',
        label: 'Security Incidents',
        category: 'security',
        value: 12,
        previousValue: 15,
        change: -3,
        changeType: 'positive',
        unit: '',
        color: '#F43F5E',
        relevantUserTypes: ['security', 'diplomatic', 'general'],
        description: 'Number of reported security incidents'
      },
      {
        id: 'social_sentiment',
        label: 'Social Sentiment',
        category: 'social',
        value: 65,
        previousValue: 62,
        change: 3,
        changeType: 'positive',
        unit: '%',
        color: '#8B5CF6',
        relevantUserTypes: ['media', 'diplomatic', 'general'],
        description: 'Overall social sentiment score'
      },
      {
        id: 'environmental_risk',
        label: 'Environmental Risk',
        category: 'environmental',
        value: 28,
        previousValue: 32,
        change: -4,
        changeType: 'positive',
        unit: '',
        color: '#059669',
        relevantUserTypes: ['general'],
        description: 'Environmental risk index'
      }
    ];

    // Filter metrics based on user type if not 'general'
    const filteredMetrics = userType === 'general' 
      ? metrics 
      : metrics.filter(metric => metric.relevantUserTypes.includes(userType));

    // Apply region-specific adjustments
    return filteredMetrics.map(metric => {
      let adjustment = 0;
      
      // Add some variance based on region
      switch (selectedRegion) {
        case 'West Africa':
          adjustment = Math.random() * 0.4 - 0.2; // -0.2 to +0.2
          break;
        case 'East Africa':
          adjustment = Math.random() * 0.3 - 0.1; // -0.1 to +0.2
          break;
        case 'North Africa':
          adjustment = Math.random() * 0.5 - 0.3; // -0.3 to +0.2
          break;
        default:
          adjustment = 0;
      }

      // Apply country-specific additional adjustment if country is selected
      if (selectedCountry) {
        adjustment += Math.random() * 0.2 - 0.1; // -0.1 to +0.1
      }

      const newValue = Number((metric.value * (1 + adjustment)).toFixed(1));
      const newPreviousValue = Number((metric.previousValue * (1 + adjustment)).toFixed(1));
      const newChange = Number((newValue - newPreviousValue).toFixed(1));
      
      return {
        ...metric,
        value: newValue,
        previousValue: newPreviousValue,
        change: newChange,
        changeType: newChange > 0 ? 'positive' : newChange < 0 ? 'negative' : 'neutral'
      };
    });
  }, [selectedRegion, selectedCountry, userType]);

  const generateTrendData = useCallback((metrics: TrendMetric[], visible: string[]): void => {
    const timeLabels = getTimeLabels();
    const datasets = metrics
      .filter(metric => visible.includes(metric.id))
      .map(metric => {
        const data = generateTrendDataForMetric({
          dataPoints: timeLabels.length,
          finalValue: metric.value,
          previousValue: metric.previousValue
        });
        
        const baseConfig: ChartDataset = {
          label: metric.label,
          data,
          borderColor: metric.color,
          backgroundColor: state.activeChartType === 'line' 
            ? `${metric.color}20`
            : metric.color,
          tension: 0.4,
          yAxisID: metric.category === 'economic' ? 'y' : 'y1'
        };
        
        return state.activeChartType === 'line'
          ? {
              ...baseConfig,
              fill: true,
              borderWidth: 3,
              pointRadius: 0,
              pointHoverRadius: 6
            }
          : {
              ...baseConfig,
              fill: true,
              borderWidth: 1,
              borderRadius: 4,
              barPercentage: 0.6,
              categoryPercentage: 0.8,
              barThickness: Math.max(8, Math.min(20, 90 / timeLabels.length))
            };
      });

    dispatch({ type: 'SET_TREND_DATA', payload: { labels: timeLabels, datasets } });
  }, [state.activeChartType]);

  const generateTrendDataForMetric = (options: GenerateTrendDataOptions): number[] => {
    const { dataPoints, finalValue, previousValue } = options;
    const data: number[] = [];
    let value = previousValue;
    const avgStep = (finalValue - value) / dataPoints;
    
    for (let i = 0; i < dataPoints; i++) {
      const noise = (Math.random() - 0.5) * Math.abs(avgStep) * 3;
      
      if (i === dataPoints - 1) {
        value = finalValue;
      } else {
        value += avgStep + noise;
        
        if (Math.random() > 0.95) {
          value += (Math.random() - 0.5) * Math.abs(avgStep) * 10;
        }
      }
      
      // Ensure we never push null values, use 0 as a fallback
      data.push(Number(value.toFixed(1)) || 0);
    }
    
    return data;
  };

  const getTimeLabels = (): string[] => {
    const numPoints = parseInt(timeframe, 10);
    const labels: string[] = [];
    const today = new Date();
    
    for (let i = numPoints - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(today.getDate() - i);
      labels.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
    }
    
    return labels;
  };

  // Load initial data
  useEffect(() => {
    const metrics = generateTrendMetrics();
    dispatch({ type: 'UPDATE_METRICS', payload: metrics });
    dispatch({ type: 'SET_VISIBLE_METRICS', payload: metrics.slice(0, MAX_VISIBLE_METRICS).map(m => m.id) });
    dispatch({ type: 'SET_LOADING', payload: false });
  }, [selectedRegion, selectedCountry, userType, generateTrendMetrics]);

  // Update chart data when visible metrics change
  useEffect(() => {
    if (state.trendMetrics.length && state.visibleMetrics.length) {
      generateTrendData(state.trendMetrics, state.visibleMetrics);
    }
  }, [state.trendMetrics, state.visibleMetrics, generateTrendData]);

  return (
    <div className="w-full h-full flex flex-col">
      {state.isLoading ? (
        <div className="flex items-center justify-center h-full">
          <RefreshCw className="w-6 h-6 animate-spin text-gray-400" />
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <button
                onClick={() => dispatch({ type: 'SET_CHART_TYPE', payload: 'line' })}
                className={`p-2 rounded ${state.activeChartType === 'line' ? 'bg-blue-100 text-blue-600' : 'text-gray-500'}`}
              >
                <Activity className="w-5 h-5" />
              </button>
              <button
                onClick={() => dispatch({ type: 'SET_CHART_TYPE', payload: 'bar' })}
                className={`p-2 rounded ${state.activeChartType === 'bar' ? 'bg-blue-100 text-blue-600' : 'text-gray-500'}`}
              >
                <BarChart className="w-5 h-5" />
              </button>
            </div>
          </div>

          {state.trendData && (
            <div className="flex-1 min-h-0">
              {state.activeChartType === 'line' ? (
                <Line 
                  data={state.trendData as LineChartData}
                  options={{
                    ...baseChartOptions,
                    interaction: {
                      mode: 'index',
                      intersect: false,
                    },
                    plugins: {
                      ...baseChartOptions.plugins,
                      tooltip: {
                        enabled: true,
                        mode: 'index',
                        intersect: false,
                        backgroundColor: 'white',
                        titleColor: '#0f172a',
                        bodyColor: '#334155',
                        borderColor: '#e2e8f0',
                        borderWidth: 1,
                        padding: 12,
                        titleFont: {
                          size: 12,
                          weight: 'bold',
                          family: 'Inter'
                        },
                        bodyFont: {
                          size: 12,
                          family: 'Inter'
                        },
                        displayColors: true,
                        boxWidth: 8,
                        boxHeight: 8,
                        usePointStyle: true,
                        callbacks: {
                          title: (items) => items[0]?.label || ''
                        }
                      }
                    }
                  }}
                />
              ) : (
                <Bar 
                  data={state.trendData as BarChartData}
                  options={{
                    ...baseChartOptions,
                    scales: {
                      ...baseChartOptions.scales,
                      y: {
                        ...baseChartOptions.scales.y,
                        beginAtZero: true
                      }
                    }
                  }}
                />
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
