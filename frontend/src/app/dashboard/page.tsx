'use client';

import React, { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { 
  BarChart4, Users, Building2, MapPin, 
  Calendar, Flag, Newspaper, TrendingUp, 
  AlertTriangle, BrainCircuit, Search,
  Lightbulb, Star, Eye, ArrowRight
} from 'lucide-react';
import Link from 'next/link';
import DashboardHeader from '@/components/DashboardHeader';
import RiskForecast from '@/components/RiskForecast';
import DataSourceSelector from '@/components/DataSourceSelector';
import EnhancedDashboardCard from '@/components/EnhancedDashboardCard';
import StabilityMap from '@/components/StabilityMap';
import TrendAnalysis from '@/components/TrendAnalysis';
import RegionalSentimentAnalysis from '@/components/RegionalSentimentAnalysis';

export default function DashboardPage() {
  const { user, isLoaded } = useUser();
  const [showWelcomeGuide, setShowWelcomeGuide] = useState(true);
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Sample quick insights data - in production this would come from an API
  const quickInsights = [
    {
      id: 1,
      title: "Emerging Risk: Infrastructure Project Delays",
      description: "Three major infrastructure projects in Ghana are facing significant delays due to supply chain disruptions.",
      entityType: "Events",
      impact: "high",
      date: "2 hours ago"
    },
    {
      id: 2,
      title: "New Connection Identified",
      description: "Previously unknown connection between Ghana National Petroleum Corp and East African energy startups revealed.",
      entityType: "Organizations",
      impact: "medium",
      date: "Yesterday"
    },
    {
      id: 3,
      title: "Stability Change: Western Region",
      description: "Stability index for Ghana's Western Region has improved by 12% over the last month.",
      entityType: "Places",
      impact: "positive",
      date: "3 days ago"
    }
  ];

  // Frequently tracked entities - would come from user preferences in production
  const trackedEntities = [
    { id: 1, name: "Ghana National Petroleum Corporation", type: "organization" },
    { id: 2, name: "Accra Tech Ecosystem", type: "topic" },
    { id: 3, name: "Western Region", type: "place" },
    { id: 4, name: "Jean Mensa", type: "person" }
  ];

  if (!isLoaded) {
    return <div className="h-full w-full flex items-center justify-center">
      <div className="h-12 w-12 rounded-full border-4 border-blue-600 border-t-transparent animate-spin"></div>
    </div>;
  }
  
  return (
    <div className="min-h-full p-6 pb-20">
      <DashboardHeader 
        title="African Intelligence Platform" 
        description="Transform fragmented data into actionable insights across Ghana and Africa" 
      />

      {/* Welcome Message & Value Proposition */}
      {showWelcomeGuide && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-5 mb-6 border border-blue-100 shadow-sm relative">
          <button 
            onClick={() => setShowWelcomeGuide(false)}
            className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
            aria-label="Dismiss welcome message"
          >
            ×
          </button>
          <div className="flex items-start space-x-4">
            <div className="bg-blue-100 p-3 rounded-full">
              <BrainCircuit className="h-6 w-6 text-blue-700" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Welcome to Savannah Intelligence</h2>
              <p className="text-gray-600 mb-4">
                <span className="font-medium">Make smarter decisions with comprehensive African intelligence</span>. 
                We connect the dots between people, organizations, places, and events to reveal hidden insights and 
                help you stay ahead of emerging trends and risks across Africa.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div className="bg-white/80 backdrop-blur-sm p-3 rounded-lg shadow-sm border border-blue-100">
                  <h3 className="font-medium text-blue-800 mb-1 flex items-center">
                    <Users className="h-4 w-4 mr-1.5" /> Entity Intelligence
                  </h3>
                  <p className="text-sm text-gray-600">
                    360° profiles with key relationships, risks, and opportunities at a glance.
                  </p>
                </div>
                <div className="bg-white/80 backdrop-blur-sm p-3 rounded-lg shadow-sm border border-blue-100">
                  <h3 className="font-medium text-blue-800 mb-1 flex items-center">
                    <Newspaper className="h-4 w-4 mr-1.5" /> Real-time Analysis
                  </h3>
                  <p className="text-sm text-gray-600">
                    AI-powered news monitoring and analysis that finds signals in the noise.
                  </p>
                </div>
                <div className="bg-white/80 backdrop-blur-sm p-3 rounded-lg shadow-sm border border-blue-100">
                  <h3 className="font-medium text-blue-800 mb-1 flex items-center">
                    <TrendingUp className="h-4 w-4 mr-1.5" /> Risk Forecasting
                  </h3>
                  <p className="text-sm text-gray-600">
                    Anticipate changes with predictive analytics and scenario planning.
                  </p>
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition duration-150 flex items-center">
                  Start exploring entities <Search className="ml-1.5 h-4 w-4" />
                </button>
                <a href="#" className="ml-4 text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center">
                  Watch 2-min tutorial <Calendar className="ml-1.5 h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Current Date and Critical Alerts Summary */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 space-y-4 md:space-y-0">
        <div>
          <p className="text-sm text-gray-500">{currentDate}</p>
          <h2 className="text-lg font-medium text-gray-800">
            Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 18 ? 'afternoon' : 'evening'}, 
            {user?.firstName ? ` ${user.firstName}` : ''}
          </h2>
        </div>
        <div className="flex items-center space-x-1 bg-red-50 px-3 py-1.5 rounded-full border border-red-100">
          <AlertTriangle className="h-4 w-4 text-red-500" />
          <span className="text-sm font-medium text-red-600">3 new critical alerts</span>
          <Link href="/dashboard/alerts" className="text-xs bg-red-100 hover:bg-red-200 text-red-800 px-2 py-0.5 rounded-full ml-2">
            View all
          </Link>
        </div>
      </div>

      {/* Quick Insights Section - NEW */}
      <div className="mb-8 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="border-b border-gray-100 bg-gradient-to-r from-blue-50 to-blue-100 px-6 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <Lightbulb className="h-5 w-5 text-amber-500 mr-2" />
            <h3 className="font-medium text-gray-800">Quick Insights</h3>
          </div>
          <Link href="/dashboard/alerts" className="text-sm text-blue-600 hover:text-blue-800 flex items-center">
            View all insights <ArrowRight className="ml-1 h-3 w-3" />
          </Link>
        </div>
        <div className="p-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {quickInsights.map(insight => (
              <div key={insight.id} className={`p-4 rounded-lg border ${
                insight.impact === 'high' ? 'border-red-100 bg-red-50' : 
                insight.impact === 'medium' ? 'border-amber-100 bg-amber-50' : 
                'border-green-100 bg-green-50'
              }`}>
                <div className="flex items-start justify-between mb-2">
                  <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-white border border-gray-200">
                    {insight.entityType}
                  </span>
                  <span className="text-xs text-gray-500">{insight.date}</span>
                </div>
                <h4 className="font-medium text-gray-800 mb-1">{insight.title}</h4>
                <p className="text-sm text-gray-600 mb-3">{insight.description}</p>
                <button className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center">
                  View details <ArrowRight className="ml-1 h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Entities You Track - NEW */}
      <div className="mb-8 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="border-b border-gray-100 bg-gradient-to-r from-indigo-50 to-indigo-100 px-6 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <Star className="h-5 w-5 text-indigo-500 mr-2" />
            <h3 className="font-medium text-gray-800">Entities You Track</h3>
          </div>
          <button className="text-sm text-indigo-600 hover:text-indigo-800 flex items-center">
            Manage tracked entities <ArrowRight className="ml-1 h-3 w-3" />
          </button>
        </div>
        <div className="p-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {trackedEntities.map(entity => (
              <div key={entity.id} className="p-3 rounded-lg border border-gray-200 hover:border-indigo-200 bg-white hover:bg-indigo-50 transition-colors cursor-pointer">
                <div className="flex items-center mb-2">
                  {entity.type === 'organization' && <Building2 className="h-4 w-4 text-indigo-500 mr-1.5" />}
                  {entity.type === 'person' && <Users className="h-4 w-4 text-indigo-500 mr-1.5" />}
                  {entity.type === 'place' && <MapPin className="h-4 w-4 text-indigo-500 mr-1.5" />}
                  {entity.type === 'topic' && <Newspaper className="h-4 w-4 text-indigo-500 mr-1.5" />}
                  <span className="text-xs text-gray-500 capitalize">{entity.type}</span>
                </div>
                <h4 className="font-medium text-gray-800 text-sm">{entity.name}</h4>
                <div className="flex items-center mt-2 text-xs text-indigo-600">
                  <Eye className="h-3 w-3 mr-1" /> View profile
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Search and Entity Access */}
      <div className="bg-white rounded-xl p-5 mb-6 shadow-sm border border-gray-200">
        <h2 className="text-lg font-medium text-gray-800 mb-4">Quick Entity Access</h2>
        <div className="relative w-full mb-5">
          <input
            type="text"
            placeholder="Search for any person, organization, place, event, or country..."
            className="w-full px-4 py-3 pl-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
          />
          <Search className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-4">
          <Link href="/dashboard/entity/people" className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-200 transition duration-150">
            <Users className="h-6 w-6 text-blue-600 mb-2" />
            <span className="text-sm font-medium text-gray-700">Key People</span>
          </Link>
          <Link href="/dashboard/entity/organizations" className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-200 transition duration-150">
            <Building2 className="h-6 w-6 text-blue-600 mb-2" />
            <span className="text-sm font-medium text-gray-700">Organizations</span>
          </Link>
          <Link href="/dashboard/entity/places" className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-200 transition duration-150">
            <MapPin className="h-6 w-6 text-blue-600 mb-2" />
            <span className="text-sm font-medium text-gray-700">Places</span>
          </Link>
          <Link href="/dashboard/entity/events" className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-200 transition duration-150">
            <Calendar className="h-6 w-6 text-blue-600 mb-2" />
            <span className="text-sm font-medium text-gray-700">Events</span>
          </Link>
          <Link href="/dashboard/entity/countries" className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-200 transition duration-150">
            <Flag className="h-6 w-6 text-blue-600 mb-2" />
            <span className="text-sm font-medium text-gray-700">Countries</span>
          </Link>
        </div>
      </div>

      {/* Insights & Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Risk Forecast */}
        <EnhancedDashboardCard
          title="Risk Forecast"
          icon={<AlertTriangle className="h-5 w-5 text-orange-500" />}
        >
          <div className="text-gray-500 text-sm mb-3">Next 30 days</div>
          <RiskForecast />
          <div className="mt-4">
            <Link href="/dashboard/trends/risk" className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center">
              View detailed analysis <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
        </EnhancedDashboardCard>
        
        {/* Stability Map */}
        <EnhancedDashboardCard
          title="Stability Index"
          icon={<BarChart4 className="h-5 w-5 text-green-600" />}
          className="lg:col-span-2"
        >
          <div className="text-gray-500 text-sm mb-3">Regional overview</div>
          <StabilityMap />
          <div className="mt-4">
            <Link href="/dashboard/geospatial" className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center">
              Explore geospatial data <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
        </EnhancedDashboardCard>
      </div>

      {/* Trend Analysis Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Trending Topics */}
        <EnhancedDashboardCard
          title="Topic Analysis"
          icon={<TrendingUp className="h-5 w-5 text-blue-600" />}
          className="lg:col-span-2"
        >
          <div className="text-gray-500 text-sm mb-3">Most discussed themes</div>
          <TrendAnalysis 
            selectedRegion="West Africa"
            timeframe="30"
            userType="general"
          />
          <div className="mt-4">
            <Link href="/dashboard/trends/topics" className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center">
              View topic trends <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
        </EnhancedDashboardCard>
        
        {/* Regional Sentiment */}
        <EnhancedDashboardCard
          title="Regional Sentiment"
          icon={<Newspaper className="h-5 w-5 text-purple-600" />}
        >
          <div className="text-gray-500 text-sm mb-3">News and social media</div>
          <RegionalSentimentAnalysis 
            selectedRegion="West Africa"
            timeframe="60"
          />
          <div className="mt-4">
            <Link href="/dashboard/trends/sentiment" className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center">
              Full sentiment analysis <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
        </EnhancedDashboardCard>
      </div>

      {/* Data Sources */}
      <EnhancedDashboardCard
        title="Active Data Sources"
        icon={<BrainCircuit className="h-5 w-5 text-indigo-600" />}
      >
        <div className="text-gray-500 text-sm mb-3">Configure your intelligence feeds</div>
        <DataSourceSelector 
          selectedSources={[]}
          onChange={(sources) => console.log('Selected sources changed:', sources)}
        />
        <div className="mt-4">
          <Link href="/dashboard/data-sources" className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center">
            Manage data sources <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
      </EnhancedDashboardCard>
    </div>
  );
}
