import React from 'react';
import { Filter, ChevronDown } from 'lucide-react';

interface Props {
  onFilterChange: (filter: string) => void;
  defaultCollapsed?: boolean;
}

export default function AnalyticsFilter({ onFilterChange, defaultCollapsed = false }: Props) {
  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4`}>
      <h3 className="text-sm font-semibold text-gray-700 mb-3">Filter</h3>
      <div className="flex items-center">
        <Filter className="mr-2" />
        <input
          type="text"
          placeholder="Filter"
          onChange={(e) => onFilterChange(e.target.value)}
          className="border border-gray-300 rounded-md p-2"
        />
        <ChevronDown className="ml-auto" />
      </div>
    </div>
  );
}