
import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Activity, Settings2, ChevronUp, ChevronDown } from 'lucide-react';
import { useGlobal } from '../../contexts/GlobalContext';

export const SpringSim: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const graphRef = useRef<HTMLCanvasElement>(null);
  const { t } = useGlobal();
  
  // Params
  const [mass, setMass] = useState(2.0); // kg
  const [k, setK] = useState(50); // N/m
  const [damping, setDamping] = useState(0.2);
  const [isRunning, setIsRunning] = useState(true);
  const [showControls, setShowControls] = useState(true);
  
  // Physics State
  const stateRef = useRef({ y: 300, v: 0, t: 0, isDragging: false });
  const historyRef = useRef<{t:number, y:number}[]>([]);
  const requestRef = useRef<number | null>(null);
  const L0 = 150; 

  const reset = () => {
      setIsRunning(true);
      stateRef.current = { y: 300, v: 0, t: 0, isDragging: false };
      historyRef.current = [];
  };

  const updatePhysics = (dt: number) => {
      if (stateRef.current.isDragging) return;
      const { y, v } = stateRef.current;
      const g = 9.8 * 20; 
      const x = y - L0; 
      const F_spring = -k * x;
      const F_damp = -damping * v * 10;
      const F_grav = mass * g;
      const a = (F_spring + F_damp + F_grav) / mass;
      stateRef.current.v += a * dt;
      stateRef.current.y += stateRef.current.v * dt;
      stateRef.current.t += dt;
      historyRef.current.push({ t: stateRef.current.t, y: stateRef.current.y });
      if (historyRef.current.length > 300) historyRef.current.shift();
  };

  const drawSystem = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      const w = canvas.width;
      const h = canvas.height;
      const cx = w / 2;
      const eqY = L0 + (mass * 9.8 * 20) / k;
      const currentY = stateRef.current.y;
      const lowestPoint = Math.max(currentY, eqY) + 120; 
      const targetScale = Math.min(1, (h - 100) / lowestPoint);
      const scale = targetScale;

      ctx.clearRect(0, 0, w, h);
      ctx.save();
      ctx.translate(cx, 0);
      ctx.scale(scale, scale);
      ctx.translate(-cx, 0);

      const y = stateRef.current.y;

      ctx.fillStyle = '#334155'; ctx.fillRect(cx - 60, 0, 120, 20);
      ctx.strokeStyle = '#475569'; ctx.lineWidth = 2;
      ctx.beginPath(); for(let i=-50; i<60; i+=10) { ctx.moveTo(cx+i, 0); ctx.lineTo(cx+i-10, 20); } ctx.stroke();
      
      ctx.beginPath();
      const coils = 12;
      const springTop = 20;
      const springBottom = y;
      const segH = (springBottom - springTop) / coils;
      ctx.moveTo(cx, springTop);
      for(let i=0; i<=coils; i++) {
          const py = springTop + i*segH;
          const dir = i%2===0 ? 1 : -1;
          const coilW = 30; 
          if (i===0) ctx.lineTo(cx + coilW*dir, py + segH/2);
          else if (i===coils) ctx.lineTo(cx, py);
          else ctx.lineTo(cx + coilW*dir, py + segH/2);
          if (i<coils) ctx.lineTo(cx - coilW*dir, py + segH);
      }
      const grad = ctx.createLinearGradient(cx-30, 0, cx+30, 0);
      grad.addColorStop(0, '#64748b'); grad.addColorStop(0.5, '#e2e8f0'); grad.addColorStop(1, '#475569');
      ctx.strokeStyle = grad; ctx.lineWidth = 6; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.stroke();

      const size = 70;
      const half = size / 2;
      ctx.fillStyle = stateRef.current.isDragging ? '#fbbf24' : '#ef4444';
      ctx.shadowBlur = 15; ctx.shadowColor = 'rgba(0,0,0,0.5)';
      ctx.fillRect(cx - half, y, size, size);
      ctx.shadowBlur = 0;
      ctx.fillStyle = 'rgba(255,255,255,0.15)'; ctx.fillRect(cx - half, y, size, size/2);
      ctx.fillStyle = '#fff'; ctx.font = 'bold 20px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText(`${mass.toFixed(1)}kg`, cx, y + half);

      ctx.strokeStyle = '#3b82f6'; ctx.setLineDash([5, 5]); ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(cx - 120, eqY + half); ctx.lineTo(cx + 120, eqY + half); ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = '#60a5fa'; ctx.font = 'bold 14px sans-serif'; ctx.textAlign = 'left';
      ctx.fillText(t('equilibrium_line'), cx + 130, eqY + half + 4);
      ctx.restore();
  };

  const drawGraph = () => {
      const cvs = graphRef.current;
      if (!cvs) return;
      const ctx = cvs.getContext('2d');
      if (!ctx) return;
      const w = cvs.width; const h = cvs.height;
      ctx.clearRect(0,0,w,h);
      ctx.fillStyle = 'rgba(15, 23, 42, 0.8)'; ctx.fillRect(0,0,w,h);
      ctx.strokeStyle = '#1e293b'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(0, h/2); ctx.lineTo(w, h/2); ctx.stroke();
      
      ctx.strokeStyle = '#ef4444'; ctx.lineWidth = 2; ctx.beginPath();
      const data = historyRef.current;
      if (data.length < 2) return;
      const now = stateRef.current.t;
      const timeWindow = 5; 
      for(let i=0; i<data.length; i++) {
          const p = data[i];
          const timeOffset = now - p.t;
          const px = w - (timeOffset / timeWindow) * w;
          const eqY = L0 + (mass * 9.8 * 20) / k;
          const disp = p.y - eqY; 
          const py = h/2 + disp * 0.5; 
          if (i===0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      ctx.stroke();
  };

  const animate = () => {
      if (isRunning) { for(let i=0; i<4; i++) updatePhysics(0.016/4); }
      drawSystem();
      drawGraph();
      requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
      requestRef.current = requestAnimationFrame(animate);
      return () => { if (requestRef.current) cancelAnimationFrame(requestRef.current); };
  }, [isRunning, mass, k, damping, t]);

  const handleMouseDown = (e: React.MouseEvent) => {
      const cvs = canvasRef.current;
      if (!cvs) return;
      const rect = cvs.getBoundingClientRect();
      const scaleY = cvs.height / rect.height; 
      const x = (e.clientX - rect.left) * (cvs.width / rect.width);
      const cx = cvs.width/2;
      if (Math.abs(x - cx) < 100) { stateRef.current.isDragging = true; stateRef.current.v = 0; }
  };
  const handleMouseMove = (e: React.MouseEvent) => {
      if (!stateRef.current.isDragging) return;
      const cvs = canvasRef.current;
      if (!cvs) return;
      const rect = cvs.getBoundingClientRect();
      const scaleY = cvs.height / rect.height;
      let newY = (e.clientY - rect.top) * scaleY;
      if (newY < 100) newY = 100;
      stateRef.current.y = newY - 35;
  };

  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden bg-slate-950 shadow-2xl border border-slate-800">
        <canvas 
            ref={canvasRef} 
            width={1000} 
            height={600} 
            className="absolute inset-0 w-full h-full object-contain cursor-grab active:cursor-grabbing"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={() => stateRef.current.isDragging = false}
            onMouseLeave={() => stateRef.current.isDragging = false}
        />

        {/* HUD GRAPH */}
        <div className="absolute top-4 right-4 w-64 h-32 rounded-xl overflow-hidden border border-slate-700 shadow-xl pointer-events-none">
            <div className="absolute top-2 left-2 text-[10px] text-slate-400 font-bold uppercase flex items-center gap-1 z-10">
                <Activity size={12}/> {t('graph_pos_time')}
            </div>
            <canvas ref={graphRef} width={256} height={128} className="w-full h-full" />
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
                            <div className="space-y-1">
                                <div className="flex justify-between text-xs">
                                    <span className="text-slate-300 font-medium">{t('mass')}</span>
                                    <span className="text-red-400 font-mono">{mass} kg</span>
                                </div>
                                <input type="range" min="1" max="10" step="0.5" value={mass} onChange={e => setMass(Number(e.target.value))} className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-red-500"/>
                            </div>
                            <div className="space-y-1">
                                <div className="flex justify-between text-xs">
                                    <span className="text-slate-300 font-medium">{t('stiffness')}</span>
                                    <span className="text-blue-400 font-mono">{k} N/m</span>
                                </div>
                                <input type="range" min="20" max="200" step="10" value={k} onChange={e => setK(Number(e.target.value))} className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"/>
                            </div>
                            <div className="space-y-1">
                                <div className="flex justify-between text-xs">
                                    <span className="text-slate-300 font-medium">{t('damping')}</span>
                                    <span className="text-purple-400 font-mono">{damping}</span>
                                </div>
                                <input type="range" min="0" max="1.0" step="0.05" value={damping} onChange={e => setDamping(Number(e.target.value))} className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-500"/>
                            </div>
                        </div>
                        <div className="w-full h-px bg-slate-700/50"></div>
                        <div className="grid grid-cols-4 gap-2">
                            <button onClick={() => setIsRunning(!isRunning)} className={`col-span-3 py-3 rounded-xl font-bold text-white shadow-lg flex items-center justify-center gap-2 transition-all ${isRunning ? 'bg-amber-600' : 'bg-emerald-600'}`}>
                                {isRunning ? <Pause size={18}/> : <Play size={18}/>} {isRunning ? t('pause').toUpperCase() : t('simulate').toUpperCase()}
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
