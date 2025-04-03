/**
 * Format large numbers with K, M, B suffixes
 */
export function formatNumber(num: number): string {
  if (num >= 1000000000) {
    return (num / 1000000000).toFixed(1) + 'B';
  }
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
}

/**
 * Format a date relative to now (e.g., "2 hours ago")
 */
export function formatRelativeTime(date: Date | string): string {
  const now = new Date();
  const past = new Date(date);
  const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return 'just now';
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes}m ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours}h ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays}d ago`;
  }

  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 4) {
    return `${diffInWeeks}w ago`;
  }

  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return `${diffInMonths}mo ago`;
  }

  return `${Math.floor(diffInMonths / 12)}y ago`;
}

/**
 * Format a percentage with optional decimal places
 */
export function formatPercentage(value: number, decimals: number = 1): string {
  return `${value.toFixed(decimals)}%`;
}

/**
 * Format currency values
 */
export function formatCurrency(
  amount: number,
  currency: string = 'USD',
  locale: string = 'en-US'
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(amount);
}

/**
 * Generate color scale for risk levels
 */
export function getRiskColor(
  risk: number,
  format: 'hex' | 'rgb' = 'hex'
): string {
  // Risk should be between 0 and 10
  const normalizedRisk = Math.min(10, Math.max(0, risk));
  
  // Color stops for risk gradient (green to yellow to red)
  const colorStops = [
    { risk: 0, color: { r: 34, g: 197, b: 94 } },   // Green
    { risk: 5, color: { r: 234, g: 179, b: 8 } },   // Yellow
    { risk: 10, color: { r: 239, g: 68, b: 68 } }   // Red
  ];
  
  // Find the two color stops to interpolate between
  let startStop = colorStops[0];
  let endStop = colorStops[1];
  
  for (let i = 0; i < colorStops.length - 1; i++) {
    if (normalizedRisk >= colorStops[i].risk && normalizedRisk <= colorStops[i + 1].risk) {
      startStop = colorStops[i];
      endStop = colorStops[i + 1];
      break;
    }
  }
  
  // Calculate the interpolation factor
  const range = endStop.risk - startStop.risk;
  const factor = (normalizedRisk - startStop.risk) / range;
  
  // Interpolate RGB values
  const r = Math.round(startStop.color.r + (endStop.color.r - startStop.color.r) * factor);
  const g = Math.round(startStop.color.g + (endStop.color.g - startStop.color.g) * factor);
  const b = Math.round(startStop.color.b + (endStop.color.b - startStop.color.b) * factor);
  
  if (format === 'rgb') {
    return `rgb(${r}, ${g}, ${b})`;
  }
  
  // Convert to hex
  const toHex = (n: number) => n.toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

/**
 * Format a time duration in a human-readable way
 */
export function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes}m`;
  }
  
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  if (hours < 24) {
    return remainingMinutes ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
  }
  
  const days = Math.floor(hours / 24);
  const remainingHours = hours % 24;
  
  if (remainingHours) {
    return `${days}d ${remainingHours}h`;
  }
  
  return `${days}d`;
}

/**
 * Format a confidence score with appropriate styling classes
 */
export function getConfidenceClasses(score: number): {
  text: string;
  background: string;
  border: string;
} {
  if (score >= 80) {
    return {
      text: 'text-green-800',
      background: 'bg-green-100',
      border: 'border-green-200'
    };
  }
  
  if (score >= 60) {
    return {
      text: 'text-yellow-800',
      background: 'bg-yellow-100',
      border: 'border-yellow-200'
    };
  }
  
  return {
    text: 'text-red-800',
    background: 'bg-red-100',
    border: 'border-red-200'
  };
}

/**
 * Generate severity indicator classes
 */
export function getSeverityClasses(
  severity: 'high' | 'medium' | 'low'
): {
  text: string;
  background: string;
  border: string;
  icon: string;
} {
  switch (severity) {
    case 'high':
      return {
        text: 'text-red-800',
        background: 'bg-red-100',
        border: 'border-red-200',
        icon: 'text-red-500'
      };
    case 'medium':
      return {
        text: 'text-yellow-800',
        background: 'bg-yellow-100',
        border: 'border-yellow-200',
        icon: 'text-yellow-500'
      };
    case 'low':
      return {
        text: 'text-green-800',
        background: 'bg-green-100',
        border: 'border-green-200',
        icon: 'text-green-500'
      };
  }
}

/**
 * Format connection strength with appropriate classes
 */
export function getConnectionStrengthClasses(
  strength: 'Strong' | 'Medium' | 'Weak'
): {
  text: string;
  background: string;
  lineStyle: string;
} {
  switch (strength) {
    case 'Strong':
      return {
        text: 'text-blue-800',
        background: 'bg-blue-100',
        lineStyle: 'border-2 border-blue-500'
      };
    case 'Medium':
      return {
        text: 'text-purple-800',
        background: 'bg-purple-100',
        lineStyle: 'border border-purple-500'
      };
    case 'Weak':
      return {
        text: 'text-gray-800',
        background: 'bg-gray-100',
        lineStyle: 'border border-gray-400 border-dashed'
      };
  }
}

/**
 * Format entity type with appropriate classes and icon name
 */
export function getEntityTypeConfig(
  type: 'person' | 'organization' | 'location'
): {
  icon: string;
  background: string;
  text: string;
} {
  switch (type) {
    case 'person':
      return {
        icon: 'User',
        background: 'bg-blue-500',
        text: 'text-blue-800'
      };
    case 'organization':
      return {
        icon: 'Building',
        background: 'bg-purple-500',
        text: 'text-purple-800'
      };
    case 'location':
      return {
        icon: 'Globe',
        background: 'bg-green-500',
        text: 'text-green-800'
      };
  }
}
