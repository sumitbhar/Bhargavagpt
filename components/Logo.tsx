import React from 'react';

interface LogoProps {
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ className }) => (
  <div className={className}>
    <svg
      viewBox="0 0 256 256"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="BhargavaGPT Logo"
      role="img"
    >
      <defs>
        <linearGradient id="logo-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f9b17a" />
          <stop offset="100%" stopColor="#f16a7e" />
        </linearGradient>
        <filter id="logo-shadow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="3" dy="5" stdDeviation="5" floodColor="#000" floodOpacity="0.4"/>
        </filter>
      </defs>
      <g filter="url(#logo-shadow)" fill="url(#logo-gradient)">
        {/* Abstract "Emergent AI" Logo */}
        <path d="
          M 128,32
          C 142,32 156,42 168,50
          L 192,90
          C 198,92 204,96 208,102
          L 222,122
          C 224,128 224,136 222,142
          L 208,162
          C 204,168 198,172 192,174
          L 168,214
          C 156,222 142,232 128,232
          C 114,232 100,222 88,214
          L 64,174
          C 58,172 52,168 48,162
          L 34,142
          C 32,136 32,128 34,122
          L 48,102
          C 52,96 58,92 64,90
          L 88,50
          C 100,42 114,32 128,32
          Z
          M 128,56
          C 119,56 110,61 103,68
          L 83,102
          C 80,104 77,105 74,106
          L 54,124
          C 53,126 53,130 54,132
          L 74,150
          C 77,151 80,152 83,154
          L 103,188
          C 110,195 119,200 128,200
          C 137,200 146,195 153,188
          L 173,154
          C 176,152 179,151 182,150
          L 202,132
          C 203,130 203,126 202,124
          L 182,106
          C 179,105 176,104 173,102
          L 153,68
          C 146,61 137,56 128,56
          Z
        "/>
      </g>
    </svg>
  </div>
);

export default Logo;
