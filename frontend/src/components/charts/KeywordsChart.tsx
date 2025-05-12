import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface KeywordChartData {
  keyword: string;
  volume: number;
  difficulty: number;
  position?: number;
  trend?: number;
  cpc?: number;
}

interface KeywordsChartProps {
  data: KeywordChartData[];
}

export function KeywordsChart({ data }: KeywordsChartProps) {
  // Format data for display
  const chartData = data.map(item => ({
    ...item,
    keyword: item.keyword.length > 15 ? item.keyword.substring(0, 12) + '...' : item.keyword
  }));

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="keyword" />
          <YAxis />
          <Tooltip 
            formatter={(value: number) => [value.toLocaleString(), 'Search Volume']}
            labelFormatter={(label) => `Keyword: ${label}`}
          />
          <Bar dataKey="volume" fill="#8884d8" name="Search Volume" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
