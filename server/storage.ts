import { 
  users, websites, keywords, backlinks, contentAnalysis, technicalAudits, 
  localSeoData, competitorAnalysis,
  type User, type InsertUser, type Website, type InsertWebsite,
  type Keyword, type InsertKeyword, type Backlink, type InsertBacklink,
  type ContentAnalysis, type InsertContentAnalysis, type TechnicalAudit, type InsertTechnicalAudit,
  type LocalSeoData, type InsertLocalSeoData, type CompetitorAnalysis, type InsertCompetitorAnalysis
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and } from "drizzle-orm";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Websites
  getWebsitesByUserId(userId: number): Promise<Website[]>;
  getWebsite(id: number): Promise<Website | undefined>;
  createWebsite(website: InsertWebsite): Promise<Website>;
  
  // Keywords
  getKeywordsByWebsiteId(websiteId: number): Promise<Keyword[]>;
  createKeyword(keyword: InsertKeyword): Promise<Keyword>;
  updateKeywordPosition(id: number, position: number): Promise<void>;
  
  // Backlinks
  getBacklinksByWebsiteId(websiteId: number): Promise<Backlink[]>;
  getPendingBacklinks(websiteId: number): Promise<Backlink[]>;
  createBacklink(backlink: InsertBacklink): Promise<Backlink>;
  updateBacklinkStatus(id: number, status: string): Promise<void>;
  
  // Content Analysis
  getContentAnalysisByWebsiteId(websiteId: number): Promise<ContentAnalysis[]>;
  createContentAnalysis(analysis: InsertContentAnalysis): Promise<ContentAnalysis>;
  
  // Technical Audits
  getLatestTechnicalAudit(websiteId: number): Promise<TechnicalAudit | undefined>;
  createTechnicalAudit(audit: InsertTechnicalAudit): Promise<TechnicalAudit>;
  
  // Local SEO
  getLocalSeoData(websiteId: number): Promise<LocalSeoData | undefined>;
  upsertLocalSeoData(data: InsertLocalSeoData): Promise<LocalSeoData>;
  
  // Competitor Analysis
  getCompetitorAnalysisByWebsiteId(websiteId: number): Promise<CompetitorAnalysis[]>;
  createCompetitorAnalysis(analysis: InsertCompetitorAnalysis): Promise<CompetitorAnalysis>;
}

export class DatabaseStorage implements IStorage {
  // Users
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  // Websites
  async getWebsitesByUserId(userId: number): Promise<Website[]> {
    return db.select().from(websites).where(eq(websites.userId, userId));
  }

  async getWebsite(id: number): Promise<Website | undefined> {
    const [website] = await db.select().from(websites).where(eq(websites.id, id));
    return website || undefined;
  }

  async createWebsite(insertWebsite: InsertWebsite): Promise<Website> {
    const [website] = await db.insert(websites).values(insertWebsite).returning();
    return website;
  }

  // Keywords
  async getKeywordsByWebsiteId(websiteId: number): Promise<Keyword[]> {
    return db.select().from(keywords).where(eq(keywords.websiteId, websiteId)).orderBy(desc(keywords.updatedAt));
  }

  async createKeyword(insertKeyword: InsertKeyword): Promise<Keyword> {
    const [keyword] = await db.insert(keywords).values(insertKeyword).returning();
    return keyword;
  }

  async updateKeywordPosition(id: number, position: number): Promise<void> {
    await db.update(keywords)
      .set({ 
        previousPosition: keywords.currentPosition,
        currentPosition: position,
        updatedAt: new Date()
      })
      .where(eq(keywords.id, id));
  }

  // Backlinks
  async getBacklinksByWebsiteId(websiteId: number): Promise<Backlink[]> {
    return db.select().from(backlinks).where(eq(backlinks.websiteId, websiteId)).orderBy(desc(backlinks.foundAt));
  }

  async getPendingBacklinks(websiteId: number): Promise<Backlink[]> {
    return db.select().from(backlinks)
      .where(and(eq(backlinks.websiteId, websiteId), eq(backlinks.status, "pending")))
      .orderBy(desc(backlinks.foundAt));
  }

  async createBacklink(insertBacklink: InsertBacklink): Promise<Backlink> {
    const [backlink] = await db.insert(backlinks).values(insertBacklink).returning();
    return backlink;
  }

  async updateBacklinkStatus(id: number, status: string): Promise<void> {
    const updateData: any = { status };
    if (status === "approved") {
      updateData.approvedAt = new Date();
    }
    await db.update(backlinks).set(updateData).where(eq(backlinks.id, id));
  }

  // Content Analysis
  async getContentAnalysisByWebsiteId(websiteId: number): Promise<ContentAnalysis[]> {
    return db.select().from(contentAnalysis)
      .where(eq(contentAnalysis.websiteId, websiteId))
      .orderBy(desc(contentAnalysis.analyzedAt));
  }

  async createContentAnalysis(insertAnalysis: InsertContentAnalysis): Promise<ContentAnalysis> {
    const [analysis] = await db.insert(contentAnalysis).values(insertAnalysis).returning();
    return analysis;
  }

  // Technical Audits
  async getLatestTechnicalAudit(websiteId: number): Promise<TechnicalAudit | undefined> {
    const [audit] = await db.select().from(technicalAudits)
      .where(eq(technicalAudits.websiteId, websiteId))
      .orderBy(desc(technicalAudits.auditedAt))
      .limit(1);
    return audit || undefined;
  }

  async createTechnicalAudit(insertAudit: InsertTechnicalAudit): Promise<TechnicalAudit> {
    const [audit] = await db.insert(technicalAudits).values(insertAudit).returning();
    return audit;
  }

  // Local SEO
  async getLocalSeoData(websiteId: number): Promise<LocalSeoData | undefined> {
    const [data] = await db.select().from(localSeoData)
      .where(eq(localSeoData.websiteId, websiteId))
      .orderBy(desc(localSeoData.updatedAt))
      .limit(1);
    return data || undefined;
  }

  async upsertLocalSeoData(insertData: InsertLocalSeoData): Promise<LocalSeoData> {
    const existing = await this.getLocalSeoData(insertData.websiteId);
    if (existing) {
      const [updated] = await db.update(localSeoData)
        .set({ ...insertData, updatedAt: new Date() })
        .where(eq(localSeoData.id, existing.id))
        .returning();
      return updated;
    } else {
      const [created] = await db.insert(localSeoData).values(insertData).returning();
      return created;
    }
  }

  // Competitor Analysis
  async getCompetitorAnalysisByWebsiteId(websiteId: number): Promise<CompetitorAnalysis[]> {
    return db.select().from(competitorAnalysis)
      .where(eq(competitorAnalysis.websiteId, websiteId))
      .orderBy(desc(competitorAnalysis.analyzedAt));
  }

  async createCompetitorAnalysis(insertAnalysis: InsertCompetitorAnalysis): Promise<CompetitorAnalysis> {
    const [analysis] = await db.insert(competitorAnalysis).values(insertAnalysis).returning();
    return analysis;
  }
}

export const storage = new DatabaseStorage();
