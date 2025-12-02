
import React, { useState, useEffect, useRef } from 'react';

export const ACCircuitSim: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [freq, setFreq] = useState(0.5); // Hz
  const [R, setR] = useState(30);
  const [L, setL] = useState(0.8); // Henry
  const [C, setC] = useState(0.008); // Farad
  
  const timeRef = useRef(0);
  const requestRef = useRef<number | null>(null);

  const draw = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      const w = canvas.width;
      const h = canvas.height;
      
      ctx.clearRect(0,0,w,h);
      
      // Physics Constants
      const omega = 2 * Math.PI * freq;
      const XL = omega * L * 50; // Visual scaling
      const XC = 1 / (omega * C * 0.05); 
      const Z = Math.sqrt(R*R + (XL - XC)**2);
      const phase = Math.atan2(XL - XC, R);
      
      const V_max = 60;
      const I_max = (V_max / Math.max(Z, 10)) * 50;

      const t = timeRef.current;
      // V = Vmax sin(wt)
      // I = Imax sin(wt - phi)
      const I_inst = I_max * Math.sin(omega * t - phase);
      
      // --- 1. Circuit Diagram (Standard Series RLC) ---
      const cx = w * 0.35;
      const cy = h * 0.4;
      const boxW = 220;
      const boxH = 150;
      const left = cx - boxW/2;
      const right = cx + boxW/2;
      const top = cy - boxH/2;
      const bot = cy + boxH/2;

      ctx.save();
      
      // Box Background
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(left - 30, top - 40, boxW + 60, boxH + 80);
      ctx.strokeStyle = '#334155';
      ctx.strokeRect(left - 30, top - 40, boxW + 60, boxH + 80);
      ctx.fillStyle = '#94a3b8';
      ctx.font = 'bold 12px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText("SERIES RLC CIRCUIT", cx, top - 25);

      // --- Wires ---
      ctx.strokeStyle = '#cbd5e1';
      ctx.lineWidth = 3;
      ctx.lineJoin = 'round';
      ctx.beginPath();
      // Loop: Source -> Top -> Resistor -> Inductor -> Capacitor -> Source
      // Layout: Source (Left), R (Top), L (Right), C (Bottom) - Common textbook layout?
      // Better: Source (Left), R-L-C in series on Top/Right/Bot?
      // Let's do Standard: Source on Left vertical. R, L, C on Top/Right/Bottom or all on Top?
      // Best visual: Source Left. R, L, C in series on Top horizontal line is standard.
      // But we need a loop. 
      // Let's do: Source Left. Top wire has R. Right wire has L. Bottom wire has C.
      
      ctx.moveTo(left, bot); 
      ctx.lineTo(left, top); // Up (Source)
      ctx.lineTo(right, top); // Across Top
      ctx.lineTo(right, bot); // Down
      ctx.lineTo(left, bot); // Across Bottom
      ctx.stroke();

      // --- Components ---
      
      // 1. AC Source (Left Vertical)
      const sourceY = (top+bot)/2;
      ctx.fillStyle = '#1e293b'; 
      ctx.fillRect(left-15, sourceY-15, 30, 30); // Clear wire behind
      ctx.beginPath(); ctx.arc(left, sourceY, 15, 0, Math.PI*2); ctx.stroke();
      // Sine wave symbol
      ctx.beginPath(); 
      ctx.moveTo(left-8, sourceY); 
      ctx.quadraticCurveTo(left-4, sourceY-8, left, sourceY); 
      ctx.quadraticCurveTo(left+4, sourceY+8, left+8, sourceY); 
      ctx.stroke();
      ctx.fillStyle = '#ef4444'; ctx.textAlign='right'; ctx.fillText("~V(t)", left-20, sourceY);
      
      // 2. Resistor (Top Horizontal)
      const rX = cx; // Middle of top
      ctx.fillStyle = '#1e293b'; ctx.fillRect(rX-20, top-10, 40, 20);
      ctx.beginPath();
      ctx.moveTo(rX-20, top);
      for(let i=0; i<4; i++) { ctx.lineTo(rX-15 + i*10, top-8); ctx.lineTo(rX-10 + i*10, top+8); }
      ctx.lineTo(rX+20, top);
      ctx.stroke();
      ctx.fillStyle = '#facc15'; ctx.textAlign='center'; ctx.fillText("R", rX, top-15);

      // 3. Inductor (Right Vertical)
      const lY = (top+bot)/2;
      ctx.fillStyle = '#1e293b'; ctx.fillRect(right-15, lY-20, 30, 40);
      ctx.beginPath();
      // Draw loops vertically
      for(let i=0; i<4; i++) {
          ctx.arc(right, lY-15 + i*10, 5, -Math.PI/2, Math.PI/2, false); 
      }
      ctx.stroke();
      ctx.fillStyle = '#3b82f6'; ctx.textAlign='left'; ctx.fillText("L", right+15, lY);

      // 4. Capacitor (Bottom Horizontal)
      const cX = cx;
      ctx.fillStyle = '#1e293b'; ctx.fillRect(cX-15, bot-15, 30, 30);
      ctx.beginPath(); ctx.moveTo(cX-5, bot-10); ctx.lineTo(cX-5, bot+10); ctx.stroke(); // Plate 1
      ctx.beginPath(); ctx.moveTo(cX+5, bot-10); ctx.lineTo(cX+5, bot+10); ctx.stroke(); // Plate 2
      ctx.fillStyle = '#ef4444'; ctx.textAlign='center'; ctx.fillText("C", cX, bot+25);
      
      // Electron Flow Animation
      if (Math.abs(I_inst) > 1) {
          const pathLen = 2 * (boxW + boxH);
          const dots = 12;
          const flowSpeed = timeRef.current * 80;
          
          ctx.fillStyle = '#fff';
          for(let i=0; i<dots; i++) {
              let pos = (i * (pathLen/dots) + (I_inst > 0 ? flowSpeed : -flowSpeed)) % pathLen;
              if (pos < 0) pos += pathLen;
              
              let dx = 0, dy = 0;
              // Map perimeter: Start Bottom-Left going UP
              if (pos < boxH) { dx = left; dy = bot - pos; } // Left Wall Up
              else if (pos < boxH + boxW) { dx = left + (pos-boxH); dy = top; } // Top Wall Right
              else if (pos < 2*boxH + boxW) { dx = right; dy = top + (pos-(boxH+boxW)); } // Right Wall Down
              else { dx = right - (pos-(2*boxH+boxW)); dy = bot; } // Bottom Wall Left
              
              ctx.beginPath(); ctx.arc(dx, dy, 2, 0, Math.PI*2); ctx.fill();
          }
      }
      
      ctx.restore();

      // --- 2. Phasor Diagram (Right) ---
      const pCx = w * 0.8;
      const pCy = h * 0.4;
      const pR_len = 80;
      
      ctx.strokeStyle = '#334155';
      ctx.beginPath(); ctx.arc(pCx, pCy, pR_len, 0, Math.PI*2); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(pCx-pR_len, pCy); ctx.lineTo(pCx+pR_len, pCy); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(pCx, pCy-pR_len); ctx.lineTo(pCx, pCy+pR_len); ctx.stroke();
      ctx.fillStyle = '#94a3b8'; ctx.textAlign = 'center'; ctx.fillText("PHASOR", pCx, pCy - pR_len - 10);
      
      // Phasor Vectors
      // Voltage V (Red) rotates at omega*t
      const angV = omega * t;
      ctx.strokeStyle = '#ef4444'; ctx.lineWidth=3;
      ctx.beginPath(); ctx.moveTo(pCx, pCy); ctx.lineTo(pCx + Math.cos(angV)*60, pCy + Math.sin(angV)*60); ctx.stroke();
      ctx.fillStyle='#ef4444'; ctx.fillText("V", pCx + Math.cos(angV)*70, pCy + Math.sin(angV)*70);

      // Current I (Blue) lags/leads by phase
      const angI = omega * t - phase;
      ctx.strokeStyle = '#3b82f6';
      ctx.beginPath(); ctx.moveTo(pCx, pCy); ctx.lineTo(pCx + Math.cos(angI)*50, pCy + Math.sin(angI)*50); ctx.stroke();
      ctx.fillStyle='#3b82f6'; ctx.fillText("I", pCx + Math.cos(angI)*60, pCy + Math.sin(angI)*60);

      // Phase Text
      ctx.fillStyle = '#fff';
      const phaseDeg = (phase * 180 / Math.PI).toFixed(0);
      ctx.fillText(`Phase φ: ${phaseDeg}°`, pCx, pCy + pR_len + 20);

      // --- 3. Graphs (Bottom) ---
      const gx = 50;
      const gy = h - 50;
      const gw = w - 100;
      const gh = 100;
      
      ctx.strokeStyle = '#475569'; ctx.lineWidth=1;
      ctx.beginPath(); ctx.moveTo(gx, gy); ctx.lineTo(gx, gy-gh); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(gx, gy - gh/2); ctx.lineTo(gx+gw, gy - gh/2); ctx.stroke();
      
      ctx.lineWidth=2;
      
      // Plot V
      ctx.beginPath(); ctx.strokeStyle='#ef4444';
      for(let x=0; x<gw; x++) {
          const simT = t - (gw-x)*0.01;
          const val = 30 * Math.sin(omega * simT);
          const py = (gy - gh/2) - val;
          if (x===0) ctx.moveTo(gx+x, py); else ctx.lineTo(gx+x, py);
      }
      ctx.stroke();

      // Plot I
      ctx.beginPath(); ctx.strokeStyle='#3b82f6';
      for(let x=0; x<gw; x++) {
          const simT = t - (gw-x)*0.01;
          const val = 20 * Math.sin(omega * simT - phase); // Normalized height
          const py = (gy - gh/2) - val;
          if (x===0) ctx.moveTo(gx+x, py); else ctx.lineTo(gx+x, py);
      }
      ctx.stroke();
      
      // Legend
      ctx.font = '10px sans-serif';
      ctx.fillStyle = '#ef4444'; ctx.fillText("Voltage (V)", gx + 10, gy - gh - 5);
      ctx.fillStyle = '#3b82f6'; ctx.fillText("Current (I)", gx + 80, gy - gh - 5);

  };
  
  const animate = () => {
      timeRef.current += 0.05;
      draw();
      requestRef.current = requestAnimationFrame(animate);
  };
  
  useEffect(() => {
      requestRef.current = requestAnimationFrame(animate);
      return () => { if(requestRef.current) cancelAnimationFrame(requestRef.current); };
  }, [freq, R, L, C]);

  return (
    <div className="flex flex-col h-full gap-4">
      <div className="relative flex-grow bg-slate-900 rounded-lg overflow-hidden border border-slate-700 shadow-xl">
         <canvas ref={canvasRef} width={800} height={500} className="w-full h-full object-contain" />
      </div>
      <div className="bg-slate-800 p-6 rounded-lg border border-slate-700 grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
           <div className="space-y-1">
            <label className="text-xs text-slate-400 font-bold uppercase">Frequency (Hz)</label>
            <input type="range" min="0.1" max="2" step="0.1" value={freq} onChange={e => setFreq(Number(e.target.value))} className="w-full accent-white" />
            <div className="text-right text-xs text-white">{freq} Hz</div>
           </div>
           <div className="space-y-1">
            <label className="text-xs text-yellow-400 font-bold uppercase">R (Resistance)</label>
            <input type="range" min="10" max="100" value={R} onChange={e => setR(Number(e.target.value))} className="w-full accent-yellow-500" />
           </div>
           <div className="space-y-1">
            <label className="text-xs text-blue-400 font-bold uppercase">L (Inductance)</label>
            <input type="range" min="0.1" max="2" step="0.1" value={L} onChange={e => setL(Number(e.target.value))} className="w-full accent-blue-500" />
           </div>
           <div className="space-y-1">
            <label className="text-xs text-red-400 font-bold uppercase">C (Capacitance)</label>
            <input type="range" min="0.001" max="0.02" step="0.001" value={C} onChange={e => setC(Number(e.target.value))} className="w-full accent-red-500" />
           </div>
      </div>
     </div>
  );
};
