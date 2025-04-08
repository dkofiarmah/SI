import { Home, UploadCloud, Database, FileText, Share2, GitBranch, Map, Settings } from 'react-feather';

// Update the navigation items array to include the Data Import link
const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Data Import', href: '/dashboard/data-import', icon: UploadCloud },
  { name: 'Data Management', href: '/dashboard/data-management', icon: Database },
  { name: 'Reports', href: '/dashboard/report', icon: FileText },
  { name: 'Network Analysis', href: '/dashboard/network', icon: Share2 },
  { name: 'Scenario Planning', href: '/dashboard/scenario', icon: GitBranch },
  { name: 'Map View', href: '/dashboard/map', icon: Map },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
];

export default navItems;