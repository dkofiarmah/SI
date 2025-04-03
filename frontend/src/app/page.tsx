import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Globe, Shield, BarChart3, Network, Map, AlertTriangle, BrainCircuit } from "lucide-react";
import StabilityIndexAllRegions from "@/components/StabilityIndexAllRegions";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Navigation */}
      <header className="border-b border-gray-100">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center">
            <div className="relative h-9 w-9 rounded-full bg-gradient-to-r from-blue-600/70 to-blue-700/70 flex items-center justify-center shadow-inner">
              <Globe className="h-5 w-5 text-white absolute" />
              <div className="h-5 w-5 rounded-full bg-blue-400 absolute opacity-20"></div>
            </div>
            <div className="ml-2.5">
              <h1 className="text-xl font-bold tracking-tight text-gray-900">Savannah</h1>
              <div className="text-xs font-medium text-blue-600 -mt-1">INTELLIGENCE</div>
            </div>
          </Link>
          <nav className="hidden md:flex gap-8 text-sm font-medium">
            <a href="#features" className="text-gray-700 hover:text-blue-600 transition-colors">Features</a>
            <a href="#platform" className="text-gray-700 hover:text-blue-600 transition-colors">Platform</a>
            <a href="#beta" className="text-gray-700 hover:text-blue-600 transition-colors">Beta Program</a>
          </nav>
          <div className="flex items-center gap-3">
            <Link 
              href="/auth/register" 
              className="text-sm px-4 py-2 text-gray-700 hover:text-blue-600 transition-colors"
            >
              Request Access
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="container mx-auto px-6 py-16 md:py-24">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-block px-3 py-1 mb-6 bg-blue-50 text-blue-600 rounded-full text-sm font-medium">
              Limited Access Beta Available
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-6">
              Making Sense of <span className="text-blue-600">Regional Data</span>
            </h1>
            <p className="text-lg text-gray-600 mb-8 max-w-lg leading-relaxed">
              Our platform turns complex regional information into clear insights. Get risk assessments, trends, and strategic analysis for Africa and the Middle East.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Link 
                href="/auth/register" 
                className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
              >
                Request Beta Access
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link 
                href="/dashboard" 
                className="flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
              >
                See Platform Demo
              </Link>
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center">
                <span className="flex h-2 w-2 rounded-full bg-green-500 mr-2"></span>
                Real-time updates
              </div>
              <div className="flex items-center">
                <Shield className="h-4 w-4 mr-1 text-gray-400" />
                Secure data handling
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -top-8 -right-8 bg-blue-50 text-blue-800 rounded-lg p-4 shadow-sm border border-blue-100 max-w-xs animate-pulse hover:animate-none transition-all duration-300 hover:bg-blue-100 hover:shadow-md cursor-pointer">
              <h4 className="font-medium mb-1 flex items-center">
                <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-2 animate-ping"></span>
                Beta Benefits
              </h4>
              <ul className="text-sm space-y-1 text-blue-700">
                <li className="transform transition-transform hover:translate-x-1 duration-200">• First access to new tools</li>
                <li className="transform transition-transform hover:translate-x-1 duration-200">• Help shape platform features</li>
                <li className="transform transition-transform hover:translate-x-1 duration-200">• Priority support & training</li>
              </ul>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <div className="aspect-video rounded-md overflow-hidden bg-gray-100 border border-gray-200">
                <Image 
                  src="/dashboard-preview.svg" 
                  alt="Savannah Intelligence Dashboard Preview" 
                  width={800} 
                  height={450} 
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trusted By */}
      <section className="border-t border-gray-100 bg-gray-50">
        <div className="container mx-auto px-6 py-12">
          <p className="text-center text-sm font-medium text-gray-500 mb-8">
            TRUSTED BY LEADING ORGANIZATIONS
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 items-center justify-items-center">
            {/* Rwanda Government */}
            <div className="flex items-center justify-center h-20">
              <Image 
                src="/logos/rwanda.png" 
                alt="Rwanda Government" 
                width={160} 
                height={80} 
                className="object-contain h-20 w-auto"
              />
            </div>
            {/* Kenya Government */}
            <div className="flex items-center justify-center h-20">
              <Image 
                src="/logos/kenya.png" 
                alt="Kenya Government" 
                width={160} 
                height={80} 
                className="object-contain h-20 w-auto"
              />
            </div>
            {/* AfriExim Bank */}
            <div className="flex items-center justify-center h-20">
              <Image 
                src="/logos/afriexxim.png" 
                alt="AfriExim Bank" 
                width={160} 
                height={80} 
                className="object-contain h-20 w-auto"
              />
            </div>
            {/* African Union */}
            <div className="flex items-center justify-center h-20">
              <Image 
                src="/logos/au.png" 
                alt="African Union" 
                width={160} 
                height={80} 
                className="object-contain h-20 w-auto"
              />
            </div>
            {/* ACET */}
            <div className="flex items-center justify-center h-20">
              <Image 
                src="/logos/acet.png" 
                alt="African Center for Economic Transformation" 
                width={160} 
                height={80} 
                className="object-contain h-20 w-auto"
              />
            </div>
            {/* Rwanda Financial Center */}
            <div className="flex items-center justify-center h-20">
              <Image 
                src="/logos/kifc.png" 
                alt="Kigali International Financial Centre" 
                width={160} 
                height={80} 
                className="object-contain h-20 w-auto"
              />
            </div>
            {/* African Development Bank */}
            <div className="flex items-center justify-center h-20">
              <Image 
                src="/logos/AfDB.png" 
                alt="African Development Bank" 
                width={160} 
                height={80} 
                className="object-contain h-20 w-auto"
              />
            </div>
            {/* Ghana */}
            <div className="flex items-center justify-center h-20">
              <Image 
                src="/logos/ghana.png" 
                alt="Ghana Government" 
                width={160} 
                height={80} 
                className="object-contain h-20 w-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Tools That Make Analysis Simple</h2>
            <p className="text-lg text-gray-600">
              Our platform turns complex data into clear insights you can act on right away.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-50 rounded-lg p-6 hover:shadow-md transition-shadow">
              <Map className="h-10 w-10 text-blue-600 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Map-Based Analysis</h3>
              <p className="text-gray-600">
                See risks and opportunities directly on maps with easy-to-understand visual indicators.
              </p>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-6 hover:shadow-md transition-shadow">
              <BrainCircuit className="h-10 w-10 text-purple-600 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Future Scenarios</h3>
              <p className="text-gray-600">
                Test "what-if" situations to understand how events might affect your interests in the region.
              </p>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-6 hover:shadow-md transition-shadow">
              <Network className="h-10 w-10 text-green-600 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Relationship Mapping</h3>
              <p className="text-gray-600">
                Understand connections between important people, organizations, and regional actors.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Platform */}
      <section id="platform" className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">A Complete Analysis Platform</h2>
            <p className="text-lg text-gray-600">
              Everything you need to understand regional conditions and make informed decisions
            </p>
          </div>
          
          {/* Add Stability Index All Regions component */}
          <div className="max-w-5xl mx-auto mb-16">
            <StabilityIndexAllRegions />
          </div>
          
          <div className="text-center mt-8">
            <p className="text-gray-600 mb-4">Our platform provides comprehensive real-time monitoring of stability indices across all regions</p>
            <Link 
              href="/dashboard" 
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Explore Full Dashboard
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="col-span-2 md:col-span-1">
              <Link href="/" className="flex items-center gap-2 mb-4">
                <div className="relative h-9 w-9 rounded-full bg-gradient-to-r from-blue-800 to-blue-700 flex items-center justify-center shadow-inner">
                  <Globe className="h-5 w-5 text-white absolute" />
                  <div className="h-5 w-5 rounded-full bg-blue-400 absolute opacity-20"></div>
                </div>
                <div className="ml-2">
                  <h1 className="text-xl font-bold tracking-tight text-white">Savannah</h1>
                  <div className="text-xs font-medium text-blue-300 -mt-1">INTELLIGENCE</div>
                </div>
              </Link>
              <p className="text-sm">
                Regional analysis tools built for organizations that need reliable information.
              </p>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold text-white uppercase mb-4">Product</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#platform" className="hover:text-white transition-colors">Platform</a></li>
                <li><a href="#beta" className="hover:text-white transition-colors">Beta Program</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold text-white uppercase mb-4">Company</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="/about" className="hover:text-white transition-colors">About</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold text-white uppercase mb-4">Legal</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link></li>
                <li><Link href="/terms" className="hover:text-white transition-colors">Terms</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 mt-8 border-t border-gray-800 text-sm">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p>&copy; 2025 Savannah Intel. All rights reserved.</p>
              <div className="flex space-x-6 mt-4 md:mt-0">
                <a href="https://linkedin.com/company/savannah-intel" className="hover:text-white transition-colors" target="_blank" rel="noopener noreferrer">LinkedIn</a>
                <a href="https://twitter.com/savannahintel" className="hover:text-white transition-colors" target="_blank" rel="noopener noreferrer">Twitter</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
