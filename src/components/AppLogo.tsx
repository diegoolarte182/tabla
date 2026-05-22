import React from "react";

interface AppLogoProps {
  id: string;
  name: string;
  className?: string;
}

export default function AppLogo({ id, name, className = "h-8 w-8" }: AppLogoProps) {
  // We return high-fidelity SVG/CSS mock logos mimicking each app's real brand icon
  switch (id) {
    case "canva":
      return (
        <div className={`${className} bg-teal-500 rounded-xl flex items-center justify-center font-extrabold text-white text-base overflow-hidden relative shadow-sm`}>
          <div className="absolute inset-0 bg-gradient-to-tr from-cyan-600 via-indigo-500 to-purple-500 opacity-90" />
          <span className="relative font-bold select-none text-[13px] tracking-tighter">C</span>
        </div>
      );
    case "genially":
      return (
        <div className={`${className} bg-slate-900 rounded-xl flex items-center justify-center relative overflow-hidden shadow-sm`}>
          <div className="absolute -left-1 -bottom-1 w-6 h-6 bg-cyan-400 rounded-full blur-md opacity-70" />
          <div className="absolute -right-1 -top-1 w-6 h-6 bg-purple-500 rounded-full blur-md opacity-70" />
          <svg viewBox="0 0 24 24" className="w-[18px] h-[18px] relative text-white" fill="none" stroke="currentColor" strokeWidth="3">
            <circle cx="12" cy="12" r="5" />
            <circle cx="12" cy="12" r="1" fill="currentColor" />
          </svg>
        </div>
      );
    case "kahoot":
      return (
        <div className={`${className} bg-purple-700 rounded-xl flex items-center justify-center text-white font-black text-sm shadow-sm`}>
          K!
        </div>
      );
    case "quizizz":
      return (
        <div className={`${className} bg-purple-900/90 rounded-xl flex items-center justify-center relative shadow-sm`}>
          <span className="font-extrabold text-purple-400 text-xs">Q</span>
          <div className="absolute top-1.5 right-1.5 w-1 h-1 bg-amber-400 rounded-full" />
        </div>
      );
    case "nearpod":
      return (
        <div className={`${className} bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center p-1 shadow-sm`}>
          <div className="border-2 border-white rounded-lg w-full h-full flex items-center justify-center">
            <span className="text-[10px] font-black text-white">N</span>
          </div>
        </div>
      );
    case "padlet":
      return (
        <div className={`${className} bg-gradient-to-br from-rose-400 to-amber-400 rounded-xl flex items-center justify-center shadow-sm`}>
          <svg viewBox="0 0 24 24" className="w-5 h-5 text-white" fill="currentColor">
            <path d="M12 2a4 4 0 014 4c0 1.25-.57 2.4-1.5 3.2l2 4.8a1 1 0 01-1.8.8l-1.7-4a4 4 0 01-2 0l-1.7 4a1 1 0 01-1.8-.8l2-4.8A4 4 0 018 6a4 4 0 014-4z" />
          </svg>
        </div>
      );
    case "google-classroom":
      return (
        <div className={`${className} bg-emerald-600 rounded-xl flex items-center justify-center p-1.5 border border-yellow-500/80 shadow-sm`}>
          <div className="bg-emerald-950 w-full h-full rounded flex items-center justify-center text-[10px] text-yellow-400 font-extrabold">
            GC
          </div>
        </div>
      );
    case "moodle":
      return (
        <div className={`${className} bg-amber-500 rounded-xl flex items-slate-end justify-center font-black text-slate-900 text-lg shadow-sm relative overflow-hidden`}>
          <span className="mb-0.5 relative z-10 font-black">m</span>
          <div className="absolute top-0.5 right-0.5 bg-black text-[7px] text-white p-0.5 py-0 rounded-sm leading-none font-bold">^</div>
        </div>
      );
    case "trello":
      return (
        <div className={`${className} bg-blue-600 rounded-xl flex gap-1 p-1 items-stretch shadow-sm`}>
          <div className="bg-white rounded w-full h-2/3" />
          <div className="bg-white rounded w-full h-full" />
        </div>
      );
    case "duolingo":
      return (
        <div className={`${className} bg-lime-500 rounded-xl flex items-center justify-center shadow-sm relative overflow-hidden`}>
          <div className="w-5 h-5 bg-lime-300 rounded-full flex items-center justify-center font-bold text-xs text-lime-900">
            🦉
          </div>
        </div>
      );
    case "scratch":
      return (
        <div className={`${className} bg-amber-500 rounded-xl flex items-center justify-center font-extrabold text-white text-sm shadow-sm relative`}>
          <span className="text-orange-950 font-black">S</span>
          <div className="absolute right-1 bottom-1 w-2.5 h-2.5 bg-orange-600 rounded-sm" />
        </div>
      );
    case "miro":
      return (
        <div className={`${className} bg-slate-950 rounded-xl flex flex-col items-center justify-center p-1 shadow-sm`}>
          <div className="flex gap-0.5">
            <div className="w-1.5 h-3 bg-yellow-400 rounded-sm transform -rotate-12" />
            <div className="w-1.5 h-3.5 bg-yellow-400 rounded-sm" />
            <div className="w-1.5 h-3 bg-yellow-400 rounded-sm transform rotate-12" />
          </div>
        </div>
      );
    case "notion":
      return (
        <div className={`${className} bg-white rounded-xl border border-slate-350 flex items-center justify-center text-slate-950 font-black text-sm shadow-sm`}>
          N
        </div>
      );
    case "pear-deck":
      return (
        <div className={`${className} bg-lime-600 rounded-xl flex items-center justify-center shadow-sm relative`}>
          <div className="w-4 h-4 bg-lime-400 rounded-full rounded-tr-none transform rotate-45" />
          <div className="absolute bg-emerald-850 h-1.5 w-1.5 top-1.5 right-1.5 rounded-full" />
        </div>
      );
    case "mentimeter":
      return (
        <div className={`${className} bg-gradient-to-b from-indigo-500 to-pink-500 rounded-xl flex items-end justify-center p-1 gap-1 shadow-sm`}>
          <div className="h-3 w-1 bg-white/60 rounded" />
          <div className="h-4.5 w-1 bg-white rounded" />
          <div className="h-2 w-1 bg-white/40 rounded" />
        </div>
      );
    case "socrative":
      return (
        <div className={`${className} bg-cyan-600 rounded-xl flex items-center justify-center text-white font-bold tracking-tighter text-xs shadow-sm`}>
          Socr
        </div>
      );
    case "edpuzzle":
      return (
        <div className={`${className} bg-yellow-400 rounded-xl flex items-center justify-center shadow-sm p-1`}>
          <div className="bg-indigo-950 w-full h-full rounded-lg flex items-center justify-center text-[10px] text-yellow-300 font-extrabold">
            Ed
          </div>
        </div>
      );
    case "wordwall":
      return (
        <div className={`${className} bg-blue-500 rounded-xl flex items-center justify-center text-white font-extrabold text-xs shadow-sm`}>
          Ww
        </div>
      );
    case "flipgrid":
      return (
        <div className={`${className} bg-emerald-500 rounded-xl flex items-center justify-center shadow-sm`}>
          <span className="text-white font-black text-sm tracking-tighter">F</span>
          <span className="text-lime-300 font-extrabold text-base leading-none">+</span>
        </div>
      );
    case "classdojo":
      return (
        <div className={`${className} bg-sky-400 rounded-xl flex items-center justify-center text-white shadow-sm font-semibold`}>
          🟢
        </div>
      );
    case "khan-academy":
      return (
        <div className={`${className} bg-emerald-900 rounded-xl flex items-center justify-center p-1.5 shadow-sm`}>
          <svg viewBox="0 0 24 24" className="w-full h-full text-lime-400" fill="currentColor">
            <path d="M12 2L2 22h20z" />
          </svg>
        </div>
      );
    case "ted":
      return (
        <div className={`${className} bg-red-600 rounded-xl flex items-center justify-center text-white font-black text-xs shadow-sm`}>
          TED
        </div>
      );
    case "jamboard":
      return (
        <div className={`${className} bg-amber-500 rounded-xl flex items-center justify-center p-1 shadow-sm`}>
          <div className="bg-slate-900 rounded-full w-full h-full flex items-center justify-center text-[9px] text-amber-400 font-extrabold">
            Jb
          </div>
        </div>
      );
    case "piktochart":
      return (
        <div className={`${className} bg-teal-600 rounded-xl flex items-center justify-center text-white font-bold text-xs shadow-sm`}>
          P
        </div>
      );
    case "visme":
      return (
        <div className={`${className} bg-sky-900 rounded-xl flex items-center justify-center relative overflow-hidden shadow-sm`}>
          <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-sky-500 opacity-80" />
          <span className="relative z-10 text-[9px] font-black text-white">Visme</span>
        </div>
      );
    case "powtoon":
      return (
        <div className={`${className} bg-indigo-900 rounded-xl flex items-center justify-center text-yellow-400 font-black p-0.5 text-[8px] tracking-tighter leading-none shadow-sm`}>
          POW!
        </div>
      );
    case "pixton":
      return (
        <div className={`${className} bg-yellow-400 rounded-xl flex items-center justify-center text-slate-950 font-black text-sm shadow-sm`}>
          P!
        </div>
      );
    case "telegram":
      return (
        <div className={`${className} bg-sky-500 rounded-xl flex items-center justify-center p-1 shadow-sm`}>
          <svg viewBox="0 0 24 24" className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M22 2L2 8.5l7.5 2.5 2 6.5 3.5-4.5L19 18z" />
          </svg>
        </div>
      );
    case "slack":
      return (
        <div className={`${className} bg-slate-900 rounded-xl flex items-center justify-center shadow-sm`}>
          <span className="text-emerald-400 font-black text-xs">#</span>
        </div>
      );
    case "discord":
      return (
        <div className={`${className} bg-indigo-600 rounded-xl flex items-center justify-center p-1 shadow-sm`}>
          <span className="text-white text-xs font-black">👾</span>
        </div>
      );
    case "goconqr":
      return (
        <div className={`${className} bg-cyan-700 rounded-xl flex items-center justify-center text-white font-black text-xs shadow-sm`}>
          GoQ
        </div>
      );
    case "emaze":
      return (
        <div className={`${className} bg-rose-600 rounded-xl flex items-center justify-center text-white font-extrabold text-xs shadow-sm`}>
          Ez
        </div>
      );
    case "teams":
      return (
        <div className={`${className} bg-[#4B53BC] rounded-xl flex items-center justify-center text-white font-black text-xs shadow-sm`}>
          T
        </div>
      );
    case "classcraft":
      return (
        <div className={`${className} bg-yellow-600 rounded-xl flex items-center justify-center text-white font-bold text-xs shadow-sm`}>
          CC
        </div>
      );
    case "polleverywhere":
      return (
        <div className={`${className} bg-blue-850 rounded-xl flex items-slate-end justify-center gap-0.5 p-1.5 shadow-sm`}>
          <div className="w-2 h-4 bg-blue-400 rounded" />
          <div className="w-2 h-5 bg-blue-300 rounded" />
          <div className="w-2 h-3 bg-blue-500 rounded" />
        </div>
      );
    case "educaplay":
      return (
        <div className={`${className} bg-amber-600 rounded-xl flex items-center justify-center text-white font-bold text-xs shadow-sm`}>
          Edu
        </div>
      );
    case "plickers":
      return (
        <div className={`${className} bg-sky-950 rounded-xl flex items-center justify-center text-lime-400 font-extrabold text-[11px] shadow-sm`}>
          PL
        </div>
      );
    case "hourofcode":
      return (
        <div className={`${className} bg-orange-650 rounded-xl flex items-center justify-center text-white font-black text-[9px] text-center uppercase tracking-tighter leading-none shadow-sm`}>
          Hour<br/>Code
        </div>
      );
    case "explain-everything":
      return (
        <div className={`${className} bg-indigo-500 rounded-xl flex items-center justify-center text-white font-bold text-xs shadow-sm`}>
          EE
        </div>
      );
    case "mindmeister":
      return (
        <div className={`${className} bg-purple-600 rounded-xl flex items-center justify-center shadow-sm`}>
          <span className="text-white text-xs">🧠</span>
        </div>
      );
    case "stormboard":
      return (
        <div className={`${className} bg-blue-550 rounded-xl flex items-center justify-center text-white font-black text-xs shadow-sm`}>
          SB
        </div>
      );
    case "office-365":
      return (
        <div className={`${className} bg-[#EB3C00] rounded-xl flex items-center justify-center text-white text-xs font-black shadow-sm`}>
          O
        </div>
      );
    case "google-suite":
      return (
        <div className={`${className} bg-white rounded-xl border border-slate-200 flex items-center justify-center text-slate-800 text-xs font-black shadow-sm`}>
          G
        </div>
      );
    case "thinglink":
      return (
        <div className={`${className} bg-[#00AAFF] rounded-xl flex items-center justify-center text-white font-extrabold text-xs shadow-sm`}>
          Tl
        </div>
      );
    case "flipsnack":
      return (
        <div className={`${className} bg-[hotpink] rounded-xl flex items-center justify-center text-white font-bold text-xs shadow-sm`}>
          Fs
        </div>
      );
    case "h5p":
      return (
        <div className={`${className} bg-[#1D212F] rounded-xl flex items-center justify-center text-white font-extrabold text-xs shadow-sm`}>
          H5P
        </div>
      );
    case "liveworksheets":
      return (
        <div className={`${className} bg-[#2FBDDC] rounded-xl flex items-center justify-center text-white font-bold text-xs shadow-sm`}>
          LW
        </div>
      );
    case "quizlet":
      return (
        <div className={`${className} bg-[#304FFE] rounded-xl flex items-center justify-center text-white font-black text-xs shadow-sm`}>
          Q
        </div>
      );
    case "google-forms":
      return (
        <div className={`${className} bg-purple-700 rounded-xl flex items-center justify-center text-white font-black text-xs shadow-sm`}>
          Form
        </div>
      );
    case "app-inventor":
      return (
        <div className={`${className} bg-amber-600 rounded-xl flex items-center justify-center text-white font-bold text-xs shadow-sm`}>
          App
        </div>
      );
    case "airtable":
      return (
        <div className={`${className} bg-rose-500 rounded-xl flex items-center justify-center text-slate-950 font-black text-xs shadow-sm p-1`}>
          <div className="bg-white rounded w-full h-full flex items-center justify-center font-bold">A</div>
        </div>
      );
    case "deepstash":
      return (
        <div className={`${className} bg-slate-900 rounded-xl flex items-center justify-center text-yellow-400 font-extrabold text-xs shadow-sm`}>
          D
        </div>
      );
    case "google-scholar":
      return (
        <div className={`${className} bg-[#4285F4] rounded-xl flex items-center justify-center text-white font-bold text-xs shadow-sm`}>
          🎓
        </div>
      );
    case "youtube":
      return (
        <div className={`${className} bg-red-650 rounded-xl flex items-center justify-center text-white font-extrabold text-xs shadow-sm`}>
          ▶
        </div>
      );
    case "slideshare":
      return (
        <div className={`${className} bg-cyan-600 rounded-xl flex items-center justify-center text-white font-black text-xs shadow-sm`}>
          SS
        </div>
      );
    case "podcast":
      return (
        <div className={`${className} bg-indigo-500 rounded-xl flex items-center justify-center text-teal-300 font-bold text-xs shadow-sm`}>
          🎙
        </div>
      );
    case "medium":
      return (
        <div className={`${className} bg-slate-900 rounded-xl flex items-center justify-center text-white font-black text-[13px] shadow-sm`}>
          M
        </div>
      );
    case "exelearning":
      return (
        <div className={`${className} bg-slate-800 rounded-xl flex items-center justify-center text-white font-black text-xs shadow-sm`}>
          Ex
        </div>
      );
    case "symbaloo":
      return (
        <div className={`${className} bg-indigo-900 rounded-xl flex items-center justify-center text-white font-black text-xs shadow-sm`}>
          ★
        </div>
      );
    case "wordpress":
      return (
        <div className={`${className} bg-sky-850 rounded-xl flex items-center justify-center text-white font-black text-[13px] shadow-sm`}>
          W
        </div>
      );
    case "blogger":
      return (
        <div className={`${className} bg-orange-500 rounded-xl flex items-center justify-center text-white font-black text-xs shadow-sm`}>
          B
        </div>
      );
    case "google-sites":
      return (
        <div className={`${className} bg-indigo-650 rounded-xl flex items-center justify-center text-white font-black text-xs shadow-sm`}>
          GS
        </div>
      );
    case "edmodo":
      return (
        <div className={`${className} bg-[#2FBDDC] rounded-xl flex items-center justify-center text-white font-black text-xs shadow-sm`}>
          E
        </div>
      );
    case "wakelet":
      return (
        <div className={`${className} bg-sky-500 rounded-xl flex items-center justify-center text-white font-black text-xs shadow-sm`}>
          Wk
        </div>
      );
    case "scoopit":
      return (
        <div className={`${className} bg-slate-950 rounded-xl flex items-center justify-center text-lime-400 font-black text-xs shadow-sm`}>
          it!
        </div>
      );
    default:
      // default letter mock
      return (
        <div className={`${className} bg-slate-900 rounded-xl flex items-center justify-center text-white font-black text-xs uppercase shadow-sm`}>
          {name.slice(0, 2)}
        </div>
      );
  }
}
