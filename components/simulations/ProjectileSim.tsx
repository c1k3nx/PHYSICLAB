
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Play, RotateCcw, Pause, Crosshair, Wind, MousePointer2, ArrowUpFromLine, ZoomIn } from 'lucide-react';
import { useGlobal } from '../../contexts/GlobalContext';

export const ProjectileSim: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { t } = useGlobal();
  
  // Physics Params
  const [velocity, setVelocity] = useState(60);
  const [angle, setAngle] = useState(45);
  const [heightOffset, setHeightOffset] = useState(0); // Initial Height (h)
  const [gravity, setGravity] = useState(9.8);
  const [airRes, setAirRes] = useState(0);
  
  // State
  const [isRunning, setIsRunning] = useState(false);
  const [time, setTime] = useState(0);
  const [showTarget, setShowTarget] = useState(false);
  const [targetPos, setTargetPos] = useState({x: 600, y: 0});
  const [hit, setHit] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  
  // Camera / Scale
  const [scale, setScale] = useState(4); // pixels per meter

  const requestRef = useRef<number | null>(null);
  const trailRef = useRef<{x:number, y:number}[]>([]);

  const reset = () => {
    setIsRunning(false);
    setTime(0);
    setHit(false);
    trailRef.current = [];
    if (requestRef.current) cancelAnimationFrame(requestRef.current);
    // Trigger a draw to update prediction line immediately
    requestAnimationFrame(() => draw(0));
  };

  const toggleTarget = () => {
      setShowTarget(!showTarget);
      setTargetPos({ x: 300 + Math.random() * 400, y: 0 });
      reset();
  };

  // Interaction handlers
  const handleMouseDown = (e: React.MouseEvent) => {
      const canvas = canvasRef.current;
      if (!canvas || isRunning) return;
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      // Check if near cannon tip (approximate logic considering scale)
      if (x < 200 && y > canvas.height - 300) setIsDragging(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
      if (!isDragging) return;
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const startX = 50;
      const groundY = canvas.height - 40;
      const startY = groundY - heightOffset * scale;
      
      const dx = x - startX;
      const dy = startY - y;
      
      let newAngle = Math.atan2(dy, dx) * 180 / Math.PI;
      if (newAngle < 0) newAngle = 0;
      if (newAngle > 90) newAngle = 90;
      
      const dist = Math.sqrt(dx*dx + dy*dy);
      // Adjust velocity sensitivity based on dragging distance
      const newVel = Math.min(Math.max(dist / 2, 10), 150); 
      
      setAngle(newAngle);
      setVelocity(newVel);
      trailRef.current = []; 
  };

  const handleMouseUp = () => setIsDragging(false);

  // --- PREDICTIVE AUTO-SCALE ---
  useEffect(() => {
     // Run a quick simulation to find bounds
     const dt = 0.1;
     let simT = 0;
     let simX = 0;
     let simY = 0;
     const rad = angle * Math.PI / 180;
     let simVx = velocity * Math.cos(rad);
     let simVy = velocity * Math.sin(rad);
     
     let maxX = 0;
     let maxY = 0;
     
     // Limit prediction steps to avoid freeze
     for(let i=0; i<2000; i++) {
         simX += simVx * dt;
         simY += simVy * dt;
         simVy -= gravity * dt;
         simVx -= airRes * simVx * dt;
         simVy -= airRes * simVy * dt;
         
         if (simY > maxY) maxY = simY;
         if (heightOffset + simY < 0) {
             maxX = simX;
             break; // Hit ground
         }
         maxX = simX;
     }
     
     // Bounds
     const totalMaxHeight = heightOffset + maxY;
     const totalRange = Math.max(maxX, 10); // avoid 0 div
     
     const H = 500;
     const W = 800;
     const margin = 80;
     
     // Calculate ideal scales
     const scaleY = (H - margin*2) / (totalMaxHeight + 10); // +10 buffer
     const scaleX = (W - margin*2) / (totalRange + 10);
     
     // Choose the limiting dimension (zoom out enough to fit both)
     let idealScale = Math.min(scaleX, scaleY);
     
     // Clamp scale reasonable values
     idealScale = Math.min(Math.max(idealScale, 0.2), 5.0);
     
     // Smooth transition if just tweaking, but instant snap is better for "Always inside" guarantee
     if (!isRunning) {
         setScale(idealScale);
     }
     
  }, [velocity, angle, heightOffset, gravity, airRes, isRunning]);


  const draw = useCallback((simTime: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0,0,width,height);
    
    // Sky
    const grad = ctx.createLinearGradient(0, 0, 0, height);
    grad.addColorStop(0, '#0f172a');
    grad.addColorStop(1, '#1e293b');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // Grid (Dynamic based on scale)
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1;
    ctx.beginPath();
    // Grid lines every 10 meters, but if scale is small, every 50m
    const gridMeters = scale < 1 ? 50 : 10;
    const gridSize = gridMeters * scale; 
    
    for (let x = 0; x < width; x += gridSize) { ctx.moveTo(x, 0); ctx.lineTo(x, height); }
    for (let y = height; y > 0; y -= gridSize) { ctx.moveTo(0, y); ctx.lineTo(width, y); }
    ctx.stroke();

    // Ground
    const groundY = height - 40;
    ctx.fillStyle = '#059669';
    ctx.fillRect(0, groundY, width, 40);

    const startX = 50;
    // Calculate cannon Y based on Height Offset (h)
    const startY = groundY - (heightOffset * scale);

    // Draw Platform for Height
    if (heightOffset > 0) {
        ctx.fillStyle = '#475569';
        ctx.fillRect(startX - 20, startY, 40, heightOffset * scale);
        // Hatching
        ctx.strokeStyle = '#334155';
        ctx.beginPath();
        for(let i=startY; i<groundY; i+=20) {
            ctx.moveTo(startX-20, i); ctx.lineTo(startX+20, i+10);
        }
        ctx.stroke();
        
        // Height Label
        ctx.fillStyle = '#fff';
        ctx.font = '12px monospace';
        ctx.fillText(`h=${heightOffset}m`, startX - 60, (startY + groundY)/2);
    }

    // Target
    if (showTarget) {
        const tMeters = targetPos.x / 4; 
        const drawTx = startX + tMeters * scale;
        const drawTy = groundY;
        
        if (drawTx < width) {
            ctx.fillStyle = hit ? '#fbbf24' : '#ef4444';
            ctx.beginPath();
            ctx.rect(drawTx - 20, drawTy - 10, 40, 10);
            ctx.fill();
            ctx.beginPath(); ctx.arc(drawTx, drawTy - 25, 15, 0, Math.PI*2); ctx.fillStyle = 'white'; ctx.fill();
            ctx.beginPath(); ctx.arc(drawTx, drawTy - 25, 10, 0, Math.PI*2); ctx.fillStyle = '#ef4444'; ctx.fill();
            ctx.beginPath(); ctx.arc(drawTx, drawTy - 25, 5, 0, Math.PI*2); ctx.fillStyle = 'white'; ctx.fill();
        }
    }

    // Physics Loop for Drawing
    const rad = (angle * Math.PI) / 180;
    
    // Current Position Calculation
    let simT = 0;
    let sx = 0; // Displacement X (meters)
    let sy = 0; // Displacement Y (meters)
    let svx = velocity * Math.cos(rad);
    let svy = velocity * Math.sin(rad);
    
    const currentTrail: {x:number, y:number}[] = [];
    currentTrail.push({x: startX, y: startY});

    const dt = 0.05;
    const simLimit = isRunning ? simTime : 200; // If not running, simulate full path for prediction
    
    while(simT < simLimit) {
        sx += svx * dt;
        sy += svy * dt;
        svy -= gravity * dt;
        svx -= airRes * svx * dt;
        svy -= airRes * svy * dt;
        
        simT += dt;
        
        // Ground check
        if ((heightOffset + sy) < 0) {
            sy = -heightOffset; 
            break;
        }
        
        if (isRunning) {
            const drawX = startX + sx * scale;
            const drawY = startY - sy * scale;
            currentTrail.push({x: drawX, y: drawY});
        }
    }
    
    // Current Ball Position
    const currX = startX + sx * scale;
    const currY = startY - sy * scale;
    
    // Stop if hit ground
    if (isRunning && (heightOffset + sy) <= 0.01 && simTime > 0.1) {
         if (isRunning) setIsRunning(false); 
    }

    // Draw Prediction Line (if not running)
    if (!isRunning && !hit) {
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        
        let psx = 0, psy = 0;
        let psvx = velocity * Math.cos(rad);
        let psvy = velocity * Math.sin(rad);
        
        ctx.moveTo(startX, startY);
        // Fast simulation for prediction
        for(let i=0; i<500; i++) {
            psx += psvx * 0.1;
            psy += psvy * 0.1;
            psvy -= gravity * 0.1;
            psvx -= airRes * psvx * 0.1;
            psvy -= airRes * psvy * 0.1;
            
            if (heightOffset + psy < 0) break;
            
            ctx.lineTo(startX + psx*scale, startY - psy*scale);
        }
        ctx.stroke();
        ctx.setLineDash([]);
    }

    // Draw Actual Trail
    if (isRunning) {
        ctx.beginPath();
        ctx.strokeStyle = '#facc15';
        ctx.lineWidth = 3;
        if (currentTrail.length > 0) {
            ctx.moveTo(currentTrail[0].x, currentTrail[0].y);
            for(let i=1; i<currentTrail.length; i++) {
                ctx.lineTo(currentTrail[i].x, currentTrail[i].y);
            }
        }
        ctx.stroke();
    }

    // Draw Ball
    ctx.beginPath();
    ctx.fillStyle = '#fff';
    ctx.arc(currX, currY, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.fillStyle = 'rgba(255,255,255,0.3)';
    ctx.arc(currX, currY, 10, 0, Math.PI * 2);
    ctx.fill();

    // Check Hit
    if (showTarget && !hit && isRunning) {
        const tMeters = targetPos.x / 4; 
        const drawTx = startX + tMeters * scale;
        if (Math.hypot(currX - drawTx, currY - (groundY - 25)) < 30) {
            setHit(true);
            setIsRunning(false);
        }
    }
    
    // Cannon
    ctx.save();
    ctx.translate(startX, startY);
    ctx.rotate(-rad);
    ctx.fillStyle = isDragging ? '#60a5fa' : '#475569'; 
    // Cannon length visual
    ctx.fillRect(0, -8, 60, 16); 
    ctx.restore();
    
    // Wheel
    ctx.beginPath(); ctx.arc(startX, startY, 12, 0, Math.PI*2); ctx.fillStyle='#1e293b'; ctx.fill();
    ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 2; ctx.stroke();

    // --- HUD Info Panel ---
    const panelW = 240;
    const panelX = isDragging ? startX + 80 : 20; // Move panel out of way if dragging
    const panelY = 20;

    ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.roundRect(panelX, panelY, panelW, 110, 8); ctx.fill(); ctx.stroke();
    
    // Localized Text
    ctx.fillStyle = '#94a3b8';
    ctx.font = '10px uppercase sans-serif';
    ctx.fillText(t('flight_data').toUpperCase(), panelX + 10, panelY + 20);
    
    // Auto-zoom indicator
    ctx.textAlign = 'right';
    ctx.fillText(`${t('zoom')}: ${scale.toFixed(2)}x`, panelX + panelW - 10, panelY + 20);
    ctx.textAlign = 'left';
    
    ctx.fillStyle = '#e2e8f0';
    ctx.font = '14px monospace';
    
    const currentDist = sx;
    const currentHeightVal = heightOffset + sy;
    
    // Corrected: use simTime instead of t for the number value
    ctx.fillText(`${t('time')}:   ${simTime.toFixed(2)} s`, panelX + 10, panelY + 45);
    ctx.fillText(`${t('range')}:  ${currentDist.toFixed(1)} m`, panelX + 10, panelY + 65);
    ctx.fillText(`${t('height')}: ${Math.max(0, currentHeightVal).toFixed(1)} m`, panelX + 10, panelY + 85);

    if (hit) {
        ctx.fillStyle = '#fbbf24';
        ctx.font = 'bold 40px sans-serif';
        ctx.textAlign = 'center';
        ctx.shadowColor = 'black'; ctx.shadowBlur = 10;
        ctx.fillText(t('target_hit'), width/2, height/2);
        ctx.shadowBlur = 0;
    }

  }, [velocity, angle, gravity, isRunning, showTarget, targetPos, hit, airRes, isDragging, heightOffset, scale, t]);

  const animate = useCallback(() => {
    if (!isRunning) return;
    setTime(prev => {
      const dt = 0.05; 
      const nextTime = prev + dt;
      draw(nextTime);
      return nextTime;
    });
    requestRef.current = requestAnimationFrame(animate);
  }, [isRunning, draw]);

  useEffect(() => {
    if (isRunning) {
        requestRef.current = requestAnimationFrame(animate);
    } else {
        draw(time);
    }
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [isRunning, animate, draw, time]);

  return (
    <div className="flex flex-col h-full gap-4">
      <div className="relative flex-grow bg-slate-900 rounded-xl overflow-hidden border border-slate-700 shadow-2xl group select-none">
        <canvas 
          ref={canvasRef} 
          width={800} 
          height={500} 
          className={`w-full h-full object-contain ${!isRunning ? 'cursor-crosshair' : ''}`}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        />
        {!isRunning && !isDragging && (
             <div className="absolute bottom-20 left-20 pointer-events-none animate-pulse text-white/50 text-sm flex items-center gap-2">
                 <MousePointer2 size={16} /> {t('drag_to_interact')}
             </div>
        )}
        <div className="absolute top-4 right-4 flex gap-2">
             <div className="bg-slate-900/50 backdrop-blur border border-slate-700 rounded px-2 py-1 text-xs text-slate-400 flex items-center gap-2">
                 <ZoomIn size={12}/> {t('auto_zoom')}
             </div>
            <button 
                onClick={toggleTarget}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold border transition ${showTarget ? 'bg-amber-500/20 text-amber-400 border-amber-500/50' : 'bg-slate-800 text-slate-400 border-slate-700'}`}
            >
                <Crosshair size={14} /> {showTarget ? t('target_mode') : t('practice_mode')}
            </button>
        </div>
      </div>

      <div className="bg-slate-800/80 backdrop-blur p-6 rounded-xl border border-slate-700/50 shadow-xl">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-6 items-end">
          
          <div className="space-y-2">
            <div className="flex justify-between">
                <label className="text-[10px] font-bold text-slate-400 uppercase">{t('velocity')}</label>
                <span className="text-[10px] text-blue-400 font-mono">{velocity.toFixed(0)} m/s</span>
            </div>
            <input 
              type="range" min="10" max="150" value={velocity} 
              onChange={(e) => { reset(); setVelocity(Number(e.target.value)); }}
              className="w-full accent-blue-500 h-1.5 bg-slate-700 rounded-lg cursor-pointer"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
                <label className="text-[10px] font-bold text-slate-400 uppercase">{t('angle')}</label>
                <span className="text-[10px] text-blue-400 font-mono">{angle.toFixed(0)}°</span>
            </div>
            <input 
              type="range" min="0" max="90" value={angle} 
              onChange={(e) => { reset(); setAngle(Number(e.target.value)); }}
              className="w-full accent-blue-500 h-1.5 bg-slate-700 rounded-lg cursor-pointer"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
                <label className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1"><ArrowUpFromLine size={10}/> {t('height')}</label>
                <span className="text-[10px] text-green-400 font-mono">{heightOffset}m</span>
            </div>
            <input 
              type="range" min="0" max="100" value={heightOffset} 
              onChange={(e) => { reset(); setHeightOffset(Number(e.target.value)); }}
              className="w-full accent-green-500 h-1.5 bg-slate-700 rounded-lg cursor-pointer"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase">{t('gravity')}</label>
             <select 
              value={gravity}
              onChange={(e) => { reset(); setGravity(Number(e.target.value)); }}
              className="w-full bg-slate-700 border-none text-white text-xs rounded p-1.5"
            >
              <option value={9.8}>Earth (9.8)</option>
              <option value={1.6}>Moon (1.6)</option>
              <option value={3.7}>Mars (3.7)</option>
              <option value={24.8}>Jupiter (24.8)</option>
            </select>
          </div>
          
           <div className="space-y-2">
            <div className="flex justify-between">
                <label className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1"><Wind size={10}/> {t('drag')}</label>
                <span className="text-[10px] text-red-400 font-mono">{airRes.toFixed(2)}</span>
            </div>
            <input 
              type="range" min="0" max="0.2" step="0.01" value={airRes} 
              onChange={(e) => { reset(); setAirRes(Number(e.target.value)); }}
              className="w-full accent-red-500 h-1.5 bg-slate-700 rounded-lg cursor-pointer"
            />
          </div>

          <div className="flex gap-2">
            <button 
              onClick={() => { if(isRunning) setIsRunning(false); else { setHit(false); setIsRunning(true); } }}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg font-bold transition-all shadow-lg text-xs ${
                isRunning 
                  ? 'bg-amber-600 hover:bg-amber-700' 
                  : 'bg-emerald-600 hover:bg-emerald-500'
              } text-white`}
            >
              {isRunning ? <Pause size={14} /> : <Play size={14} />}
              {isRunning ? t('stop') : t('fire')}
            </button>
            <button 
              onClick={reset}
              className="p-2 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg transition-colors"
            >
              <RotateCcw size={16} />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
