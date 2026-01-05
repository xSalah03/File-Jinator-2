
import React, { useState, useMemo } from 'react';
import { FileMove } from '../shared/types';
import { mockElectron } from './services/mockElectron';
import { CATEGORY_COLORS, CATEGORY_DOT_COLORS } from '../shared/constants';

// For the demo environment, we attach mockElectron to window.electron only if the real API is missing
if (typeof window !== 'undefined' && !window.electron) {
  window.electron = mockElectron;
}

const getCategoryIcon = (category: string) => {
  const commonProps = {
    xmlns: "http://www.w3.org/2000/svg",
    className: "w-4 h-4",
    fill: "none",
    viewBox: "0 0 24 24",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const
  };

  switch (category) {
    case 'Documents':
      return (
        <svg {...commonProps}>
          <path d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
        </svg>
      );
    case 'Images':
      return (
        <svg {...commonProps}>
          <path d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
        </svg>
      );
    case 'Videos':
      return (
        <svg {...commonProps}>
          <path d="m15.75 10.5 4.72-2.36a.67.67 0 01.98.6v6.52a.67.67 0 01-.98.6l-4.72-2.36M15.75 7.5h-10.5a1.5 1.5 0 00-1.5 1.5v6a1.5 1.5 0 00 1.5 1.5h10.5a1.5 1.5 0 00 1.5-1.5v-6a1.5 1.5 0 00-1.5-1.5z" />
        </svg>
      );
    case 'Audio':
      return (
        <svg {...commonProps}>
          <path d="M9 9l10.5-3m0 6.553v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 11-.99-3.467l.31-.088a2.25 2.25 0 001.632-2.163V6.306c0-1.19.901-2.183 2.085-2.276A30.29 30.29 0 0119.5 4v.553zM9 9v9.192a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 11-.99-3.467l.31-.088A2.25 2.25 0 007.5 18.017V9a2.25 2.25 0 012.25-2.25h5.379c1.157 0 2.151.912 2.252 2.066L17.55 10" />
        </svg>
      );
    case 'Archives':
      return (
        <svg {...commonProps}>
          <path d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
        </svg>
      );
    case 'Code':
      return (
        <svg {...commonProps}>
          <path d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
        </svg>
      );
    case 'Design':
      return (
        <svg {...commonProps}>
          <path d="M9.532 9.663a1.8 1.8 0 01-1.411-.699 1.8 1.8 0 01-.34-1.523A1.8 1.8 0 008.2 5.923a1.8 1.8 0 00-1.523-.34 1.8 1.8 0 01-1.523-.34 1.8 1.8 0 01-.34-1.523A1.8 1.8 0 003.263.161a1.8 1.8 0 00-1.411.699 1.8 1.8 0 01-1.411.699 1.8 1.8 0 01-.34 1.523 1.8 1.8 0 001.523.34 1.8 1.8 0 011.523.34 1.8 1.8 0 01.34 1.523A1.8 1.8 0 005.158 9.663a1.8 1.8 0 001.411-.699 1.8 1.8 0 011.411-.699 1.8 1.8 0 011.523.34a1.8 1.8 0 00.029.058zM12 18.75a6 6 0 006-6 6 6 0 00-6-6 6 6 0 00-6 6 6 6 0 006 6z" />
          <path d="M12 15.75a3 3 0 100-6 3 3 0 000 6z" />
        </svg>
      );
    default:
      return (
        <svg {...commonProps}>
          <path d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
        </svg>
      );
  }
};

const App: React.FC = () => {
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [pendingMoves, setPendingMoves] = useState<FileMove[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [isCleaning, setIsCleaning] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);

  // Highlighting and filtering state
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  // Sorting state
  const [sortConfig, setSortConfig] = useState<{ key: keyof FileMove, direction: 'asc' | 'desc' } | null>(null);

  // Derive category statistics from the dry run results
  const categorySummary = useMemo(() => {
    const summary: Record<string, number> = {};
    pendingMoves.forEach(move => {
      summary[move.destinationFolder] = (summary[move.destinationFolder] || 0) + 1;
    });
    return summary;
  }, [pendingMoves]);

  // Count unique extensions for the "Type" header
  const uniqueExtensionsCount = useMemo(() => {
    return new Set(pendingMoves.map(m => m.extension)).size;
  }, [pendingMoves]);

  // Sort the moves list based on active category and sort configuration
  const sortedMoves = useMemo(() => {
    let items = [...pendingMoves];

    items.sort((a, b) => {
      // 1. Priority: Active Category (Pinned to top)
      if (activeCategory) {
        const aIsActive = a.destinationFolder === activeCategory;
        const bIsActive = b.destinationFolder === activeCategory;
        if (aIsActive && !bIsActive) return -1;
        if (!aIsActive && bIsActive) return 1;
      }

      // 2. Sort Config logic
      if (sortConfig) {
        const { key, direction } = sortConfig;
        const valA = (a[key] as string).toLowerCase();
        const valB = (b[key] as string).toLowerCase();

        if (valA < valB) return direction === 'asc' ? -1 : 1;
        if (valA > valB) return direction === 'asc' ? 1 : -1;
      }

      // 3. Fallback: Filename sort for stability
      return a.fileName.localeCompare(b.fileName);
    });

    return items;
  }, [pendingMoves, activeCategory, sortConfig]);

  const requestSort = (key: keyof FileMove) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const handleSelectFolder = async () => {
    const path = await window.electron.selectFolder();
    if (path) {
      setSelectedFolder(path);
      setPendingMoves([]);
      setHoveredCategory(null);
      setActiveCategory(null);
      setSortConfig(null);
      setStatus({ type: 'info', message: `Folder selected: ${path}` });
    }
  };

  const handleDryRun = async () => {
    if (!selectedFolder) return;
    setIsScanning(true);
    setStatus(null);
    setHoveredCategory(null);
    setActiveCategory(null);
    setSortConfig(null);
    try {
      const moves = await window.electron.scanDirectory(selectedFolder);
      setPendingMoves(moves);
      setStatus({ type: 'info', message: `Scan complete. Found ${moves.length} files across ${Object.keys(categorySummary).length} categories.` });
    } catch (err) {
      setStatus({ type: 'error', message: 'Failed to scan directory.' });
    } finally {
      setIsScanning(false);
    }
  };

  const handleExecuteCleanup = async () => {
    if (pendingMoves.length === 0) return;
    setIsCleaning(true);
    try {
      await window.electron.executeCleanup(pendingMoves);
      setStatus({ type: 'success', message: 'Organization complete! Your files are now tidy.' });
      setPendingMoves([]);
      setSelectedFolder(null);
      setActiveCategory(null);
      setSortConfig(null);
    } catch (err) {
      setStatus({ type: 'error', message: 'An error occurred during cleanup.' });
    } finally {
      setIsCleaning(false);
    }
  };

  const toggleCategoryActive = (category: string) => {
    setActiveCategory(prev => prev === category ? null : category);
  };

  const SortIndicator = ({ column }: { column: keyof FileMove }) => {
    if (sortConfig?.key !== column) return <div className="w-3 h-3 opacity-20"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M7 15l5 5 5-5M7 9l5-5 5 5" /></svg></div>;
    return (
      <div className="w-3 h-3 text-blue-400 animate-in zoom-in-50 duration-300">
        {sortConfig.direction === 'asc' ? (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M19 15l-7-7-7 7" /></svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M5 9l7 7 7-7" /></svg>
        )}
      </div>
    );
  };

  return (
    <div className="h-screen p-6 max-w-6xl mx-auto flex flex-col gap-6 animate-in fade-in duration-700 overflow-hidden">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-slate-800 pb-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-xl shadow-blue-500/20 rotate-3 hover:rotate-0 transition-transform cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">File Janitor</h1>
            <p className="text-slate-500 text-sm font-medium">Keep your workspace clean and organized</p>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleSelectFolder}
            className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl transition-all border border-slate-700 flex items-center gap-2 text-sm font-semibold group shadow-lg"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
            </svg>
            Select Source
          </button>
        </div>
      </header>

      {/* Main Action Bar */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className={`lg:col-span-1 p-6 rounded-2xl border ${selectedFolder ? 'border-blue-500/30 bg-blue-500/5 shadow-inner' : 'border-slate-800 bg-slate-900/50'} transition-all`}>
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
            Target Folder
          </h3>
          <div className="mono text-blue-400 truncate text-xs p-2 bg-slate-950/50 rounded-lg border border-slate-800">
            {selectedFolder || "/dev/null"}
          </div>
        </div>

        <div className="lg:col-span-2 flex items-stretch gap-4">
          <button
            disabled={!selectedFolder || isScanning || isCleaning}
            onClick={handleDryRun}
            className={`flex-1 py-4 px-6 rounded-2xl font-bold text-sm transition-all flex flex-col items-center justify-center gap-1 border ${!selectedFolder
              ? 'bg-slate-900/50 border-slate-800 text-slate-600 cursor-not-allowed opacity-50'
              : 'bg-slate-800 hover:bg-slate-700 text-white border-slate-700 shadow-xl active:scale-95 hover:border-slate-500'
              }`}
          >
            {isScanning ? (
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 bg-white rounded-full animate-bounce"></span>
                Scanning...
              </span>
            ) : (
              <>
                <div className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <span>Dry Run</span>
                </div>
                <span className="text-[10px] font-normal text-slate-500 uppercase tracking-tighter">Preview movements</span>
              </>
            )}
          </button>

          <button
            disabled={pendingMoves.length === 0 || isCleaning}
            onClick={handleExecuteCleanup}
            className={`flex-1 py-4 px-6 rounded-2xl font-bold text-sm transition-all flex flex-col items-center justify-center gap-1 shadow-2xl shadow-blue-600/10 ${pendingMoves.length === 0
              ? 'bg-slate-900/50 border border-slate-800 text-slate-600 cursor-not-allowed opacity-50'
              : 'bg-blue-600 hover:bg-blue-500 text-white active:scale-95 shadow-blue-500/20'
              }`}
          >
            {isCleaning ? (
              <span className="animate-spin h-6 w-6 border-3 border-white border-t-transparent rounded-full"></span>
            ) : (
              <>
                <div className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span>Execute Cleanup</span>
                </div>
                <span className="text-[10px] font-normal text-blue-200 uppercase tracking-tighter">Organize files now</span>
              </>
            )}
          </button>
        </div>
      </section>

      {/* Category Summary Header */}
      {pendingMoves.length > 0 && (
        <section className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3 animate-in fade-in zoom-in-95 duration-500">
          {Object.entries(categorySummary).map(([category, count]) => (
            <button
              key={category}
              onMouseEnter={() => setHoveredCategory(category)}
              onMouseLeave={() => setHoveredCategory(null)}
              onClick={() => toggleCategoryActive(category)}
              className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all cursor-pointer relative overflow-hidden group ${CATEGORY_COLORS[category] || CATEGORY_COLORS['Others']
                } ${activeCategory === category ? 'ring-2 ring-white scale-105 z-20 shadow-lg brightness-110' : 'opacity-80 hover:opacity-100 hover:scale-105'}`}
            >
              <div className="flex items-center gap-1.5 mb-1 relative z-10">
                <div className={`p-1 rounded-md text-white shadow-sm ${CATEGORY_DOT_COLORS[category] || CATEGORY_DOT_COLORS['Others']}`}>
                  {getCategoryIcon(category)}
                </div>
                <span className="text-xl font-bold">{count}</span>
              </div>
              <span className="text-[9px] font-bold uppercase tracking-widest opacity-80 relative z-10">{category}</span>
              {activeCategory === category && (
                <div className="absolute top-1 right-1">
                  <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                </div>
              )}
            </button>
          ))}
        </section>
      )}

      {/* Feedback Alert */}
      {status && (
        <div className={`p-4 rounded-xl flex items-center gap-3 animate-in slide-in-from-right-4 duration-500 border shadow-lg ${status.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' :
          status.type === 'error' ? 'bg-rose-500/10 border-rose-500/20 text-rose-400' :
            'bg-blue-500/10 border-blue-500/20 text-blue-400'
          }`}>
          <div className="flex-shrink-0">
            {status.type === 'success' ? (
              <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
            ) : (
              <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
            )}
          </div>
          <p className="text-sm font-semibold tracking-tight">{status.message}</p>
        </div>
      )}

      {/* Pending Table */}
      <section className="flex-1 min-h-0 bg-slate-900 border border-slate-800 rounded-3xl flex flex-col overflow-hidden shadow-2xl">
        <div className="px-6 py-5 border-b border-slate-800 flex justify-between items-center bg-slate-900/80 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <h2 className="text-sm font-bold uppercase tracking-widest text-slate-300">Organization Queue</h2>
            <div className="h-4 w-[1px] bg-slate-700"></div>
            <span className="text-xs text-slate-500 font-mono">
              {pendingMoves.length} potential moves
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {activeCategory && (
              <button
                onClick={() => setActiveCategory(null)}
                className="text-[10px] font-bold text-slate-500 hover:text-slate-300 mr-2 uppercase tracking-tighter flex items-center gap-1"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Clear Selection
              </button>
            )}
            {Object.keys(categorySummary).map(cat => (
              <div key={cat} className={`w-2 h-2 rounded-full transition-all duration-300 ${activeCategory === cat ? 'ring-2 ring-white scale-125' : ''} ${CATEGORY_DOT_COLORS[cat] || CATEGORY_DOT_COLORS['Others']}`} title={cat}></div>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-auto custom-scrollbar">
          {sortedMoves.length > 0 ? (
            <table className="w-full text-left border-collapse table-fixed">
              <thead className="sticky top-0 bg-slate-900/95 backdrop-blur-sm z-10">
                <tr className="text-[10px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-800">
                  <th
                    className="px-6 py-4 w-1/3 cursor-pointer hover:text-white transition-colors group"
                    onClick={() => requestSort('fileName')}
                  >
                    <div className="flex items-center gap-2">
                      Source File {pendingMoves.length > 0 && (
                        activeCategory ? `(${categorySummary[activeCategory]} ${activeCategory})` : `(${pendingMoves.length})`
                      )} <SortIndicator column="fileName" />
                    </div>
                  </th>
                  <th
                    className="px-6 py-4 w-[120px] cursor-pointer hover:text-white transition-colors group"
                    onClick={() => requestSort('extension')}
                  >
                    <div className="flex items-center gap-2">
                      Type {pendingMoves.length > 0 && `(${uniqueExtensionsCount})`} <SortIndicator column="extension" />
                    </div>
                  </th>
                  <th
                    className="px-6 py-4 cursor-pointer hover:text-white transition-colors group"
                    onClick={() => requestSort('destinationFolder')}
                  >
                    <div className="flex items-center gap-2">
                      Destination Category {pendingMoves.length > 0 && `(${Object.keys(categorySummary).length})`} <SortIndicator column="destinationFolder" />
                    </div>
                  </th>
                  <th className="px-6 py-4 text-right">Preview Path</th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-slate-800/50">
                {sortedMoves.map((move, i) => {
                  const isHighlighted = (hoveredCategory === move.destinationFolder) || (activeCategory === move.destinationFolder);
                  const isSelected = activeCategory === move.destinationFolder;
                  const isDull = (hoveredCategory || activeCategory) && !isHighlighted;
                  const categoryBaseClass = CATEGORY_COLORS[move.destinationFolder] || CATEGORY_COLORS['Others'];

                  return (
                    <tr
                      key={i}
                      className={`group transition-all duration-300 relative border-l-4 ${isHighlighted
                        ? `${categoryBaseClass} border-l-current`
                        : isDull
                          ? 'opacity-25 grayscale-[0.8] border-transparent'
                          : 'hover:bg-slate-800/40 border-transparent'
                        } ${isSelected ? 'brightness-125 bg-opacity-30 z-10' : ''}`}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-1 h-8 rounded-full transition-all ${isHighlighted ? 'scale-y-125 bg-current' : CATEGORY_DOT_COLORS[move.destinationFolder] || CATEGORY_DOT_COLORS['Others']}`}></div>
                          <div className={`flex-shrink-0 p-1 rounded-lg text-white shadow-sm transition-all duration-300 ${isHighlighted ? 'scale-110 shadow-md' : 'opacity-80'} ${CATEGORY_DOT_COLORS[move.destinationFolder] || CATEGORY_DOT_COLORS['Others']}`}>
                            {getCategoryIcon(move.destinationFolder)}
                          </div>
                          <span className={`font-semibold transition-colors ${isHighlighted ? 'text-current' : 'text-slate-200'} truncate group-hover:text-white`}>
                            {move.fileName}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`mono bg-slate-950 border px-2 py-0.5 rounded text-[10px] font-bold transition-all ${isHighlighted ? 'border-current text-current' : 'border-slate-800 text-slate-500'}`}>
                          {move.extension.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-extrabold border transition-all shadow-sm ${categoryBaseClass
                          } ${isHighlighted ? 'scale-110 shadow-lg brightness-125' : ''}`}>
                          {move.destinationFolder.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className={`flex items-center justify-end gap-2 transition-colors ${isHighlighted ? 'text-current opacity-80 font-bold' : 'text-slate-500'}`}>
                          <span className={`mono text-[10px] bg-slate-950/50 px-2 py-1 rounded truncate max-w-[150px] ${isHighlighted ? 'border border-current/30' : ''}`}>
                            /{move.destinationFolder}/{move.fileName}
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-600 gap-6 py-24 opacity-40 grayscale group">
              <div className="relative">
                <div className="absolute inset-0 bg-blue-500 blur-3xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
                <svg xmlns="http://www.w3.org/2000/svg" className="w-24 h-24 relative transform group-hover:scale-110 transition-transform duration-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={0.5} d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9l-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold tracking-tight mb-1">Queue is Empty</p>
                <p className="text-sm font-medium">Select a messy directory to begin organization</p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Footer Info */}
      <footer className="text-center py-6 flex flex-col gap-2">
        <p className="text-slate-600 text-[9px] uppercase tracking-[0.3em] font-black">
          File Janitor &bull; Industrial Strength Utility &bull; v1.0
        </p>
        <div className="flex justify-center gap-4 text-[10px] text-slate-700 font-medium">
          <span>SECURE IPC BRAIN</span>
          <span>&bull;</span>
          <span>FS.PROMISES ENGINE</span>
          <span>&bull;</span>
          <span>REACTIVE UI</span>
        </div>
      </footer>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #0f172a;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #1e293b;
          border-radius: 10px;
          border: 2px solid #0f172a;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #334155;
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
      `}</style>
    </div>
  );
};

export default App;
