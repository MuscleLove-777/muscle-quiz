// ===== Muscle Quiz - game.js =====

// --- Sound Effects (Web Audio API) ---
const AudioCtx = window.AudioContext || window.webkitAudioContext;
let audioCtx = null;
function ensureAudio() {
  if (!audioCtx) audioCtx = new AudioCtx();
}

function playCorrect() {
  ensureAudio();
  const o = audioCtx.createOscillator();
  const g = audioCtx.createGain();
  o.connect(g); g.connect(audioCtx.destination);
  o.type = 'sine';
  g.gain.setValueAtTime(0.18, audioCtx.currentTime);
  o.frequency.setValueAtTime(523, audioCtx.currentTime);
  o.frequency.setValueAtTime(659, audioCtx.currentTime + 0.1);
  o.frequency.setValueAtTime(784, audioCtx.currentTime + 0.2);
  g.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.5);
  o.start(); o.stop(audioCtx.currentTime + 0.5);
}

function playWrong() {
  ensureAudio();
  const o = audioCtx.createOscillator();
  const g = audioCtx.createGain();
  o.connect(g); g.connect(audioCtx.destination);
  o.type = 'square';
  g.gain.setValueAtTime(0.12, audioCtx.currentTime);
  o.frequency.setValueAtTime(200, audioCtx.currentTime);
  o.frequency.setValueAtTime(150, audioCtx.currentTime + 0.15);
  g.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.4);
  o.start(); o.stop(audioCtx.currentTime + 0.4);
}

function playResult() {
  ensureAudio();
  const notes = [523, 659, 784, 1047];
  notes.forEach((f, i) => {
    const o = audioCtx.createOscillator();
    const g = audioCtx.createGain();
    o.connect(g); g.connect(audioCtx.destination);
    o.type = 'sine';
    g.gain.setValueAtTime(0.15, audioCtx.currentTime + i * 0.15);
    o.frequency.setValueAtTime(f, audioCtx.currentTime + i * 0.15);
    g.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + i * 0.15 + 0.3);
    o.start(audioCtx.currentTime + i * 0.15);
    o.stop(audioCtx.currentTime + i * 0.15 + 0.3);
  });
}

// --- Question Pool (30+ bilingual questions) ---
const questions = [
  {
    ja: "上腕二頭筋はどの部位の筋肉？",
    en: "Where is the biceps located?",
    choices: [
      { ja: "腕の前側", en: "Front of the arm" },
      { ja: "腕の後側", en: "Back of the arm" },
      { ja: "肩", en: "Shoulder" },
      { ja: "胸", en: "Chest" }
    ],
    answer: 0,
    explanationJa: "上腕二頭筋（バイセプス）は腕の前側にある筋肉で、肘を曲げる動作に使われます。",
    explanationEn: "The biceps is located on the front of the upper arm and is used to flex the elbow."
  },
  {
    ja: "スクワットで主に鍛えられる筋肉は？",
    en: "Which muscle is primarily trained by squats?",
    choices: [
      { ja: "大腿四頭筋", en: "Quadriceps" },
      { ja: "上腕三頭筋", en: "Triceps" },
      { ja: "腹直筋", en: "Rectus abdominis" },
      { ja: "広背筋", en: "Latissimus dorsi" }
    ],
    answer: 0,
    explanationJa: "スクワットは主に大腿四頭筋（太ももの前面）を鍛えるコンパウンド種目です。",
    explanationEn: "Squats primarily target the quadriceps (front of the thigh) as a compound exercise."
  },
  {
    ja: "プロテインの1日の推奨摂取量は体重1kgあたり？",
    en: "Recommended daily protein intake per kg of body weight?",
    choices: [
      { ja: "1.6〜2.2g", en: "1.6-2.2g" },
      { ja: "0.5g", en: "0.5g" },
      { ja: "5g", en: "5g" },
      { ja: "10g", en: "10g" }
    ],
    answer: 0,
    explanationJa: "筋肥大を目指す場合、体重1kgあたり1.6〜2.2gのタンパク質摂取が推奨されています。",
    explanationEn: "For muscle growth, 1.6-2.2g of protein per kg of body weight is recommended."
  },
  {
    ja: "ベンチプレスの世界記録に最も近いのは？",
    en: "Which is closest to the bench press world record?",
    choices: [
      { ja: "約350kg", en: "About 350kg" },
      { ja: "約100kg", en: "About 100kg" },
      { ja: "約50kg", en: "About 50kg" },
      { ja: "約500kg", en: "About 500kg" }
    ],
    answer: 0,
    explanationJa: "ベンチプレスの世界記録は約355kg（ジミー・コルブ、2024年）です。",
    explanationEn: "The bench press world record is about 355kg (Jimmy Kolb, 2024)."
  },
  {
    ja: "「腹筋を割る」ために最も重要なのは？",
    en: "What's most important for visible abs?",
    choices: [
      { ja: "体脂肪率を下げる", en: "Lower body fat percentage" },
      { ja: "毎日1000回腹筋する", en: "Do 1000 crunches daily" },
      { ja: "プロテインを大量に飲む", en: "Drink lots of protein" },
      { ja: "腕立て伏せをする", en: "Do push-ups" }
    ],
    answer: 0,
    explanationJa: "腹筋は誰にでもありますが、見えるようにするには体脂肪率を下げることが最重要です。",
    explanationEn: "Everyone has abs, but lowering body fat percentage is key to making them visible."
  },
  {
    ja: "デッドリフトで主に使われない筋肉は？",
    en: "Which muscle is NOT primarily used in deadlifts?",
    choices: [
      { ja: "上腕二頭筋", en: "Biceps" },
      { ja: "脊柱起立筋", en: "Erector spinae" },
      { ja: "大臀筋", en: "Gluteus maximus" },
      { ja: "ハムストリングス", en: "Hamstrings" }
    ],
    answer: 0,
    explanationJa: "デッドリフトは主に脊柱起立筋、大臀筋、ハムストリングスを使う種目です。上腕二頭筋は主動筋ではありません。",
    explanationEn: "Deadlifts primarily use the erector spinae, glutes, and hamstrings. Biceps are not a primary mover."
  },
  {
    ja: "筋肉痛の正式名称は？",
    en: "What is the medical term for muscle soreness after exercise?",
    choices: [
      { ja: "遅発性筋肉痛（DOMS）", en: "DOMS (Delayed Onset Muscle Soreness)" },
      { ja: "急性筋炎", en: "Acute myositis" },
      { ja: "筋断裂", en: "Muscle tear" },
      { ja: "筋萎縮", en: "Muscle atrophy" }
    ],
    answer: 0,
    explanationJa: "運動後の筋肉痛はDOMS（遅発性筋肉痛）と呼ばれ、通常24〜72時間後にピークを迎えます。",
    explanationEn: "Post-exercise soreness is called DOMS, typically peaking 24-72 hours after exercise."
  },
  {
    ja: "三角筋はどこにある？",
    en: "Where is the deltoid muscle?",
    choices: [
      { ja: "肩", en: "Shoulder" },
      { ja: "お腹", en: "Abdomen" },
      { ja: "太もも", en: "Thigh" },
      { ja: "ふくらはぎ", en: "Calf" }
    ],
    answer: 0,
    explanationJa: "三角筋（デルトイド）は肩を覆う筋肉で、前部・中部・後部の3つの部分から構成されています。",
    explanationEn: "The deltoid covers the shoulder and has three parts: anterior, lateral, and posterior."
  },
  {
    ja: "BIG3に含まれない種目は？",
    en: "Which exercise is NOT part of the Big 3?",
    choices: [
      { ja: "懸垂", en: "Pull-ups" },
      { ja: "ベンチプレス", en: "Bench press" },
      { ja: "スクワット", en: "Squat" },
      { ja: "デッドリフト", en: "Deadlift" }
    ],
    answer: 0,
    explanationJa: "BIG3はベンチプレス・スクワット・デッドリフトの3種目です。懸垂は含まれません。",
    explanationEn: "The Big 3 are bench press, squat, and deadlift. Pull-ups are not included."
  },
  {
    ja: "筋トレ後のゴールデンタイムとは？",
    en: "What is the 'golden time' after weight training?",
    choices: [
      { ja: "運動後30分〜1時間", en: "30 min to 1 hour after exercise" },
      { ja: "運動後24時間", en: "24 hours after exercise" },
      { ja: "運動前30分", en: "30 min before exercise" },
      { ja: "就寝前", en: "Before bed" }
    ],
    answer: 0,
    explanationJa: "筋トレ後30分〜1時間は栄養吸収が高まるゴールデンタイムとされています（ただし最新研究では総摂取量がより重要）。",
    explanationEn: "The 30-60 min window post-workout is called 'golden time' for nutrient absorption (though total intake matters more)."
  },
  {
    ja: "人体で最も大きい筋肉は？",
    en: "What is the largest muscle in the human body?",
    choices: [
      { ja: "大臀筋", en: "Gluteus maximus" },
      { ja: "大胸筋", en: "Pectoralis major" },
      { ja: "広背筋", en: "Latissimus dorsi" },
      { ja: "大腿四頭筋", en: "Quadriceps" }
    ],
    answer: 0,
    explanationJa: "大臀筋（お尻の筋肉）は人体で最も大きい単一の筋肉です。",
    explanationEn: "The gluteus maximus (buttock muscle) is the largest single muscle in the human body."
  },
  {
    ja: "クレアチンの主な効果は？",
    en: "What is the main benefit of creatine?",
    choices: [
      { ja: "瞬発力・パワー向上", en: "Improved explosive power" },
      { ja: "脂肪燃焼", en: "Fat burning" },
      { ja: "柔軟性向上", en: "Improved flexibility" },
      { ja: "睡眠改善", en: "Better sleep" }
    ],
    answer: 0,
    explanationJa: "クレアチンはATP再合成を促進し、短時間の高強度運動でのパフォーマンスを向上させます。",
    explanationEn: "Creatine promotes ATP resynthesis, improving performance in short, high-intensity exercise."
  },
  {
    ja: "腕立て伏せで主に鍛えられる筋肉は？",
    en: "Which muscle is primarily trained by push-ups?",
    choices: [
      { ja: "大胸筋", en: "Pectoralis major" },
      { ja: "僧帽筋", en: "Trapezius" },
      { ja: "大腿四頭筋", en: "Quadriceps" },
      { ja: "腓腹筋", en: "Gastrocnemius" }
    ],
    answer: 0,
    explanationJa: "腕立て伏せは主に大胸筋を鍛え、副次的に三角筋前部と上腕三頭筋も使います。",
    explanationEn: "Push-ups primarily target the pecs, with secondary work on anterior deltoids and triceps."
  },
  {
    ja: "RM（アールエム）とは何の略？",
    en: "What does RM stand for in weight training?",
    choices: [
      { ja: "Repetition Maximum", en: "Repetition Maximum" },
      { ja: "Resistance Movement", en: "Resistance Movement" },
      { ja: "Recovery Muscle", en: "Recovery Muscle" },
      { ja: "Range of Motion", en: "Range of Motion" }
    ],
    answer: 0,
    explanationJa: "RMはRepetition Maximum（最大反復回数）の略で、1RMは1回だけ挙上できる最大重量を意味します。",
    explanationEn: "RM stands for Repetition Maximum. 1RM is the maximum weight you can lift for one rep."
  },
  {
    ja: "超回復にかかる一般的な時間は？",
    en: "How long does supercompensation typically take?",
    choices: [
      { ja: "48〜72時間", en: "48-72 hours" },
      { ja: "6時間", en: "6 hours" },
      { ja: "1週間", en: "1 week" },
      { ja: "30分", en: "30 minutes" }
    ],
    answer: 0,
    explanationJa: "超回復は一般的に48〜72時間かかり、この間に筋肉は以前より強くなります。",
    explanationEn: "Supercompensation typically takes 48-72 hours, during which muscles grow stronger than before."
  },
  {
    ja: "広背筋を鍛える代表的な種目は？",
    en: "Which exercise best targets the lats?",
    choices: [
      { ja: "ラットプルダウン", en: "Lat pulldown" },
      { ja: "レッグプレス", en: "Leg press" },
      { ja: "サイドレイズ", en: "Side raise" },
      { ja: "カーフレイズ", en: "Calf raise" }
    ],
    answer: 0,
    explanationJa: "ラットプルダウンは広背筋（背中の大きな筋肉）をターゲットにした代表的な種目です。",
    explanationEn: "Lat pulldowns are the go-to exercise for targeting the latissimus dorsi (large back muscle)."
  },
  {
    ja: "BCAA（分岐鎖アミノ酸）に含まれないのは？",
    en: "Which is NOT a BCAA?",
    choices: [
      { ja: "グルタミン", en: "Glutamine" },
      { ja: "ロイシン", en: "Leucine" },
      { ja: "イソロイシン", en: "Isoleucine" },
      { ja: "バリン", en: "Valine" }
    ],
    answer: 0,
    explanationJa: "BCAAはロイシン・イソロイシン・バリンの3つです。グルタミンは別のアミノ酸です。",
    explanationEn: "BCAAs are leucine, isoleucine, and valine. Glutamine is a different amino acid."
  },
  {
    ja: "僧帽筋はどの部位にある？",
    en: "Where is the trapezius muscle?",
    choices: [
      { ja: "首から背中上部", en: "Neck to upper back" },
      { ja: "お腹", en: "Abdomen" },
      { ja: "太もも裏", en: "Back of thigh" },
      { ja: "前腕", en: "Forearm" }
    ],
    answer: 0,
    explanationJa: "僧帽筋（トラップ）は首の後ろから背中上部にかけて広がるダイヤモンド形の筋肉です。",
    explanationEn: "The trapezius is a diamond-shaped muscle extending from the neck to the upper back."
  },
  {
    ja: "筋肥大に最適なレップ数は一般的に？",
    en: "What rep range is generally best for hypertrophy?",
    choices: [
      { ja: "8〜12回", en: "8-12 reps" },
      { ja: "1〜3回", en: "1-3 reps" },
      { ja: "30〜50回", en: "30-50 reps" },
      { ja: "100回以上", en: "100+ reps" }
    ],
    answer: 0,
    explanationJa: "筋肥大には8〜12回が最適とされていますが、最新研究では負荷に応じて幅広いレップ数でも効果があります。",
    explanationEn: "8-12 reps is traditionally optimal for hypertrophy, though recent research shows a wider range can work."
  },
  {
    ja: "アーノルド・シュワルツェネッガーが得意だった種目は？",
    en: "What was Arnold Schwarzenegger's signature exercise?",
    choices: [
      { ja: "アーノルドプレス", en: "Arnold press" },
      { ja: "レッグカール", en: "Leg curl" },
      { ja: "プランク", en: "Plank" },
      { ja: "バーピー", en: "Burpee" }
    ],
    answer: 0,
    explanationJa: "アーノルドプレスは彼が考案したとされるショルダープレスのバリエーションで、三角筋全体を鍛えます。",
    explanationEn: "The Arnold press is a shoulder press variation attributed to him, targeting all three deltoid heads."
  },
  {
    ja: "EAAとは何の略？",
    en: "What does EAA stand for?",
    choices: [
      { ja: "Essential Amino Acids（必須アミノ酸）", en: "Essential Amino Acids" },
      { ja: "Extra Athletic Ability", en: "Extra Athletic Ability" },
      { ja: "Energy And Activity", en: "Energy And Activity" },
      { ja: "Exercise After Afternoon", en: "Exercise After Afternoon" }
    ],
    answer: 0,
    explanationJa: "EAAは必須アミノ酸（Essential Amino Acids）の略で、体内で合成できない9種類のアミノ酸です。",
    explanationEn: "EAA stands for Essential Amino Acids — 9 amino acids the body cannot produce on its own."
  },
  {
    ja: "ハムストリングスはどこにある？",
    en: "Where are the hamstrings?",
    choices: [
      { ja: "太ももの裏側", en: "Back of the thigh" },
      { ja: "太ももの前側", en: "Front of the thigh" },
      { ja: "ふくらはぎ", en: "Calf" },
      { ja: "お尻", en: "Buttocks" }
    ],
    answer: 0,
    explanationJa: "ハムストリングスは太ももの裏側にある筋群で、膝を曲げる動作に重要です。",
    explanationEn: "The hamstrings are a muscle group on the back of the thigh, important for knee flexion."
  },
  {
    ja: "PFCバランスのPは何？",
    en: "What does the P in PFC balance stand for?",
    choices: [
      { ja: "Protein（タンパク質）", en: "Protein" },
      { ja: "Power（パワー）", en: "Power" },
      { ja: "Pump（パンプ）", en: "Pump" },
      { ja: "Performance", en: "Performance" }
    ],
    answer: 0,
    explanationJa: "PFCはProtein（タンパク質）・Fat（脂質）・Carbohydrate（炭水化物）の三大栄養素バランスです。",
    explanationEn: "PFC stands for Protein, Fat, and Carbohydrate — the three macronutrient balance."
  },
  {
    ja: "プランクで主に鍛えられる部位は？",
    en: "Which area does the plank primarily train?",
    choices: [
      { ja: "体幹（コア）", en: "Core" },
      { ja: "上腕二頭筋", en: "Biceps" },
      { ja: "大胸筋", en: "Pecs" },
      { ja: "ふくらはぎ", en: "Calves" }
    ],
    answer: 0,
    explanationJa: "プランクは体幹（コア）を安定させるアイソメトリック種目で、腹筋群全体を鍛えます。",
    explanationEn: "The plank is an isometric core exercise that trains the entire abdominal muscle group."
  },
  {
    ja: "ミスター・オリンピアで最多優勝回数は？",
    en: "Most Mr. Olympia wins ever?",
    choices: [
      { ja: "8回", en: "8 times" },
      { ja: "3回", en: "3 times" },
      { ja: "15回", en: "15 times" },
      { ja: "1回", en: "1 time" }
    ],
    answer: 0,
    explanationJa: "リー・ヘイニーとロニー・コールマンがそれぞれ8回優勝で最多記録を共有しています。",
    explanationEn: "Lee Haney and Ronnie Coleman share the record with 8 Mr. Olympia wins each."
  },
  {
    ja: "カーボローディングの目的は？",
    en: "What is the purpose of carb loading?",
    choices: [
      { ja: "グリコーゲン貯蔵の最大化", en: "Maximize glycogen storage" },
      { ja: "脂肪燃焼の促進", en: "Promote fat burning" },
      { ja: "筋肉の分解", en: "Muscle breakdown" },
      { ja: "水分補給", en: "Hydration" }
    ],
    answer: 0,
    explanationJa: "カーボローディングは試合前に炭水化物を多く摂取し、筋グリコーゲンを最大限に蓄えることが目的です。",
    explanationEn: "Carb loading maximizes muscle glycogen stores before competition by increasing carbohydrate intake."
  },
  {
    ja: "上腕三頭筋の「三頭」とは？",
    en: "What does 'tri' in triceps mean?",
    choices: [
      { ja: "3つの起始部（頭）がある", en: "It has 3 heads (origins)" },
      { ja: "3倍の力がある", en: "It has 3x the power" },
      { ja: "3番目に大きい", en: "It's the 3rd largest" },
      { ja: "3秒で疲れる", en: "It tires in 3 seconds" }
    ],
    answer: 0,
    explanationJa: "上腕三頭筋は長頭・外側頭・内側頭の3つの起始部を持つことから「三頭筋」と呼ばれます。",
    explanationEn: "The triceps has three heads: long, lateral, and medial — hence 'tri' (three) ceps."
  },
  {
    ja: "有酸素運動で脂肪燃焼が始まるのは一般的に？",
    en: "When does fat burning typically start during cardio?",
    choices: [
      { ja: "運動開始直後から（割合は変化する）", en: "From the start (ratio changes)" },
      { ja: "必ず20分後から", en: "Always after 20 minutes" },
      { ja: "1時間後", en: "After 1 hour" },
      { ja: "3時間後", en: "After 3 hours" }
    ],
    answer: 0,
    explanationJa: "脂肪は運動開始直後から燃焼しています。「20分後から」は誤解で、時間と共に脂肪の利用割合が増えるだけです。",
    explanationEn: "Fat burns from the start of exercise. The '20-minute myth' is wrong — the fat-to-carb ratio just shifts over time."
  },
  {
    ja: "コンパウンド種目とは？",
    en: "What is a compound exercise?",
    choices: [
      { ja: "複数の関節を使う多関節種目", en: "Multi-joint exercise" },
      { ja: "1つの関節だけ使う種目", en: "Single-joint exercise" },
      { ja: "化学物質を使う種目", en: "Exercise using chemicals" },
      { ja: "2人で行う種目", en: "Two-person exercise" }
    ],
    answer: 0,
    explanationJa: "コンパウンド種目は複数の関節と筋肉群を同時に使う種目（例：スクワット、ベンチプレス）です。",
    explanationEn: "Compound exercises use multiple joints and muscle groups simultaneously (e.g., squat, bench press)."
  },
  {
    ja: "腓腹筋はどこにある？",
    en: "Where is the gastrocnemius?",
    choices: [
      { ja: "ふくらはぎ", en: "Calf" },
      { ja: "前腕", en: "Forearm" },
      { ja: "首", en: "Neck" },
      { ja: "腰", en: "Lower back" }
    ],
    answer: 0,
    explanationJa: "腓腹筋（ガストロクネミウス）はふくらはぎの主要な筋肉で、つま先立ちの動作に使われます。",
    explanationEn: "The gastrocnemius is the main calf muscle, used in plantarflexion (standing on tiptoe)."
  },
  {
    ja: "インターバル（セット間休憩）の推奨時間は筋肥大の場合？",
    en: "Recommended rest between sets for hypertrophy?",
    choices: [
      { ja: "60〜90秒", en: "60-90 seconds" },
      { ja: "10秒", en: "10 seconds" },
      { ja: "10分", en: "10 minutes" },
      { ja: "30分", en: "30 minutes" }
    ],
    answer: 0,
    explanationJa: "筋肥大目的では60〜90秒の休憩が一般的に推奨されています。筋力目的では3〜5分です。",
    explanationEn: "60-90 seconds rest is generally recommended for hypertrophy. For strength, 3-5 minutes."
  },
  {
    ja: "チートデイの目的は？",
    en: "What is the purpose of a cheat day?",
    choices: [
      { ja: "代謝を活性化し、精神的リフレッシュ", en: "Boost metabolism & mental refresh" },
      { ja: "できるだけ太ること", en: "Gain as much weight as possible" },
      { ja: "筋肉を減らすこと", en: "Reduce muscle mass" },
      { ja: "特に目的はない", en: "No particular purpose" }
    ],
    answer: 0,
    explanationJa: "チートデイは減量中に一時的にカロリーを増やし、低下した代謝を活性化させる戦略です。",
    explanationEn: "A cheat day temporarily increases calories during a cut to boost slowed metabolism."
  }
];

// --- Shuffle utility ---
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// --- Game State ---
const QUESTIONS_PER_ROUND = 15;
let currentQuestions = [];
let currentIndex = 0;
let score = 0;
let answered = false;
let unlockedImages = new Set();
let usedImages = new Set();

// --- DOM ---
const startScreen = document.getElementById('start-screen');
const quizScreen = document.getElementById('quiz-screen');
const resultScreen = document.getElementById('result-screen');
const rewardOverlay = document.getElementById('reward-overlay');

function startGame() {
  // Pick 15 random questions, shuffle choices for each
  const pool = shuffle(questions);
  currentQuestions = pool.slice(0, QUESTIONS_PER_ROUND).map(q => {
    // Shuffle choices while tracking answer
    const indices = [0, 1, 2, 3];
    const shuffled = shuffle(indices);
    const newChoices = shuffled.map(i => q.choices[i]);
    const newAnswer = shuffled.indexOf(q.answer);
    return { ...q, choices: newChoices, answer: newAnswer };
  });
  currentIndex = 0;
  score = 0;
  usedImages = new Set();
  answered = false;

  startScreen.classList.add('hidden');
  resultScreen.classList.add('hidden');
  quizScreen.classList.remove('hidden');

  updateProgress();
  showQuestion();
}

function showQuestion() {
  answered = false;
  const q = currentQuestions[currentIndex];

  document.getElementById('question-number').textContent = `Q${currentIndex + 1} / ${QUESTIONS_PER_ROUND}`;
  document.getElementById('question-ja').textContent = q.ja;
  document.getElementById('question-en').textContent = q.en;

  const choicesEl = document.getElementById('choices');
  choicesEl.innerHTML = '';

  q.choices.forEach((c, i) => {
    const btn = document.createElement('button');
    btn.className = 'choice-btn';
    btn.innerHTML = `<span class="choice-ja">${c.ja}</span><span class="choice-en">${c.en}</span>`;
    btn.addEventListener('click', () => selectAnswer(i));
    choicesEl.appendChild(btn);
  });

  document.getElementById('explanation-box').classList.add('hidden');
  document.getElementById('next-btn').classList.add('hidden');
  updateProgress();
}

function selectAnswer(index) {
  if (answered) return;
  answered = true;

  const q = currentQuestions[currentIndex];
  const buttons = document.querySelectorAll('.choice-btn');
  const isCorrect = index === q.answer;

  // Mark correct/wrong
  buttons.forEach((btn, i) => {
    btn.disabled = true;
    if (i === q.answer) btn.classList.add('correct');
    if (i === index && !isCorrect) btn.classList.add('wrong');
  });

  if (isCorrect) {
    score++;
    playCorrect();
    showRewardImage();
  } else {
    playWrong();
  }

  // Show explanation
  const expBox = document.getElementById('explanation-box');
  document.getElementById('explanation-ja').textContent = q.explanationJa;
  document.getElementById('explanation-en').textContent = q.explanationEn;
  expBox.classList.remove('hidden');
  expBox.classList.add(isCorrect ? 'correct-exp' : 'wrong-exp');
  expBox.classList.remove(isCorrect ? 'wrong-exp' : 'correct-exp');

  document.getElementById('result-label').textContent = isCorrect
    ? '✅ 正解！ / Correct!'
    : '❌ 不正解… / Wrong…';

  document.getElementById('score-display').textContent = `${score} / ${currentIndex + 1}`;
  document.getElementById('next-btn').classList.remove('hidden');
}

function showRewardImage() {
  // Pick a random image not yet used this round
  let available = [];
  for (let i = 1; i <= 10; i++) {
    if (!usedImages.has(i)) available.push(i);
  }
  if (available.length === 0) {
    available = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    usedImages.clear();
  }
  const pick = available[Math.floor(Math.random() * available.length)];
  usedImages.add(pick);
  unlockedImages.add(pick);

  const img = document.getElementById('reward-img');
  img.src = `images/img${pick}.png`;
  rewardOverlay.classList.remove('hidden');
  rewardOverlay.classList.add('show');

  setTimeout(() => {
    rewardOverlay.classList.remove('show');
    setTimeout(() => rewardOverlay.classList.add('hidden'), 400);
  }, 1800);
}

function nextQuestion() {
  currentIndex++;
  if (currentIndex >= QUESTIONS_PER_ROUND) {
    showResult();
  } else {
    showQuestion();
  }
}

function updateProgress() {
  const pct = ((currentIndex) / QUESTIONS_PER_ROUND) * 100;
  document.getElementById('progress-fill').style.width = pct + '%';
}

function showResult() {
  playResult();
  quizScreen.classList.add('hidden');
  resultScreen.classList.remove('hidden');

  const pct = Math.round((score / QUESTIONS_PER_ROUND) * 100);
  let titleJa, titleEn, emoji;

  if (score === QUESTIONS_PER_ROUND) {
    titleJa = '筋肉博士'; titleEn = 'Muscle Master'; emoji = '🏆';
  } else if (pct >= 70) {
    titleJa = '筋トレ中級者'; titleEn = 'Intermediate'; emoji = '💪';
  } else {
    titleJa = '筋トレ初心者'; titleEn = 'Beginner'; emoji = '🔰';
  }

  document.getElementById('result-emoji').textContent = emoji;
  document.getElementById('result-title-ja').textContent = titleJa;
  document.getElementById('result-title-en').textContent = titleEn;
  document.getElementById('result-score').textContent = `${score} / ${QUESTIONS_PER_ROUND} 正解 (${pct}%)`;

  // Show unlocked images gallery
  const gallery = document.getElementById('result-gallery');
  gallery.innerHTML = '';
  for (let i = 1; i <= 10; i++) {
    const div = document.createElement('div');
    div.className = 'gallery-item' + (unlockedImages.has(i) ? ' unlocked' : ' locked');
    if (unlockedImages.has(i)) {
      div.innerHTML = `<img src="images/img${i}.png" alt="img${i}">`;
    } else {
      div.innerHTML = `<div class="lock-icon">🔒</div>`;
    }
    gallery.appendChild(div);
  }
}

function shareResult() {
  const pct = Math.round((score / QUESTIONS_PER_ROUND) * 100);
  let title;
  if (score === QUESTIONS_PER_ROUND) title = '筋肉博士認定🏆';
  else if (pct >= 70) title = '筋トレ中級者💪';
  else title = '筋トレ初心者🔰';

  const text = `【筋肉クイズ】${QUESTIONS_PER_ROUND}問中${score}問正解！${title}\n#MuscleLove #筋肉クイズ\nhttps://www.patreon.com/cw/MuscleLove`;

  if (navigator.share) {
    navigator.share({ text }).catch(() => {});
  } else if (navigator.clipboard) {
    navigator.clipboard.writeText(text).then(() => {
      const btn = document.getElementById('share-btn');
      btn.textContent = 'コピーしました！ / Copied!';
      setTimeout(() => { btn.innerHTML = '📤 シェアする / Share'; }, 2000);
    });
  }
}

// --- Event Listeners ---
document.getElementById('start-btn').addEventListener('click', startGame);
document.getElementById('next-btn').addEventListener('click', nextQuestion);
document.getElementById('retry-btn').addEventListener('click', startGame);
document.getElementById('share-btn').addEventListener('click', shareResult);
