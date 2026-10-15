import { Question, DifficultyLevel } from '../types';

export const LEVEL_INFO = {
  1: {
    title: '1. Aşama: Çırak Kaşif',
    subtitle: 'Temel Mutlak Değer ve 0 Noktasına Uzaklık',
    badge: '🌱 Çırak',
    color: 'from-emerald-500 to-teal-600',
    description: 'Mutlak değerin ne anlama geldiğini keşfet. Uzaklık asla negatif olamaz!',
    targetScore: 500,
  },
  2: {
    title: '2. Aşama: Usta Gezgin',
    subtitle: 'Karşılaştırma ve Dış Eksi İşaretleri',
    badge: '⭐ Gezgin',
    color: 'from-blue-500 to-indigo-600',
    description: '-|8| ile |-8| arasındaki kritik farkı çöz ve tam sayıları karşılaştır!',
    targetScore: 1200,
  },
  3: {
    title: '3. Aşama: Mutlak Büyücü',
    subtitle: 'Mutlak Değerli Dört İşlem & İşlem Önceliği',
    badge: '👑 Büyücü',
    color: 'from-purple-500 to-pink-600',
    description: 'Toplama, çıkarma, çarpma ve bölme içeren zorlu mutlak değer ifadelerini fethet!',
    targetScore: 2200,
  },
};

export const INITIAL_QUESTIONS: Question[] = [
  // SEVİYE 1: TEMEL MUTLAK DEĞER
  {
    id: 'l1-1',
    level: 1,
    levelName: 'Temel Mutlak Değer',
    prompt: '|-7| = ?',
    questionText: 'Aşağıdaki mutlak değerli ifadenin sonucu kaçtır?',
    options: [7, -7, 0, 14],
    correctAnswer: 7,
    explanation: 'Mutlak değer, bir sayının sayı doğrusunda 0 noktasına olan uzaklığıdır. Uzaklık negatif olamayacağından |-7| = 7 olur.',
    numberLineValue: -7,
    hint: 'Sayı doğrusunda -7 noktasından 0 noktasına kaç adım yürürsün?',
  },
  {
    id: 'l1-2',
    level: 1,
    levelName: 'Temel Mutlak Değer',
    prompt: '|+12| = ?',
    questionText: 'Pozitif bir tam sayının mutlak değeri kaçtır?',
    options: [12, -12, 0, 24],
    correctAnswer: 12,
    explanation: '+12 sayısının 0 noktasına olan mesafesi 12 birimdir. Bu yüzden |+12| = 12 dir.',
    numberLineValue: 12,
    hint: 'Pozitif sayıların mutlak değeri kendisine eşittir.',
  },
  {
    id: 'l1-3',
    level: 1,
    levelName: 'Temel Mutlak Değer',
    prompt: '|0| = ?',
    questionText: 'Sıfırın (0) mutlak değeri kaçtır?',
    options: [0, 1, -1, 'Tanımsız'],
    correctAnswer: 0,
    explanation: '0 sayısının başlangıç noktasına (0\'a) olan uzaklığı 0 birimdir. Yani |0| = 0 dır.',
    numberLineValue: 0,
    hint: '0 noktasının kendisine olan mesafesi nedir?',
  },
  {
    id: 'l1-4',
    level: 1,
    levelName: 'Temel Mutlak Değer',
    prompt: '|-15| = ?',
    questionText: '|-15| ifadesinin değeri kaçtır?',
    options: [15, -15, 0, 30],
    correctAnswer: 15,
    explanation: '-15 sayısının 0\'a olan uzaklığı 15 birimdir. Mutlak değer dışına daima pozitif veya sıfır çıkar.',
    numberLineValue: -15,
    hint: 'Eksi işareti mutlak değer çubuklarının içindeyse uzaklık olarak dışarı + çıkar.',
  },
  {
    id: 'l1-5',
    level: 1,
    levelName: 'Temel Mutlak Değer',
    prompt: '|x| = 8 ise x hangi değerleri alabilir?',
    questionText: 'Hangi sayıların 0\'a olan uzaklığı 8 birimdir?',
    options: ['Yalnızca +8', 'Yalnızca -8', '+8 veya -8', '0'],
    correctAnswer: '+8 veya -8',
    explanation: 'Sayı doğrusunda 0 noktasına 8 birim uzaklıkta hem +8 hem de -8 noktaları bulunur. Dolayısıyla |+8| = 8 ve |-8| = 8 olur.',
    numberLineValue: 8,
    hint: 'Sıfırın 8 birim sağına ve 8 birim soluna bak.',
  },
  {
    id: 'l1-6',
    level: 1,
    levelName: 'Temel Mutlak Değer',
    prompt: '|-4| + |+4| = ?',
    questionText: 'İki mutlak değerin toplamını bulunuz:',
    options: [8, 0, -8, 16],
    correctAnswer: 8,
    explanation: '|-4| = 4 ve |+4| = 4 tür. Toplamları: 4 + 4 = 8 eder.',
    numberLineValue: -4,
    hint: 'Önce her iki sayının mutlak değerini bul, sonra topla!',
  },
  {
    id: 'l1-7',
    level: 1,
    levelName: 'Temel Mutlak Değer',
    prompt: 'Sayı doğrusunda 0\'a en yakın olan sayı hangisidir?',
    questionText: 'Aşağıdaki sayıların mutlak değerlerini düşünerek en yakın olanı seçiniz:',
    options: ['-3', '+5', '-8', '+9'],
    correctAnswer: '-3',
    explanation: '|-3|=3, |+5|=5, |-8|=8, |+9|=9. Mutlak değeri en küçük olan sayı 0\'a en yakındır; o da -3\'tür (3 birim).',
    numberLineValue: -3,
    hint: '0\'a en yakın olan sayının mutlak değeri en küçük olandır.',
  },

  // SEVİYE 2: KARŞILAŞTIRMA & DIŞ EKSİ İŞARETİ
  {
    id: 'l2-1',
    level: 2,
    levelName: 'Karşılaştırma & Dış İşaretler',
    prompt: '-|-9| = ?',
    questionText: 'Mutlak değer çubuğunun DIŞINDA eksi varken sonuç ne olur?',
    options: [-9, 9, 0, 18],
    correctAnswer: -9,
    explanation: 'Kritik Kural! Önce iç kısımdaki |-9| = 9 olarak çıkar. Ancak mutlak değerin en başındaki eksi (-) işareti aynen kalır: -(9) = -9 olur!',
    numberLineValue: -9,
    hint: 'Önce mutlak değerin içini hesapla: |-9| = 9. Sonra dıştaki eksiyi başına koy.',
  },
  {
    id: 'l2-2',
    level: 2,
    levelName: 'Karşılaştırma & Dış İşaretler',
    prompt: '-|6| = ?',
    questionText: 'Aşağıdaki ifadenin eşitini bulunuz:',
    options: [-6, 6, 0, 12],
    correctAnswer: -6,
    explanation: '|6| = 6 dır. Dışarıdaki eksi işareti sonucu negatif yapar: -|6| = -(6) = -6 dır.',
    numberLineValue: 6,
    hint: 'Dışarıdaki eksiye dikkat et!',
  },
  {
    id: 'l2-3',
    level: 2,
    levelName: 'Karşılaştırma & Dış İşaretler',
    prompt: '|-18| ... |+14|',
    questionText: 'Noktalı yere hangi karşılaştırma sembolü gelmelidir?',
    options: ['>', '<', '=', '≤'],
    correctAnswer: '>',
    explanation: '|-18| = 18 ve |+14| = 14 tür. 18 sayısı 14 sayısından büyüktür, dolayısıyla |-18| > |+14|.',
    isComparison: true,
    hint: 'Önce her iki tarafın değerini çıkar: 18 ve 14.',
  },
  {
    id: 'l2-4',
    level: 2,
    levelName: 'Karşılaştırma & Dış İşaretler',
    prompt: '-10 ... |-10|',
    questionText: 'Normal tam sayı ile mutlak değerli sayıyı karşılaştırınız:',
    options: ['<', '>', '=', '≥'],
    correctAnswer: '<',
    explanation: '-10 bir negatif sayıdır. |-10| ise +10 dur. Negatif bir sayı her zaman pozitif bir sayıdan küçüktür: -10 < 10.',
    isComparison: true,
    hint: 'Sol taraf negatif (-10), sağ taraf ise mutlak değer olduğu için pozitif (+10)!',
  },
  {
    id: 'l2-5',
    level: 2,
    levelName: 'Karşılaştırma & Dış İşaretler',
    prompt: '|-5| < x < |+2| eşitsizliğini sağlayan bir x tam sayısı var mıdır?',
    questionText: '5 < x < 2 eşitsizliğini inceleyiniz:',
    options: ['Yoktur (İmkansızdır)', 'x = 3', 'x = 4', 'x = 0'],
    correctAnswer: 'Yoktur (İmkansızdır)',
    explanation: '|-5| = 5 ve |+2| = 2 dir. 5 < x < 2 demek, bir sayının hem 5\'ten büyük hem 2\'den küçük olması demektir. Böyle bir tam sayı yoktur!',
    hint: 'Önce mutlak değerleri sayıya çevir: 5 < x < 2.',
  },
  {
    id: 'l2-6',
    level: 2,
    levelName: 'Karşılaştırma & Dış İşaretler',
    prompt: 'a = -7 ise -|a| ifadesinin değeri kaçtır?',
    questionText: 'Harfli ifadenin mutlak değerini bulunuz:',
    options: [-7, 7, 14, 0],
    correctAnswer: -7,
    explanation: 'a yerine -7 koyarsak: -|-7| olur. |-7| = 7 olduğu için önüne eksi gelince sonuç -7 olur.',
    numberLineValue: -7,
    hint: 'a = -7 ise ifade -|-7| haline gelir.',
  },
  {
    id: 'l2-7',
    level: 2,
    levelName: 'Karşılaştırma & Dış İşaretler',
    prompt: 'Aşağıdakilerden hangisi EN BÜYÜKTÜR?',
    questionText: 'Değerleri hesaplayarak en büyük olanı seçiniz:',
    options: ['|-25|', '-|-30|', '|+19|', '0'],
    correctAnswer: '|-25|',
    explanation: '|-25| = 25, -|-30| = -30, |+19| = 19, 0 = 0. En büyük değer 25\'tir.',
    hint: '-|-30| negatif bir sayıdır (-30). En büyük pozitif olanı ara.',
  },

  // SEVİYE 3: MUTLAK DEĞERLİ DÖRT İŞLEM & ÖNCELİK
  {
    id: 'l3-1',
    level: 3,
    levelName: 'Mutlak Değerli Dört İşlem',
    prompt: '-|8| + |-3| = ?',
    questionText: 'İşlemin sonucunu bulunuz:',
    options: [-5, 11, -11, 5],
    correctAnswer: -5,
    explanation: 'Önce mutlak değerleri çözelim: |8| = 8, önünde eksi var yani -8. |-3| = +3. İşlem: -8 + 3 = -5 olur!',
    hint: 'Adım adım: -|8| = -8 ve |-3| = 3. Şimdi: (-8) + 3.',
  },
  {
    id: 'l3-2',
    level: 3,
    levelName: 'Mutlak Değerli Dört İşlem',
    prompt: '|-15| - |-9| = ?',
    questionText: 'İki mutlak değerin farkını bulunuz:',
    options: [6, 24, -6, -24],
    correctAnswer: 6,
    explanation: '|-15| = 15 ve |-9| = 9 dur. İşlem: 15 - 9 = 6 dır.',
    hint: '15 eksi 9 kaç eder?',
  },
  {
    id: 'l3-3',
    level: 3,
    levelName: 'Mutlak Değerli Dört İşlem',
    prompt: '|-24| : |-6| = ?',
    questionText: 'Mutlak değerli bölme işlemini yapınız:',
    options: [4, -4, 18, -18],
    correctAnswer: 4,
    explanation: '|-24| = 24 ve |-6| = 6 dır. 24 : 6 = +4 bulunur.',
    hint: 'İki sayıyı da mutlak değer dışına pozitif çıkarıp böl.',
  },
  {
    id: 'l3-4',
    level: 3,
    levelName: 'Mutlak Değerli Dört İşlem',
    prompt: '|-5| · |-4| - |-12| = ?',
    questionText: 'İşlem önceliğine dikkat ederek sonucu bulunuz:',
    options: [8, -8, 32, 28],
    correctAnswer: 8,
    explanation: 'Önce mutlak değerler: 5 · 4 - 12. İşlem önceliği çarpmadadır: 5 · 4 = 20. Sonra çıkarma: 20 - 12 = 8!',
    hint: 'Önce çarpma: 5 · 4 = 20. Sonra 20 - 12.',
  },
  {
    id: 'l3-5',
    level: 3,
    levelName: 'Mutlak Değerli Dört İşlem',
    prompt: '-|-10| + |-10| - |0| = ?',
    questionText: 'İfadenin değerini bulunuz:',
    options: [0, 20, -20, 10],
    correctAnswer: 0,
    explanation: '-|-10| = -10 dur. |-10| = +10 dur. |0| = 0 dır. Toplam: (-10) + 10 - 0 = 0 olur.',
    hint: '-10 ile +10 birbirini sıfırlar!',
  },
  {
    id: 'l3-6',
    level: 3,
    levelName: 'Mutlak Değerli Dört İşlem',
    prompt: '| -7 + 3 | + | -4 | = ?',
    questionText: 'Mutlak değer çubuğunun içindeki işlemi yapıp sonucu bulunuz:',
    options: [8, 14, 0, -8],
    correctAnswer: 8,
    explanation: 'Önce mutlak değer içindeki işlem: -7 + 3 = -4. Buradan |-4| = 4 gelir. İkinci kısım da |-4| = 4 tür. Toplam: 4 + 4 = 8 olur!',
    hint: 'Önce parantez içi gibi mutlak değerin içini topla: (-7 + 3 = -4).',
  },
  {
    id: 'l3-7',
    level: 3,
    levelName: 'Mutlak Değerli Dört İşlem',
    prompt: '3 · |-6| - 2 · |-5| = ?',
    questionText: 'Katsayılı mutlak değer işlemini hesaplayınız:',
    options: [8, 28, -8, 18],
    correctAnswer: 8,
    explanation: '|-6| = 6 dır, 3 · 6 = 18. |-5| = 5 tir, 2 · 5 = 10. İşlem: 18 - 10 = 8 bulunur!',
    hint: '3 · 6 = 18 ve 2 · 5 = 10. Şimdi çıkar.',
  },
];

// Dynamic question generator for continuous play and high replayability
export function generateRandomQuestion(level: DifficultyLevel): Question {
  const randId = 'gen-' + Math.random().toString(36).substring(2, 8);

  if (level === 1) {
    const isNegative = Math.random() > 0.3;
    const n = Math.floor(Math.random() * 20) + 1;
    const val = isNegative ? -n : n;
    const correct = Math.abs(val);

    const wrong1 = -correct;
    const wrong2 = correct + (Math.random() > 0.5 ? 2 : -2) || 1;
    const wrong3 = 0;

    const opts = Array.from(new Set([correct, wrong1, wrong2, wrong3]));
    while (opts.length < 4) {
      opts.push(correct + opts.length * 3);
    }
    opts.sort(() => Math.random() - 0.5);

    return {
      id: randId,
      level: 1,
      levelName: 'Temel Mutlak Değer',
      prompt: `|${val > 0 ? '+' + val : val}| = ?`,
      questionText: 'İfadesinin değerini bulunuz:',
      options: opts,
      correctAnswer: correct,
      explanation: `${val > 0 ? '+' + val : val} sayısının sayı doğrusunda 0 noktasına uzaklığı ${correct} birimdir. Uzaklık negatif olamayacağından sonuç ${correct} olur.`,
      numberLineValue: val,
      hint: `${val} sayısının sıfıra olan adım mesafesini say!`,
    };
  }

  if (level === 2) {
    const type = Math.random();
    if (type < 0.5) {
      // -|a| question
      const n = Math.floor(Math.random() * 15) + 2;
      const isInnerNeg = Math.random() > 0.5;
      const inner = isInnerNeg ? -n : n;
      const correct = -n;

      const opts = Array.from(new Set([correct, n, 0, n * 2]));
      opts.sort(() => Math.random() - 0.5);

      return {
        id: randId,
        level: 2,
        levelName: 'Dış Eksi İşaretleri',
        prompt: `-|${inner > 0 ? '+' + inner : inner}| = ?`,
        questionText: 'Dışarıdaki eksi işaretine dikkat ederek sonucu bulunuz:',
        options: opts,
        correctAnswer: correct,
        explanation: `İçerideki |${inner}| değeri ${n} olarak dışarı çıkar. En baştaki eksi işareti kaldığı için sonuç -(${n}) = ${correct} olur.`,
        numberLineValue: inner,
        hint: `Önce |${inner}| = ${n} hesapla. Sonra başına eksi koy.`,
      };
    } else {
      // Comparison
      const a = -(Math.floor(Math.random() * 12) + 2);
      const b = Math.floor(Math.random() * 12) + 1;
      const absA = Math.abs(a);
      const absB = Math.abs(b);
      const correct = absA > absB ? '>' : absA < absB ? '<' : '=';

      return {
        id: randId,
        level: 2,
        levelName: 'Mutlak Değer Karşılaştırması',
        prompt: `|${a}| ... |+${b}|`,
        questionText: 'Noktalı yere hangi karşılaştırma işareti gelmelidir?',
        options: ['>', '<', '='],
        correctAnswer: correct,
        explanation: `|${a}| = ${absA} ve |+${b}| = ${absB} dir. ${absA} ${correct} ${absB} olduğuna göre doğru işaret "${correct}" dir.`,
        isComparison: true,
        hint: `Sol taraf ${absA}, sağ taraf ${absB}. Hangisi daha büyük?`,
      };
    }
  }

  // Level 3: Four operations
  const opType = Math.floor(Math.random() * 3);
  if (opType === 0) {
    // -|a| + |-b|
    const a = Math.floor(Math.random() * 10) + 1;
    const b = Math.floor(Math.random() * 10) + 1;
    const correct = -a + b;
    const opts = Array.from(new Set([correct, a + b, -a - b, a - b]));
    while (opts.length < 4) opts.push(correct + 3);
    opts.sort(() => Math.random() - 0.5);

    return {
      id: randId,
      level: 3,
      levelName: 'Mutlak Değerli İşlemler',
      prompt: `-|${a}| + |-${b}| = ?`,
      questionText: 'İşlemin sonucunu bulunuz:',
      options: opts,
      correctAnswer: correct,
      explanation: `Önce mutlak değerler: -|${a}| = -${a} ve |-${b}| = +${b}. Ardından toplama: (-${a}) + ${b} = ${correct} olur.`,
      hint: `-${a} ile ${b} sayısını topla.`,
    };
  } else if (opType === 1) {
    // | -x · y | - | -z |
    const x = Math.floor(Math.random() * 6) + 2;
    const y = Math.floor(Math.random() * 4) + 1;
    const z = Math.floor(Math.random() * 8) + 1;
    const correct = (x * y) - z;

    const opts = Array.from(new Set([correct, -(x * y) - z, (x * y) + z, -correct]));
    while (opts.length < 4) opts.push(correct + 2);
    opts.sort(() => Math.random() - 0.5);

    return {
      id: randId,
      level: 3,
      levelName: 'Çarpma ve Mutlak Değer',
      prompt: `| -${x} · ${y} | - | -${z} | = ?`,
      questionText: 'İşlem önceliğine ve mutlak değere göre sonucu bulunuz:',
      options: opts,
      correctAnswer: correct,
      explanation: `İçerideki çarpma: -${x} · ${y} = -${x * y}. Mutlak değeri: |-${x * y}| = ${x * y}. Diğeri: |-${z}| = ${z}. Sonuç: ${x * y} - ${z} = ${correct}.`,
      hint: `Önce çarpım: ${x * y}. Sonra ${z} çıkar.`,
    };
  } else {
    // | -24 | : | -k |
    const kList = [2, 3, 4, 6];
    const k = kList[Math.floor(Math.random() * kList.length)];
    const dividend = k * (Math.floor(Math.random() * 5) + 2);
    const correct = dividend / k;

    const opts = Array.from(new Set([correct, -correct, dividend + k, correct + 2]));
    opts.sort(() => Math.random() - 0.5);

    return {
      id: randId,
      level: 3,
      levelName: 'Bölme ve Mutlak Değer',
      prompt: `| -${dividend} | : | -${k} | = ?`,
      questionText: 'Bölme işleminin sonucunu bulunuz:',
      options: opts,
      correctAnswer: correct,
      explanation: `| -${dividend} | = ${dividend} ve | -${k} | = ${k}. İki pozitif sayının bölümü: ${dividend} : ${k} = ${correct} eder.`,
      hint: `${dividend} sayısını ${k} sayısına böl.`,
    };
  }
}
