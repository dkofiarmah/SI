import { DataSource, DataSourceFilter } from '@/types/dataSource';

// Mock data source list - in production, this would come from an API
export const availableDataSources: DataSource[] = [
  {
    id: 'savannah-core',
    name: 'Savannah Intelligence Core Data',
    type: 'intelligence',
    category: 'core',
    description: 'Proprietary intelligence data collected and verified by Savannah Intelligence analysts',
    reliability: 95,
    lastUpdated: new Date(),
    updateFrequency: 'daily',
    coverage: {
      regions: ['East Africa', 'West Africa', 'North Africa', 'Central Africa', 'Southern Africa', 'Middle East'],
      timespan: {
        start: new Date(2020, 0, 1),
        end: 'present'
      }
    },
    available: true
  },
  {
    id: 'news-aggregation',
    name: 'News Sources (120+ outlets)',
    type: 'news',
    category: 'external',
    description: 'Aggregated news from over 120 verified media outlets across Africa and the Middle East',
    reliability: 85,
    lastUpdated: new Date(),
    updateFrequency: 'realtime',
    coverage: {
      regions: ['East Africa', 'West Africa', 'North Africa', 'Central Africa', 'Southern Africa', 'Middle East'],
      timespan: {
        start: new Date(2018, 0, 1),
        end: 'present'
      }
    },
    metadata: {
      sources: ['Reuters', 'BBC', 'Al Jazeera', 'Nation Media Group', 'plus 116+ more'],
      languages: ['English', 'French', 'Arabic', 'Swahili']
    },
    available: true
  },
  {
    id: 'economic-indicators',
    name: 'Economic Indicators',
    type: 'economic',
    category: 'external',
    description: 'Comprehensive economic data including GDP, inflation, trade, and financial metrics',
    reliability: 90,
    lastUpdated: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
    updateFrequency: 'monthly',
    coverage: {
      regions: ['East Africa', 'West Africa', 'North Africa', 'Central Africa', 'Southern Africa', 'Middle East'],
      timespan: {
        start: new Date(2010, 0, 1),
        end: 'present'
      }
    },
    metadata: {
      provider: 'World Bank, IMF, and national economic agencies',
      methodology: 'Standard economic metrics collection and verification'
    },
    available: true
  },
  {
    id: 'social-sentiment',
    name: 'Social Media Analysis',
    type: 'social',
    category: 'external',
    description: 'Sentiment analysis and trend detection from social media platforms',
    reliability: 75,
    lastUpdated: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    updateFrequency: 'daily',
    coverage: {
      regions: ['East Africa', 'West Africa', 'North Africa', 'Southern Africa', 'Middle East'],
      timespan: {
        start: new Date(2019, 0, 1),
        end: 'present'
      }
    },
    metadata: {
      platforms: ['Twitter', 'Facebook', 'TikTok', 'WhatsApp trends'],
      methodology: 'NLP-based sentiment analysis and volume tracking'
    },
    available: true
  },
  {
    id: 'govt-publications',
    name: 'Government Publications',
    type: 'government',
    category: 'external',
    description: 'Official publications, policy documents, and announcements from government sources',
    reliability: 88,
    lastUpdated: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), // 14 days ago
    updateFrequency: 'weekly',
    coverage: {
      regions: ['East Africa', 'West Africa', 'North Africa', 'Central Africa', 'Southern Africa', 'Middle East'],
      timespan: {
        start: new Date(2015, 0, 1),
        end: 'present'
      }
    },
    available: true
  },
  {
    id: 'satellite-imagery',
    name: 'Satellite Imagery',
    type: 'satellite',
    category: 'premium',
    description: 'High-resolution satellite imagery for infrastructure, agricultural, and security monitoring',
    reliability: 92,
    lastUpdated: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
    updateFrequency: 'weekly',
    coverage: {
      regions: ['East Africa', 'West Africa', 'North Africa', 'Central Africa', 'Southern Africa'],
      timespan: {
        start: new Date(2018, 0, 1),
        end: 'present'
      }
    },
    requiresSubscription: true,
    available: true
  },
  {
    id: 'security-incidents',
    name: 'Security Incident Database',
    type: 'security',
    category: 'core',
    description: 'Comprehensive database of security incidents, protests, and conflicts',
    reliability: 90,
    lastUpdated: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    updateFrequency: 'daily',
    coverage: {
      regions: ['East Africa', 'West Africa', 'North Africa', 'Central Africa', 'Southern Africa', 'Middle East'],
      timespan: {
        start: new Date(2017, 0, 1),
        end: 'present'
      }
    },
    available: true
  },
  {
    id: 'academic-research',
    name: 'Academic Research Papers',
    type: 'academic',
    category: 'external',
    description: 'Curated collection of relevant academic research and analysis',
    reliability: 85,
    lastUpdated: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
    updateFrequency: 'monthly',
    coverage: {
      regions: ['East Africa', 'West Africa', 'North Africa', 'Central Africa', 'Southern Africa', 'Middle East'],
      timespan: {
        start: new Date(2010, 0, 1),
        end: 'present'
      }
    },
    available: true
  },
  {
    id: 'ngo-reports',
    name: 'NGO Reports & Assessments',
    type: 'ngo',
    category: 'partner',
    description: 'Reports and assessments from major NGOs operating in the region',
    reliability: 82,
    lastUpdated: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000), // 20 days ago
    updateFrequency: 'irregular',
    coverage: {
      regions: ['East Africa', 'West Africa', 'North Africa', 'Central Africa', 'Southern Africa'],
      timespan: {
        start: new Date(2015, 0, 1),
        end: 'present'
      }
    },
    available: true
  }
];

/**
 * Get all available data sources
 */
export function getAllDataSources(): DataSource[] {
  // In a real application, this would fetch from an API
  return availableDataSources;
}

/**
 * Filter data sources based on provided criteria
 */
export function filterDataSources(filter: DataSourceFilter): DataSource[] {
  let filteredSources = [...availableDataSources];
  
  // Filter by type
  if (filter.types && filter.types.length > 0) {
    filteredSources = filteredSources.filter(source => 
      filter.types?.includes(source.type)
    );
  }
  
  // Filter by category
  if (filter.categories && filter.categories.length > 0) {
    filteredSources = filteredSources.filter(source => 
      filter.categories?.includes(source.category)
    );
  }
  
  // Filter by region
  if (filter.regions && filter.regions.length > 0) {
    filteredSources = filteredSources.filter(source => 
      source.coverage.regions?.some(region => filter.regions?.includes(region))
    );
  }
  
  // Filter by country
  if (filter.countries && filter.countries.length > 0) {
    filteredSources = filteredSources.filter(source => 
      source.coverage.countries?.some(country => filter.countries?.includes(country))
    );
  }
  
  // Filter by minimum reliability
  if (filter.minReliability !== undefined) {
    filteredSources = filteredSources.filter(source => 
      source.reliability >= filter.minReliability!
    );
  }
  
  // Filter by maximum age
  if (filter.maxAge !== undefined) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - filter.maxAge);
    
    filteredSources = filteredSources.filter(source => 
      source.lastUpdated >= cutoffDate
    );
  }
  
  // Filter by search term
  if (filter.searchTerm) {
    const term = filter.searchTerm.toLowerCase();
    filteredSources = filteredSources.filter(source => 
      source.name.toLowerCase().includes(term) || 
      source.description.toLowerCase().includes(term) ||
      source.metadata?.tags?.some(tag => tag.toLowerCase().includes(term))
    );
  }
  
  // Filter by tags
  if (filter.tags && filter.tags.length > 0) {
    filteredSources = filteredSources.filter(source => 
      source.metadata?.tags?.some(tag => filter.tags?.includes(tag))
    );
  }
  
  return filteredSources;
}

/**
 * Get data sources by IDs
 */
export function getDataSourcesByIds(ids: string[]): DataSource[] {
  return availableDataSources.filter(source => ids.includes(source.id));
}

/**
 * Calculate data quality score based on selected data sources
 */
export function calculateDataQualityScore(dataSourceIds: string[]): {
  overallScore: number;
  coverageScore: number;
  reliabilityScore: number;
  freshnessScore: number;
} {
  const dataSources = getDataSourcesByIds(dataSourceIds);
  
  if (dataSources.length === 0) {
    return {
      overallScore: 0,
      coverageScore: 0,
      reliabilityScore: 0,
      freshnessScore: 0
    };
  }
  
  // Calculate reliability score (average reliability of selected sources)
  const reliabilityScore = dataSources.reduce((sum, source) => sum + source.reliability, 0) / dataSources.length;
  
  // Calculate freshness score
  const now = new Date();
  const freshnessScores = dataSources.map(source => {
    const daysSinceUpdate = Math.floor((now.getTime() - source.lastUpdated.getTime()) / (1000 * 60 * 60 * 24));
    // Convert days to a 0-100 score (fresher is better)
    return Math.max(0, 100 - daysSinceUpdate * 2); // Lose 2 points per day
  });
  const freshnessScore = freshnessScores.reduce((sum, score) => sum + score, 0) / freshnessScores.length;
  
  // Calculate coverage score
  // This is a simplified version - in a real app, you'd have more sophisticated logic
  let coverageScore = 0;
  const uniqueRegions = new Set<string>();
  const uniqueTypes = new Set<string>();
  
  dataSources.forEach(source => {
    source.coverage.regions?.forEach(region => uniqueRegions.add(region));
    uniqueTypes.add(source.type);
  });
  
  // More regions and more diverse types = better coverage
  coverageScore = (uniqueRegions.size * 10) + (uniqueTypes.size * 15);
  coverageScore = Math.min(100, coverageScore); // Cap at 100
  
  // Overall score is a weighted average
  const overallScore = (reliabilityScore * 0.4) + (freshnessScore * 0.3) + (coverageScore * 0.3);
  
  return {
    overallScore,
    coverageScore,
    reliabilityScore,
    freshnessScore
  };
}

/**
 * Get recommended data sources for a specific region and analysis type
 */
export function getRecommendedDataSources(
  region: string, 
  analysisType: 'security' | 'economic' | 'political' | 'comprehensive' | 'geospatial'
): DataSource[] {
  let recommendedSources = availableDataSources.filter(source => 
    source.coverage.regions?.includes(region)
  );
  
  // Prioritize different source types based on analysis type
  switch (analysisType) {
    case 'security':
      recommendedSources = recommendedSources.filter(source => 
        ['security', 'intelligence', 'news', 'social', 'satellite'].includes(source.type)
      );
      break;
    case 'economic':
      recommendedSources = recommendedSources.filter(source => 
        ['economic', 'news', 'government', 'academic'].includes(source.type)
      );
      break;
    case 'political':
      recommendedSources = recommendedSources.filter(source => 
        ['government', 'news', 'intelligence', 'ngo', 'social'].includes(source.type)
      );
      break;
    case 'geospatial':
      recommendedSources = recommendedSources.filter(source => 
        ['satellite', 'security', 'intelligence', 'government'].includes(source.type)
      );
      break;
    // comprehensive includes all data sources
  }
  
  // Sort by reliability
  return recommendedSources.sort((a, b) => b.reliability - a.reliability);
}
