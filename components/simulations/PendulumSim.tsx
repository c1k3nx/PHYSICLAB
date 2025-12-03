
import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Grab, Timer, Settings2, ChevronUp, ChevronDown } from 'lucide-react';
import { useGlobal } from '../../contexts/GlobalContext';

export const PendulumSim: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { t } = useGlobal();
  const [length, setLength] = useState(200); 
  const [gravity, setGravity] = useState(9.8);
  const [damping, setDamping] = useState(0.005);
  const [isRunning, setIsRunning] = useState(true);
  const [slowMo, setSlowMo] = useState(false);
  const [showControls, setShowControls] = useState(true);
  
  // ... physics state ...
  const state = useRef({ angle: Math.PI / 4, velocity: 0, accel: 0 });
  const dragRef = useRef({ active: false, mx: 0, my: 0 });
  const requestRef = useRef<number | null>(null);

  const reset = () => {
      state.current = { angle: Math.PI / 4, velocity: 0, accel: 0 };
      draw();
  };

  const updatePhysics = (dt: number) => {
      const L_meters = length / 100;
      const g = gravity;
      const theta = state.current.angle;
      const angularAccel = -(g / L_meters) * Math.sin(theta) - (damping * state.current.velocity);
      state.current.accel = angularAccel;
      state.current.velocity += angularAccel * dt;
      state.current.angle += state.current.velocity * dt;
  };

  const draw = () => {
    // ... drawing logic ...
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const w = canvas.width;
    const h = canvas.height;
    const originX = w / 2;
    const originY = 50;
    const availableHeight = h - originY - 100;
    const currentLengthMeters = length / 100;
    const dynamicScale = Math.min(350, availableHeight / currentLengthMeters);
    const pixelLen = currentLengthMeters * dynamicScale;

    const grad = ctx.createRadialGradient(w/2, h/2, 50, w/2, h/2, 500);
    grad.addColorStop(0, '#1e293b');
    grad.addColorStop(1, '#0f172a');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    ctx.shadowColor = 'black'; ctx.shadowBlur = 10;
    ctx.fillStyle = '#334155'; ctx.fillRect(originX - 60, originY - 10, 120, 10); ctx.shadowBlur = 0;

    const bobX = originX + pixelLen * Math.sin(state.current.angle);
    const bobY = originY + pixelLen * Math.cos(state.current.angle);

    ctx.beginPath(); ctx.strokeStyle = 'rgba(255,255,255,0.8)'; ctx.lineWidth = 2;
    ctx.moveTo(originX, originY); ctx.lineTo(bobX, bobY); ctx.stroke();

    ctx.beginPath(); ctx.strokeStyle = 'rgba(255,255,255,0.1)'; ctx.setLineDash([5, 5]);
    ctx.arc(originX, originY, pixelLen, Math.PI/2 - 1, Math.PI/2 + 1); ctx.stroke(); ctx.setLineDash([]);
    ctx.beginPath(); ctx.moveTo(originX, originY); ctx.lineTo(originX, originY + pixelLen + 30); ctx.stroke();

    const bobR = 25;
    const bobGrad = ctx.createRadialGradient(bobX - 8, bobY - 8, 2, bobX, bobY, bobR);
    bobGrad.addColorStop(0, '#fff');
    bobGrad.addColorStop(0.3, dragRef.current.active ? '#fbbf24' : '#ef4444');
    bobGrad.addColorStop(1, dragRef.current.active ? '#b45309' : '#7f1d1d');
    ctx.fillStyle = bobGrad; ctx.shadowColor = 'rgba(0,0,0,0.5)'; ctx.shadowBlur = 15;
    ctx.beginPath(); ctx.arc(bobX, bobY, bobR, 0, Math.PI * 2); ctx.fill(); ctx.shadowBlur = 0;
  };

  const getDynamicScale = () => {
      const cvs = canvasRef.current;
      if (!cvs) return 300;
      const originY = 50;
      const availableHeight = cvs.height - originY - 100;
      return Math.min(350, availableHeight / (length/100));
  };

  const handleMouseDown = (e: React.MouseEvent) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const x = (e.clientX - rect.left) * (canvas.width / rect.width);
      const y = (e.clientY - rect.top) * (canvas.height / rect.height);
      const scale = getDynamicScale();
      const pixelLen = (length/100) * scale;
      const originX = canvas.width/2;
      const originY = 50;
      const bobX = originX + pixelLen * Math.sin(state.current.angle);
      const bobY = originY + pixelLen * Math.cos(state.current.angle);
      if (Math.hypot(x - bobX, y - bobY) < 40) { dragRef.current.active = true; setIsRunning(false); }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
      if (!dragRef.current.active) return;
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const x = (e.clientX - rect.left) * (canvas.width / rect.width);
      const y = (e.clientY - rect.top) * (canvas.height / rect.height);
      const originX = canvas.width / 2;
      const originY = 50;
      state.current.angle = Math.atan2(x - originX, y - originY);
      state.current.velocity = 0;
      draw();
  };

  const handleMouseUp = () => {
      if (dragRef.current.active) { dragRef.current.active = false; setIsRunning(true); }
  };

  const animate = () => {
      if (isRunning && !dragRef.current.active) {
          const dt = slowMo ? 0.016 / 5 : 0.016; 
          for(let i=0; i<4; i++) updatePhysics(dt / 4);
      }
      draw();
      requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => { if (requestRef.current) cancelAnimationFrame(requestRef.current); };
  }, [length, gravity, damping, isRunning, slowMo, t]);

  const T = 2 * Math.PI * Math.sqrt((length/100) / gravity);
  const freq = 1/T;

  return (
     <div className="relative w-full h-full rounded-2xl overflow-hidden bg-slate-950 shadow-2xl border border-slate-800">
         <canvas 
            ref={canvasRef} 
            width={1000} 
            height={600} 
            className={`absolute inset-0 w-full h-full object-contain ${dragRef.current.active ? 'cursor-grabbing' : 'cursor-grab'}`}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
         />
         {!dragRef.current.active && !isRunning && (
             <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none text-white/50 animate-pulse flex flex-col items-center">
                 <Grab size={48} />
                 <span className="text-xl font-bold">{t('drag_to_start')}</span>
             </div>
         )}

         {/* HUD */}
         <div className="absolute top-4 right-4 pointer-events-none">
             <div className="bg-slate-900/80 backdrop-blur border border-slate-700 rounded-xl p-4 text-right w-48">
                 <h4 className="text-[10px] text-slate-500 font-bold uppercase mb-2">{t('oscillation_data')}</h4>
                 <div className="flex justify-between text-sm font-mono mb-1">
                     <span className="text-slate-400">{t('period')}</span>
                     <span className="text-emerald-400">{T.toFixed(2)}s</span>
                 </div>
                 <div className="flex justify-between text-sm font-mono mb-1">
                     <span className="text-slate-400">{t('frequency')}</span>
                     <span className="text-blue-400">{freq.toFixed(2)}Hz</span>
                 </div>
                 <div className="flex justify-between text-sm font-mono">
                     <span className="text-slate-400">{t('angle')}</span>
                     <span className="text-white">{(state.current.angle * 180 / Math.PI).toFixed(1)}°</span>
                 </div>
             </div>
         </div>

         {/* CONTROL PANEL */}
         <div className={`absolute top-4 left-4 transition-all duration-300 z-10 ${showControls ? 'w-80' : 'w-12'}`}>
            <div className="bg-slate-900/90 backdrop-blur-md border border-slate-700/50 rounded-2xl shadow-2xl overflow-hidden">
                <button 
                    onClick={() => setShowControls(!showControls)}
                    className="w-full p-3 flex items-center justify-between text-slate-300 hover:bg-slate-800 transition-colors border-b border-slate-700/50"
                >
                    {showControls ? (
                        <span className="text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                            <Settings2 size={14} className="text-blue-400"/> {t('control_center')}
                        </span>
                    ) : (
                        <Settings2 size={20} className="mx-auto text-blue-400"/>
                    )}
                    {showControls && (showControls ? <ChevronUp size={14}/> : <ChevronDown size={14}/>)}
                </button>

                {showControls && (
                    <div className="p-5 space-y-6">
                        <div className="space-y-4">
                            <div className="space-y-1">
                                <div className="flex justify-between text-xs">
                                    <span className="text-slate-300 font-medium uppercase">{t('length')}</span>
                                    <span className="text-blue-400 font-mono">{(length/100).toFixed(2)} m</span>
                                </div>
                                <input type="range" min="10" max="150" value={length} onChange={e => setLength(Number(e.target.value))} className="w-full h-1.5 bg-slate-700 rounded-lg accent-blue-500 cursor-pointer" />
                            </div>

                            <div className="space-y-1">
                                <div className="flex justify-between text-xs">
                                    <span className="text-slate-300 font-medium uppercase">{t('gravity')}</span>
                                    <span className="text-green-400 font-mono">{gravity} m/s²</span>
                                </div>
                                <input type="range" min="1.6" max="25" step="0.1" value={gravity} onChange={e => setGravity(Number(e.target.value))} className="w-full h-1.5 bg-slate-700 rounded-lg accent-green-500 cursor-pointer" />
                            </div>
                        </div>

                        <div className="w-full h-px bg-slate-700/50"></div>

                        <button 
                            onClick={() => setSlowMo(!slowMo)}
                            className={`w-full py-2 rounded-lg border flex items-center justify-center gap-2 text-xs font-bold transition-all ${slowMo ? 'bg-amber-500/20 text-amber-400 border-amber-500/50' : 'bg-slate-800 text-slate-300 border-slate-600 hover:bg-slate-700'}`}
                        >
                            <Timer size={14} /> {slowMo ? t('slow_motion') : t('real_time')}
                        </button>

                        <div className="grid grid-cols-4 gap-2">
                            <button 
                                onClick={() => setIsRunning(!isRunning)} 
                                className={`col-span-3 py-3 rounded-xl font-bold text-white shadow-lg flex items-center justify-center gap-2 transition-all active:scale-95 ${isRunning ? 'bg-amber-600 hover:bg-amber-500' : 'bg-emerald-600 hover:bg-emerald-500'}`}
                            >
                                {isRunning ? <Pause size={18}/> : <Play size={18}/>}
                                {isRunning ? t('pause').toUpperCase() : t('simulate').toUpperCase()}
                            </button>
                            <button onClick={reset} className="col-span-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl flex items-center justify-center transition-colors border border-slate-700">
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
