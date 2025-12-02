
import React, { useState, useEffect, useRef } from 'react';
import { Flame, RefreshCw, Activity } from 'lucide-react';

export const CalorimetrySim: React.FC = () => {
  const graphRef = useRef<HTMLCanvasElement>(null);
  
  const [massWater, setMassWater] = useState(200); 
  const [tempWater, setTempWater] = useState(20); 
  const [massBlock, setMassBlock] = useState(100); 
  const [tempBlock, setTempBlock] = useState(100); 
  
  const [isMixed, setIsMixed] = useState(false);
  const [time, setTime] = useState(0);
  
  // Real-time State
  const [currentTempWater, setCurrentTempWater] = useState(20);
  const [currentTempBlock, setCurrentTempBlock] = useState(100);
  const [equilibriumTemp, setEquilibriumTemp] = useState(0);

  const requestRef = useRef<number | null>(null);

  const reset = () => {
      setIsMixed(false);
      setTime(0);
      setCurrentTempWater(tempWater);
      setCurrentTempBlock(tempBlock);
  };

  const startMix = () => {
      const c_water = 4.18;
      const c_block = 0.9;
      const num = (massBlock * c_block * tempBlock) + (massWater * c_water * tempWater);
      const den = (massBlock * c_block) + (massWater * c_water);
      setEquilibriumTemp(num/den);
      
      setCurrentTempWater(tempWater);
      setCurrentTempBlock(tempBlock);
      setTime(0);
      setIsMixed(true);
  };

  const animate = () => {
      if (isMixed) {
          setTime(t => t + 0.2); // Advance time
          
          const k = 0.02; // Cooling constant
          
          setCurrentTempWater(prev => {
              const diff = equilibriumTemp - prev;
              if (Math.abs(diff) < 0.01) return equilibriumTemp;
              return prev + diff * k;
          });
          
          setCurrentTempBlock(prev => {
              const diff = equilibriumTemp - prev;
              if (Math.abs(diff) < 0.01) return equilibriumTemp;
              return prev + diff * k;
          });
      }
      
      drawGraph();
      requestRef.current = requestAnimationFrame(animate);
  };
  
  useEffect(() => {
      requestRef.current = requestAnimationFrame(animate);
      return () => { if(requestRef.current) cancelAnimationFrame(requestRef.current); };
  }, [isMixed, equilibriumTemp, time]);

  const drawGraph = () => {
      const canvas = graphRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      
      const w = canvas.width;
      const h = canvas.height;
      
      ctx.clearRect(0,0,w,h);
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(0,0,w,h);
      
      // Axes
      const pad = 40;
      ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(pad, pad); ctx.lineTo(pad, h-pad); ctx.lineTo(w-pad, h-pad);
      ctx.stroke();
      
      // Labels
      ctx.fillStyle = '#fff';
      ctx.font = '10px sans-serif';
      ctx.fillText("Temp (°C)", 5, pad);
      ctx.fillText("Time", w-pad, h-10);

      // We plot the theoretical curve up to current 'time'
      if (!isMixed && time === 0) return;

      const maxTime = 100;
      const maxTemp = Math.max(tempBlock, tempWater) + 20;
      
      const mapX = (t: number) => pad + (t / maxTime) * (w - 2*pad);
      const mapY = (T: number) => (h - pad) - (T / maxTemp) * (h - 2*pad);
      
      // Plot Loop
      const plotEnd = Math.min(time, maxTime);
      
      // Water (Blue)
      ctx.beginPath();
      ctx.strokeStyle = '#3b82f6'; ctx.lineWidth = 3;
      for(let t=0; t<=plotEnd; t+=0.5) {
          // T(t) formula matches animate logic logic
          // T(t) = T_eq + (T0 - T_eq) * e^(-kt/step)
          // Simplified exponential approach for viz
          const val = equilibriumTemp + (tempWater - equilibriumTemp) * Math.exp(-0.1 * t);
          if (t===0) ctx.moveTo(mapX(t), mapY(val));
          else ctx.lineTo(mapX(t), mapY(val));
      }
      ctx.stroke();

      // Block (Orange)
      ctx.beginPath();
      ctx.strokeStyle = '#f97316';
      for(let t=0; t<=plotEnd; t+=0.5) {
          const val = equilibriumTemp + (tempBlock - equilibriumTemp) * Math.exp(-0.1 * t);
          if (t===0) ctx.moveTo(mapX(t), mapY(val));
          else ctx.lineTo(mapX(t), mapY(val));
      }
      ctx.stroke();
      
      // Equilibrium Line
      if (time > 10) {
          ctx.strokeStyle = '#10b981'; ctx.setLineDash([5,5]); ctx.lineWidth=1;
          const yEq = mapY(equilibriumTemp);
          ctx.beginPath(); ctx.moveTo(pad, yEq); ctx.lineTo(w-pad, yEq); ctx.stroke();
          ctx.setLineDash([]);
          ctx.fillStyle = '#10b981'; ctx.fillText(`Eq: ${equilibriumTemp.toFixed(1)}°C`, w-90, yEq-5);
      }
  };

  return (
    <div className="flex flex-col h-full gap-4">
      <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-4 h-full min-h-0">
          
          {/* Visual */}
          <div className="relative bg-slate-900 rounded-lg border border-slate-700 p-4 flex items-center justify-center overflow-hidden shadow-inner">
               <div className="relative w-48 h-64 border-x-4 border-b-4 border-slate-500 rounded-b-xl bg-slate-800/30 flex items-end justify-center">
                   <div 
                    className="w-full bg-blue-500/50 transition-all duration-500 absolute bottom-0"
                    style={{ height: `${Math.min(massWater/5 + (isMixed ? massBlock/10 : 0), 90)}%` }}
                   ></div>
                   
                   <div 
                    className={`w-20 h-20 rounded shadow-lg flex items-center justify-center transition-all duration-1000 z-10 font-bold text-white border-2 border-white/20 ${isMixed ? 'mb-4' : 'mb-[200px]'}`}
                    style={{
                        backgroundColor: isMixed 
                            ? `rgb(${249 - (249-59)*(currentTempBlock/200)}, ${115 + (130-115)*(currentTempBlock/200)}, ${22 + (246-22)*(currentTempBlock/200)})` 
                            : '#f97316'
                    }}
                   >
                       {currentTempBlock.toFixed(0)}°
                   </div>
               </div>
               <div className="absolute bottom-4 right-4 text-blue-400 font-bold bg-slate-800/80 px-2 py-1 rounded">
                   Water: {currentTempWater.toFixed(1)}°C
               </div>
          </div>
          
          {/* Graph */}
          <div className="bg-slate-900 rounded-lg border border-slate-700 p-2 flex flex-col">
              <div className="text-xs font-bold text-slate-400 uppercase mb-2 flex items-center gap-2">
                  <Activity size={14}/> Real-time Plot
              </div>
              <canvas ref={graphRef} width={400} height={300} className="w-full h-full object-contain bg-slate-800 rounded" />
          </div>
      </div>
      
      <div className="bg-slate-800 p-6 rounded-lg border border-slate-700 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-end">
           <div className="space-y-1">
               <div className="text-blue-400 font-bold uppercase text-xs">Water Mass (g)</div>
               <input type="range" min="100" max="500" value={massWater} onChange={e => {reset(); setMassWater(Number(e.target.value))}} className="w-full accent-blue-500" />
           </div>
           <div className="space-y-1">
               <div className="text-blue-400 font-bold uppercase text-xs">Water Temp ({tempWater}°C)</div>
               <input type="range" min="0" max="50" value={tempWater} onChange={e => {reset(); setTempWater(Number(e.target.value))}} className="w-full accent-blue-500" />
           </div>
           <div className="space-y-1">
               <div className="text-orange-400 font-bold uppercase text-xs">Block Mass (g)</div>
               <input type="range" min="50" max="500" value={massBlock} onChange={e => {reset(); setMassBlock(Number(e.target.value))}} className="w-full accent-orange-500" />
           </div>
           <div className="space-y-1">
               <div className="text-orange-400 font-bold uppercase text-xs">Block Temp ({tempBlock}°C)</div>
               <input type="range" min="50" max="200" value={tempBlock} onChange={e => {reset(); setTempBlock(Number(e.target.value))}} className="w-full accent-orange-500" />
           </div>
           
           <div className="lg:col-span-4 flex justify-center gap-4">
               {isMixed ? (
                   <button onClick={reset} className="px-8 py-3 bg-slate-600 rounded-xl font-bold text-white flex items-center gap-2 shadow-lg hover:bg-slate-500">
                       <RefreshCw size={18}/> RESET LAB
                   </button>
               ) : (
                   <button onClick={startMix} className="px-8 py-3 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl font-bold text-white shadow-lg hover:scale-105 transition-transform flex items-center gap-2">
                       <Flame size={18}/> DROP BLOCK
                   </button>
               )}
           </div>
      </div>
     </div>
  );
};
