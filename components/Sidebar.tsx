
import React, { useMemo, useState } from 'react';
import { Category, Experiment } from '../types';
import { EXPERIMENTS, CATEGORY_ICONS } from '../constants';
import { ChevronRight, ChevronDown, Atom, Search, PanelLeftClose, PanelLeft, LayoutGrid } from 'lucide-react';
import { useGlobal } from '../contexts/GlobalContext';

interface Props {
  currentExperimentId: string;
  onSelectExperiment: (id: string) => void;
}

export const Sidebar: React.FC<Props> = ({ currentExperimentId, onSelectExperiment }) => {
  const { theme, t } = useGlobal();
  const [collapsed, setCollapsed] = useState(false);
  
  const [expanded, setExpanded] = useState<Record<string, boolean>>({
      [Category.MECHANICS]: true,
      [Category.ELECTRICITY]: true,
      [Category.OPTICS]: true,
      [Category.THERMODYNAMICS]: true,
  });
  const [search, setSearch] = useState('');

  const toggleCategory = (cat: string) => {
      if (collapsed) setCollapsed(false);
      setExpanded(prev => ({...prev, [cat]: !prev[cat]}));
  };

  const groupedExperiments = useMemo(() => {
    const groups: Partial<Record<Category, Experiment[]>> = {};
    const searchLower = search.toLowerCase();
    
    Object.values(Category).forEach(cat => {
        const exps = EXPERIMENTS.filter(e => 
            e.category === cat && 
            (
                t(e.id).toLowerCase().includes(searchLower) || 
                t('desc_' + e.id).toLowerCase().includes(searchLower) || 
                e.tags.some(tag => tag.toLowerCase().includes(searchLower))
            )
        );
        if (exps.length > 0) groups[cat] = exps;
    });
    return groups;
  }, [search, t]);

  const isDark = theme === 'dark';

  return (
    <div 
        className={`h-screen border-r flex flex-col shadow-2xl z-30 transition-all duration-300 relative ${
            collapsed ? 'w-20' : 'w-72'
        } ${isDark ? 'bg-[#0b0d12] border-slate-800' : 'bg-white border-slate-200'}`}
    >
      {/* Header */}
      <div className={`p-4 flex items-center ${collapsed ? 'justify-center' : 'justify-between'}`}>
        {!collapsed && (
            <div className="flex items-center gap-2 overflow-hidden whitespace-nowrap">
                <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-1.5 rounded-lg">
                    <Atom className="text-white" size={20} />
                </div>
                <span className={`font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    PhysiLab
                </span>
            </div>
        )}
        <button 
            onClick={() => setCollapsed(!collapsed)}
            className={`p-1.5 rounded-lg transition-colors ${isDark ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-100 text-slate-600'}`}
        >
            {collapsed ? <PanelLeft size={20} /> : <PanelLeftClose size={20} />}
        </button>
      </div>

      {/* Search (Hidden if collapsed) */}
      {!collapsed && (
          <div className="px-4 mb-4">
            <div className="relative">
                <Search className="absolute left-3 top-2.5 text-slate-500" size={14} />
                <input 
                    type="text" 
                    placeholder={t('search_placeholder')} 
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className={`w-full text-xs rounded-lg pl-9 pr-3 py-2.5 border focus:outline-none focus:ring-1 transition-all ${
                        isDark 
                        ? 'bg-slate-900/50 border-slate-800 text-slate-300 focus:border-blue-500/50' 
                        : 'bg-slate-50 border-slate-200 text-slate-800 focus:border-blue-500'
                    }`}
                />
            </div>
          </div>
      )}

      {/* List */}
      <div className="flex-grow overflow-y-auto overflow-x-hidden px-3 pb-4 space-y-2 custom-scrollbar">
        {Object.entries(groupedExperiments).map(([category, experiments]) => {
            const Icon = CATEGORY_ICONS[category as Category];
            const isExpanded = expanded[category];
            const expList = experiments as Experiment[];
            
            return (
                <div key={category} className={`rounded-xl transition-all duration-300 ${!collapsed && isDark ? 'bg-slate-900/20' : ''}`}>
                    
                    {/* Category Header */}
                    <button 
                        onClick={() => toggleCategory(category)}
                        className={`w-full flex items-center ${collapsed ? 'justify-center py-4' : 'justify-between px-3 py-2.5'} transition-colors rounded-lg group ${
                            isDark 
                            ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50' 
                            : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
                        }`}
                        title={collapsed ? t(category) : ''}
                    >
                        <div className="flex items-center gap-3">
                            <Icon size={18} className={`${isDark ? 'text-slate-500 group-hover:text-blue-400' : 'text-slate-400 group-hover:text-blue-600'} transition-colors`} />
                            {!collapsed && <span className="text-xs font-bold uppercase tracking-wider">{t(category)}</span>}
                        </div>
                        {!collapsed && (isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />)}
                    </button>
                    
                    {/* Items */}
                    {(isExpanded || collapsed) && (
                        <div className={`mt-1 space-y-0.5 ${collapsed ? 'hidden group-hover:block absolute left-16 top-0 bg-slate-800 p-2 rounded-lg shadow-xl z-50 w-48 border border-slate-700' : 'pl-2'}`}>
                            {expList.map(exp => {
                                const active = currentExperimentId === exp.id;
                                return (
                                    <button
                                        key={exp.id}
                                        onClick={() => onSelectExperiment(exp.id)}
                                        className={`w-full text-left rounded-lg text-sm transition-all flex items-center gap-3 group relative ${
                                            collapsed 
                                            ? 'justify-center p-2 mb-2 last:mb-0' 
                                            : 'justify-between px-3 py-2'
                                        } ${
                                            active
                                            ? (isDark ? 'bg-blue-600 text-white' : 'bg-blue-600 text-white')
                                            : (isDark ? 'text-slate-400 hover:bg-slate-800 hover:text-slate-200' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900')
                                        }`}
                                        title={collapsed ? t(exp.id) : ''}
                                    >
                                        {collapsed ? (
                                            <div className={`w-1.5 h-1.5 rounded-full ${active ? 'bg-white' : 'bg-slate-600 group-hover:bg-slate-400'}`}></div>
                                        ) : (
                                            <>
                                                <span className="truncate font-medium text-[13px]">{t(exp.id)}</span>
                                                {active && <div className="w-1.5 h-1.5 rounded-full bg-white shadow-lg"></div>}
                                            </>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>
            );
        })}
      </div>

      {/* Footer */}
      {!collapsed && (
          <div className={`p-4 border-t ${isDark ? 'border-slate-800 bg-[#0b0e14]' : 'border-slate-200 bg-slate-50'}`}>
            <div className={`text-[10px] text-center font-bold tracking-widest ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>
                {t('created_by')} <span className="text-blue-500">{t('author_name')}</span>
            </div>
          </div>
      )}
    </div>
  );
};
