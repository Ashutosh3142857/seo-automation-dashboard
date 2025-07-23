import OpenAI from "openai";

if (!process.env.OPENAI_API_KEY) {
  throw new Error("OPENAI_API_KEY environment variable is required");
}

const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY 
});

export interface ContentAnalysis {
  keywordDensity: number;
  readabilityScore: number;
  structureScore: number;
  suggestions: string[];
  improvedContent?: string;
}

export interface BacklinkOpportunity {
  domain: string;
  relevanceScore: number;
  authorityScore: number;
  contactEmail?: string;
  reason: string;
}

export interface CompetitorAnalysis {
  competitor: string;
  contentGaps: string[];
  keywordOpportunities: string[];
  strengthsWeaknesses: {
    strengths: string[];
    weaknesses: string[];
  };
}

export interface LocalSEOSuggestion {
  task: string;
  priority: 'high' | 'medium' | 'low';
  description: string;
  estimatedImpact: string;
}

export interface SocialMediaPost {
  platform: string;
  content: string;
  hashtags: string[];
  optimizedForSEO: boolean;
}

// Automated Content Optimization
export async function analyzeContent(content: string, targetKeywords: string[]): Promise<ContentAnalysis> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        {
          role: "system",
          content: `You are an SEO expert. Analyze the provided content for SEO performance focusing on keyword density, readability, and structure. Target keywords: ${targetKeywords.join(', ')}. Respond with JSON in this format: { "keywordDensity": number, "readabilityScore": number, "structureScore": number, "suggestions": ["suggestion1", "suggestion2"] }`
        },
        {
          role: "user",
          content: content
        }
      ],
      response_format: { type: "json_object" }
    });

    const analysis = JSON.parse(response.choices[0].message.content || '{}');
    
    return {
      keywordDensity: analysis.keywordDensity || 0,
      readabilityScore: analysis.readabilityScore || 0,
      structureScore: analysis.structureScore || 0,
      suggestions: analysis.suggestions || []
    };
  } catch (error) {
    throw new Error(`Content analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Generate improved content
export async function optimizeContent(content: string, targetKeywords: string[]): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are an expert SEO content optimizer. Improve the provided content by optimizing for the target keywords: ${targetKeywords.join(', ')}. Maintain the original tone and factual accuracy while improving SEO performance, readability, and structure.`
        },
        {
          role: "user",
          content: content
        }
      ]
    });

    return response.choices[0].message.content || content;
  } catch (error) {
    throw new Error(`Content optimization failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Automated Backlink Generation
export async function findBacklinkOpportunities(
  domain: string, 
  targetKeywords: string[], 
  niche: string
): Promise<BacklinkOpportunity[]> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are a backlink expert. Generate potential backlink opportunities for domain "${domain}" in the "${niche}" niche with keywords: ${targetKeywords.join(', ')}. Respond with JSON array format: [{ "domain": "example.com", "relevanceScore": 85, "authorityScore": 90, "contactEmail": "contact@example.com", "reason": "High authority blog in your niche" }]`
        },
        {
          role: "user",
          content: `Find 10 high-quality backlink opportunities for ${domain} in ${niche} niche`
        }
      ],
      response_format: { type: "json_object" }
    });

    const result = JSON.parse(response.choices[0].message.content || '{"opportunities": []}');
    return result.opportunities || [];
  } catch (error) {
    throw new Error(`Backlink opportunity discovery failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// On-Page SEO Analysis
export async function analyzeOnPageSEO(
  url: string, 
  content: string, 
  targetKeywords: string[]
): Promise<{
  titleOptimization: string[];
  metaDescriptionSuggestions: string[];
  headerOptimization: string[];
  internalLinkingSuggestions: string[];
  keywordPlacement: string[];
}> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `Analyze on-page SEO for the URL "${url}" with target keywords: ${targetKeywords.join(', ')}. Respond with JSON: { "titleOptimization": [], "metaDescriptionSuggestions": [], "headerOptimization": [], "internalLinkingSuggestions": [], "keywordPlacement": [] }`
        },
        {
          role: "user",
          content: content
        }
      ],
      response_format: { type: "json_object" }
    });

    return JSON.parse(response.choices[0].message.content || '{}');
  } catch (error) {
    throw new Error(`On-page SEO analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Competitor Analysis
export async function analyzeCompetitors(
  yourDomain: string,
  competitorDomains: string[],
  niche: string
): Promise<CompetitorAnalysis[]> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `Analyze competitors ${competitorDomains.join(', ')} against ${yourDomain} in ${niche} niche. Identify content gaps and keyword opportunities. Respond with JSON array: [{ "competitor": "domain.com", "contentGaps": [], "keywordOpportunities": [], "strengthsWeaknesses": { "strengths": [], "weaknesses": [] } }]`
        },
        {
          role: "user",
          content: `Provide detailed competitor analysis for ${yourDomain} vs ${competitorDomains.join(', ')}`
        }
      ],
      response_format: { type: "json_object" }
    });

    const result = JSON.parse(response.choices[0].message.content || '{"analyses": []}');
    return result.analyses || [];
  } catch (error) {
    throw new Error(`Competitor analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Automated Content Creation
export async function generateContent(
  contentType: 'blog_post' | 'product_description' | 'landing_page',
  topic: string,
  targetKeywords: string[],
  wordCount: number = 800
): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are an expert SEO content creator. Create a ${contentType} about "${topic}" that is ${wordCount} words long and optimized for keywords: ${targetKeywords.join(', ')}. Make it engaging, informative, and SEO-friendly.`
        },
        {
          role: "user",
          content: `Create ${contentType} content for: ${topic}`
        }
      ]
    });

    return response.choices[0].message.content || '';
  } catch (error) {
    throw new Error(`Content generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Local SEO Automation
export async function generateLocalSEOTasks(
  businessName: string,
  location: string,
  businessType: string
): Promise<LocalSEOSuggestion[]> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `Generate local SEO tasks for "${businessName}" - a ${businessType} business in ${location}. Respond with JSON array: [{ "task": "Update Google My Business", "priority": "high", "description": "...", "estimatedImpact": "..." }]`
        },
        {
          role: "user",
          content: `Generate 15 local SEO optimization tasks for ${businessName}`
        }
      ],
      response_format: { type: "json_object" }
    });

    const result = JSON.parse(response.choices[0].message.content || '{"tasks": []}');
    return result.tasks || [];
  } catch (error) {
    throw new Error(`Local SEO task generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Social Media SEO Integration
export async function generateSocialMediaPosts(
  content: string,
  platforms: string[],
  targetKeywords: string[]
): Promise<SocialMediaPost[]> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `Create SEO-optimized social media posts for platforms: ${platforms.join(', ')} based on the provided content. Include relevant hashtags and optimize for keywords: ${targetKeywords.join(', ')}. Respond with JSON array: [{ "platform": "twitter", "content": "...", "hashtags": ["#seo", "#marketing"], "optimizedForSEO": true }]`
        },
        {
          role: "user",
          content: content
        }
      ],
      response_format: { type: "json_object" }
    });

    const result = JSON.parse(response.choices[0].message.content || '{"posts": []}');
    return result.posts || [];
  } catch (error) {
    throw new Error(`Social media post generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}