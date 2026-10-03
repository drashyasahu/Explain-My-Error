// ============================================================
// ExplainMyError — Type Definitions
// ============================================================

export interface AnalysisRequest {
  language?: string;
  framework?: string;
  problemType?: string;
  mode?: 'ERROR_ANALYSIS' | 'CODE_EXPLANATION' | 'CODE_REVIEW';
  input: string;
  expectedBehavior?: string;
  explanationLevel?: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
}

export interface ErrorLocation {
  file?: string;
  line?: number;
  description?: string;
  codeSnippet?: string;
}

export interface ProbableCause {
  cause: string;
  confidence: number;
  rank: number;
}

export interface SuggestedFix {
  explanation: string;
  originalCode?: string;
  fixedCode?: string;
  whyItWorks?: string;
}

export interface AlternativeFix {
  fixType: 'RECOMMENDED' | 'ALTERNATIVE' | 'QUICK_WORKAROUND';
  description: string;
  rank: number;
}

export interface AnalysisResponse {
  id: number;
  language?: string;
  framework?: string;
  problemType?: string;
  mode?: string;
  errorName?: string;
  severity?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  confidence?: number;
  whatHappened?: string;
  whyItHappened?: string;
  rootCause?: string;
  errorLocation?: ErrorLocation;
  probableCauses?: ProbableCause[];
  debuggingSteps?: string[];
  suggestedFix?: SuggestedFix;
  alternativeFixes?: AlternativeFix[];
  prevention?: string;
  relatedConcepts?: string[];
  explanationLevel?: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface FollowUpMessage {
  role: 'USER' | 'ASSISTANT';
  message: string;
  createdAt: string;
}

export interface SessionEntry {
  id: number;
  analysisId?: number;
  stepNumber: number;
  stepStatus: 'CURRENT' | 'APPLIED' | 'RESOLVED' | 'PARTIALLY_RESOLVED' | 'NEW_ERROR' | 'SAME_ERROR';
  userInput?: string;
  aiSummary?: string;
  resolutionNote?: string;
  createdAt: string;
  analysis?: AnalysisResponse;
}

export interface DebugSession {
  id: number;
  title: string;
  status: 'ACTIVE' | 'RESOLVED';
  createdAt: string;
  updatedAt: string;
  entries: SessionEntry[];
}

export interface AuthUser {
  userId: number;
  name: string;
  email: string;
  role: string;
  token: string;
  preferredExplanationLevel: string;
  defaultLanguage: string;
  theme: string;
}

export interface Statistics {
  totalAnalyses: number;
  totalDebugSessions: number;
  resolvedDebugSessions: number;
  byLanguage: { language: string; count: number }[];
  bySeverity: { severity: string; count: number }[];
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: { code: string; message: string };
}

export const LANGUAGES = [
  'AUTO', 'Java', 'Python', 'JavaScript', 'TypeScript', 'C', 'C++', 'C#',
  'Go', 'Rust', 'Kotlin', 'PHP', 'Ruby', 'Swift', 'Dart', 'SQL', 'HTML',
  'CSS', 'Bash', 'Other'
];

export const PROBLEM_TYPES = [
  'Unknown', 'Compiler Error', 'Runtime Error', 'Build Error', 'Framework Error',
  'Database Error', 'Configuration Error', 'Logic Bug', 'Performance Issue', 'Security Issue'
];

export const EXPLANATION_LEVELS = ['BEGINNER', 'INTERMEDIATE', 'ADVANCED'];
