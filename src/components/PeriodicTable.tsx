import React, { useState, useMemo } from "react";
import { motion } from "motion/react";
import { 
  Sparkles, Trophy, Users, Layers, Tv, Cpu, Terminal, 
  BookOpen, ClipboardList, Palette, Search, SlidersHorizontal, 
  HelpCircle, Check, Info, Star, BrainCircuit 
} from "lucide-react";
import { Tool, CategoryId } from "../types";
import { TOOLS, CATEGORIES } from "../data";
import AppLogo from "./AppLogo";

// Helper to resolve category icons dynamically
const iconMap: Record<string, React.ComponentType<any>> = {
  Sparkles, Trophy, Users, Layers, Tv, Cpu, Terminal, 
  BookOpen, ClipboardList, Palette
};

export function CategoryIcon({ name, ...props }: { name: string; className?: string }) {
  const IconComponent = iconMap[name] || HelpCircle;
  return <IconComponent {...props} />;
}

interface PeriodicTableProps {
  onSelectTool: (tool: Tool) => void;
  favorites: string[];
  recentlyViewed: string[];
}

export default function PeriodicTable({ onSelectTool, favorites, recentlyViewed }: PeriodicTableProps) {
  // Filters State
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<CategoryId | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [selectedLevel, setSelectedLevel] = useState<string>("");
  const [onlyAi, setOnlyAi] = useState(false);
  const [onlyCollaborative, setOnlyCollaborative] = useState(false);
  const [onlyAssessment, setOnlyAssessment] = useState(false);
  const [priceFilter, setPriceFilter] = useState<"All" | "Free" | "Freemium">("All");
  const [difficultyFilter, setDifficultyFilter] = useState<"All" | "Beginner" | "Intermediate" | "Advanced">("All");

  const [hoverCategory, setHoverCategory] = useState<CategoryId | null>(null);
  const [isFilterExpanded, setIsFilterExpanded] = useState(false);

  // Subject options extracted from real tools list
  const subjectList = useMemo(() => {
    const subs = new Set<string>();
    TOOLS.forEach(t => t.subjects.forEach(s => subs.add(s)));
    return Array.from(subs).sort();
  }, []);

  // Filtered tools list
  const filteredTools = useMemo(() => {
    return TOOLS.filter(tool => {
      // Search text
      if (searchTerm) {
        const query = searchTerm.toLowerCase();
        const matchesName = tool.name.toLowerCase().includes(query);
        const matchesSymbol = tool.symbol.toLowerCase().includes(query);
        const matchesDesc = tool.description.toLowerCase().includes(query);
        const matchesTags = tool.bestFor.some(tag => tag.toLowerCase().includes(query));
        if (!matchesName && !matchesSymbol && !matchesDesc && !matchesTags) return false;
      }

      // Category
      if (selectedCategory && tool.category !== selectedCategory) return false;

      // Subject
      if (selectedSubject && !tool.subjects.includes(selectedSubject) && selectedSubject !== "All Subjects") {
        if (!tool.subjects.includes("All Subjects")) return false;
      }

      // Ed level
      if (selectedLevel && !tool.educationLevel.includes(selectedLevel)) return false;

      // AI-powered
      if (onlyAi && !tool.isAiPowered) return false;

      // Collaborative
      if (onlyCollaborative && !tool.isCollaborative) return false;

      // Assessment
      if (onlyAssessment && !tool.isAssessment) return false;

      // Price
      if (priceFilter !== "All" && tool.priceModel !== priceFilter) return false;

      // Difficulty
      if (difficultyFilter !== "All" && tool.difficulty !== difficultyFilter) return false;

      return true;
    });
  }, [
    searchTerm, selectedCategory, selectedSubject, selectedLevel, 
    onlyAi, onlyCollaborative, onlyAssessment, priceFilter, difficultyFilter
  ]);

  // Turn filtered tools into a lookup map for instant access & shading
  const filteredMap = useMemo(() => {
    const map = new Map<string, Tool>();
    filteredTools.forEach(t => map.set(t.id, t));
    return map;
  }, [filteredTools]);

  // Handle clearing all filters
  const resetFilters = () => {
    setSearchTerm("");
    setSelectedCategory(null);
    setSelectedSubject("");
    setSelectedLevel("");
    setOnlyAi(false);
    setOnlyCollaborative(false);
    setOnlyAssessment(false);
    setPriceFilter("All");
    setDifficultyFilter("All");
  };

  return (
    <div className="space-y-6 select-none">
      
      {/* Category Icons and Legend - Matches Poster Design */}
      <div className="bg-slate-100/60 p-4 rounded-2xl border border-slate-200/50">
        <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 block mb-3 font-mono text-center sm:text-left">
          Categorías de Herramientas (Click para filtrar)
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
          {Object.values(CATEGORIES).map((cat) => {
            const isSelected = selectedCategory === cat.id;
            const isDimmed = selectedCategory !== null && !isSelected;
            const isCurrentlyHovered = hoverCategory === cat.id;
            
            return (
              <button
                key={cat.id}
                id={`legend-cat-${cat.id}`}
                onClick={() => setSelectedCategory(isSelected ? null : cat.id)}
                onMouseEnter={() => setHoverCategory(cat.id)}
                onMouseLeave={() => setHoverCategory(null)}
                className={`flex items-center gap-1.5 p-2 rounded-xl text-left border transition-all cursor-pointer ${
                  cat.colorClass
                } ${
                  isSelected ? "ring-2 ring-indigo-500 border-transparent shadow" : "border-slate-200/20"
                } ${
                  isDimmed ? "opacity-35 grayscale-[20%]" : "opacity-100"
                } ${
                  isCurrentlyHovered ? "scale-[1.03]" : ""
                }`}
                title={cat.description}
              >
                <div className="h-5 w-5 bg-white/20 rounded-lg flex items-center justify-center text-xs font-black">
                  {cat.shortName}
                </div>
                <div className="text-[10px] sm:text-[11px] font-bold truncate leading-tight flex-1">
                  {cat.name}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Control search + filter dashboard */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 space-y-4 shadow-sm">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Main search bar */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              id="search-input"
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por nombre, etiquetas (Canva, escape room, inglés, interactivo)..."
              className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-500 rounded-xl py-2.5 pl-10 pr-4 text-sm text-slate-800 placeholder-slate-400 outline-none transition-all focus:ring-1 focus:ring-indigo-550/20"
            />
          </div>

          <div className="flex gap-2">
            {/* Subject filter dropdown */}
            <select
              id="subject-select"
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="bg-slate-50 border border-slate-200 focus:border-indigo-500 rounded-xl px-3 py-2 text-sm text-slate-700 outline-none cursor-pointer"
            >
              <option value="">Filtro de Materia</option>
              <option value="All Subjects">Universal / Todas</option>
              {subjectList.filter(s => s !== "All Subjects").map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>

            {/* Level filter dropdown */}
            <select
              id="level-select"
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="bg-slate-50 border border-slate-200 focus:border-indigo-500 rounded-xl px-3 py-2 text-sm text-slate-700 outline-none cursor-pointer"
            >
              <option value="">Nivel Educativo</option>
              <option value="Elementary Education">Primaria / Básica</option>
              <option value="Secondary Education">Secundaria / Bachillerato</option>
              <option value="Higher Education font-sans">Educación Superior</option>
            </select>

            <button
              id="toggle-adv-filters"
              onClick={() => setIsFilterExpanded(!isFilterExpanded)}
              className={`p-2.5 rounded-xl border flex items-center gap-2 text-xs font-semibold transition-all cursor-pointer ${
                isFilterExpanded 
                  ? "bg-indigo-50 border-indigo-200 text-indigo-600"
                  : "bg-slate-50 border-slate-200 hover:border-slate-300 text-slate-600"
              }`}
            >
              <SlidersHorizontal className="h-4 w-4" />
              <span className="hidden sm:inline">Filtros</span>
            </button>

            {(searchTerm || selectedCategory || selectedSubject || selectedLevel || onlyAi || onlyCollaborative || onlyAssessment || priceFilter !== "All" || difficultyFilter !== "All") && (
              <button
                id="reset-filters"
                onClick={resetFilters}
                className="px-3 text-xs font-bold text-slate-500 hover:text-rose-500 border border-transparent hover:border-rose-500/10 hover:bg-rose-50 rounded-xl transition-all cursor-pointer"
              >
                Limpiar
              </button>
            )}
          </div>
        </div>

        {/* Column-based expanded filter section */}
        {isFilterExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            className="pt-3 border-t border-slate-100 overflow-hidden"
          >
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 pb-1 text-slate-700">
              {/* Checkboxes */}
              <div className="space-y-2 flex flex-col justify-center">
                <label className="flex items-center gap-2 text-xs font-bold cursor-pointer">
                  <input
                    id="checkbox-ai"
                    type="checkbox"
                    checked={onlyAi}
                    onChange={(e) => setOnlyAi(e.target.checked)}
                    className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 h-4 w-4 transition-all"
                  />
                  <div className="flex items-center gap-1">
                    <BrainCircuit className="h-3.5 w-3.5 text-cyan-500" />
                    <span>Con Inteligencia Artificial</span>
                  </div>
                </label>
                <label className="flex items-center gap-2 text-xs font-bold cursor-pointer">
                  <input
                    id="checkbox-collaborative"
                    type="checkbox"
                    checked={onlyCollaborative}
                    onChange={(e) => setOnlyCollaborative(e.target.checked)}
                    className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 h-4 w-4 transition-all"
                  />
                  <div className="flex items-center gap-1">
                    <Users className="h-3.5 w-3.5 text-blue-500" />
                    <span>Trabajo Colaborativo</span>
                  </div>
                </label>
                <label className="flex items-center gap-2 text-xs font-bold cursor-pointer">
                  <input
                    id="checkbox-assessment"
                    type="checkbox"
                    checked={onlyAssessment}
                    onChange={(e) => setOnlyAssessment(e.target.checked)}
                    className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 h-4 w-4 transition-all"
                  />
                  <div className="flex items-center gap-1">
                    <Trophy className="h-3.5 w-3.5 text-green-600" />
                    <span>Evaluación / Gamificación</span>
                  </div>
                </label>
              </div>

              {/* Price filter chips */}
              <div className="space-y-2">
                <span className="text-[10px] uppercase font-bold font-mono tracking-wider text-slate-400">Modelo de Pago</span>
                <div className="flex gap-1.5">
                  {(["All", "Free", "Freemium"] as const).map(option => (
                    <button
                      key={option}
                      id={`price-filter-${option}`}
                      onClick={() => setPriceFilter(option)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                        priceFilter === option 
                          ? "bg-indigo-50 text-indigo-600 border border-indigo-200"
                          : "bg-slate-50 hover:bg-slate-100 text-slate-500 border border-slate-200"
                      }`}
                    >
                      {option === "All" ? "Todos" : option === "Free" ? "Gratis" : "Freemium"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Skill level difficulty chips */}
              <div className="space-y-2 col-span-2">
                <span className="text-[10px] uppercase font-bold font-mono tracking-wider text-slate-400">Dificultad de Uso</span>
                <div className="flex gap-1.5 flex-wrap">
                  {(["All", "Beginner", "Intermediate", "Advanced"] as const).map(option => (
                    <button
                      key={option}
                      id={`diff-filter-${option}`}
                      onClick={() => setDifficultyFilter(option)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                        difficultyFilter === option 
                          ? "bg-indigo-50 text-indigo-600 border border-indigo-200"
                          : "bg-slate-50 hover:bg-slate-100 text-slate-500 border border-slate-200"
                      }`}
                    >
                      {option === "All" ? "Cualquiera" : option === "Beginner" ? "Principiante" : option === "Intermediate" ? "Medio" : "Avanzado"}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Sparse Interactive Poster Periodic Grid */}
      <div className="overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent">
        <div className="min-w-[1240px]">
          
          <div 
            style={{ 
              display: "grid", 
              gridTemplateColumns: "repeat(18, minmax(0, 1fr))", 
              gap: "8px" 
            }}
          >
            {TOOLS.map((tool) => {
              const categoryDetails = CATEGORIES[tool.category];
              const isFilteredIn = filteredMap.has(tool.id);
              const isFav = favorites.includes(tool.id);
              const isCatHighlight = hoverCategory === null || tool.category === hoverCategory;

              // Grid position
              const gridCol = tool.group;
              const gridRow = tool.period;

              // Color adjustment block for yellow/amber background categories to avoid low contrast
              const isLightBackground = tool.category === "visual-thinking" || tool.category === "programming-coding";
              const textContrastClass = isLightBackground ? "text-slate-800" : "text-white";

              return (
                <button
                  key={tool.id}
                  id={`cell-${tool.id}`}
                  onClick={() => onSelectTool(tool)}
                  style={{
                    gridColumnStart: gridCol,
                    gridRowStart: gridRow,
                  }}
                  className={`relative p-1.5 rounded-2xl flex flex-col justify-between items-center text-center aspect-square transition-all group border overflow-hidden shadow-sm cursor-pointer ${
                    isFilteredIn && isCatHighlight
                      ? "opacity-100 scale-100 hover:scale-105"
                      : "opacity-15 grayscale-[40%] scale-[0.96] hover:opacity-30 pointer-events-none"
                  } ${
                    categoryDetails.colorClass
                  } ${
                    isFilteredIn && isCatHighlight
                      ? "border-transparent ring-2 ring-transparent hover:ring-indigo-400 hover:shadow-lg hover:shadow-indigo-100"
                      : "border-slate-200/40"
                  }`}
                >
                  {/* Visual helper badge */}
                  <div className="flex w-full justify-between items-center text-[10px] opacity-80 pointer-events-none">
                    <span className="font-mono font-black select-none opacity-90">
                      {tool.atomicNumber}
                    </span>
                    <div className="flex items-center gap-0.5">
                      {isFav && <Star className="h-2 w-2 text-yellow-300 fill-yellow-300" />}
                      {tool.isAiPowered && <span className="h-1.5 w-1.5 bg-cyan-300 rounded-full" title="Con IA" />}
                    </div>
                  </div>

                  {/* App Logo - Satisfies user requirement to replace boring initials with real app representations */}
                  <div className="flex-1 flex items-center justify-center my-0.5 pointer-events-none">
                    <AppLogo 
                      id={tool.id} 
                      name={tool.name} 
                      className="h-8 w-8 scale-95 sm:scale-100 transition-transform group-hover:scale-110 shadow-sm" 
                    />
                  </div>

                  {/* True simple human-designed human-interpretable app label */}
                  <div className={`text-[10px] font-extrabold font-sans leading-tight tracking-tight select-none truncate w-full px-0.5 ${textContrastClass}`}>
                    {tool.name}
                  </div>

                  {/* Tiny background accent pattern */}
                  <div className="absolute right-0 bottom-0 w-3 h-3 bg-white/10 rounded-tl-lg" />
                </button>
              );
            })}
          </div>

        </div>
      </div>

      {/* Filter feedback count summary and status */}
      <div className="flex flex-col sm:flex-row justify-between items-center text-xs text-slate-500 p-3 bg-slate-100/50 rounded-xl border border-slate-200/40 gap-3">
        <div className="flex items-center gap-2 font-medium">
          <Info className="h-4 w-4 text-indigo-500" />
          <span>Mostrando <strong>{filteredTools.length}</strong> de las <strong>{TOOLS.length}</strong> aplicaciones y plataformas curriculares</span>
        </div>
        
        <div className="flex gap-4 text-[10px] font-mono tracking-wider uppercase text-slate-500 font-bold">
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-cyan-400 inline-block" /> IA Integrada
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-fit border border-indigo-300 bg-white inline-block text-[8px] flex items-center justify-center text-indigo-500 font-sans">★</span> Favoritas bookmarked
          </span>
        </div>
      </div>

    </div>
  );
}
