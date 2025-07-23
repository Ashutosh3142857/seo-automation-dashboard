import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { analyzeContent, optimizeContent, findBacklinkOpportunities, analyzeOnPageSEO, analyzeCompetitors, generateContent, generateLocalSEOTasks, generateSocialMediaPosts } from "./services/openai";
import { performTechnicalAudit, analyzePageContent, discoverBacklinkOpportunities } from "./services/seo";
import { insertWebsiteSchema, insertKeywordSchema, insertBacklinkSchema, insertContentAnalysisSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Dashboard stats
  app.get("/api/dashboard/stats/:websiteId", async (req, res) => {
    try {
      const websiteId = parseInt(req.params.websiteId);
      
      const [keywords, backlinks, audit, localData] = await Promise.all([
        storage.getKeywordsByWebsiteId(websiteId),
        storage.getBacklinksByWebsiteId(websiteId),
        storage.getLatestTechnicalAudit(websiteId),
        storage.getLocalSeoData(websiteId)
      ]);
      
      const totalKeywords = keywords.length;
      const avgPosition = keywords.length > 0 
        ? keywords.reduce((sum, k) => sum + (k.currentPosition || 0), 0) / keywords.length 
        : 0;
      const totalBacklinks = backlinks.length;
      const organicTraffic = 24892; // Would be calculated from actual analytics
      
      res.json({
        totalKeywords,
        avgPosition: Math.round(avgPosition * 10) / 10,
        totalBacklinks,
        organicTraffic
      });
    } catch (error) {
      console.error('Dashboard stats error:', error);
      res.status(500).json({ message: "Failed to fetch dashboard stats" });
    }
  });

  // Websites
  app.get("/api/websites", async (req, res) => {
    try {
      // In a real app, you'd get userId from session/auth
      const userId = 1; // Mock user ID
      const websites = await storage.getWebsitesByUserId(userId);
      res.json(websites);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch websites" });
    }
  });

  app.post("/api/websites", async (req, res) => {
    try {
      const websiteData = insertWebsiteSchema.parse(req.body);
      const website = await storage.createWebsite(websiteData);
      res.json(website);
    } catch (error) {
      res.status(400).json({ message: "Invalid website data" });
    }
  });

  // Keywords
  app.get("/api/keywords/:websiteId", async (req, res) => {
    try {
      const websiteId = parseInt(req.params.websiteId);
      const keywords = await storage.getKeywordsByWebsiteId(websiteId);
      res.json(keywords);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch keywords" });
    }
  });

  app.post("/api/keywords", async (req, res) => {
    try {
      const keywordData = insertKeywordSchema.parse(req.body);
      const keyword = await storage.createKeyword(keywordData);
      res.json(keyword);
    } catch (error) {
      res.status(400).json({ message: "Invalid keyword data" });
    }
  });

  // Backlinks
  app.get("/api/backlinks/:websiteId", async (req, res) => {
    try {
      const websiteId = parseInt(req.params.websiteId);
      const backlinks = await storage.getBacklinksByWebsiteId(websiteId);
      res.json(backlinks);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch backlinks" });
    }
  });

  app.get("/api/backlinks/:websiteId/pending", async (req, res) => {
    try {
      const websiteId = parseInt(req.params.websiteId);
      const pendingBacklinks = await storage.getPendingBacklinks(websiteId);
      res.json(pendingBacklinks);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch pending backlinks" });
    }
  });

  app.post("/api/backlinks/:websiteId/discover", async (req, res) => {
    try {
      const websiteId = parseInt(req.params.websiteId);
      const { domain, keywords, industry } = req.body;
      
      const opportunities = await discoverBacklinkOpportunities(domain, keywords, industry);
      
      // Save discovered opportunities to database
      const savedOpportunities = await Promise.all(
        opportunities.map(opp => 
          storage.createBacklink({
            websiteId,
            sourceUrl: opp.sourceUrl,
            targetUrl: opp.targetUrl,
            anchorText: opp.anchorText,
            domainAuthority: opp.domainAuthority,
            status: opp.status,
            isNofollow: opp.isNofollow
          })
        )
      );
      
      res.json(savedOpportunities);
    } catch (error) {
      console.error('Backlink discovery error:', error);
      res.status(500).json({ message: "Failed to discover backlink opportunities" });
    }
  });

  app.patch("/api/backlinks/:id/status", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { status } = req.body;
      
      if (!['pending', 'approved', 'rejected'].includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
      }
      
      await storage.updateBacklinkStatus(id, status);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Failed to update backlink status" });
    }
  });

  // Content Analysis
  app.post("/api/content/analyze", async (req, res) => {
    try {
      const { url, content, title, metaDescription, targetKeywords, websiteId } = req.body;
      
      let analysisContent = content;
      let analysisTitle = title;
      let analysisMetaDescription = metaDescription;
      
      // If URL is provided, scrape the content
      if (url) {
        const pageAnalysis = await analyzePageContent(url);
        analysisContent = pageAnalysis.content;
        analysisTitle = pageAnalysis.title;
        analysisMetaDescription = pageAnalysis.metaDescription;
      }
      
      const seoAnalysis = await analyzeContent(analysisContent, targetKeywords || []);
      
      // Save analysis to database
      const contentAnalysis = await storage.createContentAnalysis({
        websiteId: parseInt(websiteId),
        url: url || '',
        title: analysisTitle,
        metaDescription: analysisMetaDescription,
        content: analysisContent,
        keywordDensity: seoAnalysis.keywordDensity,
        readabilityScore: seoAnalysis.readabilityScore,
        seoScore: seoAnalysis.structureScore,
        suggestions: seoAnalysis.suggestions
      });
      
      res.json(contentAnalysis);
    } catch (error) {
      console.error('Content analysis error:', error);
      res.status(500).json({ message: "Failed to analyze content" });
    }
  });

  app.post("/api/content/generate", async (req, res) => {
    try {
      const { topic, targetKeywords, contentType, wordCount } = req.body;
      
      const generatedContent = await generateContent(
        contentType || 'blog_post',
        topic,
        targetKeywords || [],
        wordCount || 800
      );
      
      res.json({ content: generatedContent });
    } catch (error) {
      console.error('Content generation error:', error);
      res.status(500).json({ message: "Failed to generate content" });
    }
  });

  app.get("/api/content/:websiteId", async (req, res) => {
    try {
      const websiteId = parseInt(req.params.websiteId);
      const contentAnalyses = await storage.getContentAnalysisByWebsiteId(websiteId);
      res.json(contentAnalyses);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch content analyses" });
    }
  });

  // Technical Audit
  app.post("/api/audit/:websiteId", async (req, res) => {
    try {
      const websiteId = parseInt(req.params.websiteId);
      const { domain } = req.body;
      
      const auditResult = await performTechnicalAudit(domain);
      
      const savedAudit = await storage.createTechnicalAudit({
        websiteId,
        pageSpeed: auditResult.pageSpeed,
        mobileScore: auditResult.mobileScore,
        brokenLinks: auditResult.brokenLinks,
        missingAltTags: auditResult.missingAltTags,
        missingMetaTags: auditResult.missingMetaTags,
        duplicateContent: auditResult.duplicateContent,
        issues: auditResult.issues
      });
      
      res.json(savedAudit);
    } catch (error) {
      console.error('Technical audit error:', error);
      res.status(500).json({ message: "Failed to perform technical audit" });
    }
  });

  app.get("/api/audit/:websiteId/latest", async (req, res) => {
    try {
      const websiteId = parseInt(req.params.websiteId);
      const audit = await storage.getLatestTechnicalAudit(websiteId);
      res.json(audit);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch latest audit" });
    }
  });

  // Local SEO
  app.get("/api/local-seo/:websiteId", async (req, res) => {
    try {
      const websiteId = parseInt(req.params.websiteId);
      const localData = await storage.getLocalSeoData(websiteId);
      res.json(localData);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch local SEO data" });
    }
  });

  // Competitor Analysis
  app.get("/api/competitors/:websiteId", async (req, res) => {
    try {
      const websiteId = parseInt(req.params.websiteId);
      const analyses = await storage.getCompetitorAnalysisByWebsiteId(websiteId);
      res.json(analyses);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch competitor analyses" });
    }
  });

  app.post("/api/competitors/analyze", async (req, res) => {
    try {
      const { yourDomain, competitorDomains, niche } = req.body;
      const analysis = await analyzeCompetitors(yourDomain, competitorDomains, niche);
      res.json({ analyses: analysis });
    } catch (error) {
      console.error('Competitor analysis error:', error);
      res.status(500).json({ message: "Failed to analyze competitors" });
    }
  });

  // On-Page SEO Automation
  app.post("/api/onpage/analyze", async (req, res) => {
    try {
      const { url, content, targetKeywords } = req.body;
      const analysis = await analyzeOnPageSEO(url, content, targetKeywords);
      res.json(analysis);
    } catch (error) {
      console.error('On-page SEO analysis error:', error);
      res.status(500).json({ message: "Failed to analyze on-page SEO" });
    }
  });

  // Content Optimization 
  app.post("/api/content/optimize", async (req, res) => {
    try {
      const { content, targetKeywords } = req.body;
      const optimizedContent = await optimizeContent(content, targetKeywords);
      res.json({ optimizedContent });
    } catch (error) {
      console.error('Content optimization error:', error);
      res.status(500).json({ message: "Failed to optimize content" });
    }
  });

  // Backlink Generation
  app.post("/api/backlinks/discover", async (req, res) => {
    try {
      const { domain, targetKeywords, niche } = req.body;
      const opportunities = await findBacklinkOpportunities(domain, targetKeywords, niche);
      res.json({ opportunities });
    } catch (error) {
      console.error('Backlink discovery error:', error);
      res.status(500).json({ message: "Failed to discover backlink opportunities" });
    }
  });

  // Local SEO Automation
  app.post("/api/local-seo/generate-tasks", async (req, res) => {
    try {
      const { businessName, location, businessType } = req.body;
      const tasks = await generateLocalSEOTasks(businessName, location, businessType);
      res.json({ tasks });
    } catch (error) {
      console.error('Local SEO task generation error:', error);
      res.status(500).json({ message: "Failed to generate local SEO tasks" });
    }
  });

  // Social Media SEO Integration
  app.post("/api/social-media/generate-posts", async (req, res) => {
    try {
      const { content, platforms, targetKeywords } = req.body;
      const posts = await generateSocialMediaPosts(content, platforms, targetKeywords);
      res.json({ posts });
    } catch (error) {
      console.error('Social media post generation error:', error);
      res.status(500).json({ message: "Failed to generate social media posts" });
    }
  });

  // Rank Tracking (Mock implementation for now)
  app.get("/api/rank-tracking/:websiteId", async (req, res) => {
    try {
      const websiteId = parseInt(req.params.websiteId);
      const keywords = await storage.getKeywordsByWebsiteId(websiteId);
      
      // In real implementation, this would check actual SERP positions
      const trackingData = keywords.map(keyword => ({
        id: keyword.id,
        keyword: keyword.keyword,
        currentPosition: keyword.currentPosition || Math.floor(Math.random() * 100) + 1,
        previousPosition: keyword.currentPosition ? keyword.currentPosition + Math.floor(Math.random() * 10) - 5 : null,
        searchVolume: Math.floor(Math.random() * 10000) + 100,
        difficulty: Math.floor(Math.random() * 100) + 1,
        url: `https://example.com/page-${keyword.id}`,
        lastChecked: new Date().toISOString()
      }));
      
      res.json({ keywords: trackingData });
    } catch (error) {
      console.error('Rank tracking error:', error);
      res.status(500).json({ message: "Failed to fetch rank tracking data" });
    }
  });

  app.post("/api/rank-tracking/update", async (req, res) => {
    try {
      const { websiteId } = req.body;
      const keywords = await storage.getKeywordsByWebsiteId(websiteId);
      
      // Mock position updates - in real implementation, this would use SERP APIs
      const updates = await Promise.all(keywords.map(async (keyword) => {
        const newPosition = Math.floor(Math.random() * 100) + 1;
        await storage.updateKeywordPosition(keyword.id, newPosition);
        return {
          keywordId: keyword.id,
          keyword: keyword.keyword,
          newPosition,
          previousPosition: keyword.currentPosition
        };
      }));
      
      res.json({ 
        message: "Rankings updated successfully",
        updates 
      });
    } catch (error) {
      console.error('Rank tracking update error:', error);
      res.status(500).json({ message: "Failed to update rankings" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
