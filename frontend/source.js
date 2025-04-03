import React, { useState, useEffect, useRef } from 'react';
import {
  Search, Filter, Download, Share2, ZoomIn, ZoomOut, UserPlus, ChevronLeft, Info, AlertTriangle, Building, User, MapPin, ExternalLink,
  Globe, PieChart, Clock, ChevronDown, Menu, Save, Send, Settings, Plus, Trash2, BarChart, Layers, Map, Check, Bell, LifeBuoy, Edit3, Key,
  BrainCircuit, MessageSquare, X, TrendingUp, Target, AlertCircle, Bot, Zap, SlidersHorizontal, Microscope, Shuffle, SendHorizonal, Calendar, Users, LayoutGrid, BarChart3, Activity, Share // Added new icons
} from 'lucide-react';

// --- Mock Data & Constants ---
const mockEntityData = { name: "Ahmed Hassan", role: "Egyptian Finance Minister", connections: 37, riskScore: "Low", bio: "Former banking executive appointed as Finance Minister in 2023. Known for economic reform policies and international investment initiatives.", recentActivities: [{ type: "Meeting", description: "Met with IMF representatives", date: "Mar 28, 2025" }, { type: "Statement", description: "Announced new foreign investment framework", date: "Mar 15, 2025" }, { type: "Travel", description: "Official visit to Saudi Arabia", date: "Feb 22, 2025" }], keyConnections: [{ name: "Nala Okoro", role: "Nigerian Energy Executive", strength: "Medium" }, { name: "African Development Bank", role: "Financial Institution", strength: "Strong" }, { name: "UAE Investment Authority", role: "Government Agency", strength: "Strong" }]};
const timeRanges = ['1 month', '3 months', '6 months', '1 year', '3 years'];
const regions = ['All Regions', 'North Africa', 'East Africa', 'West Africa', 'Central Africa', 'Southern Africa', 'Middle East'];
// Added more countries per region for better filtering demo
const countriesByRegion = {
    'North Africa': ['Egypt', 'Algeria', 'Morocco', 'Tunisia', 'Libya'],
    'East Africa': ['Kenya', 'Ethiopia', 'Tanzania', 'Uganda', 'Rwanda', 'South Sudan'],
    'West Africa': ['Nigeria', 'Ghana', 'Senegal', 'Ivory Coast', 'Mali'],
    'Central Africa': ['DRC', 'Cameroon', 'Chad', 'CAR', 'Congo-Brazzaville'],
    'Southern Africa': ['South Africa', 'Angola', 'Zambia', 'Zimbabwe', 'Botswana', 'Namibia'],
    'Middle East': ['Saudi Arabia', 'UAE', 'Qatar', 'Oman', 'Jordan', 'Iraq']
};
const allCountries = Object.values(countriesByRegion).flat();
// Added more cities per country
const citiesByCountry = {
    'Egypt': ['Cairo', 'Alexandria', 'Giza'],
    'Nigeria': ['Lagos', 'Abuja', 'Kano', 'Ibadan'],
    'Kenya': ['Nairobi', 'Mombasa', 'Kisumu'],
    'Saudi Arabia': ['Riyadh', 'Jeddah', 'Mecca', 'Medina'],
    'UAE': ['Dubai', 'Abu Dhabi', 'Sharjah'],
    'South Africa': ['Johannesburg', 'Cape Town', 'Durban', 'Pretoria'],
    'Ethiopia': ['Addis Ababa', 'Dire Dawa'],
    'Ghana': ['Accra', 'Kumasi']
};
const allCities = Object.values(citiesByCountry).flat();

const categories = ['Overview', 'Security', 'Economy', 'Governance', 'Infrastructure', 'Social'];
const reportTopics = ['Economic Development', 'Foreign Investment', 'Political Stability', 'Security Threats', 'Infrastructure Projects', 'Natural Resources', 'Trade Agreements', 'Governance Issues', 'Technology Adoption'];
const reportEntities = ['African Development Bank', 'Sahara Group', 'NEOM', 'Ahmed Hassan', 'Nala Okoro', 'Mahmoud Al-Faisal'];
const reportTypes = [{ id: 'comprehensive', name: 'Comprehensive Analysis', description: 'In-depth report covering multiple aspects of selected topics' }, { id: 'security', name: 'Security Brief', description: 'Focused assessment of security risks and stability factors' }, { id: 'economic', name: 'Economic Outlook', description: 'Analysis of economic trends, investments, and market conditions' }, { id: 'entity', name: 'Entity Profile', description: 'Detailed background on selected organizations or individuals' }];

// Mock data for Geospatial Details Panel
const mockLocationData = {
    'Nairobi': { type: 'City', country: 'Kenya', region: 'East Africa', population: '4.4M (Metro)', stabilityIndex: 6.8, recentEvents: [ { id: 1, type: 'Infrastructure', title: 'New Tech Hub Launched', date: 'Mar 30, 2025', impact: 'Positive' }, { id: 2, type: 'Security', title: 'Minor Protest Dispersed', date: 'Mar 25, 2025', impact: 'Neutral' }, { id: 3, type: 'Economy', title: 'Foreign Investment Deal Signed', date: 'Mar 20, 2025', impact: 'Positive' }, ], keyIndicators: { 'GDP Growth (Projected)': '+5.5%', 'Unemployment Rate': '12%', 'Security Alert Level': 'Medium' } },
    'Lagos': { type: 'City', country: 'Nigeria', region: 'West Africa', population: '21M (Metro)', stabilityIndex: 5.2, recentEvents: [ { id: 4, type: 'Security', title: 'Increased Patrols in Ikeja', date: 'Apr 1, 2025', impact: 'Neutral' }, { id: 5, type: 'Economy', title: 'Port Congestion Reported', date: 'Mar 28, 2025', impact: 'Negative' }, ], keyIndicators: { 'Inflation Rate': '18%', 'Security Alert Level': 'High', 'Energy Production': 'Stable' } },
    'East Africa': { type: 'Region', population: '~450M', stabilityIndex: 6.1, recentEvents: [ { id: 6, type: 'Politics', title: 'Regional Trade Summit Concluded', date: 'Mar 29, 2025', impact: 'Positive' }, { id: 7, type: 'Environment', title: 'Drought Conditions Worsen in Horn of Africa', date: 'Mar 27, 2025', impact: 'Negative' }, ], keyIndicators: { 'Regional GDP Growth': '+4.8%', 'Cross-border Incidents': 'Low', 'Investment Trend': 'Increasing' } },
    'Kenya': { type: 'Country', region: 'East Africa', population: '~55M', stabilityIndex: 6.5, recentEvents: [ { id: 8, type: 'Politics', title: 'Parliamentary Session on Budget', date: 'Apr 2, 2025', impact: 'Neutral' }, { id: 9, type: 'Economy', title: 'New Mobile Money Regulations', date: 'Mar 31, 2025', impact: 'Mixed' }, ], keyIndicators: { 'National GDP Growth': '+5.2%', 'Debt-to-GDP Ratio': '68%', 'Tourism Arrivals': '+15% YoY' } }
};


// --- UI Components ---

// --- AI Helper Chat Component ---
const AIHelperChat = ({ onClose }) => {
    const [messages, setMessages] = useState([ { sender: 'ai', text: "Hello! I'm your Savannah Intelligence AI assistant. How can I help you analyze data today?" } ]);
    const [inputText, setInputText] = useState('');
    const messagesEndRef = useRef(null);
    const scrollToBottom = () => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); };
    useEffect(scrollToBottom, [messages]);
    const handleSend = () => { if (inputText.trim() === '') return; const userMessage = { sender: 'user', text: inputText }; const aiResponse = { sender: 'ai', text: `Okay, analyzing "${inputText.substring(0, 30)}..." (This is a simulated response). Based on current data, I predict a 15% increase in...` }; setMessages([...messages, userMessage, aiResponse]); setInputText(''); };
    const handleKeyPress = (event) => { if (event.key === 'Enter' && !event.shiftKey) { event.preventDefault(); handleSend(); } };
    const suggestedPrompts = ["Summarize recent security events in East Africa.", "Show economic forecast for Nigeria.", "Identify key risks related to Ahmed Hassan.", "Compare investment trends in Kenya vs Ethiopia."];
    return ( <div className="fixed bottom-20 right-6 w-96 h-[60vh] bg-white rounded-lg shadow-2xl border border-gray-200 flex flex-col z-50"> <div className="flex items-center justify-between p-3 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-t-lg"> <div className="flex items-center"> <BrainCircuit className="h-5 w-5 mr-2" /> <h3 className="font-semibold text-md">AI Assistant</h3> </div> <button onClick={onClose} className="p-1 rounded-full hover:bg-white/20"> <X className="h-5 w-5" /> </button> </div> <div className="flex-1 overflow-y-auto p-4 space-y-3 text-sm"> {messages.map((msg, index) => ( <div key={index} className={`flex ${msg.sender === 'ai' ? 'justify-start' : 'justify-end'}`}> <div className={`p-2.5 rounded-lg max-w-[80%] ${msg.sender === 'ai' ? 'bg-gray-100 text-gray-800' : 'bg-blue-600 text-white'}`}> {msg.text} </div> </div> ))} <div ref={messagesEndRef} /> </div> <div className="p-2 border-t border-gray-100"> <p className="text-xs text-gray-500 mb-1 px-2">Suggestions:</p> <div className="flex flex-wrap gap-1.5 px-1"> {suggestedPrompts.slice(0,2).map((prompt, i) => ( <button key={i} onClick={() => setInputText(prompt)} className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 py-1 rounded-full"> {prompt} </button> ))} </div> </div> <div className="p-3 border-t border-gray-200"> <div className="flex items-center bg-gray-100 rounded-lg border border-gray-200"> <textarea value={inputText} onChange={(e) => setInputText(e.target.value)} onKeyPress={handleKeyPress} placeholder="Ask about data, trends, risks..." className="flex-1 p-2 bg-transparent focus:outline-none resize-none text-sm h-10 max-h-20" rows={1} /> <button onClick={handleSend} className="p-2 text-blue-600 hover:text-blue-800 disabled:text-gray-400" disabled={!inputText.trim()}> <SendHorizonal className="h-5 w-5" /> </button> </div> </div> </div> );
};


// --- Core App Pages (Placeholders & Existing Components) ---

const UserProfilePage = ({ navigateBack }) => {
    const user = { name: "Demo User", email: "demo@savannah.intel", org: "Default Org" };
    return ( <div className="p-6 max-w-4xl mx-auto"> <div className="flex items-center justify-between mb-6"> <h1 className="text-2xl font-bold text-gray-800">User Profile</h1> <button onClick={navigateBack} className="text-sm text-blue-600 hover:underline flex items-center"> <ChevronLeft className="h-4 w-4 mr-1" /> Back </button> </div> <div className="bg-white p-8 rounded-lg shadow-md border border-gray-100"> <div className="flex items-center mb-6"> <div className="h-20 w-20 rounded-full bg-gradient-to-br from-gray-300 to-gray-400 mr-6 flex items-center justify-center text-gray-600 text-3xl font-semibold"> {user?.name?.split(' ').map(n => n[0]).join('') || '?'} </div> <div> <h2 className="text-xl font-semibold text-gray-800">{user?.name || 'N/A'}</h2> <p className="text-gray-600">{user?.email || 'N/A'}</p> <p className="text-sm text-gray-500">Member of: {user?.org || 'N/A'}</p> </div> </div> <div className="space-y-3 text-sm"> <p><strong>Role:</strong> Analyst (Placeholder)</p> <p><strong>Joined:</strong> January 15, 2025 (Placeholder)</p> </div> <button className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 flex items-center font-medium"> <Edit3 className="h-4 w-4 mr-2" /> Edit Profile </button> </div> </div> );
};

const AccountSettingsPage = ({ navigateBack }) => {
     const user = { name: "Demo User", email: "demo@savannah.intel", org: "Default Org" };
     return ( <div className="p-6 max-w-4xl mx-auto"> <div className="flex items-center justify-between mb-6"> <h1 className="text-2xl font-bold text-gray-800">Account & Organization Settings</h1> <button onClick={navigateBack} className="text-sm text-blue-600 hover:underline flex items-center"> <ChevronLeft className="h-4 w-4 mr-1" /> Back </button> </div> <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 mb-6"> <h2 className="text-lg font-semibold mb-4 text-gray-800 flex items-center"> <Building className="h-5 w-5 mr-2 text-blue-600"/> Organization: {user?.org || 'N/A'} </h2> <div className="space-y-4"> <div> <label className="block text-sm font-medium text-gray-700">Organization Name</label> <input type="text" defaultValue={user?.org || ''} className="mt-1 w-full p-2 border border-gray-300 rounded-md text-sm" /> </div> <div> <h3 className="text-md font-medium text-gray-700 mb-2">Members (Placeholder: 1)</h3> <ul className="space-y-2 text-sm"> <li className="flex justify-between items-center p-2 bg-gray-50 rounded"><span>{user.name} (you)</span> <span className="text-xs font-medium text-blue-700">Admin</span></li> </ul> <button className="mt-3 text-sm text-blue-600 hover:underline flex items-center font-medium"> <UserPlus className="h-4 w-4 mr-1" /> Invite Member </button> </div> <div> <h3 className="text-md font-medium text-gray-700 mb-2">Subscription</h3> <p className="text-sm text-gray-600">Current Plan: <span className="font-medium text-green-700">Demo Plan</span></p> <button className="mt-2 text-sm text-blue-600 hover:underline font-medium">Manage Billing</button> </div> </div> </div> <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 mb-6"> <h2 className="text-lg font-semibold mb-4 text-gray-800 flex items-center"> <Key className="h-5 w-5 mr-2 text-blue-600"/> Security </h2> <p className="text-sm text-gray-500">Security settings are unavailable in this demo mode.</p> </div> <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100"> <h2 className="text-lg font-semibold mb-4 text-gray-800 flex items-center"> <Bell className="h-5 w-5 mr-2 text-blue-600"/> Alert Preferences </h2> <div className="space-y-3"> <div className="flex items-center"> <input type="checkbox" id="alertEmail" className="mr-2 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" defaultChecked/> <label htmlFor="alertEmail" className="text-sm text-gray-700">Receive critical alerts via email</label> </div> <div className="flex items-center"> <input type="checkbox" id="alertInApp" className="mr-2 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" defaultChecked/> <label htmlFor="alertInApp" className="text-sm text-gray-700">Show in-app notifications</label> </div> <div> <label className="block text-sm font-medium text-gray-700 mb-1">Notification Frequency</label> <select className="w-full sm:w-auto p-2 border border-gray-300 rounded-md text-sm"> <option>Immediately</option> <option>Daily Digest</option> <option>Weekly Digest</option> </select> </div> </div> </div> </div> );
};

const AlertsPage = ({ navigateBack }) => ( <div className="p-6 max-w-6xl mx-auto"> <div className="flex items-center justify-between mb-6"> <h1 className="text-2xl font-bold text-gray-800">Alerts Feed</h1> <button onClick={navigateBack} className="text-sm text-blue-600 hover:underline flex items-center"> <ChevronLeft className="h-4 w-4 mr-1" /> Back </button> </div> <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100"> <div className="flex flex-wrap gap-4 justify-between items-center mb-4"> <div className="flex gap-2"> <button className="flex items-center text-sm bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-md"> <SlidersHorizontal className="h-4 w-4 mr-1"/> Filter by Type </button> <button className="flex items-center text-sm bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-md"> <MapPin className="h-4 w-4 mr-1"/> Filter by Region </button> </div> <span className="text-sm text-gray-500 italic"> (Real-time updates require backend)</span> </div> <div className="space-y-4"> <div className="p-4 bg-purple-50 border-l-4 border-purple-500 rounded-r-md flex items-start space-x-3 shadow-sm"> <TrendingUp className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0"/> <div className="flex-1"> <div className="flex justify-between items-center"> <p className="font-semibold text-purple-800">Forecast: Increased Political Instability</p> <span className="text-xs text-gray-500">Predicted for Q3 2025</span> </div> <p className="text-sm text-purple-700 mt-1">AI analysis predicts a 65% likelihood of increased protests in [Country A] based on economic indicators and social sentiment trends.</p> <button className="text-xs text-blue-600 hover:underline mt-1">View Scenario</button> </div> </div> <div className="p-4 bg-orange-50 border-l-4 border-orange-500 rounded-r-md flex items-start space-x-3 shadow-sm"> <AlertCircle className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0"/> <div className="flex-1"> <div className="flex justify-between items-center"> <p className="font-semibold text-orange-800">Anomaly Detected: Unusual Shipping Volume</p> <span className="text-xs text-gray-500">Last 24h</span> </div> <p className="text-sm text-orange-700 mt-1">Detected a 3-sigma deviation in shipping container volume at [Port B]. Possible cause: unreported strike or logistical disruption.</p> <button className="text-xs text-blue-600 hover:underline mt-1">Investigate</button> </div> </div> <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded-r-md flex items-start space-x-3 shadow-sm"> <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0"/> <div className="flex-1"> <div className="flex justify-between items-center"> <p className="font-semibold text-red-800">High Priority: Security Incident in [Region X]</p> <span className="text-xs text-gray-500">2 minutes ago</span> </div> <p className="text-sm text-red-700 mt-1">Detected unusual activity near [Location Y]. Potential impact on supply chains. Action recommended.</p> <button className="text-xs text-blue-600 hover:underline mt-1">View Details</button> </div> </div> </div> </div> </div> );

// --- Enhanced Geospatial Page ---
const GeospatialPage = ({ navigateBack }) => {
    const [activeLayers, setActiveLayers] = useState(['securityIncidents', 'infrastructure']);
    const [granularity, setGranularity] = useState('region'); // region, country, city
    const [selectedRegion, setSelectedRegion] = useState('East Africa');
    const [selectedCountry, setSelectedCountry] = useState(''); // Keep track of selected country
    const [selectedCity, setSelectedCity] = useState('');
    const [selectedDataPoint, setSelectedDataPoint] = useState(null); // To show details for a clicked point

    // Determine the currently selected location name for display and data lookup
    const getCurrentLocationName = () => {
        if (granularity === 'city' && selectedCity) return selectedCity;
        if (granularity === 'country' && selectedCountry) return selectedCountry;
        if (granularity === 'region' && selectedRegion) return selectedRegion;
        return 'All Regions'; // Fallback
    };
    const currentLocationName = getCurrentLocationName();
    const locationData = mockLocationData[currentLocationName] || mockLocationData['East Africa']; // Default data

    const handleGranularityChange = (e) => {
        setGranularity(e.target.value);
        // Reset lower-level selections when granularity changes
        setSelectedCountry('');
        setSelectedCity('');
        setSelectedDataPoint(null); // Clear point details
        // Update selectedLocationName based on the new granularity and existing higher-level selections
        if (e.target.value === 'region') setSelectedRegion('All Regions'); // Or keep the current one? Decide UX.
    };

     const handleRegionChange = (e) => {
        setSelectedRegion(e.target.value);
        setSelectedCountry(''); // Reset country/city
        setSelectedCity('');
        setSelectedDataPoint(null);
    };

     const handleCountryChange = (e) => {
        setSelectedCountry(e.target.value);
        setSelectedCity(''); // Reset city
        setSelectedDataPoint(null);
    };

     const handleCityChange = (e) => {
        setSelectedCity(e.target.value);
        setSelectedDataPoint(null);
    };


    const toggleLayer = (layerId) => {
        setActiveLayers(prev =>
            prev.includes(layerId) ? prev.filter(l => l !== layerId) : [...prev, layerId]
        );
    };

    // Simulate clicking a point on the map
    const handleMapClick = (pointData) => {
        console.log("Map point clicked (simulated):", pointData);
        setSelectedDataPoint(pointData);
    };

    // Get available countries based on selected region
    const availableCountries = selectedRegion && selectedRegion !== 'All Regions' ? countriesByRegion[selectedRegion] || [] : allCountries;
    // Get available cities based on selected country
    const availableCities = selectedCountry ? citiesByCountry[selectedCountry] || [] : [];


    return (
        <div className="flex flex-col h-full">
             <header className="bg-white border-b border-gray-200 p-4 flex items-center justify-between sticky top-0 z-20 flex-shrink-0">
                 <div className="flex items-center">
                    <button onClick={navigateBack} className="mr-2 p-1 rounded hover:bg-gray-100"> <ChevronLeft className="h-5 w-5 text-gray-600" /> </button>
                    <h1 className="text-xl font-bold">Geospatial Analysis</h1>
                 </div>
                 <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600 font-medium">Location: {currentLocationName}</span>
                    <button className="p-1.5 hover:bg-gray-100 rounded-md text-gray-600"><ZoomIn className="h-5 w-5" /></button>
                    <button className="p-1.5 hover:bg-gray-100 rounded-md text-gray-600"><ZoomOut className="h-5 w-5" /></button>
                 </div>
             </header>
             <div className="flex flex-1 overflow-hidden">
                {/* Map Area Placeholder */}
                <div className="flex-1 bg-gray-200 relative flex items-center justify-center border-r border-gray-300">
                     {/* Enhanced SVG Placeholder */}
                     <svg width="80%" height="80%" viewBox="0 0 200 150" className="opacity-60"> <path d="M50,5 L150,5 L195,75 L150,145 L50,145 L5,75 Z" fill="#D1D5DB" stroke="#9CA3AF" strokeWidth="0.5" /> <path d="M100,5 L150,5 L165,40 L100,40 Z" fill="#A5B4FC" opacity={granularity === 'region' && selectedRegion === 'North Africa' ? 0.7 : 0.3} /> <path d="M150,5 L195,75 L175,75 L150,45 Z" fill="#FCA5A5" opacity={granularity === 'region' && selectedRegion === 'East Africa' ? 0.7 : 0.3} /> <circle cx="100" cy="80" r="3" fill="#DC2626" className="cursor-pointer" onClick={() => handleMapClick({ id: 'sec1', type: 'Security Incident', location: 'Nairobi Area' })}/> <circle cx="120" cy="60" r="4" fill="#1D4ED8" className="cursor-pointer" onClick={() => handleMapClick({ id: 'inf2', type: 'Infrastructure Project', location: 'Coastal Region' })}/> <circle cx="80" cy="100" r="2" fill="#F59E0B" className="cursor-pointer" onClick={() => handleMapClick({ id: 'eco3', type: 'Economic Activity Spike', location: 'Westlands' })}/> </svg>
                     <p className="absolute bottom-4 text-gray-600 text-center text-xs italic"> Interactive Map Placeholder - Implement map library here.<br/> Displaying mock data for: {currentLocationName} </p>
                     {/* Details Panel (Absolutely Positioned) */}
                     {selectedDataPoint && ( <div className="absolute top-4 right-4 w-64 bg-white/90 backdrop-blur-sm p-3 rounded-lg shadow-lg border border-gray-200 z-30"> <button onClick={() => setSelectedDataPoint(null)} className="absolute top-1 right-1 p-0.5 rounded hover:bg-gray-200"> <X className="h-4 w-4 text-gray-500"/> </button> <h4 className="text-sm font-semibold mb-1">{selectedDataPoint.type}</h4> <p className="text-xs text-gray-600 mb-2">Location: {selectedDataPoint.location}</p> <p className="text-xs text-gray-700">Details: Placeholder details for point ID {selectedDataPoint.id}. Further analysis available.</p> <button className="text-xs text-blue-600 hover:underline mt-1">View Full Details</button> </div> )}
                     {/* Location Data Panel */}
                      {!selectedDataPoint && locationData && (
                          <div className="absolute top-4 left-4 w-64 bg-white/90 backdrop-blur-sm p-3 rounded-lg shadow-lg border border-gray-200 z-30 max-h-[80%] overflow-y-auto">
                             <h4 className="text-md font-semibold mb-2 text-gray-800">{currentLocationName} ({locationData.type})</h4>
                             {locationData.country && <p className="text-xs text-gray-500 mb-1">Country: {locationData.country}</p>}
                             {locationData.region && <p className="text-xs text-gray-500 mb-2">Region: {locationData.region}</p>}
                             <div className="mb-3 space-y-1">
                                 <p className="text-sm"><strong>Population:</strong> {locationData.population}</p>
                                 <p className="text-sm"><strong>Stability Index:</strong> <span className={`font-medium ${locationData.stabilityIndex > 7 ? 'text-green-600' : locationData.stabilityIndex > 5 ? 'text-yellow-600' : 'text-red-600'}`}>{locationData.stabilityIndex} / 10</span></p>
                             </div>
                             <h5 className="text-sm font-medium mb-1 text-gray-700">Key Indicators:</h5>
                             <ul className="list-disc list-inside space-y-1 text-xs text-gray-600 mb-3">
                                {Object.entries(locationData.keyIndicators).map(([key, value]) => <li key={key}><strong>{key}:</strong> {value}</li>)}
                             </ul>
                              <h5 className="text-sm font-medium mb-1 text-gray-700">Recent Events:</h5>
                             <ul className="space-y-1 text-xs text-gray-600">
                                {locationData.recentEvents.slice(0, 3).map(event => <li key={event.id} className="border-l-2 pl-1.5 border-gray-300">{event.title} ({event.date})</li>)}
                             </ul>
                          </div>
                      )}
                </div>
                {/* Sidebar for Layers & Filters */}
                <aside className="w-72 bg-white border-l border-gray-200 p-4 overflow-y-auto flex-shrink-0">
                    <h2 className="text-lg font-semibold mb-4 text-gray-800">Controls</h2>
                    {/* Location Selection */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Granularity</label>
                        <select value={granularity} onChange={handleGranularityChange} className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500">
                            <option value="region">Region</option>
                            <option value="country">Country</option>
                            <option value="city">City/District</option>
                        </select>
                    </div>
                     <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Select Region</label>
                        <select value={selectedRegion} onChange={handleRegionChange} disabled={granularity !== 'region'} className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed">
                            {regions.map(r => <option key={r} value={r}>{r}</option>)}
                        </select>
                    </div>
                     <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Select Country</label>
                        <select value={selectedCountry} onChange={handleCountryChange} disabled={granularity !== 'country'} className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed">
                            <option value="">-- Select Country --</option>
                            {/* In a real app, filter availableCountries based on selectedRegion if granularity allows */}
                            {availableCountries.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>
                     <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Select City/District</label>
                        <select value={selectedCity} onChange={handleCityChange} disabled={granularity !== 'city'} className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed">
                             <option value="">-- Select City --</option>
                             {/* In a real app, filter availableCities based on selectedCountry */}
                            {availableCities.map(ci => <option key={ci} value={ci}>{ci}</option>)}
                        </select>
                    </div>

                    {/* Layer Toggles */}
                    <div className="mb-4">
                        <h3 className="text-md font-medium text-gray-700 mb-2">Data Layers</h3>
                        <div className="space-y-1">
                            {[ { id: 'securityIncidents', label: 'Security Incidents', icon: AlertTriangle, color: 'text-red-500' }, { id: 'economicActivity', label: 'Economic Activity', icon: TrendingUp, color: 'text-green-500' }, { id: 'infrastructure', label: 'Infrastructure', icon: Building, color: 'text-blue-500' }, { id: 'populationDensity', label: 'Population Density', icon: Users, color: 'text-yellow-500' }, { id: 'sentiment', label: 'Social Sentiment', icon: MessageSquare, color: 'text-purple-500' }, ].map(layer => ( <label key={layer.id} htmlFor={layer.id} className="flex items-center p-2 rounded-md hover:bg-gray-50 cursor-pointer"> <input type="checkbox" id={layer.id} checked={activeLayers.includes(layer.id)} onChange={() => toggleLayer(layer.id)} className="mr-3 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"/> <layer.icon className={`h-4 w-4 mr-1.5 ${layer.color}`} /> <span className="text-sm text-gray-700">{layer.label}</span> </label> ))}
                        </div>
                    </div>
                     {/* Time Slider Placeholder */}
                     <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center"><Calendar className="h-4 w-4 mr-1.5"/>Time Range</label>
                         <input type="range" min="0" max="100" defaultValue="80" className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"/>
                         <div className="flex justify-between text-xs text-gray-500 mt-1"><span>Past Year</span><span>Now</span></div>
                     </div>
                </aside>
             </div>
        </div>
    );
};

const ScenarioPlanningPage = ({ navigateBack }) => {
    const [scenarioName, setScenarioName] = useState('Example: Oil Price Shock');
    const [results, setResults] = useState(null);
    const runSimulation = () => { console.log("Simulating scenario:", scenarioName); setResults({ impactScore: 7.8, affectedRegions: ['West Africa', 'Middle East'], keyRisks: ['Reduced GDP growth in Nigeria', 'Increased inflation in UAE', 'Potential supply chain disruptions'], confidence: 'Medium', summary: 'A significant oil price decrease is projected to negatively impact oil-exporting nations while potentially benefiting net importers, with medium confidence.' }); };
    return ( <div className="p-6 max-w-6xl mx-auto"> <div className="flex items-center justify-between mb-6"> <h1 className="text-2xl font-bold text-gray-800">Scenario Planning & Simulation</h1> <button onClick={navigateBack} className="text-sm text-blue-600 hover:underline flex items-center"> <ChevronLeft className="h-4 w-4 mr-1" /> Back </button> </div> <div className="grid grid-cols-1 md:grid-cols-3 gap-6"> <div className="md:col-span-1 bg-white p-6 rounded-lg shadow-md border border-gray-100"> <h2 className="text-lg font-semibold mb-4">Define Scenario</h2> <div className="space-y-4"> <div> <label className="block text-sm font-medium text-gray-700 mb-1">Scenario Name</label> <input type="text" value={scenarioName} onChange={e => setScenarioName(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md text-sm" /> </div> <div> <label className="block text-sm font-medium text-gray-700 mb-1">Scenario Type</label> <select className="w-full p-2 border border-gray-300 rounded-md text-sm"> <option>Economic Shock</option> <option>Political Event</option> <option>Security Crisis</option> <option>Environmental Event</option> <option>Custom</option> </select> </div> <div> <label className="block text-sm font-medium text-gray-700 mb-1">Key Parameters</label> <textarea placeholder="Define variables, e.g., Oil price drops 30%, Election outcome in Country X, Border closure..." className="w-full p-2 border border-gray-300 rounded-md text-sm h-24"></textarea> </div> <div> <label className="block text-sm font-medium text-gray-700 mb-1">Time Horizon</label> <select className="w-full p-2 border border-gray-300 rounded-md text-sm"> <option>3 Months</option> <option>6 Months</option> <option>1 Year</option> <option>3 Years</option> </select> </div> <button onClick={runSimulation} className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 flex items-center justify-center"> <Zap className="h-4 w-4 mr-2"/> Run Simulation </button> </div> </div> <div className="md:col-span-2 bg-white p-6 rounded-lg shadow-md border border-gray-100"> <h2 className="text-lg font-semibold mb-4">Simulation Results</h2> {results ? ( <div className="space-y-4"> <h3 className="text-md font-medium">Scenario: {scenarioName}</h3> <div> <p className="text-sm font-medium text-gray-700">Overall Impact Score:</p> <p className={`text-2xl font-bold ${results.impactScore > 7 ? 'text-red-600' : results.impactScore > 4 ? 'text-yellow-600' : 'text-green-600'}`}>{results.impactScore} / 10</p> <p className="text-xs text-gray-500">Confidence: {results.confidence}</p> </div> <div> <p className="text-sm font-medium text-gray-700">Summary:</p> <p className="text-sm text-gray-600">{results.summary}</p> </div> <div> <p className="text-sm font-medium text-gray-700">Key Risks / Outcomes:</p> <ul className="list-disc list-inside space-y-1 text-sm text-gray-600"> {results.keyRisks.map((risk, i) => <li key={i}>{risk}</li>)} </ul> </div> <div> <p className="text-sm font-medium text-gray-700">Affected Regions/Countries:</p> <p className="text-sm text-gray-600">{results.affectedRegions.join(', ')}</p> </div> <div className="h-32 bg-gray-100 rounded flex items-center justify-center text-gray-400 text-sm italic border"> Placeholder for result visualizations (e.g., impact map, trend charts) </div> </div> ) : ( <div className="text-center text-gray-500 py-10"> <p>Define scenario parameters and run simulation to see results.</p> </div> )} </div> </div> </div> );
};


// --- Existing Components (DashboardUI, EntityNetworkVisualization, ReportGenerationInterface) ---
// Minor updates to add placeholders for advanced features

const EntityNetworkVisualization = ({ navigateBack }) => {
    const [selectedEntity, setSelectedEntity] = useState(mockEntityData);
    const [timeRange, setTimeRange] = useState('6 months');
    const [influenceScoreFilter, setInfluenceScoreFilter] = useState([0, 10]);
    return ( <div className="flex flex-col h-full bg-gray-50 text-gray-900"> <header className="bg-white border-b border-gray-200 p-4 flex items-center sticky top-0 z-10"> <button onClick={navigateBack} className="mr-2 p-1 rounded hover:bg-gray-100"> <ChevronLeft className="h-5 w-5 text-gray-600" /> </button> <h1 className="text-xl font-bold">Entity Network Analysis</h1> </header> <div className="flex flex-1 overflow-hidden"> <aside className="w-64 bg-white border-r border-gray-200 flex flex-col overflow-y-auto"> <div className="p-4 border-b border-gray-200"> <div className="relative mb-4"> <input type="text" placeholder="Search entities..." className="w-full bg-gray-100 rounded-md pl-8 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"/> <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" /> </div> {/* Entity Type, Time Range, Connection Strength, Relationship Types... */} <div className="mb-4"> <label className="block text-sm font-medium text-gray-700 mb-1">Entity Type</label> <div className="space-y-1"> <div className="flex items-center"> <input type="checkbox" id="people" className="mr-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500" defaultChecked /> <label htmlFor="people" className="text-sm flex items-center"> <User className="h-3 w-3 mr-1 text-blue-600" /> People </label> </div> <div className="flex items-center"> <input type="checkbox" id="organizations" className="mr-2 rounded border-gray-300 text-purple-600 focus:ring-purple-500" defaultChecked /> <label htmlFor="organizations" className="text-sm flex items-center"> <Building className="h-3 w-3 mr-1 text-purple-600" /> Organizations </label> </div> <div className="flex items-center"> <input type="checkbox" id="locations" className="mr-2 rounded border-gray-300 text-green-600 focus:ring-green-500" defaultChecked /> <label htmlFor="locations" className="text-sm flex items-center"> <MapPin className="h-3 w-3 mr-1 text-green-600" /> Locations </label> </div> </div> </div> <div className="mb-4"> <label className="block text-sm font-medium text-gray-700 mb-1">Time Range</label> <select value={timeRange} onChange={(e) => setTimeRange(e.target.value)} className="w-full bg-gray-100 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm border border-gray-200"> {timeRanges.map(range => ( <option key={range} value={range}>{range}</option> ))} </select> </div> </div> <div className="p-4 border-b border-gray-200"> <h3 className="text-sm font-semibold text-gray-500 mb-2 uppercase tracking-wider flex items-center"><Microscope className="h-4 w-4 mr-1.5"/>Advanced Filters</h3> <div className="mb-4"> <label className="block text-sm font-medium text-gray-700 mb-1">Influence Score</label> <input type="range" min="0" max="10" step="0.5" className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"/> <div className="flex justify-between text-xs text-gray-500"><span>Low</span><span>High</span></div> </div> <div className="mb-4"> <label className="block text-sm font-medium text-gray-700 mb-1">Sentiment</label> <select className="w-full p-1 border border-gray-300 rounded-md text-sm"> <option>Any</option> <option>Positive</option> <option>Neutral</option> <option>Negative</option> </select> </div> <div> <button className="text-xs text-blue-600 hover:underline flex items-center"><Plus className="h-3 w-3 mr-1"/> Add more filters</button> </div> </div> <div className="p-4 mt-auto border-t border-gray-200"> <button className="w-full bg-blue-600 text-white rounded-md p-2 mb-2 text-sm hover:bg-blue-700 transition duration-150"> Apply Filters </button> <button className="w-full text-blue-600 border border-blue-600 rounded-md p-2 text-sm hover:bg-blue-50 transition duration-150"> Reset </button> </div> </aside> <main className="flex-1 flex flex-col bg-gray-100"> <div className="bg-white border-b border-gray-200 p-2 flex items-center justify-between text-sm"> <div className="flex items-center space-x-2"> <button className="p-2 hover:bg-gray-100 rounded-md text-gray-600"><ZoomIn className="h-5 w-5" /></button> <button className="p-2 hover:bg-gray-100 rounded-md text-gray-600"><ZoomOut className="h-5 w-5" /></button> <span className="text-sm text-gray-500 px-2">100%</span> <div className="h-4 border-r border-gray-300 mx-2"></div> <div className="flex items-center text-sm text-gray-500"><span className="font-medium mr-1 text-gray-700">37</span> entities<span className="mx-1">•</span><span className="font-medium mr-1 text-gray-700">64</span> connections</div> </div> <div className="flex items-center space-x-1"> <button className="p-2 hover:bg-gray-100 rounded-md flex items-center text-gray-600"><Download className="h-4 w-4 mr-1" />Export</button> <button className="p-2 hover:bg-gray-100 rounded-md flex items-center text-gray-600"><Share2 className="h-4 w-4 mr-1" />Share</button> <button className="p-2 hover:bg-gray-100 rounded-md text-gray-600"><Filter className="h-4 w-4" /></button> </div> </div> <div className="flex-1 relative overflow-hidden"> <div className="absolute inset-0 flex items-center justify-center p-10"> <svg width="100%" height="100%" viewBox="0 0 400 300" className="opacity-50"> <circle cx="200" cy="150" r="20" fill="#4A90E2" /> <text x="200" y="155" textAnchor="middle" fill="white" fontSize="10">AH</text> <line x1="200" y1="150" x2="100" y2="100" stroke="#4A4A4A" strokeWidth="2" /> <circle cx="100" cy="100" r="15" fill="#9B59B6" /> <text x="100" y="105" textAnchor="middle" fill="white" fontSize="8">NO</text> <line x1="200" y1="150" x2="300" y2="100" stroke="#4A4A4A" strokeWidth="3" strokeDasharray="4 2"/> <circle cx="300" cy="100" r="18" fill="#F5A623" /> <text x="300" y="105" textAnchor="middle" fill="white" fontSize="9">ADB</text> <line x1="200" y1="150" x2="150" y2="220" stroke="#9B9B9B" strokeWidth="1" /> <circle cx="150" cy="220" r="12" fill="#50E3C2" /> <text x="150" y="225" textAnchor="middle" fill="white" fontSize="7">UAE</text> <line x1="200" y1="150" x2="250" y2="220" stroke="#4A4A4A" strokeWidth="2" /> <circle cx="250" cy="220" r="15" fill="#4A90E2" /> <text x="250" y="225" textAnchor="middle" fill="white" fontSize="8">X</text> <text x="200" y="280" textAnchor="middle" fill="#9B9B9B" fontSize="12"> Interactive network visualization placeholder </text> <text x="200" y="295" textAnchor="middle" fill="#9B9B9B" fontSize="10"> Showing connections for {selectedEntity?.name || 'selected entity'} over past {timeRange} </text> </svg> </div> <div className="absolute bottom-4 left-4 bg-white p-3 rounded-lg shadow-md border border-gray-200"> <h3 className="font-medium text-sm mb-2">Legend</h3> <div className="space-y-1 text-xs"> <div className="flex items-center"><div className="h-3 w-3 rounded-full bg-blue-500 mr-2 border border-blue-600"></div><span>Individual</span></div> <div className="flex items-center"><div className="h-3 w-3 rounded-full bg-purple-500 mr-2 border border-purple-600"></div><span>Organization</span></div> <div className="flex items-center"><div className="h-3 w-3 rounded-full bg-green-500 mr-2 border border-green-600"></div><span>Location</span></div> <div className="h-px bg-gray-200 my-1"></div> <div className="flex items-center"><div className="h-1 w-6 bg-gray-400 mr-2 rounded"></div><span>Weak Connection</span></div> <div className="flex items-center"><div className="h-1 w-6 bg-gray-600 mr-2 rounded"></div><span>Medium Connection</span></div> <div className="flex items-center"><div className="h-1 w-6 bg-gray-800 mr-2 rounded"></div><span>Strong Connection</span></div> </div> </div> </div> </main> {selectedEntity ? ( <aside className="w-80 bg-white border-l border-gray-200 overflow-y-auto"> <div className="p-4 border-b border-gray-200"> <div className="flex items-start justify-between"> <div> <h2 className="font-bold text-lg">{selectedEntity.name}</h2> <p className="text-sm text-gray-600">{selectedEntity.role}</p> </div> <div className="flex flex-col items-end flex-shrink-0 ml-2"> <span className={`px-2 py-1 rounded-full text-xs font-medium ${ selectedEntity.riskScore === "Low" ? "bg-green-100 text-green-800" : selectedEntity.riskScore === "Medium" ? "bg-yellow-100 text-yellow-800" : "bg-red-100 text-red-800" }`}> {selectedEntity.riskScore} Risk </span> <span className="text-sm text-gray-500 mt-1">{selectedEntity.connections} connections</span> </div> </div> <p className="mt-3 text-sm text-gray-700">{selectedEntity.bio}</p> <div className="flex mt-3 space-x-2"> <button className="px-3 py-1 bg-blue-100 text-blue-700 rounded-md text-sm flex items-center hover:bg-blue-200 transition duration-150"><UserPlus className="h-3 w-3 mr-1" />Add to Watchlist</button> <button className="px-3 py-1 bg-gray-100 text-gray-700 rounded-md text-sm flex items-center hover:bg-gray-200 transition duration-150"><ExternalLink className="h-3 w-3 mr-1" />Full Profile</button> </div> </div> <div className="p-4 border-b border-gray-200"> <h3 className="font-medium mb-2 text-sm">Recent Activities</h3> <ul className="space-y-3"> {selectedEntity.recentActivities.map((activity, index) => ( <li key={index} className="text-sm"> <div className="flex justify-between items-center"> <span className="font-medium text-gray-800">{activity.type}</span> <span className="text-xs text-gray-500">{activity.date}</span> </div> <p className="text-gray-600 mt-0.5">{activity.description}</p> </li> ))} </ul> </div> <div className="p-4 border-b border-gray-200"> <h3 className="font-medium mb-2 text-sm">Key Connections</h3> <ul className="space-y-3"> {selectedEntity.keyConnections.map((connection, index) => ( <li key={index} className="p-2 bg-gray-50 rounded-md border border-gray-100"> <div className="flex justify-between items-start"> <div> <p className="font-medium text-sm text-gray-800">{connection.name}</p> <p className="text-xs text-gray-600">{connection.role}</p> </div> <span className={`text-xs font-medium px-1.5 py-0.5 rounded ${ connection.strength === "Strong" ? "text-blue-700 bg-blue-100" : connection.strength === "Medium" ? "text-purple-700 bg-purple-100" : "text-gray-600 bg-gray-100" }`}> {connection.strength} </span> </div> </li> ))} </ul> </div> <div className="p-4"> <h3 className="font-medium mb-2 text-sm flex items-center"><Zap className="h-4 w-4 mr-1.5 text-indigo-500"/>AI-Powered Insights</h3> <div className="space-y-3 text-sm"> <div className="p-2 bg-indigo-50 border border-indigo-100 rounded"> <p className="font-medium text-indigo-800">Predicted Action:</p> <p className="text-indigo-700">High likelihood (70%) of announcing new trade deal within 3 months based on recent travel and communication patterns.</p> </div> <div className="p-2 bg-orange-50 border border-orange-100 rounded"> <p className="font-medium text-orange-800">Vulnerability Assessment:</p> <p className="text-orange-700">Moderate exposure to fluctuations in global energy prices due to reliance on [Sector Y].</p> </div> <div className="p-2 bg-gray-50 border border-gray-100 rounded"> <p className="font-medium text-gray-800">Influence Network:</p> <p className="text-gray-700">Identified 5 second-degree connections with significant political influence in [Region Z].</p> <button className="text-xs text-blue-600 hover:underline mt-1">Explore Influence</button> </div> </div> </div> </aside> ) : ( <aside className="w-80 bg-white border-l border-gray-200 flex items-center justify-center"> <p className="text-gray-500 text-sm p-4 text-center">Select an entity from the network to view details.</p> </aside> )} </div> </div> );
};
const DashboardUI = ({ navigateTo }) => {
    const [selectedRegion, setSelectedRegion] = useState('All Regions');
    const [selectedCountry, setSelectedCountry] = useState(''); // New state for country filter
    // Update available countries when region changes
    const availableCountries = selectedRegion && selectedRegion !== 'All Regions' ? countriesByRegion[selectedRegion] || [] : allCountries;
    useEffect(() => { setSelectedCountry(''); }, [selectedRegion]); // Reset country when region changes

     return (
    <div className="flex-1 overflow-auto p-6">
      {/* Header and Filters */}
      <div className="flex flex-wrap justify-between items-center mb-6 gap-y-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Intelligence Dashboard</h1>
          <p className="text-gray-600">
             Displaying insights for: <span className="font-medium text-blue-700">{selectedCountry || selectedRegion}</span>
          </p>
        </div>
        {/* Geographic Scope Filters */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-4">
           <div className="relative">
                <label htmlFor="region-select" className="sr-only">Region</label>
                <select
                    id="region-select"
                    value={selectedRegion}
                    onChange={(e) => setSelectedRegion(e.target.value)}
                    className="bg-white border border-gray-300 rounded-md py-2 pl-3 pr-8 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
                >
                    {regions.map(region => ( <option key={region} value={region}>{region}</option> ))}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
            </div>
             <div className="relative">
                 <label htmlFor="country-select" className="sr-only">Country</label>
                <select
                    id="country-select"
                    value={selectedCountry}
                    onChange={(e) => setSelectedCountry(e.target.value)}
                    disabled={selectedRegion === 'All Regions'}
                    className="bg-white border border-gray-300 rounded-md py-2 pl-3 pr-8 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                    <option value="">All Countries in Region</option>
                    {availableCountries.map(country => ( <option key={country} value={country}>{country}</option> ))}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
            </div>
            {/* TODO: Add City/District filter if needed */}
            <button className="flex items-center bg-white border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm text-gray-700 hover:bg-gray-50">
                <Filter className="h-4 w-4 mr-1.5 text-gray-500" /> More Filters
            </button>
        </div>
      </div>

      {/* Dashboard grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
         <div className="lg:col-span-2 space-y-6">
             {/* Stability Map */}
             <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                 <div className="flex justify-between items-center mb-4"> <h2 className="font-bold text-lg text-gray-800">Stability Index - {selectedCountry || selectedRegion}</h2> <button onClick={() => navigateTo('geospatial')} className="text-blue-600 text-sm font-medium hover:underline">Geospatial View</button> </div>
                 <div className="flex items-center justify-center h-48 bg-gray-100 rounded-md border border-gray-200 mb-4"> <Map className="h-16 w-16 text-gray-400" /> <p className="text-gray-500 ml-4">Interactive stability map placeholder</p> </div>
                 <div className="grid grid-cols-3 gap-4 text-center"> <div className="bg-red-50 p-3 rounded-md border border-red-100"> <p className="text-sm text-red-700 font-medium">High Risk</p> <p className="font-bold text-red-900 text-lg">{selectedCountry ? '2 Zones' : '4 Countries'}</p></div> <div className="bg-yellow-50 p-3 rounded-md border border-yellow-100"> <p className="text-sm text-yellow-700 font-medium">Medium Risk</p> <p className="font-bold text-yellow-900 text-lg">{selectedCountry ? '5 Zones' : '12 Countries'}</p></div> <div className="bg-green-50 p-3 rounded-md border border-green-100"> <p className="text-sm text-green-700 font-medium">Low Risk</p> <p className="font-bold text-green-900 text-lg">{selectedCountry ? '3 Zones' : '18 Countries'}</p></div> </div>
             </div>
             {/* Economic Trends */}
             <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                 <div className="flex justify-between items-center mb-4"> <h2 className="font-bold text-lg text-gray-800">Economic Trends - {selectedCountry || selectedRegion}</h2> <button className="text-blue-600 text-sm font-medium hover:underline">View Details</button> </div>
                 <div className="flex items-center justify-center h-48 bg-gray-100 rounded-md border border-gray-200 mb-4"> <BarChart className="h-16 w-16 text-gray-400" /> <p className="text-gray-500 ml-4">Economic indicators chart placeholder</p> </div>
                 <div className="grid grid-cols-3 gap-4"> <div className="p-3 border-l-4 border-green-500 bg-green-50/50"> <p className="text-sm text-gray-600">GDP Growth</p> <p className="font-bold text-lg text-green-700">+{selectedCountry ? '5.1%' : '3.7%'}</p> </div> <div className="p-3 border-l-4 border-red-500 bg-red-50/50"> <p className="text-sm text-gray-600">Inflation</p> <p className="font-bold text-lg text-red-700">{selectedCountry ? '8.2%' : '5.2%'}</p> </div> <div className="p-3 border-l-4 border-blue-500 bg-blue-50/50"> <p className="text-sm text-gray-600">FDI (YoY)</p> <p className="font-bold text-lg text-blue-700">{selectedCountry ? '$1.8B' : '$24.5B'}</p> </div> </div>
             </div>
         </div>
         <div className="lg:col-span-1 space-y-6">
             {/* Risk Forecast Placeholder */}
             <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                 <div className="flex justify-between items-center mb-3"> <h2 className="font-bold text-lg text-gray-800 flex items-center"><TrendingUp className="h-5 w-5 mr-2 text-purple-600"/>Risk Forecast</h2> <button onClick={() => navigateTo('scenario')} className="text-blue-600 text-sm font-medium hover:underline">Scenario Planning</button> </div>
                 <div className="space-y-3 text-sm"> <div className="flex items-center justify-between p-2 bg-red-50 rounded"><span>[Country A] Election Uncertainty</span><span className="font-medium text-red-700">High Risk (Next 3m)</span></div> <div className="flex items-center justify-between p-2 bg-yellow-50 rounded"><span>[Region Y] Drought Impact</span><span className="font-medium text-yellow-700">Medium Risk (Next 6m)</span></div> <div className="flex items-center justify-between p-2 bg-green-50 rounded"><span>[Sector Z] Investment Growth</span><span className="font-medium text-green-700">Positive Outlook (1y)</span></div> </div>
             </div>
             {/* Anomaly Detection Placeholder */}
             <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                 <div className="flex justify-between items-center mb-3"> <h2 className="font-bold text-lg text-gray-800 flex items-center"><AlertCircle className="h-5 w-5 mr-2 text-orange-600"/>Detected Anomalies</h2> <button onClick={() => navigateTo('alerts')} className="text-blue-600 text-sm font-medium hover:underline">View All Alerts</button> </div>
                 <div className="space-y-3 text-sm"> <div className="border-l-4 border-orange-400 pl-2 py-1"> <p className="font-medium">Unusual Commodity Price Spike</p><p className="text-gray-600">[Commodity X] price increased 15% in 24h.</p></div> <div className="border-l-4 border-orange-400 pl-2 py-1"> <p className="font-medium">Abnormal Network Traffic</p><p className="text-gray-600">Detected unusual traffic patterns targeting financial institutions in [City C].</p></div> </div>
             </div>
             {/* Key Individuals/Orgs (Simplified) */}
             <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                 <div className="flex justify-between items-center mb-4"> <h2 className="font-bold text-lg text-gray-800">Key Entities</h2> <button onClick={() => navigateTo('network')} className="text-blue-600 text-sm font-medium hover:underline">Explore Network</button> </div>
                 <ul className="space-y-3"> {[{ name: "Ahmed Hassan", role: "Egyptian FinMin" }, { name: "African Dev Bank", role: "Financial Inst." }].map((entity, index) => ( <li key={index} className="flex items-center p-2 -m-2 hover:bg-gray-50 rounded-md cursor-pointer" onClick={() => navigateTo('network')}> <div className={`h-9 w-9 rounded-lg mr-2.5 flex items-center justify-center text-white font-semibold text-xs ${index === 0 ? 'bg-blue-500' : 'bg-purple-500'}`}> {index === 0 ? <User className="h-4 w-4"/> : <Building className="h-4 w-4"/>} </div> <div> <p className="font-medium text-sm text-gray-800">{entity.name}</p> <p className="text-xs text-gray-600">{entity.role}</p> </div> </li> ))} <button className="text-xs text-blue-600 hover:underline mt-1">View More...</button></ul>
             </div>
         </div>
      </div>
      {/* Latest reports table (keep existing) */}
       <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 overflow-x-auto"> <div className="flex justify-between items-center mb-4"> <h2 className="font-bold text-lg text-gray-800">Latest Intelligence Reports</h2> <button onClick={() => navigateTo('report')} className="text-blue-600 text-sm font-medium hover:underline">Browse All Reports</button> </div> <table className="w-full min-w-[600px] text-sm"> <thead> <tr className="border-b border-gray-200 text-left text-xs text-gray-500 uppercase tracking-wider"> <th className="py-3 font-medium">Report Title</th> <th className="py-3 font-medium">Region</th> <th className="py-3 font-medium">Category</th> <th className="py-3 font-medium">Date</th> <th className="py-3 font-medium">Confidence</th> <th className="py-3 font-medium text-right">Action</th> </tr> </thead> <tbody> {[{ title: "East African Infrastructure Development", region: "East Africa", category: "Infrastructure", date: "Apr 1, 2025", confidence: "High", confColor: "green" }, { title: "Middle East Energy Transition Analysis", region: "Middle East", category: "Energy", date: "Mar 29, 2025", confidence: "High", confColor: "green" }, { title: "West African Security Situation", region: "West Africa", category: "Security", date: "Mar 27, 2025", confidence: "Medium", confColor: "yellow" }, { title: "Egyptian Economic Reforms Impact", region: "North Africa", category: "Economy", date: "Mar 25, 2025", confidence: "High", confColor: "green" }].map((report, index) => { const confColorClasses = { green: 'bg-green-100 text-green-800', yellow: 'bg-yellow-100 text-yellow-800', red: 'bg-red-100 text-red-800' }; return ( <tr key={index} className="border-b border-gray-100 hover:bg-gray-50"> <td className="py-3 pr-3 font-medium text-gray-800">{report.title}</td> <td className="py-3 pr-3 text-gray-600">{report.region}</td> <td className="py-3 pr-3 text-gray-600">{report.category}</td> <td className="py-3 pr-3 text-gray-600">{report.date}</td> <td className="py-3 pr-3"><span className={`px-2 py-0.5 ${confColorClasses[report.confColor]} rounded-full text-xs font-medium`}>{report.confidence}</span></td> <td className="py-3 text-right"><button onClick={() => navigateTo('report')} className="text-blue-600 hover:underline font-medium">View</button></td> </tr> ); })} </tbody> </table> </div>
    </div>
  );
};
const ReportGenerationInterface = ({ navigateBack }) => {
    const [reportType, setReportType] = useState('comprehensive');
    // State for geographic selection
    const [selectedRegion, setSelectedRegion] = useState('East Africa');
    const [selectedCountry, setSelectedCountry] = useState('Kenya');
    const [selectedCity, setSelectedCity] = useState('');
    // State for other selections
    const [selectedTopics, setSelectedTopics] = useState(['Economic Development', 'Foreign Investment']);
    const [selectedEntities, setSelectedEntities] = useState(['African Development Bank']);
    const [includeOptions, setIncludeOptions] = useState({ executiveSummary: true, dataVisualizations: true, riskAssessment: true, recommendations: true, historicalContext: false, entityProfiles: true });

    // Filter options based on selections
    const availableCountries = selectedRegion && selectedRegion !== 'All Regions' ? countriesByRegion[selectedRegion] || [] : [];
    const availableCities = selectedCountry ? citiesByCountry[selectedCountry] || [] : [];

    const toggleSelection = (item, list, setter) => { if (list.includes(item)) { setter(list.filter(i => i !== item)); } else { setter([...list, item]); } };

    return (
        <div className="flex flex-col h-full bg-gray-50 text-gray-900">
        <header className="bg-white border-b border-gray-200 p-4 flex items-center justify-between sticky top-0 z-10">
            <div className="flex items-center"> <button onClick={navigateBack} className="mr-2 p-1 rounded hover:bg-gray-100"> <ChevronLeft className="h-5 w-5 text-gray-600" /> </button> <h1 className="text-xl font-bold">Generate Intelligence Report</h1> </div>
            <div className="flex items-center space-x-3"> <button className="px-3 py-1.5 border border-gray-300 rounded-md flex items-center text-sm text-gray-700 hover:bg-gray-50"> <Layers className="h-4 w-4 mr-1.5 text-gray-500" /> Load Template </button> <button className="px-3 py-1.5 border border-gray-300 rounded-md flex items-center text-sm text-gray-700 hover:bg-gray-50"> <Save className="h-4 w-4 mr-1.5 text-gray-500" /> Save as Template </button> <button className="px-3 py-1.5 bg-blue-600 text-white rounded-md font-medium flex items-center text-sm hover:bg-blue-700"> <Send className="h-4 w-4 mr-1.5" /> Generate Report </button> </div>
        </header>
        <div className="flex flex-1 overflow-hidden">
            {/* Configuration panel */}
            <div className="w-2/3 p-6 overflow-y-auto border-r border-gray-200">
            <div className="mb-8"> <label htmlFor="reportTitle" className="block text-lg font-bold mb-2 text-gray-800">Report Title</label> <input id="reportTitle" type="text" placeholder="Enter a descriptive title for your report" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none" defaultValue="East African Economic Development Analysis"/> </div>
            <div className="mb-8"> <h2 className="text-lg font-bold mb-4 text-gray-800">Report Type</h2> <div className="grid grid-cols-1 md:grid-cols-2 gap-4"> {reportTypes.map(type => ( <div key={type.id} className={`p-4 border rounded-lg cursor-pointer transition-all duration-150 ${reportType === type.id ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500' : 'border-gray-200 hover:bg-gray-100 hover:border-gray-300'}`} onClick={() => setReportType(type.id)}> <div className="flex items-center justify-between mb-1"> <h3 className="font-medium text-gray-800">{type.name}</h3> {reportType === type.id && <Check className="h-5 w-5 text-blue-600" />} </div> <p className="text-sm text-gray-600">{type.description}</p> </div> ))} </div> </div>

            {/* Enhanced Geographic Focus */}
            <div className="mb-8 p-4 border border-gray-200 rounded-lg bg-white">
                <h2 className="text-lg font-bold mb-4 text-gray-800">Geographic Focus</h2>
                 <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                     <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Region</label>
                        <select value={selectedRegion} onChange={e => {setSelectedRegion(e.target.value); setSelectedCountry(''); setSelectedCity('');}} className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500">
                             {regions.map(r => <option key={r} value={r}>{r}</option>)}
                        </select>
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                        <select value={selectedCountry} onChange={e => {setSelectedCountry(e.target.value); setSelectedCity('');}} disabled={!selectedRegion || selectedRegion === 'All Regions'} className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100">
                            <option value="">-- Select Country --</option>
                            {availableCountries.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">City / District</label>
                        <select value={selectedCity} onChange={e => setSelectedCity(e.target.value)} disabled={!selectedCountry} className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100">
                             <option value="">-- Select City/District (Optional) --</option>
                             {availableCities.map(ci => <option key={ci} value={ci}>{ci}</option>)}
                        </select>
                    </div>
                 </div>
                 <p className="text-xs text-gray-500 mt-2">Select the primary geographic scope for the report.</p>
            </div>

            <div className="mb-8"> <div className="flex items-center justify-between mb-4"> <h2 className="text-lg font-bold text-gray-800">Topics & Areas of Focus</h2> <button className="flex items-center text-blue-600 text-sm font-medium hover:underline"> <Plus className="h-4 w-4 mr-1" /> Add Custom Topic </button> </div> <div className="flex flex-wrap gap-2"> {reportTopics.map(topic => ( <div key={topic} className={`py-1 px-3 rounded-full cursor-pointer text-sm transition-all duration-150 ${ selectedTopics.includes(topic) ? 'bg-blue-600 text-white font-medium' : 'bg-gray-100 text-gray-700 hover:bg-gray-200' }`} onClick={() => toggleSelection(topic, selectedTopics, setSelectedTopics)}> {topic} </div> ))} </div> </div>
            <div className="mb-8"> <div className="flex items-center justify-between mb-4"> <h2 className="text-lg font-bold text-gray-800">Include Specific Entities</h2> <button className="flex items-center text-blue-600 text-sm font-medium hover:underline"> <Plus className="h-4 w-4 mr-1" /> Add Entity </button> </div> <div className="flex flex-wrap gap-2"> {reportEntities.map(entity => ( <div key={entity} className={`py-1 px-3 rounded-full cursor-pointer flex items-center text-sm transition-all duration-150 ${ selectedEntities.includes(entity) ? 'bg-purple-100 text-purple-700 font-medium' : 'bg-gray-100 text-gray-700 hover:bg-gray-200' }`} onClick={() => toggleSelection(entity, selectedEntities, setSelectedEntities)}> {entity} {selectedEntities.includes(entity) && ( <button onClick={(e) => { e.stopPropagation(); toggleSelection(entity, selectedEntities, setSelectedEntities); }} className="ml-1.5 p-0.5 rounded hover:bg-purple-200"> <Trash2 className="h-3 w-3 text-purple-600" /> </button> )} </div> ))} </div> </div>
            <div className="mb-8"> <h2 className="text-lg font-bold mb-4 text-gray-800">Time Frame</h2> <div className="flex items-center space-x-4"> <div className="flex-1"> <label className="block text-sm font-medium text-gray-700 mb-1">From</label> <input type="date" className="w-full p-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-400 focus:border-blue-400 outline-none text-sm" defaultValue="2024-10-01"/> </div> <div className="flex-1"> <label className="block text-sm font-medium text-gray-700 mb-1">To</label> <input type="date" className="w-full p-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-400 focus:border-blue-400 outline-none text-sm" defaultValue="2025-04-01"/> </div> </div> </div>
            <div> <h2 className="text-lg font-bold mb-4 text-gray-800">Data Sources</h2> <div className="space-y-3 text-sm"> {[ { id: 'news', label: 'News Sources (120+ outlets)', checked: true }, { id: 'economic', label: 'Economic Indicators', checked: true }, { id: 'social', label: 'Social Media Analysis', checked: true }, { id: 'govt', label: 'Government Publications', checked: true }, { id: 'satellite', label: 'Satellite Imagery', checked: false }, { id: 'proprietary', label: 'Proprietary Network Data', checked: true }, ].map(source => ( <div key={source.id} className="flex items-center"> <input type="checkbox" id={source.id} className="mr-3 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" defaultChecked={source.checked} /> <label htmlFor={source.id} className="text-gray-700">{source.label}</label> </div> ))} </div> </div>
            </div>
            {/* Preview panel */}
            <div className="w-1/3 bg-white p-6 overflow-y-auto"> <h2 className="text-lg font-bold mb-4 text-gray-800">Report Preview & Options</h2> <div className="mb-6"> <div className="border border-gray-200 rounded-lg p-4 mb-4 bg-gray-50/50"> <h3 className="font-medium mb-3 text-gray-800">Report Structure</h3> <div className="space-y-2 text-sm"> {[ { id: 'exec-summary', label: 'Executive Summary', key: 'executiveSummary', estimate: '1-2 pages' }, { id: 'visualizations', label: 'Data Visualizations', key: 'dataVisualizations', estimate: '3-5 charts' }, { id: 'risk', label: 'Risk Assessment', key: 'riskAssessment', estimate: '2-3 pages' }, { id: 'recommendations', label: 'Recommendations', key: 'recommendations', estimate: '1-2 pages' }, { id: 'historical', label: 'Historical Context', key: 'historicalContext', estimate: '2-3 pages' }, { id: 'profiles', label: 'Entity Profiles', key: 'entityProfiles', estimate: '1 page each' }, ].map(option => ( <div key={option.id} className="flex items-center justify-between"> <div className="flex items-center"> <input type="checkbox" id={option.id} className="mr-2 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" checked={includeOptions[option.key]} onChange={() => setIncludeOptions({...includeOptions, [option.key]: !includeOptions[option.key]})} /> <label htmlFor={option.id} className="text-gray-700">{option.label}</label> </div> <span className="text-xs text-gray-500">{option.estimate}</span> </div> ))} </div> </div> <div className="border border-gray-200 rounded-lg p-4 mb-4 bg-gray-50/50"> <h3 className="font-medium mb-3 text-gray-800">Visualization Types</h3> <div className="grid grid-cols-2 gap-3"> {[ { icon: PieChart, label: 'Sector Distribution' }, { icon: BarChart, label: 'Trend Analysis' }, { icon: Map, label: 'Geographic Heatmap' }, { icon: Layers, label: 'Network Graph' }, ].map((viz, index) => ( <div key={index} className="border border-gray-200 rounded-md p-3 flex flex-col items-center justify-center text-center bg-white"> <viz.icon className="h-6 w-6 text-gray-500 mb-1" /> <span className="text-xs text-gray-600">{viz.label}</span> </div> ))} </div> <p className="text-xs text-gray-500 mt-3">Selected visualizations will be automatically included based on data relevance.</p> </div> <div className="border border-gray-200 rounded-lg p-4 bg-gray-50/50"> <h3 className="font-medium mb-3 text-gray-800">Export Options</h3> <div className="space-y-2"> <button className="w-full flex items-center justify-center px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-100 bg-white"> <Download className="h-4 w-4 mr-2 text-gray-500" /> Download as PDF </button> <button className="w-full flex items-center justify-center px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-100 bg-white"> <Download className="h-4 w-4 mr-2 text-gray-500" /> Download as DOCX </button> <button className="w-full flex items-center justify-center px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-100 bg-white"> <Share2 className="h-4 w-4 mr-2 text-gray-500" /> Share Link </button> </div> </div> </div> </div>
        </div>
        </div>
    );
};

// --- Main Application Component ---
function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [isAiHelperOpen, setIsAiHelperOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false); // State for user menu dropdown

  const navigate = (page) => {
    console.log(`[App navigate] Navigating to: ${page}`);
    setCurrentPage(page);
    setIsUserMenuOpen(false); // Close menu on navigation
  };

  // --- Main View Rendering ---
  const renderMainView = () => {
    console.log("[App Render] Rendering Main View for page:", currentPage);
    switch (currentPage) {
      case 'network': return <EntityNetworkVisualization navigateBack={() => navigate('dashboard')} />;
      case 'report': return <ReportGenerationInterface navigateBack={() => navigate('dashboard')} />;
      case 'profile': return <UserProfilePage navigateBack={() => navigate('dashboard')} />;
      case 'settings': return <AccountSettingsPage navigateBack={() => navigate('dashboard')} />;
      case 'alerts': return <AlertsPage navigateBack={() => navigate('dashboard')} />;
      case 'geospatial': return <GeospatialPage navigateBack={() => navigate('dashboard')} />;
      case 'scenario': return <ScenarioPlanningPage navigateBack={() => navigate('dashboard')} />;
      case 'dashboard': default:
         if (!['dashboard', 'network', 'report', 'profile', 'settings', 'alerts', 'geospatial', 'scenario'].includes(currentPage)) {
             console.warn("[App Render] Invalid page requested:", currentPage, "Defaulting to dashboard.");
             return <DashboardUI navigateTo={navigate} />;
         }
        return <DashboardUI navigateTo={navigate} />;
    }
  };

  // --- SIDEBAR CONFIG ---
  // Reorganized Navigation Structure
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutGrid, page: 'dashboard' }, // Changed icon
    { type: 'divider', id: 'div1'}, // Divider
    { type: 'header', id: 'analysis_header', label: 'Analysis Tools'},
    { id: 'geospatial', label: 'Geospatial Analysis', icon: Map, page: 'geospatial' },
    { id: 'network', label: 'Network Analysis', icon: Share, page: 'network' }, // Changed icon
    { id: 'scenario', label: 'Scenario Planning', icon: Shuffle, page: 'scenario' },
    { type: 'divider', id: 'div2'}, // Divider
    { id: 'alerts', label: 'Alerts', icon: Bell, page: 'alerts'},
    { id: 'reports', label: 'Reports', icon: Layers, page: 'report' },
  ];

  // --- Render Main App Layout ---
  console.log("[App Render] Rendering Main Layout");
  return (
    <div className="flex h-screen bg-gray-100 font-sans relative">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col flex-shrink-0 z-10">
         <div className="h-16 flex items-center justify-center px-4 border-b border-gray-200 bg-blue-800 text-white flex-shrink-0">
             <Globe className="h-6 w-6 mr-2" />
             <h1 className="text-xl font-bold">Savannah Intel</h1>
         </div>
         <div className="p-4 border-b border-gray-200">
            <div className="relative">
              <input type="text" placeholder="Search..." className="w-full bg-gray-100 rounded-md pl-8 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm border border-gray-200" />
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
            </div>
         </div>
        <nav className="flex-1 p-4 overflow-y-auto">
          <ul className="space-y-1">
            {navItems.map(item => {
               if (item.type === 'divider') {
                   return <hr key={item.id} className="my-3 border-gray-200" />;
               }
               if (item.type === 'header') {
                   return <h2 key={item.id} className="px-2 pt-2 pb-1 text-xs font-semibold text-gray-500 uppercase tracking-wider">{item.label}</h2>;
               }
               // Default: Navigation Button
               return (
                  <li key={item.id}>
                    <button
                      onClick={() => navigate(item.page)}
                      className={`w-full flex items-center text-left p-2 rounded-md text-sm transition-colors duration-150 ${
                        currentPage === item.page ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <item.icon className={`h-4 w-4 mr-3 flex-shrink-0 ${currentPage === item.page ? 'text-blue-600' : 'text-gray-500'}`} />
                      {item.label}
                       {item.id === 'alerts' && <span className="ml-auto text-xs bg-red-500 text-white rounded-full px-1.5 py-0.5 font-semibold">3</span>}
                    </button>
                  </li>
               );
            })}
          </ul>
        </nav>
        {/* Footer User Area */}
        <div className="p-3 border-t border-gray-200 mt-auto flex-shrink-0 relative">
           <button onClick={() => navigate('report')} className="w-full mb-3 bg-blue-600 text-white rounded-md p-2 flex items-center justify-center text-sm hover:bg-blue-700 transition duration-150">
                <Plus className="h-4 w-4 mr-2" /> Create New Report
            </button>
           {/* User Info Button */}
           <button
             onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
             className="w-full flex items-center p-2 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-400"
            >
               <div className="h-8 w-8 rounded-full bg-gradient-to-br from-gray-300 to-gray-400 mr-2 flex-shrink-0 flex items-center justify-center text-gray-600 font-semibold"> DU </div>
               <div className="flex-1 overflow-hidden whitespace-nowrap text-left">
                   <span className="text-sm font-medium text-gray-700 block truncate">Demo User</span>
                   <span className="text-xs text-gray-500 block truncate">Default Org</span>
               </div>
               <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform duration-200 ${isUserMenuOpen ? 'rotate-180' : ''}`} />
           </button>
           {/* User Menu Dropdown */}
           {isUserMenuOpen && (
               <div className="absolute bottom-full left-0 right-0 mb-1 bg-white border border-gray-200 rounded-md shadow-lg py-1 z-20">
                   <button onClick={() => navigate('profile')} className="w-full text-left px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100 flex items-center">
                       <User className="h-4 w-4 mr-2 text-gray-500"/> Profile
                   </button>
                   <button onClick={() => navigate('settings')} className="w-full text-left px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100 flex items-center">
                       <Settings className="h-4 w-4 mr-2 text-gray-500"/> Settings
                   </button>
                   {/* Add Sign Out here if auth is re-enabled */}
               </div>
           )}
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto bg-gray-50">
          {renderMainView()}
        </div>
      </main>

       {/* AI Helper Floating Button & Modal */}
       {!isAiHelperOpen && (
         <button onClick={() => setIsAiHelperOpen(true)} className="fixed bottom-6 right-6 bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-3 rounded-full shadow-lg hover:scale-110 transition-transform duration-150 z-40" title="Open AI Assistant">
            <BrainCircuit className="h-6 w-6" />
         </button>
       )}
       {isAiHelperOpen && <AIHelperChat onClose={() => setIsAiHelperOpen(false)} />}

    </div>
  );
}

export default App;
