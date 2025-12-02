
import React, { useState, useEffect, useRef } from 'react';
import { Trash2, Battery, Zap, Lightbulb, RotateCw, MousePointer2, Activity } from 'lucide-react';
import { useGlobal } from '../../contexts/GlobalContext';

type ComponentType = 'wire' | 'resistor' | 'bulb' | 'battery' | 'switch' | 'voltmeter';

interface Node {
    id: string;
    x: number;
    y: number;
    v: number;
}

interface Component {
    id: string;
    type: ComponentType;
    n1: string;
    n2: string;
    value: number;
    isOpen?: boolean;
}

export const OhmSim: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { t } = useGlobal();
  const [nodes, setNodes] = useState<Node[]>([]);
  const [comps, setComps] = useState<Component[]>([]);
  const [selectedTool, setSelectedTool] = useState<ComponentType | 'select' | 'voltmeter'>('select');
  const [selection, setSelection] = useState<string | null>(null);
  
  // Probes for Voltmeter
  const [probes, setProbes] = useState<{red: {x:number, y:number, nodeId?:string}, black: {x:number, y:number, nodeId?:string}}>({
      red: {x: 600, y: 100},
      black: {x: 600, y: 200}
  });
  const [activeProbe, setActiveProbe] = useState<'red' | 'black' | null>(null);

  // Interaction
  const [dragStartNode, setDragStartNode] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState({x:0, y:0});
  
  // Animation state
  const electronOffset = useRef(0);
  const GRID = 40;
  
  useEffect(() => {
    const interval = setInterval(() => solveCircuit(), 50);
    return () => clearInterval(interval);
  }, [comps, nodes]);

  const solveCircuit = () => {
      const battery = comps.find(c => c.type === 'battery');
      const groundId = battery ? battery.n2 : nodes[0]?.id;
      
      const newV = new Map<string, number>();
      nodes.forEach(n => newV.set(n.id, n.v));
      
      if (!groundId) return;
      
      for(let i=0; i<100; i++) {
          newV.set(groundId, 0);
          comps.filter(c => c.type === 'battery').forEach(b => {
              if (b.n2 === groundId) newV.set(b.n1, b.value);
              else if (b.n1 === groundId) newV.set(b.n2, -b.value);
          });
          
          nodes.forEach(n => {
              if (n.id === groundId) return;
              const bat = comps.find(c => c.type === 'battery' && (c.n1 === n.id || c.n2 === n.id));
              if (bat) {
                   const other = bat.n1 === n.id ? bat.n2 : bat.n1;
                   if (other === groundId) return;
                   const val = bat.n1 === n.id ? bat.value : -bat.value;
                   newV.set(n.id, (newV.get(other)||0) + val);
                   return;
              }

              let num = 0, den = 0;
              comps.forEach(c => {
                  if ((c.n1 !== n.id && c.n2 !== n.id) || (c.type === 'switch' && c.isOpen)) return;
                  const otherId = c.n1 === n.id ? c.n2 : c.n1;
                  const vOther = newV.get(otherId) || 0;
                  
                  let g = 0; 
                  if (c.type === 'wire' || c.type === 'switch') g = 1000;
                  else if (c.type === 'resistor' || c.type === 'bulb') g = 1 / c.value;
                  else if (c.type === 'battery') g = 0;
                  
                  num += vOther * g;
                  den += g;
              });
              if (den > 0) newV.set(n.id, num/den);
          });
      }
      setNodes(prev => prev.map(n => ({...n, v: newV.get(n.id) || 0})));
  };

  const drawBulb = (ctx: CanvasRenderingContext2D, len: number, active: boolean, power: number) => {
      ctx.beginPath(); ctx.moveTo(-len/2, 0); ctx.lineTo(-15, 0); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(15, 0); ctx.lineTo(len/2, 0); ctx.stroke();
      
      const brightness = Math.min(1, power / 100); // Visual scaling
      const glowSize = 15 + brightness * 30;

      if (active) {
          const grad = ctx.createRadialGradient(0,0, 10, 0,0, glowSize);
          grad.addColorStop(0, `rgba(250, 204, 21, ${brightness})`);
          grad.addColorStop(1, 'rgba(250, 204, 21, 0)');
          ctx.fillStyle = grad;
          ctx.beginPath(); ctx.arc(0, 0, glowSize, 0, Math.PI*2); ctx.fill();
      }

      ctx.fillStyle = active ? '#facc15' : 'transparent';
      ctx.strokeStyle = active ? '#facc15' : '#94a3b8';
      ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(0, 0, 15, 0, Math.PI*2); ctx.fill(); ctx.stroke();
      
      ctx.beginPath(); ctx.moveTo(-10, 5); ctx.lineTo(-5, -5); ctx.lineTo(5, 5); ctx.lineTo(10, -5); ctx.stroke();
  };

  const drawResistor = (ctx: CanvasRenderingContext2D, len: number) => {
      ctx.beginPath(); ctx.moveTo(-len/2, 0); ctx.lineTo(-20, 0);
      for(let i=0; i<6; i++) {
          const x = -20 + (40/6)*i;
          const y = i%2===0 ? -8 : 8;
          ctx.lineTo(x + 3, y);
      }
      ctx.lineTo(20, 0); ctx.lineTo(len/2, 0); ctx.stroke();
  };

  const drawBattery = (ctx: CanvasRenderingContext2D, len: number) => {
      ctx.beginPath(); ctx.moveTo(-len/2, 0); ctx.lineTo(-10, 0); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(10, 0); ctx.lineTo(len/2, 0); ctx.stroke();
      ctx.beginPath(); ctx.strokeStyle='#4ade80'; ctx.lineWidth=4; ctx.moveTo(-6, -15); ctx.lineTo(-6, 15); ctx.stroke(); 
      ctx.beginPath(); ctx.strokeStyle='#fff'; ctx.lineWidth=4; ctx.moveTo(6, -8); ctx.lineTo(6, 8); ctx.stroke();
  };

  const drawSwitch = (ctx: CanvasRenderingContext2D, len: number, isOpen: boolean) => {
      ctx.beginPath(); ctx.moveTo(-len/2, 0); ctx.lineTo(-15, 0); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(15, 0); ctx.lineTo(len/2, 0); ctx.stroke();
      ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(-15, 0, 3, 0, Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.arc(15, 0, 3, 0, Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.lineWidth = 3;
      if (isOpen) { ctx.moveTo(-15, 0); ctx.lineTo(12, -15); } else { ctx.moveTo(-15, 0); ctx.lineTo(15, 0); }
      ctx.stroke();
  };

  const draw = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.clearRect(0,0, canvas.width, canvas.height);
      
      // Grid
      ctx.fillStyle = '#1e293b';
      for(let x=0; x<canvas.width; x+=GRID) {
          for(let y=0; y<canvas.height; y+=GRID) {
              ctx.beginPath(); ctx.arc(x,y, 1, 0, Math.PI*2); ctx.fill();
          }
      }

      comps.forEach(c => {
          const n1 = nodes.find(n => n.id === c.n1);
          const n2 = nodes.find(n => n.id === c.n2);
          if (!n1 || !n2) return;
          
          const cx = (n1.x + n2.x)/2;
          const cy = (n1.y + n2.y)/2;
          const len = Math.hypot(n2.x - n1.x, n2.y - n1.y);
          const angle = Math.atan2(n2.y - n1.y, n2.x - n1.x);
          
          ctx.save();
          ctx.translate(cx, cy);
          ctx.rotate(angle);
          
          if (selection === c.id) {
              ctx.shadowColor = 'rgba(59, 130, 246, 0.8)'; ctx.shadowBlur = 15;
          }
          
          ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 3; ctx.lineCap = 'round'; ctx.lineJoin = 'round';

          switch(c.type) {
              case 'wire': ctx.beginPath(); ctx.moveTo(-len/2, 0); ctx.lineTo(len/2, 0); ctx.stroke(); break;
              case 'resistor': drawResistor(ctx, len); break;
              case 'battery': drawBattery(ctx, len); break;
              case 'bulb': 
                  const vDiff = Math.abs(n1.v - n2.v);
                  const power = (vDiff*vDiff) / c.value;
                  drawBulb(ctx, len, power > 0.1, power * 50); 
                  break;
              case 'switch': drawSwitch(ctx, len, !!c.isOpen); break;
          }
          
          // Electron Flow
          const vDiff = n1.v - n2.v;
          const currentMag = Math.abs(vDiff / (c.type === 'wire' ? 0.01 : c.value));
          if (currentMag > 0.1 && (!c.isOpen)) {
              ctx.fillStyle = '#facc15';
              const speed = Math.min(currentMag, 5);
              const dir = Math.sign(vDiff);
              const spacing = 20;
              const offset = (electronOffset.current * speed * dir) % spacing;
              for(let x = -len/2 + 5; x < len/2 - 5; x+=spacing) {
                  let px = x + offset;
                  if (dir === 1 && px > len/2) px -= len;
                  if (dir === -1 && px < -len/2) px += len;
                  if (c.type !== 'wire' && Math.abs(px) < 25) continue; 
                  ctx.beginPath(); ctx.arc(px, 0, 2, 0, Math.PI*2); ctx.fill();
              }
          }
          ctx.restore();
      });

      // Nodes
      nodes.forEach(n => {
          ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(n.x, n.y, 4, 0, Math.PI*2); ctx.fill();
      });
      
      // Dragging Wire Line
      if (dragStartNode) {
          const start = nodes.find(n => n.id === dragStartNode);
          if (start) {
              const sx = Math.round(mousePos.x/GRID)*GRID;
              const sy = Math.round(mousePos.y/GRID)*GRID;
              ctx.strokeStyle = '#fff'; ctx.setLineDash([5,5]); ctx.lineWidth=2;
              ctx.beginPath(); ctx.moveTo(start.x, start.y); ctx.lineTo(sx, sy); ctx.stroke();
              ctx.setLineDash([]);
          }
      }

      // Voltmeter Probes
      if (selectedTool === 'voltmeter') {
          // Draw Multimeter Box
          const boxX = 650; const boxY = 50;
          ctx.fillStyle = '#1e293b'; ctx.fillRect(boxX, boxY, 120, 150);
          ctx.strokeStyle = '#facc15'; ctx.lineWidth=2; ctx.strokeRect(boxX, boxY, 120, 150);
          
          // Screen
          ctx.fillStyle = '#172554'; ctx.fillRect(boxX+10, boxY+10, 100, 40);
          ctx.fillStyle = '#fff'; ctx.font='bold 20px monospace'; ctx.textAlign='right';
          
          let reading = 0;
          let rV = 0; let bV = 0;
          
          const findV = (p: {x:number, y:number}) => {
             const n = nodes.find(n => Math.hypot(n.x - p.x, n.y - p.y) < 15);
             return n ? n.v : 0;
          };
          rV = findV(probes.red);
          bV = findV(probes.black);
          reading = rV - bV;
          
          ctx.fillText(`${reading.toFixed(2)} V`, boxX+105, boxY+38);

          // Probes
          const drawProbe = (pos: {x:number, y:number}, color: string, active: boolean) => {
              ctx.beginPath(); ctx.moveTo(boxX + 60, boxY + 150);
              // Bezier wire
              ctx.bezierCurveTo(boxX+60, boxY+200, pos.x, pos.y+50, pos.x, pos.y);
              ctx.strokeStyle = color; ctx.lineWidth=3; ctx.stroke();
              
              // Handle
              ctx.fillStyle = color;
              ctx.beginPath(); ctx.moveTo(pos.x, pos.y); ctx.lineTo(pos.x-5, pos.y-30); ctx.lineTo(pos.x+5, pos.y-30); ctx.fill();
              // Tip
              ctx.fillStyle = '#cbd5e1';
              ctx.beginPath(); ctx.moveTo(pos.x, pos.y); ctx.lineTo(pos.x-1, pos.y+5); ctx.lineTo(pos.x+1, pos.y+5); ctx.fill();
              
              if (active) {
                  ctx.strokeStyle = '#fff'; ctx.lineWidth=1; ctx.beginPath(); ctx.arc(pos.x, pos.y, 10, 0, Math.PI*2); ctx.stroke();
              }
          };
          
          drawProbe(probes.red, '#ef4444', activeProbe === 'red');
          drawProbe(probes.black, '#3b82f6', activeProbe === 'black');
      }
  };

  const animate = () => {
      electronOffset.current += 1;
      draw();
      requestAnimationFrame(animate);
  };
  
  useEffect(() => {
      const handle = requestAnimationFrame(animate);
      return () => cancelAnimationFrame(handle);
  }, [comps, nodes, selection, dragStartNode, mousePos, probes, activeProbe, selectedTool]);

  const handleMouseDown = (e: React.MouseEvent) => {
      const rect = canvasRef.current!.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      if (selectedTool === 'voltmeter') {
          if (Math.hypot(x - probes.red.x, y - probes.red.y) < 30) setActiveProbe('red');
          else if (Math.hypot(x - probes.black.x, y - probes.black.y) < 30) setActiveProbe('black');
          return;
      }

      if (selectedTool === 'select') {
          const hit = comps.find(c => {
               const n1 = nodes.find(n=>n.id===c.n1)!;
               const n2 = nodes.find(n=>n.id===c.n2)!;
               const mx = (n1.x+n2.x)/2; const my = (n1.y+n2.y)/2;
               return Math.hypot(x-mx, y-my) < 20;
          });
          if (hit) {
              setSelection(hit.id);
              if (hit.type === 'switch') {
                  setComps(prev => prev.map(cc => cc.id === hit.id ? {...cc, isOpen: !cc.isOpen} : cc));
              }
          } else {
              setSelection(null);
          }
      } else {
          // Snap find
          const sx = Math.round(x/GRID)*GRID;
          const sy = Math.round(y/GRID)*GRID;
          let n = nodes.find(node => Math.hypot(node.x-sx, node.y-sy) < 10);
          if (!n) { n = {id: Math.random().toString(), x:sx, y:sy, v:0}; setNodes(prev=>[...prev, n!]); }
          setDragStartNode(n.id);
      }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
      const rect = canvasRef.current!.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setMousePos({x, y});
      
      if (activeProbe) {
          setProbes(prev => ({...prev, [activeProbe]: {x, y}}));
      }
  };

  const handleMouseUp = () => {
      if (activeProbe) {
          // Snap probe to node
          const sx = Math.round(mousePos.x/GRID)*GRID;
          const sy = Math.round(mousePos.y/GRID)*GRID;
          const n = nodes.find(node => Math.hypot(node.x-sx, node.y-sy) < 15);
          if (n) {
             setProbes(prev => ({...prev, [activeProbe]: {x: n.x, y: n.y, nodeId: n.id}}));
          }
          setActiveProbe(null);
          return;
      }

      if (dragStartNode && selectedTool !== 'select' && selectedTool !== 'voltmeter') {
          const sx = Math.round(mousePos.x/GRID)*GRID;
          const sy = Math.round(mousePos.y/GRID)*GRID;
          let endNode = nodes.find(n => Math.hypot(n.x - sx, n.y - sy) < 10);
          if (!endNode) {
               endNode = {id: Math.random().toString(), x:sx, y:sy, v:0};
               setNodes(prev => [...prev, endNode!]);
          }
          
          if (endNode.id !== dragStartNode) {
               const newComp: Component = {
                   id: Math.random().toString(),
                   type: selectedTool,
                   n1: dragStartNode,
                   n2: endNode.id,
                   value: selectedTool==='battery'?9:10,
                   isOpen: false
               };
               setComps(prev => [...prev, newComp]);
          }
      }
      setDragStartNode(null);
  };

  return (
    <div className="flex flex-col h-full gap-4">
      <div className="bg-slate-800 p-3 rounded-xl flex gap-3 justify-center shadow-lg border border-slate-700">
         {[
             { id: 'select', icon: MousePointer2, label: 'tool_cursor' },
             { id: 'wire', icon: Zap, label: 'tool_wire' },
             { id: 'resistor', icon: Zap, label: 'tool_resistor' }, 
             { id: 'bulb', icon: Lightbulb, label: 'tool_bulb' },
             { id: 'battery', icon: Battery, label: 'tool_battery' },
             { id: 'switch', icon: RotateCw, label: 'tool_switch' },
             { id: 'voltmeter', icon: Activity, label: 'tool_voltmeter' },
         ].map(tool => (
             <button
                key={tool.id}
                onClick={() => setSelectedTool(tool.id as any)}
                className={`flex flex-col items-center p-3 rounded-lg w-20 transition-all ${selectedTool === tool.id ? 'bg-blue-600 text-white shadow-lg scale-105' : 'text-slate-400 hover:bg-slate-700'}`}
             >
                 <tool.icon size={20} className="mb-1" />
                 <span className="text-[10px] uppercase font-bold text-center leading-tight">{t(tool.label)}</span>
             </button>
         ))}
      </div>

      <div className="flex-grow flex gap-4 min-h-0">
          <div className="flex-grow relative bg-slate-900 rounded-xl overflow-hidden border border-slate-700 shadow-xl">
             <canvas 
                ref={canvasRef} 
                width={800} 
                height={500} 
                className={`w-full h-full ${selectedTool === 'voltmeter' ? 'cursor-default' : 'cursor-crosshair'}`}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
             />
             <div className="absolute bottom-4 left-4 text-xs text-slate-500 font-mono">
                 Grid Solver: Kirchhoff Node Analysis
             </div>
          </div>

          <div className="w-64 bg-slate-800 border-l border-slate-700 p-4 flex flex-col gap-4">
               <h3 className="text-sm font-bold text-white uppercase border-b border-slate-700 pb-2">{t('measurements')}</h3>
               {selection ? (
                   <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                       {comps.find(c => c.id === selection)?.type !== 'wire' && comps.find(c => c.id === selection)?.type !== 'switch' && (
                           <div>
                               <label className="text-xs text-slate-400 font-bold uppercase">
                                   {comps.find(c => c.id === selection)?.type === 'battery' ? t('voltage') : t('resistance')}
                               </label>
                               <input 
                                type="range" min="1" max="50" 
                                value={comps.find(c => c.id === selection)?.value || 0}
                                onChange={e => setComps(prev => prev.map(c => c.id === selection ? {...c, value: Number(e.target.value)} : c))}
                                className="w-full h-2 bg-slate-700 rounded-lg accent-blue-500 mt-2"
                               />
                               <div className="text-right text-white font-mono text-xl mt-1">{comps.find(c => c.id === selection)?.value}</div>
                           </div>
                       )}
                       <button onClick={() => { setComps(prev=>prev.filter(c=>c.id!==selection)); setSelection(null); }} className="w-full py-3 bg-red-600/20 text-red-500 hover:bg-red-600/30 rounded-lg font-bold flex items-center justify-center gap-2 transition-colors">
                           <Trash2 size={16}/> {t('remove_comp')}
                       </button>
                   </div>
               ) : (
                   <div className="text-xs text-slate-500 text-center mt-10 italic">{t('drag_to_interact')}</div>
               )}
               
               <div className="mt-auto">
                   <button onClick={() => { setNodes([]); setComps([]); }} className="w-full py-2 border border-slate-600 rounded text-slate-400 hover:bg-slate-700 text-xs font-bold uppercase">{t('clear_all')}</button>
               </div>
          </div>
      </div>
    </div>
  );
};
