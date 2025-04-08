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
    'Egypt': ['Cairo', 'Alexandria', 'Giza', 'Luxor', 'Aswan', 'Port Said', 'Suez'],
    'Nigeria': ['Lagos', 'Abuja', 'Kano', 'Ibadan', 'Port Harcourt', 'Benin City', 'Maiduguri', 'Kaduna'],
    'Kenya': ['Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Eldoret', 'Malindi'],
    'Saudi Arabia': ['Riyadh', 'Jeddah', 'Mecca', 'Medina', 'Dammam', 'Tabuk', 'Khobar'],
    'UAE': ['Dubai', 'Abu Dhabi', 'Sharjah', 'Ajman', 'Ras Al Khaimah', 'Fujairah'],
    'South Africa': ['Johannesburg', 'Cape Town', 'Durban', 'Pretoria', 'Port Elizabeth', 'Bloemfontein', 'East London'],
    'Ethiopia': ['Addis Ababa', 'Dire Dawa', 'Bahir Dar', 'Adama', 'Gondar', 'Hawassa'],
    'Ghana': ['Accra', 'Kumasi', 'Tamale', 'Takoradi', 'Cape Coast', 'Sekondi'],
    'Algeria': ['Algiers', 'Oran', 'Constantine', 'Annaba', 'Blida'],
    'Morocco': ['Casablanca', 'Rabat', 'Marrakesh', 'Fes', 'Tangier', 'Agadir'],
    'Tunisia': ['Tunis', 'Sfax', 'Sousse', 'Kairouan', 'Bizerte'],
    'Libya': ['Tripoli', 'Benghazi', 'Misrata', 'Tobruk', 'Sabha'],
    'Tanzania': ['Dar es Salaam', 'Dodoma', 'Arusha', 'Mwanza', 'Zanzibar City'],
    'Uganda': ['Kampala', 'Gulu', 'Mbarara', 'Jinja', 'Entebbe'],
    'Rwanda': ['Kigali', 'Butare', 'Gisenyi', 'Ruhengeri'],
    'Senegal': ['Dakar', 'Thiès', 'Saint-Louis', 'Touba', 'Ziguinchor'],
    'Ivory Coast': ['Abidjan', 'Yamoussoukro', 'Bouaké', 'Korhogo', 'San Pedro'],
    'Mali': ['Bamako', 'Sikasso', 'Mopti', 'Gao', 'Timbuktu'],
    'DRC': ['Kinshasa', 'Lubumbashi', 'Kisangani', 'Goma', 'Bukavu'],
    'Cameroon': ['Yaoundé', 'Douala', 'Bamenda', 'Garoua', 'Maroua'],
    'Sudan': ['Khartoum', 'Omdurman', 'Port Sudan', 'Kassala', 'El Obeid']
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

// Export alertsData as mockAlerts to fix the import in store.ts
export const alertsData = [
    {
        id: 'alert1',
        type: 'forecast' as AlertType,
        title: 'Political Transition Risk in Sudan',
        description: 'Analysis indicates a 68% probability of significant political transition in Sudan within next 6 months. Key indicators: increased protest activity, military faction tensions, and economic distress signals.',
        timeframe: 'Predicted for Q3 2025',
        severity: 'medium' as AlertSeverity,
        icon: 'TrendingUp',
        color: 'purple',
        relatedEntities: ['Sudan Government', 'Opposition Coalition', 'Sudanese Armed Forces'],
        actionUrl: '#scenario',
        status: 'new' as AlertStatus,
        timestamp: new Date(2025, 3, 5),
        source: 'AI Forecasting Engine',
        confidenceScore: 0.68
    },
    {
        id: 'alert2',
        type: 'anomaly' as AlertType,
        title: 'Unusual Shipping Volume at Port Said',
        description: 'Detected a 3-sigma deviation in shipping container volume at Port Said. Possible cause: unreported strike or logistical disruption.',
        timeframe: 'Last 24h',
        severity: 'medium' as AlertSeverity,
        icon: 'AlertCircle',
        color: 'orange',
        relatedEntities: ['Port Said Authority', 'Egyptian Maritime Transport', 'Suez Canal Authority'],
        actionUrl: '#investigate',
        status: 'new' as AlertStatus,
        timestamp: new Date(2025, 3, 6),
        source: 'Maritime Analytics System',
        confidenceScore: 0.92
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
        relatedEntities: ['Local Security Forces', 'Oil Production Companies', 'NNPC'],
        actionUrl: '#details',
        status: 'new' as AlertStatus,
        timestamp: new Date(2025, 3, 7, 9, 45),
        source: 'Human Intelligence',
        confidenceScore: 0.85
    },
    {
        id: 'alert4',
        type: 'economic' as AlertType,
        title: 'Currency Depreciation Accelerating in Ghana',
        description: 'The Ghanaian Cedi has depreciated 8.7% against USD in the past week, exceeding forecasted models. Potential impacts on import-dependent sectors.',
        timeframe: 'Past 7 days',
        severity: 'medium' as AlertSeverity,
        icon: 'TrendingDown',
        color: 'orange',
        relatedEntities: ['Bank of Ghana', 'Ghana Ministry of Finance', 'Import Associations'],
        actionUrl: '#economic-analysis',
        status: 'inProgress' as AlertStatus,
        timestamp: new Date(2025, 3, 4),
        source: 'Economic Monitoring System',
        confidenceScore: 0.95
    },
    {
        id: 'alert5',
        type: 'political' as AlertType,
        title: 'Coalition Forming Among Opposition Parties in Kenya',
        description: 'Intelligence indicates advanced negotiations between three major opposition parties to form a coalition ahead of elections. Likelihood of formal announcement within 2 weeks is high.',
        timeframe: 'Developing',
        severity: 'low' as AlertSeverity,
        icon: 'Users',
        color: 'blue',
        relatedEntities: ['ODM Party', 'Jubilee Party', 'Wiper Democratic Movement'],
        actionUrl: '#political-analysis',
        status: 'new' as AlertStatus,
        timestamp: new Date(2025, 3, 3),
        source: 'Political Analysis Unit',
        confidenceScore: 0.78
    },
    {
        id: 'alert6',
        type: 'security' as AlertType,
        title: 'Uptick in Cybersecurity Incidents Targeting Financial Institutions',
        description: 'Detected 73% increase in sophisticated cyber attacks targeting banking infrastructure in East Africa over the past 72 hours. Coordinated campaign suspected.',
        timeframe: 'Past 72h',
        severity: 'high' as AlertSeverity,
        icon: 'Shield',
        color: 'red',
        relatedEntities: ['East African Banking Association', 'Central Banks', 'Financial CERT'],
        actionUrl: '#cyber-threat',
        status: 'new' as AlertStatus,
        timestamp: new Date(2025, 3, 5, 15, 20),
        source: 'Cybersecurity Monitoring',
        confidenceScore: 0.88
    },
    {
        id: 'alert7',
        type: 'anomaly' as AlertType,
        title: 'Unusual Social Media Activity Pattern Detected',
        description: 'AI systems have identified coordinated information campaign across social platforms focused on Kenyan election integrity. 10,000+ accounts showing suspicious behavior patterns.',
        timeframe: 'Past 48h',
        severity: 'medium' as AlertSeverity,
        icon: 'MessageCircle',
        color: 'yellow',
        relatedEntities: ['Social Media Platforms', 'Kenya Electoral Commission', 'Digital Rights NGOs'],
        actionUrl: '#information-operations',
        status: 'new' as AlertStatus,
        timestamp: new Date(2025, 3, 6, 8, 15),
        source: 'Social Media Analytics',
        confidenceScore: 0.82
    },
    {
        id: 'alert8',
        type: 'forecast' as AlertType,
        title: 'Agricultural Output Decline Projected for Southern Africa',
        description: 'Seasonal forecast models indicate 30-40% reduction in maize yields across Southern Africa due to emerging drought conditions. Food security implications by Q3 2025.',
        timeframe: 'Q3 2025 Forecast',
        severity: 'high' as AlertSeverity,
        icon: 'Cloud',
        color: 'red',
        relatedEntities: ['Southern African Development Community', 'FAO', 'National Agricultural Boards'],
        actionUrl: '#agricultural-forecast',
        status: 'new' as AlertStatus,
        timestamp: new Date(2025, 3, 2),
        source: 'Agricultural Analytics',
        confidenceScore: 0.75
    },
    {
        id: 'alert9',
        type: 'economic' as AlertType,
        title: 'Major Infrastructure Investment Announced for Morocco',
        description: 'Consortium of Gulf investors has committed $8.5 billion for railway and port development in Morocco, potentially transforming regional logistics capabilities.',
        timeframe: 'Announced Today',
        severity: 'low' as AlertSeverity,
        icon: 'Building',
        color: 'green',
        relatedEntities: ['Morocco Investment Authority', 'Gulf Investment Consortium', 'Transport Ministry'],
        actionUrl: '#investment-details',
        status: 'new' as AlertStatus,
        timestamp: new Date(2025, 3, 7, 11, 30),
        source: 'Economic Intelligence Unit',
        confidenceScore: 0.97
    },
    {
        id: 'alert10',
        type: 'security' as AlertType,
        title: 'Maritime Security Incident in Gulf of Aden',
        description: 'Commercial vessel reported attempted boarding by unknown actors 30nm off Yemen coast. Vessel secured, monitoring for pattern development.',
        timeframe: '6 hours ago',
        severity: 'medium' as AlertSeverity,
        icon: 'Anchor',
        color: 'orange',
        relatedEntities: ['International Maritime Organization', 'Shipping Companies', 'Regional Naval Forces'],
        actionUrl: '#maritime-security',
        status: 'inProgress' as AlertStatus,
        timestamp: new Date(2025, 3, 7, 3, 15),
        source: 'Maritime Security Center',
        confidenceScore: 0.89
    },
    {
        id: 'alert11',
        type: 'political' as AlertType,
        title: 'Cabinet Reshuffle Imminent in Tanzania',
        description: 'Multiple sources indicate Tanzanian president preparing significant cabinet changes affecting key economic and foreign affairs positions.',
        timeframe: 'Expected within 72h',
        severity: 'low' as AlertSeverity,
        icon: 'Users',
        color: 'blue',
        relatedEntities: ['Tanzania President\'s Office', 'Ministry of Foreign Affairs', 'Ministry of Finance'],
        actionUrl: '#political-development',
        status: 'new' as AlertStatus,
        timestamp: new Date(2025, 3, 5, 18, 40),
        source: 'Political Monitoring Team',
        confidenceScore: 0.81
    },
    {
        id: 'alert12',
        type: 'anomaly' as AlertType,
        title: 'Unusual Military Movement in Eastern Libya',
        description: 'Satellite imagery shows non-standard deployment patterns of military equipment near eastern border region. Assessment ongoing.',
        timeframe: 'Detected 12h ago',
        severity: 'high' as AlertSeverity,
        icon: 'Truck',
        color: 'red',
        relatedEntities: ['Libyan National Army', 'Border Security Forces', 'Regional Militias'],
        actionUrl: '#defense-intelligence',
        status: 'inProgress' as AlertStatus,
        timestamp: new Date(2025, 3, 6, 22, 10),
        source: 'Satellite Intelligence',
        confidenceScore: 0.72
    }
];

export const mockAlerts = alertsData;

// Expanded Reports Data with more detailed entries
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
        pdfUrl: "#",
        authors: ["Sarah Kimani", "David Ochieng"],
        tags: ["infrastructure", "transportation", "energy", "digital transformation"],
        relatedEntities: ["East African Community", "African Development Bank", "Kenya Railways Corporation"]
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
        pdfUrl: "#",
        authors: ["Mahmoud Al-Faisal", "Aisha Al-Qahtani"],
        tags: ["energy", "renewables", "policy reform", "sustainable development"],
        relatedEntities: ["Saudi Ministry of Energy", "UAE Investment Authority", "NEOM"]
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
        pdfUrl: "#",
        authors: ["Jean-Pierre Kouassi", "Fatima Diallo"],
        tags: ["security", "risk assessment", "terrorism", "peacekeeping"],
        relatedEntities: ["ECOWAS", "Nigerian Security Forces", "G5 Sahel"]
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
        pdfUrl: "#",
        authors: ["Ahmed Hassan", "Layla El-Sayed"],
        tags: ["economic reform", "investment climate", "fiscal policy", "financial markets"],
        relatedEntities: ["Egyptian Central Bank", "IMF", "Egyptian Ministry of Finance"]
    },
    {
        id: 'rep5',
        title: "Rwanda Digital Economy Transformation",
        region: "East Africa",
        category: "Economy" as ReportCategory,
        date: "Mar 23, 2025",
        confidence: "High" as ReportConfidence,
        confColor: "green",
        summary: "Assessment of Rwanda's digital economy initiatives, technology adoption rates, and potential as an African technology hub.",
        pdfUrl: "#",
        authors: ["Grace Mugisha", "Paul Kagame"],
        tags: ["digital economy", "technology adoption", "fintech", "innovation"],
        relatedEntities: ["Rwanda Development Board", "Kigali Innovation City", "African Development Bank"]
    },
    {
        id: 'rep6',
        title: "South African Mining Sector Outlook",
        region: "Southern Africa",
        category: "Economy" as ReportCategory,
        date: "Mar 21, 2025",
        confidence: "Medium" as ReportConfidence,
        confColor: "yellow",
        summary: "Analysis of South Africa's mining industry challenges, opportunities, and impact of regulatory changes on investment and production.",
        pdfUrl: "#",
        authors: ["Thabo Mofokeng", "Elizabeth Van der Merwe"],
        tags: ["mining", "commodities", "regulatory environment", "labor relations"],
        relatedEntities: ["South African Mining Council", "Anglo American", "National Union of Mineworkers"]
    },
    {
        id: 'rep7',
        title: "East African Community Integration Progress",
        region: "East Africa",
        category: "Governance" as ReportCategory,
        date: "Mar 18, 2025",
        confidence: "Medium" as ReportConfidence,
        confColor: "yellow",
        summary: "Evaluation of political integration progress, challenges, and economic impacts of the East African Community's policies.",
        pdfUrl: "#",
        authors: ["James Orengo", "Faith Mwangi"],
        tags: ["regional integration", "trade policy", "political cooperation", "customs union"],
        relatedEntities: ["East African Community", "East African Court of Justice", "East African Legislative Assembly"]
    },
    {
        id: 'rep8',
        title: "Saudi Arabia Urban Development Projects",
        region: "Middle East",
        category: "Infrastructure" as ReportCategory,
        date: "Mar 15, 2025",
        confidence: "High" as ReportConfidence,
        confColor: "green",
        summary: "Overview of major urban development and smart city initiatives in Saudi Arabia, including NEOM and other Vision 2030 projects.",
        pdfUrl: "#",
        authors: ["Abdullah Al-Saud", "Fatima Al-Otaibi"],
        tags: ["urban development", "smart cities", "Vision 2030", "infrastructure investment"],
        relatedEntities: ["Saudi PIF", "NEOM", "Saudi Ministry of Housing"]
    },
    {
        id: 'rep9',
        title: "Nigeria Fintech Ecosystem Assessment",
        region: "West Africa",
        category: "Economy" as ReportCategory,
        date: "Mar 12, 2025",
        confidence: "High" as ReportConfidence,
        confColor: "green",
        summary: "Analysis of Nigeria's growing fintech sector, regulatory environment, investment trends, and impact on financial inclusion.",
        pdfUrl: "#",
        authors: ["Nala Okoro", "Chidi Okonkwo"],
        tags: ["fintech", "financial inclusion", "mobile money", "banking innovation"],
        relatedEntities: ["Nigerian Central Bank", "Flutterwave", "Nigerian Fintech Association"]
    },
    {
        id: 'rep10',
        title: "North African Water Security Challenges",
        region: "North Africa",
        category: "Infrastructure" as ReportCategory,
        date: "Mar 8, 2025",
        confidence: "Medium" as ReportConfidence,
        confColor: "yellow",
        summary: "Assessment of water scarcity issues affecting North African countries, including infrastructure needs, policy responses, and regional cooperation.",
        pdfUrl: "#",
        authors: ["Hassan El-Mahdi", "Samira Benali"],
        tags: ["water security", "climate adaptation", "resource management", "regional cooperation"],
        relatedEntities: ["African Development Bank", "Nile Basin Initiative", "FAO"]
    },
    {
        id: 'rep11',
        title: "UAE Artificial Intelligence Strategy Implementation",
        region: "Middle East",
        category: "Technology" as ReportCategory,
        date: "Mar 5, 2025",
        confidence: "High" as ReportConfidence,
        confColor: "green",
        summary: "Evaluation of the UAE's artificial intelligence strategy implementation, sectoral impacts, and positioning as a global AI leader.",
        pdfUrl: "#",
        authors: ["Mohammed Al-Maktoum", "Sarah Al-Ameri"],
        tags: ["artificial intelligence", "technology policy", "digital transformation", "innovation ecosystems"],
        relatedEntities: ["UAE AI Ministry", "Dubai Future Foundation", "Technology Innovation Institute"]
    },
    {
        id: 'rep12',
        title: "DRC Mining Sector Governance",
        region: "Central Africa",
        category: "Governance" as ReportCategory,
        date: "Mar 1, 2025",
        confidence: "Low" as ReportConfidence,
        confColor: "red",
        summary: "Assessment of governance challenges in the Democratic Republic of Congo's mining sector, including transparency initiatives and regulatory reforms.",
        pdfUrl: "#",
        authors: ["Jean-Paul Tshimanga", "Marie Mbeki"],
        tags: ["mining governance", "transparency", "regulatory reform", "resource management"],
        relatedEntities: ["DRC Ministry of Mines", "EITI", "Global Witness"]
    }
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
            'Security Alert Level': 'Medium',
            'Foreign Investment': '+18% YoY',
            'Infrastructure Rating': '6.2/10'
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
            { id: 5, type: 'Economy', title: 'Port Congestion Reported', date: 'Mar 28, 2025', impact: 'Negative' },
            { id: 101, type: 'Infrastructure', title: 'New Power Plant Operational', date: 'Mar 15, 2025', impact: 'Positive' },
            { id: 102, type: 'Social', title: 'University Staff Strike', date: 'Mar 10, 2025', impact: 'Negative' }
        ], 
        keyIndicators: { 
            'Inflation Rate': '18%', 
            'Security Alert Level': 'High', 
            'Energy Production': 'Stable',
            'Port Activity': '-8% MoM',
            'Housing Prices': '+12% YoY'
        } 
    },
    'Cairo': {
        type: 'City',
        country: 'Egypt',
        region: 'North Africa',
        population: '19.5M (Metro)',
        stabilityIndex: 5.9,
        timestamp: Date.now(),
        recentEvents: [
            { id: 103, type: 'Governance', title: 'Municipal Elections Announced', date: 'Apr 3, 2025', impact: 'Neutral' },
            { id: 104, type: 'Economy', title: 'Tourism Numbers Surpass Pre-Pandemic Levels', date: 'Mar 27, 2025', impact: 'Positive' },
            { id: 105, type: 'Infrastructure', title: 'Metro Line 4 Construction Delayed', date: 'Mar 18, 2025', impact: 'Negative' }
        ],
        keyIndicators: {
            'Tourism Revenue': '+28% YoY',
            'Unemployment Rate': '11.2%',
            'Security Alert Level': 'Medium',
            'FDI Inflow': '+8.5% QoQ',
            'Water Security Index': '4.3/10'
        }
    },
    'Johannesburg': {
        type: 'City',
        country: 'South Africa',
        region: 'Southern Africa',
        population: '5.8M (Metro)',
        stabilityIndex: 5.7,
        timestamp: Date.now(),
        recentEvents: [
            { id: 106, type: 'Security', title: 'Decrease in Urban Crime Reported', date: 'Apr 2, 2025', impact: 'Positive' },
            { id: 107, type: 'Economy', title: 'Mining Sector Growth Slows', date: 'Mar 25, 2025', impact: 'Negative' },
            { id: 108, type: 'Infrastructure', title: 'Smart City Initiative Launched', date: 'Mar 12, 2025', impact: 'Positive' }
        ],
        keyIndicators: {
            'Stock Exchange Performance': '+3.2% MTD',
            'Unemployment Rate': '27.1%',
            'Power Reliability': '6.5/10',
            'Business Confidence Index': '52.3',
            'Crime Rate': '-7% YoY'
        }
    },
    'East Africa': { 
        type: 'Region', 
        population: '450M', 
        stabilityIndex: 6.1,
        timestamp: Date.now(),
        recentEvents: [ 
            { id: 6, type: 'Politics', title: 'Regional Trade Summit Concluded', date: 'Mar 29, 2025', impact: 'Positive' }, 
            { id: 7, type: 'Environment', title: 'Drought Conditions Worsen in Horn of Africa', date: 'Mar 27, 2025', impact: 'Negative' },
            { id: 109, type: 'Economy', title: 'Regional Currency Stability Pact Discussed', date: 'Mar 22, 2025', impact: 'Neutral' },
            { id: 110, type: 'Security', title: 'Cross-Border Security Cooperation Agreement', date: 'Mar 18, 2025', impact: 'Positive' }
        ], 
        keyIndicators: { 
            'Regional GDP Growth': '+4.8%', 
            'Cross-border Incidents': 'Low', 
            'Investment Trend': 'Increasing',
            'Humanitarian Aid Needs': '+12% YoY',
            'Regional Trade Volume': '+7.3% YoY'
        } 
    },
    'West Africa': {
        type: 'Region',
        population: '380M',
        stabilityIndex: 5.5,
        timestamp: Date.now(),
        recentEvents: [
            { id: 111, type: 'Politics', title: 'ECOWAS Leadership Summit', date: 'Apr 5, 2025', impact: 'Neutral' },
            { id: 112, type: 'Economy', title: 'Regional Manufacturing Initiative Launch', date: 'Mar 28, 2025', impact: 'Positive' },
            { id: 113, type: 'Security', title: 'Maritime Security Challenges in Gulf of Guinea', date: 'Mar 20, 2025', impact: 'Negative' }
        ],
        keyIndicators: {
            'Regional GDP Growth': '+3.9%',
            'Cross-border Trade': '+5.2% YoY',
            'Security Incidents': '+8% QoQ',
            'Agricultural Output': '-2.1% YoY',
            'Foreign Investment': 'Stable'
        }
    },
    'North Africa': {
        type: 'Region',
        population: '250M',
        stabilityIndex: 5.8,
        timestamp: Date.now(),
        recentEvents: [
            { id: 114, type: 'Politics', title: 'Mediterranean Cooperation Forum', date: 'Apr 4, 2025', impact: 'Positive' },
            { id: 115, type: 'Economy', title: 'Regional Green Energy Initiative', date: 'Mar 25, 2025', impact: 'Positive' },
            { id: 116, type: 'Social', title: 'Youth Unemployment Protests', date: 'Mar 10, 2025', impact: 'Negative' }
        ],
        keyIndicators: {
            'Regional GDP Growth': '+4.1%',
            'Tourism Revenue': '+18% YoY',
            'Youth Unemployment': '25.3%',
            'Energy Exports': '+7.2% YoY',
            'EU Trade Volume': '+9.5% YoY'
        }
    },
    'Kenya': { 
        type: 'Country', 
        region: 'East Africa', 
        population: '55M', 
        stabilityIndex: 6.5,
        timestamp: Date.now(),
        recentEvents: [ 
            { id: 8, type: 'Politics', title: 'Parliamentary Session on Budget', date: 'Apr 2, 2025', impact: 'Neutral' }, 
            { id: 9, type: 'Economy', title: 'New Mobile Money Regulations', date: 'Mar 31, 2025', impact: 'Mixed' },
            { id: 117, type: 'Security', title: 'Border Security Enhancement Program', date: 'Mar 22, 2025', impact: 'Positive' },
            { id: 118, type: 'Infrastructure', title: 'Rural Electrification Progress Report', date: 'Mar 15, 2025', impact: 'Positive' }
        ], 
        keyIndicators: { 
            'National GDP Growth': '+5.2%', 
            'Debt-to-GDP Ratio': '68%', 
            'Tourism Arrivals': '+15% YoY',
            'Technology Sector Growth': '+22% YoY',
            'Agricultural Output': '+3.8% YoY',
            'Mobile Banking Penetration': '87%',
            'Foreign Investment': '+9.5% YoY'
        } 
    },
    'Nigeria': {
        type: 'Country',
        region: 'West Africa',
        population: '215M',
        stabilityIndex: 5.3,
        timestamp: Date.now(),
        recentEvents: [
            { id: 119, type: 'Economy', title: 'Oil Production Targets Adjusted', date: 'Apr 3, 2025', impact: 'Neutral' },
            { id: 120, type: 'Politics', title: 'State Governance Reform Bill Passed', date: 'Mar 29, 2025', impact: 'Positive' },
            { id: 121, type: 'Security', title: 'New Counter-Terrorism Strategy Announced', date: 'Mar 20, 2025', impact: 'Positive' },
            { id: 122, type: 'Social', title: 'National Education Strike Resolved', date: 'Mar 12, 2025', impact: 'Positive' }
        ],
        keyIndicators: {
            'National GDP Growth': '+3.8%',
            'Oil Production': '1.95M barrels/day',
            'Inflation Rate': '17.5%',
            'FDI Inflow': '-2.3% YoY',
            'Tech Startup Funding': '+35% YoY',
            'Manufacturing Output': '+4.1% YoY',
            'Foreign Reserves': '$35.7B'
        }
    },
    'Egypt': {
        type: 'Country',
        region: 'North Africa',
        population: '112M',
        stabilityIndex: 5.8,
        timestamp: Date.now(),
        recentEvents: [
            { id: 123, type: 'Economy', title: 'IMF Program Review Completed', date: 'Apr 5, 2025', impact: 'Positive' },
            { id: 124, type: 'Infrastructure', title: 'New Capital City Phase 2 Launch', date: 'Mar 30, 2025', impact: 'Positive' },
            { id: 125, type: 'Diplomacy', title: 'Nile Water Agreement Discussions', date: 'Mar 22, 2025', impact: 'Neutral' },
            { id: 126, type: 'Tourism', title: 'Archaeological Discovery in Luxor', date: 'Mar 15, 2025', impact: 'Positive' }
        ],
        keyIndicators: {
            'National GDP Growth': '+5.0%',
            'Suez Canal Revenue': '+12% YoY',
            'Inflation Rate': '9.8%',
            'Tourism Income': '+24% YoY',
            'Foreign Reserves': '$41.2B',
            'Debt-to-GDP Ratio': '87.5%',
            'Unemployment Rate': '10.2%'
        }
    },
    'South Africa': {
        type: 'Country',
        region: 'Southern Africa',
        population: '62M',
        stabilityIndex: 5.9,
        timestamp: Date.now(),
        recentEvents: [
            { id: 127, type: 'Politics', title: 'Local Elections Results Announced', date: 'Apr 4, 2025', impact: 'Neutral' },
            { id: 128, type: 'Economy', title: 'Credit Rating Outlook Improved', date: 'Mar 28, 2025', impact: 'Positive' },
            { id: 129, type: 'Infrastructure', title: 'Energy Grid Modernization Plan', date: 'Mar 18, 2025', impact: 'Positive' },
            { id: 130, type: 'Social', title: 'Healthcare Worker Shortage Crisis', date: 'Mar 10, 2025', impact: 'Negative' }
        ],
        keyIndicators: {
            'National GDP Growth': '+2.8%',
            'Unemployment Rate': '26.7%',
            'Mining Output': '+5.2% YoY',
            'Tourism Arrivals': '+18% YoY',
            'Power Generation Capacity': '85% of demand',
            'JSE Index Performance': '+7.2% YTD',
            'Manufacturing PMI': '52.3'
        }
    },
    'UAE': {
        type: 'Country',
        region: 'Middle East',
        population: '10.2M',
        stabilityIndex: 8.2,
        timestamp: Date.now(),
        recentEvents: [
            { id: 131, type: 'Economy', title: 'Non-Oil Sector Growth Acceleration', date: 'Apr 3, 2025', impact: 'Positive' },
            { id: 132, type: 'Diplomacy', title: 'Regional Investment Summit', date: 'Mar 25, 2025', impact: 'Positive' },
            { id: 133, type: 'Technology', title: 'AI Governance Framework Launch', date: 'Mar 17, 2025', impact: 'Positive' },
            { id: 134, type: 'Infrastructure', title: 'New Sustainable City Masterplan', date: 'Mar 8, 2025', impact: 'Positive' }
        ],
        keyIndicators: {
            'National GDP Growth': '+4.8%',
            'Non-Oil GDP Growth': '+5.3%',
            'Tourism Revenue': '+15% YoY',
            'FDI Inflow': '+12.5% YoY',
            'Inflation Rate': '2.1%',
            'Real Estate Index': '+3.2% QoQ',
            'Sovereign Wealth Fund Assets': '$1.3T'
        }
    }
};

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

// Data Source Templates
export const dataSourceTemplates = [
    {
        id: 'economic-indicators',
        name: 'Economic Indicators',
        description: 'Standard economic metrics including GDP, inflation, trade balances',
        category: 'economy',
        fields: ['date', 'country', 'indicator_name', 'value', 'previous_value', 'percent_change'],
        recommended: true
    },
    {
        id: 'security-incidents',
        name: 'Security Incidents',
        description: 'Security events, protests, conflicts and stability indicators',
        category: 'security',
        fields: ['date', 'location', 'event_type', 'severity', 'fatalities', 'description', 'source'],
        recommended: true
    },
    {
        id: 'political-events',
        name: 'Political Events',
        description: 'Elections, government changes, key political developments',
        category: 'governance',
        fields: ['date', 'country', 'event_type', 'actors_involved', 'description', 'impact_assessment'],
        recommended: false
    },
    {
        id: 'infrastructure-projects',
        name: 'Infrastructure Projects',
        description: 'Major infrastructure developments, status and investments',
        category: 'infrastructure',
        fields: ['project_name', 'country', 'location', 'sector', 'status', 'investment_amount', 'completion_date'],
        recommended: false
    },
    {
        id: 'custom',
        name: 'Custom Data Structure',
        description: 'Define your own data structure and mapping',
        category: 'custom',
        fields: [],
        recommended: false
    }
];

// Data Import Categories
export const dataImportCategories = [
    {
        id: 'economy',
        name: 'Economic Data',
        description: 'Financial indicators, market data, and economic metrics',
        icon: 'LineChart'
    },
    {
        id: 'security',
        name: 'Security & Risk',
        description: 'Incident reports, threat assessments, and security events',
        icon: 'Shield'
    },
    {
        id: 'governance',
        name: 'Political & Governance',
        description: 'Political events, policy changes, and governance metrics',
        icon: 'Landmark'
    },
    {
        id: 'infrastructure',
        name: 'Infrastructure & Development',
        description: 'Projects, facilities, and development initiatives',
        icon: 'Building'
    },
    {
        id: 'custom',
        name: 'Custom Datasets',
        description: 'Import specialized data with custom field mappings',
        icon: 'FilePlus'
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
    { id: 'e10', name: 'Nairobi', type: 'location', role: 'Capital City', influence: 7.9, riskScore: 'Medium' },
    { id: 'e11', name: 'Ibrahim Al-Moazzen', type: 'person', role: 'Sudanese Opposition Leader', influence: 7.2, riskScore: 'High' },
    { id: 'e12', name: 'Khartoum Banking Group', type: 'organization', role: 'Financial Institution', influence: 6.8, riskScore: 'Medium' },
    { id: 'e13', name: 'Port Said Authority', type: 'organization', role: 'Port Administration', influence: 7.0, riskScore: 'Medium' },
    { id: 'e14', name: 'Djibouti Free Zone', type: 'location', role: 'Trade Hub', influence: 8.1, riskScore: 'Low' },
    { id: 'e15', name: 'TechHub Kenya', type: 'organization', role: 'Technology Incubator', influence: 7.3, riskScore: 'Low' },
    { id: 'e16', name: 'Sarah Mbeki', type: 'person', role: 'South African Mining Minister', influence: 8.4, riskScore: 'Low' },
    { id: 'e17', name: 'Mohammed bin Zayed', type: 'person', role: 'UAE Senior Official', influence: 9.5, riskScore: 'Low' },
    { id: 'e18', name: 'China Development Bank', type: 'organization', role: 'Financial Institution', influence: 9.7, riskScore: 'Medium' },
    { id: 'e19', name: 'Great Ethiopian Renaissance Dam', type: 'location', role: 'Infrastructure Project', influence: 8.8, riskScore: 'Medium' },
    { id: 'e20', name: 'Kenyan Treasury', type: 'organization', role: 'Government Institution', influence: 8.3, riskScore: 'Low' },
    { id: 'e21', name: 'Dangote Group', type: 'organization', role: 'Industrial Conglomerate', influence: 8.9, riskScore: 'Low' },
    { id: 'e22', name: 'Kenya Railways Corporation', type: 'organization', role: 'Transportation Entity', influence: 7.2, riskScore: 'Medium' },
    { id: 'e23', name: 'Suez Canal Authority', type: 'organization', role: 'Maritime Administration', influence: 8.6, riskScore: 'Low' },
    { id: 'e24', name: 'Ethiopian Airlines', type: 'organization', role: 'Airline Carrier', influence: 7.8, riskScore: 'Low' },
    { id: 'e25', name: 'G5 Sahel', type: 'organization', role: 'Regional Security Alliance', influence: 8.0, riskScore: 'Medium' }
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
    { source: 'e6', target: 'e1', strength: 'Medium', type: 'Professional' },
    { source: 'e11', target: 'e12', strength: 'Medium', type: 'Financial' },
    { source: 'e13', target: 'e1', strength: 'Weak', type: 'Administrative' },
    { source: 'e14', target: 'e9', strength: 'Strong', type: 'Geographic' },
    { source: 'e15', target: 'e10', strength: 'Strong', type: 'Geographic' },
    { source: 'e15', target: 'e3', strength: 'Medium', type: 'Financial' },
    { source: 'e16', target: 'e3', strength: 'Medium', type: 'Professional' },
    { source: 'e17', target: 'e4', strength: 'Strong', type: 'Governance' },
    { source: 'e17', target: 'e6', strength: 'Strong', type: 'Personal' },
    { source: 'e18', target: 'e19', strength: 'Strong', type: 'Financial' },
    { source: 'e19', target: 'e9', strength: 'Medium', type: 'Geographic' },
    { source: 'e20', target: 'e3', strength: 'Strong', type: 'Financial' },
    { source: 'e21', target: 'e2', strength: 'Medium', type: 'Professional' },
    { source: 'e21', target: 'e8', strength: 'Strong', type: 'Economic' },
    { source: 'e22', target: 'e9', strength: 'Medium', type: 'Operational' },
    { source: 'e23', target: 'e1', strength: 'Strong', type: 'Economic' },
    { source: 'e24', target: 'e9', strength: 'Medium', type: 'Operational' },
    { source: 'e25', target: 'e11', strength: 'Weak', type: 'Security' },
    { source: 'e18', target: 'e3', strength: 'Strong', type: 'Financial' },
    { source: 'e20', target: 'e10', strength: 'Strong', type: 'Administrative' },
    { source: 'e15', target: 'e22', strength: 'Weak', type: 'Logistics' },
    { source: 'e7', target: 'e23', strength: 'Medium', type: 'Economic' },
    { source: 'e9', target: 'e24', strength: 'Medium', type: 'Economic' },
    { source: 'e25', target: 'e8', strength: 'Medium', type: 'Security' }
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

// Enhanced scenario planning features
export const advancedModelingTechniques = [
    {
        id: 'monte-carlo',
        name: 'Monte Carlo Simulation',
        description: 'Run thousands of random simulations to determine probability distributions of outcomes',
        complexity: 'High',
        dataRequirement: 'Medium',
        icon: 'Sparkles'
    },
    {
        id: 'bayesian',
        name: 'Bayesian Network Analysis',
        description: 'Model causal relationships between variables with probability-based inference',
        complexity: 'High',
        dataRequirement: 'High',
        icon: 'Network'
    },
    {
        id: 'system-dynamics',
        name: 'System Dynamics Modeling',
        description: 'Analyze complex systems with feedback loops and time-dependent behavior',
        complexity: 'Medium',
        dataRequirement: 'Medium',
        icon: 'GitMerge'
    },
    {
        id: 'agent-based',
        name: 'Agent-Based Modeling',
        description: 'Simulate actions and interactions of autonomous agents to assess emergent effects',
        complexity: 'High',
        dataRequirement: 'Medium',
        icon: 'Users'
    },
    {
        id: 'ml-forecasting',
        name: 'Machine Learning Forecasting',
        description: 'Use AI/ML algorithms to identify patterns and predict scenario outcomes',
        complexity: 'Medium',
        dataRequirement: 'High',
        icon: 'BrainCircuit'
    }
];

// Enhanced economic trend data for different regions
export const economicTrendData = {
  regions: {
    'East Africa': {
      gdpGrowth: {
        historical: [4.2, 4.5, 5.1, 4.8, 3.2, 4.9, 5.3, 5.5],
        forecast: [5.7, 5.9, 6.1, 6.3],
        lastUpdated: new Date(2025, 3, 1)
      },
      inflation: {
        historical: [7.8, 7.2, 6.5, 5.9, 6.3, 6.8, 7.1, 6.5],
        forecast: [6.2, 5.9, 5.7, 5.5],
        lastUpdated: new Date(2025, 3, 1)
      },
      foreignInvestment: {
        historical: [5.2, 5.7, 6.3, 7.1, 7.8, 8.2, 9.1, 10.2],
        forecast: [11.1, 12.0, 12.8, 13.5],
        lastUpdated: new Date(2025, 3, 1)
      },
      unemployment: {
        historical: [12.5, 12.1, 11.8, 11.3, 10.9, 10.5, 10.1, 9.8],
        forecast: [9.5, 9.2, 8.9, 8.6],
        lastUpdated: new Date(2025, 3, 1)
      },
      tradeBalance: {
        historical: [-3.2, -3.0, -2.8, -2.5, -2.7, -2.9, -2.6, -2.3],
        forecast: [-2.1, -1.9, -1.7, -1.5],
        lastUpdated: new Date(2025, 3, 1)
      },
      keyRisks: [
        "Regional drought impacting agricultural output",
        "Political transitions in key economies",
        "Infrastructure financing challenges",
        "Currency volatility"
      ],
      opportunities: [
        "Digital economy growth",
        "Regional integration progress",
        "Green energy investments",
        "Manufacturing capacity expansion"
      ]
    },
    'West Africa': {
      gdpGrowth: {
        historical: [3.8, 4.1, 4.5, 4.2, 2.9, 3.7, 4.3, 4.7],
        forecast: [4.9, 5.2, 5.5, 5.8],
        lastUpdated: new Date(2025, 3, 1)
      },
      inflation: {
        historical: [9.1, 8.7, 8.3, 8.6, 9.2, 8.9, 8.5, 8.1],
        forecast: [7.8, 7.5, 7.2, 6.9],
        lastUpdated: new Date(2025, 3, 1)
      },
      foreignInvestment: {
        historical: [6.8, 7.2, 7.5, 6.9, 7.3, 7.8, 8.2, 8.7],
        forecast: [9.1, 9.5, 9.9, 10.3],
        lastUpdated: new Date(2025, 3, 1)
      },
      unemployment: {
        historical: [14.2, 13.9, 13.5, 13.8, 14.1, 13.7, 13.2, 12.8],
        forecast: [12.5, 12.1, 11.8, 11.5],
        lastUpdated: new Date(2025, 3, 1)
      },
      tradeBalance: {
        historical: [-2.7, -2.5, -2.3, -2.6, -2.8, -2.6, -2.4, -2.2],
        forecast: [-2.0, -1.8, -1.7, -1.5],
        lastUpdated: new Date(2025, 3, 1)
      },
      keyRisks: [
        "Currency depreciation pressures",
        "Energy sector vulnerabilities",
        "Security challenges in Sahel region",
        "Fiscal sustainability concerns"
      ],
      opportunities: [
        "Oil and gas sector modernization",
        "Rapid urbanization driving construction",
        "Digital financial services expansion",
        "Agricultural value chain development"
      ]
    },
    'North Africa': {
      gdpGrowth: {
        historical: [3.5, 3.8, 4.2, 3.9, 2.5, 3.2, 3.7, 4.0],
        forecast: [4.3, 4.5, 4.8, 5.0],
        lastUpdated: new Date(2025, 3, 1)
      },
      inflation: {
        historical: [5.8, 5.5, 5.1, 5.3, 5.7, 5.4, 5.0, 4.7],
        forecast: [4.5, 4.3, 4.1, 3.9],
        lastUpdated: new Date(2025, 3, 1)
      },
      foreignInvestment: {
        historical: [8.7, 9.2, 9.6, 8.9, 9.3, 9.8, 10.3, 10.9],
        forecast: [11.5, 12.1, 12.7, 13.3],
        lastUpdated: new Date(2025, 3, 1)
      },
      unemployment: {
        historical: [11.5, 11.2, 10.9, 11.1, 11.4, 11.0, 10.7, 10.3],
        forecast: [10.0, 9.7, 9.4, 9.1],
        lastUpdated: new Date(2025, 3, 1)
      },
      tradeBalance: {
        historical: [-1.5, -1.3, -1.1, -1.4, -1.6, -1.4, -1.2, -1.0],
        forecast: [-0.8, -0.7, -0.5, -0.3],
        lastUpdated: new Date(2025, 3, 1)
      },
      keyRisks: [
        "Political transition uncertainties",
        "Water resource constraints",
        "Tourism sector vulnerabilities",
        "Youth unemployment pressures"
      ],
      opportunities: [
        "Renewable energy projects",
        "Manufacturing reshoring from Europe",
        "Infrastructure modernization",
        "Tech ecosystem development"
      ]
    },
    'Southern Africa': {
      gdpGrowth: {
        historical: [2.8, 3.1, 3.5, 3.2, 1.8, 2.5, 3.0, 3.3],
        forecast: [3.5, 3.8, 4.1, 4.3],
        lastUpdated: new Date(2025, 3, 1)
      },
      inflation: {
        historical: [6.5, 6.2, 5.8, 6.0, 6.4, 6.1, 5.7, 5.4],
        forecast: [5.2, 5.0, 4.8, 4.6],
        lastUpdated: new Date(2025, 3, 1)
      },
      foreignInvestment: {
        historical: [4.5, 4.9, 5.3, 4.8, 5.1, 5.5, 5.9, 6.3],
        forecast: [6.7, 7.1, 7.5, 7.9],
        lastUpdated: new Date(2025, 3, 1)
      },
      unemployment: {
        historical: [25.8, 25.3, 24.9, 25.1, 25.5, 25.0, 24.6, 24.1],
        forecast: [23.8, 23.4, 23.0, 22.6],
        lastUpdated: new Date(2025, 3, 1)
      },
      tradeBalance: {
        historical: [-0.9, -0.7, -0.5, -0.8, -1.0, -0.8, -0.6, -0.4],
        forecast: [-0.3, -0.2, 0.0, 0.2],
        lastUpdated: new Date(2025, 3, 1)
      },
      keyRisks: [
        "Energy supply constraints",
        "Mining sector vulnerabilities",
        "Climate change impacts on agriculture",
        "Structural unemployment"
      ],
      opportunities: [
        "Green minerals development",
        "Regional value chain integration",
        "Services sector expansion",
        "Infrastructure resilience projects"
      ]
    },
    'Central Africa': {
      gdpGrowth: {
        historical: [3.0, 3.3, 3.7, 3.4, 2.0, 2.7, 3.2, 3.5],
        forecast: [3.8, 4.0, 4.3, 4.5],
        lastUpdated: new Date(2025, 3, 1)
      },
      inflation: {
        historical: [8.2, 7.9, 7.5, 7.7, 8.1, 7.8, 7.4, 7.1],
        forecast: [6.9, 6.6, 6.4, 6.1],
        lastUpdated: new Date(2025, 3, 1)
      },
      foreignInvestment: {
        historical: [3.8, 4.2, 4.6, 4.1, 4.4, 4.8, 5.2, 5.6],
        forecast: [6.0, 6.4, 6.8, 7.2],
        lastUpdated: new Date(2025, 3, 1)
      },
      unemployment: {
        historical: [15.5, 15.1, 14.7, 14.9, 15.3, 14.9, 14.5, 14.1],
        forecast: [13.8, 13.5, 13.2, 12.9],
        lastUpdated: new Date(2025, 3, 1)
      },
      tradeBalance: {
        historical: [-3.5, -3.3, -3.1, -3.4, -3.6, -3.4, -3.2, -3.0],
        forecast: [-2.8, -2.6, -2.4, -2.2],
        lastUpdated: new Date(2025, 3, 1)
      },
      keyRisks: [
        "Political instability",
        "Extractive industry dependency",
        "Infrastructure deficits",
        "Public finance management challenges"
      ],
      opportunities: [
        "Agricultural diversification",
        "Sustainable forestry management",
        "Regional trade enhancement",
        "Digital connectivity expansion"
      ]
    }
  },
  countries: {
    'Nigeria': {
      gdpGrowth: {
        historical: [3.1, 3.5, 3.9, 3.6, 1.9, 2.9, 3.4, 3.8],
        forecast: [4.0, 4.3, 4.6, 4.9],
        lastUpdated: new Date(2025, 3, 1)
      },
      inflation: {
        historical: [18.5, 17.8, 16.9, 17.5, 18.2, 17.6, 16.8, 16.2],
        forecast: [15.8, 15.3, 14.8, 14.3],
        lastUpdated: new Date(2025, 3, 1)
      },
      unemployment: {
        historical: [33.3, 32.7, 32.1, 32.5, 33.0, 32.4, 31.8, 31.2],
        forecast: [30.7, 30.1, 29.5, 28.9],
        lastUpdated: new Date(2025, 3, 1)
      },
      sectoralGrowth: {
        oil: [2.1, 2.5, 2.9, 2.6, 1.2, 2.0, 2.5, 2.8],
        agriculture: [3.6, 3.9, 4.3, 4.0, 3.2, 3.7, 4.1, 4.4],
        manufacturing: [2.8, 3.2, 3.6, 3.3, 1.5, 2.5, 3.0, 3.4],
        services: [4.5, 4.8, 5.2, 4.9, 3.1, 4.2, 4.7, 5.1]
      },
      riskFactors: {
        currency: "High volatility risk - Naira under pressure",
        fiscal: "Budget deficit challenges, revenue diversification needed",
        energy: "Ongoing power supply constraints affecting productivity",
        security: "Regional instability impacting agricultural production"
      }
    },
    'Kenya': {
      gdpGrowth: {
        historical: [4.8, 5.1, 5.6, 5.3, 3.5, 4.7, 5.2, 5.5],
        forecast: [5.8, 6.0, 6.3, 6.5],
        lastUpdated: new Date(2025, 3, 1)
      },
      inflation: {
        historical: [6.8, 6.5, 6.1, 6.3, 6.7, 6.4, 6.0, 5.7],
        forecast: [5.5, 5.3, 5.1, 4.9],
        lastUpdated: new Date(2025, 3, 1)
      },
      unemployment: {
        historical: [12.2, 11.9, 11.5, 11.7, 12.1, 11.7, 11.3, 10.9],
        forecast: [10.6, 10.3, 10.0, 9.7],
        lastUpdated: new Date(2025, 3, 1)
      },
      sectoralGrowth: {
        agriculture: [4.2, 4.5, 4.9, 4.6, 3.1, 4.0, 4.5, 4.8],
        manufacturing: [3.7, 4.0, 4.4, 4.1, 2.5, 3.5, 4.0, 4.3],
        technology: [7.8, 8.2, 8.7, 8.4, 6.5, 7.5, 8.1, 8.5],
        tourism: [5.5, 5.9, 6.3, 6.0, 1.2, 3.8, 5.0, 5.7]
      },
      riskFactors: {
        debt: "Rising public debt levels requiring fiscal consolidation",
        political: "Electoral cycle uncertainties affecting investment",
        climate: "Drought conditions impacting agricultural output",
        regional: "Border tensions affecting trade flows"
      }
    },
    'Egypt': {
      gdpGrowth: {
        historical: [5.6, 5.9, 6.3, 6.0, 3.8, 5.1, 5.6, 5.9],
        forecast: [6.2, 6.4, 6.7, 6.9],
        lastUpdated: new Date(2025, 3, 1)
      },
      inflation: {
        historical: [13.8, 13.2, 12.5, 13.0, 13.5, 12.9, 12.2, 11.6],
        forecast: [11.2, 10.8, 10.4, 10.0],
        lastUpdated: new Date(2025, 3, 1)
      },
      unemployment: {
        historical: [8.9, 8.6, 8.3, 8.5, 8.8, 8.5, 8.2, 7.9],
        forecast: [7.7, 7.5, 7.3, 7.1],
        lastUpdated: new Date(2025, 3, 1)
      },
      sectoralGrowth: {
        tourism: [6.7, 7.1, 7.5, 7.2, 1.5, 4.5, 6.0, 6.8],
        manufacturing: [4.8, 5.1, 5.5, 5.2, 3.0, 4.2, 4.7, 5.0],
        construction: [7.5, 7.9, 8.3, 8.0, 5.2, 6.7, 7.3, 7.7],
        services: [5.2, 5.5, 5.9, 5.6, 3.5, 4.7, 5.3, 5.6]
      },
      riskFactors: {
        water: "Nile water security challenges affecting agriculture",
        subsidy: "Ongoing subsidy reform impacts on consumer spending",
        regional: "Regional political dynamics affecting security",
        currency: "Foreign exchange management challenges"
      }
    },
    'South Africa': {
      gdpGrowth: {
        historical: [1.1, 1.4, 1.8, 1.5, 0.2, 0.9, 1.3, 1.6],
        forecast: [1.8, 2.0, 2.2, 2.4],
        lastUpdated: new Date(2025, 3, 1)
      },
      inflation: {
        historical: [4.5, 4.3, 4.0, 4.2, 4.6, 4.3, 4.0, 3.8],
        forecast: [3.7, 3.6, 3.5, 3.4],
        lastUpdated: new Date(2025, 3, 1)
      },
      unemployment: {
        historical: [34.4, 33.9, 33.4, 33.7, 34.2, 33.6, 33.0, 32.4],
        forecast: [31.9, 31.4, 30.9, 30.4],
        lastUpdated: new Date(2025, 3, 1)
      },
      sectoralGrowth: {
        mining: [0.7, 1.0, 1.4, 1.1, -0.5, 0.5, 0.9, 1.2],
        finance: [2.5, 2.8, 3.2, 2.9, 1.5, 2.3, 2.7, 3.0],
        manufacturing: [1.3, 1.6, 2.0, 1.7, 0.3, 1.1, 1.5, 1.8],
        tourism: [3.8, 4.1, 4.5, 4.2, 0.5, 2.5, 3.5, 4.0]
      },
      riskFactors: {
        energy: "Persistent electricity supply constraints",
        social: "High inequality and social tensions",
        growth: "Structural impediments to higher growth",
        fiscal: "Debt sustainability concerns"
      }
    },
    'Morocco': {
      gdpGrowth: {
        historical: [3.7, 4.0, 4.4, 4.1, 2.5, 3.4, 3.9, 4.2],
        forecast: [4.5, 4.7, 5.0, 5.2],
        lastUpdated: new Date(2025, 3, 1)
      },
      inflation: {
        historical: [1.8, 1.6, 1.4, 1.5, 1.9, 1.7, 1.5, 1.3],
        forecast: [1.2, 1.1, 1.0, 0.9],
        lastUpdated: new Date(2025, 3, 1)
      },
      unemployment: {
        historical: [9.2, 8.9, 8.6, 8.8, 9.1, 8.8, 8.5, 8.2],
        forecast: [8.0, 7.8, 7.6, 7.4],
        lastUpdated: new Date(2025, 3, 1)
      },
      sectoralGrowth: {
        agriculture: [3.2, 3.5, 3.9, 3.6, 2.1, 3.0, 3.4, 3.7],
        manufacturing: [4.3, 4.6, 5.0, 4.7, 3.0, 4.0, 4.5, 4.8],
        tourism: [5.8, 6.2, 6.6, 6.3, 1.0, 3.5, 5.0, 5.9],
        automotive: [7.5, 7.9, 8.3, 8.0, 5.0, 6.5, 7.2, 7.6]
      },
      riskFactors: {
        climate: "Agricultural vulnerability to rainfall patterns",
        exports: "High dependency on European market demand",
        regional: "Western Sahara situation diplomatic impacts",
        energy: "Energy import dependency"
      }
    }
  },
  timeframes: {
    quarter: ['Q2 2023', 'Q3 2023', 'Q4 2023', 'Q1 2024', 'Q2 2024', 'Q3 2024', 'Q4 2024', 'Q1 2025'],
    annual: ['2018', '2019', '2020', '2021', '2022', '2023', '2024', '2025 (projected)']
  }
};

// Enhanced security incident and risk data for visualization components
export const securityIncidentData = {
  regions: {
    'East Africa': [
      { date: '2025-04-01', count: 12, severity: 'medium', type: 'civil_unrest' },
      { date: '2025-03-25', count: 8, severity: 'low', type: 'civil_unrest' },
      { date: '2025-03-18', count: 15, severity: 'medium', type: 'civil_unrest' },
      { date: '2025-03-11', count: 7, severity: 'low', type: 'civil_unrest' },
      { date: '2025-03-04', count: 11, severity: 'medium', type: 'civil_unrest' },
      { date: '2025-04-05', count: 3, severity: 'high', type: 'terrorism' },
      { date: '2025-03-22', count: 2, severity: 'high', type: 'terrorism' },
      { date: '2025-03-10', count: 4, severity: 'high', type: 'terrorism' },
      { date: '2025-03-05', count: 1, severity: 'high', type: 'terrorism' },
      { date: '2025-04-03', count: 5, severity: 'medium', type: 'crime' },
      { date: '2025-03-27', count: 8, severity: 'medium', type: 'crime' },
      { date: '2025-03-20', count: 6, severity: 'medium', type: 'crime' },
      { date: '2025-03-13', count: 9, severity: 'medium', type: 'crime' }
    ],
    'West Africa': [
      { date: '2025-04-02', count: 18, severity: 'medium', type: 'civil_unrest' },
      { date: '2025-03-26', count: 14, severity: 'medium', type: 'civil_unrest' },
      { date: '2025-03-19', count: 22, severity: 'high', type: 'civil_unrest' },
      { date: '2025-03-12', count: 16, severity: 'medium', type: 'civil_unrest' },
      { date: '2025-03-05', count: 19, severity: 'medium', type: 'civil_unrest' },
      { date: '2025-04-04', count: 7, severity: 'high', type: 'terrorism' },
      { date: '2025-03-25', count: 5, severity: 'high', type: 'terrorism' },
      { date: '2025-03-18', count: 8, severity: 'high', type: 'terrorism' },
      { date: '2025-03-11', count: 6, severity: 'high', type: 'terrorism' },
      { date: '2025-04-01', count: 11, severity: 'medium', type: 'crime' },
      { date: '2025-03-23', count: 14, severity: 'medium', type: 'crime' },
      { date: '2025-03-15', count: 9, severity: 'medium', type: 'crime' },
      { date: '2025-03-07', count: 12, severity: 'medium', type: 'crime' }
    ],
    'North Africa': [
      { date: '2025-04-03', count: 9, severity: 'medium', type: 'civil_unrest' },
      { date: '2025-03-27', count: 11, severity: 'medium', type: 'civil_unrest' },
      { date: '2025-03-20', count: 7, severity: 'low', type: 'civil_unrest' },
      { date: '2025-03-13', count: 10, severity: 'medium', type: 'civil_unrest' },
      { date: '2025-03-06', count: 8, severity: 'low', type: 'civil_unrest' },
      { date: '2025-04-01', count: 3, severity: 'high', type: 'terrorism' },
      { date: '2025-03-18', count: 1, severity: 'high', type: 'terrorism' },
      { date: '2025-03-04', count: 2, severity: 'high', type: 'terrorism' },
      { date: '2025-04-05', count: 7, severity: 'medium', type: 'crime' },
      { date: '2025-03-29', count: 9, severity: 'medium', type: 'crime' },
      { date: '2025-03-22', count: 6, severity: 'medium', type: 'crime' },
      { date: '2025-03-15', count: 8, severity: 'medium', type: 'crime' }
    ],
    'Southern Africa': [
      { date: '2025-04-04', count: 7, severity: 'low', type: 'civil_unrest' },
      { date: '2025-03-28', count: 5, severity: 'low', type: 'civil_unrest' },
      { date: '2025-03-21', count: 9, severity: 'medium', type: 'civil_unrest' },
      { date: '2025-03-14', count: 6, severity: 'low', type: 'civil_unrest' },
      { date: '2025-03-07', count: 8, severity: 'low', type: 'civil_unrest' },
      { date: '2025-04-02', count: 0, severity: 'none', type: 'terrorism' },
      { date: '2025-03-19', count: 1, severity: 'high', type: 'terrorism' },
      { date: '2025-03-05', count: 0, severity: 'none', type: 'terrorism' },
      { date: '2025-04-06', count: 12, severity: 'medium', type: 'crime' },
      { date: '2025-03-30', count: 15, severity: 'high', type: 'crime' },
      { date: '2025-03-23', count: 11, severity: 'medium', type: 'crime' },
      { date: '2025-03-16', count: 14, severity: 'high', type: 'crime' }
    ],
    'Central Africa': [
      { date: '2025-04-05', count: 14, severity: 'medium', type: 'civil_unrest' },
      { date: '2025-03-29', count: 16, severity: 'medium', type: 'civil_unrest' },
      { date: '2025-03-22', count: 12, severity: 'medium', type: 'civil_unrest' },
      { date: '2025-03-15', count: 19, severity: 'high', type: 'civil_unrest' },
      { date: '2025-03-08', count: 15, severity: 'medium', type: 'civil_unrest' },
      { date: '2025-04-03', count: 5, severity: 'high', type: 'terrorism' },
      { date: '2025-03-20', count: 4, severity: 'high', type: 'terrorism' },
      { date: '2025-03-06', count: 6, severity: 'high', type: 'terrorism' },
      { date: '2025-04-07', count: 8, severity: 'medium', type: 'crime' },
      { date: '2025-03-31', count: 11, severity: 'medium', type: 'crime' },
      { date: '2025-03-24', count: 7, severity: 'medium', type: 'crime' },
      { date: '2025-03-17', count: 10, severity: 'medium', type: 'crime' }
    ],
    'Middle East': [
      { date: '2025-04-06', count: 11, severity: 'medium', type: 'civil_unrest' },
      { date: '2025-03-30', count: 8, severity: 'low', type: 'civil_unrest' },
      { date: '2025-03-23', count: 13, severity: 'medium', type: 'civil_unrest' },
      { date: '2025-03-16', count: 9, severity: 'low', type: 'civil_unrest' },
      { date: '2025-03-09', count: 12, severity: 'medium', type: 'civil_unrest' },
      { date: '2025-04-04', count: 4, severity: 'high', type: 'terrorism' },
      { date: '2025-03-21', count: 3, severity: 'high', type: 'terrorism' },
      { date: '2025-03-07', count: 5, severity: 'high', type: 'terrorism' },
      { date: '2025-04-02', count: 6, severity: 'medium', type: 'crime' },
      { date: '2025-03-26', count: 8, severity: 'medium', type: 'crime' },
      { date: '2025-03-19', count: 5, severity: 'medium', type: 'crime' },
      { date: '2025-03-12', count: 7, severity: 'medium', type: 'crime' }
    ]
  },
  countries: {
    'Nigeria': [
      { date: '2025-04-05', count: 8, severity: 'medium', type: 'civil_unrest', location: 'Lagos' },
      { date: '2025-04-04', count: 3, severity: 'medium', type: 'civil_unrest', location: 'Abuja' },
      { date: '2025-03-30', count: 5, severity: 'medium', type: 'civil_unrest', location: 'Kano' },
      { date: '2025-03-25', count: 7, severity: 'high', type: 'civil_unrest', location: 'Port Harcourt' },
      { date: '2025-04-02', count: 2, severity: 'high', type: 'terrorism', location: 'Maiduguri' },
      { date: '2025-03-18', count: 3, severity: 'high', type: 'terrorism', location: 'Kaduna' },
      { date: '2025-04-06', count: 6, severity: 'medium', type: 'crime', location: 'Lagos' },
      { date: '2025-03-27', count: 9, severity: 'medium', type: 'crime', location: 'Ibadan' }
    ],
    'Kenya': [
      { date: '2025-04-03', count: 4, severity: 'medium', type: 'civil_unrest', location: 'Nairobi' },
      { date: '2025-03-28', count: 2, severity: 'low', type: 'civil_unrest', location: 'Mombasa' },
      { date: '2025-03-22', count: 5, severity: 'medium', type: 'civil_unrest', location: 'Kisumu' },
      { date: '2025-04-01', count: 1, severity: 'high', type: 'terrorism', location: 'Garissa' },
      { date: '2025-03-15', count: 1, severity: 'high', type: 'terrorism', location: 'Mandera' },
      { date: '2025-04-04', count: 3, severity: 'medium', type: 'crime', location: 'Nairobi' },
      { date: '2025-03-29', count: 4, severity: 'medium', type: 'crime', location: 'Nakuru' }
    ],
    'Egypt': [
      { date: '2025-04-06', count: 3, severity: 'low', type: 'civil_unrest', location: 'Cairo' },
      { date: '2025-03-31', count: 5, severity: 'medium', type: 'civil_unrest', location: 'Alexandria' },
      { date: '2025-03-26', count: 2, severity: 'low', type: 'civil_unrest', location: 'Suez' },
      { date: '2025-04-02', count: 1, severity: 'high', type: 'terrorism', location: 'North Sinai' },
      { date: '2025-03-10', count: 1, severity: 'high', type: 'terrorism', location: 'South Sinai' },
      { date: '2025-04-05', count: 4, severity: 'medium', type: 'crime', location: 'Cairo' },
      { date: '2025-03-25', count: 3, severity: 'medium', type: 'crime', location: 'Luxor' }
    ],
    'South Africa': [
      { date: '2025-04-04', count: 3, severity: 'low', type: 'civil_unrest', location: 'Johannesburg' },
      { date: '2025-03-29', count: 2, severity: 'low', type: 'civil_unrest', location: 'Cape Town' },
      { date: '2025-03-23', count: 4, severity: 'medium', type: 'civil_unrest', location: 'Durban' },
      { date: '2025-03-19', count: 1, severity: 'high', type: 'terrorism', location: 'Durban' },
      { date: '2025-04-07', count: 6, severity: 'medium', type: 'crime', location: 'Johannesburg' },
      { date: '2025-04-01', count: 7, severity: 'high', type: 'crime', location: 'Cape Town' },
      { date: '2025-03-25', count: 5, severity: 'medium', type: 'crime', location: 'Pretoria' }
    ]
  }
};

// Add regional sentiment analysis data
export const regionalSentimentData = {
  regions: {
    'East Africa': {
      overall: 67, // 0-100 scale, higher is more positive
      trending: 'up',
      byTopic: {
        'governance': 58,
        'economy': 71,
        'security': 62,
        'infrastructure': 75,
        'foreign_relations': 69
      },
      timeSeries: [
        { date: '2025-01-01', sentiment: 63 },
        { date: '2025-01-15', sentiment: 62 },
        { date: '2025-02-01', sentiment: 64 },
        { date: '2025-02-15', sentiment: 65 },
        { date: '2025-03-01', sentiment: 65 },
        { date: '2025-03-15', sentiment: 66 },
        { date: '2025-04-01', sentiment: 67 }
      ],
      topPositiveThemes: ['technology adoption', 'infrastructure development', 'trade integration'],
      topNegativeThemes: ['corruption concerns', 'drought impact', 'border tensions']
    },
    'West Africa': {
      overall: 58,
      trending: 'stable',
      byTopic: {
        'governance': 52,
        'economy': 61,
        'security': 49,
        'infrastructure': 65,
        'foreign_relations': 63
      },
      timeSeries: [
        { date: '2025-01-01', sentiment: 57 },
        { date: '2025-01-15', sentiment: 58 },
        { date: '2025-02-01', sentiment: 59 },
        { date: '2025-02-15', sentiment: 59 },
        { date: '2025-03-01', sentiment: 58 },
        { date: '2025-03-15', sentiment: 57 },
        { date: '2025-04-01', sentiment: 58 }
      ],
      topPositiveThemes: ['fintech growth', 'oil sector reform', 'democratic transitions'],
      topNegativeThemes: ['terrorism concerns', 'currency instability', 'youth unemployment']
    },
    'North Africa': {
      overall: 63,
      trending: 'up',
      byTopic: {
        'governance': 57,
        'economy': 68,
        'security': 59,
        'infrastructure': 72,
        'foreign_relations': 59
      },
      timeSeries: [
        { date: '2025-01-01', sentiment: 60 },
        { date: '2025-01-15', sentiment: 61 },
        { date: '2025-02-01', sentiment: 62 },
        { date: '2025-02-15', sentiment: 62 },
        { date: '2025-03-01', sentiment: 63 },
        { date: '2025-03-15', sentiment: 63 },
        { date: '2025-04-01', sentiment: 63 }
      ],
      topPositiveThemes: ['tourism recovery', 'renewable energy', 'infrastructure investment'],
      topNegativeThemes: ['water scarcity', 'youth unemployment', 'political transition uncertainties']
    },
    'Southern Africa': {
      overall: 61,
      trending: 'down',
      byTopic: {
        'governance': 59,
        'economy': 56,
        'security': 67,
        'infrastructure': 59,
        'foreign_relations': 64
      },
      timeSeries: [
        { date: '2025-01-01', sentiment: 64 },
        { date: '2025-01-15', sentiment: 63 },
        { date: '2025-02-01', sentiment: 63 },
        { date: '2025-02-15', sentiment: 62 },
        { date: '2025-03-01', sentiment: 62 },
        { date: '2025-03-15', sentiment: 61 },
        { date: '2025-04-01', sentiment: 61 }
      ],
      topPositiveThemes: ['political stability', 'tourism growth', 'regional cooperation'],
      topNegativeThemes: ['energy crisis', 'mining sector challenges', 'drought concerns']
    },
    'Central Africa': {
      overall: 53,
      trending: 'stable',
      byTopic: {
        'governance': 46,
        'economy': 58,
        'security': 42,
        'infrastructure': 57,
        'foreign_relations': 62
      },
      timeSeries: [
        { date: '2025-01-01', sentiment: 52 },
        { date: '2025-01-15', sentiment: 52 },
        { date: '2025-02-01', sentiment: 53 },
        { date: '2025-02-15', sentiment: 54 },
        { date: '2025-03-01', sentiment: 53 },
        { date: '2025-03-15', sentiment: 53 },
        { date: '2025-04-01', sentiment: 53 }
      ],
      topPositiveThemes: ['natural resource development', 'international investment', 'infrastructure projects'],
      topNegativeThemes: ['political instability', 'armed group activity', 'governance challenges']
    },
    'Middle East': {
      overall: 65,
      trending: 'up',
      byTopic: {
        'governance': 61,
        'economy': 72,
        'security': 57,
        'infrastructure': 78,
        'foreign_relations': 57
      },
      timeSeries: [
        { date: '2025-01-01', sentiment: 62 },
        { date: '2025-01-15', sentiment: 63 },
        { date: '2025-02-01', sentiment: 63 },
        { date: '2025-02-15', sentiment: 64 },
        { date: '2025-03-01', sentiment: 64 },
        { date: '2025-03-15', sentiment: 65 },
        { date: '2025-04-01', sentiment: 65 }
      ],
      topPositiveThemes: ['economic diversification', 'technology adoption', 'mega-projects'],
      topNegativeThemes: ['regional tensions', 'political reform pace', 'resource dependency']
    }
  },
  countries: {
    'Kenya': {
      overall: 69,
      trending: 'up',
      byTopic: {
        'governance': 61,
        'economy': 74,
        'security': 64,
        'infrastructure': 78,
        'foreign_relations': 68
      },
      timeSeries: [
        { date: '2025-01-01', sentiment: 66 },
        { date: '2025-01-15', sentiment: 67 },
        { date: '2025-02-01', sentiment: 67 },
        { date: '2025-02-15', sentiment: 68 },
        { date: '2025-03-01', sentiment: 68 },
        { date: '2025-03-15', sentiment: 69 },
        { date: '2025-04-01', sentiment: 69 }
      ],
      topPositiveThemes: ['tech innovation', 'infrastructure projects', 'tourism growth'],
      topNegativeThemes: ['electoral tensions', 'drought impact', 'corruption concerns']
    },
    'Nigeria': {
      overall: 56,
      trending: 'stable',
      byTopic: {
        'governance': 51,
        'economy': 62,
        'security': 47,
        'infrastructure': 59,
        'foreign_relations': 61
      },
      timeSeries: [
        { date: '2025-01-01', sentiment: 55 },
        { date: '2025-01-15', sentiment: 56 },
        { date: '2025-02-01', sentiment: 56 },
        { date: '2025-02-15', sentiment: 57 },
        { date: '2025-03-01', sentiment: 56 },
        { date: '2025-03-15', sentiment: 56 },
        { date: '2025-04-01', sentiment: 56 }
      ],
      topPositiveThemes: ['fintech ecosystem', 'petroleum sector reform', 'creative industries'],
      topNegativeThemes: ['security challenges', 'inflation concerns', 'currency stability']
    },
    'Egypt': {
      overall: 64,
      trending: 'up',
      byTopic: {
        'governance': 57,
        'economy': 69,
        'security': 61,
        'infrastructure': 75,
        'foreign_relations': 58
      },
      timeSeries: [
        { date: '2025-01-01', sentiment: 60 },
        { date: '2025-01-15', sentiment: 61 },
        { date: '2025-02-01', sentiment: 62 },
        { date: '2025-02-15', sentiment: 63 },
        { date: '2025-03-01', sentiment: 63 },
        { date: '2025-03-15', sentiment: 64 },
        { date: '2025-04-01', sentiment: 64 }
      ],
      topPositiveThemes: ['new administrative capital', 'suez canal development', 'tourism recovery'],
      topNegativeThemes: ['inflation impact', 'subsidy reform concerns', 'water security']
    },
    'South Africa': {
      overall: 59,
      trending: 'down',
      byTopic: {
        'governance': 56,
        'economy': 53,
        'security': 62,
        'infrastructure': 57,
        'foreign_relations': 67
      },
      timeSeries: [
        { date: '2025-01-01', sentiment: 62 },
        { date: '2025-01-15', sentiment: 61 },
        { date: '2025-02-01', sentiment: 61 },
        { date: '2025-02-15', sentiment: 60 },
        { date: '2025-03-01', sentiment: 60 },
        { date: '2025-03-15', sentiment: 59 },
        { date: '2025-04-01', sentiment: 59 }
      ],
      topPositiveThemes: ['political stability', 'tourism sector', 'renewable energy'],
      topNegativeThemes: ['electricity supply', 'unemployment rates', 'inequality concerns']
    },
    'Morocco': {
      overall: 67,
      trending: 'up',
      byTopic: {
        'governance': 62,
        'economy': 72,
        'security': 64,
        'infrastructure': 73,
        'foreign_relations': 64
      },
      timeSeries: [
        { date: '2025-01-01', sentiment: 64 },
        { date: '2025-01-15', sentiment: 65 },
        { date: '2025-02-01', sentiment: 65 },
        { date: '2025-02-15', sentiment: 66 },
        { date: '2025-03-01', sentiment: 66 },
        { date: '2025-03-15', sentiment: 67 },
        { date: '2025-04-01', sentiment: 67 }
      ],
      topPositiveThemes: ['infrastructure investment', 'renewable energy', 'manufacturing growth'],
      topNegativeThemes: ['youth unemployment', 'regional tensions', 'agricultural vulnerability']
    }
  }
};

// Detailed entity profiles for network analysis
export const detailedEntityProfiles = [
  {
    id: 'ent001',
    name: 'Ahmed Hassan',
    type: 'person',
    role: 'Egyptian Finance Minister',
    country: 'Egypt',
    riskScore: 'Low',
    influenceScore: 8.5,
    bio: `Former banking executive appointed as Finance Minister in 2023. Leading economic reform programs with focus on fiscal discipline and investment attraction. Previously served as Chairman of one of Egypt's largest banks for 7 years and held positions at the Central Bank. Known for market-friendly policies and international connections, particularly with Gulf financial institutions.`,
    connections: 37,
    recentActivities: [
      { type: 'Meeting', description: 'Met with IMF representatives regarding program review', date: '2025-03-28', impact: 'Positive' },
      { type: 'Statement', description: 'Announced new foreign investment framework with tax incentives', date: '2025-03-15', impact: 'Positive' },
      { type: 'Travel', description: 'Official visit to Saudi Arabia for investment discussions', date: '2025-02-22', impact: 'Positive' },
      { type: 'Policy', description: 'Unveiled 5-year debt reduction strategy', date: '2025-02-15', impact: 'Neutral' },
      { type: 'Meeting', description: 'Hosted delegation from African Development Bank', date: '2025-01-30', impact: 'Positive' }
    ],
    keyConnections: [
      { name: 'Nala Okoro', role: 'Nigerian Energy Executive', strength: 'Medium', relationship: 'Professional' },
      { name: 'African Development Bank', role: 'Financial Institution', strength: 'Strong', relationship: 'Institutional' },
      { name: 'UAE Investment Authority', role: 'Government Agency', strength: 'Strong', relationship: 'Financial' },
      { name: 'Egyptian Central Bank', role: 'Financial Regulator', strength: 'Strong', relationship: 'Governmental' },
      { name: 'Mahmoud Al-Faisal', role: 'Saudi Investment Director', strength: 'Medium', relationship: 'Professional' }
    ],
    trends: {
      influence: [7.8, 8.0, 8.2, 8.3, 8.5],
      sentiment: [65, 67, 71, 69, 73],
      riskFactor: [28, 26, 25, 23, 22]
    },
    keyRisks: ['Policy implementation challenges', 'Public reaction to reforms', 'Regional economic volatility'],
    opportunityAreas: ['Foreign investment attraction', 'Public-private partnerships', 'Regional financial integration'],
    recommendedMonitoring: ['Reform implementation progress', 'Public statements on economic policy', 'Regulatory changes in banking sector']
  },
  {
    id: 'ent002',
    name: 'Nala Okoro',
    type: 'person',
    role: 'Nigerian Energy Executive',
    country: 'Nigeria',
    riskScore: 'Medium',
    influenceScore: 7.8,
    bio: `CEO of Horizon Energy Group, a major player in Nigeria's oil and gas sector with expanding interests in renewable energy. Engineering background with MBA from Harvard. Previously served as advisor to Nigerian Petroleum Ministry and worked with international energy companies. Known for ambitious expansion plans and political connections across West Africa.`,
    connections: 42,
    recentActivities: [
      { type: 'Deal', description: 'Signed MoU for solar project development in Ghana', date: '2025-04-02', impact: 'Positive' },
      { type: 'Statement', description: 'Called for regulatory reforms in Nigerian energy sector', date: '2025-03-22', impact: 'Neutral' },
      { type: 'Investment', description: 'Announced $250M offshore gas project', date: '2025-03-10', impact: 'Positive' },
      { type: 'Meeting', description: 'Met with ECOWAS energy ministers in Abuja', date: '2025-02-18', impact: 'Positive' },
      { type: 'Controversy', description: 'Company faced environmental compliance allegations', date: '2025-01-25', impact: 'Negative' }
    ],
    keyConnections: [
      { name: 'Lagos State Government', role: 'Regional Government', strength: 'Strong', relationship: 'Governmental' },
      { name: 'Sahara Group', role: 'Energy Conglomerate', strength: 'Strong', relationship: 'Business' },
      { name: 'Ahmed Hassan', role: 'Egyptian Finance Minister', strength: 'Medium', relationship: 'Professional' },
      { name: 'West African Development Bank', role: 'Financial Institution', strength: 'Medium', relationship: 'Financial' },
      { name: 'Dangote Group', role: 'Industrial Conglomerate', strength: 'Medium', relationship: 'Business' }
    ],
    trends: {
      influence: [7.5, 7.6, 7.8, 7.8, 7.8],
      sentiment: [62, 58, 61, 63, 60],
      riskFactor: [35, 38, 37, 36, 35]
    },
    keyRisks: ['Regulatory changes in energy sector', 'Environmental compliance issues', 'Political instability in operational regions'],
    opportunityAreas: ['Renewable energy transition', 'Regional energy infrastructure projects', 'Gas monetization initiatives'],
    recommendedMonitoring: ['Energy sector regulatory developments', 'Company expansion activities', 'Environmental compliance record']
  },
  {
    id: 'ent003',
    name: 'Ibrahim Al-Moazzen',
    type: 'person',
    role: 'Sudanese Opposition Leader',
    country: 'Sudan',
    riskScore: 'High',
    influenceScore: 7.2,
    bio: `Former diplomat who emerged as key opposition figure following the 2023 political crisis. Heads the Coalition for Democratic Change, an alliance of civic and political groups. Graduate of London School of Economics with background in international relations. Growing popularity especially among urban youth and professional classes.`,
    connections: 31,
    recentActivities: [
      { type: 'Rally', description: 'Led major protest rally in Khartoum', date: '2025-04-01', impact: 'Significant' },
      { type: 'Statement', description: 'Called for international pressure on transitional authority', date: '2025-03-18', impact: 'Neutral' },
      { type: 'Meeting', description: 'Met with diplomatic representatives from EU', date: '2025-03-05', impact: 'Positive' },
      { type: 'Alliance', description: 'Formed coalition with regional political groups', date: '2025-02-12', impact: 'Positive' },
      { type: 'Controversy', description: 'Briefly detained by security forces', date: '2025-01-28', impact: 'Negative' }
    ],
    keyConnections: [
      { name: 'Khartoum Banking Group', role: 'Financial Institution', strength: 'Medium', relationship: 'Financial' },
      { name: 'Sudanese Professionals Association', role: 'Civil Society Group', strength: 'Strong', relationship: 'Political' },
      { name: 'East African Community', role: 'Regional Body', strength: 'Weak', relationship: 'Diplomatic' },
      { name: 'International Crisis Group', role: 'NGO', strength: 'Medium', relationship: 'Advisory' },
      { name: 'Former Sudanese Diplomat Network', role: 'Informal Group', strength: 'Strong', relationship: 'Professional' }
    ],
    trends: {
      influence: [6.5, 6.8, 7.0, 7.1, 7.2],
      sentiment: [58, 61, 59, 63, 65],
      riskFactor: [65, 64, 68, 62, 60]
    },
    keyRisks: ['Security service targeting', 'Political violence', 'Regional diplomatic challenges'],
    opportunityAreas: ['Democratic transition process', 'International support mobilization', 'Youth movement organization'],
    recommendedMonitoring: ['Public appearances and statements', 'Security force activities', 'Coalition relationships']
  },
  {
    id: 'ent004',
    name: 'Sarah Mbeki',
    type: 'person',
    role: 'South African Mining Minister',
    country: 'South Africa',
    riskScore: 'Low',
    influenceScore: 8.4,
    bio: `Appointed Mining Minister in 2024 after successful tenure as provincial executive. Economics and engineering background with 15 years in mining sector before entering politics. Known for pragmatic approach balancing industry needs with labor and environmental concerns. Considered potential future party leader.`,
    connections: 39,
    recentActivities: [
      { type: 'Policy', description: 'Announced mining sector incentive program', date: '2025-03-25', impact: 'Positive' },
      { type: 'Meeting', description: 'Hosted international mining investors forum', date: '2025-03-12', impact: 'Positive' },
      { type: 'Statement', description: 'Outlined position on resource nationalism', date: '2025-02-28', impact: 'Neutral' },
      { type: 'Negotiation', description: 'Mediated agreement between labor unions and mining companies', date: '2025-02-10', impact: 'Positive' },
      { type: 'Travel', description: 'Led delegation to China for mining partnerships', date: '2025-01-22', impact: 'Positive' }
    ],
    keyConnections: [
      { name: 'Anglo American', role: 'Mining Corporation', strength: 'Medium', relationship: 'Regulatory' },
      { name: 'African Development Bank', role: 'Financial Institution', strength: 'Medium', relationship: 'Professional' },
      { name: 'South African Mining Council', role: 'Industry Association', strength: 'Strong', relationship: 'Professional' },
      { name: 'National Union of Mineworkers', role: 'Labor Union', strength: 'Medium', relationship: 'Negotiation' },
      { name: 'China Development Bank', role: 'Financial Institution', strength: 'Medium', relationship: 'Financial' }
    ],
    trends: {
      influence: [8.0, 8.2, 8.3, 8.4, 8.4],
      sentiment: [68, 71, 69, 72, 70],
      riskFactor: [27, 25, 26, 24, 24]
    },
    keyRisks: ['Labor relation tensions', 'Commodity price volatility', 'Environmental regulation pressures'],
    opportunityAreas: ['Renewable minerals development', 'Mining technology modernization', 'International investment attraction'],
    recommendedMonitoring: ['Policy statements on mining', 'Relationship with labor groups', 'International partnership activities']
  },
  {
    id: 'ent005',
    name: 'Mohammed bin Zayed',
    type: 'person',
    role: 'UAE Senior Official',
    country: 'UAE',
    riskScore: 'Low',
    influenceScore: 9.5,
    bio: `Senior leadership figure with significant influence over UAE economic and foreign policy. Architect of the nation's economic diversification strategy and international investment approach. Known for strategic vision and building strong international relationships, particularly focused on technology advancement and post-oil economy development.`,
    connections: 58,
    recentActivities: [
      { type: 'Meeting', description: 'Hosted African leadership delegation', date: '2025-04-03', impact: 'Positive' },
      { type: 'Policy', description: 'Unveiled 2030 investment strategy for Africa', date: '2025-03-20', impact: 'Positive' },
      { type: 'Investment', description: 'Announced $5 billion technology investment fund', date: '2025-03-01', impact: 'Positive' },
      { type: 'Diplomatic', description: 'State visit to three East African nations', date: '2025-02-15', impact: 'Positive' },
      { type: 'Initiative', description: 'Launched renewable energy partnership program', date: '2025-01-10', impact: 'Positive' }
    ],
    keyConnections: [
      { name: 'UAE Investment Authority', role: 'Government Agency', strength: 'Strong', relationship: 'Governance' },
      { name: 'Mahmoud Al-Faisal', role: 'Saudi Investment Director', strength: 'Strong', relationship: 'Personal' },
      { name: 'Ahmed Hassan', role: 'Egyptian Finance Minister', strength: 'Medium', relationship: 'Diplomatic' },
      { name: 'African Development Bank', role: 'Financial Institution', strength: 'Medium', relationship: 'Institutional' },
      { name: 'Dubai Future Foundation', role: 'Government Organization', strength: 'Strong', relationship: 'Institutional' }
    ],
    trends: {
      influence: [9.3, 9.4, 9.4, 9.5, 9.5],
      sentiment: [75, 78, 77, 79, 80],
      riskFactor: [18, 17, 17, 16, 16]
    },
    keyRisks: ['Regional geopolitical tensions', 'Global energy transition impacts', 'International reputation management'],
    opportunityAreas: ['Technology investment', 'African strategic partnerships', 'Clean energy leadership'],
    recommendedMonitoring: ['Investment announcements', 'Diplomatic engagements', 'Strategic initiative launches']
  }
];

// Comprehensive stability index data for heatmap
export const stabilityIndexData = {
  regional: {
    'East Africa': {
      current: 6.1,
      previous: 5.9,
      trend: 'improving',
      components: {
        political: 5.8,
        economic: 6.5,
        security: 5.7,
        social: 6.3,
        environmental: 6.2
      },
      forecast: {
        optimistic: 6.4,
        baseline: 6.2,
        pessimistic: 5.9
      },
      keyFactors: {
        positive: ['Regional integration progress', 'Technology adoption', 'Infrastructure development'],
        negative: ['Climate impact on agriculture', 'Youth unemployment', 'Border tensions']
      }
    },
    'West Africa': {
      current: 5.5,
      previous: 5.4,
      trend: 'stable',
      components: {
        political: 5.6,
        economic: 5.8,
        security: 4.7,
        social: 5.5,
        environmental: 6.0
      },
      forecast: {
        optimistic: 5.8,
        baseline: 5.5,
        pessimistic: 5.1
      },
      keyFactors: {
        positive: ['Democratic consolidation', 'Economic diversification', 'Regional cooperation'],
        negative: ['Security threats', 'Political transitions', 'Commodity price vulnerability']
      }
    },
    'North Africa': {
      current: 5.8,
      previous: 5.6,
      trend: 'improving',
      components: {
        political: 5.5,
        economic: 6.2,
        security: 5.6,
        social: 5.7,
        environmental: 5.9
      },
      forecast: {
        optimistic: 6.1,
        baseline: 5.9,
        pessimistic: 5.5
      },
      keyFactors: {
        positive: ['Economic reforms', 'Infrastructure investment', 'Energy development'],
        negative: ['Political transition uncertainties', 'Water scarcity', 'Regional conflicts']
      }
    },
    'Southern Africa': {
      current: 5.9,
      previous: 6.1,
      trend: 'declining',
      components: {
        political: 6.2,
        economic: 5.3,
        security: 6.4,
        social: 5.5,
        environmental: 6.0
      },
      forecast: {
        optimistic: 6.1,
        baseline: 5.8,
        pessimistic: 5.5
      },
      keyFactors: {
        positive: ['Political stability', 'Regional integration', 'Infrastructure quality'],
        negative: ['Energy crisis', 'Economic slowdown', 'Inequality challenges']
      }
    },
    'Central Africa': {
      current: 4.8,
      previous: 4.7,
      trend: 'stable',
      components: {
        political: 4.3,
        economic: 5.2,
        security: 4.1,
        social: 5.0,
        environmental: 5.4
      },
      forecast: {
        optimistic: 5.1,
        baseline: 4.8,
        pessimistic: 4.5
      },
      keyFactors: {
        positive: ['Resource development', 'International engagement', 'Infrastructure projects'],
        negative: ['Armed conflicts', 'Governance challenges', 'Humanitarian situations']
      }
    },
    'Middle East': {
      current: 6.2,
      previous: 6.0,
      trend: 'improving',
      components: {
        political: 5.8,
        economic: 6.7,
        security: 5.5,
        social: 6.4,
        environmental: 6.6
      },
      forecast: {
        optimistic: 6.5,
        baseline: 6.3,
        pessimistic: 6.0
      },
      keyFactors: {
        positive: ['Economic diversification', 'Infrastructure development', 'Technology adoption'],
        negative: ['Regional tensions', 'Socio-political reforms', 'Resource dependencies']
      }
    }
  },
  
  countries: {
    'Nigeria': {
      current: 5.3,
      previous: 5.2,
      trend: 'stable',
      components: {
        political: 5.5,
        economic: 5.6,
        security: 4.5,
        social: 5.2,
        environmental: 5.9
      },
      forecast: {
        optimistic: 5.6,
        baseline: 5.3,
        pessimistic: 5.0
      },
      keyFactors: {
        positive: ['Democratic consolidation', 'Economic diversification', 'Technology adoption'],
        negative: ['Security challenges', 'Oil dependency', 'Infrastructure gaps']
      },
      subRegional: {
        'North': 4.5,
        'South': 5.8,
        'East': 5.4,
        'West': 5.6
      }
    },
    'Kenya': {
      current: 6.5,
      previous: 6.3,
      trend: 'improving',
      components: {
        political: 6.1,
        economic: 6.7,
        security: 6.0,
        social: 6.5,
        environmental: 6.8
      },
      forecast: {
        optimistic: 6.8,
        baseline: 6.6,
        pessimistic: 6.2
      },
      keyFactors: {
        positive: ['Economic growth', 'Technology hub status', 'Infrastructure development'],
        negative: ['Political tensions', 'Terrorism threats', 'Regional instability']
      },
      subRegional: {
        'Nairobi': 7.1,
        'Coast': 6.4,
        'Western': 6.2,
        'Northern': 5.6
      }
    },
    'Egypt': {
      current: 5.8,
      previous: 5.6,
      trend: 'improving',
      components: {
        political: 5.5,
        economic: 6.2,
        security: 5.7,
        social: 5.6,
        environmental: 5.8
      },
      forecast: {
        optimistic: 6.1,
        baseline: 5.9,
        pessimistic: 5.5
      },
      keyFactors: {
        positive: ['Economic reforms', 'Infrastructure projects', 'Strategic position'],
        negative: ['Social pressures', 'Regional security', 'Water resources']
      },
      subRegional: {
        'Cairo': 6.3,
        'Alexandria': 6.1,
        'Upper Egypt': 5.2,
        'Sinai': 4.7
      }
    },
    'South Africa': {
      current: 5.9,
      previous: 6.1,
      trend: 'declining',
      components: {
        political: 6.2,
        economic: 5.3,
        security: 5.6,
        social: 5.5,
        environmental: 6.8
      },
      forecast: {
        optimistic: 6.1,
        baseline: 5.8,
        pessimistic: 5.4
      },
      keyFactors: {
        positive: ['Institutional strength', 'Infrastructure quality', 'Regional influence'],
        negative: ['Energy crisis', 'Unemployment', 'Social inequality']
      },
      subRegional: {
        'Gauteng': 6.0,
        'Western Cape': 6.5,
        'KwaZulu-Natal': 5.7,
        'Eastern Cape': 5.3
      }
    },
    'Morocco': {
      current: 6.3,
      previous: 6.1,
      trend: 'improving',
      components: {
        political: 6.0,
        economic: 6.5,
        security: 6.2,
        social: 6.1,
        environmental: 6.4
      },
      forecast: {
        optimistic: 6.6,
        baseline: 6.4,
        pessimistic: 6.0
      },
      keyFactors: {
        positive: ['Political stability', 'Economic diversification', 'Strategic location'],
        negative: ['Regional tensions', 'Resource limitations', 'Social disparities']
      },
      subRegional: {
        'Casablanca-Rabat': 6.7,
        'Northern': 6.0,
        'Central': 6.3,
        'Southern': 5.9
      }
    }
  }
};

// Added helper types for TypeScript
export type Region = typeof regions[number];
export type Country = string;
export type City = string;
export type ReportType = typeof reportTypes[number]['id'];
export type Category = typeof categories[number];
export type ReportTopic = typeof reportTopics[number];
export type TimeRange = typeof timeRanges[number];
export type DataConnectorType = typeof dataConnectorTypes[number]['id'];
export type DataImportCategory = typeof dataImportCategories[number]['id'];
export type DataSourceTemplate = typeof dataSourceTemplates[number]['id'];
export type ModelingTechnique = typeof advancedModelingTechniques[number]['id'];

// More types can be added as needed for type safety throughout the application
