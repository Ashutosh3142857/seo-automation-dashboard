import { pgTable, text, serial, integer, boolean, timestamp, jsonb, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  plan: text("plan").notNull().default("free"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const websites = pgTable("websites", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  domain: text("domain").notNull(),
  name: text("name").notNull(),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const keywords = pgTable("keywords", {
  id: serial("id").primaryKey(),
  websiteId: integer("website_id").notNull(),
  keyword: text("keyword").notNull(),
  targetUrl: text("target_url"),
  currentPosition: integer("current_position"),
  previousPosition: integer("previous_position"),
  searchVolume: integer("search_volume"),
  difficulty: integer("difficulty"),
  isTracked: boolean("is_tracked").default(true),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const backlinks = pgTable("backlinks", {
  id: serial("id").primaryKey(),
  websiteId: integer("website_id").notNull(),
  sourceUrl: text("source_url").notNull(),
  targetUrl: text("target_url").notNull(),
  anchorText: text("anchor_text"),
  domainAuthority: integer("domain_authority"),
  status: text("status").notNull().default("pending"), // pending, approved, rejected
  isNofollow: boolean("is_nofollow").default(false),
  foundAt: timestamp("found_at").defaultNow(),
  approvedAt: timestamp("approved_at"),
});

export const contentAnalysis = pgTable("content_analysis", {
  id: serial("id").primaryKey(),
  websiteId: integer("website_id").notNull(),
  url: text("url").notNull(),
  title: text("title"),
  metaDescription: text("meta_description"),
  content: text("content"),
  keywordDensity: jsonb("keyword_density"),
  readabilityScore: integer("readability_score"),
  seoScore: integer("seo_score"),
  suggestions: jsonb("suggestions"),
  analyzedAt: timestamp("analyzed_at").defaultNow(),
});

export const technicalAudits = pgTable("technical_audits", {
  id: serial("id").primaryKey(),
  websiteId: integer("website_id").notNull(),
  pageSpeed: integer("page_speed"),
  mobileScore: integer("mobile_score"),
  brokenLinks: integer("broken_links"),
  missingAltTags: integer("missing_alt_tags"),
  missingMetaTags: integer("missing_meta_tags"),
  duplicateContent: integer("duplicate_content"),
  issues: jsonb("issues"),
  auditedAt: timestamp("audited_at").defaultNow(),
});

export const localSeoData = pgTable("local_seo_data", {
  id: serial("id").primaryKey(),
  websiteId: integer("website_id").notNull(),
  businessName: text("business_name"),
  address: text("address"),
  phone: text("phone"),
  gmbScore: integer("gmb_score"),
  citations: integer("citations"),
  reviews: integer("reviews"),
  averageRating: decimal("average_rating", { precision: 3, scale: 2 }),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const competitorAnalysis = pgTable("competitor_analysis", {
  id: serial("id").primaryKey(),
  websiteId: integer("website_id").notNull(),
  competitorDomain: text("competitor_domain").notNull(),
  sharedKeywords: integer("shared_keywords"),
  competitorBacklinks: integer("competitor_backlinks"),
  contentGaps: jsonb("content_gaps"),
  analyzedAt: timestamp("analyzed_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  websites: many(websites),
}));

export const websitesRelations = relations(websites, ({ one, many }) => ({
  user: one(users, {
    fields: [websites.userId],
    references: [users.id],
  }),
  keywords: many(keywords),
  backlinks: many(backlinks),
  contentAnalysis: many(contentAnalysis),
  technicalAudits: many(technicalAudits),
  localSeoData: many(localSeoData),
  competitorAnalysis: many(competitorAnalysis),
}));

export const keywordsRelations = relations(keywords, ({ one }) => ({
  website: one(websites, {
    fields: [keywords.websiteId],
    references: [websites.id],
  }),
}));

export const backlinksRelations = relations(backlinks, ({ one }) => ({
  website: one(websites, {
    fields: [backlinks.websiteId],
    references: [websites.id],
  }),
}));

export const contentAnalysisRelations = relations(contentAnalysis, ({ one }) => ({
  website: one(websites, {
    fields: [contentAnalysis.websiteId],
    references: [websites.id],
  }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertWebsiteSchema = createInsertSchema(websites).omit({
  id: true,
  createdAt: true,
});

export const insertKeywordSchema = createInsertSchema(keywords).omit({
  id: true,
  updatedAt: true,
});

export const insertBacklinkSchema = createInsertSchema(backlinks).omit({
  id: true,
  foundAt: true,
  approvedAt: true,
});

export const insertContentAnalysisSchema = createInsertSchema(contentAnalysis).omit({
  id: true,
  analyzedAt: true,
});

export const insertTechnicalAuditSchema = createInsertSchema(technicalAudits).omit({
  id: true,
  auditedAt: true,
});

export const insertLocalSeoDataSchema = createInsertSchema(localSeoData).omit({
  id: true,
  updatedAt: true,
});

export const insertCompetitorAnalysisSchema = createInsertSchema(competitorAnalysis).omit({
  id: true,
  analyzedAt: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Website = typeof websites.$inferSelect;
export type InsertWebsite = z.infer<typeof insertWebsiteSchema>;
export type Keyword = typeof keywords.$inferSelect;
export type InsertKeyword = z.infer<typeof insertKeywordSchema>;
export type Backlink = typeof backlinks.$inferSelect;
export type InsertBacklink = z.infer<typeof insertBacklinkSchema>;
export type ContentAnalysis = typeof contentAnalysis.$inferSelect;
export type InsertContentAnalysis = z.infer<typeof insertContentAnalysisSchema>;
export type TechnicalAudit = typeof technicalAudits.$inferSelect;
export type InsertTechnicalAudit = z.infer<typeof insertTechnicalAuditSchema>;
export type LocalSeoData = typeof localSeoData.$inferSelect;
export type InsertLocalSeoData = z.infer<typeof insertLocalSeoDataSchema>;
export type CompetitorAnalysis = typeof competitorAnalysis.$inferSelect;
export type InsertCompetitorAnalysis = z.infer<typeof insertCompetitorAnalysisSchema>;
