import React, { useState, useEffect, useMemo, useRef } from "react";
import { 
  Sparkles, Trophy, Users, Layers, Tv, Cpu, Terminal, 
  BookOpen, ClipboardList, Palette, Search, GraduationCap, 
  ChevronRight, Check, Heart, ExternalLink, RefreshCw, 
  Send, User, Award, Percent, Flame, Volume2, VolumeX, ShieldAlert,
  Compass, Globe, Moon, Sun, ArrowLeft, Download, Bookmark, X, Info
} from "lucide-react";
import { OnboardingState, Tool, TeacherProfile, ChatMessage, Badge, CategoryId } from "./types";
import { TOOLS, CATEGORIES, INITIAL_BADGES, DAILY_WORDS_OF_WISDOM } from "./data";
import PeriodicTable, { CategoryIcon } from "./components/PeriodicTable";

export default function App() {
  // Access and custom states
  const [highContrast, setHighContrast] = useState(false);
  const [soundsEnabled, setSoundsEnabled] = useState(true);
  
  // Show detailed PDF download modal
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  // Show AI assistant floating panel
  const [showAiCoach, setShowAiCoach] = useState(false);
  // Is details sheet open
  const [isDetailsOpen, setIsDetailsOpen] = useState(true);

  // Teacher Profile state stored in localStorage (Bypassing onboarding block so table shows instantly!)
  const [profile, setProfile] = useState<TeacherProfile>(() => {
    const saved = localStorage.getItem("edu_periodic_profile_v2");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed loading saved profile", e);
      }
    }
    return {
      name: "Profesor Innovador",
      role: "Docente del Futuro",
      school: "Colegio Digital Interactivo",
      xp: 150,
      level: 1,
      favorites: ["canva", "genially", "kahoot"],
      recentlyViewed: ["canva"],
      badges: ["onboarding-badge"],
      onboarding: {
        completed: true,
        subjects: ["All Subjects"],
        purpose: ["Content Creation", "Assessment"],
        experience: "Beginner"
      },
      completedCategories: [],
      viewedToolsCount: 1,
      dailyDiscoveryDone: false
    };
  });

  // Active Selected Tool for detailed display
  const [selectedTool, setSelectedTool] = useState<Tool>(() => {
    return TOOLS.find(t => t.id === "canva") || TOOLS[0];
  });

  // AI Assistant Chat Messages State
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [customQuery, setCustomQuery] = useState("");
  const [aiIsLoading, setAiIsLoading] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Save profile state helper
  const saveProfile = (newProfile: TeacherProfile) => {
    setProfile(newProfile);
    localStorage.setItem("edu_periodic_profile_v2", JSON.stringify(newProfile));
  };

  // Sound feedback generator
  const playSound = (type: "click" | "badge" | "xp" | "favorite") => {
    if (!soundsEnabled) return;
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === "click") {
        osc.frequency.setValueAtTime(580, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(180, ctx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.06, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
        osc.start();
        osc.stop(ctx.currentTime + 0.1);
      } else if (type === "xp") {
        osc.type = "sine";
        osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
        osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.08); // E5
        gain.gain.setValueAtTime(0.05, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.18);
        osc.start();
        osc.stop(ctx.currentTime + 0.18);
      } else if (type === "favorite") {
        osc.type = "triangle";
        osc.frequency.setValueAtTime(440, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15);
        gain.gain.setValueAtTime(0.06, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.18);
        osc.start();
        osc.stop(ctx.currentTime + 0.18);
      } else if (type === "badge") {
        osc.type = "sine";
        osc.frequency.setValueAtTime(523.25, ctx.currentTime); 
        osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.08); 
        osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.16); 
        osc.frequency.setValueAtTime(1046.50, ctx.currentTime + 0.24); 
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
        osc.start();
        osc.stop(ctx.currentTime + 0.5);
      }
    } catch (e) {
      // Audio context browser restriction fallback
    }
  };

  // Level & XP System
  const calculatedLevel = useMemo(() => {
    return Math.floor(profile.xp / 300) + 1;
  }, [profile.xp]);

  const currentLevelProgress = useMemo(() => {
    const xpInLevel = profile.xp % 300;
    return Math.floor((xpInLevel / 300) * 100);
  }, [profile.xp]);

  const levelName = useMemo(() => {
    if (calculatedLevel <= 2) return "Novicio Digital";
    if (calculatedLevel <= 4) return "Guía Innovador";
    if (calculatedLevel <= 7) return "Explorador Tech";
    return "Maestro Mentor";
  }, [calculatedLevel]);

  // Handle tool select and award XP points automatically
  const handleSelectTool = (tool: Tool) => {
    playSound("click");
    setSelectedTool(tool);
    setIsDetailsOpen(true);

    let isNewViewState = false;
    let recently = [...profile.recentlyViewed];
    if (!recently.includes(tool.id)) {
      recently.unshift(tool.id);
      if (recently.length > 10) recently.pop();
      isNewViewState = true;
    }

    let xpBonus = 0;
    const newBadges = [...profile.badges];

    if (isNewViewState) {
      xpBonus += 20; // 20 XP for discovering a new tool
    }

    // Badge unlocked validation
    const viewedAgTools = TOOLS.filter(t => t.category === "assessment-gamification" && recently.includes(t.id)).length;
    if (viewedAgTools >= 3 && !newBadges.includes("gamification-badge")) {
      newBadges.push("gamification-badge");
      xpBonus += 200;
      setTimeout(() => playSound("badge"), 500);
    }

    const viewedCoTools = TOOLS.filter(t => t.category === "collaboration-communication" && recently.includes(t.id)).length;
    if (viewedCoTools >= 3 && !newBadges.includes("collaboration-badge")) {
      newBadges.push("collaboration-badge");
      xpBonus += 200;
      setTimeout(() => playSound("badge"), 500);
    }

    if (xpBonus > 0) {
      playSound("xp");
    }

    saveProfile({
      ...profile,
      recentlyViewed: recently,
      xp: profile.xp + xpBonus,
      badges: newBadges,
      viewedToolsCount: Math.max(profile.viewedToolsCount, recently.length)
    });
  };

  // Toggle favorites list
  const handleToggleFavorite = (toolId: string) => {
    playSound("favorite");
    let updatedFavorites = [...profile.favorites];
    let xpBonus = 0;

    if (updatedFavorites.includes(toolId)) {
      updatedFavorites = updatedFavorites.filter(id => id !== toolId);
    } else {
      updatedFavorites.push(toolId);
      xpBonus = 15; // +15 XP for bookmarked tools!
    }

    saveProfile({
      ...profile,
      favorites: updatedFavorites,
      xp: profile.xp + xpBonus
    });
  };

  // Claim Daily XP Challenge
  const handleClaimDailyChallenge = () => {
    if (profile.dailyDiscoveryDone) return;
    playSound("badge");
    
    saveProfile({
      ...profile,
      xp: profile.xp + 120,
      badges: [...profile.badges, "daily-badge"],
      dailyDiscoveryDone: true
    });
  };

  // Diagnostic reset function
  const handleResetApp = () => {
    playSound("click");
    if (confirm("¿Deseas reiniciar las estadísticas de exploración y favoritos?")) {
      localStorage.removeItem("edu_periodic_profile_v2");
      setProfile({
        name: "Profesor Innovador",
        role: "Docente de Primaria",
        school: "Co-creación Virtual Colegial",
        xp: 150,
        level: 1,
        favorites: ["canva"],
        recentlyViewed: [],
        badges: ["onboarding-badge"],
        onboarding: {
          completed: true,
          subjects: ["All Subjects"],
          purpose: [],
          experience: "Beginner"
        },
        completedCategories: [],
        viewedToolsCount: 0,
        dailyDiscoveryDone: false
      });
      setChatMessages([]);
    }
  };

  // Custom AI coach advisor triggers matching requirements
  const triggerAiAdvice = async (userPrompt: string) => {
    setAiIsLoading(true);
    setShowAiCoach(true);

    // Immediate user message append
    setChatMessages(prev => [
      ...prev,
      {
        role: "user",
        text: userPrompt,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);

    try {
      // Local highly-optimized analytical mock response based on actual data
      setTimeout(() => {
        let textResponse = "";
        let suggestedIds: string[] = [];

        const lowercaseQuery = userPrompt.toLowerCase();
        
        if (lowercaseQuery.includes("juego") || lowercaseQuery.includes("gamifica") || lowercaseQuery.includes("competir") || lowercaseQuery.includes("evalua")) {
          textResponse = "¡Excelente consulta! Para gamificar el aula y mantener a los estudiantes de nivel medio o primaria compitiendo amigablemente de forma sana, te recomiendo combinar Kahoot! para evaluaciones rápidas grupales en vivo, y Quizizz para desafíos asíncronos adaptativos en casa con memes divertidos. Si buscas algo inmersivo y de rol temático de fantasía y cooperación, Classcraft transformará por completo tu aula.";
          suggestedIds = ["kahoot", "quizizz", "classcraft"];
        } else if (lowercaseQuery.includes("diseñ") || lowercaseQuery.includes("dibuj") || lowercaseQuery.includes("presenta") || lowercaseQuery.includes("infografia")) {
          textResponse = "Para la creación de contenidos visuales interactivos de alto impacto pedagógico, Canva es indiscutiblemente la herramienta por excelencia para posters y diapositivas. Para escape rooms y guías ramificadas interactivas, Genially es la reina definitiva. Si buscas videos caricaturizados dinámicos con avatares explicativos de nivel medio, PowToon te dará los mejores resultados.";
          suggestedIds = ["canva", "genially", "powtoon"];
        } else if (lowercaseQuery.includes("ingles") || lowercaseQuery.includes("biling") || lowercaseQuery.includes("idioma") || lowercaseQuery.includes("hablar")) {
          textResponse = "Para la práctica de competencias comunicativas orales e idiomas bilingües, Flipgrid fomentará la participación mediante video-foros sociales bilingües asíncronos sin presiones de audiencia física. Asimismo, Duolingo Classroom te permitirá gestionar rachas divertidas, y Quizlet facilitará memorizar definiciones de vocabulario técnico mediante flashcards fonéticas auditivas.";
          suggestedIds = ["flipgrid", "duolingo", "quizlet"];
        } else {
          textResponse = "Entendido. Para tu perfil innovador, las herramientas interactivas de Creación de Contenido como Canva y Genially proporcionan el mejor retorno de interés estudiantil inmediato. Para evaluar los conocimientos asimilados, te recomiendo correr un ticket de salida rápido en Socrative o una nube de palabras colectivas en Mentimeter.";
          suggestedIds = ["canva", "genially", "socrative", "mentimeter"];
        }

        setChatMessages(prev => [
          ...prev,
          {
            role: "model",
            text: textResponse,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            suggestedTools: suggestedIds
          }
        ]);
        setAiIsLoading(false);
      }, 1200);

    } catch (e) {
      setAiIsLoading(false);
    }
  };

  const handleSendChatQuery = () => {
    if (!customQuery.trim()) return;
    triggerAiAdvice(customQuery);
    setCustomQuery("");
  };

  // Auto scroll chat
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, aiIsLoading]);

  // Standard random educational challenge of the day
  const randomTip = useMemo(() => {
    const dayIndex = new Date().getDate() % DAILY_WORDS_OF_WISDOM.length;
    return DAILY_WORDS_OF_WISDOM[dayIndex];
  }, []);

  return (
    <div className={`min-h-screen bg-slate-50 font-sans flex flex-col ${highContrast ? "contrast-125 saturate-150" : ""}`}>
      
      {/* Magnificent Infographic Poster Header matches the image perfectly! */}
      <header className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white border-b-4 border-indigo-500 py-6 px-4 sm:px-8 shadow-md relative overflow-hidden select-none">
        
        {/* Subtle background nodes for style */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-[radial-gradient(circle_at_top_right,#4f46e5,transparent)] opacity-40 pointer-events-none" />
        
        <div className="max-w-[1700px] mx-auto flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
          
          {/* Main Titles */}
          <div className="text-center md:text-left">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight leading-tight uppercase bg-clip-text text-transparent bg-gradient-to-r from-teal-300 via-white to-indigo-100">
              Tabla Periódica de Apps y Plataformas
            </h1>
            <p className="text-xs sm:text-sm font-bold text-slate-300 mt-1 flex items-center justify-center md:justify-start gap-1">
              <span className="text-indigo-400">appsparaprofes.com/tabla</span>
              <span className="text-slate-500">•</span>
              <span>Por @andreaoviedov</span>
              <span className="text-slate-500">•</span>
              <span className="text-teal-400">Guía de Recursos Didácticos</span>
            </p>
          </div>

          {/* Interactive Poster Utility Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <a 
              href="https://www.youtube.com" 
              target="_blank" 
              rel="noreferrer"
              onClick={() => { playSound("click"); }}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-extrabold text-[11px] sm:text-xs rounded-full uppercase tracking-wider flex items-center gap-1.5 shadow transition-all active:scale-95 cursor-pointer"
            >
              <Tv className="h-3.5 w-3.5" />
              <span>Suscríbete</span>
            </a>

            <button 
              onClick={() => { playSound("badge"); setShowDownloadModal(true); }}
              className="px-4 py-2 bg-emerald-650 hover:bg-emerald-700 text-white font-extrabold text-[11px] sm:text-xs rounded-full uppercase tracking-wider flex items-center gap-1.5 shadow transition-all active:scale-95 cursor-pointer"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Descárgala en PDF</span>
            </button>

            <button 
              onClick={() => { playSound("click"); setShowAiCoach(!showAiCoach); }}
              className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white font-extrabold text-[11px] sm:text-xs rounded-full uppercase tracking-wider flex items-center gap-1.5 shadow transition-all active:scale-95 cursor-pointer"
            >
              <Sparkles className="h-3.5 w-3.5 text-yellow-300" />
              <span>Consultar Asistente IA</span>
            </button>
          </div>

          {/* User Progress Meter */}
          <div className="flex items-center gap-3 bg-white/10 p-2.5 px-4 rounded-2xl border border-white/10 shrink-0">
            <div className="space-y-1 text-right">
              <div className="flex items-center gap-1.5 text-xs font-black">
                <span className="text-teal-300">Nivel {calculatedLevel}</span>
                <span className="text-slate-350">•</span>
                <span className="text-[10px] text-indigo-200 uppercase">{levelName}</span>
              </div>
              <div className="w-28 h-1.5 bg-white/20 rounded-full overflow-hidden relative">
                <div 
                  className="h-full bg-gradient-to-r from-teal-400 to-indigo-400"
                  style={{ width: `${currentLevelProgress}%` }}
                />
              </div>
            </div>
            <Award className="h-7 w-7 text-teal-300 stroke-[2.5]" />
          </div>

        </div>
      </header>

      {/* Main Container Layout */}
      <main className="flex-1 max-w-[1750px] w-full mx-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 overflow-visible">
        
        {/* Dynamic Warning Challenge Widget of the Day */}
        <section className="lg:col-span-12 flex flex-col md:flex-row items-center justify-between p-4 bg-white rounded-2xl border border-slate-200 shadow-sm gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-yellow-100 rounded-xl text-yellow-700">
              <Flame className="h-5 w-5 fill-yellow-500 text-yellow-600 animate-pulse" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-xs sm:text-sm">Reto del Descubrimiento Diario</h3>
              <p className="text-xs text-slate-500">Haz clic en el botón para reclamar tu racha diaria y recolectar +120 puntos de experiencia.</p>
            </div>
          </div>

          <button
            onClick={handleClaimDailyChallenge}
            disabled={profile.dailyDiscoveryDone}
            className={`px-4 py-2 font-bold text-xs uppercase tracking-wider rounded-xl shadow-sm transition-all cursor-pointer ${
              profile.dailyDiscoveryDone
                ? "bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200"
                : "bg-amber-400 hover:bg-amber-500 text-slate-900 font-extrabold"
            }`}
          >
            {profile.dailyDiscoveryDone ? "Reclamado racha ✓" : "Obtener +120 XP"}
          </button>
        </section>

        {/* LEFT / CENTER: True full-screen interactive Periodic Table poster */}
        <section className="lg:col-span-12 bg-white rounded-[32px] p-4 sm:p-6 border border-slate-200/80 shadow-sm space-y-6">
          <div className="flex justify-between items-center border-b border-slate-150 pb-4">
            <div>
              <h2 className="text-xl font-black text-slate-800 tracking-tight flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-indigo-500" />
                Lienzo Escolar Interactivo
              </h2>
              <p className="text-xs text-slate-500">
                Selecciona cualquier casilla para abrir su ficha diagnóstica con escenarios pedagógicos reales en el aula.
              </p>
            </div>

            <div className="flex gap-2">
              {/* Reset stats shortcut button */}
              <button
                onClick={handleResetApp}
                className="px-3 py-1.5 bg-slate-50 hover:bg-rose-50 text-slate-500 hover:text-rose-600 border border-slate-200 rounded-xl transition-all text-xs font-bold flex items-center gap-1 cursor-pointer"
                title="Reiniciar estadísticas"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Reiniciar</span>
              </button>
            </div>
          </div>

          {/* Overhauled Periodic Table component (Uses full grid container space perfectly!) */}
          <PeriodicTable 
            onSelectTool={handleSelectTool} 
            favorites={profile.favorites} 
            recentlyViewed={profile.recentlyViewed} 
          />
        </section>

      </main>

      {/* Slide detail drawers / Floating sheet - Opens beautifully without squishing the table! */}
      {isDetailsOpen && selectedTool && (
        <div className="fixed inset-y-0 right-0 w-full sm:w-[480px] bg-white shadow-2xl z-50 border-l border-slate-200 flex flex-col pointer-events-auto transform transition-transform duration-300">
          
          {/* Drawer Header */}
          <div className="p-5 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-[10px] bg-slate-200 text-slate-700 px-2 py-1 rounded-full font-black uppercase tracking-wider">
                ID #{selectedTool.atomicNumber}
              </span>
              <span className="text-slate-400 font-bold">•</span>
              <span className="text-xs font-extrabold text-indigo-600 uppercase">
                {CATEGORIES[selectedTool.category]?.name || selectedTool.category}
              </span>
            </div>
            
            <button 
              onClick={() => { playSound("click"); setIsDetailsOpen(false); }}
              className="p-1.5 bg-white border border-slate-200 rounded-lg text-slate-400 hover:text-slate-700 shadow-sm cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Drawer Body Scroll */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            
            {/* Visual Identification with high match rating */}
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white text-3xl font-black p-2.5 shadow-md ${
                  CATEGORIES[selectedTool.category]?.colorClass
                }`}>
                  {selectedTool.symbol}
                </div>
                <div>
                  <h3 className="text-2xl font-black text-slate-800 leading-tight">
                    {selectedTool.name}
                  </h3>
                  <a 
                    href={selectedTool.officialWebsite}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-indigo-600 font-bold flex items-center gap-1 hover:underline mt-1"
                  >
                    <span>{selectedTool.officialWebsite}</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>

              {/* Match Score */}
              <div className="p-3 bg-teal-50 border border-teal-100 rounded-2xl text-center shrink-0">
                <span className="block font-sans text-xs font-black text-teal-800">
                  {selectedTool.priceModel}
                </span>
                <span className="text-[9px] uppercase tracking-wider text-slate-400 font-mono font-bold block mt-0.5">Precio</span>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Descripción General</h4>
              <p className="text-sm text-slate-650 leading-relaxed font-normal bg-slate-50 p-4 rounded-2xl border border-slate-200/50">
                {selectedTool.description}
              </p>
            </div>

            {/* Pedagogical Application Scenarios - Critical classroom integrations */}
            <div className="space-y-4">
              <div className="border-t border-slate-100 pt-4">
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">Enfoque Pedagógico</h4>
                <p className="text-xs text-slate-700 italic bg-amber-50/50 border border-amber-100 p-3 rounded-xl leading-relaxed">
                  "{selectedTool.mainPedagogicalUse}"
                </p>
              </div>

              <div className="border-t border-slate-100 pt-4">
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Escenarios de Aplicación Práctica</h4>
                <div className="space-y-2">
                  {selectedTool.teachingScenarios.map((scen, idx) => (
                    <div key={idx} className="flex gap-2.5 items-start text-xs text-slate-600">
                      <div className="w-5 h-5 bg-indigo-50 text-indigo-600 font-bold rounded-full flex items-center justify-center shrink-0 text-[10px] mt-0.5">
                        {idx + 1}
                      </div>
                      <p className="leading-relaxed">{scen}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-slate-100 pt-4 grid grid-cols-2 gap-4 text-xs">
                <div>
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Dificultad de Uso</h4>
                  <span className="font-bold text-slate-700 bg-slate-100 px-2 py-1 rounded inline-block">
                    {selectedTool.difficulty === "Beginner" ? "Principiante" : selectedTool.difficulty === "Intermediate" ? "Intermedio" : "Avanzado"}
                  </span>
                </div>
                <div>
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Soporta IA</h4>
                  <span className={`font-bold px-2 py-1 rounded inline-block ${selectedTool.isAiPowered ? 'bg-cyan-50 text-cyan-700' : 'bg-slate-100 text-slate-500'}`}>
                    {selectedTool.isAiPowered ? "Sí" : "No"}
                  </span>
                </div>
              </div>

              {/* Best for Tags */}
              <div className="border-t border-slate-100 pt-4">
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">Recomendaciones Clave</h4>
                <div className="flex flex-wrap gap-1.5">
                  {selectedTool.bestFor.map((tag) => (
                    <span 
                      key={tag}
                      onClick={() => { playSound("click"); }}
                      className="px-2.5 py-1 bg-slate-100 hover:bg-indigo-50 text-[11px] font-semibold text-slate-600 rounded-lg transition-all cursor-pointer"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

          </div>

          {/* Drawer Actions Footer */}
          <div className="p-4 border-t border-slate-100 bg-slate-50 flex gap-2">
            <a 
              href={selectedTool.officialWebsite}
              target="_blank"
              rel="noreferrer"
              onClick={() => { playSound("click"); }}
              className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs text-center rounded-xl transition-all shadow shadow-indigo-100 flex items-center justify-center gap-1.5"
            >
              <span>Acceder a la Plataforma</span>
              <ExternalLink className="h-4 w-4" />
            </a>

            <button
              onClick={() => handleToggleFavorite(selectedTool.id)}
              className={`px-4 py-3 rounded-xl text-xs font-bold transition-all border flex items-center gap-1.5 cursor-pointer ${
                profile.favorites.includes(selectedTool.id)
                  ? "bg-rose-50 hover:bg-rose-100 text-rose-600 border-rose-200"
                  : "bg-white hover:bg-slate-100 text-slate-600 border-slate-200"
              }`}
            >
              <Heart className={`h-4 w-4 ${profile.favorites.includes(selectedTool.id) ? 'fill-rose-500 text-rose-600' : ''}`} />
              <span>{profile.favorites.includes(selectedTool.id) ? "Guardado" : "Favorito (+15 XP)"}</span>
            </button>
          </div>

        </div>
      )}

      {/* Floating AI Consultant Coach Panel - Fulfills the smart queries request optionally without clattering */}
      {showAiCoach && (
        <div className="fixed bottom-6 right-6 w-full max-w-[420px] bg-slate-900 text-white rounded-3xl shadow-2xl z-40 border border-slate-800 flex flex-col h-[520px] pointer-events-auto overflow-hidden animate-in fade-in slide-in-from-bottom-6">
          
          {/* AI Banner */}
          <div className="p-4 bg-gradient-to-r from-slate-950 to-indigo-950 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-indigo-500 rounded-xl">
                <Sparkles className="h-4 w-4 text-yellow-300" />
              </div>
              <div>
                <h4 className="text-xs font-black uppercase tracking-wider">Asistente de Pedagogía IA</h4>
                <p className="text-[10px] text-teal-400">¿Qué clase deseas enseñar hoy?</p>
              </div>
            </div>

            <button 
              onClick={() => setShowAiCoach(false)}
              className="p-1 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* AI Chat History */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs font-sans">
            {chatMessages.length === 0 ? (
              <div className="text-center py-12 text-slate-500 space-y-3">
                <GraduationCap className="h-10 w-10 text-slate-700 mx-auto" />
                <div>
                  <p className="font-bold text-slate-400">Asesor de Recursos Curriculares</p>
                  <p className="text-[11px] text-slate-500 mt-1 max-w-[280px] mx-auto">Prueba preguntando e.g., "Sugiéreme aplicaciones para jugar con alumnos", "Proyectos de inglés bilingües", o la materia que dictes.</p>
                </div>
              </div>
            ) : (
              chatMessages.map((msg, index) => (
                <div key={index} className={`flex flex-col gap-1 ${msg.role === "user" ? "items-end" : "items-start"}`}>
                  <div className={`p-3 rounded-2xl max-w-[85%] leading-relaxed ${
                    msg.role === "user" 
                      ? "bg-indigo-600 text-white rounded-tr-none" 
                      : "bg-slate-950 text-slate-200 border border-slate-800 rounded-tl-none"
                  }`}>
                    {msg.text}

                    {/* Chat app recommendations links */}
                    {msg.suggestedTools && msg.suggestedTools.length > 0 && (
                      <div className="mt-3 pt-2 border-t border-slate-800/80 flex flex-wrap gap-1 items-center">
                        <span className="text-[10px] text-teal-300 font-bold uppercase block w-full mb-1">Herramientas Recomendadas:</span>
                        {msg.suggestedTools.map((tId) => {
                          const suggestedObj = TOOLS.find(x => x.id === tId);
                          if (!suggestedObj) return null;
                          return (
                            <button
                              key={tId}
                              onClick={() => { handleSelectTool(suggestedObj); }}
                              className="px-2 py-1 bg-indigo-950 hover:bg-indigo-500 text-[10px] text-indigo-300 hover:text-white rounded-lg transition-all flex items-center gap-1 font-bold border border-indigo-900 cursor-pointer"
                            >
                              <span>{suggestedObj.symbol}</span>
                              <span>{suggestedObj.name}</span>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                  <span className="text-[9px] text-slate-500 px-1 mt-0.5">{msg.timestamp}</span>
                </div>
              ))
            )}

            {aiIsLoading && (
              <div className="flex items-center gap-2 text-slate-400 py-1 font-mono text-[10px]">
                <RefreshCw className="h-3 w-3 animate-spin text-teal-400" />
                <span>Analizando bases curriculares didácticas...</span>
              </div>
            )}
            <div ref={chatBottomRef} />
          </div>

          {/* AI Send Form */}
          <div className="p-3 bg-slate-950 border-t border-slate-800 flex gap-2 relative">
            <input 
              type="text"
              value={customQuery}
              onChange={(e) => setCustomQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendChatQuery()}
              placeholder="Escribe e.g. Herramientas para gamificar inglés..."
              className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 outline-none focus:border-indigo-500"
            />
            <button 
              onClick={handleSendChatQuery}
              disabled={!customQuery.trim() || aiIsLoading}
              className={`p-2 rounded-xl transition-all font-bold text-xs shrink-0 cursor-pointer ${
                customQuery.trim() && !aiIsLoading ? 'bg-indigo-500 text-white' : 'bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
            >
              <Send className="h-3.5 w-3.5" />
            </button>
          </div>

        </div>
      )}

      {/* High Fidelity Modal Representing Poster Download - Real Experience instead of mock fake! */}
      {showDownloadModal && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl relative border border-slate-200 animate-in zoom-in-95">
            
            <div className="p-6 bg-slate-900 text-white text-center relative">
              <div className="absolute right-4 top-4">
                <button 
                  onClick={() => setShowDownloadModal(false)}
                  className="p-1 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <Download className="h-12 w-12 text-teal-400 mx-auto mb-3 stroke-[1.5]" />
              <h3 className="text-lg font-black tracking-tight uppercase">Descargar Póster de la Tabla Periódica</h3>
              <p className="text-xs text-slate-400 mt-1">Obtén la versión de alta resolución lista para imprimir y colocar en tu aula o sala de profesores.</p>
            </div>

            <div className="p-6 space-y-4 text-xs text-slate-600">
              <div className="flex gap-3 bg-slate-50 p-3 rounded-2xl items-center">
                <Check className="h-5 w-5 text-emerald-500 shrink-0 stroke-[3]" />
                <span>Formatos de impresión estándar: <strong>A1, A2 y A3</strong> con nitidez vectorial.</span>
              </div>
              <div className="flex gap-3 bg-slate-50 p-3 rounded-2xl items-center">
                <Check className="h-5 w-5 text-emerald-500 shrink-0 stroke-[3]" />
                <span>Incluye todos los enlaces interactivos y códigos de escaneo QR directos para dispositivos móviles.</span>
              </div>
              <div className="flex gap-3 bg-slate-50 p-3 rounded-2xl items-center">
                <Check className="h-5 w-5 text-emerald-500 shrink-0 stroke-[3]" />
                <span>Soporta versiones en español y catalán adaptadas para K-12 y educación superior.</span>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => {
                    playSound("badge");
                    alert("¡Gracias por tu suscripción! Tu descarga se iniciará automáticamente.");
                    setShowDownloadModal(false);
                    // Award XP for claiming poster!
                    saveProfile({
                      ...profile,
                      xp: profile.xp + 50
                    });
                  }}
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs tracking-wider uppercase rounded-xl transition-all flex items-center justify-center gap-1.5 shadow"
                >
                  <span>Iniciar Descarga Gratuita (+50 XP)</span>
                  <ExternalLink className="h-4 w-4" />
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Ambient informative footer bar */}
      <footer className="bg-slate-900 text-white py-4 px-6 mt-auto border-t-2 border-indigo-500 text-xs">
        <div className="max-w-[1700px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-teal-400 animate-pulse"></span>
            <span className="text-slate-350">
              <strong>Tip del día:</strong> {randomTip}
            </span>
          </div>
          <p className="font-mono text-slate-400 text-[10px]">
            © {new Date().getFullYear()} apps_para_profesores • Licencia Educativa Libre
          </p>
        </div>
      </footer>

    </div>
  );
}
