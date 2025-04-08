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
  trendData: ChartData<'line' | 'bar'> | null;
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

  const MAX_VISIBLE_METRICS = 5;
  const configNameInputRef = useRef<HTMLInputElement>(null);

  const generateTrendMetrics = useCallback((): TrendMetric[] => {
    // ... existing implementation ...
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
      
      data.push(Number(value.toFixed(1)));
    }
    
    return data;
  };

  // ... rest of the component implementation ...
}
