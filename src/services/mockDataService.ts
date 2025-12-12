import type { ThreatLog } from '../types';
import { Severity, ThreatType } from '../types';

// Weighted list to ensure Zimbabwe appears most frequently as requested
const COUNTRIES = [
  'Zimbabwe', 'Zimbabwe', 'Zimbabwe', 'Zimbabwe', 'Zimbabwe',
  'South Africa', 'South Africa', 'South Africa',
  'Nigeria', 'Nigeria',
  'Kenya',
  'Egypt',
  'Ghana',
  'Morocco',
  'USA', 
  'China', 
  'Russia', 
  'Germany', 
  'Brazil', 
  'France',
  'Unknown'
];

// Added some IP prefixes that are common in African regions (e.g., 41.x, 197.x, 102.x, 154.x)
const IPS_PREFIXES = [
  '192.168.', '10.0.', '172.16.', 
  '45.33.', '8.8.', '123.45.',
  '41.223.', '197.210.', '102.141.', '154.120.', '105.16.'
];

const randomItem = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
const randomIP = () => `${randomItem(IPS_PREFIXES)}${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;

export const generateMockLog = (): ThreatLog => {
  const severityRoll = Math.random();
  let severity: typeof Severity[keyof typeof Severity] = Severity.LOW;
  if (severityRoll > 0.95) severity = Severity.CRITICAL;
  else if (severityRoll > 0.8) severity = Severity.HIGH;
  else if (severityRoll > 0.5) severity = Severity.MEDIUM;

  const typeValues = Object.values(ThreatType);
  const type = randomItem(typeValues);
  
  return {
    id: Math.random().toString(36).substr(2, 9),
    timestamp: new Date().toISOString(),
    sourceIP: randomIP(),
    destinationIP: '192.168.1.100', // Server IP
    severity,
    type,
    confidence: Math.floor(Math.random() * 20) + 80, // 80-99%
    status: severity === Severity.CRITICAL ? 'Blocked' : 'Detected',
    country: randomItem(COUNTRIES),
  };
};

export const generateHistory = (count: number): ThreatLog[] => {
  const logs: ThreatLog[] = [];
  const now = Date.now();
  for (let i = 0; i < count; i++) {
    const log = generateMockLog();
    // Offset timestamp back in time
    log.timestamp = new Date(now - i * 60000 * (Math.random() * 10)).toISOString();
    logs.push(log);
  }
  return logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
};