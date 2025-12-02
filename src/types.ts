export const Severity = {
  CRITICAL: 'Critical',
  HIGH: 'High',
  MEDIUM: 'Medium',
  LOW: 'Low',
} as const;

export type Severity = typeof Severity[keyof typeof Severity];

export const ThreatType = {
  DDOS: 'DDoS',
  SQL_INJECTION: 'SQL Injection',
  MALWARE: 'Malware',
  PHISHING: 'Phishing',
  BRUTE_FORCE: 'Brute Force',
  XSS: 'Cross-Site Scripting',
  ANOMALY: 'Traffic Anomaly',
} as const;

export type ThreatType = typeof ThreatType[keyof typeof ThreatType];

export interface ThreatLog {
  id: string;
  timestamp: string; // ISO string
  sourceIP: string;
  destinationIP: string;
  severity: Severity;
  type: ThreatType;
  confidence: number; // 0-100
  status: 'Detected' | 'Blocked' | 'Monitoring';
  country: string;
}

export interface AIAnalysisResult {
  threatId: string;
  analysis: string;
  remediationSteps: string[];
  riskScore: number;
}