import React from 'react';
import { KeywordsChart } from './charts/KeywordsChart';

interface MonthlySearch {
  year: number;
  month: number;
  search_volume: number;
}

interface KeywordData {
  keyword: string;
  search_volume?: number;
  competition?: string | number;
  competition_index?: number;
  cpc?: number;
  monthly_searches?: MonthlySearch[];
}

interface KeywordsSectionProps {
  keywords: KeywordData[];
  ranking?: number;
}

export function KeywordsSection({ keywords, ranking = 0 }: KeywordsSectionProps) {
  // Process keyword data for display
  const processedKeywords = keywords.map(keyword => {
    // Calculate trend (last 3 months vs previous 3 months)
    let trend = 0;
    if (keyword.monthly_searches && keyword.monthly_searches.length >= 6) {
      const recent3Months = keyword.monthly_searches.slice(0, 3)
        .reduce((sum, month) => sum + month.search_volume, 0);
      const previous3Months = keyword.monthly_searches.slice(3, 6)
        .reduce((sum, month) => sum + month.search_volume, 0);
      
      trend = recent3Months > previous3Months ? 1 : (recent3Months < previous3Months ? -1 : 0);
    }
    
    // Calculate difficulty based on competition_index or competition
    let difficulty = 0;
    if (typeof keyword.competition_index === 'number') {
      difficulty = keyword.competition_index;
    } else if (keyword.competition === 'HIGH') {
      difficulty = 80;
    } else if (keyword.competition === 'MEDIUM') {
      difficulty = 50;
    } else if (keyword.competition === 'LOW') {
      difficulty = 20;
    }
    
    return {
      keyword: keyword.keyword,
      volume: keyword.search_volume || 0,
      position: Math.floor(Math.random() * 100) + 1, // Placeholder - replace with actual position data
      difficulty,
      trend,
      cpc: keyword.cpc || 0
    };
  });

  // Sort by search volume (highest first)
  const sortedKeywords = [...processedKeywords].sort((a, b) => b.volume - a.volume);

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6 text-gray-700">
      <h2 className="text-2xl font-bold mb-4">Keyword Analysis</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="font-semibold text-blue-800 mb-1">Keyword Ranking</h3>
          <p className="text-3xl font-bold">{ranking}/100</p>
          <p className="text-sm text-gray-600">Overall keyword performance</p>
        </div>
        
        <div className="bg-green-50 p-4 rounded-lg">
          <h3 className="font-semibold text-green-800 mb-1">Tracked Keywords</h3>
          <p className="text-3xl font-bold">{keywords.length}</p>
          <p className="text-sm text-gray-600">Keywords being monitored</p>
        </div>
        
        <div className="bg-purple-50 p-4 rounded-lg">
          <h3 className="font-semibold text-purple-800 mb-1">Avg. Search Volume</h3>
          <p className="text-3xl font-bold">
            {keywords.length > 0 
              ? Math.round(keywords.reduce((sum, kw) => sum + (kw.search_volume || 0), 0) / keywords.length).toLocaleString()
              : 0}
          </p>
          <p className="text-sm text-gray-600">Monthly searches per keyword</p>
        </div>
      </div>
      
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Top Keywords by Search Volume</h3>
        <KeywordsChart data={sortedKeywords.slice(0, 5)} />
      </div>
      
      <div>
        <h3 className="text-xl font-semibold mb-4">Keyword Opportunities</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-4 text-left">Keyword</th>
                <th className="py-2 px-4 text-left">Search Volume</th>
                <th className="py-2 px-4 text-left">CPC ($)</th>
                <th className="py-2 px-4 text-left">Competition</th>
                <th className="py-2 px-4 text-left">Trend</th>
              </tr>
            </thead>
            <tbody>
              {sortedKeywords.map((item, index) => (
                <tr key={index} className="border-b">
                  <td className="py-2 px-4">{item.keyword}</td>
                  <td className="py-2 px-4">{item.volume.toLocaleString()}</td>
                  <td className="py-2 px-4">${item.cpc.toFixed(2)}</td>
                  <td className="py-2 px-4">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${item.difficulty}%` }}
                      ></div>
                    </div>
                  </td>
                  <td className="py-2 px-4">
                    {item.trend > 0 && <span className="text-green-600">↑ Rising</span>}
                    {item.trend < 0 && <span className="text-red-600">↓ Falling</span>}
                    {item.trend === 0 && <span className="text-gray-600">→ Stable</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
