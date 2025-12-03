
import React, { useState, useEffect, useRef } from 'react';
import { Sidebar } from './components/Sidebar';
import { SimulationContainer } from './components/SimulationContainer';
import { EXPERIMENTS } from './constants';
import { GlobalProvider, useGlobal } from './contexts/GlobalContext';
import { Atom, ArrowRight } from 'lucide-react';

// --- INTRO SCREEN WITH GEOMETRY PHYSICS ---
const IntroScreen: React.FC<{ onEnter: () => void }> = ({ onEnter }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const mouseRef = useRef({ x: -1000, y: -1000 });
    const { t } = useGlobal();

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;

        class Debris {
            x: number; y: number; vx: number; vy: number; life: number; color: string; size: number;
            constructor(x: number, y: number, color: string) {
                this.x = x; this.y = y;
                const angle = Math.random() * Math.PI * 2;
                const speed = Math.random() * 1.5 + 0.5;
                this.vx = Math.cos(angle) * speed;
                this.vy = Math.sin(angle) * speed;
                this.life = 1.0;
                this.color = color;
                this.size = Math.random() * 2 + 1;
            }
            update() {
                this.x += this.vx; this.y += this.vy;
                this.life -= 0.015;
            }
            draw(ctx: CanvasRenderingContext2D) {
                ctx.globalAlpha = this.life;
                ctx.fillStyle = this.color;
                ctx.beginPath(); ctx.arc(this.x, this.y, this.size, 0, Math.PI*2); ctx.fill();
                ctx.globalAlpha = 1;
            }
        }

        class Block {
            x: number; y: number; 
            vx: number; vy: number;
            baseVx: number; baseVy: number;
            size: number; color: string; 
            rotation: number; vRot: number;
            type: 'square' | 'triangle' | 'hex';
            dead: boolean = false;

            constructor(reset = false) {
                this.size = Math.random() * 25 + 15;
                if (reset) {
                    const edge = Math.floor(Math.random()*4);
                    if(edge===0) { this.x = Math.random()*width; this.y = -50; }
                    else if(edge===1) { this.x = width+50; this.y = Math.random()*height; }
                    else if(edge===2) { this.x = Math.random()*width; this.y = height+50; }
                    else { this.x = -50; this.y = Math.random()*height; }
                } else {
                    this.x = Math.random() * width;
                    this.y = Math.random() * height;
                }
                const angle = Math.random() * Math.PI * 2;
                const speed = Math.random() * 0.3 + 0.1;
                this.baseVx = Math.cos(angle) * speed;
                this.baseVy = Math.sin(angle) * speed;
                this.vx = this.baseVx;
                this.vy = this.baseVy;
                this.rotation = Math.random() * Math.PI * 2;
                this.vRot = (Math.random() - 0.5) * 0.01;
                const colors = ['#60a5fa', '#a78bfa', '#34d399', '#f472b6', '#38bdf8'];
                this.color = colors[Math.floor(Math.random() * colors.length)];
                const types: ('square' | 'triangle' | 'hex')[] = ['square', 'triangle', 'hex'];
                this.type = types[Math.floor(Math.random() * types.length)];
            }

            update(mouse: {x:number, y:number}) {
                this.x += this.vx;
                this.y += this.vy;
                this.rotation += this.vRot;
                const pad = 60;
                if (this.x < -pad) this.x = width + pad;
                if (this.x > width + pad) this.x = -pad;
                if (this.y < -pad) this.y = height + pad;
                if (this.y > height + pad) this.y = -pad;

                const dx = this.x - mouse.x;
                const dy = this.y - mouse.y;
                const dist = Math.sqrt(dx*dx + dy*dy);
                const interactRadius = 200; 

                if (dist < interactRadius) {
                    const force = (interactRadius - dist) / interactRadius;
                    const pushFactor = 0.5;
                    this.vx -= (dx / dist) * force * pushFactor; // Repulsion
                    this.vy -= (dy / dist) * force * pushFactor;
                    this.vRot += force * 0.002;
                }
                
                const recoveryFactor = 0.02;
                this.vx += (this.baseVx - this.vx) * recoveryFactor;
                this.vy += (this.baseVy - this.vy) * recoveryFactor;
                
                const maxSpeed = 3;
                const currentSpeed = Math.sqrt(this.vx*this.vx + this.vy*this.vy);
                if (currentSpeed > maxSpeed) {
                    this.vx = (this.vx / currentSpeed) * maxSpeed;
                    this.vy = (this.vy / currentSpeed) * maxSpeed;
                }
            }

            draw(ctx: CanvasRenderingContext2D) {
                ctx.save();
                ctx.translate(this.x, this.y);
                ctx.rotate(this.rotation);
                ctx.strokeStyle = this.color;
                ctx.lineWidth = 1.5; 
                ctx.fillStyle = this.color + '10';
                ctx.shadowBlur = 8;
                ctx.shadowColor = this.color;
                ctx.beginPath();
                if (this.type === 'square') {
                    ctx.rect(-this.size/2, -this.size/2, this.size, this.size);
                } else if (this.type === 'triangle') {
                    const h = this.size * Math.sqrt(3)/2;
                    ctx.moveTo(0, -h/1.5);
                    ctx.lineTo(this.size/1.5, h/2.5);
                    ctx.lineTo(-this.size/1.5, h/2.5);
                    ctx.closePath();
                } else if (this.type === 'hex') {
                    for(let i=0; i<6; i++) {
                        const ang = (i * 60) * Math.PI/180;
                        const r = this.size/1.6;
                        if (i===0) ctx.moveTo(r*Math.cos(ang), r*Math.sin(ang));
                        else ctx.lineTo(r*Math.cos(ang), r*Math.sin(ang));
                    }
                    ctx.closePath();
                }
                ctx.fill();
                ctx.stroke();
                ctx.restore();
            }
        }

        let blocks: Block[] = Array.from({length: 35}, () => new Block());
        let debris: Debris[] = [];

        const animate = () => {
            ctx.clearRect(0, 0, width, height);
            const grad = ctx.createRadialGradient(width/2, height/2, 0, width/2, height/2, width);
            grad.addColorStop(0, '#0f172a');
            grad.addColorStop(1, '#020617');
            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, width, height);

            debris.forEach(d => d.update());
            debris = debris.filter(d => d.life > 0);
            debris.forEach(d => d.draw(ctx));

            blocks.forEach(b => b.update(mouseRef.current));
            
            for(let i=0; i<blocks.length; i++) {
                for(let j=i+1; j<blocks.length; j++) {
                    const b1 = blocks[i];
                    const b2 = blocks[j];
                    if (b1.dead || b2.dead) continue;
                    const dx = b1.x - b2.x;
                    const dy = b1.y - b2.y;
                    const dist = Math.sqrt(dx*dx + dy*dy);
                    
                    if (dist < (b1.size + b2.size) * 0.8) {
                        const relSpeed = Math.hypot(b1.vx - b2.vx, b1.vy - b2.vy);
                        if (relSpeed > 1.0) {
                            b1.dead = true;
                            b2.dead = true;
                            for(let k=0; k<5; k++) debris.push(new Debris(b1.x, b1.y, b1.color));
                            for(let k=0; k<5; k++) debris.push(new Debris(b2.x, b2.y, b2.color));
                            ctx.beginPath();
                            ctx.strokeStyle = '#fff';
                            ctx.lineWidth = 1;
                            ctx.globalAlpha = 0.6;
                            ctx.arc((b1.x+b2.x)/2, (b1.y+b2.y)/2, 30, 0, Math.PI*2);
                            ctx.stroke();
                            ctx.globalAlpha = 1;
                        } else {
                            const angle = Math.atan2(dy, dx);
                            const tx = Math.cos(angle) * 0.05;
                            const ty = Math.sin(angle) * 0.05;
                            b1.vx += tx; b1.vy += ty;
                            b2.vx -= tx; b2.vy -= ty;
                        }
                    }
                }
            }

            blocks.forEach(b => { if (!b.dead) b.draw(ctx); });
            const deadCount = blocks.filter(b => b.dead).length;
            blocks = blocks.filter(b => !b.dead);
            for(let i=0; i<deadCount; i++) blocks.push(new Block(true));

            requestAnimationFrame(animate);
        };

        const animationId = requestAnimationFrame(animate);
        const handleResize = () => { width = canvas.width = window.innerWidth; height = canvas.height = window.innerHeight; };
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(animationId);
        };
    }, []);

    const handleMouseMove = (e: React.MouseEvent) => { mouseRef.current = { x: e.clientX, y: e.clientY }; };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#020617] overflow-hidden" onMouseMove={handleMouseMove}>
            <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />
            <div className="relative z-10 flex flex-col items-center text-center px-4 animate-in fade-in zoom-in duration-1000 h-full justify-center">
                <div className="flex flex-col items-center justify-center flex-grow">
                    <div className="mb-8 relative group cursor-pointer">
                        <div className="absolute -inset-4 bg-blue-500/20 blur-xl rounded-full animate-pulse group-hover:bg-blue-500/40 transition-all"></div>
                        <Atom size={100} className="text-blue-400 relative z-10 animate-[spin_10s_linear_infinite] group-hover:scale-110 transition-transform duration-500" />
                    </div>
                    <div className="py-2"> 
                      <h1 className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-emerald-400 mb-6 tracking-tight drop-shadow-2xl px-4 pb-2">
                          PhysiLab Pro
                      </h1>
                    </div>
                    <p className="text-slate-400 text-lg md:text-2xl max-w-2xl mb-16 font-light tracking-wide leading-relaxed">
                        The Ultimate Interactive Physics Simulation Engine.<br/>
                        <span className="text-blue-500/80 text-base font-mono mt-4 block">Mechanics • Electricity • Optics • Thermodynamics</span>
                    </p>
                    <button 
                        onClick={onEnter}
                        className="group relative px-10 py-5 bg-white/5 backdrop-blur-md border border-white/10 rounded-full overflow-hidden transition-all hover:bg-white/10 hover:scale-105 hover:border-blue-500/50 hover:shadow-[0_0_50px_rgba(59,130,246,0.4)]"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/0 via-blue-600/20 to-blue-600/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                        <span className="relative flex items-center gap-3 text-white font-bold tracking-widest uppercase text-lg">
                            Access Laboratory <ArrowRight size={24} className="group-hover:translate-x-2 transition-transform"/>
                        </span>
                    </button>
                </div>
                <div className="mt-12 mb-8 text-xs text-slate-600 font-mono tracking-[0.2em] uppercase opacity-70">
                    Created by <span className="text-blue-500 font-bold ml-1">PHUC DO</span>
                </div>
            </div>
        </div>
    );
};

const InteractiveBackground: React.FC<{ theme: 'light' | 'dark' }> = ({ theme }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [mouse, setMouse] = useState({ x: -1000, y: -1000 });

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;
        
        const spacing = 60;
        const cols = Math.ceil(width / spacing) + 2;
        const rows = Math.ceil(height / spacing) + 2;
        const points: {x: number, y: number, ox: number, oy: number}[] = [];
        
        for(let y=0; y<rows; y++) {
            for(let x=0; x<cols; x++) {
                const px = (x-1) * spacing;
                const py = (y-1) * spacing;
                points.push({ x: px, y: py, ox: px, oy: py });
            }
        }

        const animate = () => {
            ctx.clearRect(0,0,width,height);
            points.forEach(p => {
                const dx = mouse.x - p.ox;
                const dy = mouse.y - p.oy;
                const dist = Math.sqrt(dx*dx + dy*dy);
                const maxDist = 300;
                if (dist < maxDist) {
                    const force = (maxDist - dist) / maxDist;
                    const angle = Math.atan2(dy, dx);
                    const move = force * 10; 
                    p.x = p.ox + Math.cos(angle) * move;
                    p.y = p.oy + Math.sin(angle) * move;
                } else {
                    p.x += (p.ox - p.x) * 0.1;
                    p.y += (p.oy - p.y) * 0.1;
                }
            });

            ctx.strokeStyle = theme === 'dark' ? 'rgba(59, 130, 246, 0.15)' : 'rgba(59, 130, 246, 0.1)';
            ctx.lineWidth = 1;
            
            for(let y=0; y<rows; y++) {
                ctx.beginPath();
                for(let x=0; x<cols; x++) {
                    const p = points[y*cols + x];
                    if (x===0) ctx.moveTo(p.x, p.y); else ctx.lineTo(p.x, p.y);
                }
                ctx.stroke();
            }
            for(let x=0; x<cols; x++) {
                ctx.beginPath();
                for(let y=0; y<rows; y++) {
                    const p = points[y*cols + x];
                    if (y===0) ctx.moveTo(p.x, p.y); else ctx.lineTo(p.x, p.y);
                }
                ctx.stroke();
            }
            requestAnimationFrame(animate);
        };
        
        const animId = requestAnimationFrame(animate);
        const handleResize = () => { width = canvas.width = window.innerWidth; height = canvas.height = window.innerHeight; };
        window.addEventListener('resize', handleResize);
        return () => { window.removeEventListener('resize', handleResize); cancelAnimationFrame(animId); };
    }, [theme, mouse]);

    const handleMouseMove = (e: React.MouseEvent) => {
        const rect = canvasRef.current?.getBoundingClientRect();
        if (rect) setMouse({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    };

    return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-auto" onMouseMove={handleMouseMove} onMouseLeave={() => setMouse({x:-1000, y:-1000})} />;
}

const MainLayout: React.FC = () => {
  const [currentExperimentId, setCurrentExperimentId] = useState<string>(EXPERIMENTS[0].id);
  const currentExperiment = EXPERIMENTS.find(e => e.id === currentExperimentId) || EXPERIMENTS[0];
  const { theme } = useGlobal();

  return (
    <div className={`flex h-screen w-screen overflow-hidden font-sans transition-colors duration-300 ${theme === 'dark' ? 'bg-[#0f121a] text-slate-200' : 'bg-slate-50 text-slate-800'}`}>
      
      <Sidebar 
        currentExperimentId={currentExperimentId} 
        onSelectExperiment={setCurrentExperimentId} 
      />
      
      <main className="flex-grow h-full overflow-hidden relative flex flex-col">
        {/* Interactive Background */}
        <div className="absolute inset-0 overflow-hidden z-0 pointer-events-none">
            <InteractiveBackground theme={theme} />
            <div className={`absolute w-[800px] h-[800px] rounded-full blur-[120px] opacity-20 top-[-300px] right-[-300px] ${theme === 'dark' ? 'bg-blue-600' : 'bg-blue-300'}`}></div>
            <div className={`absolute w-[600px] h-[600px] rounded-full blur-[100px] opacity-10 bottom-[-200px] left-[-200px] ${theme === 'dark' ? 'bg-purple-600' : 'bg-purple-300'}`}></div>
        </div>

        {/* Main Content Area - Full Bleed */}
        <div className="relative h-full z-10 flex flex-col">
            <SimulationContainer experiment={currentExperiment} />
        </div>
      </main>
      
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: ${theme === 'dark' ? '#334155' : '#cbd5e1'};
          border-radius: 20px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background-color: ${theme === 'dark' ? '#475569' : '#94a3b8'}; }
      `}</style>
    </div>
  );
}

const AppContent: React.FC = () => {
    const [showIntro, setShowIntro] = useState(true);
    return (
        <GlobalProvider>
            {showIntro ? (
                <IntroScreen onEnter={() => setShowIntro(false)} />
            ) : (
                <MainLayout />
            )}
        </GlobalProvider>
    );
};

const App: React.FC = () => { return <AppContent /> }

export default App;
