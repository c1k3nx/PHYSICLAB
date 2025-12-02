
import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { SimulationContainer } from './components/SimulationContainer';
import { EXPERIMENTS } from './constants';
import { GlobalProvider, useGlobal } from './contexts/GlobalContext';
import { Moon, Sun, Languages } from 'lucide-react';

const MainLayout: React.FC = () => {
  const [currentExperimentId, setCurrentExperimentId] = useState<string>(EXPERIMENTS[0].id);
  const currentExperiment = EXPERIMENTS.find(e => e.id === currentExperimentId) || EXPERIMENTS[0];
  const { theme, toggleTheme, lang, setLang } = useGlobal();

  return (
    <div className={`flex h-screen w-screen overflow-hidden font-sans transition-colors duration-300 ${theme === 'dark' ? 'bg-[#0f121a] text-slate-200' : 'bg-slate-50 text-slate-800'}`}>
      
      <Sidebar 
        currentExperimentId={currentExperimentId} 
        onSelectExperiment={setCurrentExperimentId} 
      />
      
      <main className="flex-grow h-full overflow-hidden relative flex flex-col">
        {/* Abstract Background Grid */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
            <div className={`absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] ${theme === 'light' ? 'opacity-40' : 'opacity-10'}`}></div>
            <div className={`absolute inset-0 bg-[radial-gradient(circle_800px_at_50%_200px,${theme === 'dark' ? '#3b82f615' : '#3b82f610'},transparent)]`}></div>
        </div>

        {/* Top Header */}
        <header className={`h-16 flex items-center justify-between px-8 border-b z-20 backdrop-blur-md ${theme === 'dark' ? 'bg-[#0f121a]/80 border-slate-800' : 'bg-white/80 border-slate-200'}`}>
           <h2 className="text-sm font-bold opacity-0 md:opacity-100 transition-opacity uppercase tracking-widest text-slate-500">
               Physics Lab Professional
           </h2>
           
           <div className="flex items-center gap-3">
               {/* Language Toggle */}
               <button 
                  onClick={() => setLang(lang === 'vi' ? 'en' : 'vi')}
                  className={`p-2 rounded-lg border transition-all flex items-center gap-2 text-xs font-bold ${
                      theme === 'dark' 
                      ? 'border-slate-700 hover:bg-slate-800 text-slate-300' 
                      : 'border-slate-200 hover:bg-slate-100 text-slate-600'
                  }`}
               >
                   <Languages size={16} />
                   {lang === 'vi' ? 'TIẾNG VIỆT' : 'ENGLISH'}
               </button>

               {/* Theme Toggle */}
               <button 
                  onClick={toggleTheme}
                  className={`p-2 rounded-lg border transition-all ${
                      theme === 'dark' 
                      ? 'bg-slate-800 border-slate-700 text-yellow-400 hover:text-yellow-300' 
                      : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900 shadow-sm'
                  }`}
               >
                   {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
               </button>
           </div>
        </header>
        
        <div className="relative h-full overflow-y-auto custom-scrollbar">
            <div className="max-w-7xl mx-auto h-full p-6 md:p-8">
                <SimulationContainer experiment={currentExperiment} />
            </div>
        </div>
      </main>
      
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: ${theme === 'dark' ? '#334155' : '#cbd5e1'};
          border-radius: 20px;
          border: 3px solid transparent;
          background-clip: content-box;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background-color: ${theme === 'dark' ? '#475569' : '#94a3b8'};
        }
      `}</style>
    </div>
  );
}

const App: React.FC = () => {
    return (
        <GlobalProvider>
            <MainLayout />
        </GlobalProvider>
    )
}

export default App;
