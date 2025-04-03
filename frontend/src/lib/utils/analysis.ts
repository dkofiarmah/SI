import type { Entity, Connection, Alert, ScenarioResults } from '@/types';

interface BaseMetrics {
  timestamp: number;
  value: number;
  confidence?: number;
}

interface SecurityMetrics extends BaseMetrics {
  incidentCount: number;
  riskLevel: 'low' | 'medium' | 'high';
  stabilityIndex: number;
}

interface EconomicMetrics extends BaseMetrics {
  gdp: number;
  inflation: number;
  unemployment: number;
  tradeBalance: number;
}

interface SentimentMetrics extends BaseMetrics {
  sentiment: number;
  volume: number;
  topTopics: string[];
}

interface HistoricalData {
  timeSeries: {
    timestamp: number;
    values: {
      [key: string]: number;
    };
  }[];
  summary: {
    avgConfidence: number;
    coverage: number;
    period: string;
  };
}

interface BaseScenarioData {
  historicalData: HistoricalData;
  indicators: {
    name: string;
    value: number;
    weight: number;
  }[];
}

/**
 * Calculate the risk score for an entity based on various factors
 */
export function calculateRiskScore(
  entity: Entity,
  connections: Connection[],
  recentAlerts: Alert[]
): { score: number; factors: string[] } {
  const factors: string[] = [];
  let score = 0;

  // Base risk based on entity type
  switch (entity.type) {
    case 'person':
      score += 3;
      break;
    case 'organization':
      score += 4;
      break;
    case 'location':
      score += 2;
      break;
  }

  // Connection risk analysis
  const entityConnections = connections.filter(
    c => c.source === entity.id || c.target === entity.id
  );
  
  const highRiskConnections = entityConnections.filter(c => c.strength === 'Strong');
  if (highRiskConnections.length > 3) {
    score += 2;
    factors.push('Multiple high-strength connections');
  }

  // Recent alerts impact
  const relevantAlerts = recentAlerts.filter(alert => 
    alert.relatedEntities?.includes(entity.id)
  );
  
  const criticalAlerts = relevantAlerts.filter(a => a.severity === 'high');
  if (criticalAlerts.length > 0) {
    score += criticalAlerts.length;
    factors.push(`${criticalAlerts.length} critical alerts`);
  }

  return {
    score: Math.min(10, score),
    factors
  };
}

/**
 * Analyze network centrality and influence
 */
export function analyzeNetworkInfluence(
  entity: Entity,
  connections: Connection[]
): { influence: number; reach: number; keyNodes: string[] } {
  const directConnections = connections.filter(
    c => c.source === entity.id || c.target === entity.id
  );
  
  const strongConnections = directConnections.filter(c => c.strength === 'Strong');
  const mediumConnections = directConnections.filter(c => c.strength === 'Medium');
  
  const influence = (
    (strongConnections.length * 2) +
    (mediumConnections.length * 1)
  ) / Math.max(1, directConnections.length);

  // Find connected nodes up to 2 degrees of separation
  const connectedNodes = new Set<string>();
  
  // First degree
  directConnections.forEach(c => {
    connectedNodes.add(c.source === entity.id ? c.target : c.source);
  });
  
  // Second degree
  directConnections.forEach(primary => {
    const secondaryConnections = connections.filter(c =>
      c.source === primary.target || c.target === primary.target
    );
    secondaryConnections.forEach(c => {
      connectedNodes.add(c.source === primary.target ? c.target : c.source);
    });
  });

  // Remove the original entity
  connectedNodes.delete(entity.id);

  return {
    influence: Math.min(10, influence * 2),
    reach: connectedNodes.size,
    keyNodes: Array.from(connectedNodes).slice(0, 5) // Top 5 connected nodes
  };
}

/**
 * Process scenario results to generate insights
 */
export function processScenarioResults(
  baseData: BaseScenarioData,
  variables: Record<string, number | string>,
  timeHorizon: string
): ScenarioResults {
  const impact = calculateScenarioImpact(variables);
  const confidence = calculateConfidenceScore(variables, baseData);
  
  return {
    impact,
    confidence,
    timeHorizon,
    affectedSectors: determineAffectedSectors(variables, impact),
    keyOutcomes: generateKeyOutcomes(variables, impact),
    riskFactors: identifyRiskFactors(variables, baseData)
  };
}

// Helper functions for scenario processing
function calculateScenarioImpact(
  variables: Record<string, number | string>
): 'high' | 'medium' | 'low' {
  const severity = typeof variables.severity === 'number' ? variables.severity : 0;
  const duration = typeof variables.duration === 'number' ? variables.duration : 0;
  
  const impactScore = (severity * 0.7) + (duration * 0.3);
  
  if (impactScore >= 7) return 'high';
  if (impactScore >= 4) return 'medium';
  return 'low';
}

function calculateConfidenceScore(
  variables: Record<string, number | string>,
  baseData: BaseScenarioData
): number {
  // Start with base confidence
  let confidence = 75;
  
  // Adjust based on data quality and completeness
  const dataPoints = Object.keys(variables).length;
  confidence += Math.min(15, dataPoints * 2); // More variables = higher confidence
  
  // Adjust for historical data availability
  if (baseData.historicalData) {
    confidence += 10;
  }
  
  return Math.min(100, Math.max(0, confidence));
}

function determineAffectedSectors(
  variables: Record<string, number | string>,
  impact: 'high' | 'medium' | 'low'
): string[] {
  const sectors = new Set<string>();
  
  // Add sectors based on variables and impact
  if (variables.economicImpact || impact === 'high') {
    sectors.add('Banking');
    sectors.add('Trade');
  }
  
  if (variables.infrastructureImpact) {
    sectors.add('Infrastructure');
    sectors.add('Transportation');
  }
  
  if (variables.socialImpact || impact === 'high') {
    sectors.add('Public Services');
    sectors.add('Healthcare');
  }
  
  return Array.from(sectors);
}

function generateKeyOutcomes(
  variables: Record<string, number | string>,
  impact: 'high' | 'medium' | 'low'
): string[] {
  const outcomes: string[] = [];
  
  // Generate outcomes based on variables and impact
  if (impact === 'high') {
    outcomes.push('Significant market disruption likely');
    outcomes.push('Long-term policy changes expected');
  }
  
  if (variables.economicImpact) {
    outcomes.push(`${variables.economicImpact}% projected economic impact`);
  }
  
  if (variables.duration) {
    outcomes.push(`Effects expected to last ${variables.duration} months`);
  }
  
  return outcomes;
}

function identifyRiskFactors(
  variables: Record<string, number | string>,
  baseData: BaseScenarioData
): string[] {
  const factors = new Set<string>();
  
  // Identify risk factors based on variables and historical data
  if (variables.economicImpact && Number(variables.economicImpact) > 5) {
    factors.add('Market Volatility');
    factors.add('Investment Uncertainty');
  }
  
  if (variables.politicalInstability) {
    factors.add('Political Instability');
    factors.add('Policy Changes');
  }
  
  if (variables.infrastructureImpact) {
    factors.add('Infrastructure Disruption');
    factors.add('Supply Chain Risks');
  }
  
  return Array.from(factors);
}

/**
 * Generate a confidence score for analysis results
 */
export function generateConfidenceScore(
  dataPoints: number,
  dataQuality: number,
  historicalData: boolean,
  externalFactors: number
): number {
  let score = 0;
  
  // Data points contribution (max 30)
  score += Math.min(30, dataPoints * 2);
  
  // Data quality contribution (max 30)
  score += Math.min(30, dataQuality * 3);
  
  // Historical data bonus (20)
  if (historicalData) {
    score += 20;
  }
  
  // External factors impact (max 20)
  score += Math.min(20, externalFactors * 2);
  
  return Math.min(100, score);
}

/**
 * Calculate stability index for a region or country
 */
export function calculateStabilityIndex(
  politicalStability: number,
  economicStability: number,
  securityLevel: number,
  socialCohesion: number
): number {
  const weights = {
    political: 0.3,
    economic: 0.3,
    security: 0.25,
    social: 0.15
  };
  
  return Math.min(10, Math.max(0,
    (politicalStability * weights.political) +
    (economicStability * weights.economic) +
    (securityLevel * weights.security) +
    (socialCohesion * weights.social)
  ));
}

/**
 * Calculate security trends based on historical data
 */
export function calculateSecurityTrends(
  baseData: SecurityMetrics[],
  startDate: Date,
  endDate: Date
): { trend: number; confidence: number } {
  return calculateTrendMetrics(startDate, endDate);
}

/**
 * Analyze economic impact based on historical data
 */
export function analyzeEconomicImpact(
  baseData: EconomicMetrics[],
  timeframe: string
): { impact: number; confidence: number } {
  // Placeholder implementation with basic metrics
  const impact = 0.7;  // Scale of 0-1
  const confidence = 0.85;  // Scale of 0-1
  
  return { impact, confidence };
}

/**
 * Analyze sentiment trends based on historical data
 */
export function analyzeSentimentTrends(
  baseData: SentimentMetrics[],
  region: string
): { sentiment: number; confidence: number } {
  // Placeholder implementation
  const sentiment = 0.65;  // Scale of 0-1 where 0.5 is neutral
  const confidence = 0.75;  // Scale of 0-1
  
  return { sentiment, confidence };
}

/**
 * Calculate trend metrics
 */
export function calculateTrendMetrics(
  startDate: Date,
  endDate: Date
): { trend: number; confidence: number } {
  // Placeholder implementation
  return {
    trend: 0.5,  // Default trend value
    confidence: 0.8  // Default confidence value
  };
}
