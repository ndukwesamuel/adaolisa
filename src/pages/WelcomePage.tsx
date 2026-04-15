// import { useNavigate }         from 'react-router-dom';
// import { useAuth }             from '@/store/AuthContext';
// import type { ModuleCategory } from '@/types';

// interface ModuleCfg {
//   id: ModuleCategory; title: string; description: string; icon: string;
//   topics: string[]; questions: number; duration: string;
//   colors: { icon: string; btn: string; tag: string; border: string; };
// }

// const MODULES: ModuleCfg[] = [
//   {
//     id: 'numerical', title: 'Numerical Reasoning', icon: '🔢', questions: 25, duration: '12 min',
//     description: 'Percentages, ratios, data tables, profit & loss. The core of every bank aptitude test.',
//     topics: ['Percentages & Change', 'Ratios', 'Data Interpretation', 'Profit & Loss', 'Interest'],
//     colors: { icon: 'bg-brand-500/10 text-brand-500', btn: 'bg-brand-500 hover:bg-brand-600 text-white', tag: 'bg-brand-500/10 text-brand-500', border: 'hover:border-brand-500/30' },
//   },
//   {
//     id: 'verbal', title: 'Verbal Reasoning', icon: '📖', questions: 12, duration: '10 min',
//     description: 'Reading comprehension, True/False/Cannot Say, vocabulary and grammar.',
//     topics: ['Comprehension', 'True / False / Cannot Say', 'Vocabulary', 'Grammar'],
//     colors: { icon: 'bg-blue-500/10 text-blue-400', btn: 'bg-blue-500 hover:bg-blue-600 text-white', tag: 'bg-blue-500/10 text-blue-400', border: 'hover:border-blue-500/30' },
//   },
//   {
//     id: 'logical', title: 'Logical Reasoning', icon: '🧠', questions: 12, duration: '10 min',
//     description: 'Number sequences, deductive logic, pattern recognition and syllogisms.',
//     topics: ['Number Sequences', 'Deductive Logic', 'Odd One Out', 'Syllogisms'],
//     colors: { icon: 'bg-purple-500/10 text-purple-400', btn: 'bg-purple-500 hover:bg-purple-600 text-white', tag: 'bg-purple-500/10 text-purple-400', border: 'hover:border-purple-500/30' },
//   },
// ];

// export default function WelcomePage() {
//   const { user, logout } = useAuth();
//   const navigate         = useNavigate();

//   return (
//     <div className="min-h-screen bg-gray-950 pb-20">
//       <header className="border-b border-gray-800 px-4 sm:px-6 py-4">
//         <div className="max-w-3xl mx-auto flex items-center justify-between">
//           <div className="flex items-center gap-2">
//             <span className="text-xl">🏦</span>
//             <span className="font-bold text-white">BankReady</span>
//           </div>
//           <div className="flex items-center gap-2 sm:gap-4">
//             <button onClick={() => navigate('/history')} className="btn-ghost text-sm">My Progress</button>
//             <div className="flex items-center gap-2">
//               <div className="w-8 h-8 rounded-full bg-brand-500/20 border border-brand-500/30 flex items-center justify-center text-brand-500 font-bold text-sm">
//                 {user?.name.charAt(0).toUpperCase()}
//               </div>
//               <span className="text-sm text-gray-300 hidden sm:block">{user?.name}</span>
//             </div>
//             <button onClick={logout} className="btn-ghost text-sm text-gray-600">Logout</button>
//           </div>
//         </div>
//       </header>

//       <main className="max-w-3xl mx-auto px-4 pt-12 animate-fade-in">
//         <div className="text-center mb-12">
//           <div className="inline-flex items-center gap-2 bg-brand-500/10 border border-brand-500/20 text-brand-500 text-xs font-bold px-4 py-2 rounded-full mb-6 uppercase tracking-widest">
//             Banking Readiness Assessment
//           </div>
//           <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight mb-4">
//             Test Your Banking<br />
//             <span className="text-brand-500">Graduate Readiness</span>
//           </h1>
//           <p className="text-gray-400 text-lg max-w-xl mx-auto leading-relaxed">
//             Practice the exact style of questions used in graduate trainee aptitude tests at GTBank, Zenith, Access, First Bank, and UBA.
//           </p>
//         </div>

//         <div className="space-y-4 mb-10">
//           {MODULES.map((mod) => (
//             <div key={mod.id} className={`card p-6 border transition-colors duration-150 ${mod.colors.border}`}>
//               <div className="flex items-start gap-4 mb-4">
//                 <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 ${mod.colors.icon}`}>
//                   {mod.icon}
//                 </div>
//                 <div className="flex-1 min-w-0">
//                   <h2 className="text-white font-bold text-lg leading-tight">{mod.title}</h2>
//                   <p className="text-gray-400 text-sm mt-1 leading-relaxed">{mod.description}</p>
//                 </div>
//               </div>
//               <div className="flex flex-wrap gap-1.5 mb-5">
//                 {mod.topics.map((t) => (
//                   <span key={t} className={`tag ${mod.colors.tag}`}>{t}</span>
//                 ))}
//               </div>
//               <div className="flex items-center justify-between gap-4">
//                 <div className="flex gap-4 text-xs text-gray-500">
//                   <span>📚 {mod.questions}+ questions</span>
//                   <span>⏱️ ~{mod.duration}</span>
//                 </div>
//                 <button
//                   onClick={() => navigate(`/test/${mod.id}`)}
//                   className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-150 active:scale-95 flex-shrink-0 ${mod.colors.btn}`}
//                 >
//                   Start →
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>

//         <div className="flex justify-center">
//           <button onClick={() => navigate('/history')} className="btn-secondary px-10 py-3 text-base">
//             View My Progress
//           </button>
//         </div>
//       </main>
//     </div>
//   );
// }

import { useNavigate } from "react-router-dom";
import { useAuth } from "@/store/AuthContext";
import type { ModuleCategory } from "@/types";

interface ModuleCfg {
  id: ModuleCategory;
  title: string;
  description: string;
  icon: string;
  topics: string[];
  questions: number;
  duration: string;
  colors: { icon: string; btn: string; tag: string; border: string };
}

const MODULES: ModuleCfg[] = [
  {
    id: "numerical",
    title: "Numerical Reasoning",
    icon: "🔢",
    questions: 25,
    duration: "12 min",
    description:
      "Percentages, ratios, data tables, profit & loss. The core of every bank aptitude test.",
    topics: [
      "Percentages & Change",
      "Ratios",
      "Data Interpretation",
      "Profit & Loss",
      "Interest",
    ],
    colors: {
      icon: "bg-brand-500/10 text-brand-500",
      btn: "bg-brand-500 hover:bg-brand-600 text-white",
      tag: "bg-brand-500/10 text-brand-500",
      border: "hover:border-brand-500/30",
    },
  },
  {
    id: "verbal",
    title: "Verbal Reasoning",
    icon: "📖",
    questions: 12,
    duration: "10 min",
    description:
      "Reading comprehension, True/False/Cannot Say, vocabulary and grammar.",
    topics: [
      "Comprehension",
      "True / False / Cannot Say",
      "Vocabulary",
      "Grammar",
    ],
    colors: {
      icon: "bg-blue-500/10 text-blue-400",
      btn: "bg-blue-500 hover:bg-blue-600 text-white",
      tag: "bg-blue-500/10 text-blue-400",
      border: "hover:border-blue-500/30",
    },
  },
  {
    id: "logical",
    title: "Logical Reasoning",
    icon: "🧠",
    questions: 12,
    duration: "10 min",
    description:
      "Number sequences, deductive logic, pattern recognition and syllogisms.",
    topics: [
      "Number Sequences",
      "Deductive Logic",
      "Odd One Out",
      "Syllogisms",
    ],
    colors: {
      icon: "bg-purple-500/10 text-purple-400",
      btn: "bg-purple-500 hover:bg-purple-600 text-white",
      tag: "bg-purple-500/10 text-purple-400",
      border: "hover:border-purple-500/30",
    },
  },
  {
    id: "abstract",
    title: "Abstract Reasoning",
    icon: "🔷",
    questions: 10,
    duration: "10 min",
    description:
      "Pattern matrices, shape sequences, rule identification and spatial reasoning.",
    topics: [
      "Number Matrices",
      "Pattern Recognition",
      "Series Completion",
      "Rule Identification",
    ],
    colors: {
      icon: "bg-orange-500/10 text-orange-400",
      btn: "bg-orange-500 hover:bg-orange-600 text-white",
      tag: "bg-orange-500/10 text-orange-400",
      border: "hover:border-orange-500/30",
    },
  },
];

export default function WelcomePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-950 pb-20">
      <header className="border-b border-gray-800 px-4 sm:px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">🏦</span>
            <span className="font-bold text-white">BankReady</span>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <button
              onClick={() => navigate("/history")}
              className="btn-ghost text-sm"
            >
              My Progress
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-brand-500/20 border border-brand-500/30 flex items-center justify-center text-brand-500 font-bold text-sm">
                {user?.name.charAt(0).toUpperCase()}
              </div>
              <span className="text-sm text-gray-300 hidden sm:block">
                {user?.name}
              </span>
            </div>
            <button
              onClick={logout}
              className="btn-ghost text-sm text-gray-600"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 pt-12 animate-fade-in">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-brand-500/10 border border-brand-500/20 text-brand-500 text-xs font-bold px-4 py-2 rounded-full mb-6 uppercase tracking-widest">
            Banking Readiness Assessment
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight mb-4">
            Test Your Banking
            <br />
            <span className="text-brand-500">Graduate Readiness</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-xl mx-auto leading-relaxed">
            Practice the exact style of questions used in graduate trainee
            aptitude tests at GTBank, Zenith, Access, First Bank, and UBA.
          </p>
        </div>

        <div className="space-y-4 mb-10">
          {MODULES.map((mod) => (
            <div
              key={mod.id}
              className={`card p-6 border transition-colors duration-150 ${mod.colors.border}`}
            >
              <div className="flex items-start gap-4 mb-4">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 ${mod.colors.icon}`}
                >
                  {mod.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-white font-bold text-lg leading-tight">
                    {mod.title}
                  </h2>
                  <p className="text-gray-400 text-sm mt-1 leading-relaxed">
                    {mod.description}
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5 mb-5">
                {mod.topics.map((t) => (
                  <span key={t} className={`tag ${mod.colors.tag}`}>
                    {t}
                  </span>
                ))}
              </div>
              <div className="flex items-center justify-between gap-4">
                <div className="flex gap-4 text-xs text-gray-500">
                  <span>📚 {mod.questions}+ questions</span>
                  <span>⏱️ ~{mod.duration}</span>
                </div>
                <button
                  onClick={() => navigate(`/test/${mod.id}`)}
                  className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-150 active:scale-95 flex-shrink-0 ${mod.colors.btn}`}
                >
                  Start →
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center">
          <button
            onClick={() => navigate("/history")}
            className="btn-secondary px-10 py-3 text-base"
          >
            View My Progress
          </button>
        </div>
      </main>
    </div>
  );
}
