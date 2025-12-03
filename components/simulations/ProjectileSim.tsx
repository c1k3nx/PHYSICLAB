
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Play, RotateCcw, Pause, Wind, Target, Gauge, Settings2, ChevronUp, ChevronDown } from 'lucide-react';
import { useGlobal } from '../../contexts/GlobalContext';

export const ProjectileSim: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { t } = useGlobal();
  
  // Physics Params
  const [velocity, setVelocity] = useState(60);
  const [angle, setAngle] = useState(45);
  const [heightOffset, setHeightOffset] = useState(0);
  const [gravity, setGravity] = useState(9.8);
  const [airRes, setAirRes] = useState(0);
  
  // State
  const [isRunning, setIsRunning] = useState(false);
  const [showTarget, setShowTarget] = useState(false);
  const [targetDist, setTargetDist] = useState(300);
  const [hit, setHit] = useState(false);
  const [isDraggingTarget, setIsDraggingTarget] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  
  // Live Data
  const [liveData, setLiveData] = useState({ time: 0, range: 0, height: 0 });
  const [scale, setScale] = useState(1); 

  const requestRef = useRef<number | null>(null);
  const trailRef = useRef<{x:number, y:number}[]>([]);
  const simTimeRef = useRef(0);

  const getMousePos = (e: React.MouseEvent) => {
      const canvas = canvasRef.current;
      if (!canvas) return {x:0, y:0};
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      return { x: (e.clientX - rect.left) * scaleX, y: (e.clientY - rect.top) * scaleY };
  };

  // --- ANALYTIC AUTO-SCALING ---
  useEffect(() => {
      // Calculate theoretical max range/height to fit screen
      const rad = angle * Math.PI / 180;
      const vy = velocity * Math.sin(rad);
      const vx = velocity * Math.cos(rad);
      
      // Max Height: H = h0 + (vy^2)/(2g)
      const hMax = heightOffset + (vy * vy) / (2 * gravity);
      
      // Max Range: Solving y(t) = h0 + vy*t - 0.5*g*t^2 = 0 for t (landing time)
      const t_flight = (vy + Math.sqrt(vy*vy + 2*gravity*heightOffset)) / gravity;
      const rMax = vx * t_flight;
      
      // Canvas dimensions (Fixed internal resolution)
      const CAN_W = 1000;
      const CAN_H = 600;
      const GROUND_H = 40;
      const START_X = 60;
      
      // Margins
      const PADDING_TOP = 100;
      const PADDING_RIGHT = 100;
      
      // Required Real-World Dimensions
      const requiredHeight = hMax; 
      // Ensure we see the target if enabled, or the projectile landing point
      const requiredWidth = Math.max(rMax, showTarget ? targetDist : 0);
      
      // Calculate scale factors (Pixels per Meter)
      // Height: (CAN_H - GROUND_H - PADDING) / RealHeight
      const scaleY = (CAN_H - GROUND_H - PADDING_TOP) / Math.max(10, requiredHeight);
      
      // Width: (CAN_W - START_X - PADDING) / RealWidth
      const scaleX = (CAN_W - START_X - PADDING_RIGHT) / Math.max(10, requiredWidth);
      
      // Use smallest scale to fit both dimensions
      let newScale = Math.min(scaleX, scaleY);
      
      // Clamp scale to reasonable limits to prevent extreme zoom in/out
      newScale = Math.min(Math.max(newScale, 0.1), 5.0);
      
      setScale(newScale);
      
  }, [velocity, angle, heightOffset, gravity, showTarget, targetDist]); // Removed isRunning to allow live rescaling if needed

  const reset = () => {
    setIsRunning(false);
    simTimeRef.current = 0;
    setLiveData({ time: 0, range: 0, height: heightOffset });
    setHit(false);
    trailRef.current = [];
    if (requestRef.current) cancelAnimationFrame(requestRef.current);
    draw(0);
  };

  const draw = useCallback((currentTime: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0,0,width,height);
    
    // Background
    const grad = ctx.createRadialGradient(width/2, height, 0, width/2, height/2, width);
    grad.addColorStop(0, '#0f172a');
    grad.addColorStop(1, '#020617');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // Grid (Dynamic based on scale)
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1;
    ctx.beginPath();
    const gridSpacingMeters = 50; 
    const gridSizePx = gridSpacingMeters * scale;
    // Only draw grid if lines aren't too dense
    if (gridSizePx > 10) {
        for (let x = 0; x < width; x += gridSizePx) { ctx.moveTo(x, 0); ctx.lineTo(x, height); }
        for (let y = height; y > 0; y -= gridSizePx) { ctx.moveTo(0, y); ctx.lineTo(width, y); }
        ctx.stroke();
    }

    // Ground
    const groundY = height - 40;
    ctx.fillStyle = '#10b981';
    ctx.fillRect(0, groundY, width, 40);
    ctx.fillStyle = '#047857';
    ctx.fillRect(0, groundY, width, 5);

    const startX = 60;
    const startY = groundY - (heightOffset * scale);

    // Platform
    if (heightOffset > 0) {
        ctx.fillStyle = '#334155';
        ctx.fillRect(startX - 20, startY, 40, heightOffset * scale);
        
        // Height marker
        ctx.strokeStyle = 'rgba(255,255,255,0.5)';
        ctx.setLineDash([4, 4]);
        ctx.beginPath(); ctx.moveTo(startX - 30, startY); ctx.lineTo(startX - 30, groundY); ctx.stroke();
        ctx.setLineDash([]);
        ctx.fillStyle = '#fff'; ctx.font = '12px monospace';
        ctx.save(); ctx.translate(startX - 40, (startY + groundY)/2); ctx.rotate(-Math.PI/2);
        ctx.fillText(`${heightOffset}m`, 0, 0); ctx.restore();
    }

    // Target
    if (showTarget) {
        const tx = startX + targetDist * scale;
        // Don't draw if completely off screen (though auto-scale should prevent this)
        if (tx < width + 100) {
            ctx.fillStyle = hit ? '#fbbf24' : '#ef4444';
            if (isDraggingTarget) { ctx.shadowBlur = 15; ctx.shadowColor = '#fbbf24'; }
            ctx.fillRect(tx - 20, groundY - 10, 40, 10);
            ctx.beginPath(); ctx.arc(tx, groundY - 30, 15, 0, Math.PI*2); ctx.fill();
            ctx.fillStyle = 'white'; ctx.beginPath(); ctx.arc(tx, groundY - 30, 10, 0, Math.PI*2); ctx.fill();
            ctx.fillStyle = '#ef4444'; ctx.beginPath(); ctx.arc(tx, groundY - 30, 5, 0, Math.PI*2); ctx.fill();
            ctx.shadowBlur = 0;

            const textY = groundY + 25;
            ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 1; ctx.beginPath();
            ctx.moveTo(startX, textY); ctx.lineTo(tx, textY);
            ctx.moveTo(startX, textY - 5); ctx.lineTo(startX, textY + 5);
            ctx.moveTo(tx, textY - 5); ctx.lineTo(tx, textY + 5);
            ctx.stroke();

            ctx.fillStyle = '#fbbf24'; ctx.font = 'bold 14px monospace'; ctx.textAlign = 'center';
            const text = `${targetDist.toFixed(1)}m`;
            const textWidth = ctx.measureText(text).width;
            ctx.fillStyle = '#0f172a';
            ctx.fillRect((startX + tx)/2 - textWidth/2 - 4, textY - 10, textWidth + 8, 20);
            ctx.fillStyle = '#fbbf24';
            ctx.fillText(text, (startX + tx)/2, textY + 4);
            
            if (!isDraggingTarget && !isRunning && Math.abs(mousePos.x - tx) < 30 && Math.abs(mousePos.y - (groundY-30)) < 30) {
                ctx.fillStyle = 'white'; ctx.font = '10px sans-serif'; ctx.fillText("Drag to move", tx, groundY - 55);
            }
        }
    }

    // --- PHYSICS CALCULATION ---
    const rad = (angle * Math.PI) / 180;
    const dt = 0.05;
    const limit = isRunning ? currentTime : 0;
    
    const activePath: {x:number, y:number}[] = [];
    activePath.push({x: startX, y: startY});
    
    let sx = 0, sy = 0;
    let svx = velocity * Math.cos(rad);
    let svy = velocity * Math.sin(rad);
    let simT = 0;
    let didHit = false;

    if (isRunning || trailRef.current.length > 0) {
        const simLimit = isRunning ? limit : 999;
        
        while (simT < simLimit) {
            sx += svx * dt;
            sy += svy * dt;
            svy -= gravity * dt;
            
            if (airRes > 0) {
                const v = Math.sqrt(svx*svx + svy*svy);
                const dragForce = airRes * v * v; 
                const ax_drag = -(dragForce * (svx/v));
                const ay_drag = -(dragForce * (svy/v));
                // Simplified Euler integration
                svx += ax_drag * dt;
                svy += ay_drag * dt;
            }
            
            simT += dt;
            
            const curPx = startX + sx * scale;
            const curPy = startY - sy * scale;
            
            activePath.push({x: curPx, y: curPy});
            
            if (showTarget && !didHit && isRunning) {
                const tx = startX + targetDist * scale;
                const ty = groundY - 30;
                if (Math.hypot(curPx - tx, curPy - ty) < 20) {
                    didHit = true;
                    setHit(true);
                    setIsRunning(false);
                    break;
                }
            }

            if (curPy >= groundY) {
                if (isRunning) setIsRunning(false);
                activePath[activePath.length-1].y = groundY;
                break;
            }
            
            if (!isRunning && trailRef.current.length > 0) break;
        }
        
        if (isRunning) {
            setLiveData({ 
                time: simT, 
                range: sx, 
                height: Math.max(0, heightOffset + sy) 
            });
            trailRef.current = activePath;
        }
    }

    const path = isRunning ? activePath : trailRef.current;
    
    if (path.length > 1) {
        ctx.beginPath();
        ctx.strokeStyle = '#facc15';
        ctx.lineWidth = 3;
        ctx.lineJoin = 'round';
        ctx.moveTo(path[0].x, path[0].y);
        for(let i=1; i<path.length; i++) ctx.lineTo(path[i].x, path[i].y);
        ctx.stroke();
        
        const last = path[path.length-1];
        ctx.fillStyle = '#fff';
        ctx.shadowColor = '#facc15'; ctx.shadowBlur = 10;
        ctx.beginPath(); ctx.arc(last.x, last.y, 6, 0, Math.PI*2); ctx.fill();
        ctx.shadowBlur = 0;
    } else {
        ctx.fillStyle = '#fff';
        ctx.beginPath(); ctx.arc(startX, startY, 6, 0, Math.PI*2); ctx.fill();
    }

    // Prediction (Dotted)
    if (!isRunning && path.length === 0) {
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(255,255,255,0.3)';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        
        let px=0, py=0, pvx=velocity*Math.cos(rad), pvy=velocity*Math.sin(rad);
        ctx.moveTo(startX, startY);
        for(let i=0; i<500; i++) {
            px += pvx * 0.1; py += pvy * 0.1;
            pvy -= gravity * 0.1;
            // Simple drag approx for prediction visual
            if (airRes > 0) { pvx *= 0.99; pvy *= 0.99; }
            
            const dx = startX + px*scale;
            const dy = startY - py*scale;
            ctx.lineTo(dx, dy);
            if (dy > groundY) break;
        }
        ctx.stroke();
        ctx.setLineDash([]);
    }

    // Cannon
    ctx.save();
    ctx.translate(startX, startY);
    ctx.rotate(-rad);
    ctx.fillStyle = '#475569';
    ctx.beginPath(); ctx.roundRect(0, -12, 60, 24, 6); ctx.fill();
    ctx.restore();
    ctx.fillStyle = '#1e293b'; ctx.beginPath(); ctx.arc(startX, startY, 16, 0, Math.PI*2); ctx.fill();
    ctx.strokeStyle = '#94a3b8'; ctx.lineWidth=3; ctx.stroke();

    if (hit) {
        ctx.fillStyle = '#facc15';
        ctx.font = 'bold 40px sans-serif';
        ctx.textAlign = 'center';
        ctx.shadowColor = 'black'; ctx.shadowBlur = 10;
        ctx.fillText("🎯 " + t('target_hit'), width/2, height/3);
        ctx.shadowBlur = 0;
    }

  }, [velocity, angle, gravity, isRunning, showTarget, targetDist, hit, airRes, heightOffset, scale, t, isDraggingTarget, mousePos]);

  const animate = useCallback(() => {
    if (!isRunning) return;
    simTimeRef.current += 0.05;
    draw(simTimeRef.current);
    requestRef.current = requestAnimationFrame(animate);
  }, [isRunning, draw]);

  useEffect(() => {
    if (isRunning) requestRef.current = requestAnimationFrame(animate);
    else draw(0);
    return () => { if (requestRef.current) cancelAnimationFrame(requestRef.current); };
  }, [isRunning, animate, draw]);

  const handleMouseDown = (e: React.MouseEvent) => {
      if (!showTarget) return;
      const {x, y} = getMousePos(e);
      const groundY = canvasRef.current ? canvasRef.current.height - 40 : 560;
      const startX = 60;
      const tx = startX + targetDist * scale;
      const ty = groundY - 30;
      
      if (Math.hypot(x - tx, y - ty) < 40) {
          setIsDraggingTarget(true);
          reset();
      }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
      const pos = getMousePos(e);
      setMousePos(pos);
      if (isDraggingTarget) {
          const startX = 60;
          let newDist = (pos.x - startX) / scale;
          newDist = Math.max(10, Math.min(newDist, 5000)); // Allow larger range
          setTargetDist(newDist);
          reset();
      }
  };

  const handleMouseUp = () => { setIsDraggingTarget(false); };

  const getCursorStyle = () => {
      if (isDraggingTarget) return 'cursor-grabbing';
      if (showTarget) {
          const groundY = canvasRef.current ? canvasRef.current.height - 40 : 560;
          const startX = 60;
          const tx = startX + targetDist * scale;
          const ty = groundY - 30;
          if (Math.hypot(mousePos.x - tx, mousePos.y - ty) < 40) return 'cursor-grab';
      }
      return 'cursor-default';
  };

  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden bg-slate-950 shadow-2xl border border-slate-800">
        <canvas 
            ref={canvasRef} 
            width={1000} 
            height={600} 
            className={`absolute inset-0 w-full h-full object-contain ${getCursorStyle()}`}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
        />

        {/* HUD */}
        <div className="absolute top-4 right-4 z-10 pointer-events-none">
            <div className="bg-slate-900/80 backdrop-blur-md border border-slate-700/50 rounded-2xl p-4 shadow-xl w-48">
                <h4 className="text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-3 flex items-center gap-2">
                    <Gauge size={12}/> {t('flight_data')}
                </h4>
                <div className="space-y-2 font-mono text-sm">
                    <div className="flex justify-between">
                        <span className="text-slate-400">{t('time')}</span>
                        <span className="text-white">{liveData.time.toFixed(2)}s</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-slate-400">{t('range')}</span>
                        <span className="text-emerald-400">{liveData.range.toFixed(1)}m</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-slate-400">{t('height')}</span>
                        <span className="text-blue-400">{liveData.height.toFixed(1)}m</span>
                    </div>
                </div>
            </div>
        </div>

        {/* CONTROLS */}
        <div className={`absolute top-4 left-4 transition-all duration-300 z-20 ${showControls ? 'w-80' : 'w-12'}`}>
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
                    <div className="p-5 space-y-6 max-h-[80vh] overflow-y-auto custom-scrollbar">
                        <div className="space-y-4">
                            <div className="space-y-1">
                                <div className="flex justify-between text-xs">
                                    <span className="text-slate-300 font-medium">{t('velocity')}</span>
                                    <span className="text-blue-400 font-mono">{velocity} m/s</span>
                                </div>
                                <input type="range" min="10" max="200" value={velocity} onChange={(e) => {reset(); setVelocity(Number(e.target.value))}} className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"/>
                            </div>
                            <div className="space-y-1">
                                <div className="flex justify-between text-xs">
                                    <span className="text-slate-300 font-medium">{t('angle')}</span>
                                    <span className="text-blue-400 font-mono">{angle}°</span>
                                </div>
                                <input type="range" min="0" max="90" value={angle} onChange={(e) => {reset(); setAngle(Number(e.target.value))}} className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"/>
                            </div>
                            <div className="space-y-1">
                                <div className="flex justify-between text-xs">
                                    <span className="text-slate-300 font-medium">{t('height')}</span>
                                    <span className="text-green-400 font-mono">{heightOffset} m</span>
                                </div>
                                <input type="range" min="0" max="100" value={heightOffset} onChange={(e) => {reset(); setHeightOffset(Number(e.target.value))}} className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-green-500"/>
                            </div>
                        </div>

                        <div className="w-full h-px bg-slate-700/50"></div>

                        <div className="space-y-4">
                            <div className="space-y-1">
                                <div className="flex justify-between text-xs">
                                    <span className="text-slate-300 font-medium">{t('gravity')}</span>
                                    <span className="text-orange-400 font-mono">{gravity} m/s²</span>
                                </div>
                                <input type="range" min="1.6" max="25" step="0.1" value={gravity} onChange={(e) => {reset(); setGravity(Number(e.target.value))}} className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-orange-500"/>
                            </div>
                            <div className="space-y-1">
                                <div className="flex justify-between text-xs">
                                    <span className="text-slate-300 font-medium flex items-center gap-1"><Wind size={12}/> {t('drag')}</span>
                                    <span className="text-red-400 font-mono">{airRes.toFixed(3)}</span>
                                </div>
                                <input type="range" min="0" max="0.05" step="0.001" value={airRes} onChange={(e) => {reset(); setAirRes(Number(e.target.value))}} className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-red-500"/>
                            </div>
                        </div>

                        <div className="w-full h-px bg-slate-700/50"></div>

                        <div className="space-y-2">
                            <button onClick={() => {setShowTarget(!showTarget); reset();}} className={`w-full py-2 rounded-lg text-xs font-bold border transition-all flex items-center justify-center gap-2 ${showTarget ? 'bg-amber-500/20 border-amber-500 text-amber-400' : 'bg-slate-800 border-slate-600 text-slate-400'}`}>
                                <Target size={14}/> {showTarget ? `${t('target_mode')}: ON` : `${t('target_mode')}: OFF`}
                            </button>
                            {showTarget && (
                                <div className="space-y-1 px-2 border-l-2 border-amber-500/30">
                                    <div className="flex justify-between text-xs mb-1">
                                        <span className="text-slate-400 italic">Target Distance</span>
                                        <span className="text-amber-400 font-mono">{targetDist.toFixed(1)}m</span>
                                    </div>
                                    <input type="range" min="50" max="5000" value={targetDist} onChange={(e) => {setTargetDist(Number(e.target.value)); reset();}} className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-500"/>
                                </div>
                            )}
                        </div>

                        <div className="grid grid-cols-4 gap-2">
                            <button 
                                onClick={() => {
                                    if (!isRunning) setShowControls(false); 
                                    setIsRunning(!isRunning);
                                }} 
                                className={`col-span-3 py-3 rounded-xl font-bold text-white shadow-lg flex items-center justify-center gap-2 transition-all active:scale-95 ${isRunning ? 'bg-amber-600 hover:bg-amber-500' : 'bg-emerald-600 hover:bg-emerald-500'}`}
                            >
                                {isRunning ? <Pause size={18}/> : <Play size={18}/>}
                                {isRunning ? t('stop').toUpperCase() : t('fire').toUpperCase()}
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
