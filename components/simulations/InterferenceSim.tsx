
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Settings2, ChevronUp, ChevronDown } from 'lucide-react';
import { useGlobal } from '../../contexts/GlobalContext';

export const InterferenceSim: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { t } = useGlobal();
  const [wavelength, setWavelength] = useState(25);
  const [separation, setSeparation] = useState(40);
  const [showControls, setShowControls] = useState(true);
  const animationRef = useRef<number|null>(null);

  // High Resolution Render
  const renderWidth = 400; const renderHeight = 300;

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;
    
    const imgData = ctx.createImageData(renderWidth, renderHeight);
    const data = imgData.data;
    const cx = renderWidth / 2; const cy = renderHeight / 2;
    const s1x = cx - (separation / 2); const s1y = cy;
    const s2x = cx + (separation / 2); const s2y = cy;
    const time = Date.now() / 100;
    const k = (2 * Math.PI) / (wavelength / 2.5);

    for(let y = 0; y < renderHeight; y++) {
        for(let x = 0; x < renderWidth; x++) {
            const d1 = Math.sqrt((x - s1x)**2 + (y - s1y)**2);
            const d2 = Math.sqrt((x - s2x)**2 + (y - s2y)**2);
            const val1 = Math.sin(k * d1 - time);
            const val2 = Math.sin(k * d2 - time);
            const amplitude = val1 + val2; // Range -2 to +2
            
            let r=0, g=0, b=0;
            if (amplitude > 0) {
                const t = amplitude / 2; 
                r = t * 255; g = (t > 0.8) ? (t-0.8)*5 * 255 : 0; b = (t > 0.8) ? (t-0.8)*5 * 255 : 0;
            } else {
                const t = Math.abs(amplitude) / 2; 
                r = (t > 0.8) ? (t-0.8)*5 * 255 : 0; g = (t > 0.8) ? (t-0.8)*5 * 255 : 0; b = t * 255;
            }
            const i = (y * renderWidth + x) * 4;
            data[i] = r; data[i+1] = g; data[i+2] = b; data[i+3] = 255;
        }
    }
    ctx.putImageData(imgData, 0, 0);
    
    ctx.fillStyle = '#fff'; ctx.shadowColor = 'white'; ctx.shadowBlur = 10;
    ctx.beginPath(); ctx.arc(s1x, s1y, 4, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(s2x, s2y, 4, 0, Math.PI*2); ctx.fill();
    
    animationRef.current = requestAnimationFrame(draw);
  }, [wavelength, separation]);
  
  useEffect(() => {
      animationRef.current = requestAnimationFrame(draw);
      return () => { if(animationRef.current) cancelAnimationFrame(animationRef.current); };
  }, [draw]);

  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden bg-black shadow-2xl border border-slate-800">
        <canvas ref={canvasRef} width={renderWidth} height={renderHeight} className="absolute inset-0 w-full h-full object-cover" style={{ imageRendering: 'pixelated' }} />
        
        <div className="absolute top-4 right-4 bg-black/70 p-3 rounded-xl text-xs text-white border border-white/20 backdrop-blur font-bold pointer-events-none">
             <div className="flex items-center gap-2 mb-1"><div className="w-3 h-3 bg-red-600 rounded-full"></div> {t('crest')}</div>
             <div className="flex items-center gap-2 mb-1"><div className="w-3 h-3 bg-blue-600 rounded-full"></div> {t('trough')}</div>
             <div className="flex items-center gap-2"><div className="w-3 h-3 bg-black border border-white rounded-full"></div> {t('node')}</div>
        </div>

        {/* CONTROLS */}
        <div className={`absolute top-4 left-4 transition-all duration-300 z-10 ${showControls ? 'w-80' : 'w-12'}`}>
            <div className="bg-slate-900/90 backdrop-blur-md border border-slate-700/50 rounded-2xl shadow-2xl overflow-hidden">
                <button onClick={() => setShowControls(!showControls)} className="w-full p-3 flex items-center justify-between text-slate-300 hover:bg-slate-800 transition-colors border-b border-slate-700/50">
                    {showControls ? <span className="text-xs font-bold uppercase tracking-widest flex items-center gap-2"><Settings2 size={14} className="text-blue-400"/> {t('control_center')}</span> : <Settings2 size={20} className="mx-auto text-blue-400"/>}
                    {showControls && (showControls ? <ChevronUp size={14}/> : <ChevronDown size={14}/>)}
                </button>

                {showControls && (
                    <div className="p-5 space-y-6">
                        <div className="space-y-4">
                            <div className="space-y-1">
                                <div className="flex justify-between text-xs text-slate-300"><span>{t('wavelength')} (λ)</span><span className="text-blue-400">{wavelength}</span></div>
                                <input type="range" min="10" max="60" value={wavelength} onChange={e => setWavelength(Number(e.target.value))} className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"/>
                            </div>
                            <div className="space-y-1">
                                <div className="flex justify-between text-xs text-slate-300"><span>{t('separation')}</span><span className="text-cyan-400">{separation}</span></div>
                                <input type="range" min="10" max="100" value={separation} onChange={e => setSeparation(Number(e.target.value))} className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"/>
                            </div>
                        </div>
                    </div>
                )}
            </div>
         </div>
    </div>
  );
};
