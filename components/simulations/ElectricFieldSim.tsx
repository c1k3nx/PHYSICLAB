
import React, { useState, useEffect, useRef } from 'react';
import { RotateCcw, Plus, Minus, MousePointer2, ScanSearch, Settings2, ChevronUp, ChevronDown } from 'lucide-react';
import { useGlobal } from '../../contexts/GlobalContext';

interface Charge { id: number; x: number; y: number; q: number; }

export const ElectricFieldSim: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { t } = useGlobal();
  const [charges, setCharges] = useState<Charge[]>([ { id: 1, x: 250, y: 250, q: 1 }, { id: 2, x: 550, y: 250, q: -1 } ]);
  const [draggingId, setDraggingId] = useState<number | null>(null);
  const [sensorPos, setSensorPos] = useState<{x:number, y:number} | null>(null);
  const [showSensor, setShowSensor] = useState(false);
  const [showControls, setShowControls] = useState(true);

  const getPos = (e: React.MouseEvent) => {
      const canvas = canvasRef.current; if (!canvas) return {x:0, y:0};
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width; const scaleY = canvas.height / rect.height;
      return { x: (e.clientX - rect.left) * scaleX, y: (e.clientY - rect.top) * scaleY };
  };

  const handleMouseDown = (e: React.MouseEvent) => {
      const {x, y} = getPos(e);
      const hit = charges.find(c => Math.hypot(c.x - x, c.y - y) < 30);
      if (hit) setDraggingId(hit.id);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
      const {x, y} = getPos(e);
      if (showSensor) setSensorPos({x, y});
      if (draggingId !== null) setCharges(prev => prev.map(c => c.id === draggingId ? { ...c, x, y } : c));
  };

  const draw = () => {
    // ... same drawing logic ...
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext('2d'); if (!ctx) return;
    const w = canvas.width; const h = canvas.height;
    ctx.clearRect(0,0,w,h); ctx.fillStyle = '#0f172a'; ctx.fillRect(0,0,w,h);

    const GRID = 40; ctx.lineWidth = 1;
    for(let x = GRID/2; x < w; x += GRID) {
        for(let y = GRID/2; y < h; y += GRID) {
            let Ex = 0, Ey = 0;
            charges.forEach(c => {
                const dx = x - c.x; const dy = y - c.y; const r2 = dx*dx + dy*dy;
                if (r2 < 400) return; 
                const E = (c.q * 8000) / r2; const r = Math.sqrt(r2); Ex += E * (dx/r); Ey += E * (dy/r);
            });
            const Emag = Math.sqrt(Ex*Ex + Ey*Ey);
            if (Emag < 0.2) continue;
            const len = Math.min(Emag * 5, GRID * 0.8); const nx = Ex / Emag; const ny = Ey / Emag;
            const alpha = Math.min(Emag / 5, 1);
            ctx.strokeStyle = `rgba(255, 255, 255, ${alpha * 0.5})`;
            ctx.beginPath(); ctx.moveTo(x - nx*len/2, y - ny*len/2); ctx.lineTo(x + nx*len/2, y + ny*len/2); ctx.stroke();
            ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.8})`;
            ctx.beginPath(); ctx.arc(x + nx*len/2, y + ny*len/2, 2, 0, Math.PI*2); ctx.fill();
        }
    }

    charges.forEach(c => {
        const grad = ctx.createRadialGradient(c.x, c.y, 10, c.x, c.y, 50);
        const col = c.q > 0 ? '239, 68, 68' : '59, 130, 246';
        grad.addColorStop(0, `rgba(${col}, 0.5)`); grad.addColorStop(1, `rgba(${col}, 0)`);
        ctx.fillStyle = grad; ctx.beginPath(); ctx.arc(c.x, c.y, 50, 0, Math.PI*2); ctx.fill();
        ctx.fillStyle = c.q > 0 ? '#ef4444' : '#3b82f6'; ctx.beginPath(); ctx.arc(c.x, c.y, 20, 0, Math.PI*2); ctx.fill();
        ctx.fillStyle = '#fff'; ctx.font = 'bold 24px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText(c.q > 0 ? '+' : '-', c.x, c.y); ctx.strokeStyle = '#fff'; ctx.lineWidth = 2; ctx.stroke();
    });

    if (showSensor && sensorPos) {
        const {x, y} = sensorPos;
        let Ex = 0, Ey = 0;
        charges.forEach(c => {
            const dx = x - c.x; const dy = y - c.y; const r2 = dx*dx + dy*dy;
            if (r2 < 100) return;
            const E = (c.q * 10000) / r2; const r = Math.sqrt(r2); Ex += E * (dx/r); Ey += E * (dy/r);
        });
        const Emag = Math.sqrt(Ex*Ex + Ey*Ey);
        ctx.beginPath(); ctx.strokeStyle = '#facc15'; ctx.lineWidth = 2; ctx.arc(x, y, 10, 0, Math.PI*2); ctx.stroke(); 
        const len = Math.min(Emag * 10, 100); const nx = Ex / Emag; const ny = Ey / Emag;
        if (Emag > 0.1) {
            ctx.beginPath(); ctx.strokeStyle = '#facc15'; ctx.lineWidth = 4; ctx.moveTo(x, y); ctx.lineTo(x + nx*len, y + ny*len); ctx.stroke();
            ctx.fillStyle = '#facc15'; ctx.font = '12px monospace'; ctx.fillText(`|E| = ${Emag.toFixed(2)}`, x + 20, y - 20);
        }
    }
  };

  useEffect(() => { draw(); }, [charges, sensorPos, showSensor]);
  const addCharge = (q: number) => {
      const canvas = canvasRef.current;
      const x = canvas ? canvas.width/2 + (Math.random()-0.5)*100 : 400; const y = canvas ? canvas.height/2 + (Math.random()-0.5)*100 : 300;
      setCharges(p => [...p, { id: Date.now(), x, y, q }]);
  };

  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden bg-slate-950 shadow-2xl border border-slate-800">
        <canvas 
            ref={canvasRef} 
            width={800} 
            height={500} 
            className={`absolute inset-0 w-full h-full object-contain ${showSensor ? 'cursor-crosshair' : 'cursor-default'}`}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={() => setDraggingId(null)}
            onMouseLeave={() => { setDraggingId(null); setSensorPos(null); }}
        />
        
        {/* CONTROLS */}
        <div className={`absolute top-4 left-4 transition-all duration-300 z-10 ${showControls ? 'w-80' : 'w-12'}`}>
            <div className="bg-slate-900/90 backdrop-blur-md border border-slate-700/50 rounded-2xl shadow-2xl overflow-hidden">
                <button onClick={() => setShowControls(!showControls)} className="w-full p-3 flex items-center justify-between text-slate-300 hover:bg-slate-800 transition-colors border-b border-slate-700/50">
                    {showControls ? <span className="text-xs font-bold uppercase tracking-widest flex items-center gap-2"><Settings2 size={14} className="text-blue-400"/> {t('control_center')}</span> : <Settings2 size={20} className="mx-auto text-blue-400"/>}
                    {showControls && (showControls ? <ChevronUp size={14}/> : <ChevronDown size={14}/>)}
                </button>

                {showControls && (
                    <div className="p-5 space-y-6">
                        <div className="flex gap-4">
                            <button onClick={() => addCharge(1)} className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-500/20 text-red-400 border border-red-500/40 rounded-lg hover:bg-red-500/30 transition-all font-bold text-xs"><Plus size={14} /> + {t('proton')}</button>
                            <button onClick={() => addCharge(-1)} className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-500/20 text-blue-400 border border-blue-500/40 rounded-lg hover:bg-blue-500/30 transition-all font-bold text-xs"><Minus size={14} /> - {t('electron')}</button>
                        </div>
                        <div className="w-full h-px bg-slate-700/50"></div>
                        <button onClick={() => setShowSensor(!showSensor)} className={`w-full flex items-center justify-center gap-2 px-6 py-2 rounded-lg font-bold border transition-all text-sm ${showSensor ? 'bg-yellow-500 text-black border-yellow-600' : 'bg-slate-700 text-slate-300 border-slate-600'}`}>
                            <ScanSearch size={16} /> {showSensor ? `${t('sensor_mode')}: ON` : `${t('sensor_mode')}: OFF`}
                        </button>
                        <button onClick={() => setCharges([])} className="w-full p-2.5 bg-slate-800 text-slate-400 border border-slate-700 rounded-lg hover:bg-slate-700 transition-colors text-xs font-bold uppercase flex items-center justify-center gap-2">
                            <RotateCcw size={14} /> {t('reset_charges')}
                        </button>
                    </div>
                )}
            </div>
         </div>
    </div>
  );
};
