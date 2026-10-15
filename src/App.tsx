import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Heart,
  Trophy,
  Flame,
  Volume2,
  VolumeX,
  HelpCircle,
  RotateCcw,
  Sparkles,
  ArrowRight,
  Compass,
  CheckCircle2,
  XCircle,
  Lightbulb,
  Award,
  BookOpen,
  Play,
  Zap,
  Download,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Question, DifficultyLevel, GameMode, GameStats } from './types';
import { INITIAL_QUESTIONS, LEVEL_INFO, generateRandomQuestion } from './data/questions';
import { sounds } from './utils/sound';
import { NumberLineVisualizer } from './components/NumberLineVisualizer';
import { SummaryModal } from './components/SummaryModal';
import { NumberLineLab } from './components/NumberLineLab';

export default function App() {
  // Game Navigation State
  const [screen, setScreen] = useState<'menu' | 'levelSelect' | 'playing' | 'levelComplete' | 'gameOver' | 'lab'>('menu');
  const [gameMode, setGameMode] = useState<GameMode>('story');
  const [currentLevel, setCurrentLevel] = useState<DifficultyLevel>(1);
  const [unlockedLevel, setUnlockedLevel] = useState<DifficultyLevel>(1);

  // Sound state
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Guide Modal state
  const [isGuideOpen, setIsGuideOpen] = useState<boolean>(false);

  // In-Game State
  const [lives, setLives] = useState<number>(3);
  const [stats, setStats] = useState<GameStats>({
    score: 0,
    streak: 0,
    bestStreak: 0,
    correctCount: 0,
    wrongCount: 0,
    totalAnswered: 0,
  });

  // Current Questions Queue
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [levelQuestions, setLevelQuestions] = useState<Question[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<string | number | null>(null);
  const [hasAnswered, setHasAnswered] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showExplanation, setShowExplanation] = useState<boolean>(false);
  const [showHint, setShowHint] = useState<boolean>(false);

  // Timer
  const [timerEnabled, setTimerEnabled] = useState<boolean>(true);
  const [timeLeft, setTimeLeft] = useState<number>(25);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // High score in local storage
  const [highScore, setHighScore] = useState<number>(() => {
    try {
      return Number(localStorage.getItem('mutlak_deger_high_score') || 0);
    } catch {
      return 0;
    }
  });

  // Update sound enabled state
  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    sounds.enabled = next;
    if (next) sounds.playClick();
  };

  // Start Level
  const startLevel = (lvl: DifficultyLevel) => {
    setCurrentLevel(lvl);
    setGameMode('story');
    setLives(3);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setHasAnswered(false);
    setIsCorrect(null);
    setShowExplanation(false);
    setShowHint(false);

    // Pick 5 questions for this level
    const pool = INITIAL_QUESTIONS.filter((q) => q.level === lvl);
    // Shuffle and pick
    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    // If fewer than 5, generate some
    while (shuffled.length < 5) {
      shuffled.push(generateRandomQuestion(lvl));
    }
    setLevelQuestions(shuffled.slice(0, 5));
    setTimeLeft(25);
    setScreen('playing');
    sounds.playClick();
  };

  // Start Endless Mode
  const startEndless = () => {
    setGameMode('endless');
    setCurrentLevel(1);
    setLives(3);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setHasAnswered(false);
    setIsCorrect(null);
    setShowExplanation(false);
    setShowHint(false);

    const firstQuestions = [
      generateRandomQuestion(1),
      generateRandomQuestion(1),
      generateRandomQuestion(2),
      generateRandomQuestion(2),
      generateRandomQuestion(3),
    ];
    setLevelQuestions(firstQuestions);
    setTimeLeft(20);
    setScreen('playing');
    sounds.playClick();
  };

  // Timer countdown
  useEffect(() => {
    if (screen !== 'playing' || !timerEnabled || hasAnswered) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          handleTimeout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [screen, timerEnabled, hasAnswered, currentQuestionIndex]);

  const currentQ = levelQuestions[currentQuestionIndex];

  // Handle timeout
  const handleTimeout = () => {
    if (hasAnswered) return;
    setHasAnswered(true);
    setIsCorrect(false);
    setShowExplanation(true);
    sounds.playWrong();

    setLives((prev) => {
      const nextLives = prev - 1;
      if (nextLives <= 0) {
        setTimeout(() => setScreen('gameOver'), 1800);
      }
      return Math.max(0, nextLives);
    });

    setStats((prev) => ({
      ...prev,
      streak: 0,
      wrongCount: prev.wrongCount + 1,
      totalAnswered: prev.totalAnswered + 1,
    }));
  };

  // Handle Answer Selection
  const handleSelectOption = (option: string | number) => {
    if (hasAnswered) return;
    setSelectedAnswer(option);
    setHasAnswered(true);

    const isAnsCorrect = String(option) === String(currentQ.correctAnswer);
    setIsCorrect(isAnsCorrect);

    if (isAnsCorrect) {
      // Calculate score with streak multiplier
      const streakMultiplier = 1 + stats.streak * 0.2;
      const timeBonus = timerEnabled ? Math.max(0, timeLeft * 4) : 20;
      const basePoints = currentLevel * 100;
      const earned = Math.round((basePoints + timeBonus) * streakMultiplier);

      const nextStreak = stats.streak + 1;
      const nextScore = stats.score + earned;

      if (nextStreak % 3 === 0) {
        sounds.playStreak();
      } else {
        sounds.playCorrect();
      }

      // Confetti burst
      confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 0.65 },
        colors: ['#10b981', '#3b82f6', '#f59e0b', '#ec4899'],
      });

      setStats((prev) => {
        const updated = {
          ...prev,
          score: nextScore,
          streak: nextStreak,
          bestStreak: Math.max(prev.bestStreak, nextStreak),
          correctCount: prev.correctCount + 1,
          totalAnswered: prev.totalAnswered + 1,
        };
        if (nextScore > highScore) {
          setHighScore(nextScore);
          try {
            localStorage.setItem('mutlak_deger_high_score', String(nextScore));
          } catch {}
        }
        return updated;
      });
    } else {
      sounds.playWrong();
      setShowExplanation(true);

      setLives((prev) => {
        const nextLives = prev - 1;
        if (nextLives <= 0) {
          setTimeout(() => setScreen('gameOver'), 2000);
        }
        return Math.max(0, nextLives);
      });

      setStats((prev) => ({
        ...prev,
        streak: 0,
        wrongCount: prev.wrongCount + 1,
        totalAnswered: prev.totalAnswered + 1,
      }));
    }
  };

  // Next Question
  const handleNextQuestion = () => {
    sounds.playClick();
    setSelectedAnswer(null);
    setHasAnswered(false);
    setIsCorrect(null);
    setShowExplanation(false);
    setShowHint(false);
    setTimeLeft(gameMode === 'endless' ? 20 : 25);

    if (gameMode === 'story') {
      if (currentQuestionIndex + 1 >= levelQuestions.length) {
        // Level Completed!
        sounds.playVictory();
        confetti({
          particleCount: 120,
          spread: 100,
          origin: { y: 0.5 },
        });

        if (currentLevel < 3) {
          const nextLvl = (currentLevel + 1) as DifficultyLevel;
          setUnlockedLevel((prev) => (nextLvl > prev ? nextLvl : prev));
        }
        setScreen('levelComplete');
      } else {
        setCurrentQuestionIndex((prev) => prev + 1);
      }
    } else {
      // Endless mode: keep adding questions
      if (currentQuestionIndex + 1 >= levelQuestions.length) {
        const nextLvl = (Math.min(3, Math.floor(stats.correctCount / 4) + 1)) as DifficultyLevel;
        setLevelQuestions((prev) => [...prev, generateRandomQuestion(nextLvl)]);
      }
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  // Restart Game
  const resetGame = () => {
    setStats({
      score: 0,
      streak: 0,
      bestStreak: 0,
      correctCount: 0,
      wrongCount: 0,
      totalAnswered: 0,
    });
    setLives(3);
    setScreen('menu');
  };

  // Download standalone HTML file
  const downloadStandaloneHtml = async () => {
    sounds.playClick();
    try {
      const res = await fetch('/mutlak-deger-oyunu.html');
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'mutlak-deger-oyunu.html';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      window.open('/mutlak-deger-oyunu.html', '_blank');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-slate-100 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Top Universal Navigation Bar */}
      <header className="sticky top-0 z-40 bg-slate-950/70 backdrop-blur-md border-b border-slate-800/80 px-4 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          {/* Logo / Mascot brand */}
          <button
            onClick={() => {
              sounds.playClick();
              setScreen('menu');
            }}
            className="flex items-center gap-2.5 text-left group focus:outline-none"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-emerald-400 p-0.5 shadow-lg shadow-amber-500/20 group-hover:scale-105 transition">
              <div className="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center font-black text-amber-400 font-mono text-base">
                |a|
              </div>
            </div>
            <div>
              <div className="font-extrabold text-sm sm:text-base tracking-tight bg-gradient-to-r from-white via-amber-200 to-emerald-300 bg-clip-text text-transparent">
                Mutlak Değer Macerası
              </div>
              <div className="text-[11px] text-slate-400 flex items-center gap-1">
                <span>7. Sınıf Matematik</span>
                <span className="w-1 h-1 rounded-full bg-emerald-400" />
                <span className="text-emerald-400 font-medium">Uzaklık Asla Negatif Olmaz!</span>
              </div>
            </div>
          </button>

          {/* Quick Stats & Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {screen === 'playing' && (
              <>
                {/* Score */}
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800/90 border border-slate-700/80 rounded-xl text-xs sm:text-sm font-bold text-amber-300">
                  <Trophy className="w-4 h-4 text-amber-400" />
                  <span>{stats.score}</span>
                </div>

                {/* Combo Streak */}
                {stats.streak > 1 && (
                  <div className="flex items-center gap-1 px-2.5 py-1.5 bg-orange-500/20 border border-orange-500/40 rounded-xl text-xs font-black text-orange-400 animate-bounce">
                    <Flame className="w-4 h-4 text-orange-400 fill-orange-400" />
                    <span>{stats.streak}x</span>
                  </div>
                )}

                {/* Lives */}
                <div className="flex items-center gap-1 px-2.5 py-1.5 bg-rose-500/10 border border-rose-500/30 rounded-xl">
                  {[1, 2, 3].map((heart) => (
                    <Heart
                      key={heart}
                      className={`w-4 h-4 transition-all duration-300 ${
                        heart <= lives
                          ? 'text-rose-500 fill-rose-500 scale-100'
                          : 'text-slate-600 fill-transparent scale-90 opacity-40'
                      }`}
                    />
                  ))}
                </div>
              </>
            )}

            {/* Download Standalone HTML Button */}
            <button
              onClick={downloadStandaloneHtml}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600/30 hover:bg-emerald-600/50 active:scale-95 text-emerald-300 border border-emerald-500/40 rounded-xl text-xs font-bold transition shadow-sm"
              title="Oyunu tek bir HTML dosyası olarak bilgisayarına indir (internetsiz çalışır)"
            >
              <Download className="w-4 h-4 text-emerald-400" />
              <span>HTML İndir</span>
            </button>

            {/* Guide Button */}
            <button
              onClick={() => {
                sounds.playClick();
                setIsGuideOpen(true);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600/30 hover:bg-indigo-600/50 active:scale-95 text-indigo-200 border border-indigo-500/40 rounded-xl text-xs font-semibold transition"
              title="Konu Rehberi"
            >
              <BookOpen className="w-4 h-4 text-indigo-400" />
              <span className="hidden sm:inline">Konu Özeti</span>
            </button>

            {/* Sound Toggle */}
            <button
              onClick={toggleSound}
              className="p-2 bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-300 rounded-xl border border-slate-700 transition"
              title={soundEnabled ? 'Sesi Kapat' : 'Sesi Aç'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Game Container */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-4 sm:p-6 flex flex-col justify-center">
        {/* SCREEN 1: HOME MENU */}
        {screen === 'menu' && (
          <div className="w-full max-w-2xl mx-auto space-y-8 text-center animate-in fade-in duration-300">
            {/* Hero Character & Headline */}
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/30 rounded-full text-amber-300 text-xs sm:text-sm font-semibold">
                <Sparkles className="w-4 h-4 text-amber-400" />
                7. Sınıf Tam Sayılar & Mutlak Değer Macerası
              </div>

              <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
                Mutlak Değerin <br />
                <span className="bg-gradient-to-r from-amber-400 via-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                  Sırrını Çözmeye Hazır mısın?
                </span>
              </h1>

              <p className="text-sm sm:text-base text-slate-300 max-w-lg mx-auto">
                Sayı doğrusunda adımları say, sıfıra olan mesafeyi keşfet! Dışarıdaki eksi tuzaklarına düşmeden 3 aşamayı tamamla, mutlak değer şampiyonu ol.
              </p>
            </div>

            {/* Visual Teaser Banner */}
            <div className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-4 flex flex-wrap items-center justify-around gap-4 text-center">
              <div>
                <span className="text-xs text-slate-400">Temel Kural</span>
                <div className="text-lg font-black text-emerald-400 font-mono">|-7| = +7</div>
              </div>
              <div className="h-8 w-px bg-slate-700 hidden sm:block" />
              <div>
                <span className="text-xs text-slate-400">Sıfırın Değeri</span>
                <div className="text-lg font-black text-cyan-400 font-mono">|0| = 0</div>
              </div>
              <div className="h-8 w-px bg-slate-700 hidden sm:block" />
              <div>
                <span className="text-xs text-slate-400">Tuzak Nokta</span>
                <div className="text-lg font-black text-rose-400 font-mono">-|-5| = -5</div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                onClick={() => {
                  sounds.playClick();
                  setScreen('levelSelect');
                }}
                className="group relative p-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black rounded-2xl shadow-xl shadow-amber-500/20 active:scale-95 transition flex flex-col items-center justify-center gap-2"
              >
                <div className="p-3 bg-white/20 rounded-xl group-hover:scale-110 transition">
                  <Play className="w-6 h-6 fill-current text-slate-950" />
                </div>
                <div>
                  <div className="text-base font-extrabold text-slate-950">Bölüm Modu</div>
                  <div className="text-xs text-slate-900/80 font-medium">3 Kademeli Aşama</div>
                </div>
              </button>

              <button
                onClick={startEndless}
                className="group p-4 bg-slate-800 hover:bg-slate-750 border border-slate-700 hover:border-indigo-500/50 rounded-2xl active:scale-95 transition flex flex-col items-center justify-center gap-2 text-white"
              >
                <div className="p-3 bg-indigo-500/20 text-indigo-400 rounded-xl group-hover:scale-110 transition">
                  <Zap className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-base font-bold">Hız Maratonu</div>
                  <div className="text-xs text-slate-400 font-medium">Sonsuz Pratik & Rekor</div>
                </div>
              </button>

              <button
                onClick={() => {
                  sounds.playClick();
                  setScreen('lab');
                }}
                className="group p-4 bg-slate-800 hover:bg-slate-750 border border-slate-700 hover:border-emerald-500/50 rounded-2xl active:scale-95 transition flex flex-col items-center justify-center gap-2 text-white"
              >
                <div className="p-3 bg-emerald-500/20 text-emerald-400 rounded-xl group-hover:scale-110 transition">
                  <Compass className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-base font-bold">Laboratuvar</div>
                  <div className="text-xs text-slate-400 font-medium">İnteraktif Sayı Doğrusu</div>
                </div>
              </button>
            </div>

            {/* Offline HTML Download Banner Card */}
            <div className="bg-gradient-to-r from-emerald-950/70 via-slate-900 to-teal-950/70 border border-emerald-500/40 p-4 sm:p-5 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 text-left shadow-lg">
              <div className="flex items-center gap-3.5">
                <div className="p-3 bg-emerald-500/20 text-emerald-400 rounded-2xl border border-emerald-500/30 shrink-0">
                  <Download className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm sm:text-base text-white">
                    Bilgisayarına Tek Dosya HTML Olarak İndir
                  </h3>
                  <p className="text-xs text-slate-300 mt-0.5">
                    İnternetsiz çalışır, flash belleğe atılabilir. Bilgisayarında çift tıklayarak doğrudan oynayabilirsin!
                  </p>
                </div>
              </div>
              <button
                onClick={downloadStandaloneHtml}
                className="w-full sm:w-auto px-5 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black rounded-xl text-xs sm:text-sm active:scale-95 transition flex items-center justify-center gap-2 whitespace-nowrap shadow-lg shadow-emerald-500/20 shrink-0"
              >
                <Download className="w-4 h-4" />
                <span>.HTML Dosyasını İndir</span>
              </button>
            </div>

            {/* High Score & Teacher Note Footer */}
            <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-slate-400">
              <span className="flex items-center gap-1 text-amber-300 font-semibold">
                <Trophy className="w-4 h-4 text-amber-400" /> En Yüksek Skor: {highScore} Puan
              </span>
              <span>•</span>
              <button
                onClick={() => setIsGuideOpen(true)}
                className="underline hover:text-white transition"
              >
                7. Sınıf Müfredat Özeti ve Kuralları
              </button>
            </div>
          </div>
        )}

        {/* SCREEN 2: LEVEL SELECTION */}
        {screen === 'levelSelect' && (
          <div className="w-full max-w-3xl mx-auto space-y-6 animate-in fade-in duration-300">
            <div className="text-center space-y-2">
              <h2 className="text-2xl sm:text-3xl font-black text-white">Görev Aşamaları</h2>
              <p className="text-xs sm:text-sm text-slate-400">
                Seviyeleri sırayla tamamla, rozetleri topla ve Mutlak Değer Büyücüsü ol!
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {([1, 2, 3] as DifficultyLevel[]).map((lvl) => {
                const info = LEVEL_INFO[lvl];
                const isLocked = lvl > unlockedLevel;

                return (
                  <div
                    key={lvl}
                    className={`relative rounded-3xl p-5 border transition-all duration-300 flex flex-col justify-between ${
                      isLocked
                        ? 'bg-slate-900/40 border-slate-800 opacity-60'
                        : 'bg-slate-800/80 border-slate-700 hover:border-amber-500/50 shadow-xl'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-900 border border-slate-700 text-slate-300">
                          {info.badge}
                        </span>
                        {isLocked ? (
                          <span className="text-xs text-slate-500 font-semibold">🔒 Kilitli</span>
                        ) : (
                          <span className="text-xs text-emerald-400 font-semibold">✓ Açık</span>
                        )}
                      </div>

                      <h3 className="text-lg font-black text-white mb-1">{info.title}</h3>
                      <h4 className="text-xs font-semibold text-indigo-300 mb-2">{info.subtitle}</h4>
                      <p className="text-xs text-slate-400 leading-relaxed mb-4">{info.description}</p>
                    </div>

                    <button
                      disabled={isLocked}
                      onClick={() => startLevel(lvl)}
                      className={`w-full py-3 rounded-xl font-bold text-sm transition flex items-center justify-center gap-2 active:scale-95 ${
                        isLocked
                          ? 'bg-slate-800 text-slate-600 cursor-not-allowed'
                          : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-lg'
                      }`}
                    >
                      {isLocked ? 'Önceki Seviyeyi Geç' : 'Aşamaya Başla'}
                      {!isLocked && <ArrowRight className="w-4 h-4" />}
                    </button>
                  </div>
                );
              })}
            </div>

            <div className="text-center pt-2">
              <button
                onClick={() => setScreen('menu')}
                className="text-xs text-slate-400 hover:text-white underline transition"
              >
                ← Ana Menüye Dön
              </button>
            </div>
          </div>
        )}

        {/* SCREEN 3: PLAYING */}
        {screen === 'playing' && currentQ && (
          <div className="w-full max-w-3xl mx-auto space-y-5 animate-in fade-in duration-200">
            {/* Header Status Bar (Level info, Progress, Timer) */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-800/80 border border-slate-700/80 p-3 sm:p-4 rounded-2xl">
              <div>
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                  {gameMode === 'story' ? LEVEL_INFO[currentLevel].title : 'Hız Maratonu'}
                </span>
                <div className="text-sm font-extrabold text-white">
                  Soru {currentQuestionIndex + 1} {gameMode === 'story' && `/ ${levelQuestions.length}`}
                </div>
              </div>

              {/* Timer Progress Indicator */}
              {timerEnabled ? (
                <div className="flex items-center gap-2">
                  <div className="flex flex-col items-end">
                    <span className="text-[11px] text-slate-400">Kalan Süre</span>
                    <span
                      className={`text-sm font-black font-mono ${
                        timeLeft <= 5 ? 'text-rose-400 animate-pulse' : 'text-emerald-400'
                      }`}
                    >
                      {timeLeft} sn
                    </span>
                  </div>
                  <div className="w-16 h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-1000 ${
                        timeLeft <= 5 ? 'bg-rose-500' : 'bg-emerald-400'
                      }`}
                      style={{ width: `${(timeLeft / (gameMode === 'endless' ? 20 : 25)) * 100}%` }}
                    />
                  </div>
                </div>
              ) : (
                <div className="text-xs text-slate-400 font-semibold px-2 py-1 bg-slate-900 rounded-lg">
                  Rahat Mod (Süresiz)
                </div>
              )}

              {/* Mode switch for timer */}
              <button
                onClick={() => setTimerEnabled(!timerEnabled)}
                className="text-[11px] text-slate-400 hover:text-slate-200 underline transition"
              >
                {timerEnabled ? 'Süreyi Kapat' : 'Süreyi Aç'}
              </button>
            </div>

            {/* Question Card */}
            <div className="bg-slate-900/90 border border-slate-700/90 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
              {/* Question Subtext */}
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-xs sm:text-sm font-medium text-slate-400">
                  {currentQ.questionText}
                </span>

                {currentQ.hint && !showHint && !hasAnswered && (
                  <button
                    onClick={() => {
                      sounds.playClick();
                      setShowHint(true);
                    }}
                    className="flex items-center gap-1 text-xs text-amber-300 hover:text-amber-200 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/30 transition"
                  >
                    <Lightbulb className="w-3.5 h-3.5" /> İpucu
                  </button>
                )}
              </div>

              {/* Hint Box (if revealed) */}
              {showHint && currentQ.hint && !hasAnswered && (
                <div className="mb-4 p-3 bg-amber-950/40 border border-amber-500/40 rounded-xl text-xs text-amber-200 flex items-start gap-2 animate-in fade-in">
                  <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <strong>İpucu:</strong> {currentQ.hint}
                  </div>
                </div>
              )}

              {/* Question Big Formula Prompt */}
              <div className="py-6 sm:py-8 text-center bg-gradient-to-b from-slate-800/40 to-slate-800/80 rounded-2xl border border-slate-700/60 my-2">
                <div className="text-3xl sm:text-5xl font-black font-mono text-amber-300 tracking-wider">
                  {currentQ.prompt}
                </div>
              </div>

              {/* Number Line Visual Context (if helpful for question) */}
              {currentQ.numberLineValue !== undefined && (
                <div className="my-4">
                  <NumberLineVisualizer
                    value={currentQ.numberLineValue}
                    min={Math.min(-8, currentQ.numberLineValue - 2)}
                    max={Math.max(8, currentQ.numberLineValue + 2)}
                  />
                </div>
              )}

              {/* Multiple Choice Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
                {currentQ.options.map((opt, idx) => {
                  const optStr = String(opt);
                  const isThisSelected = selectedAnswer === opt;
                  const isThisCorrect = String(currentQ.correctAnswer) === optStr;

                  let btnStyle = 'bg-slate-800/90 hover:bg-slate-750 border-slate-700 text-white';

                  if (hasAnswered) {
                    if (isThisCorrect) {
                      btnStyle = 'bg-emerald-600/90 border-emerald-400 text-white shadow-lg shadow-emerald-500/30';
                    } else if (isThisSelected && !isThisCorrect) {
                      btnStyle = 'bg-rose-600/90 border-rose-400 text-white shadow-lg shadow-rose-500/30';
                    } else {
                      btnStyle = 'bg-slate-800/40 border-slate-800 text-slate-500 opacity-50';
                    }
                  }

                  return (
                    <button
                      key={idx}
                      disabled={hasAnswered}
                      onClick={() => handleSelectOption(opt)}
                      className={`p-4 sm:p-5 rounded-2xl border-2 font-mono font-bold text-lg sm:text-xl transition-all duration-150 flex items-center justify-between active:scale-98 ${btnStyle}`}
                    >
                      <span>{optStr}</span>
                      {hasAnswered && isThisCorrect && (
                        <CheckCircle2 className="w-6 h-6 text-emerald-300" />
                      )}
                      {hasAnswered && isThisSelected && !isThisCorrect && (
                        <XCircle className="w-6 h-6 text-rose-300" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Pedagogical Explanation & Next Button Drawer */}
              {hasAnswered && (
                <div className="mt-6 pt-5 border-t border-slate-700/80 animate-in fade-in duration-300 space-y-4">
                  {/* Feedback Banner */}
                  <div
                    className={`p-4 rounded-2xl border flex items-start gap-3 ${
                      isCorrect
                        ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-200'
                        : 'bg-rose-950/40 border-rose-500/50 text-rose-200'
                    }`}
                  >
                    {isCorrect ? (
                      <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5" />
                    ) : (
                      <Lightbulb className="w-6 h-6 text-amber-400 shrink-0 mt-0.5" />
                    )}
                    <div className="space-y-1">
                      <div className="font-extrabold text-sm sm:text-base">
                        {isCorrect
                          ? '🎉 Harika! Doğru Cevap!'
                          : '💡 Biraz Dikkat! İşte Doğru Çözümün Yolu:'}
                      </div>
                      <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
                        {currentQ.explanation}
                      </p>
                    </div>
                  </div>

                  {/* Continue Button */}
                  <div className="flex justify-end">
                    <button
                      onClick={handleNextQuestion}
                      className="w-full sm:w-auto px-6 py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black rounded-xl shadow-xl shadow-amber-500/20 active:scale-95 transition flex items-center justify-center gap-2 text-base"
                    >
                      <span>
                        {gameMode === 'story' && currentQuestionIndex + 1 >= levelQuestions.length
                          ? 'Aşamayı Bitir & Sonucu Gör'
                          : 'Sıradaki Soruya Geç'}
                      </span>
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* SCREEN 4: LEVEL COMPLETE */}
        {screen === 'levelComplete' && (
          <div className="w-full max-w-lg mx-auto text-center space-y-6 bg-slate-900 border border-slate-700/80 p-8 rounded-3xl shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-amber-400 to-emerald-400 p-1 shadow-xl shadow-amber-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[20px] flex items-center justify-center">
                <Trophy className="w-10 h-10 text-amber-400" />
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold px-3 py-1 bg-emerald-500/20 text-emerald-300 rounded-full border border-emerald-500/40">
                Aşama Başarıyla Tamamlandı!
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white">
                Tebrikler Matematik Kaşifi!
              </h2>
              <p className="text-xs sm:text-sm text-slate-300">
                {LEVEL_INFO[currentLevel].title} sorularının tamamını başarıyla çözdün.
              </p>
            </div>

            {/* Scorecard */}
            <div className="grid grid-cols-2 gap-3 bg-slate-800/60 p-4 rounded-2xl border border-slate-700">
              <div>
                <span className="text-xs text-slate-400">Toplam Puan</span>
                <div className="text-2xl font-black text-amber-400 font-mono">{stats.score}</div>
              </div>
              <div>
                <span className="text-xs text-slate-400">En Uzun Seri</span>
                <div className="text-2xl font-black text-orange-400 font-mono">{stats.bestStreak}x 🔥</div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="space-y-2.5">
              {currentLevel < 3 ? (
                <button
                  onClick={() => startLevel((currentLevel + 1) as DifficultyLevel)}
                  className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black rounded-xl shadow-lg active:scale-95 transition flex items-center justify-center gap-2"
                >
                  <span>Sonraki Aşamaya Geç ({currentLevel + 1}. Aşama)</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              ) : (
                <button
                  onClick={() => {
                    sounds.playClick();
                    setScreen('menu');
                  }}
                  className="w-full py-3.5 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 text-white font-black rounded-xl shadow-lg active:scale-95 transition flex items-center justify-center gap-2"
                >
                  <Award className="w-5 h-5" />
                  <span>Tüm Seviyeleri Fethettin! Ana Menüye Dön</span>
                </button>
              )}

              <button
                onClick={() => startLevel(currentLevel)}
                className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl text-sm transition"
              >
                Bu Aşamayı Tekrar Oyna
              </button>

              <button
                onClick={() => setScreen('levelSelect')}
                className="text-xs text-slate-400 hover:text-white underline transition block mx-auto pt-1"
              >
                Aşama Seçim Ekranı
              </button>
            </div>
          </div>
        )}

        {/* SCREEN 5: GAME OVER */}
        {screen === 'gameOver' && (
          <div className="w-full max-w-lg mx-auto text-center space-y-6 bg-slate-900 border border-slate-700/80 p-8 rounded-3xl shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="w-20 h-20 mx-auto rounded-3xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400">
              <RotateCcw className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl sm:text-3xl font-black text-white">Canların Bitti!</h2>
              <p className="text-xs sm:text-sm text-slate-300">
                Matematikte hata yapmak öğrenmenin en önemli parçasıdır. Unutma: Mutlak değer daima pozitif veya sıfırdır!
              </p>
            </div>

            <div className="bg-slate-800/60 p-4 rounded-2xl border border-slate-700 grid grid-cols-2 gap-2 text-center">
              <div>
                <span className="text-xs text-slate-400">Kazanılan Puan</span>
                <div className="text-xl font-bold text-amber-400 font-mono">{stats.score}</div>
              </div>
              <div>
                <span className="text-xs text-slate-400">Doğru Sayısı</span>
                <div className="text-xl font-bold text-emerald-400 font-mono">{stats.correctCount}</div>
              </div>
            </div>

            <div className="space-y-2.5">
              <button
                onClick={() => startLevel(currentLevel)}
                className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black rounded-xl shadow-lg active:scale-95 transition"
              >
                Yeniden Dene (3 Can İle)
              </button>

              <button
                onClick={() => setIsGuideOpen(true)}
                className="w-full py-2.5 bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-200 border border-indigo-500/40 rounded-xl text-sm font-semibold transition flex items-center justify-center gap-2"
              >
                <BookOpen className="w-4 h-4" /> Kuralları ve İpuçlarını Oku
              </button>

              <button
                onClick={resetGame}
                className="text-xs text-slate-400 hover:text-white underline transition block mx-auto pt-1"
              >
                Ana Menüye Dön
              </button>
            </div>
          </div>
        )}

        {/* SCREEN 6: NUMBER LINE LAB */}
        {screen === 'lab' && <NumberLineLab onBackToMenu={() => setScreen('menu')} />}
      </main>

      {/* Footer Curriculum Tag */}
      <footer className="text-center py-3 text-xs text-slate-500 border-t border-slate-800/80">
        Milli Eğitim Bakanlığı (MEB) 7. Sınıf Tam Sayılar & Mutlak Değer Konu Kazanımlarına Uygundur.
      </footer>

      {/* Pedagogical Summary / Cheat Sheet Modal */}
      <SummaryModal isOpen={isGuideOpen} onClose={() => setIsGuideOpen(false)} />
    </div>
  );
}
