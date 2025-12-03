
import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Rocket, Clock, Settings2, ChevronUp, ChevronDown } from 'lucide-react';
import { useGlobal } from '../../contexts/GlobalContext';

export const RelativitySim: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { t } = useGlobal();
  const [velocity, setVelocity] = useState(0.0);
  const [isRunning, setIsRunning] = useState(true);
  const [showControls, setShowControls] = useState(true);
  
  const timeRef = useRef(0);
  const starsRef = useRef<{x:number, y:number, z:number, size:number}[]>([]);
  const requestRef = useRef<number | null>(null);

  useEffect(() => {
      starsRef.current = Array.from({length: 200}, () => ({ x: Math.random() * 1000, y: Math.random() * 600, z: Math.random() * 2 + 0.5, size: Math.random() * 1.5 }));
  }, []);

  const reset = () => { setIsRunning(true); timeRef.current = 0; };

  const drawClockFace = (ctx: CanvasRenderingContext2D, x: number, y: number, timeVal: number, color: string, label: string) => {
      ctx.fillStyle = '#1e293b'; ctx.strokeStyle = color; ctx.lineWidth = 4;
      ctx.beginPath(); ctx.arc(x, y, 40, 0, Math.PI*2); ctx.fill(); ctx.stroke();
      ctx.strokeStyle = '#fff'; ctx.lineWidth = 1;
      for(let i=0; i<12; i++) {
          const ang = (i * 30) * Math.PI/180;
          ctx.beginPath(); ctx.moveTo(x + Math.cos(ang)*30, y + Math.sin(ang)*30); ctx.lineTo(x + Math.cos(ang)*35, y + Math.sin(ang)*35); ctx.stroke();
      }
      const handAng = (timeVal % 12) * (Math.PI/6) - Math.PI/2;
      ctx.strokeStyle = '#ef4444'; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + Math.cos(handAng)*30, y + Math.sin(handAng)*30); ctx.stroke();
      ctx.fillStyle = color; ctx.beginPath(); ctx.arc(x, y, 4, 0, Math.PI*2); ctx.fill();
      ctx.fillStyle = color; ctx.font = 'bold 12px sans-serif'; ctx.textAlign = 'center'; ctx.fillText(label, x, y + 60);
  };

  const draw = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      const w = canvas.width; const h = canvas.height;
      
      ctx.fillStyle = '#020617'; ctx.fillRect(0,0,w,h);
      const splitY = h/2;
      
      ctx.fillStyle = '#fff';
      starsRef.current.forEach(star => {
         const speed = velocity * 40 * star.z;
         const x = (star.x - timeRef.current * speed * 2) % w; 
         const drawX = x < 0 ? x + w : x;
         ctx.globalAlpha = 0.6 * star.z; ctx.beginPath(); ctx.arc(drawX, star.y, star.size, 0, Math.PI*2); ctx.fill();
      });
      ctx.globalAlpha = 1;

      ctx.strokeStyle = '#3b82f6'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(0, splitY); ctx.lineTo(w, splitY); ctx.stroke();
      const gamma = 1 / Math.sqrt(1 - velocity*velocity);
      
      // Draw Section Headers (Centered to avoid UI overlap)
      ctx.fillStyle = '#60a5fa'; ctx.font = 'bold 16px monospace'; ctx.textAlign = 'center';
      ctx.fillText(t('earth_clock').toUpperCase() + " (v=0)", w/2, 30);
      
      const earthTime = timeRef.current * 2; 
      drawClockFace(ctx, w/2, splitY/2 + 10, earthTime, '#60a5fa', "Δt (Earth)");

      ctx.fillStyle = '#f87171';
      ctx.fillText(t('ship_clock').toUpperCase() + ` (v=${(velocity*100).toFixed(0)}% c)`, w/2, splitY + 30);
      
      const shipTime = earthTime / gamma;
      drawClockFace(ctx, w/2, splitY + splitY/2 + 10, shipTime, '#f87171', "Δt₀ (Ship)");

      const cx = w/2 + 200; const cy = splitY + splitY/2 + 10;
      ctx.fillStyle = '#334155'; ctx.beginPath(); ctx.moveTo(cx, cy-20); ctx.lineTo(cx+60, cy); ctx.lineTo(cx, cy+20); ctx.fill();
      if (isRunning && velocity > 0) {
          ctx.fillStyle = '#f59e0b'; ctx.beginPath(); ctx.moveTo(cx, cy-10); ctx.lineTo(cx-20-Math.random()*10, cy); ctx.lineTo(cx, cy+10); ctx.fill();
      }
  };

  const animate = () => { if (isRunning) timeRef.current += 0.02; draw(); requestRef.current = requestAnimationFrame(animate); };
  useEffect(() => { requestRef.current = requestAnimationFrame(animate); return () => { if (requestRef.current) cancelAnimationFrame(requestRef.current); }; }, [isRunning, velocity, t]);

  const gamma = 1 / Math.sqrt(1 - velocity*velocity);

  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden bg-slate-950 shadow-2xl border border-slate-800">
        <canvas ref={canvasRef} width={900} height={500} className="absolute inset-0 w-full h-full object-contain" />
        
        {/* HUD */}
        <div className="absolute top-4 right-4 pointer-events-none">
            <div className="bg-slate-900/90 backdrop-blur p-4 rounded-xl border border-blue-500/30 w-64 shadow-2xl">
                <div className="flex items-center gap-2 border-b border-slate-700 pb-2 mb-2">
                    <Clock size={16} className="text-blue-400"/>
                    <span className="text-xs font-bold text-white uppercase">{t('time_dilation')}</span>
                </div>
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <div className="text-xs text-slate-400">{t('lorentz_factor')} (γ):</div>
                        <div className="text-xl font-mono text-yellow-400 font-bold">{gamma.toFixed(3)}</div>
                    </div>
                    <div className="text-[10px] text-slate-500 italic text-center mt-2">Δt = γ · Δt₀</div>
                </div>
            </div>
        </div>

        {/* CONTROLS */}
        <div className={`absolute top-4 left-4 transition-all duration-300 z-10 ${showControls ? 'w-80' : 'w-12'}`}>
            <div className="bg-slate-900/90 backdrop-blur-md border border-slate-700/50 rounded-2xl shadow-2xl overflow-hidden">
                <button onClick={() => setShowControls(!showControls)} className="w-full p-3 flex items-center justify-between text-slate-300 hover:bg-slate-800 transition-colors border-b border-slate-700/50">
                    {showControls ? <span className="text-xs font-bold uppercase tracking-widest flex items-center gap-2"><Settings2 size={14} className="text-blue-400"/> Control Center</span> : <Settings2 size={20} className="mx-auto text-blue-400"/>}
                    {showControls && (showControls ? <ChevronUp size={14}/> : <ChevronDown size={14}/>)}
                </button>

                {showControls && (
                    <div className="p-5 space-y-6">
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <label className="text-sm font-bold uppercase text-red-400 flex items-center gap-2">
                                    <Rocket size={16}/> {t('velocity')}
                                </label>
                                <span className="text-xl font-mono font-bold text-white">{(velocity * 100).toFixed(0)}% c</span>
                            </div>
                            <div className="relative h-6 bg-slate-800 rounded-full border border-slate-700 overflow-hidden cursor-pointer">
                                <div className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-600 to-red-600 transition-all duration-300" style={{width: `${velocity*100}%`}}></div>
                                <input type="range" min="0" max="0.99" step="0.01" value={velocity} onChange={e => { reset(); setVelocity(Number(e.target.value)); }} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                            </div>
                        </div>
                        <div className="w-full h-px bg-slate-700/50"></div>
                        <div className="grid grid-cols-4 gap-2">
                            <button onClick={() => setIsRunning(!isRunning)} className={`col-span-3 py-3 rounded-xl font-bold text-white shadow-lg flex items-center justify-center gap-2 transition-all ${isRunning ? 'bg-amber-600' : 'bg-blue-600'}`}>
                                {isRunning ? <Pause size={18}/> : <Play size={18}/>} {isRunning ? t('pause').toUpperCase() : t('start').toUpperCase()}
                            </button>
                            <button onClick={reset} className="col-span-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl flex items-center justify-center border border-slate-700">
                                <RotateCcw size={18}/>
                            </button>
                        </div>
                    </div>
                )}
            </div>
         </div>
    </div>
  );
};
