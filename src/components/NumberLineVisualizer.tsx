import React from 'react';

interface NumberLineProps {
  value: number;
  highlightZero?: boolean;
  interactive?: boolean;
  onChangeValue?: (val: number) => void;
  min?: number;
  max?: number;
}

export const NumberLineVisualizer: React.FC<NumberLineProps> = ({
  value,
  interactive = false,
  onChangeValue,
  min = -8,
  max = 8,
}) => {
  const clampedVal = Math.max(min, Math.min(max, value));
  const absDistance = Math.abs(clampedVal);
  const totalUnits = max - min;

  // Percentage position of a number on the line
  const getPercent = (num: number) => {
    return ((num - min) / totalUnits) * 100;
  };

  const zeroPercent = getPercent(0);
  const valPercent = getPercent(clampedVal);
  const leftPercent = Math.min(zeroPercent, valPercent);
  const widthPercent = Math.abs(valPercent - zeroPercent);

  const ticks: number[] = [];
  for (let i = min; i <= max; i++) {
    ticks.push(i);
  }

  return (
    <div className="w-full bg-slate-800/80 backdrop-blur-sm border border-slate-700/80 rounded-2xl p-4 sm:p-6 shadow-xl text-slate-100 select-none">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
        <div className="flex items-center gap-2">
          <span className="flex h-3 w-3 rounded-full bg-emerald-400 animate-pulse" />
          <h4 className="font-bold text-sm sm:text-base text-slate-200">
            Sayı Doğrusu Modeli (0&apos;a Olan Uzaklık)
          </h4>
        </div>
        <div className="text-xs sm:text-sm px-3 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-full font-semibold">
          |{clampedVal > 0 ? `+${clampedVal}` : clampedVal}| = {absDistance} Birim
        </div>
      </div>

      {/* Visual Number Line Canvas */}
      <div className="relative pt-12 pb-8 px-4 sm:px-8 overflow-hidden">
        {/* Distance Bracket / Arch */}
        {widthPercent > 0 && (
          <div
            className="absolute top-2 transition-all duration-500 ease-out flex flex-col items-center pointer-events-none"
            style={{
              left: `${leftPercent}%`,
              width: `${Math.max(widthPercent, 2)}%`,
            }}
          >
            <div className="text-[11px] sm:text-xs font-bold text-emerald-300 bg-emerald-950/90 border border-emerald-500/40 px-2 py-0.5 rounded-full shadow mb-1 whitespace-nowrap">
              Mesafe: {absDistance} Adım
            </div>
            {/* Arched bracket SVG */}
            <svg className="w-full h-5 text-emerald-400 overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 20">
              <path
                d="M 2,18 Q 50,0 98,18"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeDasharray="4 2"
              />
            </svg>
          </div>
        )}

        {/* The main horizontal axis line */}
        <div className="relative h-2 bg-gradient-to-r from-blue-500 via-emerald-400 to-indigo-500 rounded-full my-4 shadow-inner">
          {/* Highlighted distance segment */}
          <div
            className="absolute top-0 bottom-0 bg-amber-400/80 rounded-full transition-all duration-500"
            style={{
              left: `${leftPercent}%`,
              width: `${widthPercent}%`,
            }}
          />

          {/* Zero Pin Marker */}
          <div
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 z-10 flex flex-col items-center pointer-events-none"
            style={{ left: `${zeroPercent}%` }}
          >
            <div className="w-4 h-4 rounded-full bg-cyan-400 border-2 border-slate-900 shadow-md ring-4 ring-cyan-400/30" />
            <span className="absolute -bottom-6 text-xs font-black text-cyan-300">0</span>
            <span className="absolute -top-7 text-[10px] font-bold uppercase tracking-wider text-cyan-200 bg-cyan-950/80 px-1.5 py-0.5 rounded">
              Başlangıç
            </span>
          </div>

          {/* Target Value Marker (Avatar / Point) */}
          <div
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 z-20 transition-all duration-500 ease-out flex flex-col items-center cursor-pointer group"
            style={{ left: `${valPercent}%` }}
          >
            <div className="w-6 h-6 rounded-full bg-amber-400 border-2 border-slate-900 shadow-lg flex items-center justify-center text-slate-950 font-black text-xs ring-4 ring-amber-400/40 group-hover:scale-125 transition-transform">
              ★
            </div>
            <span className="absolute -bottom-6 text-xs font-black text-amber-300">
              {clampedVal > 0 ? `+${clampedVal}` : clampedVal}
            </span>
          </div>
        </div>

        {/* Ticks and numeric labels */}
        <div className="relative h-6 mt-4">
          {ticks.map((t) => {
            const isZero = t === 0;
            const isTarget = t === clampedVal;
            const pct = getPercent(t);

            return (
              <div
                key={t}
                className="absolute top-0 -translate-x-1/2 flex flex-col items-center"
                style={{ left: `${pct}%` }}
              >
                <div
                  className={`w-0.5 ${
                    isZero
                      ? 'h-3 bg-cyan-400 font-bold'
                      : isTarget
                      ? 'h-3 bg-amber-400'
                      : 'h-1.5 bg-slate-600'
                  }`}
                />
                {(t % 2 === 0 || isTarget || isZero) && (
                  <span
                    className={`text-[10px] sm:text-xs mt-1 transition-colors ${
                      isZero
                        ? 'font-bold text-cyan-300'
                        : isTarget
                        ? 'font-bold text-amber-300'
                        : 'text-slate-400'
                    }`}
                  >
                    {t > 0 ? `+${t}` : t}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Interactive Controls (When user explores in Lab mode or during question assistance) */}
      {interactive && onChangeValue && (
        <div className="mt-4 pt-4 border-t border-slate-700/60 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => onChangeValue(Math.max(min, clampedVal - 1))}
              className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 active:scale-95 rounded-lg text-sm font-bold transition"
            >
              -1 Azalt
            </button>
            <input
              type="range"
              min={min}
              max={max}
              value={clampedVal}
              onChange={(e) => onChangeValue(Number(e.target.value))}
              aria-label="Sayı Doğrusu Değeri"
              className="flex-1 sm:w-48 accent-amber-400 h-2 bg-slate-700 rounded-lg cursor-pointer"
            />
            <button
              type="button"
              onClick={() => onChangeValue(Math.min(max, clampedVal + 1))}
              className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 active:scale-95 rounded-lg text-sm font-bold transition"
            >
              +1 Arttır
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onChangeValue(-clampedVal)}
              className="px-3 py-1.5 bg-indigo-600/60 hover:bg-indigo-600 active:scale-95 text-indigo-200 border border-indigo-500/40 rounded-lg text-xs font-bold transition"
            >
              Zıt İşaretlisini Seç ({clampedVal > 0 ? -clampedVal : Math.abs(clampedVal)})
            </button>
            <button
              type="button"
              onClick={() => onChangeValue(0)}
              className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 active:scale-95 text-slate-300 rounded-lg text-xs font-bold transition"
            >
              0&apos;a Sıfırla
            </button>
          </div>
        </div>
      )}

      {/* Pedagogical takeaway banner */}
      <div className="mt-2 text-center text-xs text-slate-300 bg-slate-900/60 p-2.5 rounded-xl border border-slate-700/50">
        💡 <strong className="text-amber-300">Öğretmenin Notu:</strong> Hem{' '}
        <span className="text-emerald-300 font-semibold">+{absDistance}</span> hem de{' '}
        <span className="text-emerald-300 font-semibold">-{absDistance}</span> sayılarının sıfıra uzaklığı{' '}
        <span className="text-amber-400 font-bold">{absDistance} birimdir</span>. Bu yüzden mutlak değer daima pozitif veya sıfırdır!
      </div>
    </div>
  );
};
