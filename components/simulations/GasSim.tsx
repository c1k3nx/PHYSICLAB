import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Thermometer, Wind } from 'lucide-react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
}

export const GasSim: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [temperature, setTemperature] = useState(300); // Kelvin
  const [particleCount, setParticleCount] = useState(80);
  const [volume, setVolume] = useState(60); // Percentage
  const [pressure, setPressure] = useState(0);
  
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number | null>(null);

  // Initialize Particles
  const initParticles = () => {
    const particles: Particle[] = [];
    const speedBase = Math.sqrt(temperature) * 0.15;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * 400,
        y: Math.random() * 400,
        vx: (Math.random() - 0.5) * speedBase,
        vy: (Math.random() - 0.5) * speedBase,
        radius: 3 + Math.random() * 2,
        color: i % 3 === 0 ? '#60a5fa' : (i % 3 === 1 ? '#a78bfa' : '#34d399'), // Blue/Purple/Green mix
      });
    }
    particlesRef.current = particles;
  };

  useEffect(() => { initParticles(); }, [particleCount]);

  useEffect(() => {
     // Dynamic speed update
     const speedBase = Math.sqrt(temperature) * 0.15;
     particlesRef.current.forEach(p => {
         const currentSpeed = Math.sqrt(p.vx*p.vx + p.vy*p.vy);
         if (currentSpeed === 0) {
            p.vx = (Math.random() - 0.5) * speedBase;
            p.vy = (Math.random() - 0.5) * speedBase;
         } else {
             p.vx = (p.vx / currentSpeed) * speedBase;
             p.vy = (p.vy / currentSpeed) * speedBase;
         }
     });
  }, [temperature]);

  const update = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    
    const containerWidth = width * (volume / 100);

    // Clear with blur for motion trails
    ctx.fillStyle = 'rgba(15, 23, 42, 0.3)'; // Semi-transparent clear creates trails
    ctx.fillRect(0, 0, width, height);

    // Draw Container
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 4;
    ctx.strokeRect(0, 0, containerWidth, height);
    
    // Piston Head
    const pistonX = containerWidth;
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(pistonX, 0, width - pistonX, height);
    
    // Piston Face
    const grad = ctx.createLinearGradient(pistonX, 0, pistonX + 20, 0);
    grad.addColorStop(0, '#475569');
    grad.addColorStop(1, '#1e293b');
    ctx.fillStyle = grad;
    ctx.fillRect(pistonX, 0, 20, height);
    
    // Piston Handle
    ctx.fillStyle = '#334155';
    ctx.fillRect(pistonX + 20, height/2 - 10, width, 20);

    let wallCollisions = 0;

    ctx.globalCompositeOperation = 'screen'; // Additive blending for glow

    particlesRef.current.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;

      // Bounce
      if (p.x - p.radius < 0) { p.x = p.radius; p.vx *= -1; wallCollisions++; }
      if (p.x + p.radius > containerWidth) { p.x = containerWidth - p.radius; p.vx *= -1; wallCollisions++; }
      if (p.y - p.radius < 0) { p.y = p.radius; p.vy *= -1; wallCollisions++; }
      if (p.y + p.radius > height) { p.y = height - p.radius; p.vy *= -1; wallCollisions++; }

      // Draw Glowing Particle
      ctx.shadowBlur = 10;
      ctx.shadowColor = p.color;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.shadowBlur = 0;
    ctx.globalCompositeOperation = 'source-over';

    // Physics
    setPressure(prev => (prev * 0.95) + (wallCollisions * (100/volume) * 0.2));

    animationRef.current = requestAnimationFrame(update);
  };

  useEffect(() => {
    animationRef.current = requestAnimationFrame(update);
    return () => { if (animationRef.current) cancelAnimationFrame(animationRef.current); };
  });

  return (
    <div className="flex flex-col h-full gap-4">
      <div className="flex gap-4 h-full">
        {/* Canvas Area */}
        <div className="flex-grow relative bg-slate-900 rounded-xl overflow-hidden border border-slate-700 shadow-2xl">
             <canvas 
              ref={canvasRef} 
              width={800} 
              height={500} 
              className="w-full h-full object-cover"
            />
            
            {/* HUD */}
            <div className="absolute top-4 left-4 grid grid-cols-3 gap-4">
                <div className="bg-slate-900/80 backdrop-blur p-3 rounded-xl border border-blue-500/30 w-28 text-center">
                    <div className="text-[10px] uppercase text-blue-400 font-bold mb-1">Pressure</div>
                    <div className="text-xl font-mono text-white">{pressure.toFixed(0)} <span className="text-xs text-slate-500">kPa</span></div>
                </div>
                <div className="bg-slate-900/80 backdrop-blur p-3 rounded-xl border border-red-500/30 w-28 text-center">
                    <div className="text-[10px] uppercase text-red-400 font-bold mb-1">Temp</div>
                    <div className="text-xl font-mono text-white">{temperature} <span className="text-xs text-slate-500">K</span></div>
                </div>
                <div className="bg-slate-900/80 backdrop-blur p-3 rounded-xl border border-green-500/30 w-28 text-center">
                    <div className="text-[10px] uppercase text-green-400 font-bold mb-1">Volume</div>
                    <div className="text-xl font-mono text-white">{volume} <span className="text-xs text-slate-500">%</span></div>
                </div>
            </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-slate-900/90 backdrop-blur p-6 rounded-xl border border-slate-700 shadow-xl grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-3">
            <div className="flex justify-between text-xs font-bold uppercase text-slate-400">
                <span className="flex items-center gap-2"><Thermometer size={14}/> Temperature (Heat)</span>
            </div>
            <input 
              type="range" min="50" max="1000" value={temperature} 
              onChange={(e) => setTemperature(Number(e.target.value))}
              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-red-500"
            />
          </div>

          <div className="space-y-3">
            <div className="flex justify-between text-xs font-bold uppercase text-slate-400">
                <span className="flex items-center gap-2"><Wind size={14}/> Volume (Piston)</span>
            </div>
            <input 
              type="range" min="20" max="100" value={volume} 
              onChange={(e) => setVolume(Number(e.target.value))}
              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-green-500"
            />
          </div>

           <div className="space-y-3">
             <div className="flex justify-between text-xs font-bold uppercase text-slate-400">
                <span>Particle Count</span>
                <span className="text-white">{particleCount}</span>
            </div>
            <input 
              type="range" min="10" max="200" value={particleCount} 
              onChange={(e) => setParticleCount(Number(e.target.value))}
              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
          </div>
      </div>
    </div>
  );
};