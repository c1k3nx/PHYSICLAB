
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Settings2 } from 'lucide-react';

export const InterferenceSim: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [wavelength, setWavelength] = useState(25);
  const [separation, setSeparation] = useState(40);
  const animationRef = useRef<number|null>(null);

  // High Resolution Render
  const renderWidth = 400;
  const renderHeight = 300;

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;
    
    const imgData = ctx.createImageData(renderWidth, renderHeight);
    const data = imgData.data;
    
    const cx = renderWidth / 2;
    const cy = renderHeight / 2;
    
    const s1x = cx - (separation / 2);
    const s1y = cy;
    const s2x = cx + (separation / 2);
    const s2y = cy;
    
    const time = Date.now() / 100;
    const k = (2 * Math.PI) / (wavelength / 2.5);

    for(let y = 0; y < renderHeight; y++) {
        for(let x = 0; x < renderWidth; x++) {
            const d1 = Math.sqrt((x - s1x)**2 + (y - s1y)**2);
            const d2 = Math.sqrt((x - s2x)**2 + (y - s2y)**2);
            
            const val1 = Math.sin(k * d1 - time);
            const val2 = Math.sin(k * d2 - time);
            
            const amplitude = val1 + val2; // Range -2 to +2
            
            // HIGH CONTRAST COLOR MAP (Red/Blue/Black)
            // Positive Peak (> 0): Red to White
            // Negative Peak (< 0): Blue to Cyan
            // Zero: Black
            
            let r=0, g=0, b=0;
            
            if (amplitude > 0) {
                // Constructive Positive
                const t = amplitude / 2; // 0 to 1
                r = t * 255;
                g = (t > 0.8) ? (t-0.8)*5 * 255 : 0; // Only white at very peak
                b = (t > 0.8) ? (t-0.8)*5 * 255 : 0;
            } else {
                // Constructive Negative
                const t = Math.abs(amplitude) / 2; // 0 to 1
                r = (t > 0.8) ? (t-0.8)*5 * 255 : 0;
                g = (t > 0.8) ? (t-0.8)*5 * 255 : 0;
                b = t * 255;
            }
            
            // Destructive Interference is Black (amp near 0)

            const i = (y * renderWidth + x) * 4;
            data[i] = r;
            data[i+1] = g;
            data[i+2] = b;
            data[i+3] = 255;
        }
    }
    
    ctx.putImageData(imgData, 0, 0);
    
    // Draw Sources
    ctx.fillStyle = '#fff';
    ctx.shadowColor = 'white'; ctx.shadowBlur = 10;
    ctx.beginPath(); ctx.arc(s1x, s1y, 4, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(s2x, s2y, 4, 0, Math.PI*2); ctx.fill();
    
    animationRef.current = requestAnimationFrame(draw);
  }, [wavelength, separation]);
  
  useEffect(() => {
      animationRef.current = requestAnimationFrame(draw);
      return () => { if(animationRef.current) cancelAnimationFrame(animationRef.current); };
  }, [draw]);

  return (
      <div className="flex flex-col h-full gap-4">
      <div className="relative flex-grow bg-black rounded-xl overflow-hidden border border-slate-700 shadow-2xl">
         <canvas 
            ref={canvasRef} 
            width={renderWidth} 
            height={renderHeight} 
            className="w-full h-full object-cover rendering-pixelated"
            style={{ imageRendering: 'pixelated' }}
         />
         <div className="absolute top-4 right-4 bg-black/70 p-3 rounded-lg text-xs text-white border border-white/20 backdrop-blur font-bold">
             <div className="flex items-center gap-2 mb-1"><div className="w-3 h-3 bg-red-600 rounded-full"></div> Crest (Peak +)</div>
             <div className="flex items-center gap-2 mb-1"><div className="w-3 h-3 bg-blue-600 rounded-full"></div> Trough (Peak -)</div>
             <div className="flex items-center gap-2"><div className="w-3 h-3 bg-black border border-white rounded-full"></div> Node (Zero)</div>
         </div>
      </div>
      
      <div className="bg-slate-900/80 backdrop-blur p-6 rounded-xl border border-slate-700/50 grid grid-cols-1 md:grid-cols-2 gap-8 shadow-xl">
           <div className="space-y-3">
            <div className="flex justify-between items-center">
                 <label className="text-xs font-bold text-blue-400 uppercase tracking-wider flex items-center gap-2">
                    <Settings2 size={14} /> Wavelength (λ)
                 </label>
            </div>
            <input type="range" min="10" max="60" value={wavelength} onChange={e => setWavelength(Number(e.target.value))} className="w-full accent-blue-500" />
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
                 <label className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
                    <Settings2 size={14} /> Source Separation (d)
                 </label>
            </div>
            <input type="range" min="10" max="100" value={separation} onChange={e => setSeparation(Number(e.target.value))} className="w-full accent-cyan-500" />
          </div>
      </div>
     </div>
  );
};
