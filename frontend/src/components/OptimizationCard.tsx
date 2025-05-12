import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ReferenceLine } from 'recharts';

interface PerformanceData {
  environment: any;
  audits: any;
}

interface GmbData {
  title?: string;
  description?: string;
  category?: string;
  additional_categories?: string[];
  address?: string;
  phone?: string;
  url?: string;
  rating?: {
    value?: number;
    votes_count?: number;
  };
  attributes?: {
    available_attributes?: {
      [key: string]: string[];
    };
    unavailable_attributes?: {
      [key: string]: string[];
    };
  };
  is_claimed?: boolean;
  total_photos?: number;
  main_image?: string;
  logo?: string;
}

interface OptimizationCardProps {
  title: string;
  subtitle: string;
  type: 'performance' | 'gmb' | 'seo';
  improvementPercent: number;
  completionRate?: string;
  missingItems?: string[];
  issues?: { id: number; title: string }[];
  performanceData?: PerformanceData;
  gmbData?: GmbData;
}

export function OptimizationCard({ 
  title, 
  subtitle, 
  type, 
  improvementPercent,
  completionRate,
  missingItems,
  issues,
  performanceData,
  gmbData
}: OptimizationCardProps) {
  // Generate dummy data for the line chart
  const generateChartData = () => {
    const data = [];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    
    // Start with a base value and show improvement trend
    let baseValue = 30;
    
    for (let i = 0; i < months.length; i++) {
      // Gradually increase the value to show improvement
      const currentValue = baseValue + (i === months.length - 1 ? 30 : i * 5);
      data.push({
        name: months[i],
        value: Math.round(currentValue)
      });
    }
    
    return data;
  };
  
  const chartData = generateChartData();
  const average = chartData.reduce((sum, item) => sum + item.value, 0) / chartData.length;
  
  // Helper function to get color based on score
  const getScoreColor = (score: number) => {
    if (score >= 0.9) return 'bg-green-500';
    if (score >= 0.5) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  // Calculate GMB profile completeness
  const calculateGmbCompleteness = (data?: GmbData) => {
    if (!data) return { score: 0, completed: 0, total: 10, missing: [] };
    
    const requiredFields = [
      { name: 'Business Name', value: data.title },
      { name: 'Business Description', value: data.description },
      { name: 'Primary Category', value: data.category },
      { name: 'Address', value: data.address },
      { name: 'Phone Number', value: data.phone },
      { name: 'Website URL', value: data.url },
      { name: 'Business Hours', value: data.attributes?.available_attributes?.hours },
      { name: 'Photos', value: data.total_photos && data.total_photos > 0 ? data.total_photos : null },
      { name: 'Logo', value: data.logo },
      { name: 'Claimed Listing', value: data.is_claimed }
    ];
    
    const completed = requiredFields.filter(field => field.value).length;
    const missing = requiredFields.filter(field => !field.value).map(field => field.name);
    
    return {
      score: Math.round((completed / requiredFields.length) * 100),
      completed,
      total: requiredFields.length,
      missing
    };
  };
  
  const gmbCompleteness = calculateGmbCompleteness(gmbData);
  
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm text-gray-700">
      <div className="flex items-center gap-2 mb-4">
        {type === 'performance' && (
          <span className="text-lg">📊</span>
        )}
        {type === 'gmb' && (
          <span className="text-lg">🏢</span>
        )}
        {type === 'seo' && (
          <span className="text-lg">🔍</span>
        )}
        <h3 className="font-bold text-gray-800">{title}</h3>
      </div>
      
      <p className="text-sm text-gray-600 mb-4">
        {type === 'gmb' && gmbData 
          ? `${gmbCompleteness.missing.length} Missing Details` 
          : subtitle}
      </p>
      
      {/* Performance Card Content */}
      {type === 'performance' && performanceData && (
        <div className="mb-6">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-gray-50 p-3 rounded-md">
              <div className="text-xs text-gray-500 mb-1">First Contentful Paint</div>
              <div className="flex items-center justify-between">
                <div className={`h-2 w-2 rounded-full ${getScoreColor(performanceData['audits']['first-contentful-paint']?.score || 0)}`}></div>
                <div className="text-sm font-medium">{performanceData['audits']['first-contentful-paint']?.displayValue || 'N/A'}</div>
              </div>
            </div>
            <div className="bg-gray-50 p-3 rounded-md">
              <div className="text-xs text-gray-500 mb-1">Largest Contentful Paint</div>
              <div className="flex items-center justify-between">
                <div className={`h-2 w-2 rounded-full ${getScoreColor(performanceData['audits']['largest-contentful-paint']?.score || 0)}`}></div>
                <div className="text-sm font-medium">{performanceData['audits']['largest-contentful-paint']?.displayValue || 'N/A'}</div>
              </div>
            </div>
            <div className="bg-gray-50 p-3 rounded-md">
              <div className="text-xs text-gray-500 mb-1">First Meaningful Paint</div>
              <div className="flex items-center justify-between">
                <div className={`h-2 w-2 rounded-full ${getScoreColor(performanceData['audits']['first-meaningful-paint']?.score || 0)}`}></div>
                <div className="text-sm font-medium">{performanceData['audits']['first-meaningful-paint']?.displayValue || 'N/A'}</div>
              </div>
            </div>
            <div className="bg-gray-50 p-3 rounded-md">
              <div className="text-xs text-gray-500 mb-1">Speed Index</div>
              <div className="flex items-center justify-between">
                <div className={`h-2 w-2 rounded-full ${getScoreColor(performanceData['audits']['speed-index']?.score || 0)}`}></div>
                <div className="text-sm font-medium">{performanceData['audits']['speed-index']?.displayValue || 'N/A'}</div>
              </div>
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <div className="text-xs text-gray-500">Performance Score</div>
            <div className="flex items-center">
              <div className="h-4 w-24 bg-gray-200 rounded-full overflow-hidden mr-2">
                <div 
                  className="h-full bg-blue-500" 
                  style={{ 
                    width: `${Math.round(
                      ((performanceData['audits']['first-contentful-paint']?.score || 0) + 
                       (performanceData['audits']['largest-contentful-paint']?.score || 0) + 
                       (performanceData['audits']['first-meaningful-paint']?.score || 0) + 
                       (performanceData['audits']['speed-index']?.score || 0)) / 4 * 100
                    )}%` 
                  }}
                ></div>
              </div>
              <div className="text-sm font-medium">
                {Math.round(
                  ((performanceData['audits']['first-contentful-paint']?.score || 0) + 
                   (performanceData['audits']['largest-contentful-paint']?.score || 0) + 
                   (performanceData['audits']['first-meaningful-paint']?.score || 0) + 
                   (performanceData['audits']['speed-index']?.score || 0)) / 4 * 100
                )}%
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* GMB Card Content */}
      {type === 'gmb' && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm font-medium">Profile Completeness</div>
            <div className="text-sm font-medium">
              {gmbData ? `${gmbCompleteness.completed}/${gmbCompleteness.total} Completed` : completionRate}
            </div>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6">
            <div 
              className="bg-blue-600 h-2.5 rounded-full" 
              style={{ width: `${gmbData ? gmbCompleteness.score : 56}%` }}
            ></div>
          </div>
          
          {gmbData && gmbData.rating && (
            <div className="flex items-center mb-4">
              <div className="flex items-center mr-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg 
                    key={star}
                    className={`w-4 h-4 ${star <= Math.round(gmbData.rating?.value || 0) ? 'text-yellow-400' : 'text-gray-300'}`}
                    fill="currentColor" 
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-sm font-medium">{gmbData.rating.value} ({gmbData.rating.votes_count} reviews)</span>
            </div>
          )}
          
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-gray-700">Missing Information:</h4>
            {(gmbData ? gmbCompleteness.missing : missingItems)?.map((item, index) => (
              <div key={index} className="flex items-center text-sm">
                <svg className="w-4 h-4 mr-2 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
                {item}
              </div>
            ))}
          </div>
          
          {gmbData && gmbData.category && (
            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Business Categories:</h4>
              <div className="flex flex-wrap gap-2">
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                  {gmbData.category}
                </span>
                {gmbData.additional_categories?.map((category, index) => (
                  <span key={index} className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">
                    {category}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
      
      {/* SEO Card Content */}
      {type === 'seo' && (
        <div className="mb-6">
          <div className="space-y-3">
            {issues?.map((issue) => (
              <div key={issue.id} className="flex items-start">
                <div className="flex-shrink-0 w-5 h-5 rounded-full bg-yellow-100 flex items-center justify-center mt-0.5 mr-3">
                  <span className="text-yellow-800 text-xs">!</span>
                </div>
                <div>
                  <p className="text-sm">{issue.title}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <div className="pt-4 border-t border-gray-200">
        <div className="flex justify-between items-center">
          <div className="text-sm font-medium text-gray-700">Potential Improvement</div>
          <div className="text-sm font-medium text-green-600">+{improvementPercent}%</div>
        </div>
      </div>
    </div>
  );
}










