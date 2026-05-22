export type CategoryId =
  | "content-creation"
  | "assessment-gamification"
  | "collaboration-communication"
  | "lms-management"
  | "interactive-learning"
  | "ai-tools"
  | "programming-coding"
  | "educational-resources"
  | "productivity"
  | "visual-thinking";

export interface ToolCategory {
  id: CategoryId;
  name: string;
  shortName: string; // e.g., "CC" for Content Creation
  description: string;
  colorClass: string; // Tailwind bg/text classes
  borderClass: string;
  hoverClass: string;
  activeClass: string;
  textClass: string;
  gradientClass: string;
  iconName: string; // Lucide icon identifier
}

export interface Tool {
  id: string;
  name: string;
  symbol: string;      // E.g., "Cv", "Kh"
  atomicNumber: number; // 1 to 23+
  period: number;       // Row in periodic table (1-5 or 6)
  group: number;        // Column in periodic table (1-18)
  category: CategoryId;
  description: string;
  mainPedagogicalUse: string;
  bestFor: string[];
  subjects: string[];
  educationLevel: string[];
  teachingScenarios: string[];
  officialWebsite: string;
  priceModel: "Free" | "Freemium" | "Paid";
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  isAiPowered: boolean;
  isCollaborative: boolean;
  isAssessment: boolean;
}

export interface OnboardingState {
  completed: boolean;
  subjects: string[];
  purpose: string[];
  experience: "Beginner" | "Intermediate" | "Advanced" | "";
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  iconName: string;
  unlockedAt: string | null; // ISO Date or null if locked
  categoryRequirement?: CategoryId;
  countRequirement?: number;
  xpValue: number;
}

export interface TeacherProfile {
  name: string;
  role: string;
  school: string;
  xp: number;
  level: number;
  favorites: string[]; // Tool IDs
  recentlyViewed: string[]; // Tool IDs
  badges: string[]; // Badge IDs
  onboarding: OnboardingState;
  completedCategories: CategoryId[]; // Categories where all tools have been viewed
  viewedToolsCount: number;
  dailyDiscoveryDone: boolean;
}

export interface ChatMessage {
  role: "user" | "model";
  text: string;
  timestamp: string;
  suggestedTools?: string[]; // IDs of tools relevant to this response
}
