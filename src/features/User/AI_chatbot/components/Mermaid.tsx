import React, { useEffect, useRef } from 'react';
import mermaid from 'mermaid';

mermaid.initialize({
  startOnLoad: true,
  theme: 'base',
  themeVariables: {
    fontFamily: '"Comic Sans MS", "Chalkboard SE", "Comic Neue", cursive',
    primaryColor: '#FF69B4', // Hot Pink
    primaryTextColor: '#fff',
    primaryBorderColor: '#C71585',
    lineColor: '#00FA9A', // Spring Green
    secondaryColor: '#FFD700', // Gold
    tertiaryColor: '#f9fafb',
    fontSize: '16px',
  },
  flowchart: { 
    curve: 'basis', 
    htmlLabels: true,
    nodeSpacing: 50,
    rankSpacing: 50,
    useMaxWidth: true,
  }
});

export const Mermaid: React.FC<{ chart: string }> = ({ chart }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current && chart) {
      // Clean up previous SVG before re-rendering
      ref.current.innerHTML = ''; 
      const id = `mermaid-${Math.random().toString(36).substring(2, 9)}`;
      
      try {
        mermaid.render(id, chart).then((result) => {
          if (ref.current) {
            ref.current.innerHTML = result.svg;
            // Add a "wobble" or "bounce" entrance for kids
            const svg = ref.current.querySelector('svg');
            if (svg) svg.style.animation = 'fadeInUp 0.5s ease-out';
          }
        }).catch((err) => {
          console.error("Mermaid Syntax Error:", err);
          if (ref.current) {
             ref.current.innerHTML = `
              <div class="text-xs text-yellow-500 border-2 border-dashed border-yellow-700 p-3 rounded-xl text-center">
                ✨ Thinking... the map is being drawn! ✨
              </div>`;
          }
        });
      } catch (e) {
        console.error("Render failed", e);
      }
    }
  }, [chart]);

  return (
    <div 
      ref={ref} 
      className="mt-4 bg-gray-900/50 p-6 rounded-3xl border-4 border-gray-800 shadow-xl overflow-x-auto flex justify-center" 
    />
  );
};