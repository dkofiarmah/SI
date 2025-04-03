'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import DashboardHeader from '@/components/DashboardHeader';
import { 
  ChevronLeft, Download, Share2, Star, StarOff, Edit3, AlertTriangle,
  Clock, Calendar, User, Building, MapPin, Globe, Info, MessageSquare,
  BarChart, Check, ArrowLeft, ArrowRight, PieChart, TrendingUp, Target,
  Map
} from 'lucide-react';

// Define interfaces for type safety
interface Entity {
  name: string;
  type: string;
  relevance: string;
}

interface Risk {
  name: string;
  level: string;
  description: string;
}

interface Chart {
  type: string;
  title: string;
  data: string;
}

interface Section {
  title: string;
  content: string;
}

interface ReportContent {
  executiveSummary: string;
  keyFindings: string[];
  risks: Risk[];
  sections: Section[];
  charts: Chart[];
  recommendations: string[];
  entities: Entity[];
}

interface Report {
  id: string;
  title: string;
  type: string;
  region: string;
  country: string;
  date: string;
  author: string;
  authorDetails?: {
    name: string;
    role: string;
    avatar: null | string;
  };
  topics: string[];
  confidence: string;
  status: string;
  starred: boolean;
  summary: string;
  content?: ReportContent;
  relatedReports?: string[];
  lastUpdated?: string;
  version?: string;
}

// Mock reports data - ideally this would come from a data service
const mockReports: Report[] = [
  {
    id: 'report-001',
    title: 'Kenya Economic Outlook Q1 2025',
    type: 'economic',
    region: 'East Africa',
    country: 'Kenya',
    date: 'Apr 1, 2025',
    author: 'Analysis Team',
    authorDetails: { name: 'Analysis Team', role: 'Economic Intelligence Unit', avatar: null },
    topics: ['Economic Development', 'Foreign Investment'],
    confidence: 'High',
    status: 'Published',
    starred: true,
    summary: 'Comprehensive analysis of Kenyan economic trends for Q1 2025, including GDP growth projections, inflation analysis, and foreign investment outlook.',
    content: {
      executiveSummary: "Kenya's economy shows strong resilience entering Q1 2025, with GDP growth projected at 5.2% year-over-year. Inflation remains a concern at 6.8%, but appears to be stabilizing. Foreign direct investment has increased 15% compared to the previous quarter, with the technology and financial sectors attracting the most capital. The shilling has shown moderate volatility against major currencies.",
      keyFindings: [
        'GDP growth projected at 5.2%, outperforming regional average of 4.1%',
        'Inflation rate of 6.8%, driven primarily by food and energy prices',
        "Nairobi continues to strengthen its position as East Africa's financial hub",
        'Technology sector investment up 32% year-over-year',
        'Recent regulatory changes have improved business environment metrics'
      ],
      risks: [
        { name: 'Currency Volatility', level: 'Medium', description: 'The Kenyan shilling faces pressure against USD, potentially impacting import costs.' },
        { name: 'Inflation Persistence', level: 'Medium', description: 'Food and energy inflation may remain elevated due to global supply factors.' },
        { name: 'Regional Competition', level: 'Low', description: 'Rwanda and Tanzania are increasingly competitive for certain investments.' }
      ],
      sections: [
        { 
          title: 'Economic Growth Indicators',
          content: 'Kenya\'s GDP growth remains robust at 5.2%, supported by expansion in services, agriculture, and manufacturing sectors. Consumer spending has increased 3.1% quarter-over-quarter, signaling strong domestic demand. The services sector, particularly financial and tech services, contributed 62% of the growth.'
        },
        { 
          title: 'Investment Landscape',
          content: 'Foreign direct investment reached $240M in Q1 2025, with significant investment in technology startups, financial services, and renewable energy. Domestic investment also grew by 8.3%, particularly in infrastructure and housing. The Nairobi Securities Exchange reported a 12% increase in market capitalization.'
        },
        { 
          title: 'Sectoral Analysis',
          content: 'The technology sector continues its strong growth trajectory with a 18.2% year-over-year growth. Agriculture performance has improved with favorable weather conditions, showing a 4.5% growth. Manufacturing remains constrained by energy costs but still achieved 3.8% growth. Tourism has recovered strongly, reaching 85% of pre-pandemic levels.'
        }
      ],
      charts: [
        { type: 'bar', title: 'Sector Contribution to GDP Growth', data: 'mock-data-id-1' },
        { type: 'line', title: 'Inflation Rate Trends (24 Months)', data: 'mock-data-id-2' },
        { type: 'pie', title: 'FDI by Sector', data: 'mock-data-id-3' },
        { type: 'map', title: 'Regional Economic Development Zones', data: 'mock-data-id-4' }
      ],
      recommendations: [
        'Monitor inflation pressure points and prepare contingency measures',
        'Consider diversification strategies for export markets to reduce dependence on traditional partners',
        'Evaluate exposure to KES volatility for businesses with significant import costs',
        'Explore investment opportunities in high-growth technology and financial sectors',
        'Develop strategies to capitalize on Kenya\'s strengthening position in the East African Community'
      ],
      entities: [
        { name: 'Central Bank of Kenya', type: 'Government Institution', relevance: 'Key monetary policy decision-maker' },
        { name: 'Safaricom PLC', type: 'Corporate', relevance: 'Leading telecommunications provider and M-Pesa operator' },
        { name: 'Kenya Association of Manufacturers', type: 'Industry Body', relevance: 'Represents manufacturing sector interests' }
      ]
    },
    relatedReports: ['report-002', 'report-005'],
    lastUpdated: 'Apr 2, 2025',
    version: '1.0'
  },
  {
    id: 'report-002',
    title: 'Ethiopia Infrastructure Development',
    type: 'comprehensive',
    region: 'East Africa',
    country: 'Ethiopia',
    date: 'Mar 28, 2025',
    author: 'Infrastructure Team',
    topics: ['Infrastructure Projects', 'Economic Development'],
    confidence: 'Medium',
    status: 'Published',
    starred: false,
    summary: 'Detailed assessment of ongoing and planned infrastructure projects across Ethiopia, with focus on transportation networks and energy sector developments.'
  },
  {
    id: 'report-003',
    title: 'Lagos Security Situation',
    type: 'security',
    region: 'West Africa',
    country: 'Nigeria',
    date: 'Mar 25, 2025',
    author: 'Security Analysis Team',
    topics: ['Security Threats', 'Political Stability'],
    confidence: 'Medium',
    status: 'Published',
    starred: false,
    summary: 'Analysis of security conditions in Lagos metropolitan area, including threat assessment, stability factors, and recommendations for risk mitigation.'
  },
  {
    id: 'report-004',
    title: 'Egypt-Saudi Relations Outlook',
    type: 'comprehensive',
    region: 'North Africa',
    country: 'Egypt',
    date: 'Mar 22, 2025',
    author: 'Political Analysis Team',
    topics: ['Political Stability', 'Foreign Investment'],
    confidence: 'High',
    status: 'Published',
    starred: true,
    summary: 'Strategic assessment of Egypt-Saudi relations and implications for regional stability, economic collaboration, and geopolitical dynamics.'
  },
  {
    id: 'report-005',
    title: 'Safaricom PLC Entity Profile',
    type: 'entity',
    region: 'East Africa',
    country: 'Kenya',
    date: 'Mar 20, 2025',
    author: 'Corporate Intelligence Team',
    topics: ['Technology Adoption', 'Economic Development'],
    confidence: 'High',
    status: 'Published',
    starred: false,
    summary: 'Comprehensive profile of Safaricom PLC, including leadership analysis, financial position, market strategy, and regional expansion outlook.'
  }
];

export default function ReportDetail() {
  const params = useParams();
  const router = useRouter();
  const { id } = params;

  const [report, setReport] = useState<Report | null>(null);
  const [isStarred, setIsStarred] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [relatedReports, setRelatedReports] = useState<Report[]>([]);
  
  useEffect(() => {
    // Fetch report data - in a real app, this would be an API call
    const foundReport = mockReports.find(r => r.id === id);
    
    if (foundReport) {
      setReport(foundReport);
      setIsStarred(foundReport.starred);
      
      // Get related reports
      if (foundReport.relatedReports && foundReport.relatedReports.length > 0) {
        const related = mockReports.filter(r => 
          foundReport.relatedReports?.includes(r.id)
        );
        setRelatedReports(related);
      }
    }
  }, [id]);

  const toggleStar = () => {
    setIsStarred(!isStarred);
    // In a real app, you would update this on the backend
  };

  const handleBack = () => {
    router.push('/dashboard/reports');
  };

  const getConfidenceBadgeColor = (confidence: string): string => {
    switch (confidence) {
      case 'High':
        return 'text-green-700 bg-green-100';
      case 'Medium':
        return 'text-yellow-700 bg-yellow-100';
      case 'Low':
        return 'text-red-700 bg-red-100';
      default:
        return 'text-gray-700 bg-gray-100';
    }
  };

  const getStatusBadgeColor = (status: string): string => {
    switch (status) {
      case 'Published':
        return 'text-blue-700 bg-blue-100';
      case 'Draft':
        return 'text-gray-700 bg-gray-100';
      case 'In Review':
        return 'text-yellow-700 bg-yellow-100';
      default:
        return 'text-gray-700 bg-gray-100';
    }
  };

  const renderReportContent = () => {
    if (!report || !report.content) return null;

    switch(activeTab) {
      case 'overview':
        return (
          <div className="space-y-8">
            <section>
              <h2 className="text-xl font-bold text-gray-800 mb-4">Executive Summary</h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {report.content.executiveSummary}
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-800 mb-4">Key Findings</h2>
              <ul className="space-y-2">
                {report.content.keyFindings.map((finding, idx) => (
                  <li key={idx} className="flex items-start">
                    <span className="text-teal-500 mr-2 mt-1 flex-shrink-0">•</span>
                    <span className="text-gray-700">{finding}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-800 mb-4">Risk Assessment</h2>
              <div className="space-y-4">
                {report.content.risks.map((risk, idx) => (
                  <div key={idx} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-1">
                      <h3 className="font-semibold text-gray-800">{risk.name}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        risk.level === 'High' ? 'bg-red-100 text-red-700' :
                        risk.level === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {risk.level} Risk
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm">{risk.description}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="border-t border-gray-200 pt-8">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Data Visualizations</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {report.content.charts.map((chart, idx) => (
                  <div key={idx} className="border border-gray-200 rounded-lg overflow-hidden">
                    <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
                      <h3 className="font-medium text-gray-700">{chart.title}</h3>
                    </div>
                    <div className="p-4 h-60 bg-white flex items-center justify-center">
                      {chart.type === 'bar' && <BarChart className="h-32 w-32 text-gray-300" />}
                      {chart.type === 'line' && <TrendingUp className="h-32 w-32 text-gray-300" />}
                      {chart.type === 'pie' && <PieChart className="h-32 w-32 text-gray-300" />}
                      {chart.type === 'map' && <Map className="h-32 w-32 text-gray-300" />}
                      <p className="text-sm text-gray-400 ml-4">Chart visualization placeholder</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        );
      
      case 'details':
        return (
          <div className="space-y-8">
            {report.content.sections.map((section, idx) => (
              <section key={idx}>
                <h2 className="text-xl font-bold text-gray-800 mb-4">{section.title}</h2>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {section.content}
                </p>
              </section>
            ))}
          </div>
        );
      
      case 'recommendations':
        return (
          <div className="space-y-8">
            <section>
              <h2 className="text-xl font-bold text-gray-800 mb-4">Strategic Recommendations</h2>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <ul className="space-y-4">
                  {report.content.recommendations.map((recommendation, idx) => (
                    <li key={idx} className="flex items-start">
                      <Check className="h-5 w-5 text-teal-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{recommendation}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          </div>
        );
      
      case 'entities':
        return (
          <div className="space-y-8">
            <section>
              <h2 className="text-xl font-bold text-gray-800 mb-4">Key Entities</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {report.content.entities.map((entity, idx) => (
                  <div key={idx} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
                    <div className="flex items-start">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 mr-3 ${
                        entity.type === 'Corporate' ? 'bg-blue-100 text-blue-700' :
                        entity.type === 'Government Institution' ? 'bg-purple-100 text-purple-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {entity.type === 'Corporate' ? 
                          <Building className="h-5 w-5" /> :
                        entity.type === 'Government Institution' ? 
                          <Building className="h-5 w-5" /> :
                          <User className="h-5 w-5" />
                        }
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800">{entity.name}</h3>
                        <p className="text-sm text-gray-500">{entity.type}</p>
                        <p className="text-sm text-gray-600 mt-1">{entity.relevance}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-sm text-gray-500 mt-4">
                Click on any entity to view its full profile and network connections.
              </p>
            </section>
          </div>
        );

      default:
        return <div>Content not available</div>;
    }
  };

  if (!report) {
    return (
      <div className="p-6">
        <DashboardHeader
          title="Report Not Found"
          description="The report you're looking for doesn't exist or has been moved."
        >
          <button 
            onClick={handleBack}
            className="flex items-center text-teal-600 hover:text-teal-700 font-medium"
          >
            <ChevronLeft className="h-5 w-5 mr-1" />
            Back to Reports
          </button>
        </DashboardHeader>
        <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-12 text-center">
          <Info className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-6">The report you're looking for doesn't exist or has been moved.</p>
          <button 
            onClick={handleBack}
            className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 inline-flex items-center text-sm font-medium"
          >
            Return to Reports
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <DashboardHeader
        title={report.title}
        description={`${report.region}${report.country ? ` • ${report.country}` : ''} • ${report.date}`}
        showInfoTip
        infoTipContent="This report provides detailed intelligence analysis with verified data sources and expert insights."
      >
        <div className="flex items-center space-x-2">
          <button 
            onClick={handleBack}
            className="flex items-center text-teal-600 hover:text-teal-700 font-medium"
          >
            <ChevronLeft className="h-5 w-5 mr-1" />
            Back to Reports
          </button>
          <span className="text-gray-400">|</span>
          <div className="flex items-center">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getConfidenceBadgeColor(report.confidence)}`}>
              {report.confidence} Confidence
            </span>
          </div>
          <div className="flex items-center">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(report.status)}`}>
              {report.status}
            </span>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button 
            onClick={toggleStar}
            className={`p-2 rounded-full ${isStarred ? 'text-yellow-500 hover:text-yellow-600 bg-yellow-50' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'}`}
            title={isStarred ? "Remove from favorites" : "Add to favorites"}
          >
            {isStarred ? <Star className="h-5 w-5" /> : <StarOff className="h-5 w-5" />}
          </button>
          <Link 
            href={`/dashboard/report/${id}/edit`}
            className="p-2 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100"
            title="Edit report"
          >
            <Edit3 className="h-5 w-5" />
          </Link>
          <button 
            className="p-2 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100"
            title="Download report"
          >
            <Download className="h-5 w-5" />
          </button>
          <button 
            className="p-2 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100"
            title="Share report"
          >
            <Share2 className="h-5 w-5" />
          </button>
        </div>
      </DashboardHeader>

      <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden mb-8 mt-6">
        {/* Report author and last update info */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-wrap items-center text-sm text-gray-500 gap-x-4 gap-y-2">
            <div className="flex items-center">
              <User className="h-4 w-4 mr-1.5 text-gray-400" />
              {report.author}
            </div>
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1.5 text-gray-400" />
              Updated: {report.lastUpdated || report.date}
            </div>
          </div>
          <p className="mt-4 text-gray-700">{report.summary}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {report.topics.map((topic) => (
              <span 
                key={topic}
                className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs"
              >
                {topic}
              </span>
            ))}
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex px-6 -mb-px">
            {['Overview', 'Details', 'Recommendations', 'Entities'].map((tab) => {
              const tabValue = tab.toLowerCase();
              return (
                <button
                  key={tab}
                  className={`py-4 px-1 mr-8 border-b-2 font-medium text-sm ${
                    activeTab === tabValue
                      ? 'border-teal-500 text-teal-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                  onClick={() => setActiveTab(tabValue)}
                >
                  {tab}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Report Content */}
        <div className="p-6">
          {renderReportContent()}
        </div>
      </div>

      {/* Related Reports */}
      {relatedReports.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Related Reports</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {relatedReports.map(relatedReport => (
              <Link 
                key={relatedReport.id}
                href={`/dashboard/report/${relatedReport.id}`}
                className="bg-white shadow-sm rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow"
              >
                <h3 className="font-medium text-gray-800 mb-1">{relatedReport.title}</h3>
                <div className="flex items-center text-sm text-gray-500 mb-2">
                  <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                  <span>{relatedReport.date}</span>
                  <span className="mx-2">•</span>
                  <Globe className="h-4 w-4 mr-1 text-gray-400" />
                  <span>{relatedReport.region}</span>
                </div>
                <p className="text-sm text-gray-600 line-clamp-2">{relatedReport.summary}</p>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Report Navigate Footer */}
      <div className="flex justify-between">
        <button 
          onClick={handleBack}
          className="flex items-center text-gray-500 hover:text-gray-700"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Reports
        </button>
        <div className="flex space-x-4">
          <button className="flex items-center text-teal-600 hover:text-teal-700 font-medium">
            <ArrowLeft className="h-5 w-5 mr-2" />
            Previous Report
          </button>
          <button className="flex items-center text-teal-600 hover:text-teal-700 font-medium">
            Next Report
            <ArrowRight className="h-5 w-5 ml-2" />
          </button>
        </div>
      </div>
    </div>
  );
}