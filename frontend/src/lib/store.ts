import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { Entity, Alert, Report, ScenarioRun, UserPreferences } from '@/types';
import { mockLocationData, mockAlerts, mockReports } from '@/data/mock/data';

interface LocationData {
  economicMetrics?: {
    gdp: number;
    inflation: number;
    unemployment: number;
    tradeBalance: number;
  };
  socialMetrics?: {
    population: number;
    literacy: number;
    healthIndex: number;
  };
  securityMetrics?: {
    stabilityIndex: number;
    riskLevel: 'low' | 'medium' | 'high';
    incidentCount: number;
  };
  timestamp: number;
}

interface AppState {
  // Selected filters and preferences
  selectedRegion: string;
  selectedCountry: string;
  selectedCity: string;
  timeRange: string;
  setSelectedRegion: (region: string) => void;
  setSelectedCountry: (country: string) => void;
  setSelectedCity: (city: string) => void;
  setTimeRange: (range: string) => void;

  // Data collections
  alerts: Alert[];
  reports: Report[];
  scenarios: ScenarioRun[];
  entities: Entity[];
  addAlert: (alert: Alert) => void;
  addReport: (report: Report) => void;
  addScenario: (scenario: ScenarioRun) => void;
  updateScenario: (id: string, updates: Partial<ScenarioRun>) => void;
  markAlertAsRead: (alertId: string) => void;

  // User preferences
  userPreferences: UserPreferences;
  updateUserPreferences: (preferences: Partial<UserPreferences>) => void;

  // Data import tracking
  dataConnectors: {
    id: string;
    name: string;
    status: 'active' | 'inactive' | 'error';
    lastSync?: string;
  }[];
  addDataConnector: (connector: { id: string; name: string; status: 'active' | 'inactive' | 'error' }) => void;
  updateDataConnector: (id: string, status: 'active' | 'inactive' | 'error', lastSync?: string) => void;

  // Location data cache
  locationData: Record<string, LocationData>;
  updateLocationData: (location: string, data: LocationData) => void;
}

export const useStore = create<AppState>()(
  devtools(
    persist(
      (set) => ({
        // Initial state
        selectedRegion: 'All Regions',
        selectedCountry: '',
        selectedCity: '',
        timeRange: '24h',
        alerts: mockAlerts,
        reports: mockReports,
        scenarios: [],
        entities: [],
        locationData: mockLocationData,
        userPreferences: {
          alertNotifications: {
            email: true,
            inApp: true,
            sms: false
          },
          dataRefreshInterval: 300, // 5 minutes
          theme: 'light'
        },
        dataConnectors: [],

        // Actions
        setSelectedRegion: (region) => set({ selectedRegion: region, selectedCountry: '', selectedCity: '' }),
        setSelectedCountry: (country) => set({ selectedCountry: country, selectedCity: '' }),
        setSelectedCity: (city) => set({ selectedCity: city }),
        setTimeRange: (range) => set({ timeRange: range }),

        addAlert: (alert) => set((state) => ({ 
          alerts: [alert, ...state.alerts] 
        })),
        
        addReport: (report) => set((state) => ({ 
          reports: [report, ...state.reports] 
        })),

        addScenario: (scenario) => set((state) => ({ 
          scenarios: [scenario, ...state.scenarios] 
        })),

        updateScenario: (id, updates) => set((state) => ({
          scenarios: state.scenarios.map(s => 
            s.id === id ? { ...s, ...updates } : s
          )
        })),

        markAlertAsRead: (alertId) => set((state) => ({
          alerts: state.alerts.map(alert =>
            alert.id === alertId ? { ...alert, status: 'resolved' as const } : alert
          )
        })),

        updateUserPreferences: (preferences) => set((state) => ({
          userPreferences: { ...state.userPreferences, ...preferences }
        })),

        addDataConnector: (connector) => set((state) => ({
          dataConnectors: [...state.dataConnectors, connector]
        })),

        updateDataConnector: (id, status, lastSync) => set((state) => ({
          dataConnectors: state.dataConnectors.map(c =>
            c.id === id ? { ...c, status, lastSync: lastSync || c.lastSync } : c
          )
        })),

        updateLocationData: (location, data) => set((state) => ({
          locationData: { ...state.locationData, [location]: data }
        })),
      }),
      {
        name: 'savannah-intel-storage',
        partialize: (state) => ({
          userPreferences: state.userPreferences,
          dataConnectors: state.dataConnectors
        })
      }
    )
  )
);
