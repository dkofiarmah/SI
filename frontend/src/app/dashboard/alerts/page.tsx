'use client';

import React, { useState } from 'react';
import {
  Bell, AlertTriangle, AlertCircle, Activity,
  Archive, MessageSquare, Share2, ArrowUpRight,
  Flag, TrendingUp, Clock, Target
} from 'lucide-react';
import DashboardHeader from '@/components/DashboardHeader';
import { mockAlerts } from '@/data/mock/data';

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

type AlertType = 'all' | 'forecast' | 'anomaly' | 'security' | 'economic' | 'political';
type AlertSeverity = 'all' | 'high' | 'medium' | 'low';
type AlertStatus = 'all' | 'new' | 'inProgress' | 'resolved';

export default function AlertsPage() {
  const [typeFilter, setTypeFilter] = useState<AlertType>('all');
  const [severityFilter, setSeverityFilter] = useState<AlertSeverity>('all');
  const [statusFilter, setStatusFilter] = useState<AlertStatus>('all');
  const [timeRange, setTimeRange] = useState('24h');
  const [showSettings, setShowSettings] = useState(false);

  // Enhanced alert data with more details
  const alerts: Alert[] = [
    ...mockAlerts,
    {
      id: 'alert4',
      type: 'economic',
      title: 'Economic Indicator Anomaly',
      description: 'Unexpected shift in trade balance detected for Nigeria. Current deficit 25% above forecast.',
      timeframe: '4 hours ago',
      severity: 'medium',
      icon: 'Activity',
      color: 'blue',
      relatedEntities: ['Central Bank of Nigeria', 'Ministry of Trade'],
      actionUrl: '#analyze',
      status: 'new',
      confidence: 85,
      region: 'West Africa'
    },
    {
      id: 'alert5',
      type: 'political',
      title: 'Political Event Risk',
      description: 'Analysis suggests increased likelihood of policy shift following upcoming election.',
      timeframe: '2 hours ago',
      severity: 'medium',
      icon: 'Flag',
      color: 'purple',
      relatedEntities: ['Election Commission', 'Leading Parties'],
      actionUrl: '#scenario',
      status: 'inProgress',
      confidence: 75,
      region: 'East Africa'
    }
  ];

  // Alert Settings Modal
  const AlertSettingsModal = () => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-[600px] max-h-[80vh] overflow-y-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold">Alert Settings</h3>
          <button 
            onClick={() => setShowSettings(false)}
            className="p-1 hover:bg-gray-100 rounded-full"
          >
            <span className="sr-only">Close</span>
            ×
          </button>
        </div>

        <div className="space-y-6">
          <div className="bg-blue-50 border border-blue-100 rounded-md p-4">
            <h4 className="font-medium text-blue-800 mb-2">Alert Configuration</h4>
            <p className="text-sm text-blue-600">
              Customize your alert preferences and notification settings.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <h5 className="font-medium mb-2">Alert Types</h5>
              <div className="grid grid-cols-2 gap-2">
                {['Security Incidents', 'Economic Changes', 'Political Events', 'Infrastructure Updates'].map((type) => (
                  <label key={type} className="flex items-center p-2 bg-gray-50 rounded">
                    <input type="checkbox" className="mr-2 rounded border-gray-300" defaultChecked />
                    <span className="text-sm">{type}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h5 className="font-medium mb-2">Notification Methods</h5>
              <div className="space-y-2">
                <label className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span className="text-sm">Email Notifications</span>
                  <input type="checkbox" className="rounded border-gray-300" defaultChecked />
                </label>
                <label className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span className="text-sm">In-App Notifications</span>
                  <input type="checkbox" className="rounded border-gray-300" defaultChecked />
                </label>
                <label className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span className="text-sm">SMS Alerts (Critical Only)</span>
                  <input type="checkbox" className="rounded border-gray-300" />
                </label>
              </div>
            </div>

            <div>
              <h5 className="font-medium mb-2">Alert Thresholds</h5>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Minimum Confidence Score</span>
                  <input 
                    type="number" 
                    className="w-20 p-1 border border-gray-300 rounded" 
                    defaultValue="75"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Update Frequency</span>
                  <select className="p-1 border border-gray-300 rounded text-sm">
                    <option>Real-time</option>
                    <option>Hourly</option>
                    <option>Daily</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end space-x-3">
          <button 
            onClick={() => setShowSettings(false)}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50"
          >
            Cancel
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700">
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-full">
      <DashboardHeader
        title="Intelligence Alerts"
        description="Real-time alerts and notifications"
        showInfoTip
        infoTipContent="Monitor critical events, anomalies, and forecasts. Configure alert settings to match your intelligence needs."
        bgColor="white"
        sticky
      >
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowSettings(true)}
            className="flex items-center bg-white border border-gray-300 rounded-md py-2 px-3 text-sm hover:bg-gray-50"
          >
            <Bell className="h-4 w-4 mr-1.5" />
            Alert Settings
          </button>
          <button className="flex items-center bg-white border border-gray-300 rounded-md py-2 px-3 text-sm hover:bg-gray-50">
            <Archive className="h-4 w-4 mr-1.5" />
            Archive
          </button>
        </div>
      </DashboardHeader>

      <div className="flex-1 p-6 bg-gray-50">
        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Alert Type
              </label>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value as AlertType)}
                className="w-full bg-gray-50 border border-gray-300 rounded-md py-2 px-3 text-sm"
              >
                <option value="all">All Types</option>
                <option value="forecast">Forecasts</option>
                <option value="anomaly">Anomalies</option>
                <option value="security">Security</option>
                <option value="economic">Economic</option>
                <option value="political">Political</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Severity
              </label>
              <select
                value={severityFilter}
                onChange={(e) => setSeverityFilter(e.target.value as AlertSeverity)}
                className="w-full bg-gray-50 border border-gray-300 rounded-md py-2 px-3 text-sm"
              >
                <option value="all">All Severities</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as AlertStatus)}
                className="w-full bg-gray-50 border border-gray-300 rounded-md py-2 px-3 text-sm"
              >
                <option value="all">All Statuses</option>
                <option value="new">New</option>
                <option value="inProgress">In Progress</option>
                <option value="resolved">Resolved</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Time Range
              </label>
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="w-full bg-gray-50 border border-gray-300 rounded-md py-2 px-3 text-sm"
              >
                <option value="1h">Last Hour</option>
                <option value="24h">Last 24 Hours</option>
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
              </select>
            </div>
          </div>
        </div>

        {/* Alerts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {alerts.map((alert) => {
            const IconComponent = {
              'AlertTriangle': AlertTriangle,
              'AlertCircle': AlertCircle,
              'TrendingUp': TrendingUp,
              'Activity': Activity,
              'Flag': Flag
            }[alert.icon] || AlertCircle;

            const colorClasses = {
              'red': 'bg-red-50 border-red-200',
              'orange': 'bg-orange-50 border-orange-200',
              'purple': 'bg-purple-50 border-purple-200',
              'blue': 'bg-blue-50 border-blue-200'
            }[alert.color] || 'bg-gray-50 border-gray-200';

            const textColorClass = {
              'red': 'text-red-800',
              'orange': 'text-orange-800',
              'purple': 'text-purple-800',
              'blue': 'text-blue-800'
            }[alert.color] || 'text-gray-800';

            return (
              <div 
                key={alert.id}
                className={`rounded-lg border p-4 ${colorClasses}`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center">
                    <IconComponent className={`h-5 w-5 mr-2 ${textColorClass}`} />
                    <h3 className={`font-medium ${textColorClass}`}>{alert.title}</h3>
                  </div>
                  <div className="flex items-center">
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                      alert.severity === 'high' ? 'bg-red-100 text-red-800' :
                      alert.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {alert.severity.charAt(0).toUpperCase() + alert.severity.slice(1)}
                    </span>
                  </div>
                </div>

                <p className={`text-sm mb-3 ${textColorClass}`}>
                  {alert.description}
                </p>

                <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                  <span className="flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    {alert.timeframe}
                  </span>
                  {hasConfidence(alert) && (
                    <span className="flex items-center">
                      <Target className="h-3 w-3 mr-1" />
                      {alert.confidence}% confidence
                    </span>
                  )}
                </div>

                <div className="space-y-2">
                  {alert.relatedEntities && (
                    <div className="text-xs">
                      <span className="text-gray-500">Related Entities:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {alert.relatedEntities.map((entity, index) => (
                          <span 
                            key={index}
                            className="px-2 py-0.5 bg-white/50 rounded-full border border-gray-200"
                          >
                            {entity}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-4 flex justify-between items-center">
                  <div className="flex space-x-2">
                    <button className="p-1.5 hover:bg-white/50 rounded-md">
                      <MessageSquare className="h-4 w-4 text-gray-600" />
                    </button>
                    <button className="p-1.5 hover:bg-white/50 rounded-md">
                      <Share2 className="h-4 w-4 text-gray-600" />
                    </button>
                  </div>
                  <button className="flex items-center text-sm font-medium hover:underline">
                    Take Action
                    <ArrowUpRight className="h-4 w-4 ml-1" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Alert Settings Modal */}
        {showSettings && <AlertSettingsModal />}
      </div>
    </div>
  );
}
