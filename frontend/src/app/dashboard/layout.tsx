'use client';

import React, { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useUser, useClerk } from '@clerk/nextjs';
import {
  Globe, Search, Menu, ChevronDown,
  Network, Settings, Plus,
  ChevronLeft, ChevronRight, LayoutDashboard, Map, Shield, TrendingUp,
  Database, User, BrainCircuit, FileText, PieChart, Bell, BookMarked,
  Users, Building2, MapPin, Calendar, Flag
} from 'lucide-react';
import AIHelperChat from '@/components/AIHelperChat';

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user, isLoaded, isSignedIn } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();
  const [isAiHelperOpen, setIsAiHelperOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname();

  // Handle window resize for responsive behavior
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setIsSidebarCollapsed(true);
      }
    };

    handleResize(); // Initial check
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleSignOut = () => {
    // Instead of directly calling signOut, navigate to the signout page
    router.push('/auth/signout');
  };

  // Navigation structure with tooltips for better UX - Restructured to highlight core value proposition
  const navItems = [
    { 
      id: 'dashboard', 
      label: 'Intelligence Dashboard', 
      path: '/dashboard', 
      icon: LayoutDashboard,
      tooltip: 'Main intelligence dashboard with comprehensive overview of all entities and insights'
    },
    { type: 'divider', id: 'div1'},
    
    { type: 'header', id: 'entities_header', label: '360° Entity Intelligence'},
    
    { 
      id: 'people', 
      label: 'Key People', 
      path: '/dashboard/entity/people', 
      icon: Users,
      tooltip: 'Explore comprehensive profiles of influential individuals and stakeholders'
    },
    { 
      id: 'organizations', 
      label: 'Organizations', 
      path: '/dashboard/entity/organizations', 
      icon: Building2,
      tooltip: 'Analyze organizations, their leadership, and connections to other entities'
    },
    { 
      id: 'places', 
      label: 'Places & Regions', 
      path: '/dashboard/entity/places', 
      icon: MapPin,
      tooltip: 'Discover insights about locations, their economic indicators, and security status'
    },
    { 
      id: 'events', 
      label: 'Events & Incidents', 
      path: '/dashboard/entity/events', 
      icon: Calendar,
      tooltip: 'Track significant events, their impact, and related stakeholders'
    },
    { 
      id: 'countries', 
      label: 'Country Analysis', 
      path: '/dashboard/entity/countries', 
      icon: Flag,
      tooltip: 'Access comprehensive country profiles with key demographic, economic, and political data'
    },
    { type: 'divider', id: 'div2'},
    
    { type: 'header', id: 'analysis_header', label: 'Analysis Tools'},
    
    { 
      id: 'network', 
      label: 'Network Analysis', 
      path: '/dashboard/network', 
      icon: Network,
      tooltip: 'Visualize relationships between entities and organizations'
    },
    { 
      id: 'geospatial', 
      label: 'Geospatial Analysis', 
      path: '/dashboard/geospatial', 
      icon: Map,
      tooltip: 'Analyze data through maps and geographic visualizations'
    },
    { 
      id: 'trends', 
      label: 'Trend Analysis', 
      path: '/dashboard/trends', 
      icon: TrendingUp,
      tooltip: 'Analyze trends and patterns in data over time'
    },
    { 
      id: 'scenario', 
      label: 'Scenario Planning', 
      path: '/dashboard/scenario', 
      icon: Shield,
      tooltip: 'Create and model potential scenarios to anticipate outcomes'
    },
    { type: 'divider', id: 'div3'},
    
    { type: 'header', id: 'intel_header', label: 'Intelligence Products'},
    
    { 
      id: 'alerts', 
      label: 'Critical Alerts', 
      path: '/dashboard/alerts', 
      icon: Bell,
      tooltip: 'View time-sensitive alerts and critical notifications',
      badge: 3
    },
    { 
      id: 'reports', 
      label: 'Intelligence Reports', 
      path: '/dashboard/reports', 
      icon: BookMarked,
      tooltip: 'Access and generate detailed intelligence reports'
    },
    { type: 'divider', id: 'div4'},
    
    { type: 'header', id: 'data_header', label: 'Data Management'},
    
    { 
      id: 'data_sources', 
      label: 'Data Sources', 
      path: '/dashboard/data-sources', 
      icon: Database,
      tooltip: 'Browse and manage available data sources'
    },
    { 
      id: 'data_import', 
      label: 'Data Import', 
      path: '/dashboard/data-management', 
      icon: FileText,
      tooltip: 'Import and manage your custom data'
    },
  ];

  // Show loading state while Clerk is initializing
  if (!isLoaded) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-100">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  // Rest of the component remains unchanged
  return (
    <div className="flex h-screen bg-gray-100 font-sans relative">
      {/* Sidebar */}
      <aside 
        className={`${isSidebarCollapsed ? 'w-16' : 'w-64'} bg-white border-r border-gray-200 flex flex-col flex-shrink-0 z-10 transition-all duration-300 ease-in-out`}
      >
        {/* Logo and Header */}
        <div className={`h-16 flex items-center justify-between px-4 border-b border-gray-200 bg-gradient-to-r from-blue-800 to-blue-700 text-white flex-shrink-0 ${isSidebarCollapsed ? 'justify-center px-2' : ''}`}>
          <div className="flex items-center">
            <div className="relative h-9 w-9 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-inner">
              <Globe className={`h-5 w-5 text-white absolute ${isSidebarCollapsed ? '' : 'animate-pulse'}`} />
              <div className="h-5 w-5 rounded-full bg-blue-400 absolute opacity-20"></div>
            </div>
            {!isSidebarCollapsed && (
              <div className="ml-2.5">
                <h1 className="text-xl font-bold tracking-tight">Savannah</h1>
                <div className="text-xs font-medium text-blue-100 -mt-1">INTELLIGENCE</div>
              </div>
            )}
          </div>
          <button 
            className={`p-1 rounded-md text-white/80 hover:text-white hover:bg-white/10 focus:outline-none ${isSidebarCollapsed ? 'hidden md:block' : ''}`}
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            title={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isSidebarCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        </div>
        
        {/* Search Bar - Hide when collapsed */}
        {!isSidebarCollapsed && (
          <div className="p-4 border-b border-gray-200">
            <div className="relative group">
              <input 
                type="text" 
                placeholder="Search entities, events, places..." 
                className="w-full bg-gray-100 rounded-md pl-8 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm border border-gray-200" 
              />
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
              <div className="absolute hidden group-focus-within:block top-full left-0 right-0 mt-1 bg-white rounded-md shadow-lg border border-gray-200 p-2 text-xs text-gray-500 z-20">
                Pro tip: Search for people, organizations, locations, or events
              </div>
            </div>
          </div>
        )}

        {/* Mobile menu toggle - visible only on small screens */}
        {isMobile && isSidebarCollapsed && (
          <button
            className="p-3 text-gray-600 hover:text-blue-600"
            onClick={() => setIsSidebarCollapsed(false)}
          >
            <Menu className="h-5 w-5" />
          </button>
        )}

        <nav className={`flex-1 ${isSidebarCollapsed ? 'px-2 py-4' : 'p-4'} overflow-y-auto`}>
          <ul className="space-y-1">
            {navItems.map(item => {
              if (item.type === 'divider') {
                return isSidebarCollapsed ? null : <hr key={item.id} className="my-3 border-gray-200" />;
              }
              if (item.type === 'header') {
                return isSidebarCollapsed ? null : <h2 key={item.id} className="px-2 pt-2 pb-1 text-xs font-semibold text-gray-500 uppercase tracking-wider">{item.label}</h2>;
              }
              // Navigation Button with tooltip
              const isActive = pathname === item.path;
              return (
                <li key={item.id} className="relative group">
                  <Link 
                    href={item.path || '#'}
                    className={`w-full flex items-center text-left ${isSidebarCollapsed ? 'justify-center p-2.5' : 'p-2'} rounded-md text-sm transition-colors duration-150 ${
                      isActive ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {item.icon && React.createElement(item.icon, {
                      className: `h-4 w-4 ${isSidebarCollapsed ? '' : 'mr-3'} flex-shrink-0 ${isActive ? 'text-blue-600' : 'text-gray-500'}`
                    })}
                    {!isSidebarCollapsed && (
                      <>
                        {item.label}
                        {item.badge && (
                          <span className="ml-auto text-xs bg-red-500 text-white rounded-full px-1.5 py-0.5 font-semibold">
                            {item.badge}
                          </span>
                        )}
                      </>
                    )}
                    {isSidebarCollapsed && item.badge && (
                      <span className="absolute top-0 right-0 -mt-1 -mr-1 text-xs bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center font-semibold">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                  <div className={`absolute ${isSidebarCollapsed ? 'left-full ml-2' : 'hidden group-hover:block left-full ml-2'} top-1/2 transform -translate-y-1/2 bg-gray-800 text-white text-xs rounded p-2 w-48 z-20 ${isSidebarCollapsed ? 'hidden group-hover:block' : ''}`}>
                    <div className="font-semibold mb-0.5">{item.label}</div>
                    <div className="text-gray-300 text-xs">{item.tooltip}</div>
                  </div>
                </li>
              );
            })}
          </ul>
        </nav>
        
        {/* Footer User Area */}
        <div className={`border-t border-gray-200 mt-auto flex-shrink-0 relative ${isSidebarCollapsed ? 'p-2' : 'p-3'}`}>
          {!isSidebarCollapsed && (
            <Link 
              href="/dashboard/report/new"
              className="w-full mb-3 bg-blue-600 text-white rounded-md p-2 flex items-center justify-center text-sm hover:bg-blue-700 transition duration-150"
            >
              <Plus className="h-4 w-4 mr-2" /> Create New Report
            </Link>
          )}
          {isSidebarCollapsed && (
            <Link 
              href="/dashboard/reports/new"
              className="w-full mb-3 bg-blue-600 text-white rounded-md p-2 flex items-center justify-center hover:bg-blue-700 transition duration-150"
              title="Create New Report"
            >
              <Plus className="h-4 w-4" />
            </Link>
          )}
          {/* User Info Button */}
          <button
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className={`w-full flex items-center ${isSidebarCollapsed ? 'justify-center' : ''} p-2 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-400`}
          >
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-gray-300 to-gray-400 flex-shrink-0 flex items-center justify-center text-gray-600 font-semibold">
              {user?.firstName?.[0]}{user?.lastName?.[0] || user?.firstName?.[1] || ''}
            </div>
            {!isSidebarCollapsed && (
              <>
                <div className="flex-1 overflow-hidden whitespace-nowrap text-left ml-2">
                  <span className="text-sm font-medium text-gray-700 block truncate">{user?.firstName} {user?.lastName}</span>
                  <span className="text-xs text-gray-500 block truncate">{user?.primaryEmailAddress?.emailAddress}</span>
                </div>
                <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform duration-200 ${isUserMenuOpen ? 'rotate-180' : ''}`} />
              </>
            )}
          </button>
          {/* User Menu Dropdown */}
          {isUserMenuOpen && (
            <div className={`absolute ${isSidebarCollapsed ? 'left-full ml-2 bottom-0' : 'bottom-full left-0 right-0 mb-1'} bg-white border border-gray-200 rounded-md shadow-lg py-1 z-20`}>
              <Link 
                href="/dashboard/profile/preferences"
                className="w-full text-left px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                onClick={() => setIsUserMenuOpen(false)}
              >
                <User className="h-4 w-4 mr-2 text-gray-500"/> Profile
              </Link>
              <Link 
                href="/dashboard/settings"
                className="w-full text-left px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                onClick={() => setIsUserMenuOpen(false)}
              >
                <Settings className="h-4 w-4 mr-2 text-gray-500"/> Settings
              </Link>
              <button 
                onClick={handleSignOut}
                className="w-full text-left px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
              >
                <ChevronLeft className="h-4 w-4 mr-2 text-gray-500"/> Sign Out
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto bg-gray-50">
          {children}
        </div>
      </main>

      {/* AI Helper Floating Button & Modal */}
      {!isAiHelperOpen && (
        <button 
          onClick={() => setIsAiHelperOpen(true)} 
          className="fixed bottom-6 right-6 bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-3 rounded-full shadow-lg hover:scale-110 transition-transform duration-150 z-40"
          title="Open AI Assistant"
          aria-label="Open AI Assistant"
        >
          <BrainCircuit className="h-6 w-6" />
          <span className="sr-only">Open AI Assistant</span>
        </button>
      )}
      {isAiHelperOpen && <AIHelperChat onClose={() => setIsAiHelperOpen(false)} />}
    </div>
  );
}
