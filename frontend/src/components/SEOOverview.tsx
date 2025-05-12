import React from 'react';
import { SEOScoreChart } from './charts/SEOScoreChart';

interface SEOOverviewProps {
  domain: string;
  seoScore: number;
  authority: number;
}

export function SEOOverview({ domain, seoScore, authority }: SEOOverviewProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6 text-gray-700">
      <h2 className="text-2xl font-bold mb-4">SEO Overview for {domain}</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-xl font-semibold mb-2">SEO Score</h3>
          <p className="text-gray-600 mb-4">
            Your overall SEO score is calculated based on various factors including on-page SEO, 
            backlinks, keywords, and technical SEO.
          </p>
          <div className="flex items-center">
            <div className="w-1/2">
              <SEOScoreChart score={seoScore} />
            </div>
            <div className="w-1/2 pl-4">
              <div className="mb-2">
                <span className="text-gray-600">Score Rating:</span>
                <span className="ml-2 font-bold text-lg">
                  {seoScore >= 80 ? 'Excellent' : 
                   seoScore >= 60 ? 'Good' : 
                   seoScore >= 40 ? 'Average' : 
                   seoScore >= 20 ? 'Poor' : 'Very Poor'}
                </span>
              </div>
              <p className="text-gray-600">
                {seoScore >= 80 ? 'Your website has excellent SEO. Keep up the good work!' : 
                 seoScore >= 60 ? 'Your website has good SEO, but there\'s room for improvement.' : 
                 seoScore >= 40 ? 'Your website needs SEO improvements to rank better.' : 
                 seoScore >= 20 ? 'Your website has serious SEO issues that need attention.' : 
                 'Your website has critical SEO problems that require immediate action.'}
              </p>
            </div>
          </div>
        </div>
        
        <div>
          <h3 className="text-xl font-semibold mb-2">Domain Authority</h3>
          <p className="text-gray-600 mb-4">
            Domain Authority is a search engine ranking score that predicts how likely a website 
            is to rank on search engine result pages.
          </p>
          <div className="bg-gray-100 rounded-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600">Authority Score:</span>
              <span className="font-bold text-2xl">{authority}/100</span>
            </div>
            <div className="w-full bg-gray-300 rounded-full h-4 mb-4">
              <div 
                className="bg-blue-600 h-4 rounded-full" 
                style={{ width: `${authority}%` }}
              ></div>
            </div>
            <p className="text-gray-600 text-sm">
              {authority >= 80 ? 'Very high authority. Your domain is highly trusted.' : 
               authority >= 60 ? 'Good authority. Your domain has established credibility.' : 
               authority >= 40 ? 'Moderate authority. Continue building your domain\'s reputation.' : 
               authority >= 20 ? 'Low authority. Focus on building quality backlinks.' : 
               'Very low authority. Your domain needs significant improvement.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}