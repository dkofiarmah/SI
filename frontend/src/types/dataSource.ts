// Shared data source types for use across analysis tools

export type DataSourceType = 
  | 'news' 
  | 'economic' 
  | 'social' 
  | 'government' 
  | 'satellite' 
  | 'security' 
  | 'intelligence' 
  | 'academic' 
  | 'ngo' 
  | 'custom';

export type DataSourceCategory =
  | 'core'
  | 'external'
  | 'partner'
  | 'custom'
  | 'premium';

export type DataUpdateFrequency =
  | 'realtime'
  | 'daily'
  | 'weekly'
  | 'monthly'
  | 'quarterly'
  | 'annual'
  | 'irregular';

export type DataCoverage = {
  regions?: string[];
  countries?: string[];
  cities?: string[];
  timespan: {
    start: Date;
    end: Date | 'present';
  };
};

export interface DataSourceMetadata {
  provider?: string;
  license?: string;
  methodology?: string;
  sampleSize?: number;
  format?: string;
  fields?: string[];
  tags?: string[];
  languages?: string[];
  [key: string]: any;
}

export interface DataSource {
  id: string;
  name: string;
  type: DataSourceType;
  category: DataSourceCategory;
  description: string;
  reliability: number; // 0-100
  lastUpdated: Date;
  updateFrequency: DataUpdateFrequency;
  coverage: DataCoverage;
  metadata?: DataSourceMetadata;
  url?: string;
  available: boolean;
  requiresSubscription?: boolean;
}

export interface DataSourceFilter {
  types?: DataSourceType[];
  categories?: DataSourceCategory[];
  regions?: string[];
  countries?: string[];
  minReliability?: number;
  maxAge?: number; // in days
  searchTerm?: string;
  tags?: string[];
}

export interface DataSourceSelectionOptions {
  allowMultiple: boolean;
  requiredTypes?: DataSourceType[];
  suggestedSources?: string[]; // IDs of suggested data sources
  preselectedSources?: string[]; // IDs of pre-selected data sources
  filterDefaults?: DataSourceFilter;
}
