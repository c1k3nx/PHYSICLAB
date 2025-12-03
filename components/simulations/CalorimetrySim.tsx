
import React, { useState, useEffect, useRef } from 'react';
import { Flame, RefreshCw, Activity, Settings2, ChevronUp, ChevronDown } from 'lucide-react';
import { useGlobal } from '../../contexts/GlobalContext';

export const CalorimetrySim: React.FC = () => {
  const graphRef = useRef<HTMLCanvasElement>(null);
  const { t } = useGlobal();
  const [massWater, setMassWater] = useState(200); 
  const [tempWater, setTempWater] = useState(20); 
  const [massBlock, setMassBlock] = useState(100); 
  const [tempBlock, setTempBlock] = useState(100); 
  const [isMixed, setIsMixed] = useState(false);
  const [time, setTime] = useState(0);
  const [showControls, setShowControls] = useState(true);
  
  const [currentTempWater, setCurrentTempWater] = useState(20);
  const [currentTempBlock, setCurrentTempBlock] = useState(100);
  const [equilibriumTemp, setEquilibriumTemp] = useState(0);
  const requestRef = useRef<number | null>(null);

  const reset = () => { setIsMixed(false); setTime(0); setCurrentTempWater(tempWater); setCurrentTempBlock(tempBlock); };

  const startMix = () => {
      const c_water = 4.18; const c_block = 0.9;
      const num = (massBlock * c_block * tempBlock) + (massWater * c_water * tempWater);
      const den = (massBlock * c_block) + (massWater * c_water);
      setEquilibriumTemp(num/den);
      setCurrentTempWater(tempWater); setCurrentTempBlock(tempBlock); setTime(0); setIsMixed(true);
  };

  const animate = () => {
      if (isMixed) {
          setTime(t => t + 0.2); 
          const k = 0.02; 
          setCurrentTempWater(prev => { const diff = equilibriumTemp - prev; if (Math.abs(diff) < 0.01) return equilibriumTemp; return prev + diff * k; });
          setCurrentTempBlock(prev => { const diff = equilibriumTemp - prev; if (Math.abs(diff) < 0.01) return equilibriumTemp; return prev + diff * k; });
      }
      drawGraph();
      requestRef.current = requestAnimationFrame(animate);
  };
  
  useEffect(() => { requestRef.current = requestAnimationFrame(animate); return () => { if(requestRef.current) cancelAnimationFrame(requestRef.current); }; }, [isMixed, equilibriumTemp, time, t]);

  const drawGraph = () => {
      const canvas = graphRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      const w = canvas.width; const h = canvas.height;
      ctx.clearRect(0,0,w,h); ctx.fillStyle = '#1e293b'; ctx.fillRect(0,0,w,h);
      
      const pad = 40;
      ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(pad, pad); ctx.lineTo(pad, h-pad); ctx.lineTo(w-pad, h-pad); ctx.stroke();
      ctx.fillStyle = '#fff'; ctx.font = '10px sans-serif'; ctx.fillText(t('temp_axis'), 5, pad); ctx.fillText(t('time_axis'), w-pad, h-10);

      if (!isMixed && time === 0) return;
      const maxTime = 100; const maxTemp = Math.max(tempBlock, tempWater) + 20;
      const mapX = (t: number) => pad + (t / maxTime) * (w - 2*pad);
      const mapY = (T: number) => (h - pad) - (T / maxTemp) * (h - 2*pad);
      const plotEnd = Math.min(time, maxTime);
      
      ctx.beginPath(); ctx.strokeStyle = '#3b82f6'; ctx.lineWidth = 3;
      for(let t=0; t<=plotEnd; t+=0.5) { const val = equilibriumTemp + (tempWater - equilibriumTemp) * Math.exp(-0.1 * t); if (t===0) ctx.moveTo(mapX(t), mapY(val)); else ctx.lineTo(mapX(t), mapY(val)); }
      ctx.stroke();

      ctx.beginPath(); ctx.strokeStyle = '#f97316';
      for(let t=0; t<=plotEnd; t+=0.5) { const val = equilibriumTemp + (tempBlock - equilibriumTemp) * Math.exp(-0.1 * t); if (t===0) ctx.moveTo(mapX(t), mapY(val)); else ctx.lineTo(mapX(t), mapY(val)); }
      ctx.stroke();
      
      if (time > 10) {
          ctx.strokeStyle = '#10b981'; ctx.setLineDash([5,5]); ctx.lineWidth=1;
          const yEq = mapY(equilibriumTemp);
          ctx.beginPath(); ctx.moveTo(pad, yEq); ctx.lineTo(w-pad, yEq); ctx.stroke(); ctx.setLineDash([]);
          ctx.fillStyle = '#10b981'; ctx.fillText(`${t('equilibrium_temp')}: ${equilibriumTemp.toFixed(1)}°C`, w-90, yEq-5);
      }
  };

  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden bg-slate-950 shadow-2xl border border-slate-800 flex">
      {/* Visual */}
      <div className="flex-grow relative flex items-center justify-center">
           <div className="relative w-48 h-64 border-x-4 border-b-4 border-slate-500 rounded-b-xl bg-slate-800/30 flex items-end justify-center">
               <div className="w-full bg-blue-500/50 transition-all duration-500 absolute bottom-0" style={{ height: `${Math.min(massWater/5 + (isMixed ? massBlock/10 : 0), 90)}%` }}></div>
               <div className={`w-20 h-20 rounded shadow-lg flex items-center justify-center transition-all duration-1000 z-10 font-bold text-white border-2 border-white/20 ${isMixed ? 'mb-4' : 'mb-[200px]'}`}
                style={{ backgroundColor: isMixed ? `rgb(${249 - (249-59)*(currentTempBlock/200)}, ${115 + (130-115)*(currentTempBlock/200)}, ${22 + (246-22)*(currentTempBlock/200)})` : '#f97316' }}>
                   {currentTempBlock.toFixed(0)}°
               </div>
           </div>
           <div className="absolute bottom-4 right-4 text-blue-400 font-bold bg-slate-800/80 px-2 py-1 rounded">{t('water_label')}: {currentTempWater.toFixed(1)}°C</div>
      </div>
      
      {/* Graph HUD */}
      <div className="absolute top-4 right-4 w-64 h-48 bg-slate-900 rounded-xl border border-slate-700 shadow-xl overflow-hidden pointer-events-none">
          <div className="absolute top-2 left-2 text-[10px] text-slate-400 font-bold uppercase flex items-center gap-1 z-10"><Activity size={12}/> {t('temp_plot')}</div>
          <canvas ref={graphRef} width={256} height={192} className="w-full h-full object-contain bg-slate-800" />
      </div>

      {/* CONTROLS */}
      <div className={`absolute top-4 left-4 transition-all duration-300 z-10 ${showControls ? 'w-80' : 'w-12'}`}>
            <div className="bg-slate-900/90 backdrop-blur-md border border-slate-700/50 rounded-2xl shadow-2xl overflow-hidden">
                <button onClick={() => setShowControls(!showControls)} className="w-full p-3 flex items-center justify-between text-slate-300 hover:bg-slate-800 transition-colors border-b border-slate-700/50">
                    {showControls ? <span className="text-xs font-bold uppercase tracking-widest flex items-center gap-2"><Settings2 size={14} className="text-blue-400"/> {t('control_center')}</span> : <Settings2 size={20} className="mx-auto text-blue-400"/>}
                    {showControls && (showControls ? <ChevronUp size={14}/> : <ChevronDown size={14}/>)}
                </button>

                {showControls && (
                    <div className="p-5 space-y-6">
                        <div className="space-y-4">
                            <div className="space-y-1">
                                <div className="flex justify-between text-xs text-blue-400 font-bold">{t('water_mass')} (g)</div>
                                <input type="range" min="100" max="500" value={massWater} onChange={e => {reset(); setMassWater(Number(e.target.value))}} className="w-full h-1.5 bg-slate-700 rounded-lg accent-blue-500" />
                            </div>
                            <div className="space-y-1">
                                <div className="flex justify-between text-xs text-blue-400 font-bold">{t('water_temp')} ({tempWater}°C)</div>
                                <input type="range" min="0" max="50" value={tempWater} onChange={e => {reset(); setTempWater(Number(e.target.value))}} className="w-full h-1.5 bg-slate-700 rounded-lg accent-blue-500" />
                            </div>
                            <div className="space-y-1">
                                <div className="flex justify-between text-xs text-orange-400 font-bold">{t('block_mass')} (g)</div>
                                <input type="range" min="50" max="500" value={massBlock} onChange={e => {reset(); setMassBlock(Number(e.target.value))}} className="w-full h-1.5 bg-slate-700 rounded-lg accent-orange-500" />
                            </div>
                            <div className="space-y-1">
                                <div className="flex justify-between text-xs text-orange-400 font-bold">{t('block_temp')} ({tempBlock}°C)</div>
                                <input type="range" min="50" max="200" value={tempBlock} onChange={e => {reset(); setTempBlock(Number(e.target.value))}} className="w-full h-1.5 bg-slate-700 rounded-lg accent-orange-500" />
                            </div>
                        </div>
                        <div className="w-full h-px bg-slate-700/50"></div>
                        {isMixed ? (
                            <button onClick={reset} className="w-full py-3 bg-slate-600 rounded-lg font-bold text-white flex items-center justify-center gap-2 shadow-lg hover:bg-slate-500">
                                <RefreshCw size={18}/> {t('reset_lab')}
                            </button>
                        ) : (
                            <button onClick={startMix} className="w-full py-3 bg-gradient-to-r from-orange-500 to-red-600 rounded-lg font-bold text-white shadow-lg hover:scale-105 transition-transform flex items-center justify-center gap-2">
                                <Flame size={18}/> {t('drop_block')}
                            </button>
                        )}
                    </div>
                )}
            </div>
         </div>
    </div>
  );
};
