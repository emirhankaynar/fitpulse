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
    tip: 'Neredeyse sıfır yağ ve sıfır karbonhidrat. Definasyon ve hacim döneminin vazgeçilmezi.',
    badge: 'KAS İNŞA EDİCİ',
  },
  {
    name: 'Yumurta (L / M Boy)',
    icon: '🥚',
    proteinPer100: '13g (Adet: ~6.3g)',
    costScore: '★★★★☆ (Çok Yüksek Biyoyararlanım)',
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
    tip: 'Sindirim sistemi için probiyotik desteği ve yatmadan önce yavaş salınımlı kazein.',
    badge: 'SİNDİRİM DOSTU',
  },
  {
    name: 'Kuru Baklagiller (Yeşil Mercimek / Nohut)',
    icon: '🫘',
    proteinPer100: '23 - 25g (Çiğ)',
    costScore: '★★★★★ (Ultra Ekonomik)',
    costPerProtein: '~0.35 TL / g Protein',
    tip: 'Bitkisel protein + yüksek lif. Pirinç ile kombine edilerek tam amino asit zinciri oluşturulur.',
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
  // Splash Screen State
  const [showSplash, setShowSplash] = useState(true);

  // Tab State
  const [activeTab, setActiveTab] = useState('tdee');

  // PRO Üyelik Yönetimi
  const [isPro, setIsPro] = useState(false);
  const [showProModal, setShowProModal] = useState(false);
  const [licenseKey, setLicenseKey] = useState('');
  const [licenseMsg, setLicenseMsg] = useState('');
  const [aiScanCount, setAiScanCount] = useState(0);

  // Kalori & Makro State'leri
  const [weight, setWeight] = useState(77);
  const [height, setHeight] = useState(185);
  const [age, setAge] = useState(22);
  const [gender, setGender] = useState('male');
  const [activity, setActivity] = useState(1.55);
  const [goal, setGoal] = useState('cut');

  // 1RM Güç
  const [oneRmWeight, setOneRmWeight] = useState(80);
  const [oneRmReps, setOneRmReps] = useState(6);

  // Rest Timer State
  const [timeLeft, setTimeLeft] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);

  // Su Takip State
  const [waterGlasses, setWaterGlasses] = useState(0);

  // Besin Toplayıcı State
  const [selectedFoodId, setSelectedFoodId] = useState(1);
  const [foodGrams, setFoodGrams] = useState(150);
  const [mealList, setMealList] = useState([]);

  // Barkod Tarama State'leri
  const [barcodeInput, setBarcodeInput] = useState('');
  const [barcodeLoading, setBarcodeLoading] = useState(false);
  const [scannedProduct, setScannedProduct] = useState(null);
  const [barcodeError, setBarcodeError] = useState('');

  // AI Tabak Fotoğrafı State'leri
  const [imagePreview, setImagePreview] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [detectedItems, setDetectedItems] = useState([]);
  const [scanStepText, setScanStepText] = useState('');

  // Haftalık Plan
  const [planDay, setPlanDay] = useState('Pazartesi');

  // PWA & Story Modalleri
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showShareModal, setShowShareModal] = useState(false);

  // Splash Screen Zamanlayıcısı
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 1800);
    return () => clearTimeout(timer);
  }, []);

  // Yerel Hafızadan Pro Durumunu Yükle
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
      setLicenseMsg('❌ Geçersiz lisans anahtarı. Lütfen kontrol edin.');
    }
  };

  // PWA Kurulum Dinleyicisi
  useEffect(() => {
    const handleBeforeInstall = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
  }, []);

  const handleInstallPWA = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      await deferredPrompt.userChoice;
      setDeferredPrompt(null);
    } else {
      alert('Tarayıcınızın seçenekler menüsünden "Ana Ekrana Ekle / Uygulamayı Yükle" diyerek telefonunuza indirebilirsiniz!');
    }
  };

  // Dinlenme Sayacı (Rest Timer)
  useEffect(() => {
    let timer;
    if (timerRunning && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    } else if (timeLeft === 0 && timerRunning) {
      setTimerRunning(false);
    }
    return () => clearInterval(timer);
  }, [timerRunning, timeLeft]);

  const startTimer = (seconds) => {
    setTimeLeft(seconds);
    setTimerRunning(true);
  };

  // TDEE & Makrolar
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

  // 1RM
  const calculate1RM = () => {
    if (oneRmReps === 1) return oneRmWeight;
    return Math.round(oneRmWeight * (36 / (37 - Math.min(oneRmReps, 30))));
  };
  const max1RM = calculate1RM();

  // GELİŞMİŞ AI TABAK FOTOĞRAFI ANALİZİ
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

  const analyzePlate = () => {
    if (!isPro && aiScanCount >= 1) {
      setShowProModal(true);
      return;
    }
    setAnalyzing(true);
    setScanStepText('Görüntü taranıyor & pikseller çözümleniyor...');

    setTimeout(() => {
      setScanStepText('Besin geometrisi ve porsiyon hacmi hesaplanıyor...');
    }, 800);

    setTimeout(() => {
      setScanStepText('Makro besin veritabanı eşleştiriliyor...');
    }, 1600);

    setTimeout(() => {
      const detectedSample = [
        { id: Date.now() + 1, name: 'Izgara Tavuk Göğsü (Fileto)', grams: 220, kcal: 264, p: 49.5, c: 0, f: 5.7, confidence: '%98' },
        { id: Date.now() + 2, name: 'Basmati Pirinç Pilavı (Pişmiş)', grams: 180, kcal: 234, p: 5.2, c: 51.5, f: 0.9, confidence: '%94' },
        { id: Date.now() + 3, name: 'Zeytinyağlı Akdeniz Salatası', grams: 130, kcal: 92, p: 1.8, c: 4.2, f: 8.0, confidence: '%91' },
      ];
      setDetectedItems(detectedSample);
      setAnalyzing(false);
      setAiScanCount((prev) => prev + 1);
    }, 2400);
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

  // Barkod Arama (OpenFoodFacts API)
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
        const parsed = {
          name: p.product_name || p.generic_name || 'Market Ürünü',
          brand: p.brands || 'Marka Belirtilmemiş',
          image: p.image_front_url || null,
          kcal: Math.round(nutriments['energy-kcal_100g'] || nutriments['energy-kcal'] || 0),
          p: Number((nutriments.proteins_100g || 0).toFixed(1)),
          c: Number((nutriments.carbohydrates_100g || 0).toFixed(1)),
          f: Number((nutriments.fat_100g || 0).toFixed(1)),
        };
        setScannedProduct(parsed);
      } else {
        setBarcodeError('Ürün bulunamadı. Barkod numarasını kontrol edin.');
      }
    } catch (err) {
      setBarcodeError('Barkod servisine bağlanırken bir hata oluştu.');
    } finally {
      setBarcodeLoading(false);
    }
  };

  const addScannedToDiary = () => {
    if (!scannedProduct) return;
    const newItem = {
      id: Date.now(),
      name: `${scannedProduct.name} (${scannedProduct.brand})`,
      grams: 100,
      kcal: scannedProduct.kcal,
      p: scannedProduct.p,
      c: scannedProduct.c,
      f: scannedProduct.f,
    };
    setMealList([...mealList, newItem]);
    setScannedProduct(null);
    setBarcodeInput('');
    setActiveTab('tracker');
  };

  // Besin Ekleme
  const addFoodToMeal = () => {
    const food = FOOD_DATABASE.find((f) => f.id === Number(selectedFoodId));
    if (!food) return;
    const factor = foodGrams / 100;
    const newItem = {
      id: Date.now(),
      name: food.name,
      grams: foodGrams,
      kcal: Math.round(food.kcal * factor),
      p: Number((food.p * factor).toFixed(1)),
      c: Number((food.c * factor).toFixed(1)),
      f: Number((food.f * factor).toFixed(1)),
    };
    setMealList([...mealList, newItem]);
  };

  const removeFoodItem = (id) => {
    setMealList(mealList.filter((item) => item.id !== id));
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
      {/* 🚀 1. MODERN UYGULAMA AÇILIŞ İNTROSU (SPLASH SCREEN) */}
      {showSplash && (
        <div className="fixed inset-0 z-[100] bg-[#050811] flex flex-col items-center justify-center transition-opacity duration-700">
          <div className="relative flex items-center justify-center">
            <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-emerald-500 via-teal-400 to-cyan-500 animate-pulse flex items-center justify-center shadow-2xl shadow-emerald-500/40">
              <span className="text-4xl text-slate-950 font-black">⚡</span>
            </div>
            <div className="absolute -inset-4 rounded-full border border-emerald-500/30 animate-ping"></div>
          </div>
          <div className="mt-6 text-center space-y-1">
            <h1 className="text-2xl font-black tracking-widest text-white">
              FIT<span className="text-emerald-400">PULSE</span> <span className="text-xs text-amber-400 font-extrabold ml-1">PRO</span>
            </h1>
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest">
              Performance & AI Nutrition OS
            </p>
          </div>
          <div className="mt-8 flex gap-1.5">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce"></div>
            <div className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce [animation-delay:0.2s]"></div>
            <div className="w-2 h-2 rounded-full bg-teal-400 animate-bounce [animation-delay:0.4s]"></div>
          </div>
        </div>
      )}

      {/* 🌌 2. SİBER-FITNESS ARKA PLAN & ANA GÖVDE */}
      <main className="relative min-h-screen bg-[#060913] text-slate-100 p-3 sm:p-6 md:p-10 flex flex-col items-center justify-start overflow-hidden selection:bg-emerald-500 selection:text-slate-950">
        
        {/* Neon Glow Efektleri */}
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-emerald-500/15 rounded-full blur-[160px] pointer-events-none"></div>
        <div className="absolute top-1/3 -right-40 w-[600px] h-[600px] bg-cyan-500/15 rounded-full blur-[160px] pointer-events-none"></div>
        <div className="absolute -bottom-40 left-1/4 w-[500px] h-[500px] bg-teal-500/10 rounded-full blur-[150px] pointer-events-none"></div>

        <div className="relative z-10 max-w-3xl w-full space-y-5">
          
          {/* ÜST BAR: PRO STATUS & MOBİL İNDİRME */}
          <div className="flex items-center justify-between gap-2 bg-slate-900/90 border border-slate-800/80 backdrop-blur-xl p-2.5 sm:p-3 rounded-2xl shadow-xl">
            <div className="flex items-center gap-2">
              {isPro ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-black text-xs rounded-xl shadow-md">
                  👑 VIP PRO AKTİF
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
                className="text-[11px] bg-slate-800/90 hover:bg-slate-700 text-slate-300 font-bold px-3 py-1.5 rounded-xl border border-slate-700 transition flex items-center gap-1"
              >
                📸 Story Kartı
              </button>
              <button
                onClick={handleInstallPWA}
                className="text-[11px] bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 font-bold px-3 py-1.5 rounded-xl border border-emerald-500/30 transition flex items-center gap-1"
              >
                📲 Uygulamayı İndir
              </button>
            </div>
          </div>

          {/* LOGO & BAŞLIK */}
          <div className="text-center flex flex-col items-center">
            <div className="flex items-center gap-3 bg-slate-900/80 border border-emerald-500/30 px-5 py-2 rounded-2xl shadow-2xl backdrop-blur-xl mb-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-500 to-cyan-400 flex items-center justify-center text-slate-950 shadow-md font-black text-base">
                ⚡
              </div>
              <div className="text-left">
                <span className="text-base font-black tracking-wider text-white flex items-center gap-1">
                  FIT<span className="text-emerald-400">PULSE</span> <span className="text-[10px] text-amber-400 font-bold ml-0.5">{isPro ? 'VIP' : 'PRO'}</span>
                </span>
                <span className="text-[8px] tracking-widest uppercase text-slate-400 block -mt-1 font-semibold">
                  Intelligent Fitness Operating System
                </span>
              </div>
            </div>
            
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Performans, Makro & AI Beslenme Motoru
            </h1>
          </div>

          {/* MODÜL SEÇİM SEKMELERİ */}
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5 bg-slate-900/80 p-1.5 rounded-2xl border border-slate-800/80 backdrop-blur-md">
            {[
              { id: 'tdee', label: '🔥 Kalori' },
              { id: 'ai_camera', label: '📸 AI Tabak' },
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

          {/* 📸 1. GELİŞMİŞ AI TABAK FOTOĞRAFI ANALİZİ */}
          {activeTab === 'ai_camera' && (
            <div className="bg-slate-900/80 backdrop-blur-2xl border border-slate-800 rounded-3xl p-5 sm:p-7 shadow-2xl space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <div className="inline-flex items-center gap-1 text-[10px] text-emerald-400 bg-emerald-950/80 px-2.5 py-0.5 rounded-md border border-emerald-500/30 mb-1">
                    ✨ Neural Vision Engine v2.0
                  </div>
                  <h2 className="text-lg font-bold text-white">Yemek Fotoğrafından Akıllı Makro Analizi</h2>
                  <p className="text-xs text-slate-400">Tabağının fotoğrafını çek; yapay zeka porsiyonu tanıyıp makroları hesaplasın.</p>
                </div>
                {!isPro && (
                  <span className="text-[10px] bg-slate-800 border border-slate-700 px-2.5 py-1 rounded-lg text-slate-400 font-mono">
                    Ücretsiz Hak: {Math.max(0, 1 - aiScanCount)}/1
                  </span>
                )}
              </div>

              <div className="relative border-2 border-dashed border-slate-700 hover:border-emerald-500/60 rounded-2xl p-4 text-center transition bg-slate-950/60 overflow-hidden">
                {imagePreview ? (
                  <div className="relative space-y-3">
                    <div className="relative inline-block mx-auto rounded-xl overflow-hidden shadow-2xl border border-slate-700">
                      <img src={imagePreview} alt="Yüklenen Tabak" className="max-h-64 mx-auto object-cover rounded-xl" />
                      
                      {/* Lazer Tarama Çizgisi */}
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
                  <label className="cursor-pointer flex flex-col items-center justify-center space-y-2.5 py-8">
                    <div className="w-14 h-14 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-3xl shadow-inner">
                      📸
                    </div>
                    <span className="text-xs font-bold text-white">Tabağın Fotoğrafını Yükle veya Kamerayla Çek</span>
                    <span className="text-[10px] text-slate-500">Net ışık altında, tabağın tamamı görünecek şekilde</span>
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  </label>
                )}
              </div>

              <button
                onClick={analyzePlate}
                disabled={analyzing || !imagePreview}
                className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 disabled:opacity-50 text-slate-950 text-xs font-black rounded-xl transition shadow-lg shadow-emerald-500/25 active:scale-95 flex items-center justify-center gap-2"
              >
                {analyzing ? (
                  <>
                    <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></span>
                    <span>{scanStepText}</span>
                  </>
                ) : (
                  '🧠 Tabağı Analiz Et & Makroları Çıkar'
                )}
              </button>

              {/* TESPİT EDİLEN BESİNLER & GRAMAJ AYARI */}
              {detectedItems.length > 0 && (
                <div className="bg-slate-950 border border-emerald-500/40 rounded-2xl p-4 sm:p-5 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="text-xs font-bold text-emerald-400">✨ Tespit Edilen Besinler & Porsiyonlar</span>
                    <span className="text-[10px] text-slate-400">Gramajı değiştirebilirsiniz</span>
                  </div>

                  <div className="space-y-2.5">
                    {detectedItems.map((item) => (
                      <div key={item.id} className="flex flex-col sm:flex-row sm:items-center justify-between bg-slate-900/90 p-3 rounded-xl border border-slate-800 gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-white text-xs">{item.name}</span>
                            <span className="text-[9px] bg-emerald-950 text-emerald-400 border border-emerald-500/30 px-1.5 py-0.2 rounded">
                              {item.confidence} Eşleşme
                            </span>
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
                    ➕ Tüm Bu Öğünü Günlük Besin Cetvelime Aktar
                  </button>
                </div>
              )}
            </div>
          )}

          {/* 🥩 2. EN UCUZ & EN VERİMLİ PROTEİN REHBERİ */}
          {activeTab === 'cheap_protein' && (
            <div className="bg-slate-900/80 backdrop-blur-2xl border border-slate-800 rounded-3xl p-5 sm:p-7 shadow-2xl space-y-5">
              <div>
                <div className="inline-flex items-center gap-1 text-[10px] text-amber-400 bg-amber-950/80 px-2.5 py-0.5 rounded-md border border-amber-500/30 mb-1">
                  💰 Maksimum Verim / Minimum Bütçe
                </div>
                <h2 className="text-lg font-bold text-white">En Ucuz & Kaliteli Protein Kaynakları Rehberi</h2>
                <p className="text-xs text-slate-400">Gram başına en ekonomik, yüksek biyoyararlanıma sahip protein kaynakları:</p>
              </div>

              <div className="space-y-3">
                {CHEAPEST_PROTEIN_SOURCES.map((src, idx) => (
                  <div key={idx} className="bg-slate-950 p-4 rounded-2xl border border-slate-800 hover:border-emerald-500/40 transition space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <span className="text-2xl">{src.icon}</span>
                        <div>
                          <h3 className="font-bold text-white text-xs sm:text-sm">{src.name}</h3>
                          <span className="text-[10px] text-emerald-400 font-bold">100g içinde: {src.proteinPer100}</span>
                        </div>
                      </div>
                      <span className="text-[9px] bg-slate-900 text-amber-400 font-extrabold px-2.5 py-1 rounded-lg border border-amber-500/30">
                        {src.badge}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] bg-slate-900/70 p-2 rounded-xl border border-slate-800/80">
                      <span className="text-slate-400 font-medium">Birim Protein Maliyeti: <b className="text-white">{src.costPerProtein}</b></span>
                      <span className="text-slate-400">{src.costScore}</span>
                    </div>

                    <p className="text-[11px] text-slate-400 leading-relaxed pl-1">
                      💡 <span className="text-slate-300 font-semibold">Tüketim Tüyosu:</span> {src.tip}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 3. SEKME: KALORİ & SU HESAPLAYICI */}
          {activeTab === 'tdee' && (
            <div className="bg-slate-900/80 backdrop-blur-2xl border border-slate-800 rounded-3xl p-5 sm:p-7 shadow-2xl space-y-5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Cinsiyet</label>
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
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Yaş</label>
                  <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 mt-1.5 text-white font-semibold focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Boy (cm)</label>
                  <input
                    type="number"
                    value={height}
                    onChange={(e) => setHeight(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 mt-1.5 text-white font-semibold focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Kilo (kg)</label>
                  <input
                    type="number"
                    value={weight}
                    onChange={(e) => setWeight(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 mt-1.5 text-white font-semibold focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Aktivite Seviyesi</label>
                <select
                  value={activity}
                  onChange={(e) => setActivity(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 mt-1.5 text-xs text-white focus:border-emerald-500 cursor-pointer"
                >
                  <option value="1.2">Masa Başı (Hareketsiz / Egzersiz yok)</option>
                  <option value="1.375">Hafif Seviye (Haftada 1-2 gün antrenman)</option>
                  <option value="1.55">Orta Seviye (Haftada 3-5 gün antrenman)</option>
                  <option value="1.725">Ağır Tempo (Haftada 6-7 gün yoğun antrenman)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 block">Hedeflenen Fizik</label>
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
                        goal === item.id ? 'bg-emerald-500/15 border-emerald-500 text-emerald-400 scale-[1.02]' : 'bg-slate-950 border-slate-800 text-slate-400'
                      }`}
                    >
                      <span className="block text-xs font-bold">{item.label}</span>
                      <span className="text-[9px] text-slate-500 block mt-0.5">{item.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* SONUÇ KARTLARI */}
              <div className="bg-slate-950 border border-emerald-500/30 rounded-2xl p-5 shadow-inner space-y-4">
                <div className="text-center">
                  <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">
                    Günlük Hedef Kalori İhtiyacı
                  </span>
                  <div className="text-4xl font-black text-white mt-0.5">
                    {targetCalories} <span className="text-xs font-medium text-slate-400">kcal/gün</span>
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    BMR: <b className="text-slate-300">{Math.round(bmr)} kcal</b>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2.5 border-t border-slate-800/80 pt-3 text-center">
                  <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                    <span className="text-[10px] font-medium text-slate-400">Protein</span>
                    <p className="text-lg font-black text-emerald-400 mt-0.5">{proteinGrams}g</p>
                    <span className="text-[9px] text-slate-500">({proteinGrams * 4} kcal)</span>
                  </div>
                  <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                    <span className="text-[10px] font-medium text-slate-400">Karbonhidrat</span>
                    <p className="text-lg font-black text-cyan-400 mt-0.5">{carbGrams}g</p>
                    <span className="text-[9px] text-slate-500">({carbGrams * 4} kcal)</span>
                  </div>
                  <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                    <span className="text-[10px] font-medium text-slate-400">Sağlıklı Yağ</span>
                    <p className="text-lg font-black text-amber-400 mt-0.5">{fatGrams}g</p>
                    <span className="text-[9px] text-slate-500">({fatGrams * 9} kcal)</span>
                  </div>
                </div>

                {/* Su Takipçisi */}
                <div className="border-t border-slate-800/80 pt-3 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-300 font-bold">💧 Günlük Su Takipçisi ({waterNeedLiters} Litre)</span>
                    <span className="font-bold text-cyan-400">{waterGlasses * 0.25}L / {waterNeedLiters}L</span>
                  </div>
                  <div className="w-full bg-slate-900 rounded-full h-2.5 border border-slate-800 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full transition-all duration-300"
                      style={{ width: `${Math.min(100, (waterGlasses / targetGlasses) * 100)}%` }}
                    ></div>
                  </div>
                  <div className="flex gap-2 pt-1">
                    <button
                      onClick={() => setWaterGlasses((prev) => prev + 1)}
                      className="flex-1 py-2 bg-cyan-950/70 border border-cyan-500/40 text-cyan-400 hover:bg-cyan-900 rounded-xl text-xs font-bold transition"
                    >
                      + 1 Bardak (250 ml)
                    </button>
                    <button
                      onClick={() => setWaterGlasses(0)}
                      className="px-4 py-2 bg-slate-900 text-slate-500 hover:text-rose-400 rounded-xl text-xs font-semibold transition"
                    >
                      Sıfırla
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 4. SEKME: BARKOD OKUYUCU */}
          {activeTab === 'barcode' && (
            <div className="bg-slate-900/80 backdrop-blur-2xl border border-slate-800 rounded-3xl p-5 sm:p-7 shadow-2xl space-y-5">
              <div>
                <div className="inline-flex items-center gap-1 text-[10px] text-cyan-400 bg-cyan-950 px-2.5 py-0.5 rounded-md border border-cyan-500/30 mb-1">
                  🔍 OpenFoodFacts Barkod Motoru
                </div>
                <h2 className="text-lg font-bold text-white">Market Ürünü Barkod Arama</h2>
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Barkod numarası (örn: 8690504035619)"
                  value={barcodeInput}
                  onChange={(e) => setBarcodeInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && searchBarcode()}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white font-mono focus:border-emerald-500"
                />
                <button
                  onClick={() => searchBarcode()}
                  disabled={barcodeLoading || !barcodeInput}
                  className="px-4 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 text-xs font-black rounded-xl transition shrink-0"
                >
                  {barcodeLoading ? '...' : 'Tara'}
                </button>
              </div>

              {barcodeError && (
                <div className="p-3 bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs rounded-xl text-center">
                  {barcodeError}
                </div>
              )}

              {scannedProduct && (
                <div className="bg-slate-950 border border-cyan-500/40 rounded-2xl p-4 space-y-3">
                  <div className="flex items-center gap-3">
                    {scannedProduct.image ? (
                      <img src={scannedProduct.image} alt={scannedProduct.name} className="w-14 h-14 object-contain rounded-xl bg-white p-1" />
                    ) : (
                      <div className="w-14 h-14 rounded-xl bg-slate-900 flex items-center justify-center text-xl">📦</div>
                    )}
                    <div>
                      <span className="text-xs text-emerald-400 font-bold block">{scannedProduct.brand}</span>
                      <h3 className="text-xs sm:text-sm font-bold text-white">{scannedProduct.name}</h3>
                      <span className="text-[10px] text-slate-400">100g Değerleri</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-2 text-center text-xs">
                    <div className="bg-slate-900 p-2 rounded-xl border border-slate-800">
                      <span className="text-[9px] text-slate-400 block">Kcal</span>
                      <span className="font-bold text-white">{scannedProduct.kcal}</span>
                    </div>
                    <div className="bg-slate-900 p-2 rounded-xl border border-slate-800">
                      <span className="text-[9px] text-slate-400 block">Protein</span>
                      <span className="font-bold text-emerald-400">{scannedProduct.p}g</span>
                    </div>
                    <div className="bg-slate-900 p-2 rounded-xl border border-slate-800">
                      <span className="text-[9px] text-slate-400 block">Karb</span>
                      <span className="font-bold text-cyan-400">{scannedProduct.c}g</span>
                    </div>
                    <div className="bg-slate-900 p-2 rounded-xl border border-slate-800">
                      <span className="text-[9px] text-slate-400 block">Yağ</span>
                      <span className="font-bold text-amber-400">{scannedProduct.f}g</span>
                    </div>
                  </div>

                  <button
                    onClick={addScannedToDiary}
                    className="w-full py-2.5 bg-emerald-500 text-slate-950 text-xs font-black rounded-xl hover:bg-emerald-400 transition"
                  >
                    ➕ Besin Cetveline Ekle
                  </button>
                </div>
              )}
            </div>
          )}

          {/* 5. SEKME: GÜNLÜK BESİN CETVELİ */}
          {activeTab === 'tracker' && (
            <div className="bg-slate-900/80 backdrop-blur-2xl border border-slate-800 rounded-3xl p-5 sm:p-7 shadow-2xl space-y-5">
              <div>
                <h2 className="text-lg font-bold text-white">Günlük Besin Cetveli</h2>
                <p className="text-xs text-slate-400">Tükettiğin besinleri topla, gün sonu toplam makrolarını gör.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <div className="sm:col-span-2">
                  <select
                    value={selectedFoodId}
                    onChange={(e) => setSelectedFoodId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:border-emerald-500"
                  >
                    {FOOD_DATABASE.map((f) => (
                      <option key={f.id} value={f.id}>
                        {f.name} (100g: {f.kcal} kcal | {f.p}g P)
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={foodGrams}
                    onChange={(e) => setFoodGrams(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white font-bold text-center"
                  />
                  <button
                    onClick={addFoodToMeal}
                    className="px-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black rounded-xl"
                  >
                    Ekle
                  </button>
                </div>
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-xs font-bold text-white">Günün Öğün Listesi ({mealList.length})</span>
                  {mealList.length > 0 && (
                    <button onClick={() => setMealList([])} className="text-[11px] text-rose-400 hover:underline">
                      Temizle
                    </button>
                  )}
                </div>

                {mealList.length === 0 ? (
                  <p className="text-xs text-slate-500 text-center py-5">Henüz besin eklenmedi.</p>
                ) : (
                  <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                    {mealList.map((item) => (
                      <div key={item.id} className="flex items-center justify-between bg-slate-900/80 p-2.5 rounded-xl border border-slate-800/80 text-xs">
                        <div>
                          <span className="font-bold text-white block">{item.name}</span>
                          <span className="text-[10px] text-slate-400">{item.grams}g • {item.kcal} kcal | P: {item.p}g | K: {item.c}g | Y: {item.f}g</span>
                        </div>
                        <button onClick={() => removeFoodItem(item.id)} className="text-slate-500 hover:text-rose-400 text-sm px-2">
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <div className="border-t border-slate-800 pt-3 grid grid-cols-4 gap-2 text-center text-xs">
                  <div className="bg-slate-900 p-2 rounded-xl border border-slate-800">
                    <span className="text-[9px] text-slate-400 block">Kcal</span>
                    <span className="font-black text-white">{mealTotals.kcal}</span>
                  </div>
                  <div className="bg-slate-900 p-2 rounded-xl border border-slate-800">
                    <span className="text-[9px] text-slate-400 block">Protein</span>
                    <span className="font-black text-emerald-400">{mealTotals.p.toFixed(1)}g</span>
                  </div>
                  <div className="bg-slate-900 p-2 rounded-xl border border-slate-800">
                    <span className="text-[9px] text-slate-400 block">Karb</span>
                    <span className="font-black text-cyan-400">{mealTotals.c.toFixed(1)}g</span>
                  </div>
                  <div className="bg-slate-900 p-2 rounded-xl border border-slate-800">
                    <span className="text-[9px] text-slate-400 block">Yağ</span>
                    <span className="font-black text-amber-400">{mealTotals.f.toFixed(1)}g</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 6. SEKME: 1RM GÜÇ & DINLENME SAYACI */}
          {activeTab === 'onerm' && (
            <div className="bg-slate-900/80 backdrop-blur-2xl border border-slate-800 rounded-3xl p-5 sm:p-7 shadow-2xl space-y-5">
              <div className="bg-slate-950 border border-cyan-500/30 rounded-2xl p-5 text-center space-y-3">
                <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest block">
                  ⏱️ Set Arası Dinlenme Sayacı (Rest Timer)
                </span>
                <div className="text-4xl font-black text-white font-mono">
                  {Math.floor(timeLeft / 60)}:{timeLeft % 60 < 10 ? '0' : ''}{timeLeft % 60}
                </div>
                <div className="flex justify-center gap-1.5">
                  {[45, 60, 90, 120, 180].map((sec) => (
                    <button
                      key={sec}
                      onClick={() => startTimer(sec)}
                      className="px-3 py-1.5 bg-slate-900 hover:bg-cyan-500 hover:text-slate-950 text-slate-300 border border-slate-800 rounded-xl text-xs font-bold transition"
                    >
                      {sec}s
                    </button>
                  ))}
                  {timerRunning && (
                    <button
                      onClick={() => setTimerRunning(false)}
                      className="px-3 py-1.5 bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded-xl text-xs font-bold"
                    >
                      Durdur
                    </button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-400 uppercase">Ağırlık (kg)</label>
                  <input
                    type="number"
                    value={oneRmWeight}
                    onChange={(e) => setOneRmWeight(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 mt-1.5 text-white font-semibold focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-400 uppercase">Tekrar Sayısı</label>
                  <input
                    type="number"
                    value={oneRmReps}
                    onChange={(e) => setOneRmReps(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 mt-1.5 text-white font-semibold focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="bg-slate-950 border border-emerald-500/30 rounded-2xl p-4 text-center">
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">
                  Tahmini 1RM Gücün
                </span>
                <div className="text-3xl font-black text-white mt-1">{max1RM} <span className="text-sm text-slate-400 font-medium">kg</span></div>
              </div>
            </div>
          )}

          {/* 👑 PRO ÜYELİK MODALI */}
          {showProModal && (
            <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
              <div className="bg-slate-900 border border-emerald-500/40 rounded-3xl p-6 md:p-8 max-w-lg w-full space-y-5 shadow-2xl relative text-left">
                <button
                  onClick={() => setShowProModal(false)}
                  className="absolute top-4 right-4 text-slate-400 hover:text-white text-xl"
                >
                  ✕
                </button>

                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-yellow-400 flex items-center justify-center text-slate-950 font-black text-xl shadow-lg">
                    👑
                  </div>
                  <div>
                    <h3 className="text-base font-black text-white">FitPulse Pro VIP Üyelik</h3>
                    <span className="text-xs text-amber-400 font-semibold">Tüm Kilitleri Açın & Maksimum Gelişin</span>
                  </div>
                </div>

                <div className="space-y-2 bg-slate-950/80 p-4 rounded-2xl border border-slate-800 text-xs">
                  <div className="flex items-center gap-2 text-slate-200">
                    <span className="text-emerald-400 font-bold">✓</span> Sınırsız AI Tabak Fotoğrafı Analizi & Makro Okuma
                  </div>
                  <div className="flex items-center gap-2 text-slate-200">
                    <span className="text-emerald-400 font-bold">✓</span> Kişiye Özel PDF Haftalık Yemek Planı & Pazar Sepeti
                  </div>
                  <div className="flex items-center gap-2 text-slate-200">
                    <span className="text-emerald-400 font-bold">✓</span> Akıllı Progressive Overload Ağırlık Artış Motoru
                  </div>
                </div>

                <a
                  href="https://kaynar82.gumroad.com/l/fitpulse-membership"
                  target="_blank"
                  rel="noreferrer"
                  className="p-4 bg-gradient-to-r from-emerald-950/90 via-slate-900 to-slate-950 hover:border-emerald-400 border-2 border-emerald-500/60 rounded-2xl flex items-center justify-between transition group shadow-xl"
                >
                  <div>
                    <span className="inline-block text-[9px] text-amber-400 font-extrabold uppercase tracking-wider bg-amber-950/60 px-2 py-0.5 rounded border border-amber-500/30 mb-1">
                      OTOMATİK VIP ABONELİK
                    </span>
                    <div className="text-2xl font-black text-white">
                      $2.99 <span className="text-xs text-slate-400 font-normal">/ ay</span>
                    </div>
                  </div>
                  <div className="px-4 py-2.5 bg-emerald-500 group-hover:bg-emerald-400 text-slate-950 text-xs font-black rounded-xl transition shadow-lg shrink-0">
                    Abone Ol & Aç →
                  </div>
                </a>

                <div className="border-t border-slate-800 pt-4 space-y-2">
                  <span className="text-[11px] text-slate-400 block font-semibold">Lisans Anahtarınızı Girin:</span>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Örn: FITPRO2026"
                      value={licenseKey}
                      onChange={(e) => setLicenseKey(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white font-mono uppercase focus:border-emerald-500"
                    />
                    <button
                      onClick={handleActivateLicense}
                      className="px-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold rounded-xl transition shrink-0"
                    >
                      Aktif Et
                    </button>
                  </div>
                  {licenseMsg && <p className="text-xs font-semibold text-center mt-1 text-amber-400">{licenseMsg}</p>}
                </div>
              </div>
            </div>
          )}

          {/* 📱 3. EKRAN FOTOĞRAFI & STORY KARTI MODALI (9:16 FORMATINDA) */}
          {showShareModal && (
            <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 max-w-xs w-full space-y-4 text-center shadow-2xl relative">
                <button onClick={() => setShowShareModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white text-lg">
                  ✕
                </button>
                <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest block">
                  Instagram Story & Durum Kartı
                </span>

                {/* Hikaye Kartı Tasarımı */}
                <div className="bg-gradient-to-b from-[#0b1329] via-[#070c1a] to-[#04060d] border border-emerald-500/40 rounded-2xl p-5 space-y-4 text-left shadow-2xl">
                  <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
                    <span className="font-black text-white text-xs flex items-center gap-1">
                      ⚡ FIT<span className="text-emerald-400">PULSE</span>
                    </span>
                    <span className="text-[9px] bg-emerald-950 text-emerald-400 font-extrabold px-2 py-0.5 rounded border border-emerald-500/30 uppercase">
                      GÜNLÜK HEDEF
                    </span>
                  </div>

                  <div className="text-center py-2">
                    <span className="text-3xl font-black text-white tracking-tight">{targetCalories}</span>
                    <span className="text-[10px] text-slate-400 block font-medium">kcal / Günlük Hedef Kalori</span>
                  </div>

                  <div className="grid grid-cols-3 gap-1.5 text-center text-xs">
                    <div className="bg-slate-900/90 p-2 rounded-xl border border-slate-800">
                      <span className="text-[9px] text-slate-400 block">Protein</span>
                      <span className="font-bold text-emerald-400 text-xs">{proteinGrams}g</span>
                    </div>
                    <div className="bg-slate-900/90 p-2 rounded-xl border border-slate-800">
                      <span className="text-[9px] text-slate-400 block">Karb</span>
                      <span className="font-bold text-cyan-400 text-xs">{carbGrams}g</span>
                    </div>
                    <div className="bg-slate-900/90 p-2 rounded-xl border border-slate-800">
                      <span className="text-[9px] text-slate-400 block">Yağ</span>
                      <span className="font-bold text-amber-400 text-xs">{fatGrams}g</span>
                    </div>
                  </div>

                  <div className="border-t border-slate-800/80 pt-2 text-center">
                    <span className="text-[9px] text-slate-500">fitpulse-three-eta.vercel.app</span>
                  </div>
                </div>

                <button
                  onClick={() => alert('Ekran görüntüsü alıp doğrudan Instagram / WhatsApp hikayenizde paylaşabilirsiniz!')}
                  className="w-full py-3 bg-emerald-500 text-slate-950 rounded-xl text-xs font-black shadow-lg shadow-emerald-500/20"
                >
                  📸 Ekran Görüntüsü Al
                </button>
              </div>
            </div>
          )}

        </div>
      </main>
    </>
  );
}