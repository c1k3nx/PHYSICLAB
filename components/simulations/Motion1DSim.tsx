
import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Settings2, ChevronUp, ChevronDown, Activity, FastForward } from 'lucide-react';
import { useGlobal } from '../../contexts/GlobalContext';

export const Motion1DSim: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { t } = useGlobal();
  
  // Parameters
  const [x0, setX0] = useState(0);
  const [v0, setV0] = useState(0);
  const [a, setA] = useState(2);
  
  // State
  const [isRunning, setIsRunning] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const timeRef = useRef(0);
  const requestRef = useRef<number | null>(null);
  
  // Data history for graphs
  const historyRef = useRef<{t: number, x: number, v: number, a: number}[]>([]);

  const reset = () => {
      setIsRunning(false);
      timeRef.current = 0;
      historyRef.current = [];
      draw();
  };

  const update = (dt: number) => {
      timeRef.current += dt;
      const t_val = timeRef.current;
      
      // Kinematic Equations
      const currentV = v0 + a * t_val;
      const currentX = x0 + v0 * t_val + 0.5 * a * t_val * t_val;
      
      // Store history (limit to last 300 points for performance)
      historyRef.current.push({ t: t_val, x: currentX, v: currentV, a: a });
      if (historyRef.current.length > 300) historyRef.current.shift();
  };

  const draw = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      
      const w = canvas.width;
      const h = canvas.height;
      const t_val = timeRef.current;
      
      // Calculate current state
      const currentV = v0 + a * t_val;
      const currentX = x0 + v0 * t_val + 0.5 * a * t_val * t_val;
      
      // Camera Logic: Keep train in center horizontally
      const SCALE = 40; // 1 meter = 40 pixels
      const camOffset = currentX * SCALE - w/2;
      
      // --- DRAW WORLD ---
      ctx.clearRect(0,0,w,h);
      
      // Sci-Fi Background
      const grad = ctx.createLinearGradient(0, 0, 0, h);
      grad.addColorStop(0, '#020617');
      grad.addColorStop(1, '#0f172a');
      ctx.fillStyle = grad;
      ctx.fillRect(0,0,w,h);
      
      // Draw Moving Elements (Grid, Train)
      ctx.save();
      ctx.translate(-camOffset, 0);
      
      const groundY = h - 150;
      
      // Infinite Grid / Track
      const startGrid = Math.floor(camOffset / SCALE) - 5;
      const endGrid = startGrid + Math.ceil(w / SCALE) + 10;
      
      // Track Glow
      ctx.shadowBlur = 20;
      ctx.shadowColor = '#3b82f6';
      ctx.fillStyle = 'rgba(59, 130, 246, 0.1)';
      ctx.fillRect(startGrid*SCALE, groundY, (endGrid-startGrid)*SCALE, 10);
      ctx.shadowBlur = 0;

      // Track Markers
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 2;
      ctx.font = '12px monospace';
      ctx.fillStyle = '#64748b';
      ctx.textAlign = 'center';
      
      for(let i=startGrid; i<=endGrid; i++) {
          const px = i * SCALE;
          // Floor ticks
          ctx.beginPath(); ctx.moveTo(px, groundY); ctx.lineTo(px, groundY + 20); ctx.stroke();
          
          if (i % 5 === 0) {
              ctx.fillStyle = '#94a3b8';
              ctx.fillText(`${i}m`, px, groundY + 40);
              ctx.fillStyle = '#64748b';
              // Vertical Grid Line
              ctx.strokeStyle = 'rgba(255,255,255,0.05)';
              ctx.beginPath(); ctx.moveTo(px, 0); ctx.lineTo(px, groundY); ctx.stroke();
              ctx.strokeStyle = '#1e293b';
          }
      }
      
      // Origin Marker (Start Position)
      ctx.fillStyle = 'rgba(239, 68, 68, 0.5)';
      ctx.fillRect(x0 * SCALE - 2, groundY - 60, 4, 60);
      ctx.fillStyle = '#ef4444';
      ctx.fillText("START", x0 * SCALE, groundY - 70);

      // --- MAGLEV TRAIN ---
      const trainX = currentX * SCALE;
      const trainY = groundY - 30;
      
      // Motion Trail
      if (historyRef.current.length > 2) {
          ctx.beginPath();
          ctx.strokeStyle = 'rgba(59, 130, 246, 0.4)';
          ctx.lineWidth = 4;
          const startIdx = Math.max(0, historyRef.current.length - 50);
          for(let i=startIdx; i<historyRef.current.length; i++) {
              const p = historyRef.current[i];
              if (i===startIdx) ctx.moveTo(p.x * SCALE, trainY);
              else ctx.lineTo(p.x * SCALE, trainY);
          }
          ctx.stroke();
      }

      // Train Body
      ctx.save();
      ctx.translate(trainX, trainY);
      
      // Glow
      ctx.shadowColor = '#60a5fa'; ctx.shadowBlur = 30;
      // Hull
      const gradTrain = ctx.createLinearGradient(-40, -20, 40, 20);
      gradTrain.addColorStop(0, '#2563eb');
      gradTrain.addColorStop(1, '#1d4ed8');
      ctx.fillStyle = gradTrain;
      ctx.beginPath();
      ctx.moveTo(50, 10);
      ctx.lineTo(60, 0);
      ctx.lineTo(50, -20);
      ctx.lineTo(-50, -20);
      ctx.lineTo(-60, 0);
      ctx.lineTo(-50, 10);
      ctx.closePath();
      ctx.fill();
      
      // Cockpit / Window
      ctx.fillStyle = '#bfdbfe';
      ctx.shadowBlur = 10;
      ctx.beginPath(); ctx.moveTo(20, -20); ctx.lineTo(40, -5); ctx.lineTo(20, -5); ctx.lineTo(20, -20); ctx.fill();
      
      // Engine Glow
      ctx.shadowBlur = 20;
      ctx.shadowColor = '#f43f5e';
      ctx.fillStyle = '#f43f5e';
      if (Math.abs(currentV) > 0.1) {
          const flameSize = Math.min(30, Math.abs(currentV)*2);
          const dir = -Math.sign(currentV);
          ctx.beginPath();
          ctx.moveTo(55*dir, -5);
          ctx.lineTo((55 + flameSize)*dir, -10);
          ctx.lineTo(55*dir, -15);
          ctx.fill();
      }
      ctx.restore();

      // Vectors (Attached to Train)
      // Velocity (Green)
      if (Math.abs(currentV) > 0.1) {
          const vLen = currentV * 15;
          ctx.strokeStyle = '#10b981'; ctx.lineWidth = 4;
          ctx.beginPath(); ctx.moveTo(trainX, trainY - 40); ctx.lineTo(trainX + vLen, trainY - 40); ctx.stroke();
          // Arrow
          ctx.fillStyle = '#10b981';
          ctx.beginPath(); ctx.moveTo(trainX + vLen, trainY - 40); 
          const dir = Math.sign(currentV);
          ctx.lineTo(trainX + vLen - 8*dir, trainY - 46); ctx.lineTo(trainX + vLen - 8*dir, trainY - 34); ctx.fill();
          ctx.font = 'bold 12px sans-serif'; ctx.fillText(`v = ${currentV.toFixed(1)}`, trainX + vLen/2, trainY - 55);
      }

      // Acceleration (Yellow)
      if (Math.abs(a) > 0.01) {
          const aLen = a * 30;
          const aY = trainY - 70;
          ctx.strokeStyle = '#facc15'; ctx.lineWidth = 4;
          ctx.beginPath(); ctx.moveTo(trainX, aY); ctx.lineTo(trainX + aLen, aY); ctx.stroke();
          ctx.fillStyle = '#facc15';
          ctx.beginPath(); ctx.moveTo(trainX + aLen, aY); 
          const dir = Math.sign(a);
          ctx.lineTo(trainX + aLen - 8*dir, aY - 6); ctx.lineTo(trainX + aLen - 8*dir, aY + 6); ctx.fill();
          ctx.fillText(`a = ${a.toFixed(1)}`, trainX + aLen/2, aY - 10);
      }

      ctx.restore();
      
      // --- HUD GRAPHS (Overlay) ---
      // Draw directly on screen coordinates (no camera transform)
      const graphW = 250;
      const graphH = 60;
      const gap = 10;
      const startX = w - graphW - 20;
      let startY = 20;
      
      const drawHUDGraph = (label: string, color: string, dataKey: 'x'|'v'|'a', unit: string) => {
          // Background
          ctx.fillStyle = 'rgba(15, 23, 42, 0.8)';
          ctx.strokeStyle = 'rgba(255,255,255,0.1)';
          ctx.lineWidth = 1;
          ctx.fillRect(startX, startY, graphW, graphH);
          ctx.strokeRect(startX, startY, graphW, graphH);
          
          // Label
          ctx.fillStyle = color;
          ctx.font = 'bold 10px sans-serif';
          ctx.textAlign = 'left';
          ctx.fillText(`${label} (${unit})`, startX + 5, startY + 12);
          
          // Live Value
          let val = 0;
          if (dataKey === 'x') val = currentX;
          if (dataKey === 'v') val = currentV;
          if (dataKey === 'a') val = a;
          ctx.textAlign = 'right';
          ctx.fillText(val.toFixed(2), startX + graphW - 5, startY + 12);
          
          if (historyRef.current.length < 2) { startY += graphH + gap; return; }
          
          // Plot
          ctx.beginPath();
          ctx.strokeStyle = color;
          ctx.lineWidth = 2;
          
          // Dynamic scaling
          let minV = Infinity, maxV = -Infinity;
          historyRef.current.forEach(d => {
              if (d[dataKey] < minV) minV = d[dataKey];
              if (d[dataKey] > maxV) maxV = d[dataKey];
          });
          if (Math.abs(maxV - minV) < 0.1) { maxV += 1; minV -= 1; }
          
          const timeWindow = 10; // Show last 10 seconds approx? 
          // Actually just fit whatever is in history
          const tStart = historyRef.current[0].t;
          const tEnd = historyRef.current[historyRef.current.length-1].t;
          const tRange = Math.max(0.1, tEnd - tStart);
          
          historyRef.current.forEach((d, i) => {
              const nx = (d.t - tStart) / tRange;
              const ny = (d[dataKey] - minV) / (maxV - minV);
              
              const px = startX + nx * graphW;
              const py = (startY + graphH - 5) - ny * (graphH - 20); // 5px padding bottom, 15px top
              
              if (i===0) ctx.moveTo(px, py);
              else ctx.lineTo(px, py);
          });
          ctx.stroke();
          
          startY += graphH + gap;
      };
      
      drawHUDGraph(t('position'), '#3b82f6', 'x', 'm');
      drawHUDGraph(t('velocity'), '#10b981', 'v', 'm/s');
      drawHUDGraph(t('acceleration'), '#facc15', 'a', 'm/s²');
      
      // Time Display
      ctx.fillStyle = 'white';
      ctx.font = '14px monospace';
      ctx.textAlign = 'left';
      ctx.fillText(`${t('time')}: ${t_val.toFixed(2)}s`, 20, h - 20);
  };

  const animate = () => {
      if (isRunning) { update(0.02); }
      draw();
      requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
      requestRef.current = requestAnimationFrame(animate);
      return () => { if (requestRef.current) cancelAnimationFrame(requestRef.current); };
  }, [isRunning, x0, v0, a, t]);

  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden bg-slate-950 shadow-2xl border border-slate-800">
        <canvas ref={canvasRef} width={1200} height={600} className="absolute inset-0 w-full h-full object-cover" />
        
        {/* CONTROLS */}
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
                                <div className="flex justify-between text-xs text-slate-300"><span>Init Pos ($x_0$)</span><span className="text-blue-400 font-mono">{x0} m</span></div>
                                <input type="range" min="-50" max="50" step="5" value={x0} onChange={e => {reset(); setX0(Number(e.target.value))}} className="w-full h-1.5 bg-slate-700 rounded-lg cursor-pointer accent-blue-500" />
                            </div>
                            <div className="space-y-1">
                                <div className="flex justify-between text-xs text-slate-300"><span>Init Vel ($v_0$)</span><span className="text-emerald-400 font-mono">{v0} m/s</span></div>
                                <input type="range" min="-20" max="20" step="1" value={v0} onChange={e => {reset(); setV0(Number(e.target.value))}} className="w-full h-1.5 bg-slate-700 rounded-lg cursor-pointer accent-emerald-500" />
                            </div>
                            <div className="space-y-1">
                                <div className="flex justify-between text-xs text-slate-300"><span>Accel ($a$)</span><span className="text-yellow-400 font-mono">{a} m/s²</span></div>
                                <input type="range" min="-10" max="10" step="0.5" value={a} onChange={e => {reset(); setA(Number(e.target.value))}} className="w-full h-1.5 bg-slate-700 rounded-lg cursor-pointer accent-yellow-500" />
                            </div>
                        </div>

                        <div className="w-full h-px bg-slate-700/50"></div>

                        <div className="grid grid-cols-4 gap-2">
                            <button 
                                onClick={() => setIsRunning(!isRunning)} 
                                className={`col-span-3 py-3 rounded-xl font-bold text-white shadow-lg flex items-center justify-center gap-2 transition-all active:scale-95 ${isRunning ? 'bg-amber-600 hover:bg-amber-500' : 'bg-blue-600 hover:bg-blue-500'}`}
                            >
                                {isRunning ? <Pause size={18}/> : <Play size={18}/>}
                                {isRunning ? t('pause').toUpperCase() : t('start').toUpperCase()}
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
