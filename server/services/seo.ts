import puppeteer from 'puppeteer';
import { findBacklinkOpportunities } from './openai';

export interface TechnicalAuditResult {
  pageSpeed: number;
  mobileScore: number;
  brokenLinks: number;
  missingAltTags: number;
  missingMetaTags: number;
  duplicateContent: number;
  issues: Array<{
    type: string;
    severity: 'low' | 'medium' | 'high';
    message: string;
    url?: string;
  }>;
}

export interface PageAnalysisResult {
  title: string;
  metaDescription: string;
  content: string;
  images: Array<{ src: string; alt: string; hasAlt: boolean }>;
  links: Array<{ href: string; text: string; isInternal: boolean }>;
  headings: Array<{ level: number; text: string }>;
}

export async function performTechnicalAudit(domain: string): Promise<TechnicalAuditResult> {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  
  try {
    const url = domain.startsWith('http') ? domain : `https://${domain}`;
    
    // Set up performance metrics
    await page.setCacheEnabled(false);
    const startTime = Date.now();
    
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
    const loadTime = Date.now() - startTime;
    
    // Analyze page content
    const analysis = await page.evaluate(() => {
      const images = Array.from(document.querySelectorAll('img')).map(img => ({
        src: img.src,
        alt: img.alt,
        hasAlt: Boolean(img.alt)
      }));
      
      const links = Array.from(document.querySelectorAll('a[href]')).map(link => ({
        href: (link as HTMLAnchorElement).href,
        text: link.textContent?.trim() || '',
        isInternal: (link as HTMLAnchorElement).href.includes(window.location.hostname)
      }));
      
      const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6')).map(heading => ({
        level: parseInt(heading.tagName.charAt(1)),
        text: heading.textContent?.trim() || ''
      }));
      
      const title = document.title;
      const metaDescription = (document.querySelector('meta[name="description"]') as HTMLMetaElement)?.content || '';
      
      return {
        title,
        metaDescription,
        images,
        links,
        headings,
        hasMetaDescription: Boolean(metaDescription),
        hasTitle: Boolean(title),
        h1Count: headings.filter(h => h.level === 1).length
      };
    });
    
    // Calculate metrics
    const pageSpeed = Math.max(0, Math.min(100, 100 - (loadTime / 100)));
    const mobileScore = 85; // Would need actual mobile testing
    const brokenLinks = 0; // Would need to check each link
    const missingAltTags = analysis.images.filter(img => !img.hasAlt).length;
    const missingMetaTags = (analysis.hasTitle ? 0 : 1) + (analysis.hasMetaDescription ? 0 : 1);
    const duplicateContent = 0; // Would need content comparison
    
    const issues: TechnicalAuditResult['issues'] = [];
    
    if (!analysis.hasTitle) {
      issues.push({
        type: 'meta',
        severity: 'high',
        message: 'Missing page title'
      });
    }
    
    if (!analysis.hasMetaDescription) {
      issues.push({
        type: 'meta',
        severity: 'medium',
        message: 'Missing meta description'
      });
    }
    
    if (analysis.h1Count === 0) {
      issues.push({
        type: 'structure',
        severity: 'high',
        message: 'Missing H1 heading'
      });
    } else if (analysis.h1Count > 1) {
      issues.push({
        type: 'structure',
        severity: 'medium',
        message: 'Multiple H1 headings found'
      });
    }
    
    if (missingAltTags > 0) {
      issues.push({
        type: 'accessibility',
        severity: 'medium',
        message: `${missingAltTags} images missing alt text`
      });
    }
    
    if (loadTime > 3000) {
      issues.push({
        type: 'performance',
        severity: 'high',
        message: 'Page load time exceeds 3 seconds'
      });
    }
    
    return {
      pageSpeed,
      mobileScore,
      brokenLinks,
      missingAltTags,
      missingMetaTags,
      duplicateContent,
      issues
    };
    
  } finally {
    await browser.close();
  }
}

export async function analyzePageContent(url: string): Promise<PageAnalysisResult> {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  
  try {
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
    
    const result = await page.evaluate(() => {
      const title = document.title;
      const metaDescription = (document.querySelector('meta[name="description"]') as HTMLMetaElement)?.content || '';
      
      // Extract main content (avoiding navigation, headers, footers)
      const contentSelectors = ['main', 'article', '.content', '#content', '.post-content'];
      let contentElement = null;
      
      for (const selector of contentSelectors) {
        contentElement = document.querySelector(selector);
        if (contentElement) break;
      }
      
      if (!contentElement) {
        contentElement = document.body;
      }
      
      const content = contentElement?.textContent?.trim() || '';
      
      const images = Array.from(document.querySelectorAll('img')).map(img => ({
        src: img.src,
        alt: img.alt,
        hasAlt: Boolean(img.alt)
      }));
      
      const links = Array.from(document.querySelectorAll('a[href]')).map(link => ({
        href: (link as HTMLAnchorElement).href,
        text: link.textContent?.trim() || '',
        isInternal: (link as HTMLAnchorElement).href.includes(window.location.hostname)
      }));
      
      const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6')).map(heading => ({
        level: parseInt(heading.tagName.charAt(1)),
        text: heading.textContent?.trim() || ''
      }));
      
      return {
        title,
        metaDescription,
        content,
        images,
        links,
        headings
      };
    });
    
    return result;
    
  } finally {
    await browser.close();
  }
}

export async function discoverBacklinkOpportunities(domain: string, keywords: string[], industry: string) {
  try {
    // Use OpenAI to generate potential opportunities
    const aiOpportunities = await findBacklinkOpportunities(domain, keywords, industry);
    
    // In a real implementation, you would also:
    // 1. Use SEO APIs like Ahrefs, SEMrush to find competitor backlinks
    // 2. Crawl industry directories and resource pages
    // 3. Find broken link building opportunities
    // 4. Identify guest posting opportunities
    
    return aiOpportunities.map(opp => ({
      sourceUrl: `https://${opp.domain}`,
      targetUrl: `https://${domain}`,
      anchorText: keywords[Math.floor(Math.random() * keywords.length)],
      domainAuthority: opp.authorityScore,
      status: 'pending' as const,
      isNofollow: false,
      contactInfo: opp.contactEmail || '',
      pitchSuggestion: opp.reason
    }));
  } catch (error) {
    console.error('Error discovering backlink opportunities:', error);
    throw error;
  }
}
