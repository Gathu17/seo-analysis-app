import React from 'react';
import { BacklinksChart } from './charts/BacklinksChart';

interface BacklinksSectionProps {
  count: number;
  qualityScore: number;
}

export function BacklinksSection({ count, qualityScore }: BacklinksSectionProps) {
  // Generate dummy data for the chart
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  const backlinkData = months.map((month, index) => ({
    date: month,
    count: Math.floor(count * (0.7 + (index * 0.05)))
  }));

  // Generate dummy referring domains
  const referringDomains = [
    { domain: 'example.com', authority: 85, backlinks: Math.floor(count * 0.2) },
    { domain: 'blog.example.org', authority: 72, backlinks: Math.floor(count * 0.15) },
    { domain: 'news.example.net', authority: 68, backlinks: Math.floor(count * 0.1) },
    { domain: 'reference.example.edu', authority: 90, backlinks: Math.floor(count * 0.08) },
    { domain: 'directory.example.io', authority: 65, backlinks: Math.floor(count * 0.05) },
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6 text-gray-700">
      <h2 className="text-2xl font-bold mb-4">Backlink Analysis</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-indigo-50 p-4 rounded-lg">
          <h3 className="font-semibold text-indigo-800 mb-1">Total Backlinks</h3>
          <p className="text-3xl font-bold">{count.toLocaleString()}</p>
          <p className="text-sm text-gray-600">Links pointing to your site</p>
        </div>
        
        <div className="bg-teal-50 p-4 rounded-lg">
          <h3 className="font-semibold text-teal-800 mb-1">Quality Score</h3>
          <p className="text-3xl font-bold">{qualityScore}/100</p>
          <p className="text-sm text-gray-600">Overall backlink quality</p>
        </div>
        
        <div className="bg-amber-50 p-4 rounded-lg">
          <h3 className="font-semibold text-amber-800 mb-1">Referring Domains</h3>
          <p className="text-3xl font-bold">{Math.floor(count / 5).toLocaleString()}</p>
          <p className="text-sm text-gray-600">Unique domains linking to you</p>
        </div>
      </div>
      
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Backlink Growth</h3>
        <BacklinksChart data={backlinkData} />
      </div>
      
      <div>
        <h3 className="text-xl font-semibold mb-4">Top Referring Domains</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-4 text-left">Domain</th>
                <th className="py-2 px-4 text-left">Domain Authority</th>
                <th className="py-2 px-4 text-left">Backlinks</th>
                <th className="py-2 px-4 text-left">Quality</th>
              </tr>
            </thead>
            <tbody>
              {referringDomains.map((item, index) => (
                <tr key={index} className="border-b">
                  <td className="py-2 px-4 font-medium">{item.domain}</td>
                  <td className="py-2 px-4">{item.authority}</td>
                  <td className="py-2 px-4">{item.backlinks.toLocaleString()}</td>
                  <td className="py-2 px-4">
                    <span className={`px-2 py-1 rounded text-xs ${
                      item.authority >= 80 ? 'bg-green-100 text-green-800' : 
                      item.authority >= 60 ? 'bg-blue-100 text-blue-800' : 
                      item.authority >= 40 ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-red-100 text-red-800'
                    }`}>
                      {item.authority >= 80 ? 'Excellent' : 
                       item.authority >= 60 ? 'Good' : 
                       item.authority >= 40 ? 'Average' : 'Poor'}
                    </span>
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