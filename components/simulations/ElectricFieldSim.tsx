import React, { useState, useEffect, useRef } from 'react';
import { RotateCcw, Plus, Minus, MousePointer2, ScanSearch } from 'lucide-react';

interface Charge {
    id: number;
    x: number;
    y: number;
    q: number; // +1 or -1
}

export const ElectricFieldSim: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [charges, setCharges] = useState<Charge[]>([
      { id: 1, x: 250, y: 250, q: 1 },
      { id: 2, x: 550, y: 250, q: -1 }
  ]);
  const [draggingId, setDraggingId] = useState<number | null>(null);
  const [sensorPos, setSensorPos] = useState<{x:number, y:number} | null>(null);
  const [showSensor, setShowSensor] = useState(false);

  // Helper to get mouse pos relative to canvas scale
  const getPos = (e: React.MouseEvent) => {
      const canvas = canvasRef.current;
      if (!canvas) return {x:0, y:0};
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      return {
          x: (e.clientX - rect.left) * scaleX,
          y: (e.clientY - rect.top) * scaleY
      };
  };

  const handleMouseDown = (e: React.MouseEvent) => {
      const {x, y} = getPos(e);
      // Check collision with charges
      const hit = charges.find(c => Math.hypot(c.x - x, c.y - y) < 30);
      if (hit) {
          setDraggingId(hit.id);
      } else {
          // If clicking empty space, maybe toggle sensor?
          // For now, dragging implies moving charges.
      }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
      const {x, y} = getPos(e);
      
      if (showSensor) {
          setSensorPos({x, y});
      }

      if (draggingId !== null) {
          setCharges(prev => prev.map(c => 
              c.id === draggingId ? { ...c, x, y } : c
          ));
      }
  };

  const handleMouseUp = () => setDraggingId(null);
  const handleMouseLeave = () => {
      setDraggingId(null);
      setSensorPos(null);
  };

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const w = canvas.width;
    const h = canvas.height;

    ctx.clearRect(0,0,w,h);
    
    // Background: Dark
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0,0,w,h);

    // 1. Compute Field Vectors (Grid)
    // Optimization: Draw every N pixels
    const GRID = 40;
    ctx.lineWidth = 1;
    
    for(let x = GRID/2; x < w; x += GRID) {
        for(let y = GRID/2; y < h; y += GRID) {
            let Ex = 0, Ey = 0;
            let maxPot = 0;
            
            // Superposition Principle
            charges.forEach(c => {
                const dx = x - c.x;
                const dy = y - c.y;
                const r2 = dx*dx + dy*dy;
                if (r2 < 400) return; // Inside charge
                const E = (c.q * 8000) / r2; // kQ/r^2
                const r = Math.sqrt(r2);
                Ex += E * (dx/r);
                Ey += E * (dy/r);
            });
            
            const Emag = Math.sqrt(Ex*Ex + Ey*Ey);
            if (Emag < 0.2) continue;
            
            // Draw Arrow
            const len = Math.min(Emag * 5, GRID * 0.8);
            const nx = Ex / Emag;
            const ny = Ey / Emag;
            
            // Color based on field strength
            const alpha = Math.min(Emag / 5, 1);
            ctx.strokeStyle = `rgba(255, 255, 255, ${alpha * 0.5})`;
            
            ctx.beginPath();
            ctx.moveTo(x - nx*len/2, y - ny*len/2);
            ctx.lineTo(x + nx*len/2, y + ny*len/2);
            ctx.stroke();
            
            // Arrowhead
            ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.8})`;
            ctx.beginPath();
            ctx.arc(x + nx*len/2, y + ny*len/2, 2, 0, Math.PI*2);
            ctx.fill();
        }
    }

    // 2. Draw Charges
    charges.forEach(c => {
        // Glow
        const grad = ctx.createRadialGradient(c.x, c.y, 10, c.x, c.y, 50);
        const col = c.q > 0 ? '239, 68, 68' : '59, 130, 246';
        grad.addColorStop(0, `rgba(${col}, 0.5)`);
        grad.addColorStop(1, `rgba(${col}, 0)`);
        ctx.fillStyle = grad;
        ctx.beginPath(); ctx.arc(c.x, c.y, 50, 0, Math.PI*2); ctx.fill();
        
        // Body
        ctx.fillStyle = c.q > 0 ? '#ef4444' : '#3b82f6';
        ctx.beginPath(); ctx.arc(c.x, c.y, 20, 0, Math.PI*2); ctx.fill();
        
        // Symbol
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 24px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(c.q > 0 ? '+' : '-', c.x, c.y);
        
        // Ring
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        ctx.stroke();
    });

    // 3. Sensor Mode
    if (showSensor && sensorPos) {
        const {x, y} = sensorPos;
        let Ex = 0, Ey = 0;
        charges.forEach(c => {
            const dx = x - c.x;
            const dy = y - c.y;
            const r2 = dx*dx + dy*dy;
            if (r2 < 100) return;
            const E = (c.q * 10000) / r2;
            const r = Math.sqrt(r2);
            Ex += E * (dx/r);
            Ey += E * (dy/r);
        });
        
        const Emag = Math.sqrt(Ex*Ex + Ey*Ey);
        
        // Draw Sensor UI
        ctx.beginPath();
        ctx.strokeStyle = '#facc15';
        ctx.lineWidth = 2;
        ctx.arc(x, y, 10, 0, Math.PI*2);
        ctx.stroke(); // Reticle
        
        // Force Vector
        const len = Math.min(Emag * 10, 100);
        const nx = Ex / Emag;
        const ny = Ey / Emag;
        
        if (Emag > 0.1) {
            ctx.beginPath();
            ctx.strokeStyle = '#facc15';
            ctx.lineWidth = 4;
            ctx.moveTo(x, y);
            ctx.lineTo(x + nx*len, y + ny*len);
            ctx.stroke();
            
            // Text Value
            ctx.fillStyle = '#facc15';
            ctx.font = '12px monospace';
            ctx.fillText(`|E| = ${Emag.toFixed(2)}`, x + 20, y - 20);
        }
    }
  };

  useEffect(() => {
      draw();
  }, [charges, sensorPos, showSensor]);

  const addCharge = (q: number) => {
      const canvas = canvasRef.current;
      const x = canvas ? canvas.width/2 + (Math.random()-0.5)*100 : 400;
      const y = canvas ? canvas.height/2 + (Math.random()-0.5)*100 : 300;
      setCharges(p => [...p, { id: Date.now(), x, y, q }]);
  };

  return (
    <div className="flex flex-col h-full gap-4">
      <div className="relative flex-grow bg-slate-900 rounded-xl overflow-hidden border border-slate-700 shadow-xl group">
         <canvas 
            ref={canvasRef} 
            width={800} 
            height={500} 
            className={`w-full h-full object-contain ${showSensor ? 'cursor-crosshair' : 'cursor-default'}`}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
         />
         
         <div className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur border border-slate-600 p-3 rounded-lg text-xs text-slate-300 pointer-events-none">
             Drag charges to move them. Toggle Sensor to measure field.
         </div>
      </div>

      <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 flex flex-wrap gap-4 items-center justify-between">
           <div className="flex gap-4">
                <button 
                    onClick={() => addCharge(1)}
                    className="flex items-center gap-2 px-4 py-2 bg-red-500/20 text-red-400 border border-red-500/40 rounded-lg hover:bg-red-500/30 transition-all font-bold"
                >
                    <Plus size={18} /> Add Proton (+q)
                </button>
                <button 
                    onClick={() => addCharge(-1)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-500/20 text-blue-400 border border-blue-500/40 rounded-lg hover:bg-blue-500/30 transition-all font-bold"
                >
                    <Minus size={18} /> Add Electron (-q)
                </button>
           </div>
           
           <div className="flex items-center gap-4">
                <button 
                    onClick={() => setShowSensor(!showSensor)}
                    className={`flex items-center gap-2 px-6 py-2 rounded-lg font-bold border transition-all ${showSensor ? 'bg-yellow-500 text-black border-yellow-600' : 'bg-slate-700 text-slate-300 border-slate-600'}`}
                >
                    <ScanSearch size={18} /> {showSensor ? 'Sensor ON' : 'Sensor OFF'}
                </button>
                
                <button 
                    onClick={() => setCharges([])}
                    className="p-2.5 bg-slate-700 text-slate-300 rounded-lg hover:bg-slate-600 transition-colors"
                >
                    <RotateCcw size={18} />
                </button>
           </div>
      </div>
    </div>
  );
};