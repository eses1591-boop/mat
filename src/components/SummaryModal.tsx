import React from 'react';
import { X, BookOpen, AlertTriangle, CheckCircle2, Compass } from 'lucide-react';

interface SummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SummaryModal: React.FC<SummaryModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[90vh] flex flex-col bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-indigo-900/60 to-purple-900/60 border-b border-slate-700/80">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-500/20 text-indigo-300 rounded-xl">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg text-white">7. Sınıf Mutlak Değer Rehberi</h3>
              <p className="text-xs text-indigo-200">Sınavlarda ve oyunda 100 puan kazandıran altın kurallar</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-5 text-sm text-slate-300 leading-relaxed">
          {/* Rule 1 */}
          <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-4">
            <div className="flex items-center gap-2 font-bold text-base text-emerald-400 mb-2">
              <Compass className="w-5 h-5 text-emerald-400" />
              1. Tanım: Mutlak Değer Uzaklıktır!
            </div>
            <p>
              Bir tam sayının sayı doğrusunda <strong>0 (başlangıç) noktasına</strong> olan uzaklığına o sayının{' '}
              <strong className="text-white">mutlak değeri</strong> denir ve <code className="bg-slate-950 px-2 py-0.5 rounded text-emerald-300 font-mono font-bold">|a|</code> ile gösterilir.
            </p>
            <div className="grid grid-cols-3 gap-2 mt-3 text-center font-mono font-bold">
              <div className="bg-slate-900/90 p-2 rounded-xl border border-slate-700 text-emerald-300">
                |+6| = 6
              </div>
              <div className="bg-slate-900/90 p-2 rounded-xl border border-slate-700 text-emerald-300">
                |-6| = 6
              </div>
              <div className="bg-slate-900/90 p-2 rounded-xl border border-slate-700 text-cyan-300">
                |0| = 0
              </div>
            </div>
          </div>

          {/* Rule 2 */}
          <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-4">
            <div className="flex items-center gap-2 font-bold text-base text-amber-400 mb-2">
              <CheckCircle2 className="w-5 h-5 text-amber-400" />
              2. Altın Kural: Uzaklık Negatif Olamaz!
            </div>
            <p>
              Bir yere olan mesafeni söylerken &quot;-5 metre yürüdüm&quot; demezsin. Uzaklık ölçüldüğü için mutlak değerin sonucu{' '}
              <span className="text-amber-300 font-bold underline decoration-amber-500">asla negatif çıkamaz!</span> En küçük mutlak değer <strong>0</strong> dır.
            </p>
          </div>

          {/* Rule 3 - Most Common Trap! */}
          <div className="bg-rose-950/30 border border-rose-500/40 rounded-2xl p-4">
            <div className="flex items-center gap-2 font-bold text-base text-rose-400 mb-2">
              <AlertTriangle className="w-5 h-5 text-rose-400" />
              3. Dikkat! Dışarıdaki Eksi Tuzağı (-|a|)
            </div>
            <p className="text-rose-200">
              Eksi işareti mutlak değer çubuğunun <strong>dışındaysa</strong> mutlak değer onu yutamaz!
            </p>
            <div className="bg-slate-950/80 p-3 rounded-xl border border-rose-500/30 mt-2 font-mono text-xs space-y-1">
              <div>
                <span className="text-slate-400">Örnek 1:</span> <strong className="text-white">-|-8|</strong> = -(8) = <span className="text-rose-400 font-bold">-8</span>
              </div>
              <div>
                <span className="text-slate-400">Örnek 2:</span> <strong className="text-white">-|5|</strong> = -(5) = <span className="text-rose-400 font-bold">-5</span>
              </div>
            </div>
          </div>

          {/* Rule 4 */}
          <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-4">
            <div className="flex items-center gap-2 font-bold text-base text-blue-400 mb-2">
              <CheckCircle2 className="w-5 h-5 text-blue-400" />
              4. Dört İşlemde Sıralama
            </div>
            <p>
              Mutlak değer içeren işlemlerde, <strong>önce mutlak değerlerin içindeki veya dışındaki değerleri hesapla</strong>, ardından normal işlem önceliği kurallarını (önce çarpma/bölme, sonra toplama/çıkarma) uygula.
            </p>
            <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-700 mt-2 font-mono text-xs">
              <span className="text-indigo-300 font-bold">-|8| + |-3|</span> = (-8) + 3 = <span className="text-amber-400 font-bold">-5</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-900 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white font-bold rounded-xl shadow-lg active:scale-95 transition"
          >
            Anladım, Oyuna Dön!
          </button>
        </div>
      </div>
    </div>
  );
};
