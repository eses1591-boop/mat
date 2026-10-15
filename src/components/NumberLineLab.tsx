import React, { useState } from 'react';
import { NumberLineVisualizer } from './NumberLineVisualizer';
import { ArrowLeft, Sparkles, RefreshCw, HelpCircle, Check, Award } from 'lucide-react';
import confetti from 'canvas-confetti';
import { sounds } from '../utils/sound';

interface LabProps {
  onBackToMenu: () => void;
}

export const NumberLineLab: React.FC<LabProps> = ({ onBackToMenu }) => {
  const [selectedVal, setSelectedVal] = useState<number>(-5);
  const [comparisonVal, setComparisonVal] = useState<number>(4);
  const [miniQuizScore, setMiniQuizScore] = useState<number>(0);
  const [quizFeedback, setQuizFeedback] = useState<string | null>(null);

  // Quick challenge generator
  const [challengeTarget, setChallengeTarget] = useState<number>(7);

  const testChallenge = (testNum: number) => {
    if (Math.abs(testNum) === challengeTarget) {
      sounds.playCorrect();
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.7 },
      });
      setQuizFeedback(`Harika! |${testNum > 0 ? '+' + testNum : testNum}| = ${challengeTarget} doğru!`);
      setMiniQuizScore((prev) => prev + 10);
      setTimeout(() => {
        setChallengeTarget(Math.floor(Math.random() * 8) + 2);
        setQuizFeedback(null);
      }, 1500);
    } else {
      sounds.playWrong();
      setQuizFeedback(`Tekrar dene! |${testNum}| = ${Math.abs(testNum)}, hedefimiz ise ${challengeTarget}.`);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Top Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-800/80 border border-slate-700/80 p-4 rounded-2xl">
        <button
          onClick={onBackToMenu}
          className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 active:scale-95 text-white font-semibold rounded-xl text-sm transition"
        >
          <ArrowLeft className="w-4 h-4" /> Ana Menü
        </button>

        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-amber-500/20 text-amber-300 rounded-lg">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-extrabold text-base sm:text-lg text-white">Sayı Doğrusu Laboratuvarı</h2>
            <p className="text-xs text-slate-400">Özgürce dene, gör, keşfet!</p>
          </div>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-xl font-bold text-sm">
          <Award className="w-4 h-4" /> Lab Skoru: {miniQuizScore}
        </div>
      </div>

      {/* Main Interactive Visualizer */}
      <NumberLineVisualizer
        value={selectedVal}
        interactive={true}
        onChangeValue={(val) => {
          setSelectedVal(val);
          sounds.playClick();
        }}
        min={-8}
        max={8}
      />

      {/* Math inspector breakdown */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-800/80 border border-slate-700/80 p-4 rounded-2xl text-center">
          <span className="text-xs text-slate-400 uppercase tracking-wider font-bold">Seçilen Sayı</span>
          <div className="text-3xl font-black text-amber-400 mt-1 font-mono">
            {selectedVal > 0 ? `+${selectedVal}` : selectedVal}
          </div>
          <span className="text-xs text-slate-400 mt-1 block">
            {selectedVal < 0 ? 'Negatif tam sayı' : selectedVal > 0 ? 'Pozitif tam sayı' : 'Başlangıç (Nötr)'}
          </span>
        </div>

        <div className="bg-slate-800/80 border border-slate-700/80 p-4 rounded-2xl text-center">
          <span className="text-xs text-slate-400 uppercase tracking-wider font-bold">Mutlak Değer</span>
          <div className="text-3xl font-black text-emerald-400 mt-1 font-mono">
            |{selectedVal > 0 ? `+${selectedVal}` : selectedVal}| = {Math.abs(selectedVal)}
          </div>
          <span className="text-xs text-emerald-400/80 mt-1 block font-medium">
            0 noktasına {Math.abs(selectedVal)} birim uzaklık
          </span>
        </div>

        <div className="bg-slate-800/80 border border-slate-700/80 p-4 rounded-2xl text-center">
          <span className="text-xs text-slate-400 uppercase tracking-wider font-bold">Dış Eksi Durumu</span>
          <div className="text-3xl font-black text-rose-400 mt-1 font-mono">
            -|{selectedVal}| = -{Math.abs(selectedVal)}
          </div>
          <span className="text-xs text-rose-300/80 mt-1 block font-medium">
            Dıştaki eksi kalır!
          </span>
        </div>
      </div>

      {/* Side-by-Side Comparison Sandbox */}
      <div className="bg-slate-800/60 border border-slate-700/70 p-5 rounded-2xl space-y-4">
        <h3 className="font-bold text-base text-white flex items-center gap-2">
          <RefreshCw className="w-4 h-4 text-cyan-400" /> İki Sayının Mutlak Değerini Karşılaştır
        </h3>
        <div className="flex flex-wrap items-center justify-center gap-4 text-center">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-slate-300">1. Sayı:</span>
            <input
              type="number"
              min={-20}
              max={20}
              value={selectedVal}
              onChange={(e) => setSelectedVal(Number(e.target.value))}
              className="w-16 bg-slate-900 border border-slate-600 rounded-lg p-2 text-center text-white font-mono font-bold"
            />
          </div>

          <div className="px-4 py-2 bg-slate-900 border border-slate-700 rounded-xl font-mono font-bold text-lg text-amber-300">
            |{selectedVal}|{' '}
            {Math.abs(selectedVal) > Math.abs(comparisonVal)
              ? '>'
              : Math.abs(selectedVal) < Math.abs(comparisonVal)
              ? '<'
              : '='}{' '}
            |{comparisonVal}|
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-slate-300">2. Sayı:</span>
            <input
              type="number"
              min={-20}
              max={20}
              value={comparisonVal}
              onChange={(e) => setComparisonVal(Number(e.target.value))}
              className="w-16 bg-slate-900 border border-slate-600 rounded-lg p-2 text-center text-white font-mono font-bold"
            />
          </div>
        </div>
        <div className="text-xs text-center text-slate-400">
          Çünkü <strong className="text-white">{Math.abs(selectedVal)}</strong> ile <strong className="text-white">{Math.abs(comparisonVal)}</strong> sayıları karşılaştırılıyor.
        </div>
      </div>

      {/* Interactive Mini Mission */}
      <div className="bg-gradient-to-r from-indigo-950/60 to-purple-950/60 border border-indigo-500/40 p-5 rounded-2xl">
        <div className="flex items-center gap-2 font-bold text-base text-indigo-300 mb-2">
          <HelpCircle className="w-5 h-5" /> Hızlı Görev: Mutlak değeri {challengeTarget} olan sayıyı bul!
        </div>
        <p className="text-xs text-slate-300 mb-4">
          Aşağıdaki butonlardan mutlak değeri <strong>{challengeTarget}</strong> olan doğru bir tam sayı seç:
        </p>
        <div className="flex flex-wrap gap-2 justify-center">
          {[-challengeTarget, challengeTarget, challengeTarget + 2, -challengeTarget - 1, 0].map((cand, idx) => (
            <button
              key={idx}
              onClick={() => testChallenge(cand)}
              className="px-4 py-2.5 bg-slate-800 hover:bg-indigo-600 active:scale-95 text-white font-mono font-bold rounded-xl border border-slate-700 transition shadow"
            >
              {cand > 0 ? `+${cand}` : cand}
            </button>
          ))}
        </div>
        {quizFeedback && (
          <div className="mt-3 text-center text-sm font-bold text-amber-300 animate-in fade-in">
            {quizFeedback}
          </div>
        )}
      </div>
    </div>
  );
};
