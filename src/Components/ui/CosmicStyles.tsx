// src/components/ui/CosmicStyles.tsx
import React from "react";

export function CosmicStyles() {
  return (
    <style>
      {`
        @keyframes gradient-shift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        @keyframes gradient-flow {
          0% { background-position: 0% 0%; }
          100% { background-position: 400% 400%; }
        }
        
        @keyframes particle-float {
          0% { 
            opacity: 1;
            transform: translate(0, 0) scale(1);
          }
          100% { 
            opacity: 0;
            transform: translate(
              calc((0.5 - random()) * 60px),
              calc((0.5 - random()) * 60px)
            ) scale(0);
          }
        }
        
        @keyframes scanline {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
        @keyframes glow-sweep {
          0%, 100% { opacity: 0; }
          50% { opacity: 0.5; }
        }
        
        .animate-gradient-shift {
          background-size: 200% 200%;
          animation: gradient-shift 3s ease infinite;
        }
        
        .animate-gradient-flow {
          animation: gradient-flow 8s linear infinite;
        }
      `}
    </style>
  );
}