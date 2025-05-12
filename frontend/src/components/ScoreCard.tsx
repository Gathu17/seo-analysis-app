import React from 'react';

interface ScoreCardProps {
  number: number;
  title: string;
  score: string;
}

export function ScoreCard({ number, title, score }: ScoreCardProps) {
  return (
    <div className="bg-white rounded-lg p-4 shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <div>
          <span className="font-bold text-gray-800">{number}.</span>
          <h3 className="font-bold text-gray-800">{title}</h3>
        </div>
        <div className="flex items-center justify-center w-12 h-12 rounded-full border-4 border-blue-500">
          <span className="text-xl font-bold text-blue-500">{score}</span>
        </div>
      </div>
    </div>
  );
}