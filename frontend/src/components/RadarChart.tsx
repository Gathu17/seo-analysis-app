import React from 'react';

export function RadarChart() {
  return (
    <div className="relative w-full h-full">
      {/* Pentagon background */}
      <div className="absolute inset-0">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          {/* Outer pentagon */}
          <polygon 
            points="50,10 90,40 75,85 25,85 10,40" 
            fill="none" 
            stroke="#E5B27F" 
            strokeWidth="1"
          />
          {/* Inner pentagons */}
          <polygon 
            points="50,22 78,44 67,77 33,77 22,44" 
            fill="none" 
            stroke="#E5B27F" 
            strokeWidth="0.5"
          />
          <polygon 
            points="50,34 66,48 59,69 41,69 34,48" 
            fill="none" 
            stroke="#E5B27F" 
            strokeWidth="0.5"
          />
          <polygon 
            points="50,46 54,52 51,61 49,61 46,52" 
            fill="none" 
            stroke="#E5B27F" 
            strokeWidth="0.5"
          />
          
          {/* Data pentagon */}
          <polygon 
            points="50,22 78,44 67,77 33,77 22,44" 
            fill="#F8D3A7" 
            fillOpacity="0.6" 
            stroke="#E5B27F" 
            strokeWidth="1"
          />
          
          {/* Axis lines */}
          <line x1="50" y1="10" x2="50" y2="85" stroke="#E5B27F" strokeWidth="0.5" strokeDasharray="2,2" />
          <line x1="10" y1="40" x2="90" y2="40" stroke="#E5B27F" strokeWidth="0.5" strokeDasharray="2,2" />
          <line x1="25" y1="85" x2="75" y2="85" stroke="#E5B27F" strokeWidth="0.5" strokeDasharray="2,2" />
          <line x1="50" y1="10" x2="25" y2="85" stroke="#E5B27F" strokeWidth="0.5" strokeDasharray="2,2" />
          <line x1="50" y1="10" x2="75" y2="85" stroke="#E5B27F" strokeWidth="0.5" strokeDasharray="2,2" />
          
          {/* Labels */}
          <text x="50" y="5" textAnchor="middle" fontSize="8" fill="#000">1</text>
          <text x="95" y="40" textAnchor="middle" fontSize="8" fill="#000">2</text>
          <text x="80" y="90" textAnchor="middle" fontSize="8" fill="#000">3</text>
          <text x="20" y="90" textAnchor="middle" fontSize="8" fill="#000">4</text>
          <text x="5" y="40" textAnchor="middle" fontSize="8" fill="#000">5</text>
        </svg>
      </div>
    </div>
  );
}