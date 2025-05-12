'use client';

import { useState } from 'react';
import { ScoreCard } from "@/components/ScoreCard";
import { OptimizationCard } from "@/components/OptimizationCard";
import { RadarChart } from "@/components/RadarChart";
import { SEOOverview } from "@/components/SEOOverview";
import { KeywordsSection } from "@/components/KeywordsSection";
import { BacklinksSection } from "@/components/BacklinksSection";
import { useSEOReport } from '@/hooks/useSEOReport';

export default function Home() {
  const [domain, setDomain] = useState('');
  const [keywords, setKeywords] = useState('');
  const [searchedDomain, setSearchedDomain] = useState('');
  const [searchedKeywords, setSearchedKeywords] = useState('');
  const { data, loading, error, refetch } = useSEOReport();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (domain) {
      setSearchedDomain(domain);
      setSearchedKeywords(keywords);
      refetch(domain, keywords);
    }
  };
  if(!loading){
    console.log(data);
    
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-pink-100 p-4 md:p-8">
      <main className="max-w-6xl mx-auto">
        {/* Search Form */}
        <div className="mb-8 bg-white p-4 md:p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-bold mb-4 text-gray-800">SEO Audit Tool</h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-2">
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                placeholder="Enter domain (e.g., example.com)"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
                required
              />
              <input
              type="text"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              placeholder="Enter keywords (comma separated, e.g., seo, marketing, web design)"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
            />
              <button 
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={loading}
              >
                {loading ? 'Loading...' : 'Analyze'}
              </button>
            </div>
            
          </form>
          {error && (
            <p className="mt-2 text-red-500">Error: {error.message}</p>
          )}
        </div>

        {loading && (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-16 h-16 border-4 border-blue-400 border-t-blue-600 rounded-full animate-spin mb-4"></div>
            <p className="text-gray-600 text-lg">Analyzing your website...</p>
           
          </div>
        )}

        {data && (
          <>
            {/* Header Section */}
            <div className="flex flex-col md:flex-row items-start gap-4 md:gap-8 mb-8 md:mb-12 text-gray-700">
              <div className="flex items-center gap-4 w-full md:w-auto">
                <div className="relative w-16 h-16 md:w-24 md:h-24">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-yellow-300 via-orange-400 to-red-500 opacity-20"></div>
                  <div className="absolute inset-2 rounded-full border-8 border-orange-400"></div>
                  <div className="absolute inset-0 flex items-center justify-center text-xl md:text-3xl font-bold text-gray-700">
                    {data.seo_score >= 80 ? 'A' : 
                     data.seo_score >= 60 ? 'B' : 
                     data.seo_score >= 40 ? 'C' : 
                     data.seo_score >= 20 ? 'D' : 'F'}
                  </div>
                </div>
                
                <div>
                  <h1 className="text-xl md:text-3xl font-bold text-gray-800">Audit Result For {searchedDomain}</h1>
                  <p className="text-gray-600 mt-2 max-w-2xl text-sm md:text-base">
                    AI-Generated Summary about the SEO performance of your website. Overall score: {data.seo_score}/100.
                    Your site has {data.backlinks.total} backlinks with a quality score of {data.backlinks.quality_score}/100.
                  </p>
                </div>
              </div>
              
              <div className="w-full md:w-48 h-48 md:ml-auto mt-4 md:mt-0">
                <RadarChart />
              </div>
            </div>
            
            
            {/* Score Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8 md:mb-12">
              <ScoreCard 
                number={1} 
                title="Google Business Profile Score" 
                score={data.business_details.ranking_score >= 80 ? 'A' : 
                       data.business_details.ranking_score >= 60 ? 'B' : 
                       data.business_details.ranking_score >= 40 ? 'C' : 
                       data.business_details.ranking_score >= 20 ? 'D' : 'F'} 
              />
              <ScoreCard 
                number={2} 
                title="Local Search Rankings" 
                score={data.local_rankings.ranking_score >= 80 ? 'A' : 
                       data.local_rankings.ranking_score >= 60 ? 'B' : 
                       data.local_rankings.ranking_score >= 40 ? 'C' : 
                       data.local_rankings.ranking_score >= 20 ? 'D' : 'F'} 
              />
              <ScoreCard 
                number={3} 
                title="Website SEO Score" 
                score={data.seo_score >= 80 ? 'A' : 
                       data.seo_score >= 60 ? 'B' : 
                       data.seo_score >= 40 ? 'C' : 
                       data.seo_score >= 20 ? 'D' : 'F'} 
              />
              <ScoreCard 
                number={4} 
                title="Backlink Strength" 
                score={data.backlinks.quality_score >= 80 ? 'A' : 
                       data.backlinks.quality_score >= 60 ? 'B' : 
                       data.backlinks.quality_score >= 40 ? 'C' : 
                       data.backlinks.quality_score >= 20 ? 'D' : 'F'} 
              />
              <ScoreCard 
                number={5} 
                title="Competitor Benchmark Score" 
                score={data.authority >= 80 ? 'A' : 
                       data.authority >= 60 ? 'B' : 
                       data.authority >= 40 ? 'C' : 
                       data.authority >= 20 ? 'D' : 'F'} 
              />
            </div>
            {/* Optimization Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <OptimizationCard 
                title="Screen Optimization" 
                subtitle="Website Speed & Mobile Friendliness"
                type="performance"
                improvementPercent={35}
                performanceData={data.website_analysis?.pagespeed}
              />
              
              <OptimizationCard 
                title="Google My Business Optimization" 
                subtitle="5 Missing Details"
                type="gmb"
                improvementPercent={41}
                completionRate="9/16 Completed"
                missingItems={[
                 ""
                ]}
                gmbData={data.gmb_profile.items && data.gmb_profile.items.length > 0 ? data.gmb_profile.items[0] : undefined}
              />
              
              <OptimizationCard 
                title="On-Page SEO Issues" 
                subtitle={`${data.keywords.top_keywords?.length} Opportunities`}
                type="seo"
                improvementPercent={41}
                issues={Array.isArray(data.keywords.top_keywords) 
                  ? data.keywords.top_keywords.slice(0, 3).map((keywordObj, index) => ({
                      id: index + 1,
                      title: keywordObj.keyword || `Keyword ${index + 1}`
                    }))
                  : []
                }
              />
            </div>
            {/* SEO Overview Section */}
            {/* <SEOOverview 
              domain={searchedDomain}
              seoScore={data.seo_score}
              authority={data.authority}
            /> */}
            
            {/* Keywords Section */}
            <KeywordsSection 
              keywords={data.keywords.top_keywords}
              ranking={data.keywords.ranking}
            />
            
            {/* Backlinks Section */}
            {/* <BacklinksSection 
              count={data.backlinks.count}
              qualityScore={data.backlinks.quality_score}
            /> */}
            
            
          </>
        )}
      </main>
    </div>
  );
}









