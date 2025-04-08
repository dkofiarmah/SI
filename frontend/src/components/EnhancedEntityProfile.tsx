import React, { useState } from 'react';
import { 
  User, Building, Globe, Shield, Activity as ActivityIcon, Network, Calendar,
  TrendingUp, AlertTriangle, Users, MapPin, FileText, Eye,
  ChevronRight, ExternalLink
} from 'lucide-react';
import Link from 'next/link';
import { Entity, EntityDetail, Connection, Activity as ActivityType, KeyConnection } from '@/types';
import { getEntityTypeConfig } from '@/lib/utils/formatting';
import { calculateRiskScore, analyzeNetworkInfluence } from '@/lib/utils/analysis';
import EnhancedDashboardCard from './EnhancedDashboardCard';

interface Props {
  entity: EntityDetail;
  connections: Connection[];
  recentAlerts: any[];  // Will be typed properly when alert system is implemented
}

export default function EnhancedEntityProfile({ entity, connections, recentAlerts }: Props) {
  const [activeTab, setActiveTab] = useState<'overview' | 'network' | 'activities' | 'risks'>('overview');
  const entityConfig = getEntityTypeConfig(entity.type);
  const networkMetrics = analyzeNetworkInfluence(entity, connections);
  const riskAnalysis = calculateRiskScore(entity, connections, recentAlerts);

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <EnhancedDashboardCard
        title={entity.name}
        icon={entityConfig.icon}
        status={riskAnalysis.score > 7 ? 'critical' : riskAnalysis.score > 5 ? 'warning' : 'normal'}
      >
        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-600">{entity.role || entity.type}</p>
              <div className="flex items-center mt-1">
                <Shield className="h-4 w-4 text-gray-400 mr-1.5" />
                <span className={`text-sm ${
                  entity.riskScore === 'High' ? 'text-red-600' :
                  entity.riskScore === 'Medium' ? 'text-yellow-600' :
                  'text-green-600'
                }`}>
                  {entity.riskScore} Risk
                </span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Influence Score</p>
              <p className="text-lg font-semibold text-gray-900">{networkMetrics.influence.toFixed(1)}/10</p>
            </div>
          </div>

          {entity.bio && (
            <p className="text-sm text-gray-700 border-t border-gray-100 pt-3">
              {entity.bio}
            </p>
          )}

          <div className="grid grid-cols-3 gap-4 pt-2">
            <div className="text-center p-2 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-500">Connections</p>
              <p className="text-lg font-semibold text-gray-900">{entity.connections}</p>
            </div>
            <div className="text-center p-2 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-500">Network Reach</p>
              <p className="text-lg font-semibold text-gray-900">{networkMetrics.reach}</p>
            </div>
            <div className="text-center p-2 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-500">Recent Activities</p>
              <p className="text-lg font-semibold text-gray-900">{entity.recentActivities.length}</p>
            </div>
          </div>
        </div>
      </EnhancedDashboardCard>

      {/* Navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {['overview', 'network', 'activities', 'risks'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`py-2 px-1 border-b-2 text-sm font-medium ${
                activeTab === tab 
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </nav>
      </div>

      {/* Key Connections */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <EnhancedDashboardCard title="Key Connections" icon={<Network className="h-5 w-5" />}>
            <div className="space-y-3">
              {entity.keyConnections?.map((connection, idx) => {
                const connectionType = connection.relationship || 'Other';
                return (
                  <div key={idx} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        connectionType === 'Professional' ? 'bg-blue-100' :
                        connectionType === 'Financial' ? 'bg-green-100' :
                        connectionType === 'Institutional' ? 'bg-purple-100' :
                        connectionType === 'Governmental' ? 'bg-indigo-100' :
                        'bg-gray-100'
                      }`}>
                        {connectionType === 'Professional' ? 
                          <Users className="h-4 w-4 text-blue-600" /> :
                        connectionType === 'Financial' ? 
                          <TrendingUp className="h-4 w-4 text-green-600" /> :
                        connectionType === 'Institutional' ?
                          <Building className="h-4 w-4 text-purple-600" /> :
                        connectionType === 'Governmental' ?
                          <Globe className="h-4 w-4 text-indigo-600" /> :
                          <Users className="h-4 w-4 text-gray-600" />
                      }
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">{connection.name}</p>
                        <p className="text-xs text-gray-500">{connection.role}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`text-xs px-2 py-1 rounded ${
                        connection.strength === 'Strong' ? 'bg-blue-100 text-blue-700' :
                        connection.strength === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {connection.strength}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </EnhancedDashboardCard>

          {/* Recent Activities */}
          <EnhancedDashboardCard title="Recent Activities" icon={<ActivityIcon className="h-5 w-5" />}>
            <div className="space-y-4">
              {entity.recentActivities.slice(0, 5).map((activity, idx) => (
                <div key={idx} className="flex items-start">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    activity.impact === 'Positive' ? 'bg-green-100' :
                    activity.impact === 'Negative' ? 'bg-red-100' :
                    'bg-gray-100'
                  }`}>
                    {activity.type === 'Meeting' ? <Users className="h-4 w-4" /> :
                     activity.type === 'Statement' ? <FileText className="h-4 w-4" /> :
                     activity.type === 'Travel' ? <Globe className="h-4 w-4" /> :
                     <ActivityIcon className="h-4 w-4" />
                    }
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-gray-900">{activity.description}</p>
                    <div className="flex items-center mt-1">
                      <Calendar className="h-3 w-3 text-gray-400 mr-1" />
                      <span className="text-xs text-gray-500">{activity.date}</span>
                      {activity.impact && (
                        <span className={`ml-2 text-xs ${
                          activity.impact === 'Positive' ? 'text-green-600' :
                          activity.impact === 'Negative' ? 'text-red-600' :
                          'text-gray-600'
                        }`}>
                          {activity.impact} Impact
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </EnhancedDashboardCard>

          {/* Related Entities */}
          <EnhancedDashboardCard 
            title="You May Be Interested In" 
            icon={<Users className="h-5 w-5" />}
            infoTooltip="Suggested entities based on connections, activities, and risk patterns"
          >
            <div className="grid grid-cols-2 gap-4">
              {networkMetrics.keyNodes.map((nodeId, idx) => {
                const connection = connections.find(c => c.source === nodeId || c.target === nodeId);
                const strength = connection?.strength || 'Medium';
                return (
                  <div key={idx} className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      connection?.type === 'Professional' ? 'bg-blue-100' :
                      connection?.type === 'Financial' ? 'bg-green-100' :
                      'bg-purple-100'
                    }`}>
                      {connection?.type === 'Professional' ? 
                        <Users className="h-5 w-5 text-blue-600" /> :
                      connection?.type === 'Financial' ? 
                        <TrendingUp className="h-5 w-5 text-green-600" /> :
                        <Building className="h-5 w-5 text-purple-600" />
                      }
                    </div>
                    <div className="ml-3 flex-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-900 truncate">{nodeId}</p>
                        <span className={`text-xs px-2 py-0.5 rounded ${
                          strength === 'Strong' ? 'bg-blue-100 text-blue-700' :
                          strength === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {strength}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {connection?.type || 'Connected Entity'}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </EnhancedDashboardCard>
        </div>
      )}
      
      {activeTab === 'risks' && (
        <EnhancedDashboardCard 
          title="Risk Analysis" 
          icon={<AlertTriangle className="h-5 w-5" />}
          status={riskAnalysis.score > 7 ? 'critical' : riskAnalysis.score > 5 ? 'warning' : 'normal'}
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Overall Risk Score</p>
                <p className="text-2xl font-bold">{riskAnalysis.score.toFixed(1)}/10</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Confidence</p>
                <p className="text-lg font-semibold">High</p>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-4">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Risk Factors</h4>
              <ul className="space-y-2">
                {riskAnalysis.factors.map((factor, idx) => (
                  <li key={idx} className="flex items-center text-sm text-gray-700">
                    <AlertTriangle className="h-4 w-4 text-yellow-500 mr-2" />
                    {factor}
                  </li>
                ))}
              </ul>
            </div>

            {entity.riskFactors && entity.riskFactors.length > 0 && (
              <div className="border-t border-gray-100 pt-4">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Additional Risk Considerations</h4>
                <ul className="space-y-2">
                  {entity.riskFactors.map((factor, idx) => (
                    <li key={idx} className="flex items-center text-sm text-gray-700">
                      <ChevronRight className="h-4 w-4 text-gray-400 mr-2" />
                      {factor}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </EnhancedDashboardCard>
      )}

      {/* Network View - Add visualization */}
      {activeTab === 'network' && (
        <EnhancedDashboardCard title="Network Analysis" icon={<Network className="h-5 w-5" />}>
          <div className="h-96 flex items-center justify-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
            <p className="text-gray-500">Network visualization coming soon</p>
          </div>
        </EnhancedDashboardCard>
      )}

      {/* Full Activity Log */}
      {activeTab === 'activities' && (
        <EnhancedDashboardCard 
          title="Activity Timeline" 
          icon={<ActivityIcon className="h-5 w-5" />}
          allowFavorite
        >
          <div className="space-y-6">
            {entity.recentActivities.map((activity, idx) => (
              <div key={idx} className="relative pb-6">
                {idx < entity.recentActivities.length - 1 && (
                  <div className="absolute left-4 top-8 bottom-0 w-0.5 bg-gray-200" />
                )}
                <div className="flex items-start">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    activity.impact === 'Positive' ? 'bg-green-100' :
                    activity.impact === 'Negative' ? 'bg-red-100' :
                    'bg-gray-100'
                  }`}>
                    {activity.type === 'Meeting' ? <Users className="h-4 w-4" /> :
                     activity.type === 'Statement' ? <FileText className="h-4 w-4" /> :
                     activity.type === 'Travel' ? <Globe className="h-4 w-4" /> :
                     <ActivityIcon className="h-4 w-4" />
                    }
                  </div>
                  <div className="ml-3 flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-900">{activity.type}</p>
                      <span className="text-xs text-gray-500">{activity.date}</span>
                    </div>
                    <p className="mt-1 text-sm text-gray-700">{activity.description}</p>
                    {activity.location && (
                      <div className="mt-1 flex items-center">
                        <MapPin className="h-3 w-3 text-gray-400 mr-1" />
                        <span className="text-xs text-gray-500">{activity.location}</span>
                      </div>
                    )}
                    {activity.entities && activity.entities.length > 0 && (
                      <div className="mt-2 flex items-center space-x-2">
                        <span className="text-xs text-gray-500">Related:</span>
                        {activity.entities.map((entity, idx) => (
                          <span key={idx} className="text-xs bg-gray-100 px-2 py-1 rounded">
                            {entity}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </EnhancedDashboardCard>
      )}
    </div>
  );
}
