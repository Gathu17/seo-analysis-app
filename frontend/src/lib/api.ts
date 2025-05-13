// API client for SEO data

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export interface KeywordData {
  keyword: string;
  location_code?: string | null;
  language_code?: string | null;
  search_partners?: boolean;
  competition?: number;
  cpc?: number;
  search_volume?: number;
  categories?: any | null;
  monthly_searches?: Array<{
    year: number;
    month: number;
    search_volume: number;
  }>;
}

export interface SEOReport {
  domain: string;
  business_name: string;
  location: string;
  seo_score: number;
  gmb_profile: {
    name: string;
    items: any[];
    ranking_score: number;
  },
  local_rankings: {
    position: number;
    rankings: any[];
    ranking_score: number;
  },
  business_details: {
    items: any[];
    ranking_score: number;
  },
  website_analysis: {
    onpage_score: number;
    issues: {
      critical: any[];
      warnings: any[];
      notices: any[];
    };
    pagespeed: {
      environment: any;
      audits: any;
    };
  },
  keywords: {
    ranking?: number;
    total?: number;
    top_keywords: KeywordData[];
  };
  backlinks: {
    total: number;
    quality_score: number;
  };
  competitors: {
    items: any[];
  };
  authority: number;
}

export async function fetchSEOReport(domain: string, keywords: string): Promise<SEOReport> {
  try {
    const response = await fetch(`${API_BASE_URL}/seo-report/?domain=${encodeURIComponent(domain)}&keywords=${encodeURIComponent(keywords)}`);
    console.log(response);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching SEO report:', error);
    throw error;
  }
}
