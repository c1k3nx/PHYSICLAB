import React, { useState, useEffect, useRef } from 'react';
import { RefreshCw, Zap } from 'lucide-react';

export const PhotoelectricSim: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Controls
  const [wavelength, setWavelength] = useState(400); // nm
  const [intensity, setIntensity] = useState(50); // %
  const [voltage, setVoltage] = useState(0); // V
  const [metal, setMetal] = useState<'sodium' | 'zinc' | 'copper' | 'platinum'>('sodium');

  // Physics Constants
  const METALS = {
      sodium: { name: 'Sodium', wf: 2.36, color: '#fcd34d' },
      zinc: { name: 'Zinc', wf: 4.3, color: '#94a3b8' },
      copper: { name: 'Copper', wf: 4.7, color: '#fb923c' },
      platinum: { name: 'Platinum', wf: 6.35, color: '#cbd5e1' }
  };
  
  const currentMetal = METALS[metal];
  const photonE = 1240 / wavelength; // eV
  const keMax = photonE - currentMetal.wf; // eV
  
  // Simulation State
  const electronsRef = useRef<{x:number, y:number, vx:number, vy:number, stopped: boolean}[]>([]);
  const photonsRef = useRef<{x:number, y:number, t:number}[]>([]);
  const requestRef = useRef<number | null>(null);
  const ammeterRef = useRef(0);

  const draw = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      const w = canvas.width;
      const h = canvas.height;
      
      ctx.clearRect(0,0,w,h);
      ctx.fillStyle = '#0f172a'; ctx.fillRect(0,0,w,h);
      
      // --- Vacuum Tube Setup ---
      const tubeX = 100;
      const tubeY = 100;
      const tubeW = w - 200;
      const tubeH = 250;
      
      // Glass Bulb
      ctx.strokeStyle = 'rgba(255,255,255,0.2)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.ellipse(w/2, tubeY + tubeH/2, tubeW/2 + 20, tubeH/2 + 20, 0, 0, Math.PI*2);
      ctx.stroke();
      
      // Cathode (Emitter) - Left
      ctx.fillStyle = currentMetal.color;
      ctx.fillRect(tubeX + 20, tubeY + 40, 20, tubeH - 80);
      ctx.fillStyle = '#fff'; ctx.font='12px sans-serif'; ctx.fillText(currentMetal.name, tubeX, tubeY + 30);
      
      // Anode (Collector) - Right
      ctx.fillStyle = '#64748b';
      ctx.fillRect(tubeX + tubeW - 40, tubeY + 80, 10, tubeH - 160);
      ctx.fillText("Anode", tubeX + tubeW - 40, tubeY + 70);
      
      // --- Circuit ---
      const wireY = h - 80;
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 4;
      ctx.beginPath();
      
      // Left path
      ctx.moveTo(tubeX + 30, tubeY + tubeH/2);
      ctx.lineTo(tubeX + 30, wireY);
      ctx.lineTo(w/2 - 50, wireY);
      
      // Right path
      ctx.moveTo(tubeX + tubeW - 35, tubeY + tubeH/2);
      ctx.lineTo(tubeX + tubeW - 35, wireY);
      ctx.lineTo(w/2 + 50, wireY);
      ctx.stroke();
      
      // Battery
      const batX = w/2;
      const batY = wireY;
      ctx.fillStyle = '#1e293b'; ctx.fillRect(batX - 40, batY - 20, 80, 40);
      
      // Polarity visuals
      ctx.strokeStyle = voltage >= 0 ? '#4ade80' : '#f87171';
      ctx.lineWidth = 3;
      // If V>0, Anode is +, Cathode -. Right is +, Left is -.
      // Long bar on Right.
      const rH = voltage >= 0 ? 30 : 15;
      const lH = voltage >= 0 ? 15 : 30;
      
      ctx.beginPath(); ctx.moveTo(batX+10, batY-rH/2); ctx.lineTo(batX+10, batY+rH/2); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(batX-10, batY-lH/2); ctx.lineTo(batX-10, batY+lH/2); ctx.stroke();
      
      ctx.fillStyle = '#fff'; ctx.textAlign = 'center';
      ctx.fillText(`${voltage.toFixed(1)}V`, batX, batY + 35);
      
      // Ammeter
      const amX = tubeX + tubeW - 35;
      const amY = (tubeY + tubeH/2 + wireY)/2;
      ctx.fillStyle = '#1e293b'; ctx.beginPath(); ctx.arc(amX, amY, 25, 0, Math.PI*2); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#38bdf8'; ctx.font='bold 14px monospace';
      // Smooth out reading
      const currentI = electronsRef.current.filter(e => e.x > tubeX + tubeW - 50).length; // instantaneous flow check roughly
      ammeterRef.current = ammeterRef.current * 0.9 + (currentI * 0.5) * 0.1; 
      
      ctx.fillText(`${ammeterRef.current.toFixed(1)}μA`, amX, amY + 5);

      // --- Light Source ---
      const hue = 280 - ((wavelength - 200) / 600) * 280;
      const lightColor = `hsl(${hue}, 100%, 70%)`;
      
      // Lamp
      ctx.shadowBlur = 20; ctx.shadowColor = lightColor;
      ctx.fillStyle = lightColor;
      ctx.beginPath(); ctx.arc(tubeX - 40, tubeY - 20, 15, 0, Math.PI*2); ctx.fill();
      ctx.shadowBlur = 0;
      
      // Photons (Wavy lines)
      ctx.strokeStyle = lightColor;
      ctx.lineWidth = 2;
      photonsRef.current.forEach(p => {
          ctx.beginPath();
          // Draw wave packet
          for(let i=0; i<20; i++) {
              const wx = p.x + i;
              const wy = p.y + Math.sin((i + p.t)*0.5) * 5;
              if (i===0) ctx.moveTo(wx, wy); else ctx.lineTo(wx, wy);
          }
          ctx.stroke();
      });

      // Electrons
      electronsRef.current.forEach(e => {
          ctx.fillStyle = '#fbbf24';
          ctx.beginPath(); ctx.arc(e.x, e.y, 3, 0, Math.PI*2); ctx.fill();
      });
  };

  const animate = () => {
      // 1. Spawn Photons
      if (Math.random() < intensity * 0.005) {
          photonsRef.current.push({
              x: 80,
              y: 150 + Math.random() * 150,
              t: 0
          });
      }
      
      // 2. Move Photons
      const photonSpeed = 8;
      let hits = 0;
      const hitY: number[] = [];
      
      const nextPhotons: any[] = [];
      photonsRef.current.forEach(p => {
          p.x += photonSpeed * 0.7; // Angle down
          p.y += photonSpeed * 0.3;
          p.t += 1;
          
          if (p.x > 120 && p.x < 140 && p.y > 140 && p.y < 350) {
              // Hit Cathode
              hits++;
              hitY.push(p.y);
          } else if (p.x < 800 && p.y < 500) {
              nextPhotons.push(p);
          }
      });
      photonsRef.current = nextPhotons;
      
      // 3. Emit Electrons
      // Only if Energy > Work Function
      if (hits > 0 && keMax > 0) {
          for(let i=0; i<hits; i++) {
              // Initial Velocity v = sqrt(2K/m). 
              // Visual scale: max KE of 5eV maps to speed 10
              const vMag = Math.sqrt(keMax) * 3; 
              
              electronsRef.current.push({
                  x: 140,
                  y: hitY[i],
                  vx: vMag * (0.8 + Math.random()*0.4), // Some randomness
                  vy: (Math.random()-0.5) * 2,
                  stopped: false
              });
          }
      }
      
      // 4. Move Electrons (Electric Field Physics)
      const nextElec: any[] = [];
      electronsRef.current.forEach(e => {
          // Accel a ~ V
          // If V > 0, accel + (right)
          // If V < 0, accel - (left, stopping)
          const ax = voltage * 0.2;
          
          e.vx += ax;
          e.x += e.vx;
          e.y += e.vy;
          
          // Collision with Anode
          const anodeX = canvasRef.current!.width - 200 + (canvasRef.current!.width - 200)/2 - 50; // Approx from drawing coords
          // Re-calc anode X from draw func: tubeX + tubeW - 40
          // tubeX=100, tubeW=w-200. AnodeX = w - 100 - 40 = w - 140.
          const anodeX_real = canvasRef.current!.width - 140;
          
          if (e.x >= anodeX_real) {
              // Absorbed (Current flows)
          } else if (e.x < 140 && e.vx < 0) {
              // Returned to cathode (Stopped)
          } else {
              nextElec.push(e);
          }
      });
      electronsRef.current = nextElec;
      
      draw();
      requestRef.current = requestAnimationFrame(animate);
  };
  
  useEffect(() => {
      requestRef.current = requestAnimationFrame(animate);
      return () => { if(requestRef.current) cancelAnimationFrame(requestRef.current); };
  }, [wavelength, intensity, voltage, metal]);

  return (
    <div className="flex flex-col h-full gap-4">
      <div className="flex gap-4 h-full min-h-0">
          <div className="flex-grow relative bg-slate-900 rounded-xl overflow-hidden border border-slate-700 shadow-xl">
            <canvas ref={canvasRef} width={800} height={500} className="w-full h-full object-contain" />
          </div>
          
          {/* Energy Diagram / Data Panel */}
          <div className="w-64 bg-slate-800 rounded-xl border border-slate-700 p-4 flex flex-col gap-4 shadow-lg">
              <div className="text-center border-b border-slate-600 pb-2">
                  <div className="text-xs font-bold text-slate-400 uppercase">Target Metal</div>
                  <div className="flex gap-2 justify-center mt-2">
                      {Object.keys(METALS).map(m => (
                          <button 
                            key={m}
                            onClick={() => setMetal(m as any)}
                            className={`w-8 h-8 rounded-full border-2 transition-all ${metal===m ? 'border-blue-500 scale-110' : 'border-transparent opacity-50'}`}
                            style={{ backgroundColor: METALS[m as keyof typeof METALS].color }}
                            title={METALS[m as keyof typeof METALS].name}
                          />
                      ))}
                  </div>
                  <div className="text-sm font-bold text-white mt-1">{currentMetal.name}</div>
                  <div className="text-xs text-slate-500">Φ = {currentMetal.wf} eV</div>
              </div>
              
              <div className="space-y-2">
                  <div className="flex justify-between text-xs text-slate-400">
                      <span>Photon Energy (hf)</span>
                      <span className="text-white">{photonE.toFixed(2)} eV</span>
                  </div>
                  <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden">
                      <div className="bg-blue-500 h-full" style={{ width: `${Math.min(100, photonE*10)}%` }}></div>
                  </div>
                  
                  <div className="flex justify-between text-xs text-slate-400 mt-2">
                      <span>Max KE (Kmax)</span>
                      <span className={keMax > 0 ? "text-green-400" : "text-red-400"}>
                          {keMax > 0 ? keMax.toFixed(2) : '0.00'} eV
                      </span>
                  </div>
                  
                  {keMax <= 0 && (
                      <div className="bg-red-500/20 text-red-400 text-xs p-2 rounded text-center font-bold border border-red-500/30">
                          NO EMISSION<br/>(hf &lt; Φ)
                      </div>
                  )}
              </div>
          </div>
      </div>
      
      <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 grid grid-cols-1 md:grid-cols-3 gap-8 items-end">
           <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-slate-400">Wavelength (λ)</label>
            <input type="range" min="200" max="800" value={wavelength} onChange={e => setWavelength(Number(e.target.value))} className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer" />
            <div className="flex justify-between text-xs font-mono font-bold" style={{ color: `hsl(${280 - ((wavelength - 200) / 600) * 280}, 100%, 70%)` }}>
                <span>UV</span>
                <span className="text-lg">{wavelength} nm</span>
                <span>IR</span>
            </div>
           </div>
           
           <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-slate-400">Stopping Potential (V)</label>
            <input type="range" min="-5" max="5" step="0.1" value={voltage} onChange={e => setVoltage(Number(e.target.value))} className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-green-500" />
            <div className="text-right font-mono text-green-400">{voltage.toFixed(1)} V</div>
           </div>
           
           <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-slate-400">Light Intensity</label>
            <input type="range" min="0" max="100" value={intensity} onChange={e => setIntensity(Number(e.target.value))} className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-yellow-500" />
            <div className="text-right font-mono text-yellow-400">{intensity}%</div>
           </div>
      </div>
     </div>
  );
};