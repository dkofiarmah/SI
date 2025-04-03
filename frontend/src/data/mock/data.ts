import type { AlertType, AlertStatus, AlertSeverity, ReportCategory, ReportConfidence } from '@/types';

// Mock Data & Constants for Savannah Intel Application

// Geographic Data
export const timeRanges = ['1 month', '3 months', '6 months', '1 year', '3 years'];
export const regions = ['All Regions', 'North Africa', 'East Africa', 'West Africa', 'Central Africa', 'Southern Africa', 'Middle East'];

// Added more countries per region for better filtering demo
export const countriesByRegion = {
    'North Africa': ['Egypt', 'Algeria', 'Morocco', 'Tunisia', 'Libya'],
    'East Africa': ['Kenya', 'Ethiopia', 'Tanzania', 'Uganda', 'Rwanda', 'South Sudan'],
    'West Africa': ['Nigeria', 'Ghana', 'Senegal', 'Ivory Coast', 'Mali'],
    'Central Africa': ['DRC', 'Cameroon', 'Chad', 'CAR', 'Congo-Brazzaville'],
    'Southern Africa': ['South Africa', 'Angola', 'Zambia', 'Zimbabwe', 'Botswana', 'Namibia'],
    'Middle East': ['Saudi Arabia', 'UAE', 'Qatar', 'Oman', 'Jordan', 'Iraq']
};

export const allCountries = Object.values(countriesByRegion).flat();

// Added more cities per country
export const citiesByCountry = {
    'Egypt': ['Cairo', 'Alexandria', 'Giza'],
    'Nigeria': ['Lagos', 'Abuja', 'Kano', 'Ibadan'],
    'Kenya': ['Nairobi', 'Mombasa', 'Kisumu'],
    'Saudi Arabia': ['Riyadh', 'Jeddah', 'Mecca', 'Medina'],
    'UAE': ['Dubai', 'Abu Dhabi', 'Sharjah'],
    'South Africa': ['Johannesburg', 'Cape Town', 'Durban', 'Pretoria'],
    'Ethiopia': ['Addis Ababa', 'Dire Dawa'],
    'Ghana': ['Accra', 'Kumasi']
};

export const allCities = Object.values(citiesByCountry).flat();

// Reports and Categories
export const categories = ['Overview', 'Security', 'Economy', 'Governance', 'Infrastructure', 'Social'];
export const reportTopics = ['Economic Development', 'Foreign Investment', 'Political Stability', 'Security Threats', 'Infrastructure Projects', 'Natural Resources', 'Trade Agreements', 'Governance Issues', 'Technology Adoption'];
export const reportEntities = ['African Development Bank', 'Sahara Group', 'NEOM', 'Ahmed Hassan', 'Nala Okoro', 'Mahmoud Al-Faisal'];
export const reportTypes = [
    { id: 'comprehensive', name: 'Comprehensive Analysis', description: 'In-depth report covering multiple aspects of selected topics' }, 
    { id: 'security', name: 'Security Brief', description: 'Focused assessment of security risks and stability factors' }, 
    { id: 'economic', name: 'Economic Outlook', description: 'Analysis of economic trends, investments, and market conditions' }, 
    { id: 'entity', name: 'Entity Profile', description: 'Detailed background on selected organizations or individuals' }
];

// Entity Data
export const mockEntityData = { 
    name: "Ahmed Hassan", 
    role: "Egyptian Finance Minister", 
    connections: 37, 
    riskScore: "Low", 
    bio: "Former banking executive appointed as Finance Minister in 2023. Known for economic reform policies and international investment initiatives.", 
    recentActivities: [
        { type: "Meeting", description: "Met with IMF representatives", date: "Mar 28, 2025" }, 
        { type: "Statement", description: "Announced new foreign investment framework", date: "Mar 15, 2025" }, 
        { type: "Travel", description: "Official visit to Saudi Arabia", date: "Feb 22, 2025" }
    ], 
    keyConnections: [
        { name: "Nala Okoro", role: "Nigerian Energy Executive", strength: "Medium" }, 
        { name: "African Development Bank", role: "Financial Institution", strength: "Strong" }, 
        { name: "UAE Investment Authority", role: "Government Agency", strength: "Strong" }
    ]
};

// Geospatial Details
export const mockLocationData = {
    'Nairobi': { 
        type: 'City', 
        country: 'Kenya', 
        region: 'East Africa', 
        population: '4.4M (Metro)', 
        stabilityIndex: 6.8,
        timestamp: Date.now(),
        recentEvents: [ 
            { id: 1, type: 'Infrastructure', title: 'New Tech Hub Launched', date: 'Mar 30, 2025', impact: 'Positive' }, 
            { id: 2, type: 'Security', title: 'Minor Protest Dispersed', date: 'Mar 25, 2025', impact: 'Neutral' }, 
            { id: 3, type: 'Economy', title: 'Foreign Investment Deal Signed', date: 'Mar 20, 2025', impact: 'Positive' }
        ], 
        keyIndicators: { 
            'GDP Growth (Projected)': '+5.5%', 
            'Unemployment Rate': '12%', 
            'Security Alert Level': 'Medium' 
        } 
    },
    'Lagos': { 
        type: 'City', 
        country: 'Nigeria', 
        region: 'West Africa', 
        population: '21M (Metro)', 
        stabilityIndex: 5.2,
        timestamp: Date.now(),
        recentEvents: [ 
            { id: 4, type: 'Security', title: 'Increased Patrols in Ikeja', date: 'Apr 1, 2025', impact: 'Neutral' }, 
            { id: 5, type: 'Economy', title: 'Port Congestion Reported', date: 'Mar 28, 2025', impact: 'Negative' }
        ], 
        keyIndicators: { 
            'Inflation Rate': '18%', 
            'Security Alert Level': 'High', 
            'Energy Production': 'Stable' 
        } 
    },
    'East Africa': { 
        type: 'Region', 
        population: '~450M', 
        stabilityIndex: 6.1,
        timestamp: Date.now(),
        recentEvents: [ 
            { id: 6, type: 'Politics', title: 'Regional Trade Summit Concluded', date: 'Mar 29, 2025', impact: 'Positive' }, 
            { id: 7, type: 'Environment', title: 'Drought Conditions Worsen in Horn of Africa', date: 'Mar 27, 2025', impact: 'Negative' }
        ], 
        keyIndicators: { 
            'Regional GDP Growth': '+4.8%', 
            'Cross-border Incidents': 'Low', 
            'Investment Trend': 'Increasing' 
        } 
    },
    'Kenya': { 
        type: 'Country', 
        region: 'East Africa', 
        population: '~55M', 
        stabilityIndex: 6.5,
        timestamp: Date.now(),
        recentEvents: [ 
            { id: 8, type: 'Politics', title: 'Parliamentary Session on Budget', date: 'Apr 2, 2025', impact: 'Neutral' }, 
            { id: 9, type: 'Economy', title: 'New Mobile Money Regulations', date: 'Mar 31, 2025', impact: 'Mixed' }
        ], 
        keyIndicators: { 
            'National GDP Growth': '+5.2%', 
            'Debt-to-GDP Ratio': '68%', 
            'Tourism Arrivals': '+15% YoY' 
        } 
    }
};

// Mock Reports Data
export const mockReports = [
    { 
        id: 'rep1',
        title: "East African Infrastructure Development", 
        region: "East Africa", 
        category: "Infrastructure" as ReportCategory, 
        date: "Apr 1, 2025", 
        confidence: "High" as ReportConfidence, 
        confColor: "green",
        summary: "Analysis of major infrastructure projects across East Africa, focusing on transportation networks, energy generation, and digital infrastructure.",
        pdfUrl: "#"
    },
    { 
        id: 'rep2',
        title: "Middle East Energy Transition Analysis", 
        region: "Middle East", 
        category: "Economy" as ReportCategory, 
        date: "Mar 29, 2025", 
        confidence: "High" as ReportConfidence, 
        confColor: "green",
        summary: "Comprehensive assessment of energy transition efforts in the Middle East, including renewable projects, policy changes, and economic implications.",
        pdfUrl: "#"
    },
    { 
        id: 'rep3',
        title: "West African Security Situation", 
        region: "West Africa", 
        category: "Security" as ReportCategory, 
        date: "Mar 27, 2025", 
        confidence: "Medium" as ReportConfidence, 
        confColor: "yellow",
        summary: "Analysis of security challenges and stability factors across West African nations, with forecasts and risk assessments.",
        pdfUrl: "#"
    },
    { 
        id: 'rep4',
        title: "Egyptian Economic Reforms Impact", 
        region: "North Africa", 
        category: "Economy" as ReportCategory, 
        date: "Mar 25, 2025", 
        confidence: "High" as ReportConfidence, 
        confColor: "green",
        summary: "Detailed examination of recent economic reforms in Egypt, their implementation progress, and impacts on key industries and financial markets.",
        pdfUrl: "#"
    }
];

// Enhanced alert types for the Alerts Feed
export const mockAlerts = [
    {
        id: 'alert1',
        type: 'forecast' as AlertType,
        title: 'Forecast: Increased Political Instability',
        description: 'AI analysis predicts a 65% likelihood of increased protests in Sudan based on economic indicators and social sentiment trends.',
        timeframe: 'Predicted for Q3 2025',
        severity: 'medium' as AlertSeverity,
        icon: 'TrendingUp',
        color: 'purple',
        relatedEntities: ['Sudan Government', 'Opposition Coalition'],
        actionUrl: '#scenario',
        status: 'new' as AlertStatus
    },
    {
        id: 'alert2',
        type: 'anomaly' as AlertType,
        title: 'Anomaly Detected: Unusual Shipping Volume',
        description: 'Detected a 3-sigma deviation in shipping container volume at Port Said. Possible cause: unreported strike or logistical disruption.',
        timeframe: 'Last 24h',
        severity: 'medium' as AlertSeverity,
        icon: 'AlertCircle',
        color: 'orange',
        relatedEntities: ['Port Said Authority', 'Egyptian Maritime Transport'],
        actionUrl: '#investigate',
        status: 'new' as AlertStatus
    },
    {
        id: 'alert3',
        type: 'security' as AlertType,
        title: 'High Priority: Security Incident in Niger Delta',
        description: 'Detected unusual activity near oil production facilities. Potential impact on supply chains. Action recommended.',
        timeframe: '2 minutes ago',
        severity: 'high' as AlertSeverity,
        icon: 'AlertTriangle',
        color: 'red',
        relatedEntities: ['Local Security Forces', 'Oil Production Companies'],
        actionUrl: '#details',
        status: 'new' as AlertStatus
    }
];

// Data connector types for the data import features
export const dataConnectorTypes = [
    {
        id: 'csv',
        name: 'CSV Upload',
        description: 'Upload structured data as CSV files',
        icon: 'FileSpreadsheet',
        setupComplexity: 'Low'
    },
    {
        id: 'api',
        name: 'API Connection',
        description: 'Connect to external data sources via API',
        icon: 'Link',
        setupComplexity: 'Medium'
    },
    {
        id: 'database',
        name: 'Database Connection',
        description: 'Direct connection to SQL or NoSQL databases',
        icon: 'Database',
        setupComplexity: 'High'
    },
    {
        id: 'streaming',
        name: 'Real-time Data Stream',
        description: 'Connect to streaming data sources',
        icon: 'Waves',
        setupComplexity: 'High'
    },
    {
        id: 'scraping',
        name: 'Web Scraping',
        description: 'Extract data from websites and online sources',
        icon: 'Globe',
        setupComplexity: 'Medium'
    }
];

// Enhanced data for network analysis
export const networkEntities = [
    { id: 'e1', name: 'Ahmed Hassan', type: 'person', role: 'Egyptian Finance Minister', influence: 8.5, riskScore: 'Low' },
    { id: 'e2', name: 'Nala Okoro', type: 'person', role: 'Nigerian Energy Executive', influence: 7.8, riskScore: 'Medium' },
    { id: 'e3', name: 'African Development Bank', type: 'organization', role: 'Financial Institution', influence: 9.2, riskScore: 'Low' },
    { id: 'e4', name: 'UAE Investment Authority', type: 'organization', role: 'Government Agency', influence: 8.9, riskScore: 'Low' },
    { id: 'e5', name: 'Sahara Group', type: 'organization', role: 'Energy Conglomerate', influence: 8.3, riskScore: 'Medium' },
    { id: 'e6', name: 'Mahmoud Al-Faisal', type: 'person', role: 'Saudi Investment Director', influence: 8.7, riskScore: 'Low' },
    { id: 'e7', name: 'Egyptian Central Bank', type: 'organization', role: 'Financial Regulator', influence: 9.0, riskScore: 'Low' },
    { id: 'e8', name: 'Lagos State Government', type: 'organization', role: 'Regional Government', influence: 7.5, riskScore: 'Medium' },
    { id: 'e9', name: 'East African Community', type: 'organization', role: 'Regional Body', influence: 8.2, riskScore: 'Low' },
    { id: 'e10', name: 'Nairobi', type: 'location', role: 'Capital City', influence: 7.9, riskScore: 'Medium' }
];

export const networkConnections = [
    { source: 'e1', target: 'e3', strength: 'Strong', type: 'Professional' },
    { source: 'e1', target: 'e4', strength: 'Strong', type: 'Financial' },
    { source: 'e1', target: 'e7', strength: 'Strong', type: 'Governance' },
    { source: 'e2', target: 'e5', strength: 'Strong', type: 'Employment' },
    { source: 'e2', target: 'e8', strength: 'Medium', type: 'Regulatory' },
    { source: 'e2', target: 'e3', strength: 'Medium', type: 'Financial' },
    { source: 'e3', target: 'e9', strength: 'Strong', type: 'Funding' },
    { source: 'e4', target: 'e6', strength: 'Strong', type: 'Governance' },
    { source: 'e5', target: 'e8', strength: 'Medium', type: 'Operational' },
    { source: 'e9', target: 'e10', strength: 'Strong', type: 'Geographic' },
    { source: 'e6', target: 'e1', strength: 'Medium', type: 'Professional' }
];

// Scenario planning data
export const scenarioTemplates = [
    { 
        id: 'economic-shock',
        name: 'Economic Shock',
        description: 'Model impacts of sudden economic changes like currency devaluation or commodity price shifts',
        variables: ['Severity (%)', 'Duration (months)', 'Affected Sectors'],
        defaultTimeHorizon: '6 Months'
    },
    { 
        id: 'political-event',
        name: 'Political Event',
        description: 'Analyze implications of elections, regime changes, or significant policy shifts',
        variables: ['Outcome Likelihood (%)', 'Stability Impact', 'International Relations Impact'],
        defaultTimeHorizon: '1 Year'
    },
    { 
        id: 'security-crisis',
        name: 'Security Crisis',
        description: 'Evaluate potential security situations and their regional implications',
        variables: ['Severity', 'Geographic Spread', 'Duration (weeks)'],
        defaultTimeHorizon: '3 Months'
    },
    { 
        id: 'environmental-event',
        name: 'Environmental Event',
        description: 'Project impacts of climate events, natural disasters, or resource scarcity',
        variables: ['Severity', 'Duration (months)', 'Infrastructure Impact'],
        defaultTimeHorizon: '1 Year'
    },
    { 
        id: 'custom',
        name: 'Custom Scenario',
        description: 'Create a fully customized scenario with your own variables and parameters',
        variables: ['User Defined'],
        defaultTimeHorizon: 'User Defined'
    }
];

// Added helper types for TypeScript
export type Region = typeof regions[number];
export type Country = string;
export type City = string;
export type ReportType = typeof reportTypes[number]['id'];
export type Category = typeof categories[number];
export type ReportTopic = typeof reportTopics[number];
export type TimeRange = typeof timeRanges[number];

// More types can be added as needed for type safety throughout the application
