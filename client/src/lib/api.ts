import { apiRequest } from "./queryClient";

export interface DashboardStats {
  totalKeywords: number;
  avgPosition: number;
  totalBacklinks: number;
  organicTraffic: number;
}

export interface Website {
  id: number;
  domain: string;
  name: string;
  isActive: boolean;
}

export interface Keyword {
  id: number;
  websiteId: number;
  keyword: string;
  currentPosition: number | null;
  previousPosition: number | null;
  searchVolume: number | null;
  difficulty: number | null;
}

export interface Backlink {
  id: number;
  websiteId: number;
  sourceUrl: string;
  targetUrl: string;
  anchorText: string | null;
  domainAuthority: number | null;
  status: string;
  isNofollow: boolean;
}

export interface ContentAnalysis {
  id: number;
  websiteId: number;
  url: string;
  title: string | null;
  metaDescription: string | null;
  seoScore: number | null;
  readabilityScore: number | null;
  suggestions: any;
}

export interface TechnicalAudit {
  id: number;
  websiteId: number;
  pageSpeed: number | null;
  mobileScore: number | null;
  brokenLinks: number | null;
  missingAltTags: number | null;
  missingMetaTags: number | null;
  issues: any;
}

// API functions
export const api = {
  // Dashboard
  getDashboardStats: async (websiteId: number): Promise<DashboardStats> => {
    const res = await apiRequest("GET", `/api/dashboard/stats/${websiteId}`);
    return res.json();
  },

  // Websites
  getWebsites: async (): Promise<Website[]> => {
    const res = await apiRequest("GET", "/api/websites");
    return res.json();
  },

  createWebsite: async (data: { userId: number; domain: string; name: string }): Promise<Website> => {
    const res = await apiRequest("POST", "/api/websites", data);
    return res.json();
  },

  // Keywords
  getKeywords: async (websiteId: number): Promise<Keyword[]> => {
    const res = await apiRequest("GET", `/api/keywords/${websiteId}`);
    return res.json();
  },

  createKeyword: async (data: { websiteId: number; keyword: string; targetUrl?: string; searchVolume?: number; difficulty?: number }): Promise<Keyword> => {
    const res = await apiRequest("POST", "/api/keywords", data);
    return res.json();
  },

  // Backlinks
  getBacklinks: async (websiteId: number): Promise<Backlink[]> => {
    const res = await apiRequest("GET", `/api/backlinks/${websiteId}`);
    return res.json();
  },

  getPendingBacklinks: async (websiteId: number): Promise<Backlink[]> => {
    const res = await apiRequest("GET", `/api/backlinks/${websiteId}/pending`);
    return res.json();
  },

  discoverBacklinkOpportunities: async (data: { domain: string; targetKeywords: string[]; niche: string }): Promise<{ opportunities: any[] }> => {
    const res = await apiRequest("POST", "/api/backlinks/discover", data);
    return res.json();
  },

  updateBacklinkStatus: async (id: number, status: string): Promise<{ success: boolean }> => {
    const res = await apiRequest("PATCH", `/api/backlinks/${id}/status`, { status });
    return res.json();
  },

  // Content Analysis
  analyzeContent: async (data: {
    websiteId: number;
    url?: string;
    content?: string;
    title?: string;
    metaDescription?: string;
    targetKeywords?: string[];
  }): Promise<ContentAnalysis> => {
    const res = await apiRequest("POST", "/api/content/analyze", data);
    return res.json();
  },

  generateContent: async (data: {
    topic: string;
    targetKeywords: string[];
    contentType?: string;
    wordCount?: number;
  }): Promise<{
    title: string;
    content: string;
    metaDescription: string;
    keywords: string[];
  }> => {
    const res = await apiRequest("POST", "/api/content/generate", data);
    return res.json();
  },

  getContentAnalyses: async (websiteId: number): Promise<ContentAnalysis[]> => {
    const res = await apiRequest("GET", `/api/content/${websiteId}`);
    return res.json();
  },

  // Technical Audit
  performAudit: async (websiteId: number, domain: string): Promise<TechnicalAudit> => {
    const res = await apiRequest("POST", `/api/audit/${websiteId}`, { domain });
    return res.json();
  },

  getLatestAudit: async (websiteId: number): Promise<TechnicalAudit | null> => {
    const res = await apiRequest("GET", `/api/audit/${websiteId}/latest`);
    return res.json();
  },

  // Automation Features

  optimizeContent: async (data: { content: string; targetKeywords: string[] }) => {
    const res = await apiRequest("POST", "/api/content/optimize", data);
    return res.json();
  },

  analyzeOnPageSEO: async (data: { url: string; content: string; targetKeywords: string[] }) => {
    const res = await apiRequest("POST", "/api/onpage/analyze", data);
    return res.json();
  },

  analyzeCompetitors: async (data: { yourDomain: string; competitorDomains: string[]; niche: string }) => {
    const res = await apiRequest("POST", "/api/competitors/analyze", data);
    return res.json();
  },

  generateLocalSEOTasks: async (data: { businessName: string; location: string; businessType: string }) => {
    const res = await apiRequest("POST", "/api/local-seo/generate-tasks", data);
    return res.json();
  },

  generateSocialMediaPosts: async (data: { content: string; platforms: string[]; targetKeywords: string[] }) => {
    const res = await apiRequest("POST", "/api/social-media/generate-posts", data);
    return res.json();
  },

  getRankTracking: async (websiteId: number) => {
    const res = await apiRequest("GET", `/api/rank-tracking/${websiteId}`);
    return res.json();
  },

  updateRankings: async (data: { websiteId: number }) => {
    const res = await apiRequest("POST", "/api/rank-tracking/update", data);
    return res.json();
  },
};
