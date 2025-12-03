
import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Rocket, Anchor, Settings2, ChevronUp, ChevronDown } from 'lucide-react';
import { useGlobal } from '../../contexts/GlobalContext';

export const NewtonSim: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { t } = useGlobal();
  const [mass, setMass] = useState(100);
  const [thrust, setThrust] = useState(0);
  const [frictionCoef, setFrictionCoef] = useState(0.5); 
  const [isRunning, setIsRunning] = useState(false);
  const [showControls, setShowControls] = useState(true);
  
  // Physics State
  const pRef = useRef({ x: 0, v: 0, a: 0, offset: 0 });
  const requestRef = useRef<number | null>(null);
  const particlesRef = useRef<{x:number, y:number, vx:number, vy:number, life:number, color:string, size: number}[]>([]);
  const starsRef = useRef<{x:number, y:number, z:number}[]>([]);

  useEffect(() => {
      starsRef.current = Array.from({length: 150}, () => ({
          x: Math.random() * 1000,
          y: Math.random() * 500,
          z: Math.random() * 3 + 0.5 
      }));
  }, []);

  const reset = () => {
    setIsRunning(false);
    pRef.current = { x: 0, v: 0, a: 0, offset: 0 };
    particlesRef.current = [];
    setThrust(0);
    draw();
  };

  const updatePhysics = (dt: number) => {
      const g = 9.8;
      const Fn = mass * g; 
      const mu_s = frictionCoef; 
      const mu_k = frictionCoef * 0.7; 
      const F_static_max = mu_s * Fn;
      const F_kinetic = mu_k * Fn;
      
      let netForce = 0;
      if (Math.abs(pRef.current.v) < 0.1) {
          if (thrust <= F_static_max) { netForce = 0; pRef.current.v = 0; pRef.current.a = 0; } 
          else { netForce = thrust - F_kinetic; }
      } else {
          const dir = Math.sign(pRef.current.v);
          const frictionForce = dir * F_kinetic;
          netForce = thrust - frictionForce;
          const potentialV = pRef.current.v + (netForce/mass) * dt;
          if (Math.sign(potentialV) !== Math.sign(pRef.current.v) && thrust === 0) {
               pRef.current.v = 0; netForce = 0;
          }
      }
      pRef.current.a = netForce / mass;
      if (Math.abs(pRef.current.v) > 0 || Math.abs(pRef.current.a) > 0) {
          pRef.current.v += pRef.current.a * dt;
          pRef.current.x += pRef.current.v * dt;
          pRef.current.offset += pRef.current.v * dt * 5;
      }
  };

  const updateVisuals = () => {
      if (thrust > 0 && isRunning) {
          const rate = Math.ceil(thrust / 100);
          for(let i=0; i<rate; i++) {
              particlesRef.current.push({
                  x: 180, y: 280 + (Math.random()-0.5)*10, 
                  vx: -Math.random() * 20 - (pRef.current.v * 0.1) - 10,
                  vy: (Math.random() - 0.5) * 4,
                  life: 1.0, color: Math.random() > 0.4 ? '#3b82f6' : '#8b5cf6', size: Math.random() * 5 + 2
              });
          }
      }
      particlesRef.current.forEach(p => { p.x += p.vx; p.y += p.vy; p.life -= 0.04; p.size *= 0.9; });
      particlesRef.current = particlesRef.current.filter(p => p.life > 0);
  };

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0,0,w,h);

    const shake = Math.min(5, pRef.current.v * 0.05);
    const shakeX = (Math.random()-0.5)*shake;
    const shakeY = (Math.random()-0.5)*shake;

    ctx.save();
    ctx.translate(shakeX, shakeY);

    // BG
    ctx.fillStyle = '#020617'; ctx.fillRect(0,0,w,h);
    
    // Stars
    starsRef.current.forEach(star => {
        let screenX = (star.x - pRef.current.offset * (star.z * 0.1)) % w;
        if (screenX < 0) screenX += w;
        const stretch = Math.max(2, pRef.current.v * 2 * star.z);
        ctx.fillStyle = pRef.current.v > 50 ? '#ccfbf1' : '#fff';
        ctx.globalAlpha = Math.min(1, 0.2 + pRef.current.v * 0.005);
        ctx.fillRect(screenX, star.y, stretch, star.z);
    });
    ctx.globalAlpha = 1;

    // Grid Floor
    const horizon = h * 0.65;
    ctx.strokeStyle = '#0ea5e9'; ctx.lineWidth = 1;
    const gridSpeed = pRef.current.offset % 100;
    ctx.shadowColor = '#0ea5e9'; ctx.shadowBlur = 10;
    for(let z=0; z<h; z+=20 + z*0.1) {
        const y = horizon + z; if (y>h) break;
        const perspectiveY = horizon + ((z + gridSpeed) % (h-horizon));
        ctx.globalAlpha = Math.max(0, 1 - ((perspectiveY-horizon)/(h-horizon))*1.5);
        ctx.beginPath(); ctx.moveTo(0, perspectiveY); ctx.lineTo(w, perspectiveY); ctx.stroke();
    }
    ctx.globalAlpha = 1; ctx.shadowBlur = 0;

    // Particles
    ctx.globalCompositeOperation = 'screen';
    particlesRef.current.forEach(p => {
        ctx.fillStyle = p.color; ctx.globalAlpha = p.life;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI*2); ctx.fill();
    });
    ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = 1;

    // Ship
    const cx = 250; const cy = 280;
    ctx.save(); ctx.translate(cx, cy);
    if (isRunning) ctx.translate(0, Math.sin(Date.now()/200)*3);
    ctx.fillStyle = '#1e293b'; ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(80, 5); ctx.lineTo(-60, 30); ctx.lineTo(-60, -20); ctx.lineTo(80, -35); ctx.closePath(); ctx.fill(); ctx.stroke();
    // Cargo
    const boxes = Math.min(5, Math.ceil(mass / 100));
    ctx.fillStyle = '#f59e0b';
    for(let i=0; i<boxes; i++) { const bx = -40 + i*16; ctx.fillRect(bx, -10, 14, 14); ctx.strokeRect(bx, -10, 14, 14); }
    ctx.restore(); ctx.restore();

    // --- FORCE VECTORS ---
    const drawVector = (val: number, color: string, label: string, yOff: number) => {
        if (Math.abs(val) < 1) return;
        const len = Math.min(200, val * 0.1); 
        const vx = cx; const vy = cy + yOff;
        ctx.strokeStyle = color; ctx.lineWidth = 4;
        ctx.beginPath(); ctx.moveTo(vx, vy); ctx.lineTo(vx + len, vy); ctx.stroke();
        ctx.fillStyle = color; ctx.beginPath();
        if (len > 0) { ctx.moveTo(vx+len, vy-5); ctx.lineTo(vx+len+10, vy); ctx.lineTo(vx+len, vy+5); }
        else { ctx.moveTo(vx+len, vy-5); ctx.lineTo(vx+len-10, vy); ctx.lineTo(vx+len, vy+5); }
        ctx.fill();
        ctx.fillStyle = 'white'; ctx.font = 'bold 12px sans-serif';
        ctx.fillText(`${label}: ${Math.abs(val).toFixed(0)}N`, vx + len/2 - 20, vy - 10);
    };

    if (thrust > 0) drawVector(thrust, '#3b82f6', t('thrust'), -60);
    const Fn = mass * 9.8;
    const F_kinetic = frictionCoef * 0.7 * Fn;
    const F_static_max = frictionCoef * Fn;
    let displayFriction = 0;
    if (Math.abs(pRef.current.v) < 0.1) {
        if (thrust > 0) displayFriction = -Math.min(thrust, F_static_max);
    } else {
        displayFriction = -Math.sign(pRef.current.v) * F_kinetic;
    }
    if (Math.abs(displayFriction) > 1) drawVector(displayFriction, '#ef4444', t('friction'), 60);
    
    // Status text
    if (Math.abs(pRef.current.v) < 0.1 && thrust > 0 && thrust <= F_static_max) {
        ctx.fillStyle = '#ef4444'; ctx.font = 'bold 20px sans-serif'; ctx.textAlign = 'center';
        ctx.fillText(t('locked_friction'), w/2, h - 100);
        ctx.font = '14px sans-serif'; ctx.fillText(`${t('need_force')} ${(F_static_max).toFixed(0)}N`, w/2, h - 80);
    }
  };

  const animate = () => {
      if (isRunning) { updatePhysics(0.05); updateVisuals(); }
      draw();
      requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => { if (requestRef.current) cancelAnimationFrame(requestRef.current); };
  }, [isRunning, thrust, mass, frictionCoef, t]);

  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden bg-slate-950 shadow-2xl border border-slate-800">
         <canvas ref={canvasRef} width={1000} height={600} className="absolute inset-0 w-full h-full object-cover" />
         
         {/* Speed HUD */}
         <div className="absolute top-4 right-4 pointer-events-none">
             <div className="bg-slate-900/80 backdrop-blur border border-slate-700 rounded-xl p-4 text-right">
                 <div className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">{t('velocity')}</div>
                 <div className="text-4xl font-black text-white font-mono">{pRef.current.v.toFixed(1)} <span className="text-sm font-bold text-slate-500">m/s</span></div>
                 <div className="mt-2 text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">{t('acceleration')}</div>
                 <div className="text-xl font-bold text-emerald-400 font-mono">{pRef.current.a.toFixed(2)} <span className="text-xs text-slate-500">m/s²</span></div>
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
                            <Settings2 size={14} className="text-blue-400"/> {t('dynamics_controls')}
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
                                    <span className="text-slate-300 font-medium uppercase">{t('mass')}</span>
                                    <span className="text-orange-400 font-mono">{mass} kg</span>
                                </div>
                                <input type="range" min="50" max="500" value={mass} onChange={e => {reset(); setMass(Number(e.target.value))}} className="w-full h-1.5 bg-slate-700 rounded-lg accent-orange-500 cursor-pointer" />
                            </div>

                            <div className="space-y-1">
                                <div className="flex justify-between text-xs">
                                    <span className="text-slate-300 font-medium uppercase flex items-center gap-1"><Anchor size={12}/> {t('friction')}</span>
                                    <span className="text-red-400 font-mono">μ = {frictionCoef.toFixed(2)}</span>
                                </div>
                                <input type="range" min="0" max="1.0" step="0.05" value={frictionCoef} onChange={e => setFrictionCoef(Number(e.target.value))} className="w-full h-1.5 bg-slate-700 rounded-lg accent-red-500 cursor-pointer" />
                            </div>

                            <div className="space-y-1">
                                <div className="flex justify-between text-xs">
                                    <span className="text-slate-300 font-medium uppercase flex items-center gap-1"><Rocket size={12}/> {t('thrust')}</span>
                                    <span className="text-blue-400 font-mono">{thrust} N</span>
                                </div>
                                <input type="range" min="0" max="2500" step="10" value={thrust} onChange={e => setThrust(Number(e.target.value))} className="w-full h-1.5 bg-slate-700 rounded-lg accent-blue-500 cursor-pointer" />
                            </div>
                        </div>

                        <div className="w-full h-px bg-slate-700/50"></div>

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
