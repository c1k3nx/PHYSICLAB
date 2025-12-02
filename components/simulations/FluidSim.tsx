
import React, { useState, useEffect, useRef } from 'react';
import { ArrowDown, Scale, RefreshCw, Check } from 'lucide-react';
import { useGlobal } from '../../contexts/GlobalContext';

export const FluidSim: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme, t } = useGlobal();
  const isDark = theme === 'dark';

  // --- State ---
  const [immersion, setImmersion] = useState(0); 
  const [material, setMaterial] = useState<'brick' | 'gold' | 'wood'>('gold');
  const [fluidType, setFluidType] = useState<'water' | 'oil'>('water');
  
  // Physics constants
  const G = 9.8;
  const BLOCK_VOL = 0.0005; // m3
  const BLOCK_W = 60; // px
  
  const MATS = {
      brick: { d: 2000, color: '#b91c1c', label: 'Brick' },
      gold: { d: 19300, color: '#facc15', label: 'Gold' },
      wood: { d: 600, color: '#a0522d', label: 'Wood' }
  };
  const FLUIDS = {
      water: { d: 1000, color: 'rgba(56, 189, 248, 0.4)', stroke: 'rgba(56, 189, 248, 0.8)' },
      oil: { d: 900, color: 'rgba(234, 179, 8, 0.4)', stroke: 'rgba(234, 179, 8, 0.8)' }
  };

  const mat = MATS[material];
  const flu = FLUIDS[fluidType];
  const weight = mat.d * BLOCK_VOL * G;
  const maxBuoyancy = flu.d * BLOCK_VOL * G;
  
  // Animation loop for bubbles/water
  const timeRef = useRef(0);
  const requestRef = useRef<number|null>(null);

  // Live Values for Display
  const [displayVals, setDisplayVals] = useState({
      vSub: 0,
      fb: 0,
      tension: 0
  });

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const w = canvas.width;
    const h = canvas.height;
    
    // Physics Calc
    // Immersion 0-100%
    const levelY = 280; // Water Surface Y
    const blockH = BLOCK_W;
    
    const startY = 100; // High up
    const fullySubmergedY = levelY + 20; // Top of block is under water
    
    const blockY = startY + (immersion/100) * (fullySubmergedY - startY + 50);
    const blockBottom = blockY + blockH;
    
    let subH = 0;
    if (blockBottom > levelY) {
        subH = Math.min(blockH, blockBottom - levelY);
    }
    const vSubPct = subH / blockH;
    
    // Floating Logic override
    let actualBlockY = blockY;
    let actualVSubPct = vSubPct;
    let tension = weight - (maxBuoyancy * actualVSubPct);
    
    if (mat.d < flu.d && tension < 0) {
        // Floating Physics
        tension = 0;
        const eqPct = mat.d / flu.d;
        const eqSubH = eqPct * blockH;
        const floatY = levelY - blockH + eqSubH;
        
        if (blockY > floatY) {
             actualBlockY = floatY; // Float
             actualVSubPct = eqPct;
        }
    }
    const buoyancy = maxBuoyancy * actualVSubPct;

    // Update Display State
    if (Math.abs(displayVals.fb - buoyancy) > 0.01 || Math.abs(displayVals.tension - tension) > 0.01) {
        setDisplayVals({
            vSub: actualVSubPct * 100,
            fb: buoyancy,
            tension: tension
        });
    }

    ctx.clearRect(0,0,w,h);
    
    // --- Render Lab Environment ---
    
    // Stand
    const cx = w/2 - 100;
    ctx.fillStyle = '#475569'; ctx.fillRect(cx - 120, 50, 10, 400); // Pole
    ctx.fillRect(cx - 150, 440, 160, 20); // Base
    ctx.fillStyle = '#64748b'; ctx.fillRect(cx - 120, actualBlockY - 110, 120, 10); // Arm

    // --- Dynamic Spring Scale ---
    const scaleY = actualBlockY - 100;
    ctx.fillStyle = '#f8fafc'; ctx.fillRect(cx - 15, scaleY, 30, 80); // Body
    ctx.strokeStyle = '#94a3b8'; ctx.lineWidth=1; ctx.strokeRect(cx - 15, scaleY, 30, 80);
    
    // Hook
    ctx.beginPath(); ctx.moveTo(cx, scaleY+80); ctx.lineTo(cx, scaleY+90); ctx.stroke();
    
    // Reading Indicator (Red Line moves)
    const stretch = Math.min(60, (tension / 100) * 60); 
    ctx.fillStyle = '#ef4444'; ctx.fillRect(cx - 10, scaleY + 10 + stretch, 20, 2);
    
    // Digital Readout
    ctx.fillStyle = '#0f172a'; ctx.fillRect(cx - 30, scaleY - 30, 60, 25);
    ctx.fillStyle = tension > 0 ? '#ef4444' : '#10b981'; 
    ctx.font = 'bold 14px monospace'; ctx.textAlign='center';
    ctx.fillText(`${tension.toFixed(1)}N`, cx, scaleY - 12);

    // --- Glass Tank (Back) ---
    const tankX = cx - 80;
    const tankW = 160;
    const tankH = 180;
    const tankY = 250;
    
    ctx.fillStyle = 'rgba(255,255,255,0.05)';
    ctx.strokeStyle = 'rgba(255,255,255,0.2)';
    ctx.lineWidth = 2;
    ctx.fillRect(tankX, tankY, tankW, tankH);
    ctx.strokeRect(tankX, tankY, tankW, tankH);

    // --- Liquid ---
    const time = timeRef.current;
    
    const spoutY = tankY + 30;
    ctx.beginPath(); ctx.moveTo(tankX+tankW, spoutY); ctx.lineTo(tankX+tankW+20, spoutY+10); ctx.stroke();

    // Water Body
    ctx.fillStyle = flu.color;
    ctx.beginPath();
    ctx.moveTo(tankX, levelY);
    // Surface waves
    for(let x=0; x<=tankW; x+=5) {
        const y = levelY + Math.sin(x*0.1 + time)*2;
        ctx.lineTo(tankX+x, y);
    }
    ctx.lineTo(tankX+tankW, tankY+tankH);
    ctx.lineTo(tankX, tankY+tankH);
    ctx.fill();
    
    // Top Surface Reflection line
    ctx.strokeStyle = flu.stroke; ctx.lineWidth=2;
    ctx.beginPath();
    for(let x=0; x<=tankW; x+=5) {
        const y = levelY + Math.sin(x*0.1 + time)*2;
        if(x===0) ctx.moveTo(tankX+x, y); else ctx.lineTo(tankX+x, y);
    }
    ctx.stroke();

    // Pouring Animation if submerged
    if (actualVSubPct > 0.05 && immersion > 5) {
        ctx.strokeStyle = flu.color;
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(tankX+tankW+20, spoutY+10);
        ctx.quadraticCurveTo(tankX+tankW+40, spoutY+20, tankX+tankW+40, 450);
        ctx.stroke();
    }
    
    // Bubbles
    if (actualVSubPct > 0) {
        ctx.fillStyle = 'rgba(255,255,255,0.3)';
        for(let i=0; i<5; i++) {
            const bx = tankX + 20 + Math.random()*120;
            const by = levelY + 20 + Math.random()*100;
            const size = Math.random()*3;
            const float = (time * 20 + i*50) % 150;
            if (by - float > levelY) {
                 ctx.beginPath(); ctx.arc(bx, by - float, size, 0, Math.PI*2); ctx.fill();
            }
        }
    }

    // --- Block ---
    const bx = cx - BLOCK_W/2;
    const by = actualBlockY;
    
    // String
    ctx.strokeStyle = '#cbd5e1'; ctx.lineWidth=2;
    ctx.beginPath(); ctx.moveTo(cx, scaleY+90); ctx.lineTo(cx, by); ctx.stroke();
    
    // Block Body
    ctx.fillStyle = mat.color;
    ctx.fillRect(bx, by, BLOCK_W, BLOCK_W);
    
    if (material === 'brick') {
        ctx.fillStyle = 'rgba(0,0,0,0.2)';
        ctx.fillRect(bx, by+10, BLOCK_W, 2);
        ctx.fillRect(bx, by+30, BLOCK_W, 2);
    } else if (material === 'gold') {
        const grad = ctx.createLinearGradient(bx, by, bx+BLOCK_W, by+BLOCK_W);
        grad.addColorStop(0, 'rgba(255,255,255,0)');
        grad.addColorStop(0.5, 'rgba(255,255,255,0.6)');
        grad.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.fillStyle = grad;
        ctx.fillRect(bx, by, BLOCK_W, BLOCK_W);
    }
    
    ctx.strokeStyle = 'rgba(0,0,0,0.5)'; ctx.lineWidth=1;
    ctx.strokeRect(bx, by, BLOCK_W, BLOCK_W);

    // --- Glass Tank (Front Glare) ---
    const glare = ctx.createLinearGradient(tankX, tankY, tankX+40, tankY+tankH);
    glare.addColorStop(0, 'rgba(255,255,255,0.1)');
    glare.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = glare;
    ctx.fillRect(tankX, tankY, 40, tankH);
    
    // --- Catch Beaker ---
    const bX = tankX + tankW + 20;
    const bY = 440;
    const bW = 50;
    const bH = 80;
    ctx.fillStyle = 'rgba(255,255,255,0.05)'; ctx.strokeStyle = 'rgba(255,255,255,0.3)';
    ctx.fillRect(bX, bY - bH, bW, bH); ctx.strokeRect(bX, bY - bH, bW, bH);
    
    // Displaced Water inside beaker
    const dispH = (buoyancy / (flu.d*BLOCK_VOL*G)) * (bH - 10);
    if (dispH > 0) {
        ctx.fillStyle = flu.color;
        ctx.fillRect(bX, bY - dispH, bW, dispH);
    }
    ctx.fillStyle = '#fff'; ctx.font='10px monospace';
    ctx.fillText("Displaced", bX, bY + 12);
  };
  
  const animate = () => {
      timeRef.current += 0.05;
      draw();
      requestRef.current = requestAnimationFrame(animate);
  };
  
  useEffect(() => {
      requestRef.current = requestAnimationFrame(animate);
      return () => { if(requestRef.current) cancelAnimationFrame(requestRef.current); };
  }, [immersion, material, fluidType]);

  return (
    <div className="flex flex-col h-full gap-4">
      <div className="flex flex-col md:flex-row gap-4 h-full min-h-0">
         {/* Canvas Area */}
         <div className={`relative flex-grow rounded-xl overflow-hidden border shadow-xl flex flex-col transition-colors duration-300 ${
             isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200 shadow-slate-200'
         }`}>
            <canvas 
                ref={canvasRef} 
                width={800} 
                height={500} 
                className="w-full h-full object-contain"
            />
            {/* Overlay Data Board */}
            <div className="absolute top-4 right-4 w-64 bg-slate-800/90 backdrop-blur border border-slate-600 rounded-xl p-4 shadow-2xl text-xs">
                <h3 className="text-blue-400 font-bold uppercase mb-3 flex items-center gap-2"><Scale size={14}/> {t('arch_physics_data')}</h3>
                <div className="space-y-2 font-mono">
                    <div className="flex justify-between border-b border-slate-700 pb-1">
                        <span className="text-slate-400">{t('arch_weight')}:</span>
                        <span className="text-white">{weight.toFixed(2)} N</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-700 pb-1">
                        <span className="text-slate-400">{t('arch_obj_density')}:</span>
                        <span className="text-white">{mat.d} kg/m³</span>
                    </div>
                     <div className="flex justify-between border-b border-slate-700 pb-1">
                        <span className="text-slate-400">{t('arch_fluid_density')}:</span>
                        <span className="text-white">{flu.d} kg/m³</span>
                    </div>
                    <div className="flex justify-between pt-2">
                        <span className="text-yellow-400 font-bold">{t('arch_buoyancy')}:</span>
                        <span className="text-yellow-400 font-bold">{displayVals.fb.toFixed(2)} N</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-green-400 font-bold">{t('arch_scale')}:</span>
                        <span className="text-green-400 font-bold">{displayVals.tension.toFixed(2)} N</span>
                    </div>
                </div>
                {Math.abs(displayVals.fb - weight) < 0.1 && mat.d < flu.d && (
                     <div className="mt-3 bg-blue-500/20 text-blue-300 p-2 rounded text-center border border-blue-500/30 flex items-center justify-center gap-2">
                         <Check size={14}/> Floating Equilibrium
                     </div>
                )}
            </div>
         </div>

         <div className={`w-full md:w-80 rounded-xl border p-6 flex flex-col gap-6 overflow-y-auto custom-scrollbar shadow-lg ${
             isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
         }`}>
             <div className={`p-4 rounded-xl border ${isDark ? 'bg-slate-700/50 border-slate-600' : 'bg-slate-50 border-slate-200'}`}>
                 <label className={`flex items-center gap-2 text-sm font-bold uppercase mb-4 ${isDark ? 'text-white' : 'text-slate-800'}`}>
                     <ArrowDown size={16} /> {t('arch_lower')}
                 </label>
                 <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    value={immersion}
                    onChange={(e) => setImmersion(Number(e.target.value))}
                    className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                 />
             </div>

             <div className="space-y-3">
                 <label className={`text-xs font-bold uppercase ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{t('arch_material')}</label>
                 <div className="grid grid-cols-3 gap-2">
                     {(Object.keys(MATS) as Array<keyof typeof MATS>).map(m => (
                         <button 
                            key={m}
                            onClick={() => { setMaterial(m); setImmersion(0); }}
                            className={`px-3 py-2 rounded-lg text-xs font-bold capitalize transition-all border shadow-sm ${
                                material === m 
                                ? 'bg-blue-600 border-blue-500 text-white' 
                                : 'bg-slate-700 border-slate-600 text-slate-300'
                            }`}
                         >
                             {MATS[m].label}
                         </button>
                     ))}
                 </div>
             </div>
             
             <div className="space-y-3">
                 <label className={`text-xs font-bold uppercase ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{t('arch_liquid')}</label>
                 <div className="grid grid-cols-2 gap-2">
                     {(Object.keys(FLUIDS) as Array<keyof typeof FLUIDS>).map(f => (
                         <button 
                            key={f}
                            onClick={() => { setFluidType(f); setImmersion(0); }}
                            className={`px-3 py-2 rounded-lg text-xs font-bold capitalize transition-all border shadow-sm ${
                                fluidType === f 
                                ? 'bg-cyan-600 border-cyan-500 text-white' 
                                : 'bg-slate-700 border-slate-600 text-slate-300'
                            }`}
                         >
                             {f}
                         </button>
                     ))}
                 </div>
             </div>

             <button 
                onClick={() => setImmersion(0)}
                className="mt-auto w-full py-3 rounded-lg font-bold text-sm flex items-center justify-center gap-2 bg-slate-700 text-white hover:bg-slate-600 transition-colors"
             >
                 <RefreshCw size={16} /> {t('arch_reset_pos')}
             </button>
         </div>
      </div>
    </div>
  );
};
