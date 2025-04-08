// Types for scenario planning

export interface ScenarioParameters {
  [key: string]: string | number;
}

export type DataInput = string;

export interface DataSource {
  id: string;
  name: string;
  type: 'news' | 'economic' | 'social' | 'government' | 'satellite' | 'security' | 'custom';
  description: string;
  reliability: number;
  lastUpdated: Date;
  coverage: {
    regions?: string[];
    countries?: string[];
    timespan?: {
      start: Date;
      end: Date;
    };
  };
  metadata?: Record<string, any>;
  url?: string;
}

export interface ScenarioTemplate {
  id: string;
  name: string;
  description: string;
  variables: string[];
  defaultTimeHorizon: string;
  recommendedDataSources?: string[]; // IDs of recommended data sources
}

export interface ScenarioStep {
  id: string;
  name: string;
  description: string;
  duration: number;
  impact: {
    stability: number;
    economic: number;
    security: number;
  };
}

export interface ScenarioData {
  name: string;
  description: string;
  timeHorizon: string;
  region: string;
  variables: Record<string, any>;
  steps: ScenarioStep[];
  parameters: ScenarioParameters;
  dataInputs: DataInput[];
  template?: string;
  dataSources: string[]; // IDs of selected data sources
  
  // Advanced scenario options
  aiAssisted?: boolean;
  confidenceInterval?: number;
  monteCarlo?: boolean;
  sensitivityAnalysis?: boolean;
  multiVariateAnalysis?: boolean;
  correlationAnalysis?: boolean;
  customAlgorithms?: string[];
  modelingTechniques?: string[];
}

export type ScenarioStatus = 'draft' | 'running' | 'completed';

export interface ScenarioRun {
  id: string;
  name: string;
  description: string;
  status: ScenarioStatus;
  progress?: number;
  results?: {
    impact: 'high' | 'medium' | 'low';
    confidence: number;
    timeHorizon: string;
    affectedSectors: string[];
    keyOutcomes: string[];
    riskFactors: string[];
    dataSourceQuality?: {
      overallScore: number;
      coverageScore: number;
      reliabilityScore: number;
      freshnessScore: number;
      dataSources: {
        id: string;
        name: string;
        contribution: number;
        reliability: number;
      }[];
    };
  };
  lastRun?: string;
  template: string;
  modelingTechniques?: string[];
  dataQualityScore?: number;
  confidenceThreshold?: number;
  dataSources: string[]; // IDs of data sources used in this run
}
