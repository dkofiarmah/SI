// Geographic Types
export type Region = {
    id: string;
    name: string;
    countries: string[];
    stabilityIndex: number;
};

export type Country = {
    id: string;
    name: string;
    region: string;
    cities: string[];
    stabilityIndex: number;
};

export type City = {
    id: string;
    name: string;
    country: string;
    population: string;
    coordinates: [number, number];
};

// Entity Types
export type EntityType = 'person' | 'organization' | 'location';
export type RiskLevel = 'Low' | 'Medium' | 'High';
export type ConnectionStrength = 'Strong' | 'Medium' | 'Weak';

export interface KeyConnection {
    name: string;
    role: string;
    strength: ConnectionStrength;
    relationship: 'Professional' | 'Financial' | 'Institutional' | 'Governmental' | 'Other';
}

export interface Entity {
    id: string;
    name: string;
    type: EntityType;
    role?: string;
    description?: string;
    riskScore: RiskLevel;
    connections: number;
    lastUpdated: string;
}

export interface EntityDetail extends Entity {
    bio?: string;
    recentActivities: Activity[];
    keyConnections: KeyConnection[];
    associatedLocations?: string[];
    riskFactors?: string[];
}

export interface Connection {
    source: string;
    target: string;
    strength: ConnectionStrength;
    type: string;
    lastUpdated?: string;
}

export interface Activity {
    id: string;
    type: string;
    description: string;
    date: string;
    impact?: 'Positive' | 'Negative' | 'Neutral';
    entities?: string[];
    location?: string;
}

// Report Types
export type ReportCategory = 'Overview' | 'Security' | 'Economy' | 'Governance' | 'Infrastructure' | 'Social';
export type ReportConfidence = 'High' | 'Medium' | 'Low';

export interface Report {
    id: string;
    title: string;
    category: ReportCategory;
    region: string;
    date: string;
    confidence: ReportConfidence;
    summary: string;
    pdfUrl?: string;
    authors?: string[];
    relatedEntities?: string[];
    tags?: string[];
}

// Alert Types
export type AlertType = 'forecast' | 'anomaly' | 'security' | 'economic' | 'political';
export type AlertSeverity = 'high' | 'medium' | 'low';
export type AlertStatus = 'new' | 'inProgress' | 'resolved';

export interface Alert {
    id: string;
    type: AlertType;
    title: string;
    description: string;
    timeframe: string;
    severity: AlertSeverity;
    status: AlertStatus;
    icon: string;
    color: string;
    relatedEntities?: string[];
    confidence?: number;
    region?: string;
    actionUrl?: string;
}

// Scenario Types
export type ScenarioType = 'economic-shock' | 'political-event' | 'security-crisis' | 'environmental-event' | 'custom';
export type ScenarioStatus = 'draft' | 'running' | 'completed';
export type ImpactLevel = 'high' | 'medium' | 'low';

export interface ScenarioTemplate {
    id: ScenarioType;
    name: string;
    description: string;
    variables: string[];
    defaultTimeHorizon: string;
}

export interface ScenarioRun {
    id: string;
    name: string;
    description: string;
    template: ScenarioType;
    status: ScenarioStatus;
    progress?: number;
    lastRun?: string;
    results?: ScenarioResults;
}

export interface ScenarioResults {
    impact: ImpactLevel;
    confidence: number;
    timeHorizon: string;
    affectedSectors: string[];
    keyOutcomes: string[];
    riskFactors: string[];
}

// Data Import Types
export type DataConnectorType = 'csv' | 'api' | 'database' | 'streaming' | 'scraping';

export interface DataConnector {
    id: DataConnectorType;
    name: string;
    description: string;
    icon: string;
    setupComplexity: 'Low' | 'Medium' | 'High';
    status?: 'active' | 'inactive' | 'error';
    lastSync?: string;
}

// User Preferences
export type UserType = 'individual' | 'institution';

export interface UserPreferences {
    defaultRegion?: string;
    defaultTimeRange?: string;
    alertNotifications: {
        email: boolean;
        inApp: boolean;
        sms: boolean;
    };
    dataRefreshInterval?: number;
    theme?: 'light' | 'dark' | 'system';
    
    // Onboarding preferences
    userType?: UserType;
    interests?: string[];
    focusRegions?: string[];
    onboardingCompleted?: boolean;
}
