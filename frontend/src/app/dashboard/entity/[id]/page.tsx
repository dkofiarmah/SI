'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import DashboardHeader from '@/components/DashboardHeader';
import EnhancedEntityProfile from '@/components/EnhancedEntityProfile';
import { networkEntities, networkConnections, alertsData, detailedEntityProfiles } from '@/data/mock/data';
import { ConnectionStrength, EntityDetail, Connection } from '@/types';

export default function EntityDetailPage() {
  const { id } = useParams();
  
  // Find and transform the detailed entity profile to match EntityDetail interface
  const rawEntityProfile = detailedEntityProfiles.find(e => e.id === id);
  
  // Create Connection objects from key connections
  const transformedKeyConnections = rawEntityProfile?.keyConnections?.map(conn => ({
    source: rawEntityProfile.id,
    target: conn.name.toLowerCase().replace(/\s+/g, '-'), // Create a predictable ID
    type: conn.relationship,
    strength: (conn.strength === 'Strong' ? 'Strong' : 
              conn.strength === 'Medium' ? 'Medium' : 
              'Weak') as ConnectionStrength,
    lastUpdated: new Date().toISOString()
  }));

  const entityProfile = rawEntityProfile ? {
    ...rawEntityProfile,
    type: rawEntityProfile.type as 'person' | 'organization' | 'location',
    riskScore: rawEntityProfile.riskScore as 'Low' | 'Medium' | 'High',
    lastUpdated: new Date().toISOString(),
    // Map recent activities to match Activity interface
    recentActivities: rawEntityProfile.recentActivities.map((activity, index) => ({
      ...activity,
      id: `${rawEntityProfile.id}-activity-${index}`,
      entities: [rawEntityProfile.name]
    })),
    // Transform key connections to match KeyConnection interface
    keyConnections: rawEntityProfile.keyConnections?.map(conn => ({
      name: conn.name,
      role: conn.role,
      strength: conn.strength as ConnectionStrength,
      relationship: conn.relationship === 'Professional' || 
                   conn.relationship === 'Financial' || 
                   conn.relationship === 'Institutional' || 
                   conn.relationship === 'Governmental' ? 
                   conn.relationship : 'Other'
    })) || []
  } as EntityDetail : null;
  
  // Get relevant connections for this entity and ensure they match the Connection type
  const entityConnections = networkConnections
    .filter(conn => conn.source === id || conn.target === id)
    .map(conn => ({
      ...conn,
      lastUpdated: new Date().toISOString(),
      // Map connection strength to proper enum values
      strength: (conn.strength === 'Strong' ? 'Strong' : 
                conn.strength === 'Medium' ? 'Medium' : 
                'Weak') as ConnectionStrength
    }));
  
  // Get relevant alerts
  const relevantAlerts = alertsData.filter(
    alert => alert.relatedEntities?.includes(entityProfile?.name || '')
  );

  if (!entityProfile) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg p-8 text-center">
            <h2 className="text-lg font-medium text-gray-900">Entity not found</h2>
            <p className="mt-2 text-sm text-gray-500">
              The requested entity profile could not be found.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <DashboardHeader
          title="Entity Profile"
          subtitle="Comprehensive entity intelligence and risk analysis"
          showDateRange={false}
        />
        
        <div className="mt-8">
          <EnhancedEntityProfile
            entity={entityProfile}
            connections={entityConnections}
            recentAlerts={relevantAlerts}
          />
        </div>
      </div>
    </div>
  );
}
