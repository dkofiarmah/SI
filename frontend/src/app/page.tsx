import { 
  ArrowRight, 
  Compass, 
  Eye, 
  Globe, 
  LineChart, 
  Network, 
  Shield,
  Lock,
  Search,
  Filter,
  Database,
  FileText,
  Target,
  MapPin,
  Plus,
  Minus,
  AlertTriangle,
  BarChart3,
  PieChart
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default async function HomePage() {

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      {/* Header Section */}
      <header className="intel-header sticky top-0 z-10">
        <div className="container mx-auto px-6 flex items-center justify-between py-4">
          <div className="flex items-center">
            <div className="relative flex h-10 w-10 items-center justify-center rounded-sm bg-primary shadow-sm border-2 border-accent">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <div className="ml-3">
              <h1 className="text-xl font-bold tracking-tight text-white font-headings">Savannah</h1>
              <div className="-mt-1 text-xs font-medium text-neutral-300 tracking-wider">INTELLIGENCE SERVICE</div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Link 
              href="/auth/signup" 
              className="px-4 py-2 text-sm font-medium text-neutral-100 hover:text-white hover:bg-primary-light rounded transition duration-150"
            >
              Sign Up
            </Link>
            <Link 
              href="/auth/signin" 
              className="intel-button intel-button-accent px-4 py-2 text-sm font-medium text-white flex items-center"
            >
              ACCESS PORTAL
              <Lock className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="py-20 px-6 bg-[#0b1526] text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <Image 
              src="/images/world-map-dots.png" 
              alt="World map" 
              fill 
              style={{objectFit: "cover"}}
              priority 
              unoptimized
            />
          </div>
          <div className="container mx-auto max-w-7xl relative">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-block bg-accent px-3 py-1 text-xs font-bold tracking-wider mb-6 rounded-sm">
                  STRATEGIC INTELLIGENCE
                </div>
                <h1 className="text-4xl sm:text-5xl font-bold text-white leading-tight mb-4 font-headings tracking-tight">
                  TO SEE THE INVISIBLE<br/>AND DO THE IMPOSSIBLE
                </h1>
                <p className="text-lg text-neutral-300 mb-8 max-w-xl">
                  Comprehensive analysis and insights on geopolitical, economic, and security trends across Africa, empowering your highest-level decision-making process.
                </p>
                <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                  <Link 
                    href="/auth/signup" 
                    className="intel-button intel-button-accent px-6 py-3 text-base font-medium flex items-center justify-center"
                  >
                    JOIN THE MISSION
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                  <Link 
                    href="#domains" 
                    className="intel-button px-6 py-3 text-base font-medium border border-neutral-600 text-white flex items-center justify-center hover:bg-primary-light transition-colors"
                  >
                    EXPLORE DOMAINS
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Domains Section */}
        <section id="domains" className="py-16 px-6 bg-neutral-100">
          <div className="container mx-auto max-w-7xl">
            <div className="mb-12 text-center">
              <h2 className="text-3xl font-bold text-primary font-headings mb-4">INTELLIGENCE DOMAINS</h2>
              <p className="text-neutral-600 max-w-2xl mx-auto">
                Our specialized intelligence units provide comprehensive analysis across multiple domains to support strategic decision-making.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="intel-card">
                <div className="intel-card-header">
                  <Compass className="h-5 w-5 inline-block mr-2 mb-1" />
                  GEOSPATIAL INTELLIGENCE
                </div>
                <div className="p-6 bg-white">
                  <p className="text-neutral-700 mb-4">
                    Interactive maps and location-based intelligence for comprehensive regional analysis.
                  </p>
                  <Link href="#" className="text-primary hover:text-accent font-medium flex items-center text-sm">
                    LEARN MORE
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </div>
              </div>
              
              <div className="intel-card">
                <div className="intel-card-header">
                  <Network className="h-5 w-5 inline-block mr-2 mb-1" />
                  NETWORK INTELLIGENCE
                </div>
                <div className="p-6 bg-white">
                  <p className="text-neutral-700 mb-4">
                    Uncover hidden relationships between political actors, organizations, and events.
                  </p>
                  <Link href="#" className="text-primary hover:text-accent font-medium flex items-center text-sm">
                    LEARN MORE
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </div>
              </div>
              
              <div className="intel-card">
                <div className="intel-card-header">
                  <LineChart className="h-5 w-5 inline-block mr-2 mb-1" />
                  ECONOMIC INTELLIGENCE
                </div>
                <div className="p-6 bg-white">
                  <p className="text-neutral-700 mb-4">
                    Monitor and forecast economic indicators and investment opportunities.
                  </p>
                  <Link href="#" className="text-primary hover:text-accent font-medium flex items-center text-sm">
                    LEARN MORE
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </div>
              </div>
              
              <div className="intel-card">
                <div className="intel-card-header">
                  <Shield className="h-5 w-5 inline-block mr-2 mb-1" />
                  SECURITY ASSESSMENT
                </div>
                <div className="p-6 bg-white">
                  <p className="text-neutral-700 mb-4">
                    Real-time security risk analysis and threat monitoring for operations.
                  </p>
                  <Link href="#" className="text-primary hover:text-accent font-medium flex items-center text-sm">
                    LEARN MORE
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </div>
              </div>
              
              <div className="intel-card">
                <div className="intel-card-header">
                  <Eye className="h-5 w-5 inline-block mr-2 mb-1" />
                  PREDICTIVE INTELLIGENCE
                </div>
                <div className="p-6 bg-white">
                  <p className="text-neutral-700 mb-4">
                    AI-powered forecasting to anticipate political events and market shifts.
                  </p>
                  <Link href="#" className="text-primary hover:text-accent font-medium flex items-center text-sm">
                    LEARN MORE
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </div>
              </div>
              
              <div className="intel-card">
                <div className="intel-card-header">
                  <Globe className="h-5 w-5 inline-block mr-2 mb-1" />
                  REGIONAL EXPERTISE
                </div>
                <div className="p-6 bg-white">
                  <p className="text-neutral-700 mb-4">
                    Deep analysis from specialists with on-the-ground experience in Africa.
                  </p>
                  <Link href="#" className="text-primary hover:text-accent font-medium flex items-center text-sm">
                    LEARN MORE
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 px-6 bg-[#0b1526] text-white">
          <div className="container mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold text-white mb-6 font-headings">READY TO JOIN THE MISSION?</h2>
            <p className="text-xl text-neutral-300 mb-8">
              Elite organizations rely on Savannah Intelligence for critical insights across the African continent.
            </p>
            <Link 
              href="/auth/signup" 
              className="intel-button intel-button-accent px-8 py-4 text-lg font-medium inline-flex items-center justify-center"
            >
              REQUEST ACCESS
              <Target className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </section>
      </main>

      <footer className="text-white py-12 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-headings text-lg mb-4 uppercase">Platform</h3>
              <ul className="space-y-2">
                <li><Link href="#" className="text-neutral-400 hover:text-white transition">Features</Link></li>
                <li><Link href="#" className="text-neutral-400 hover:text-white transition">Intelligence</Link></li>
                <li><Link href="#" className="text-neutral-400 hover:text-white transition">Analysis</Link></li>
                <li><Link href="#" className="text-neutral-400 hover:text-white transition">Reports</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-headings text-lg mb-4 uppercase">Company</h3>
              <ul className="space-y-2">
                <li><Link href="#" className="text-neutral-400 hover:text-white transition">About Us</Link></li>
                <li><Link href="#" className="text-neutral-400 hover:text-white transition">Team</Link></li>
                <li><Link href="#" className="text-neutral-400 hover:text-white transition">Careers</Link></li>
                <li><Link href="#" className="text-neutral-400 hover:text-white transition">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-headings text-lg mb-4 uppercase">Resources</h3>
              <ul className="space-y-2">
                <li><Link href="#" className="text-neutral-400 hover:text-white transition">Blog</Link></li>
                <li><Link href="#" className="text-neutral-400 hover:text-white transition">Guides</Link></li>
                <li><Link href="#" className="text-neutral-400 hover:text-white transition">Events</Link></li>
                <li><Link href="#" className="text-neutral-400 hover:text-white transition">Press</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-headings text-lg mb-4 uppercase">Legal</h3>
              <ul className="space-y-2">
                <li><Link href="/privacy" className="text-neutral-400 hover:text-white transition">Privacy</Link></li>
                <li><Link href="/terms" className="text-neutral-400 hover:text-white transition">Terms</Link></li>
                <li><Link href="#" className="text-neutral-400 hover:text-white transition">Security</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-primary-light mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <div className="relative flex h-10 w-10 items-center justify-center rounded-sm bg-primary border-2 border-accent">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div className="ml-3">
                <h1 className="text-xl font-bold tracking-tight text-white font-headings">Savannah</h1>
                <div className="-mt-1 text-xs font-medium text-neutral-400 tracking-wider">INTELLIGENCE SERVICE</div>
              </div>
            </div>
            <p className="text-neutral-500 text-sm">© 2025 Savannah Intelligence. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
