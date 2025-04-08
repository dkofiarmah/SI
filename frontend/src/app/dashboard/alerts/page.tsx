'use client';

import React, { useState, useEffect } from 'react';
import {
  AlertTriangle, Bell, Briefcase, BarChart3, Shield as LucideShield, 
  FileText, Globe, ArrowUpRight, Zap, Star, ChevronRight,
  Calendar, TrendingUp, BarChart, Filter, Clock, Check,
  X, PlusCircle, Settings, Bookmark, Share2, Download
} from 'lucide-react';
import DashboardHeader from '@/components/DashboardHeader';
import { mockAlerts } from '@/data/mock/data';
import { useRouter } from 'next/navigation';

// Alert types
type BaseAlert = {
  id: string;
  type: string;
  title: string;
  description: string;
  timeframe: string;
  severity: string;
  icon: string;
  color: string;
  relatedEntities: string[];
  actionUrl: string;
};

type EnhancedAlert = BaseAlert & {
  status: string;
  confidence: number;
  region: string;
};

type Alert = BaseAlert | EnhancedAlert;

function hasConfidence(alert: Alert): alert is EnhancedAlert {
  return 'confidence' in alert;
}

// User personas
type UserPersona = 'business' | 'investor' | 'security' | 'policy' | 'custom';

export default function AlertsPage() {
  const router = useRouter();
  
  // Main state
  const [selectedPersona, setSelectedPersona] = useState<UserPersona>('business');
  const [savedAlerts, setSavedAlerts] = useState<string[]>([]);
  const [regionFilter, setRegionFilter] = useState<string>('all');
  const [timeRange, setTimeRange] = useState('7d');
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [isCustomizing, setIsCustomizing] = useState(false);
  
  // Advanced states
  const [priorityThreshold, setPriorityThreshold] = useState(60);
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>(['market entry', 'investment', 'economic']);
  const [customDashboardLayout, setCustomDashboardLayout] = useState('2-1');
  
  // Enhanced alert data
  const alerts: Alert[] = [
    ...mockAlerts,
    {
      id: 'market-opportunity-kenya-tech-2025',
      type: 'economic',
      title: 'Market Opportunity: Kenya Tech Sector',
      description: 'Technology sector in Kenya showing 22% YoY growth with favorable regulatory environment for foreign investors. Top performing segments: fintech, agritech, and mobile services.',
      timeframe: '2 hours ago',
      severity: 'medium',
      icon: 'TrendingUp',
      color: 'green',
      relatedEntities: ['Kenya ICT Authority', 'Nairobi Tech Hub', 'Financial Services Regulatory'],
      actionUrl: '#market-analysis',
      status: 'new',
      confidence: 87,
      region: 'East Africa'
    },
    {
      id: 'supply-chain-risk-egypt-2025',
      type: 'anomaly',
      title: 'Supply Chain Alert: Port Said Logistics',
      description: 'Unusual container processing delays at Port Said affecting import/export operations. 40% slower processing times impacting consumer goods and industrial components.',
      timeframe: '6 hours ago',
      severity: 'high',
      icon: 'AlertTriangle',
      color: 'red',
      relatedEntities: ['Port Said Authority', 'Egyptian Customs', 'Shipping Companies'],
      actionUrl: '#logistics-analysis',
      status: 'new',
      confidence: 92,
      region: 'North Africa'
    },
    {
      id: 'regulatory-opportunity-nigeria-2025',
      type: 'political',
      title: 'Regulatory Change: Nigeria Fintech',
      description: 'Central Bank of Nigeria announces simplified licensing process for fintech companies, reducing approval time by 60% and lowering capital requirements for startups.',
      timeframe: '1 day ago',
      severity: 'low',
      icon: 'FileText',
      color: 'blue',
      relatedEntities: ['Nigerian Central Bank', 'Fintech Association', 'Ministry of Digital Economy'],
      actionUrl: '#regulatory-details',
      status: 'new',
      confidence: 95,
      region: 'West Africa'
    }
  ];

  // Persona configurations with clear value propositions
  const personaConfigs = {
    business: {
      title: "Business Intelligence Hub",
      description: "Real-time market insights and opportunities aligned with your business objectives",
      priorityAlertTypes: ['economic', 'political', 'anomaly'],
      priorityKeywords: ['market entry', 'investment', 'supply chain', 'regulations', 'trade'],
      insightCategories: ['Market Opportunities', 'Supply Chain Alerts', 'Regulatory Insights'],
      actionableInsights: [
        "3 high-potential markets identified this week based on your profile",
        "Supply chain optimization opportunity detected in East Africa logistics",
        "New trade agreement will reduce tariffs by 15% in your target market"
      ]
    },
    investor: {
      title: "Investment Intelligence Center",
      description: "Discover high-potential investment opportunities and anticipate market shifts",
      priorityAlertTypes: ['economic', 'forecast', 'political'],
      priorityKeywords: ['ROI', 'growth sector', 'valuation', 'regulatory change', 'market access'],
      insightCategories: ['Investment Opportunities', 'Risk Factors', 'Market Forecasts'],
      actionableInsights: [
        "Tech sector in Kenya showing 22% above-market returns this quarter",
        "Early indicators suggest policy shift favorable to foreign investors",
        "Alternative energy investments outperforming traditional sectors by 17%"
      ]
    },
    security: {
      title: "Security Risk Command Center",
      description: "Proactively manage security risks to protect your operations and personnel",
      priorityAlertTypes: ['security', 'anomaly', 'political'],
      priorityKeywords: ['threat', 'personnel safety', 'facility', 'evacuation', 'stability'],
      insightCategories: ['Critical Threats', 'Regional Instability', 'Emerging Concerns'],
      actionableInsights: [
        "Increased risk level detected in 2 regions where you have operations",
        "Predictive model indicates improving security conditions in Mombasa",
        "New secure transportation corridor established in high-risk region"
      ]
    },
    policy: {
      title: "Policy & Governance Center",
      description: "Monitor policy shifts and governance trends relevant to strategic planning",
      priorityAlertTypes: ['political', 'forecast', 'economic'],
      priorityKeywords: ['policy change', 'compliance', 'governance', 'public sentiment'],
      insightCategories: ['Governance Developments', 'Economic Policies', 'Regional Cooperation'],
      actionableInsights: [
        "Regulatory reforms in 3 markets creating favorable investment conditions",
        "Analysis shows increasing stability trends in key regional markets",
        "New trade agreement will impact cross-border operations by Q3 2025"
      ]
    },
    custom: {
      title: "Custom Intelligence Dashboard",
      description: "Your personalized alert hub configured to your specific requirements",
      priorityAlertTypes: ['economic', 'security', 'political', 'anomaly', 'forecast'],
      priorityKeywords: ['custom', 'personalized'],
      insightCategories: ['Your Priority Alerts', 'Custom Insights', 'Saved Intelligence'],
      actionableInsights: [
        "Intelligence matched to your custom criteria",
        "Personalized insights based on your operations",
        "Tailored intelligence for your specific needs"
      ]
    }
  };

  // Get priority alerts for the selected persona
  const getPriorityAlerts = () => {
    const config = personaConfigs[selectedPersona];
    
    return alerts
      .filter(alert => 
        config.priorityAlertTypes.includes(alert.type) && 
        (regionFilter === 'all' || 'region' in alert && alert.region === regionFilter)
      )
      .sort((a, b) => {
        // Sort by severity first
        const severityWeight = { 'high': 3, 'medium': 2, 'low': 1 };
        const severityDiff = severityWeight[b.severity as 'high' | 'medium' | 'low'] - 
                           severityWeight[a.severity as 'high' | 'medium' | 'low'];
        
        if (severityDiff !== 0) return severityDiff;
        
        // Then by confidence if available
        if (hasConfidence(a) && hasConfidence(b)) {
          return b.confidence - a.confidence;
        }
        
        // Then by recency (assuming id has some chronological component)
        return b.id.localeCompare(a.id);
      })
      .slice(0, 6); // Show top 6 for focused view
  };

  // Get alerts grouped by category
  const getAlertsByCategory = () => {
    const config = personaConfigs[selectedPersona];
    const filteredAlerts = alerts.filter(alert => 
      (regionFilter === 'all' || 'region' in alert && alert.region === regionFilter)
    );
    
    const result: Record<string, Alert[]> = {};
    
    config.insightCategories.forEach(category => {
      let categoryAlerts: Alert[] = [];
      
      // Match alerts to categories based on persona-specific logic
      if (selectedPersona === 'business') {
        if (category === 'Market Opportunities') {
          categoryAlerts = filteredAlerts.filter(a => 
            a.type === 'economic' || 
            a.title.toLowerCase().includes('market') || 
            a.title.toLowerCase().includes('opportunity')
          );
        } else if (category === 'Supply Chain Alerts') {
          categoryAlerts = filteredAlerts.filter(a => 
            a.description.toLowerCase().includes('supply') || 
            a.description.toLowerCase().includes('logistics') ||
            a.title.toLowerCase().includes('supply')
          );
        } else if (category === 'Regulatory Insights') {
          categoryAlerts = filteredAlerts.filter(a => 
            a.type === 'political' || 
            a.description.toLowerCase().includes('regulation') || 
            a.title.toLowerCase().includes('regulatory')
          );
        }
      } else if (selectedPersona === 'investor') {
        if (category === 'Investment Opportunities') {
          categoryAlerts = filteredAlerts.filter(a => 
            a.description.toLowerCase().includes('investment') || 
            a.description.toLowerCase().includes('growth') ||
            a.title.toLowerCase().includes('opportunity')
          );
        } else if (category === 'Risk Factors') {
          categoryAlerts = filteredAlerts.filter(a => 
            a.severity === 'high' || 
            a.description.toLowerCase().includes('risk')
          );
        } else if (category === 'Market Forecasts') {
          categoryAlerts = filteredAlerts.filter(a => 
            a.type === 'forecast' || 
            a.description.toLowerCase().includes('growth') ||
            a.title.toLowerCase().includes('forecast')
          );
        }
      } else if (selectedPersona === 'security') {
        if (category === 'Critical Threats') {
          categoryAlerts = filteredAlerts.filter(a => 
            a.severity === 'high' && (a.type === 'security' || a.type === 'anomaly')
          );
        } else if (category === 'Regional Instability') {
          categoryAlerts = filteredAlerts.filter(a => 
            a.type === 'political' || 
            a.description.toLowerCase().includes('conflict') ||
            a.description.toLowerCase().includes('instability')
          );
        } else if (category === 'Emerging Concerns') {
          categoryAlerts = filteredAlerts.filter(a => 
            a.type === 'security' || 
            a.type === 'anomaly'
          );
        }
      } else {
        // Default logic for other personas or custom
        categoryAlerts = filteredAlerts.filter(a => 
          a.type === config.priorityAlertTypes[0] || 
          a.severity === 'high'
        ); 
      }
      
      result[category] = categoryAlerts.slice(0, 3); // Keep focused with top 3 per category
    });
    
    return result;
  };

  // Get key metrics the user should care about
  const getKeyMetrics = () => {
    const config = personaConfigs[selectedPersona];
    const filteredAlerts = alerts.filter(alert => 
      (regionFilter === 'all' || 'region' in alert && alert.region === regionFilter)
    );
    
    // Count high-priority alerts
    const highPriorityCount = filteredAlerts.filter(a => 
      a.severity === 'high' && config.priorityAlertTypes.includes(a.type)
    ).length;
    
    // Count new alerts relevant to the persona
    const newAlertsCount = filteredAlerts.filter(a => 
      'status' in a && a.status === 'new' && config.priorityAlertTypes.includes(a.type)
    ).length;
    
    // Persona-specific opportunity metric
    const opportunityCount = filteredAlerts.filter(a => 
      (a.severity !== 'high' && // Not a threat
       (a.title.toLowerCase().includes('opportunity') || 
        a.description.toLowerCase().includes('growth') ||
        a.description.toLowerCase().includes('favorable')))
    ).length;
    
    const metrics = [
      {
        label: "Critical Updates",
        value: highPriorityCount,
        icon: AlertTriangle,
        color: "text-red-600 bg-red-50 border-red-100"
      },
      {
        label: "New Insights",
        value: newAlertsCount,
        icon: Bell,
        color: "text-blue-600 bg-blue-50 border-blue-100"
      },
      {
        label: "Opportunities",
        value: opportunityCount,
        icon: TrendingUp,
        color: "text-emerald-600 bg-emerald-50 border-emerald-100"
      }
    ];
    
    return metrics;
  };
  
  // Get regions from alerts for filter
  const availableRegions = (() => {
    const regions = new Set<string>();
    alerts.forEach(alert => {
      if ('region' in alert && alert.region) {
        regions.add(alert.region);
      }
    });
    return ['all', ...Array.from(regions)];
  })();
  
  // Get related insights based on saved alerts and user persona
  const getRelatedInsights = () => {
    const config = personaConfigs[selectedPersona];
    
    // Generate tailored insights based on persona
    return config.actionableInsights;
  };
  
  // Alert card component with a cleaner, more focused design
  const AlertCard = ({ alert, isPriority = false }: { alert: Alert, isPriority?: boolean }) => {
    const isSaved = savedAlerts.includes(alert.id);

    // Determine icon based on alert type and icon field
    const IconComponent = (() => {
      if (alert.icon === 'AlertTriangle') return AlertTriangle;
      if (alert.icon === 'TrendingUp') return TrendingUp;
      if (alert.type === 'economic') return BarChart;
      if (alert.type === 'political') return FileText;
      if (alert.type === 'security') return LucideShield;
      return Bell;
    })();
    
    // Determine color classes based on severity and color field
    const colorClasses = (() => {
      if (alert.severity === 'high') return 'bg-red-50 border-red-200 hover:bg-red-100';
      if (alert.severity === 'medium') return 'bg-amber-50 border-amber-200 hover:bg-amber-100';
      return 'bg-emerald-50 border-emerald-200 hover:bg-emerald-100';
    })();

    return (
      <div 
        className={`rounded-lg border p-4 ${colorClasses} transition-all duration-200 ${
          isPriority ? 'shadow-md' : ''
        }`}
      >
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center">
            <div className={`p-1.5 rounded-full mr-2 ${
              alert.severity === 'high' ? 'bg-red-100' : 
              alert.severity === 'medium' ? 'bg-amber-100' : 
              'bg-emerald-100'
            }`}>
              <IconComponent className={`h-4 w-4 ${
                alert.severity === 'high' ? 'text-red-700' : 
                alert.severity === 'medium' ? 'text-amber-700' : 
                'text-emerald-700'
              }`} />
            </div>
            <h3 className="font-medium text-gray-900">{alert.title}</h3>
          </div>
          <div className="flex space-x-1">
            <button 
              onClick={() => {
                if (isSaved) {
                  setSavedAlerts(savedAlerts.filter(id => id !== alert.id));
                } else {
                  setSavedAlerts([...savedAlerts, alert.id]);
                }
              }}
              className="p-1 rounded hover:bg-white/70 transition-colors"
              title={isSaved ? "Remove from saved" : "Save for later"}
            >
              {isSaved ? 
                <Check size={16} className="text-emerald-600" /> : 
                <Bookmark size={16} className="text-gray-400" />
              }
            </button>
          </div>
        </div>

        <p className="text-sm text-gray-700 mb-3 line-clamp-2">
          {alert.description}
        </p>

        <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
          <span className="flex items-center">
            <Clock className="h-3 w-3 mr-1" />
            {alert.timeframe}
          </span>
          {hasConfidence(alert) && (
            <span className="flex items-center">
              {alert.confidence}% confidence
            </span>
          )}
        </div>

        {hasConfidence(alert) && (
          <div className="text-xs mb-2 text-gray-600">
            <span className="font-medium">{alert.region}</span>
          </div>
        )}

        <div className="flex justify-between items-center">
          <div className="flex space-x-2">
            <button className="p-1 hover:bg-white/70 rounded text-gray-500" title="Share">
              <Share2 className="h-4 w-4" />
            </button>
            <button className="p-1 hover:bg-white/70 rounded text-gray-500" title="Download">
              <Download className="h-4 w-4" />
            </button>
          </div>
          <button 
            onClick={() => {
              if (alert.type === 'economic') {
                router.push('/dashboard/trends');
              } else if (alert.type === 'security') {
                router.push('/dashboard/geospatial');
              } else {
                router.push(alert.actionUrl);
              }
            }}
            className="flex items-center text-xs font-medium px-2 py-1 bg-white/70 rounded hover:bg-white transition-colors text-blue-600"
          >
            Analyze
            <ArrowUpRight className="h-3 w-3 ml-1" />
          </button>
        </div>
      </div>
    );
  };

  // OnboardingPrompt component to help users get started
  const OnboardingPrompt = () => (
    <div className="relative bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-5 shadow-sm border border-blue-100 mb-6">
      <button 
        onClick={() => setShowOnboarding(false)}
        className="absolute top-3 right-3 p-1 rounded-full hover:bg-white/50 text-gray-500"
      >
        <X size={16} />
      </button>
      
      <div className="flex items-start space-x-4">
        <div className="bg-blue-100 p-3 rounded-full">
          <Zap className="h-6 w-6 text-blue-700" />
        </div>
        <div>
          <h3 className="font-medium text-gray-900 mb-1">Personalize Your Intelligence Hub</h3>
          <p className="text-sm text-gray-600 mb-3">
            Your dashboard is configured for {selectedPersona === 'business' ? 'business intelligence' : 
            selectedPersona === 'investor' ? 'investment insights' :
            selectedPersona === 'security' ? 'security monitoring' :
            selectedPersona === 'policy' ? 'policy analysis' : 'custom intelligence'}.
            Customize it to match your exact needs.
          </p>
          <div className="flex space-x-2">
            <button 
              onClick={() => setIsCustomizing(true)}
              className="text-xs flex items-center px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              <Settings className="h-3 w-3 mr-1.5" />
              Configure Dashboard
            </button>
            <button className="text-xs flex items-center px-3 py-1.5 border border-blue-200 rounded-md hover:bg-blue-50">
              <PlusCircle className="h-3 w-3 mr-1.5" />
              Add Data Sources
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // CustomizationPanel for more advanced users
  const CustomizationPanel = () => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6">
      <div className="bg-white rounded-xl w-full max-w-2xl max-h-[80vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900">Configure Your Intelligence Hub</h3>
            <button 
              onClick={() => setIsCustomizing(false)}
              className="p-1 rounded-full hover:bg-gray-100"
            >
              <X size={18} className="text-gray-500" />
            </button>
          </div>
        </div>
        
        <div className="p-6 space-y-6">
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-3">Intelligence Focus</h4>
            <div className="grid grid-cols-4 gap-2">
              {(Object.keys(personaConfigs) as UserPersona[]).map((persona) => (
                <button
                  key={persona}
                  onClick={() => setSelectedPersona(persona)}
                  className={`flex flex-col items-center justify-center p-3 rounded-lg border ${
                    selectedPersona === persona ? 
                      'bg-blue-50 border-blue-200 text-blue-700' : 
                      'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {persona === 'business' && <Briefcase className="h-5 w-5 mb-1" />}
                  {persona === 'investor' && <BarChart3 className="h-5 w-5 mb-1" />}
                  {persona === 'security' && <LucideShield className="h-5 w-5 mb-1" />}
                  {persona === 'policy' && <FileText className="h-5 w-5 mb-1" />}
                  {persona === 'custom' && <Settings className="h-5 w-5 mb-1" />}
                  <span className="text-xs capitalize">{persona}</span>
                </button>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-3">Priority Intelligence Requirements</h4>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Priority Threshold (Confidence %)</label>
                <input 
                  type="range" 
                  min="50" 
                  max="95" 
                  value={priorityThreshold} 
                  onChange={(e) => setPriorityThreshold(parseInt(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>More inclusive</span>
                  <span>Higher accuracy</span>
                </div>
              </div>
              
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Interest Keywords</label>
                <div className="flex flex-wrap gap-2">
                  {selectedKeywords.map(keyword => (
                    <div key={keyword} className="flex items-center bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs">
                      {keyword}
                      <button 
                        onClick={() => setSelectedKeywords(selectedKeywords.filter(k => k !== keyword))}
                        className="ml-1.5 hover:text-blue-900"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                  <button 
                    onClick={() => {
                      const newKeyword = prompt('Enter a new keyword to track:');
                      if (newKeyword && !selectedKeywords.includes(newKeyword)) {
                        setSelectedKeywords([...selectedKeywords, newKeyword]);
                      }
                    }}
                    className="text-xs text-gray-500 px-2 py-1 border border-dashed border-gray-300 rounded hover:bg-gray-50"
                  >
                    + Add keyword
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-3">Dashboard Layout</h4>
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => setCustomDashboardLayout('2-1')}
                className={`flex flex-col items-center p-3 border rounded ${
                  customDashboardLayout === '2-1' ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-200 hover:bg-gray-50'
                }`}
              >
                <div className="w-full grid grid-cols-2 gap-1 mb-2">
                  <div className="bg-gray-200 h-6 rounded"></div>
                  <div className="bg-gray-200 h-6 rounded"></div>
                  <div className="bg-gray-300 h-12 rounded col-span-2"></div>
                </div>
                <span className="text-xs">Default</span>
              </button>
              
              <button
                onClick={() => setCustomDashboardLayout('1-2')}
                className={`flex flex-col items-center p-3 border rounded ${
                  customDashboardLayout === '1-2' ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-200 hover:bg-gray-50'
                }`}
              >
                <div className="w-full grid grid-cols-1 gap-1 mb-2">
                  <div className="bg-gray-300 h-8 rounded"></div>
                  <div className="grid grid-cols-2 gap-1">
                    <div className="bg-gray-200 h-10 rounded"></div>
                    <div className="bg-gray-200 h-10 rounded"></div>
                  </div>
                </div>
                <span className="text-xs">Compact</span>
              </button>
              
              <button
                onClick={() => setCustomDashboardLayout('3-0')}
                className={`flex flex-col items-center p-3 border rounded ${
                  customDashboardLayout === '3-0' ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-200 hover:bg-gray-50'
                }`}
              >
                <div className="w-full grid grid-cols-3 gap-1 mb-2">
                  <div className="bg-gray-200 h-14 rounded"></div>
                  <div className="bg-gray-200 h-14 rounded"></div>
                  <div className="bg-gray-200 h-14 rounded"></div>
                </div>
                <span className="text-xs">Detailed</span>
              </button>
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-3">Delivery Preferences</h4>
            <div className="space-y-2">
              <label className="flex items-center justify-between p-2 bg-gray-50 rounded text-sm">
                <span>Real-time Critical Alerts</span>
                <input type="checkbox" className="rounded border-gray-300" defaultChecked />
              </label>
              <label className="flex items-center justify-between p-2 bg-gray-50 rounded text-sm">
                <span>Daily Intelligence Summary (Email)</span>
                <input type="checkbox" className="rounded border-gray-300" defaultChecked />
              </label>
              <label className="flex items-center justify-between p-2 bg-gray-50 rounded text-sm">
                <span>Weekly Strategic Report</span>
                <input type="checkbox" className="rounded border-gray-300" />
              </label>
            </div>
          </div>
        </div>
        
        <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
          <button 
            onClick={() => setIsCustomizing(false)}
            className="px-4 py-2 border border-gray-300 rounded text-sm hover:bg-gray-50"
          >
            Cancel
          </button>
          <button 
            onClick={() => {
              // Apply settings
              setIsCustomizing(false);
              setShowOnboarding(false);
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
          >
            Apply & Save
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-full">
      <DashboardHeader
        title={personaConfigs[selectedPersona].title}
        description={personaConfigs[selectedPersona].description}
        bgColor="white"
        sticky
      >
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsCustomizing(true)}
            className="flex items-center bg-white border border-gray-300 rounded-md py-1.5 px-3 text-sm hover:bg-gray-50"
          >
            <Settings className="h-4 w-4 mr-1.5" />
            Configure
          </button>
          <button className="flex items-center bg-white border border-gray-300 rounded-md py-1.5 px-3 text-sm hover:bg-gray-50">
            <Calendar className="h-4 w-4 mr-1.5" />
            {timeRange === '24h' ? 'Last 24 Hours' : 
             timeRange === '7d' ? 'Last 7 Days' : 
             timeRange === '30d' ? 'Last 30 Days' : 'Custom Range'}
          </button>
        </div>
      </DashboardHeader>

      <div className="flex-1 p-6 bg-gray-50">
        {/* Onboarding guidance - shows initially but can be dismissed */}
        {showOnboarding && <OnboardingPrompt />}
        
        {/* Key Metrics - focused on what matters */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {getKeyMetrics().map((metric, index) => (
            <div key={index} className={`bg-white rounded-lg shadow-sm border ${metric.color.split(' ')[2]} p-4`}>
              <div className="flex items-center">
                <div className={`p-3 rounded-lg ${metric.color.split(' ').slice(0, 2).join(' ')}`}>
                  <metric.icon className="h-5 w-5" />
                </div>
                <div className="ml-4">
                  <div className="text-sm font-medium text-gray-500">{metric.label}</div>
                  <div className="text-2xl font-bold">{metric.value}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Region Filter - simplified but effective */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center bg-white px-3 py-2 rounded-lg border border-gray-200 shadow-sm">
            <Globe className="h-4 w-4 text-gray-500 mr-2" />
            <select
              value={regionFilter}
              onChange={(e) => setRegionFilter(e.target.value)}
              className="text-sm border-0 focus:ring-0"
            >
              {availableRegions.map(region => (
                <option key={region} value={region}>
                  {region === 'all' ? 'All Regions' : region}
                </option>
              ))}
            </select>
          </div>
          
          <div className="flex items-center">
            <span className="text-xs font-medium text-gray-500 mr-2">View:</span>
            <div className="bg-white border border-gray-200 rounded-md flex divide-x divide-gray-200">
              <button className="px-3 py-1.5 text-blue-600 text-xs font-medium">
                Priority
              </button>
              <button className="px-3 py-1.5 text-gray-500 hover:text-gray-700 text-xs">
                All
              </button>
              <button className="px-3 py-1.5 text-gray-500 hover:text-gray-700 text-xs">
                <Filter className="h-3 w-3" />
              </button>
            </div>
          </div>
        </div>
        
        {/* Priority Alerts - focused attention on what matters most */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <h2 className="text-lg font-medium">Priority Intelligence</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {getPriorityAlerts().map(alert => (
              <AlertCard key={alert.id} alert={alert} isPriority={true} />
            ))}
          </div>
        </div>
        
        {/* Alerts by Category - organized for easy scanning */}
        <div className="space-y-8">
          {Object.entries(getAlertsByCategory()).map(([category, alerts]) => (
            alerts.length > 0 ? (
              <div key={category}>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-medium">{category}</h2>
                  <button className="text-sm text-blue-600 hover:text-blue-800 flex items-center">
                    View All
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {alerts.map(alert => (
                    <AlertCard key={alert.id} alert={alert} />
                  ))}
                </div>
              </div>
            ) : null
          ))}
        </div>
        
        {/* Actionable Insights Panel */}
        <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-100">
          <h2 className="text-lg font-medium mb-4">Actionable Insights</h2>
          <div className="space-y-3">
            {getRelatedInsights().map((insight, index) => (
              <div key={index} className="bg-white/80 p-3 rounded-lg border border-blue-100 hover:bg-white transition-colors">
                <div className="flex items-start">
                  <div className="p-1.5 bg-blue-100 rounded-full mr-3 mt-0.5">
                    <Zap className="h-3.5 w-3.5 text-blue-700" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-700">{insight}</p>
                    <div className="mt-2 flex justify-end">
                      <button className="text-xs flex items-center text-blue-600 hover:text-blue-800">
                        Explore <ArrowUpRight className="h-3 w-3 ml-1" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Customization Panel */}
        {isCustomizing && <CustomizationPanel />}
      </div>
    </div>
  );
}
