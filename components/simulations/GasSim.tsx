
import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Thermometer, Wind, Settings2, ChevronUp, ChevronDown } from 'lucide-react';
import { useGlobal } from '../../contexts/GlobalContext';

interface Particle {
  x: number; y: number; vx: number; vy: number; radius: number; color: string;
}

export const GasSim: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { t } = useGlobal();
  const [temperature, setTemperature] = useState(300);
  const [particleCount, setParticleCount] = useState(80);
  const [volume, setVolume] = useState(60);
  const [pressure, setPressure] = useState(0);
  const [showControls, setShowControls] = useState(true);
  
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number | null>(null);

  const initParticles = () => {
    const particles: Particle[] = [];
    const speedBase = Math.sqrt(temperature) * 0.15;
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * 400, y: Math.random() * 400,
        vx: (Math.random() - 0.5) * speedBase, vy: (Math.random() - 0.5) * speedBase,
        radius: 3 + Math.random() * 2,
        color: i % 3 === 0 ? '#60a5fa' : (i % 3 === 1 ? '#a78bfa' : '#34d399'),
      });
    }
    particlesRef.current = particles;
  };

  useEffect(() => { initParticles(); }, [particleCount]);

  useEffect(() => {
     const speedBase = Math.sqrt(temperature) * 0.15;
     particlesRef.current.forEach(p => {
         const currentSpeed = Math.sqrt(p.vx*p.vx + p.vy*p.vy);
         if (currentSpeed === 0) {
            p.vx = (Math.random() - 0.5) * speedBase; p.vy = (Math.random() - 0.5) * speedBase;
         } else {
             p.vx = (p.vx / currentSpeed) * speedBase; p.vy = (p.vy / currentSpeed) * speedBase;
         }
     });
  }, [temperature]);

  const update = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const width = canvas.width; const height = canvas.height;
    const containerWidth = width * (volume / 100);

    ctx.fillStyle = 'rgba(15, 23, 42, 0.3)'; ctx.fillRect(0, 0, width, height);
    ctx.strokeStyle = '#64748b'; ctx.lineWidth = 4; ctx.strokeRect(0, 0, containerWidth, height);
    
    // Piston
    const pistonX = containerWidth;
    ctx.fillStyle = '#1e293b'; ctx.fillRect(pistonX, 0, width - pistonX, height);
    const grad = ctx.createLinearGradient(pistonX, 0, pistonX + 20, 0);
    grad.addColorStop(0, '#475569'); grad.addColorStop(1, '#1e293b');
    ctx.fillStyle = grad; ctx.fillRect(pistonX, 0, 20, height);
    ctx.fillStyle = '#334155'; ctx.fillRect(pistonX + 20, height/2 - 10, width, 20);

    let wallCollisions = 0;
    ctx.globalCompositeOperation = 'screen';
    particlesRef.current.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.x - p.radius < 0) { p.x = p.radius; p.vx *= -1; wallCollisions++; }
      if (p.x + p.radius > containerWidth) { p.x = containerWidth - p.radius; p.vx *= -1; wallCollisions++; }
      if (p.y - p.radius < 0) { p.y = p.radius; p.vy *= -1; wallCollisions++; }
      if (p.y + p.radius > height) { p.y = height - p.radius; p.vy *= -1; wallCollisions++; }
      ctx.shadowBlur = 10; ctx.shadowColor = p.color; ctx.fillStyle = p.color;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2); ctx.fill();
    });
    ctx.shadowBlur = 0; ctx.globalCompositeOperation = 'source-over';
    setPressure(prev => (prev * 0.95) + (wallCollisions * (100/volume) * 0.2));
    animationRef.current = requestAnimationFrame(update);
  };

  useEffect(() => {
    animationRef.current = requestAnimationFrame(update);
    return () => { if (animationRef.current) cancelAnimationFrame(animationRef.current); };
  });

  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden bg-slate-950 shadow-2xl border border-slate-800">
         <canvas ref={canvasRef} width={1000} height={600} className="absolute inset-0 w-full h-full object-cover" />
         
         {/* HUD (Top Right) */}
         <div className="absolute top-4 right-4 pointer-events-none flex gap-4">
             <div className="bg-slate-900/80 backdrop-blur p-4 rounded-2xl border border-blue-500/30 text-center w-28">
                 <div className="text-[10px] uppercase text-blue-400 font-bold mb-1">{t('pressure')}</div>
                 <div className="text-2xl font-mono text-white font-bold">{pressure.toFixed(0)} <span className="text-xs text-slate-500 font-sans">kPa</span></div>
             </div>
             <div className="bg-slate-900/80 backdrop-blur p-4 rounded-2xl border border-red-500/30 text-center w-28">
                 <div className="text-[10px] uppercase text-red-400 font-bold mb-1">{t('temp')}</div>
                 <div className="text-2xl font-mono text-white font-bold">{temperature} <span className="text-xs text-slate-500 font-sans">K</span></div>
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
                            <Settings2 size={14} className="text-blue-400"/> {t('gas_properties')}
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
                                    <span className="text-slate-300 font-medium uppercase flex items-center gap-2"><Thermometer size={14}/> {t('temp')}</span>
                                    <span className="text-red-400 font-mono">{temperature} K</span>
                                </div>
                                <input type="range" min="50" max="1000" value={temperature} onChange={e => setTemperature(Number(e.target.value))} className="w-full h-1.5 bg-slate-700 rounded-lg accent-red-500 cursor-pointer" />
                            </div>

                            <div className="space-y-1">
                                <div className="flex justify-between text-xs">
                                    <span className="text-slate-300 font-medium uppercase flex items-center gap-2"><Wind size={14}/> {t('volume')}</span>
                                    <span className="text-green-400 font-mono">{volume}%</span>
                                </div>
                                <input type="range" min="20" max="100" value={volume} onChange={e => setVolume(Number(e.target.value))} className="w-full h-1.5 bg-slate-700 rounded-lg accent-green-500 cursor-pointer" />
                            </div>

                            <div className="space-y-1">
                                <div className="flex justify-between text-xs">
                                    <span className="text-slate-300 font-medium uppercase">{t('particles')}</span>
                                    <span className="text-blue-400 font-mono">{particleCount}</span>
                                </div>
                                <input type="range" min="10" max="200" value={particleCount} onChange={e => setParticleCount(Number(e.target.value))} className="w-full h-1.5 bg-slate-700 rounded-lg accent-blue-500 cursor-pointer" />
                            </div>
                        </div>
                    </div>
                )}
            </div>
         </div>
    </div>
  );
};
