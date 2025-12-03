
import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Settings2, ChevronUp, ChevronDown } from 'lucide-react';
import { useGlobal } from '../../contexts/GlobalContext';

export const CircularSim: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { t } = useGlobal();
  const [radius, setRadius] = useState(150);
  const [speed, setSpeed] = useState(1);
  const [mass, setMass] = useState(10);
  const [isRunning, setIsRunning] = useState(true);
  const [showControls, setShowControls] = useState(true);
  
  const angleRef = useRef(0);
  const trailRef = useRef<{x: number, y: number, alpha: number}[]>([]);
  const requestRef = useRef<number | null>(null);

  const draw = () => {
      // ... drawing code unchanged ...
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      
      const w = canvas.width;
      const h = canvas.height;
      const cx = w/2;
      const cy = h/2;
      
      const grad = ctx.createRadialGradient(cx, cy, 100, cx, cy, 600);
      grad.addColorStop(0, '#1e293b');
      grad.addColorStop(1, '#020617');
      ctx.fillStyle = grad;
      ctx.fillRect(0,0,w,h);
      
      const scaleY = 0.4;
      
      ctx.beginPath();
      ctx.ellipse(cx, cy, radius, radius * scaleY, 0, 0, Math.PI*2);
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.2)';
      ctx.lineWidth = 2;
      ctx.stroke();
      
      ctx.strokeStyle = 'rgba(51, 65, 85, 0.3)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      for(let i=-5; i<=5; i++) {
          ctx.moveTo(cx - 300, cy + i * 50 * scaleY);
          ctx.lineTo(cx + 300, cy + i * 50 * scaleY);
      }
      ctx.stroke();

      const angle = angleRef.current;
      const x = cx + radius * Math.cos(angle);
      const y = cy + radius * Math.sin(angle) * scaleY;
      
      trailRef.current.push({x, y, alpha: 1.0});
      if (trailRef.current.length > 50) trailRef.current.shift();
      
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      
      for(let i=0; i<trailRef.current.length-1; i++) {
          const p1 = trailRef.current[i];
          const p2 = trailRef.current[i+1];
          p1.alpha -= 0.02;
          
          ctx.beginPath();
          ctx.strokeStyle = `rgba(59, 130, 246, ${Math.max(0, p1.alpha)})`;
          ctx.lineWidth = 4 * p1.alpha;
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
      }

      ctx.fillStyle = '#64748b';
      ctx.beginPath(); ctx.arc(cx, cy, 5, 0, Math.PI*2); ctx.fill();
      
      ctx.beginPath(); ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 2;
      ctx.moveTo(cx, cy); ctx.lineTo(x, y); ctx.stroke();

      const vMag = speed * 40;
      const vx = -Math.sin(angle) * vMag;
      const vy = Math.cos(angle) * vMag * scaleY;
      
      const drawVector = (vx: number, vy: number, color: string, label: string) => {
          ctx.shadowBlur = 10; ctx.shadowColor = color;
          ctx.strokeStyle = color; ctx.lineWidth = 4;
          ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x+vx, y+vy); ctx.stroke();
          ctx.fillStyle = color; ctx.beginPath(); ctx.arc(x+vx, y+vy, 4, 0, Math.PI*2); ctx.fill();
          ctx.fillStyle = '#fff'; ctx.font='bold 14px sans-serif'; ctx.shadowBlur=0;
          ctx.fillText(label, x+vx+10, y+vy);
      };

      drawVector(vx, vy, '#ef4444', 'v');

      const fMag = (mass * speed * speed * radius) / 3000 * 50; 
      const fx = (cx - x) / radius * fMag; 
      const fy = (cy - y) / (radius * scaleY) * fMag * scaleY; 
      
      drawVector(fx, fy, '#facc15', 'F_ht');

      const rObj = 15;
      const ballGrad = ctx.createRadialGradient(x-5, y-5, 2, x, y, rObj);
      ballGrad.addColorStop(0, '#60a5fa');
      ballGrad.addColorStop(1, '#1e3a8a');
      ctx.fillStyle = ballGrad;
      ctx.shadowBlur = 15; ctx.shadowColor = '#3b82f6';
      ctx.beginPath(); ctx.arc(x, y, rObj, 0, Math.PI*2); ctx.fill();
      ctx.shadowBlur = 0;
  };
  
  const animate = () => {
      if (!isRunning) return;
      angleRef.current += speed * 0.02;
      draw();
      requestRef.current = requestAnimationFrame(animate);
  };
  
  useEffect(() => {
      if (isRunning) requestRef.current = requestAnimationFrame(animate);
      else draw();
      return () => { if(requestRef.current) cancelAnimationFrame(requestRef.current); };
  }, [isRunning, radius, speed]);

  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden bg-slate-950 shadow-2xl border border-slate-800">
         <canvas ref={canvasRef} width={1000} height={600} className="absolute inset-0 w-full h-full object-cover" />
         
         <div className="absolute top-4 right-4 space-y-2 pointer-events-none">
             <div className="flex items-center gap-2 bg-slate-900/50 backdrop-blur px-3 py-1 rounded-full border border-red-500/30">
                 <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                 <span className="text-red-400 text-xs font-bold uppercase tracking-wider">{t('vel_tangent')}</span>
             </div>
             <div className="flex items-center gap-2 bg-slate-900/50 backdrop-blur px-3 py-1 rounded-full border border-yellow-500/30">
                 <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse"></div>
                 <span className="text-yellow-400 text-xs font-bold uppercase tracking-wider">{t('centripetal_force')}</span>
             </div>
         </div>

         {/* CONTROL PANEL */}
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
                                <div className="flex justify-between text-xs">
                                    <span className="text-slate-300 font-medium">{t('orbit_radius')} (r)</span>
                                    <span className="text-blue-400 font-mono">{radius}m</span>
                                </div>
                                <input type="range" min="50" max="250" value={radius} onChange={e => { trailRef.current=[]; setRadius(Number(e.target.value))}} className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500" />
                            </div>
                            <div className="space-y-1">
                                <div className="flex justify-between text-xs">
                                    <span className="text-slate-300 font-medium">{t('angular_vel')} (ω)</span>
                                    <span className="text-red-400 font-mono">{speed} rad/s</span>
                                </div>
                                <input type="range" min="0.5" max="5" step="0.1" value={speed} onChange={e => setSpeed(Number(e.target.value))} className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-red-500" />
                            </div>
                            <div className="space-y-1">
                                <div className="flex justify-between text-xs">
                                    <span className="text-slate-300 font-medium">{t('mass')} (m)</span>
                                    <span className="text-yellow-400 font-mono">{mass} kg</span>
                                </div>
                                <input type="range" min="5" max="50" value={mass} onChange={e => setMass(Number(e.target.value))} className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-yellow-500" />
                            </div>
                        </div>
                        <div className="w-full h-px bg-slate-700/50"></div>
                        <div className="grid grid-cols-4 gap-2">
                            <button onClick={() => setIsRunning(!isRunning)} className={`col-span-3 py-3 rounded-xl font-bold text-white shadow-lg flex items-center justify-center gap-2 transition-all ${isRunning ? 'bg-amber-600 hover:bg-amber-500' : 'bg-emerald-600 hover:bg-emerald-500'}`}>
                                {isRunning ? <Pause size={18}/> : <Play size={18}/>} {isRunning ? t('pause').toUpperCase() : t('simulate').toUpperCase()}
                            </button>
                            <button onClick={() => {trailRef.current=[]; angleRef.current=0; draw();}} className="col-span-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl flex items-center justify-center border border-slate-700">
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
