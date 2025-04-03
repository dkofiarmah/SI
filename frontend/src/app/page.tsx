import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Globe, Shield, BarChart3, Network, Map, AlertTriangle, BrainCircuit } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Navigation */}
      <header className="border-b border-gray-100">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Globe className="h-6 w-6 text-blue-600" />
            <span className="font-bold text-xl text-gray-900">Savannah Intel</span>
          </div>
          <nav className="hidden md:flex gap-8 text-sm font-medium">
            <a href="#features" className="text-gray-700 hover:text-blue-600 transition-colors">Features</a>
            <a href="#capabilities" className="text-gray-700 hover:text-blue-600 transition-colors">Capabilities</a>
            <a href="#insights" className="text-gray-700 hover:text-blue-600 transition-colors">Insights</a>
          </nav>
          <div className="flex items-center gap-3">
            <Link 
              href="/auth/login" 
              className="text-sm px-4 py-2 text-gray-700 hover:text-blue-600 transition-colors"
            >
              Log In
            </Link>
            <Link 
              href="/dashboard" 
              className="text-sm px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Dashboard
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="container mx-auto px-6 py-16 md:py-24">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-4">
              Intelligence for a <span className="text-blue-600">Complex World</span>
            </h1>
            <p className="text-lg text-gray-600 mb-8 max-w-lg">
              Comprehensive geospatial intelligence, risk assessment, and predictive analytics for regions across Africa and the Middle East.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                href="/dashboard" 
                className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Access Dashboard
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a 
                href="#features" 
                className="flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
              >
                Explore Features
              </a>
            </div>
            <div className="mt-8 text-sm text-gray-500 flex items-center">
              <span className="flex h-2 w-2 rounded-full bg-green-500 mr-2"></span>
              Updated with latest intelligence: April 2, 2025
            </div>
          </div>
          <div className="relative bg-white p-6 rounded-lg shadow-lg">
            <div className="aspect-video rounded-md overflow-hidden bg-gray-100 border border-gray-200">
              <Image 
                src="/dashboard-preview.jpg" 
                alt="Savannah Intel Dashboard" 
                width={800} 
                height={450} 
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Comprehensive Intelligence Platform</h2>
            <p className="text-lg text-gray-600">
              Leveraging advanced analytics, machine learning, and expert analysis to provide actionable intelligence.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-50 rounded-lg p-6 hover:shadow-md transition-shadow">
              <Map className="h-10 w-10 text-blue-600 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Geospatial Analysis</h3>
              <p className="text-gray-600">
                Interactive mapping with multi-layered data visualization, highlighting risk zones and opportunity areas.
              </p>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-6 hover:shadow-md transition-shadow">
              <AlertTriangle className="h-10 w-10 text-amber-500 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Alerts & Monitoring</h3>
              <p className="text-gray-600">
                Real-time intelligence alerts for security incidents, economic changes, and political developments.
              </p>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-6 hover:shadow-md transition-shadow">
              <BrainCircuit className="h-10 w-10 text-purple-600 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Scenario Planning</h3>
              <p className="text-gray-600">
                Advanced modeling tools to simulate potential outcomes and assess impacts across multiple domains.
              </p>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-6 hover:shadow-md transition-shadow">
              <Network className="h-10 w-10 text-green-600 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Network Analysis</h3>
              <p className="text-gray-600">
                Relationship mapping between key entities, organizations, and influencers in the region.
              </p>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-6 hover:shadow-md transition-shadow">
              <BarChart3 className="h-10 w-10 text-red-600 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Economic Trends</h3>
              <p className="text-gray-600">
                Comprehensive economic indicators and forecasts, highlighting growth opportunities and risks.
              </p>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-6 hover:shadow-md transition-shadow">
              <Shield className="h-10 w-10 text-indigo-600 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Stability Index</h3>
              <p className="text-gray-600">
                Proprietary stability metrics providing insight into regional security, governance, and development.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Regional Coverage */}
      <section id="capabilities" className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Regional Intelligence Coverage</h2>
            <p className="text-lg text-gray-600">
              In-depth analysis across Africa and the Middle East's most dynamic regions
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {['West Africa', 'North Africa', 'East Africa', 'Southern Africa', 'Horn of Africa', 'Sahel', 'Gulf States', 'Levant'].map((region) => (
              <div key={region} className="bg-white border border-gray-200 rounded-lg p-4 text-center hover:border-blue-300 transition-colors">
                <p className="font-medium text-gray-900">{region}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to access critical intelligence?</h2>
          <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
            Join organizations worldwide using Savannah Intel to navigate complex environments with confidence.
          </p>
          <Link 
            href="/dashboard" 
            className="inline-flex items-center px-6 py-3 bg-white text-blue-600 rounded-md hover:bg-blue-50 transition-colors font-medium"
          >
            Access Dashboard
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between mb-8">
            <div className="mb-6 md:mb-0">
              <div className="flex items-center gap-2 mb-4">
                <Globe className="h-6 w-6 text-blue-400" />
                <span className="font-bold text-xl text-white">Savannah Intel</span>
              </div>
              <p className="max-w-xs text-sm">
                Providing actionable intelligence and analysis for complex regions since 2022.
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-sm font-semibold text-white uppercase mb-4">Platform</h3>
                <ul className="space-y-2 text-sm">
                  <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Updates</a></li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-sm font-semibold text-white uppercase mb-4">Company</h3>
                <ul className="space-y-2 text-sm">
                  <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-sm font-semibold text-white uppercase mb-4">Legal</h3>
                <ul className="space-y-2 text-sm">
                  <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Terms</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Data Policy</a></li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="pt-8 mt-8 border-t border-gray-800 text-sm">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p>&copy; 2025 Savannah Intel. All rights reserved.</p>
              <div className="flex space-x-6 mt-4 md:mt-0">
                <a href="#" className="hover:text-white transition-colors">Twitter</a>
                <a href="#" className="hover:text-white transition-colors">LinkedIn</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
