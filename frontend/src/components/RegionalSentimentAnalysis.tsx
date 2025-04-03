import React, { useState, useEffect } from 'react';
import { Heart, ChevronDown, Activity } from 'lucide-react';
import { 
  Chart as ChartJS,
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  Title, 
  Tooltip, 
  Legend, 
  Filler,
  ChartOptions,
  ScaleOptionsByType,
  ChartData
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { ChartTypeRegistry } from 'chart.js';

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

type SentimentSource = 'media' | 'social' | 'surveys' | 'all';

interface SentimentDataset {
  label: string;
  data: number[];
  fill: boolean;
  backgroundColor: string;
  borderColor: string;
  tension: number;
  hidden: boolean;
}

interface SentimentChartData {
  labels: string[];
  datasets: SentimentDataset[];
}

export default function RegionalSentimentAnalysis({ 
  selectedRegion, 
  selectedCountry,
  timeframe = '90' // in days
}: { 
  selectedRegion: string;
  selectedCountry?: string;
  timeframe?: string;
}) {
  const [chartData, setChartData] = useState<SentimentChartData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sentimentSource, setSentimentSource] = useState<SentimentSource>('all');
  
  // Mock sentiment topics
  const topics = ['Governance', 'Economy', 'Infrastructure', 'Security'];
  const [selectedTopic, setSelectedTopic] = useState<string>('All Topics');

  // Generate mock data based on the region, country and timeframe
  useEffect(() => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      // Generate data points representing sentiment over time
      const generateSentimentData = (count: number, baseline: number, volatility: number) => {
        const points = [];
        let value = baseline;
        
        for (let i = 0; i < count; i++) {
          // Add some random walk to simulate changing sentiment
          value += (Math.random() - 0.5) * volatility;
          // Constrain to reasonable sentiment range (0-100)
          value = Math.max(10, Math.min(90, value));
          
          points.push(value);
        }
        return points;
      };

      // Days array for x-axis
      const days = Array.from({ length: parseInt(timeframe) }, (_, i) => 
        `Day ${i+1}`
      );
      
      // Different baselines for each source
      const volatilityMultiplier = selectedCountry ? 2 : 1;
      
      // Generate sentiment data with different baselines and volatility
      const mediaSentiment = generateSentimentData(parseInt(timeframe), 55, 5 * volatilityMultiplier);
      const socialSentiment = generateSentimentData(parseInt(timeframe), 45, 8 * volatilityMultiplier);
      const surveySentiment = generateSentimentData(parseInt(timeframe), 60, 3 * volatilityMultiplier);
      
      // Setup data for the line chart
      const data = {
        labels: days,
        datasets: [
          {
            label: 'Media Outlets',
            data: mediaSentiment,
            fill: true,
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderColor: 'rgba(54, 162, 235, 1)',
            tension: 0.4,
            hidden: sentimentSource !== 'all' && sentimentSource !== 'media'
          },
          {
            label: 'Social Media',
            data: socialSentiment,
            fill: true,
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgba(255, 99, 132, 1)',
            tension: 0.4,
            hidden: sentimentSource !== 'all' && sentimentSource !== 'social'
          },
          {
            label: 'Public Surveys',
            data: surveySentiment,
            fill: true,
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            tension: 0.4,
            hidden: sentimentSource !== 'all' && sentimentSource !== 'surveys'
          }
        ]
      };
      
      setChartData(data);
      setIsLoading(false);
    }, 800);
  }, [selectedRegion, selectedCountry, timeframe, sentimentSource, selectedTopic]);
  
  const options: ChartOptions<'line'> = {
    scales: {
      x: {
        ticks: {
          maxRotation: 0,
          autoSkip: true,
          maxTicksLimit: 6,
        },
        grid: {
          display: false
        }
      },
      y: {
        min: 0,
        max: 100,
        ticks: {
          callback: function(tickValue: string | number) {
            const value = Number(tickValue);
            if (value === 0) return 'Very Negative';
            if (value === 50) return 'Neutral';
            if (value === 100) return 'Very Positive';
            return '';
          }
        }
      }
    },
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          usePointStyle: true,
          boxWidth: 6
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const value = context.parsed.y;
            return `Sentiment: ${typeof value === 'number' ? value.toFixed(2) : 'N/A'}`;
          },
        }
      },
    },
    maintainAspectRatio: false,
    responsive: true,
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-bold text-lg text-gray-800 flex items-center">
          <Heart className="h-5 w-5 mr-2 text-pink-500" />
          Regional Sentiment - {selectedCountry || selectedRegion}
        </h2>
        <div className="flex items-center space-x-2">
          <div className="relative">
            <select
              value={sentimentSource}
              onChange={(e) => setSentimentSource(e.target.value as SentimentSource)}
              className="bg-white border border-gray-300 rounded-md py-1.5 pl-3 pr-8 text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="all">All Sources</option>
              <option value="media">Media Only</option>
              <option value="social">Social Media Only</option>
              <option value="surveys">Surveys Only</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
          </div>
          
          <div className="relative">
            <select
              value={selectedTopic}
              onChange={(e) => setSelectedTopic(e.target.value)}
              className="bg-white border border-gray-300 rounded-md py-1.5 pl-3 pr-8 text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="All Topics">All Topics</option>
              {topics.map(topic => (
                <option key={topic} value={topic}>{topic}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
          </div>
        </div>
      </div>

      <div className="h-60 relative">
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-50 rounded">
            <div className="flex flex-col items-center">
              <Activity className="h-8 w-8 text-blue-500 animate-pulse" />
              <p className="mt-2 text-sm text-gray-600">Loading sentiment data...</p>
            </div>
          </div>
        ) : (
          <div className="h-full">
            {chartData && <Line data={chartData} options={options} />}
          </div>
        )}
      </div>
      
      <div className="mt-4 flex justify-between items-center pt-3 border-t border-gray-200 text-xs text-gray-500">
        <div>
          Showing {timeframe}-day sentiment trends
        </div>
        <div className="flex items-center">
          <span className="inline-block w-3 h-3 bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 rounded-full mr-2"></span>
          <span>Negative to Positive Scale</span>
        </div>
      </div>
    </div>
  );
}