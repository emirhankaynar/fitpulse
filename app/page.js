'use client';
import { useState, useEffect } from 'react';

// Sabit Besin Veritabanı
const FOOD_DATABASE = [
  { id: 1, name: 'Tavuk Göğsü (Haşlama/Izgara)', kcal: 120, p: 22.5, c: 0, f: 2.6 },
  { id: 2, name: 'Dana Biftek / Yağsız Et', kcal: 215, p: 26.0, c: 0, f: 12.0 },
  { id: 3, name: 'Yumurta (Tam - 1 Adet ~50g)', kcal: 72, p: 6.3, c: 0.4, f: 4.8 },
  { id: 4, name: 'Yumurta Beyazı (1 Adet ~35g)', kcal: 17, p: 3.6, c: 0.2, f: 0.1 },
  { id: 5, name: 'Yulaf Ezmesi', kcal: 370, p: 13.5, c: 60.0, f: 7.0 },
  { id: 6, name: 'Pirinç (Baldo / Basmati - Çiğ)', kcal: 355, p: 7.0, c: 78.0, f: 0.6 },
  { id: 7, name: 'Makarna (Çiğ)', kcal: 350, p: 12.0, c: 72.0, f: 1.5 },
  { id: 8, name: 'Tatlı / Normal Patates', kcal: 86, p: 1.6, c: 20.0, f: 0.1 },
  { id: 9, name: 'Ton Balığı (Süzülmüş)', kcal: 116, p: 26.0, c: 0, f: 1.0 },
  { id: 10, name: 'Fıstık Ezmesi (%100)', kcal: 588, p: 25.0, c: 20.0, f: 50.0 },
  { id: 11, name: 'Whey Protein (1 Ölçek ~30g)', kcal: 120, p: 24.0, c: 2.0, f: 1.5 },
  { id: 12, name: 'Lor Peyniri (Yağsız)', kcal: 85, p: 17.0, c: 3.0, f: 0.5 },
  { id: 13, name: 'Muz (Orta Boy ~120g)', kcal: 105, p: 1.3, c: 27.0, f: 0.3 },
  { id: 14, name: 'Çiğ Badem / Ceviz', kcal: 590, p: 21.0, c: 10.0, f: 52.0 },
  { id: 15, name: 'Süzme Yoğurt / Skyr', kcal: 65, p: 10.0, c: 3.5, f: 0.2 },
];

// F/P Protein Kaynakları Rehberi
const CHEAPEST_PROTEIN_SOURCES = [
  {
    name: 'Yağsız / Tuzsuz Lor Peyniri',
    icon: '🧀',
    proteinPer100: '17 - 19g',
    costScore: '★★★★★ (En Ekonomik)',
    costPerProtein: '~0.45 TL / g Protein',
    tip: 'Bütçe dostu kazein bombası. Yulaf lapasına, omlete veya smoothielere karıştırılabilir.',
    badge: 'KRAL F/P',
  },
  {
    name: 'Tavuk Göğsü (Fileto)',
    icon: '🍗',
    proteinPer100: '22 - 24g',
    costScore: '★★★★★ (Mükemmel)',
    costPerProtein: '~0.75 TL / g Protein',
    tip: 'Neredeyse sıfır yağ ve karbonhidrat. Definasyon ve hacim döneminin vazgeçilmezi.',
    badge: 'KAS İNŞA EDİCİ',
  },
  {
    name: 'Yumurta (L / M Boy)',
    icon: '🥚',
    proteinPer100: '13g (Adet: ~6.3g)',
    costScore: '★★★★☆ (En Yüksek Biyoyararlanım)',
    costPerProtein: '~0.85 TL / g Protein',
    tip: 'Biyolojik değeri 100 üzerinden 100 kabul edilen en kaliteli amino asit profiline sahip.',
    badge: 'ALTIN STANDART',
  },
  {
    name: 'Süzme Yoğurt / Protein Yoğurt',
    icon: '🥣',
    proteinPer100: '10 - 12g',
    costScore: '★★★★☆ (Yüksek F/P)',
    costPerProtein: '~0.95 TL / g Protein',
    tip: 'Sindirim sistemi için probiyotik desteği ve gece yatmadan önce yavaş salınımlı kazein.',
    badge: 'SİNDİRİM DOSTU',
  },
  {
    name: 'Kuru Baklagiller (Yeşil Mercimek / Nohut)',
    icon: '🫘',
    proteinPer100: '23 - 25g (Çiğ)',
    costScore: '★★★★★ (Ultra Ekonomik)',
    costPerProtein: '~0.35 TL / g Protein',
    tip: 'Bitkisel protein + yüksek lif. Pirinç ile kombine edilerek tam amino asit zinciri tamamlanır.',
    badge: 'LİF & ENERJİ',
  },
  {
    name: 'Ton Balığı (Konserve)',
    icon: '🐟',
    proteinPer100: '25 - 26g',
    costScore: '★★★☆☆ (Pratik & Temiz)',
    costPerProtein: '~1.40 TL / g Protein',
    tip: 'Pişirme derdi yok, Omega-3 deposu. Yoğun günlerde doğrudan kutudan tüketilebilir.',
    badge: 'PRATİK ÖĞÜN',
  },
];

export default function Home() {
  const [showSplash, setShowSplash] = useState(true);
  const [activeTab, setActiveTab] = useState('tdee');

  // PRO Üyelik
  const [isPro, setIsPro] = useState(false);
  const [showProModal, setShowProModal] = useState(false);
  const [licenseKey, setLicenseKey] = useState('');
  const [licenseMsg, setLicenseMsg] = useState('');
  const [aiScanCount, setAiScanCount] = useState(0);

  // Kalori State'leri
  const [weight, setWeight] = useState(77);
  const [height, setHeight] = useState(185);
  const [age, setAge] = useState(22);
  const [gender, setGender] = useState('male');
  const [activity, setActivity] = useState(1.55);
  const [goal, setGoal] = useState('cut');

  // 1RM & Dinlenme
  const [oneRmWeight, setOneRmWeight] = useState(80);
  const [oneRmReps, setOneRmReps] = useState(6);
  const [timeLeft, setTimeLeft] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);

  // Su & Besin Cetveli
  const [waterGlasses, setWaterGlasses] = useState(0);
  const [selectedFoodId, setSelectedFoodId] = useState(1);
  const [foodGrams, setFoodGrams] = useState(150);
  const [mealList, setMealList] = useState([]);

  // Barkod State'leri
  const [barcodeInput, setBarcodeInput] = useState('');
  const [barcodeLoading, setBarcodeLoading] = useState(false);
  const [scannedProduct, setScannedProduct] = useState(null);
  const [barcodeError, setBarcodeError] = useState('');

  // AI Tabak & Metinle Anlatım State'leri
  const [imagePreview, setImagePreview] = useState(null);
  const [mealTextPrompt, setMealTextPrompt] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [detectedItems, setDetectedItems] = useState([]);
  const [scanStepText, setScanStepText] = useState('');

  // Story Modalı
  const [showShareModal, setShowShareModal] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 1600);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const savedPro = localStorage.getItem('fitpulse_pro_user');
    if (savedPro === 'true') setIsPro(true);
  }, []);

  const handleActivateLicense = () => {
    if (licenseKey.trim().toUpperCase() === 'FITPRO2026' || licenseKey.trim().length >= 8) {
      setIsPro(true);
      localStorage.setItem('fitpulse_pro_user', 'true');
      setLicenseMsg('✅ Pro VIP Aboneliğiniz Başarıyla Aktif Edildi!');
      setTimeout(() => setShowProModal(false), 1400);
    } else {
      setLicenseMsg('❌ Geçersiz lisans anahtarı.');
    }
  };

  // Dinlenme Sayacı
  useEffect(() => {
    let timer;
    if (timerRunning && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    } else if (timeLeft === 0 && timerRunning) {
      setTimerRunning(false);
    }
    return () => clearInterval(timer);
  }, [timerRunning, timeLeft]);

  // Kalori & Makro Hesapları
  const bmr = gender === 'male'
    ? 10 * weight + 6.25 * height - 5 * age + 5
    : 10 * weight + 6.25 * height - 5 * age - 161;
  const baseTdee = Math.round(bmr * Number(activity));
  const goalOffsets = { cut: -450, maintain: 0, bulk: +350 };
  const targetCalories = baseTdee + goalOffsets[goal];
  const waterNeedLiters = ((weight * 0.033) + (activity > 1.4 ? 0.6 : 0.3)).toFixed(1);
  const targetGlasses = Math.round((Number(waterNeedLiters) * 1000) / 250);

  const proteinGrams = Math.round(weight * 2.0);
  const fatGrams = Math.round(weight * 0.9);
  const remainingCalories = targetCalories - (proteinGrams * 4 + fatGrams * 9);
  const carbGrams = Math.max(0, Math.round(remainingCalories / 4));

  const calculate1RM = () => {
    if (oneRmReps === 1) return oneRmWeight;
    return Math.round(oneRmWeight * (36 / (37 - Math.min(oneRmReps, 30))));
  };

  // AI VISION & METİNLE BESİN ANALİZİ (GERÇEK GEMINI API)
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setDetectedItems([]);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyzeFood = async (type = 'image') => {
    if (!isPro && aiScanCount >= 1) {
      setShowProModal(true);
      return;
    }

    if (type === 'image' && !imagePreview) return;
    if (type === 'text' && !mealTextPrompt.trim()) return;

    setAnalyzing(true);
    setScanStepText(type === 'image' ? '📸 Tabak taranıyor & Vision AI hesaplıyor...' : '✍️ Öğününüz analiz ediliyor...');

    try {
      const payload = type === 'image' ? { imageBase64: imagePreview } : { textPrompt: mealTextPrompt };
      const res = await fetch('/api/analyze-plate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.error) {
        alert('Hata: ' + data.error);
        return;
      }

      if (data.items && data.items.length > 0) {
        const formatted = data.items.map((item, idx) => ({
          ...item,
          id: Date.now() + idx,
        }));
        setDetectedItems(formatted);
        setAiScanCount((prev) => prev + 1);
        if (type === 'text') setMealTextPrompt('');
      } else {
        alert('Besin tespit edilemedi. Lütfen daha net bir ifade veya fotoğraf deneyin.');
      }
    } catch (err) {
      alert('Analiz sırasında bağlantı hatası oluştu.');
    } finally {
      setAnalyzing(false);
    }
  };

  const updateDetectedGram = (id, newGrams) => {
    setDetectedItems(
      detectedItems.map((item) => {
        if (item.id === id) {
          const factor = Math.max(10, Number(newGrams)) / item.grams;
          return {
            ...item,
            grams: Number(newGrams),
            kcal: Math.round(item.kcal * factor),
            p: Number((item.p * factor).toFixed(1)),
            c: Number((item.c * factor).toFixed(1)),
            f: Number((item.f * factor).toFixed(1)),
          };
        }
        return item;
      })
    );
  };

  const addDetectedToDiary = () => {
    setMealList([...mealList, ...detectedItems]);
    setDetectedItems([]);
    setImagePreview(null);
    setActiveTab('tracker');
  };

  // Barkod Servisi
  const searchBarcode = async (code) => {
    const queryCode = code || barcodeInput;
    if (!queryCode) return;
    setBarcodeLoading(true);
    setBarcodeError('');
    setScannedProduct(null);

    try {
      const res = await fetch(`https://world.openfoodfacts.org/api/v2/product/${queryCode.trim()}.json`);
      const data = await res.json();
      if (data.status === 1 && data.product) {
        const p = data.product;
        const nutriments = p.nutriments || {};
        setScannedProduct({
          name: p.product_name || 'Market Ürünü',
          brand: p.brands || 'Genel',
          image: p.image_front_url || null,
          kcal: Math.round(nutriments['energy-kcal_100g'] || 0),
          p: Number((nutriments.proteins_100g || 0).toFixed(1)),
          c: Number((nutriments.carbohydrates_100g || 0).toFixed(1)),
          f: Number((nutriments.fat_100g || 0).toFixed(1)),
        });
      } else {
        setBarcodeError('Ürün bulunamadı.');
      }
    } catch (err) {
      setBarcodeError('Barkod servisine ulaşılamadı.');
    } finally {
      setBarcodeLoading(false);
    }
  };

  const addScannedToDiary = () => {
    if (!scannedProduct) return;
    setMealList([...mealList, { id: Date.now(), name: `${scannedProduct.name} (${scannedProduct.brand})`, grams: 100, ...scannedProduct }]);
    setScannedProduct(null);
    setBarcodeInput('');
    setActiveTab('tracker');
  };

  const addFoodToMeal = () => {
    const food = FOOD_DATABASE.find((f) => f.id === Number(selectedFoodId));
    if (!food) return;
    const factor = foodGrams / 100;
    setMealList([
      ...mealList,
      {
        id: Date.now(),
        name: food.name,
        grams: foodGrams,
        kcal: Math.round(food.kcal * factor),
        p: Number((food.p * factor).toFixed(1)),
        c: Number((food.c * factor).toFixed(1)),
        f: Number((food.f * factor).toFixed(1)),
      },
    ]);
  };

  const mealTotals = mealList.reduce(
    (acc, curr) => ({
      kcal: acc.kcal + curr.kcal,
      p: acc.p + curr.p,
      c: acc.c + curr.c,
      f: acc.f + curr.f,
    }),
    { kcal: 0, p: 0, c: 0, f: 0 }
  );

  return (
    <>
      {/* 🚀 1. AÇILIŞ İNTROSU (SPLASH SCREEN) */}
      {showSplash && (
        <div className="fixed inset-0 z-[100] bg-[#050811] flex flex-col items-center justify-center">
          <div className="relative flex items-center justify-center">
            {/* Özel Vektörel Logo İntrosu */}
            <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-emerald-500 via-teal-400 to-cyan-500 p-0.5 shadow-2xl shadow-emerald-500/50 flex items-center justify-center animate-pulse">
              <div className="w-full h-full bg-slate-950 rounded-[22px] flex items-center justify-center">
                <svg className="w-12 h-12 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" fill="currentColor" fillOpacity="0.2" />
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2" stroke="#22d3ee" strokeWidth="2" />
                </svg>
              </div>
            </div>
            <div className="absolute -inset-4 rounded-full border border-emerald-500/30 animate-ping"></div>
          </div>
          <div className="mt-6 text-center space-y-1">
            <h1 className="text-2xl font-black tracking-widest text-white">
              FIT<span className="text-emerald-400">PULSE</span> <span className="text-xs text-amber-400 font-extrabold ml-1">AI</span>
            </h1>
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest">
              Smart Vision & Performance OS
            </p>
          </div>
        </div>
      )}

      {/* 🌌 2. SİBER ARKA PLAN & ANA ARAYÜZ */}
      <main className="relative min-h-screen bg-[#060913] text-slate-100 p-3 sm:p-6 md:p-10 flex flex-col items-center justify-start overflow-hidden">
        
        {/* Enerji Parıltıları */}
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-emerald-500/15 rounded-full blur-[160px] pointer-events-none"></div>
        <div className="absolute top-1/3 -right-40 w-[600px] h-[600px] bg-cyan-500/15 rounded-full blur-[160px] pointer-events-none"></div>

        <div className="relative z-10 max-w-3xl w-full space-y-5">
          
          {/* ÜST BAR */}
          <div className="flex items-center justify-between gap-2 bg-slate-900/90 border border-slate-800 backdrop-blur-xl p-2.5 sm:p-3 rounded-2xl shadow-xl">
            <div className="flex items-center gap-2">
              {isPro ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-black text-xs rounded-xl shadow-md">
                  👑 VIP PRO
                </span>
              ) : (
                <button
                  onClick={() => setShowProModal(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 font-black text-xs rounded-xl shadow-md hover:scale-105 transition"
                >
                  ⚡ PRO'YA YÜKSELT
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowShareModal(true)}
                className="text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold px-3 py-1.5 rounded-xl border border-slate-700 transition"
              >
                📸 Story Kartı
              </button>
            </div>
          </div>

          {/* ⚡ YENİ LOGO & BAŞLIK */}
          <div className="text-center flex flex-col items-center">
            <div className="flex items-center gap-3 bg-slate-900/90 border border-emerald-500/40 px-5 py-2.5 rounded-2xl shadow-2xl backdrop-blur-xl mb-2">
              
              {/* Vektörel FitPulse Logosu */}
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-cyan-400 p-0.5 shadow-lg shadow-emerald-500/30 flex items-center justify-center">
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                  <svg className="w-6 h-6 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" fill="currentColor" fillOpacity="0.2" />
                    <path d="M22 12h-4l-3 9L9 3l-3 9H2" stroke="#22d3ee" strokeWidth="2" />
                  </svg>
                </div>
              </div>

              <div className="text-left">
                <span className="text-lg font-black tracking-wider text-white flex items-center gap-1">
                  FIT<span className="text-emerald-400">PULSE</span> <span className="text-[10px] text-amber-400 font-bold">{isPro ? 'VIP' : 'PRO'}</span>
                </span>
                <span className="text-[9px] tracking-widest uppercase text-slate-400 block -mt-1 font-semibold">
                  Intelligent Nutrition & AI OS
                </span>
              </div>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Yapay Zeka Beslenme, Kalori & Güç Motoru
            </h1>
          </div>

          {/* SEKMELER */}
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5 bg-slate-900/80 p-1.5 rounded-2xl border border-slate-800">
            {[
              { id: 'tdee', label: '🔥 Kalori' },
              { id: 'ai_camera', label: '🧠 AI Tabak & Chat' },
              { id: 'cheap_protein', label: '🥩 F/P Protein' },
              { id: 'barcode', label: '📷 Barkod' },
              { id: 'tracker', label: '🥗 Cetvel' },
              { id: 'onerm', label: '💪 1RM & Sayaç' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 rounded-xl text-[11px] font-bold transition-all ${
                  activeTab === tab.id
                    ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/25 scale-[1.02]'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* 🧠 3. HEM FOTOĞRAF HEM DOĞAL DİLLE BESİN ANLATMA MODÜLÜ */}
          {activeTab === 'ai_camera' && (
            <div className="bg-slate-900/80 backdrop-blur-2xl border border-slate-800 rounded-3xl p-5 sm:p-7 shadow-2xl space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="inline-flex items-center gap-1 text-[10px] text-emerald-400 bg-emerald-950 px-2.5 py-0.5 rounded-md border border-emerald-500/30 mb-1">
                    ✨ Gemini 1.5 Flash Vision & NLP Engine
                  </div>
                  <h2 className="text-lg font-bold text-white">Akıllı Besin & Tabak Çözümleyici</h2>
                  <p className="text-xs text-slate-400">İster fotoğraf çek, ister ne yediğini yazarak anlat; anında makroları çıkarır.</p>
                </div>
                {!isPro && (
                  <span className="text-[10px] bg-slate-800 border border-slate-700 px-2 py-1 rounded-lg text-slate-400 font-mono">
                    Kalan Hak: {Math.max(0, 1 - aiScanCount)}/1
                  </span>
                )}
              </div>

              {/* BÖLÜM A: NE YEDİĞİNİ ANLAT (DOĞAL DİLLE MAKRO HESAPLAMA) */}
              <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-emerald-400 text-base">✍️</span>
                  <span className="text-xs font-bold text-white">Ne Yediğini Yazarak Anlat:</span>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    value={mealTextPrompt}
                    onChange={(e) => setMealTextPrompt(e.target.value)}
                    placeholder="Örn: 3 haşlanmış yumurta, 2 dilim tam buğday ekmeği ve 1 muz yedim"
                    className="flex-1 bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-white placeholder:text-slate-500 focus:border-emerald-500"
                    onKeyDown={(e) => e.key === 'Enter' && handleAnalyzeFood('text')}
                  />
                  <button
                    onClick={() => handleAnalyzeFood('text')}
                    disabled={analyzing || !mealTextPrompt.trim()}
                    className="px-5 py-3 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 text-xs font-black rounded-xl transition shadow-lg shadow-emerald-500/20 shrink-0"
                  >
                    {analyzing ? '...' : 'Hesapla ⚡'}
                  </button>
                </div>
              </div>

              {/* BÖLÜM B: FOTOĞRAFTAN VISION ANALİZİ */}
              <div className="relative border-2 border-dashed border-slate-700 hover:border-emerald-500/60 rounded-2xl p-4 text-center transition bg-slate-950 overflow-hidden">
                {imagePreview ? (
                  <div className="relative space-y-3">
                    <div className="relative inline-block mx-auto rounded-xl overflow-hidden shadow-2xl border border-slate-700">
                      <img src={imagePreview} alt="Yüklenen Tabak" className="max-h-64 mx-auto object-cover rounded-xl" />
                      {analyzing && (
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-500/30 to-transparent animate-[bounce_1.5s_infinite] pointer-events-none border-b-2 border-emerald-400"></div>
                      )}
                    </div>
                    {!analyzing && (
                      <div>
                        <button onClick={() => { setImagePreview(null); setDetectedItems([]); }} className="text-xs text-rose-400 hover:underline">
                          ✕ Fotoğrafı Değiştir / Yeniden Çek
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <label className="cursor-pointer flex flex-col items-center justify-center space-y-2 py-6">
                    <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-2xl shadow-inner">
                      📸
                    </div>
                    <span className="text-xs font-bold text-white">Veya Tabağın Fotoğrafını Yükle</span>
                    <span className="text-[10px] text-slate-500">Tabağın tamamı görünecek şekilde net bir fotoğraf seçin</span>
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  </label>
                )}
              </div>

              {imagePreview && (
                <button
                  onClick={() => handleAnalyzeFood('image')}
                  disabled={analyzing}
                  className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 text-slate-950 text-xs font-black rounded-xl transition shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2"
                >
                  {analyzing ? (
                    <>
                      <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></span>
                      <span>{scanStepText}</span>
                    </>
                  ) : (
                    '🧠 Fotoğrafı Vision AI ile Tara & Makroları Çıkar'
                  )}
                </button>
              )}

              {/* TESPİT EDİLEN SONUÇLAR */}
              {detectedItems.length > 0 && (
                <div className="bg-slate-950 border border-emerald-500/40 rounded-2xl p-4 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="text-xs font-bold text-emerald-400">✨ Çözümlenen Öğün İçeriği</span>
                    <span className="text-[10px] text-slate-400">Gramajı güncelleyebilirsiniz</span>
                  </div>

                  <div className="space-y-2.5">
                    {detectedItems.map((item) => (
                      <div key={item.id} className="flex flex-col sm:flex-row sm:items-center justify-between bg-slate-900/90 p-3 rounded-xl border border-slate-800 gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-white text-xs">{item.name}</span>
                            {item.confidence && (
                              <span className="text-[9px] bg-emerald-950 text-emerald-400 border border-emerald-500/30 px-1.5 py-0.2 rounded">
                                {item.confidence}
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-slate-400 mt-0.5 block">
                            {item.kcal} kcal • P: {item.p}g | K: {item.c}g | Y: {item.f}g
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            value={item.grams}
                            onChange={(e) => updateDetectedGram(item.id, e.target.value)}
                            className="w-20 bg-slate-950 border border-slate-700 rounded-lg p-1.5 text-xs text-center font-bold text-white"
                          />
                          <span className="text-xs text-slate-400">gram</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={addDetectedToDiary}
                    className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black rounded-xl transition shadow-lg shadow-emerald-500/20"
                  >
                    ➕ Tüm Bu Öğünü Günlük Cetvelime Ekle
                  </button>
                </div>
              )}
            </div>
          )}

          {/* DİĞER SEKMELER: F/P Protein, Kalori, Barkod, Cetvel, 1RM (Aynen Korundu) */}
          {activeTab === 'cheap_protein' && (
            <div className="bg-slate-900/80 backdrop-blur-2xl border border-slate-800 rounded-3xl p-5 sm:p-7 shadow-2xl space-y-4">
              <div>
                <div className="inline-flex items-center gap-1 text-[10px] text-amber-400 bg-amber-950 px-2.5 py-0.5 rounded-md border border-amber-500/30 mb-1">
                  💰 Maksimum Verim / Minimum Bütçe
                </div>
                <h2 className="text-lg font-bold text-white">En Ucuz & Kaliteli Protein Rehberi</h2>
              </div>
              <div className="space-y-3">
                {CHEAPEST_PROTEIN_SOURCES.map((src, idx) => (
                  <div key={idx} className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <span className="text-2xl">{src.icon}</span>
                        <div>
                          <h3 className="font-bold text-white text-xs sm:text-sm">{src.name}</h3>
                          <span className="text-[10px] text-emerald-400 font-bold">100g: {src.proteinPer100}</span>
                        </div>
                      </div>
                      <span className="text-[9px] bg-slate-900 text-amber-400 font-extrabold px-2.5 py-1 rounded-lg border border-amber-500/30">
                        {src.badge}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] bg-slate-900/70 p-2 rounded-xl border border-slate-800/80">
                      <span className="text-slate-400">Birim Maliyet: <b className="text-white">{src.costPerProtein}</b></span>
                      <span className="text-slate-400">{src.costScore}</span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">💡 {src.tip}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'tdee' && (
            <div className="bg-slate-900/80 backdrop-blur-2xl border border-slate-800 rounded-3xl p-5 sm:p-7 shadow-2xl space-y-5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-400 uppercase">Cinsiyet</label>
                  <div className="grid grid-cols-2 gap-2 mt-1.5">
                    <button
                      type="button"
                      onClick={() => setGender('male')}
                      className={`py-2.5 rounded-xl text-xs font-bold transition-all border ${
                        gender === 'male' ? 'bg-emerald-500 text-slate-950 border-emerald-400' : 'bg-slate-950 border-slate-800 text-slate-400'
                      }`}
                    >
                      Erkek ♂
                    </button>
                    <button
                      type="button"
                      onClick={() => setGender('female')}
                      className={`py-2.5 rounded-xl text-xs font-bold transition-all border ${
                        gender === 'female' ? 'bg-emerald-500 text-slate-950 border-emerald-400' : 'bg-slate-950 border-slate-800 text-slate-400'
                      }`}
                    >
                      Kadın ♀
                    </button>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-400 uppercase">Yaş</label>
                  <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 mt-1.5 text-white font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-400 uppercase">Boy (cm)</label>
                  <input
                    type="number"
                    value={height}
                    onChange={(e) => setHeight(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 mt-1.5 text-white font-semibold"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-400 uppercase">Kilo (kg)</label>
                  <input
                    type="number"
                    value={weight}
                    onChange={(e) => setWeight(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 mt-1.5 text-white font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase mb-2 block">Hedef</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'cut', label: '🔥 Yağ Yakımı', desc: 'Definasyon' },
                    { id: 'maintain', label: '⚡ Koruma', desc: 'Recomp' },
                    { id: 'bulk', label: '💪 Kas Kazanımı', desc: 'Clean Bulk' },
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setGoal(item.id)}
                      className={`py-2.5 px-2 rounded-xl text-center border transition-all ${
                        goal === item.id ? 'bg-emerald-500/15 border-emerald-500 text-emerald-400' : 'bg-slate-950 border-slate-800 text-slate-400'
                      }`}
                    >
                      <span className="block text-xs font-bold">{item.label}</span>
                      <span className="text-[9px] text-slate-500 block mt-0.5">{item.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-slate-950 border border-emerald-500/30 rounded-2xl p-5 text-center space-y-4">
                <div>
                  <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Hedef Günlük Kalori</span>
                  <div className="text-4xl font-black text-white mt-0.5">{targetCalories} <span className="text-xs text-slate-400 font-normal">kcal</span></div>
                </div>

                <div className="grid grid-cols-3 gap-2.5 border-t border-slate-800/80 pt-3 text-center">
                  <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-400">Protein</span>
                    <p className="text-lg font-black text-emerald-400 mt-0.5">{proteinGrams}g</p>
                  </div>
                  <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-400">Karbonhidrat</span>
                    <p className="text-lg font-black text-cyan-400 mt-0.5">{carbGrams}g</p>
                  </div>
                  <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-400">Sağlıklı Yağ</span>
                    <p className="text-lg font-black text-amber-400 mt-0.5">{fatGrams}g</p>
                  </div>
                </div>

                <div className="border-t border-slate-800/80 pt-3 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-300 font-bold">💧 Günlük Su ({waterNeedLiters}L)</span>
                    <span className="font-bold text-cyan-400">{waterGlasses * 0.25}L</span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setWaterGlasses((prev) => prev + 1)}
                      className="flex-1 py-2 bg-cyan-950/70 border border-cyan-500/40 text-cyan-400 rounded-xl text-xs font-bold"
                    >
                      + 1 Bardak (250ml)
                    </button>
                    <button onClick={() => setWaterGlasses(0)} className="px-3 py-2 bg-slate-900 text-slate-500 rounded-xl text-xs">
                      Sıfırla
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'barcode' && (
            <div className="bg-slate-900/80 backdrop-blur-2xl border border-slate-800 rounded-3xl p-5 sm:p-7 shadow-2xl space-y-4">
              <h2 className="text-lg font-bold text-white">Barkod Arama Motoru</h2>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Barkod girin (örn: 8690504035619)"
                  value={barcodeInput}
                  onChange={(e) => setBarcodeInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && searchBarcode()}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white font-mono"
                />
                <button
                  onClick={() => searchBarcode()}
                  disabled={barcodeLoading || !barcodeInput}
                  className="px-4 bg-emerald-500 text-slate-950 text-xs font-black rounded-xl"
                >
                  {barcodeLoading ? '...' : 'Ara'}
                </button>
              </div>
              {barcodeError && <div className="text-rose-400 text-xs">{barcodeError}</div>}
              {scannedProduct && (
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
                  <h3 className="text-sm font-bold text-white">{scannedProduct.name} ({scannedProduct.brand})</h3>
                  <div className="grid grid-cols-4 gap-2 text-center text-xs">
                    <div className="bg-slate-900 p-2 rounded-xl">Kcal: <b className="text-white block">{scannedProduct.kcal}</b></div>
                    <div className="bg-slate-900 p-2 rounded-xl">P: <b className="text-emerald-400 block">{scannedProduct.p}g</b></div>
                    <div className="bg-slate-900 p-2 rounded-xl">K: <b className="text-cyan-400 block">{scannedProduct.c}g</b></div>
                    <div className="bg-slate-900 p-2 rounded-xl">Y: <b className="text-amber-400 block">{scannedProduct.f}g</b></div>
                  </div>
                  <button onClick={addScannedToDiary} className="w-full py-2 bg-emerald-500 text-slate-950 text-xs font-black rounded-xl">
                    ➕ Cetvele Ekle
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'tracker' && (
            <div className="bg-slate-900/80 backdrop-blur-2xl border border-slate-800 rounded-3xl p-5 sm:p-7 shadow-2xl space-y-4">
              <h2 className="text-lg font-bold text-white">Günlük Besin Cetveli</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <select
                  value={selectedFoodId}
                  onChange={(e) => setSelectedFoodId(e.target.value)}
                  className="sm:col-span-2 bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white"
                >
                  {FOOD_DATABASE.map((f) => (
                    <option key={f.id} value={f.id}>{f.name} (100g: {f.kcal} kcal | {f.p}g P)</option>
                  ))}
                </select>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={foodGrams}
                    onChange={(e) => setFoodGrams(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-center font-bold text-white"
                  />
                  <button onClick={addFoodToMeal} className="px-4 bg-emerald-500 text-slate-950 text-xs font-black rounded-xl">
                    Ekle
                  </button>
                </div>
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-white">Öğün Listesi ({mealList.length})</span>
                  {mealList.length > 0 && <button onClick={() => setMealList([])} className="text-rose-400 hover:underline">Temizle</button>}
                </div>
                {mealList.map((item) => (
                  <div key={item.id} className="flex justify-between items-center bg-slate-900/80 p-2.5 rounded-xl border border-slate-800 text-xs">
                    <div>
                      <span className="font-bold text-white">{item.name}</span>
                      <span className="text-[10px] text-slate-400 block">{item.grams}g • {item.kcal} kcal | P: {item.p}g | K: {item.c}g | Y: {item.f}g</span>
                    </div>
                    <button onClick={() => setMealList(mealList.filter((m) => m.id !== item.id))} className="text-slate-500 hover:text-rose-400 px-2">✕</button>
                  </div>
                ))}
                <div className="border-t border-slate-800 pt-3 grid grid-cols-4 gap-2 text-center text-xs font-black">
                  <div className="bg-slate-900 p-2 rounded-xl text-white">Kcal: {mealTotals.kcal}</div>
                  <div className="bg-slate-900 p-2 rounded-xl text-emerald-400">P: {mealTotals.p.toFixed(1)}g</div>
                  <div className="bg-slate-900 p-2 rounded-xl text-cyan-400">K: {mealTotals.c.toFixed(1)}g</div>
                  <div className="bg-slate-900 p-2 rounded-xl text-amber-400">Y: {mealTotals.f.toFixed(1)}g</div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'onerm' && (
            <div className="bg-slate-900/80 backdrop-blur-2xl border border-slate-800 rounded-3xl p-5 sm:p-7 shadow-2xl space-y-4">
              <div className="bg-slate-950 p-5 rounded-2xl border border-cyan-500/30 text-center space-y-2">
                <span className="text-[10px] font-bold text-cyan-400 uppercase">Set Arası Dinlenme Sayacı</span>
                <div className="text-4xl font-black text-white font-mono">
                  {Math.floor(timeLeft / 60)}:{timeLeft % 60 < 10 ? '0' : ''}{timeLeft % 60}
                </div>
                <div className="flex justify-center gap-1.5 pt-2">
                  {[45, 60, 90, 120].map((sec) => (
                    <button key={sec} onClick={() => { setTimeLeft(sec); setTimerRunning(true); }} className="px-3 py-1.5 bg-slate-900 text-slate-300 rounded-xl text-xs font-bold border border-slate-800">
                      {sec}s
                    </button>
                  ))}
                  {timerRunning && <button onClick={() => setTimerRunning(false)} className="px-3 py-1.5 bg-rose-500/20 text-rose-400 rounded-xl text-xs font-bold">Durdur</button>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <input type="number" value={oneRmWeight} onChange={(e) => setOneRmWeight(Number(e.target.value))} placeholder="Ağırlık" className="bg-slate-950 p-3 rounded-xl text-white text-xs border border-slate-800" />
                <input type="number" value={oneRmReps} onChange={(e) => setOneRmReps(Number(e.target.value))} placeholder="Tekrar" className="bg-slate-950 p-3 rounded-xl text-white text-xs border border-slate-800" />
              </div>
              <div className="bg-slate-950 p-4 rounded-2xl border border-emerald-500/30 text-center">
                <span className="text-[10px] text-emerald-400 uppercase font-bold">Tahmini 1RM Gücün</span>
                <div className="text-3xl font-black text-white mt-1">{calculate1RM()} <span className="text-xs text-slate-400">kg</span></div>
              </div>
            </div>
          )}

          {/* 👑 PRO ÜYELİK MODALI */}
          {showProModal && (
            <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
              <div className="bg-slate-900 border border-emerald-500/40 rounded-3xl p-6 max-w-md w-full space-y-4 text-left shadow-2xl relative">
                <button onClick={() => setShowProModal(false)} className="absolute top-4 right-4 text-slate-400 text-xl">✕</button>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">👑</span>
                  <h3 className="text-base font-black text-white">FitPulse Pro VIP</h3>
                </div>
                <a
                  href="https://kaynar82.gumroad.com/l/fitpulse-membership"
                  target="_blank"
                  rel="noreferrer"
                  className="p-4 bg-slate-950 border-2 border-emerald-500/60 rounded-2xl flex justify-between items-center hover:border-emerald-400 transition"
                >
                  <div>
                    <span className="text-[9px] text-amber-400 font-bold block">SINIRSIZ VIP ERİŞİM</span>
                    <span className="text-2xl font-black text-white">$2.99 / ay</span>
                  </div>
                  <div className="px-4 py-2 bg-emerald-500 text-slate-950 font-black text-xs rounded-xl">Abone Ol →</div>
                </a>
                <div className="pt-2 flex gap-2">
                  <input
                    type="text"
                    placeholder="FITPRO2026"
                    value={licenseKey}
                    onChange={(e) => setLicenseKey(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white uppercase"
                  />
                  <button onClick={handleActivateLicense} className="px-4 bg-emerald-500 text-slate-950 text-xs font-bold rounded-xl">Aktif Et</button>
                </div>
                {licenseMsg && <p className="text-xs text-center text-amber-400">{licenseMsg}</p>}
              </div>
            </div>
          )}

          {/* 📸 STORY MODALI */}
          {showShareModal && (
            <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 max-w-xs w-full space-y-4 text-center">
                <button onClick={() => setShowShareModal(false)} className="float-right text-slate-400">✕</button>
                <div className="bg-slate-950 p-5 rounded-2xl border border-emerald-500/40 text-left space-y-3">
                  <span className="font-black text-white text-xs block">⚡ FITPULSE AI</span>
                  <div className="text-center py-2">
                    <span className="text-3xl font-black text-white">{targetCalories}</span>
                    <span className="text-[10px] text-slate-400 block">kcal Günlük Hedef</span>
                  </div>
                  <div className="grid grid-cols-3 gap-1 text-center text-xs">
                    <div className="bg-slate-900 p-1.5 rounded-lg text-emerald-400">{proteinGrams}g P</div>
                    <div className="bg-slate-900 p-1.5 rounded-lg text-cyan-400">{carbGrams}g K</div>
                    <div className="bg-slate-900 p-1.5 rounded-lg text-amber-400">{fatGrams}g Y</div>
                  </div>
                </div>
                <button onClick={() => alert('Ekran görüntüsü alarak doğrudan paylaşabilirsiniz!')} className="w-full py-2.5 bg-emerald-500 text-slate-950 rounded-xl text-xs font-black">
                  Ekran Görüntüsü Al
                </button>
              </div>
            </div>
          )}

        </div>
      </main>
    </>
  );
}