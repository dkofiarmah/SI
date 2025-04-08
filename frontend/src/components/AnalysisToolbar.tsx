import React, { useState } from 'react';
import { 
  Download, Share2, ChevronDown, Filter, Clock, 
  Calendar, Layers, BarChart4, Settings, Database, Info,
  HelpCircle, Bookmark, Printer
} from 'lucide-react';

export type ToolbarButton = {
  id: string;
  icon: React.ElementType;
  label: string;
  onClick: () => void;
  tooltip?: string;
  active?: boolean;
  disabled?: boolean;
  type?: 'default' | 'primary' | 'danger';
};

export type ToolbarDropdown = {
  id: string;
  icon: React.ElementType;
  label: string;
  tooltip?: string;
  options: {
    id: string;
    label: string;
    onClick: () => void;
    icon?: React.ElementType;
    active?: boolean;
    disabled?: boolean;
  }[];
};

export type ToolbarSection = {
  id: string;
  label?: string;
  items: (ToolbarButton | ToolbarDropdown)[];
};

interface AnalysisToolbarProps {
  sections: ToolbarSection[];
  className?: string;
  orientation?: 'horizontal' | 'vertical';
  dense?: boolean;
}

export default function AnalysisToolbar({
  sections,
  className = '',
  orientation = 'horizontal',
  dense = false
}: AnalysisToolbarProps) {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  
  const toggleDropdown = (id: string) => {
    setOpenDropdown(openDropdown === id ? null : id);
  };
  
  return (
    <div className={`bg-white border border-gray-200 rounded-md ${className}`}>
      <div 
        className={`flex ${orientation === 'vertical' ? 'flex-col' : 'flex-row flex-wrap'} 
                    ${dense ? 'p-1 gap-1' : 'p-2 gap-2'}`}
      >
        {sections.map((section, sectionIndex) => (
          <div 
            key={section.id}
            className={`flex ${orientation === 'vertical' ? 'flex-col w-full' : 'flex-row'} items-center 
                        ${sectionIndex > 0 && orientation === 'horizontal' ? 'border-l border-gray-200 pl-2' : ''}`}
          >
            {section.label && (
              <div 
                className={`text-xs font-medium text-gray-500 
                          ${orientation === 'vertical' ? 'w-full pb-1 mb-1 border-b border-gray-200' : 'mr-2'}`}
              >
                {section.label}
              </div>
            )}
            
            <div 
              className={`flex ${orientation === 'vertical' ? 'flex-col w-full' : 'flex-row'} 
                          ${dense ? 'gap-1' : 'gap-2'}`}
            >
              {section.items.map(item => {
                if ('options' in item) {
                  // This is a dropdown
                  return (
                    <div key={item.id} className="relative">
                      <button
                        className={`flex items-center 
                                    ${dense ? 'px-1.5 py-1 text-xs' : 'px-2 py-1.5 text-sm'} 
                                    rounded hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400`}
                        onClick={() => toggleDropdown(item.id)}
                        title={item.tooltip}
                      >
                        <item.icon className={`${dense ? 'h-3.5 w-3.5' : 'h-4 w-4'} text-gray-600 mr-1.5`} />
                        {item.label}
                        <ChevronDown 
                          className={`${dense ? 'h-3.5 w-3.5' : 'h-4 w-4'} ml-1 text-gray-500 transition-transform 
                                     ${openDropdown === item.id ? 'rotate-180' : ''}`} 
                        />
                      </button>
                      
                      {openDropdown === item.id && (
                        <div className="absolute right-0 mt-1 z-10 w-48 bg-white border border-gray-200 rounded-md shadow-lg py-1">
                          {item.options.map(option => (
                            <button
                              key={option.id}
                              className={`w-full text-left px-3 py-1.5 text-sm 
                                        ${option.active ? 'text-blue-600 bg-blue-50' : 'text-gray-600'} 
                                        ${option.disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'} 
                                        flex items-center`}
                              onClick={() => {
                                if (!option.disabled) {
                                  option.onClick();
                                  setOpenDropdown(null);
                                }
                              }}
                              disabled={option.disabled}
                            >
                              {option.icon && <option.icon className="h-4 w-4 mr-2" />}
                              {option.label}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                } else {
                  // This is a button
                  return (
                    <button
                      key={item.id}
                      className={`flex items-center 
                                ${dense ? 'px-1.5 py-1 text-xs' : 'px-2 py-1.5 text-sm'} 
                                rounded 
                                ${item.type === 'primary' ? 'bg-blue-50 text-blue-600 hover:bg-blue-100' : 
                                  item.type === 'danger' ? 'bg-red-50 text-red-600 hover:bg-red-100' : 
                                  'hover:bg-gray-100 text-gray-600'} 
                                ${item.active ? 'bg-gray-100 font-medium' : ''} 
                                ${item.disabled ? 'opacity-50 cursor-not-allowed' : ''} 
                                focus:outline-none focus:ring-2 focus:ring-blue-400`}
                      onClick={() => !item.disabled && item.onClick()}
                      disabled={item.disabled}
                      title={item.tooltip}
                    >
                      <item.icon className={`${dense ? 'h-3.5 w-3.5' : 'h-4 w-4'} ${
                        item.type === 'primary' ? 'text-blue-600' : 
                        item.type === 'danger' ? 'text-red-600' : 
                        'text-gray-600'
                      } mr-1.5`} />
                      {item.label}
                    </button>
                  );
                }
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Export some common toolbar configurations
export function createDataSourceToolbarSection(
  onToggleDataSources: () => void,
  onShowInfo: () => void,
  dataSourceCount: number = 0
): ToolbarSection {
  return {
    id: 'data-sources',
    label: 'Data',
    items: [
      {
        id: 'toggle-data-sources',
        icon: Database,
        label: `Sources (${dataSourceCount})`,
        onClick: onToggleDataSources,
        tooltip: 'Select data sources'
      },
      {
        id: 'data-info',
        icon: Info,
        label: 'Details',
        onClick: onShowInfo,
        tooltip: 'View data source details',
        disabled: dataSourceCount === 0
      }
    ]
  };
}

export function createExportToolbarSection(
  onExport: () => void,
  onPrint: () => void,
  onShare: () => void
): ToolbarSection {
  return {
    id: 'export',
    items: [
      {
        id: 'export',
        icon: Download,
        label: 'Export',
        onClick: onExport,
        tooltip: 'Export this analysis'
      },
      {
        id: 'print',
        icon: Printer,
        label: 'Print',
        onClick: onPrint,
        tooltip: 'Print this analysis'
      },
      {
        id: 'share',
        icon: Share2,
        label: 'Share',
        onClick: onShare,
        tooltip: 'Share this analysis'
      }
    ]
  };
}

export function createTimeRangeToolbarDropdown(
  onSelect: (range: string) => void,
  currentRange: string
): ToolbarDropdown {
  return {
    id: 'time-range',
    icon: Clock,
    label: formatTimeRange(currentRange),
    tooltip: 'Select time range',
    options: [
      { id: '7d', label: 'Last 7 days', onClick: () => onSelect('7d'), active: currentRange === '7d' },
      { id: '30d', label: 'Last 30 days', onClick: () => onSelect('30d'), active: currentRange === '30d' },
      { id: '90d', label: 'Last 90 days', onClick: () => onSelect('90d'), active: currentRange === '90d' },
      { id: '1y', label: 'Last year', onClick: () => onSelect('1y'), active: currentRange === '1y' },
      { id: '5y', label: 'Last 5 years', onClick: () => onSelect('5y'), active: currentRange === '5y' },
      { id: 'all', label: 'All time', onClick: () => onSelect('all'), active: currentRange === 'all' },
    ]
  };
}

// Helper function to format time range for display
function formatTimeRange(range: string): string {
  switch (range) {
    case '7d': return '7 days';
    case '30d': return '30 days';
    case '90d': return '90 days';
    case '1y': return '1 year';
    case '5y': return '5 years';
    case 'all': return 'All time';
    default: return range;
  }
}
