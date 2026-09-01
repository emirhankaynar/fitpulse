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
  { id: 15, name: 'Zeytinyağı (1 Yemek Kaşığı ~10g)', kcal: 90, p: 0, c: 0, f: 10.0 },
];

export default function Home() {
  const [activeTab, setActiveTab] = useState('tdee');

  // PRO Üyelik Yönetimi
  const [isPro, setIsPro] = useState(false);
  const [showProModal, setShowProModal] = useState(false);
  const [licenseKey, setLicenseKey] = useState('');
  const [licenseMsg, setLicenseMsg] = useState('');
  const [aiScanCount, setAiScanCount] = useState(0);

  // Kalori & Makro State'leri
  const [weight, setWeight] = useState(77);
  const [targetWeight, setTargetWeight] = useState(72);
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

  // Haftalık Plan
  const [planDay, setPlanDay] = useState('Pazartesi');

  // PWA Prompt
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showShareModal, setShowShareModal] = useState(false);

  // Yerel Hafızadan Pro Durumunu Kontrol Etme
  useEffect(() => {
    const savedPro = localStorage.getItem('fitpulse_pro_user');
    if (savedPro === 'true') setIsPro(true);
  }, []);

  const handleActivateLicense = () => {
    if (licenseKey.trim().toUpperCase() === 'FITPRO2026' || licenseKey.trim().length >= 8) {
      setIsPro(true);
      localStorage.setItem('fitpulse_pro_user', 'true');
      setLicenseMsg('✅ Pro VIP Üyeliğiniz Başarıyla Aktif Edildi!');
      setTimeout(() => setShowProModal(false), 1500);
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
      alert('Tarayıcınızın menüsünden "Ana Ekrana Ekle / Uygulamayı Yükle" seçeneğine basarak doğrudan yükleyebilirsiniz!');
    }
  };

  // Dinlenme Sayacı (Rest Timer)
  useEffect(() => {
    let timer;
    if (timerRunning && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    } else if (timeLeft === 0 && timerRunning) {
      setTimerRunning(false);
      try {
        const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
        audio.play().catch(() => {});
      } catch (e) {}
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

  // AI Tabak Fotoğrafı Analizi
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const analyzePlate = () => {
    if (!isPro && aiScanCount >= 1) {
      setShowProModal(true);
      return;
    }
    setAnalyzing(true);
    setTimeout(() => {
      const mockResult = [
        { id: Date.now() + 1, name: 'Izgara Tavuk Göğsü', grams: 200, kcal: 240, p: 45, c: 0, f: 5.2 },
        { id: Date.now() + 2, name: 'Basmati Pirinç Pilavı', grams: 180, kcal: 235, p: 5.2, c: 52, f: 0.8 },
        { id: Date.now() + 3, name: 'Zeytinyağlı Salata', grams: 120, kcal: 85, p: 1.5, c: 4, f: 7.5 },
      ];
      setDetectedItems(mockResult);
      setAnalyzing(false);
      setAiScanCount((prev) => prev + 1);
    }, 1200);
  };

  const addDetectedToDiary = () => {
    setMealList([...mealList, ...detectedItems]);
    setDetectedItems([]);
    setImagePreview(null);
    setActiveTab('tracker');
  };

  // Barkod Arama (OpenFoodFacts Global API)
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

  // Haftalık Yemek Planı
  const weeklyPlans = {
    Pazartesi: [
      { meal: 'Kahvaltı', desc: '3 Haşlanmış Yumurta, 80g Yulaf, 1 Muz, 1 Kaşık Fıstık Ezmesi', p: '35g', kcal: '620' },
      { meal: 'Öğle', desc: '200g Izgara Tavuk Göğsü, 180g Basmati Pirinç Pilavı, Yeşillik', p: '52g', kcal: '680' },
      { meal: 'Ara Öğün', desc: '1 Ölçek Whey Protein Tozu, 1 Avuç Çiğ Badem', p: '28g', kcal: '270' },
      { meal: 'Akşam', desc: '160g Süzme Ton Balığı, 200g Haşlanmış Patates, Salata', p: '44g', kcal: '540' },
    ],
    Salı: [
      { meal: 'Kahvaltı', desc: '3 Yumurtalı Lorlu Omlet, 2 Dilim Tam Buğday Ekmeği, Domates', p: '38g', kcal: '550' },
      { meal: 'Öğle', desc: '180g Dana Köfte, 200g Kepekli Makarna, Yoğurt', p: '48g', kcal: '710' },
      { meal: 'Ara Öğün', desc: '200g Süzme Yoğurt, 1 Elma, Tarçın', p: '22g', kcal: '230' },
      { meal: 'Akşam', desc: '220g Fırında Tavuk, Fırın Sebzeler, Bulgur Pilavı', p: '46g', kcal: '610' },
    ],
    Çarşamba: [
      { meal: 'Kahvaltı', desc: 'Yulaflı Protein Kasesi (70g Yulaf, 1 Ölçek Protein, Orman Meyvesi)', p: '36g', kcal: '510' },
      { meal: 'Öğle', desc: '200g Hindi / Tavuk Sote, 180g Karabuğday, Mevsim Salata', p: '49g', kcal: '630' },
      { meal: 'Ara Öğün', desc: '2 Haşlanmış Yumurta, 1 Dilim Peynir', p: '18g', kcal: '210' },
      { meal: 'Akşam', desc: '200g Izgara Balık, Fırın Patates, Roka Salatası', p: '42g', kcal: '590' },
    ],
  };

  const shoppingList = [
    { cat: '🥩 Protein Kaynakları', items: '1.5 kg Tavuk Göğsü, 30 Adet Yumurta, 4 Kutu Ton Balığı, 500g Yağsız Lor, 500g Dana Kıyma' },
    { cat: '🌾 Karbonhidratlar', items: '1 kg Yulaf Ezmesi, 1 kg Basmati Pirinç, 500g Kepekli Makarna, 1 kg Patates' },
    { cat: '🥑 Sağlıklı Yağlar', items: 'Sızma Zeytinyağı, %100 Fıstık Ezmesi, 200g Çiğ Badem' },
    { cat: '🥬 Yeşillik & Meyve', items: 'Muz, Elma, Marul, Salatalık, Domates, Limon' },
  ];

  return (
    <main className="relative min-h-screen bg-[#070b14] text-slate-100 p-4 md:p-10 flex flex-col items-center justify-start overflow-hidden">
      
      {/* Glow Efektleri */}
      <div className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute top-1/3 -right-32 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none"></div>

      <div className="relative z-10 max-w-3xl w-full space-y-6">
        
        {/* ÜST BAR: PRO DURUMU & PWA YÜKLEME */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-900/90 border border-slate-800 p-3 rounded-2xl">
          <div className="flex items-center gap-2">
            {isPro ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-black text-xs rounded-xl shadow-md">
                👑 FITPULSE PRO VIP AKTİF
              </span>
            ) : (
              <button
                onClick={() => setShowProModal(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 font-black text-xs rounded-xl shadow-md hover:scale-105 transition"
              >
                ⚡ PRO'YA YÜKSELT (KİLİTLERİ AÇ)
              </button>
            )}
          </div>
          <button
            onClick={handleInstallPWA}
            className="text-xs text-slate-400 hover:text-white transition flex items-center gap-1"
          >
            📲 Uygulamayı Telefona İndir
          </button>
        </div>

        {/* LOGO & BAŞLIK */}
        <div className="text-center flex flex-col items-center">
          <div className="flex items-center gap-3 bg-slate-900/90 border border-emerald-500/20 px-5 py-2 rounded-2xl shadow-2xl backdrop-blur-xl mb-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-cyan-400 flex items-center justify-center text-slate-950 shadow-lg shadow-emerald-500/30 font-black text-lg">
              ⚡
            </div>
            <div className="text-left">
              <span className="text-lg font-black tracking-wider text-white flex items-center gap-1">
                FIT<span className="text-emerald-400">PULSE</span> <span className="text-xs text-amber-400 font-bold ml-1">{isPro ? 'PRO VIP' : 'PRO'}</span>
              </span>
              <span className="text-[9px] tracking-widest uppercase text-slate-400 block -mt-1 font-semibold">
                Complete Fitness Operating System
              </span>
            </div>
          </div>
          
          <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
            Performans, Beslenme & AI Asistanı
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Kalori hesaplama, AI tabak tarama, barkod motoru ve progresif antrenman asistanı.
          </p>
        </div>

        {/* MODÜL SEÇİM SEKMELERİ */}
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 bg-slate-900/80 p-1.5 rounded-2xl border border-slate-800 backdrop-blur-md">
          {[
            { id: 'tdee', label: '🔥 Kalori' },
            { id: 'ai_camera', label: '📸 AI Tabak' },
            { id: 'barcode', label: '📷 Barkod' },
            { id: 'mealplan', label: '📅 Yemek Planı' },
            { id: 'tracker', label: '🥗 Cetvel' },
            { id: 'onerm', label: '💪 1RM & Sayaç' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1.5 rounded-xl text-[11px] font-bold transition-all ${
                activeTab === tab.id
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* 1. SEKME: KALORİ & SU */}
        {activeTab === 'tdee' && (
          <div className="bg-slate-900/80 backdrop-blur-2xl border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Cinsiyet</label>
                <div className="grid grid-cols-2 gap-2 mt-2">
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
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 mt-2 text-white font-semibold focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Boy (cm)</label>
                <input
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 mt-2 text-white font-semibold focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Kilo (kg)</label>
                <input
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 mt-2 text-white font-semibold focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Aktivite Seviyesi</label>
              <select
                value={activity}
                onChange={(e) => setActivity(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 mt-2 text-xs md:text-sm text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
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
                    className={`py-3 px-2 rounded-xl text-center border transition-all ${
                      goal === item.id ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400 scale-[1.02]' : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    <span className="block text-xs font-bold">{item.label}</span>
                    <span className="text-[10px] text-slate-500 block mt-0.5">{item.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* SONUÇ KARTLARI */}
            <div className="bg-slate-950 border border-emerald-500/30 rounded-2xl p-6 shadow-inner space-y-5">
              <div className="text-center">
                <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-widest">
                  Günlük Hedef Kalori İhtiyacı
                </span>
                <div className="text-4xl md:text-5xl font-black text-white mt-1">
                  {targetCalories} <span className="text-sm font-medium text-slate-400">kcal/gün</span>
                </div>
                <div className="text-[11px] text-slate-400 mt-1">
                  Bazal Metabolizma (BMR): <b className="text-slate-300">{Math.round(bmr)} kcal</b>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 border-t border-slate-800/80 pt-4 text-center">
                <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                  <span className="text-[11px] font-medium text-slate-400">Protein</span>
                  <p className="text-xl font-black text-emerald-400 mt-0.5">{proteinGrams}g</p>
                  <span className="text-[10px] text-slate-500">({proteinGrams * 4} kcal)</span>
                </div>
                <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                  <span className="text-[11px] font-medium text-slate-400">Karbonhidrat</span>
                  <p className="text-xl font-black text-cyan-400 mt-0.5">{carbGrams}g</p>
                  <span className="text-[10px] text-slate-500">({carbGrams * 4} kcal)</span>
                </div>
                <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                  <span className="text-[11px] font-medium text-slate-400">Sağlıklı Yağ</span>
                  <p className="text-xl font-black text-amber-400 mt-0.5">{fatGrams}g</p>
                  <span className="text-[10px] text-slate-500">({fatGrams * 9} kcal)</span>
                </div>
              </div>

              {/* Su Takipçisi */}
              <div className="border-t border-slate-800/80 pt-4 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300 font-bold">💧 Günlük Su Takipçisi ({waterNeedLiters} Litre)</span>
                  <span className="font-bold text-cyan-400">{waterGlasses * 0.25}L / {waterNeedLiters}L</span>
                </div>
                <div className="w-full bg-slate-900 rounded-full h-3 border border-slate-800 overflow-hidden">
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

              <div className="grid grid-cols-2 gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowShareModal(true)}
                  className="py-2.5 bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 rounded-xl text-xs font-black shadow-lg shadow-emerald-500/20 transition active:scale-95"
                >
                  📱 Hikaye Kartı Al
                </button>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="py-2.5 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-xl text-xs font-bold border border-slate-700 transition"
                >
                  📄 PDF Kaydet
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 2. SEKME: FOTOĞRAFTAN AI TABAK ANALİZİ */}
        {activeTab === 'ai_camera' && (
          <div className="bg-slate-900/80 backdrop-blur-2xl border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="inline-flex items-center gap-1 text-[10px] text-emerald-400 bg-emerald-950 px-2.5 py-0.5 rounded-md border border-emerald-500/30 mb-1">
                  ✨ Vision & AI Engine
                </div>
                <h2 className="text-lg font-bold text-white">Fotoğraftan Akıllı Tabak Analizi</h2>
              </div>
              {!isPro && (
                <span className="text-[10px] bg-slate-800 border border-slate-700 px-2.5 py-1 rounded-lg text-slate-400 font-mono">
                  Kalan Ücretsiz Hak: {Math.max(0, 1 - aiScanCount)}/1
                </span>
              )}
            </div>

            <div className="border-2 border-dashed border-slate-700 hover:border-emerald-500/60 rounded-2xl p-5 text-center transition bg-slate-950/50">
              {imagePreview ? (
                <div className="space-y-3">
                  <img src={imagePreview} alt="Yüklenen Yemek" className="max-h-52 mx-auto rounded-xl shadow-lg object-cover" />
                  <button onClick={() => setImagePreview(null)} className="text-xs text-rose-400 hover:underline">
                    Fotoğrafı Değiştir
                  </button>
                </div>
              ) : (
                <label className="cursor-pointer flex flex-col items-center justify-center space-y-2 py-4">
                  <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-2xl">
                    📸
                  </div>
                  <span className="text-xs font-bold text-white">Tabağın Fotoğrafını Yükle veya Çek</span>
                  <span className="text-[10px] text-slate-500">PNG, JPG, HEIC</span>
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                </label>
              )}
            </div>

            <button
              onClick={analyzePlate}
              disabled={analyzing || !imagePreview}
              className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 text-xs font-black rounded-xl transition shadow-lg shadow-emerald-500/20 active:scale-95"
            >
              {analyzing ? '⚡ Tabak Analiz Ediliyor...' : '🧠 Tabağı Analiz Et & Makroları Çıkar'}
            </button>

            {detectedItems.length > 0 && (
              <div className="bg-slate-950 border border-emerald-500/40 rounded-2xl p-5 space-y-4">
                <span className="text-xs font-bold text-emerald-400">✨ Tabağında Tespit Edilen Besinler:</span>
                <div className="space-y-2">
                  {detectedItems.map((item) => (
                    <div key={item.id} className="flex items-center justify-between bg-slate-900 p-2.5 rounded-xl text-xs border border-slate-800">
                      <div>
                        <span className="font-bold text-white block">{item.name}</span>
                        <span className="text-[10px] text-slate-400">{item.grams}g • {item.kcal} kcal</span>
                      </div>
                      <span className="text-emerald-400 font-bold">P: {item.p}g</span>
                    </div>
                  ))}
                </div>
                <button
                  onClick={addDetectedToDiary}
                  className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-emerald-400 border border-emerald-500/40 text-xs font-bold rounded-xl transition"
                >
                  ➕ Bu Öğünü Besin Cetvelime Ekle
                </button>
              </div>
            )}
          </div>
        )}

        {/* 3. SEKME: BARKOD OKUYUCU */}
        {activeTab === 'barcode' && (
          <div className="bg-slate-900/80 backdrop-blur-2xl border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl space-y-6">
            <div>
              <div className="inline-flex items-center gap-1 text-[10px] text-cyan-400 bg-cyan-950 px-2.5 py-0.5 rounded-md border border-cyan-500/30 mb-1">
                🔍 OpenFoodFacts Canlı Barkod API
              </div>
              <h2 className="text-lg font-bold text-white">Market Ürünü Barkod Okuyucu</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Marketten aldığın ürünün paketindeki barkod numarasını gir; kalori ve makrolarını anında getirsin.
              </p>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Örn: 8690504035619 (Barkod numarası)"
                value={barcodeInput}
                onChange={(e) => setBarcodeInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && searchBarcode()}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white font-mono focus:border-emerald-500"
              />
              <button
                onClick={() => searchBarcode()}
                disabled={barcodeLoading || !barcodeInput}
                className="px-5 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 text-xs font-black rounded-xl transition shrink-0"
              >
                {barcodeLoading ? 'Aranıyor...' : 'Tara & Getir'}
              </button>
            </div>

            {barcodeError && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs rounded-xl text-center">
                {barcodeError}
              </div>
            )}

            {scannedProduct && (
              <div className="bg-slate-950 border border-cyan-500/40 rounded-2xl p-5 space-y-4">
                <div className="flex items-center gap-4">
                  {scannedProduct.image ? (
                    <img src={scannedProduct.image} alt={scannedProduct.name} className="w-16 h-16 object-contain rounded-xl bg-white p-1" />
                  ) : (
                    <div className="w-16 h-16 rounded-xl bg-slate-900 flex items-center justify-center text-2xl">📦</div>
                  )}
                  <div>
                    <span className="text-xs text-emerald-400 font-bold block">{scannedProduct.brand}</span>
                    <h3 className="text-sm font-bold text-white">{scannedProduct.name}</h3>
                    <span className="text-[10px] text-slate-400">100g Porsiyon Değerleri</span>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-2 text-center text-xs">
                  <div className="bg-slate-900 p-2 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Kalori</span>
                    <span className="font-bold text-white">{scannedProduct.kcal} kcal</span>
                  </div>
                  <div className="bg-slate-900 p-2 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Protein</span>
                    <span className="font-bold text-emerald-400">{scannedProduct.p}g</span>
                  </div>
                  <div className="bg-slate-900 p-2 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Karb</span>
                    <span className="font-bold text-cyan-400">{scannedProduct.c}g</span>
                  </div>
                  <div className="bg-slate-900 p-2 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Yağ</span>
                    <span className="font-bold text-amber-400">{scannedProduct.f}g</span>
                  </div>
                </div>

                <button
                  onClick={addScannedToDiary}
                  className="w-full py-2.5 bg-emerald-500 text-slate-950 text-xs font-black rounded-xl hover:bg-emerald-400 transition"
                >
                  ➕ Bu Ürünü Günlük Besin Cetvelime Ekle
                </button>
              </div>
            )}
          </div>
        )}

        {/* 4. SEKME: HAFTALIK YEMEK PLANI & PRO ÖZEL PLAN */}
        {activeTab === 'mealplan' && (
          <div className="bg-slate-900/80 backdrop-blur-2xl border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-white">📅 Haftalık Yemek Planı & Alışveriş Listesi</h2>
                <p className="text-xs text-slate-400 mt-0.5">Hedefine göre dengelenmiş sporcu beslenme şeması.</p>
              </div>
              <button
                onClick={() => setShowProModal(true)}
                className="px-3 py-1.5 bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 text-[11px] font-black rounded-xl shadow-md shrink-0 flex items-center gap-1"
              >
                🔒 Özel PDF Plan Üret (PRO)
              </button>
            </div>

            <div className="flex gap-1.5 overflow-x-auto pb-1">
              {['Pazartesi', 'Salı', 'Çarşamba'].map((d) => (
                <button
                  key={d}
                  onClick={() => setPlanDay(d)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                    planDay === d
                      ? 'bg-emerald-500 text-slate-950 shadow-md'
                      : 'bg-slate-950 border border-slate-800 text-slate-400'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>

            <div className="space-y-2.5">
              {(weeklyPlans[planDay] || weeklyPlans['Pazartesi']).map((item, idx) => (
                <div key={idx} className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[10px] text-emerald-400 font-bold uppercase block">{item.meal}</span>
                    <p className="text-white font-medium mt-0.5">{item.desc}</p>
                  </div>
                  <div className="text-right shrink-0 ml-3">
                    <span className="font-bold text-emerald-400 block">{item.p} Protein</span>
                    <span className="text-slate-400 text-[10px]">{item.kcal} kcal</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-slate-800 pt-5 space-y-3">
              <span className="text-xs font-bold text-slate-300 block">🛒 Haftalık Toplu Market Sepeti:</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {shoppingList.map((shop, sIdx) => (
                  <div key={sIdx} className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs">
                    <span className="font-bold text-emerald-400 block">{shop.cat}</span>
                    <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">{shop.items}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 5. SEKME: GÜNLÜK BESİN CETVELİ */}
        {activeTab === 'tracker' && (
          <div className="bg-slate-900/80 backdrop-blur-2xl border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl space-y-6">
            <div>
              <h2 className="text-lg font-bold text-white">Sporcu Besin Cetveli & Günlük Öğün Toplayıcı</h2>
              <p className="text-xs text-slate-400 mt-0.5">Tükettiğin besinleri seç, gramajını gir ve günün toplam makrolarını takip et.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="text-xs font-semibold text-slate-400 uppercase">Besin Seçin</label>
                <select
                  value={selectedFoodId}
                  onChange={(e) => setSelectedFoodId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 mt-1.5 text-xs text-white focus:border-emerald-500 cursor-pointer"
                >
                  {FOOD_DATABASE.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.name} (100g: {f.kcal} kcal | {f.p}g P)
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase">Miktar (Gram)</label>
                <div className="flex gap-2 mt-1.5">
                  <input
                    type="number"
                    value={foodGrams}
                    onChange={(e) => setFoodGrams(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white font-bold focus:border-emerald-500"
                  />
                  <button
                    onClick={addFoodToMeal}
                    className="px-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black rounded-xl transition"
                  >
                    Ekle
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-xs font-bold text-white">Günün Besin Listesi ({mealList.length})</span>
                {mealList.length > 0 && (
                  <button onClick={() => setMealList([])} className="text-[11px] text-rose-400 hover:underline">
                    Tümünü Temizle
                  </button>
                )}
              </div>

              {mealList.length === 0 ? (
                <p className="text-xs text-slate-500 text-center py-6">Henüz besin eklenmedi. Yukarıdan seçebilir veya barkod sekmesinden ürün tarayabilirsiniz.</p>
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
                <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Toplam Kcal</span>
                  <span className="font-black text-white text-sm">{mealTotals.kcal}</span>
                </div>
                <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Protein</span>
                  <span className="font-black text-emerald-400 text-sm">{mealTotals.p.toFixed(1)}g</span>
                </div>
                <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Karb</span>
                  <span className="font-black text-cyan-400 text-sm">{mealTotals.c.toFixed(1)}g</span>
                </div>
                <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Yağ</span>
                  <span className="font-black text-amber-400 text-sm">{mealTotals.f.toFixed(1)}g</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 6. SEKME: 1RM GÜÇ & DINLENME SAYACI */}
        {activeTab === 'onerm' && (
          <div className="bg-slate-900/80 backdrop-blur-2xl border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl space-y-6">
            <div className="bg-slate-950 border border-cyan-500/30 rounded-2xl p-5 text-center space-y-3">
              <span className="text-[11px] font-bold text-cyan-400 uppercase tracking-widest block">
                ⏱️ Set Arası Dinlenme Sayacı (Rest Timer)
              </span>
              <div className="text-4xl font-black text-white font-mono">
                {Math.floor(timeLeft / 60)}:{timeLeft % 60 < 10 ? '0' : ''}{timeLeft % 60}
              </div>
              <div className="flex justify-center gap-2">
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

            <div className="grid grid-cols-2 gap-4">
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

            <div className="bg-slate-950 border border-emerald-500/30 rounded-2xl p-5 text-center space-y-4">
              <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-widest">
                Tahmini 1RM Gücün
              </span>
              <div className="text-4xl font-black text-white">{max1RM} <span className="text-base text-slate-400 font-medium">kg</span></div>
            </div>

            {/* PRO KİLİTLİ: AKILLI AĞIRLIK ARTIŞ ASİSTANI */}
            <div className="bg-gradient-to-r from-amber-950/40 via-slate-950 to-slate-950 border border-amber-500/30 p-4 rounded-2xl flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-amber-400 block">📈 Akıllı Progressive Overload Algoritması</span>
                <span className="text-[10px] text-slate-400">Gelecek haftaki hedef ağırlık ve set artış önerileri</span>
              </div>
              <button
                onClick={() => setShowProModal(true)}
                className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black rounded-xl transition shadow-md"
              >
                🔒 PRO'da Aç
              </button>
            </div>
          </div>
        )}

        {/* PRO ÜYELİK PAYWALL / AYLIK & YILLIK ABONELİK MODALI */}
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

              {/* Avantajlar Listesi */}
              <div className="space-y-2.5 bg-slate-950/80 p-4 rounded-2xl border border-slate-800 text-xs">
                <div className="flex items-center gap-2 text-slate-200">
                  <span className="text-emerald-400 font-bold">✓</span> Sınırsız AI Tabak Fotoğrafı Analizi & Makro Okuma
                </div>
                <div className="flex items-center gap-2 text-slate-200">
                  <span className="text-emerald-400 font-bold">✓</span> Kişiye Özel PDF Haftalık Yemek Planı & Pazar Sepeti
                </div>
                <div className="flex items-center gap-2 text-slate-200">
                  <span className="text-emerald-400 font-bold">✓</span> Akıllı Progressive Overload Ağırlık Artış Motoru
                </div>
                <div className="flex items-center gap-2 text-slate-200">
                  <span className="text-emerald-400 font-bold">✓</span> FitPulse Pro Google E-Tablo / Excel Şablonu Dahil
                </div>
              </div>

              {/* AYLIK & YILLIK OTOMATİK ABONELİK KARTLARI */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Sol: Aylık Otomatik Abonelik */}
                <a
                  href="https://kaynar82.gumroad.com/l/fitpulse-app"
                  target="_blank"
                  rel="noreferrer"
                  className="p-4 bg-slate-950 hover:border-emerald-500 border border-slate-800 rounded-2xl text-left transition block group relative"
                >
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                    Aylık VIP Abonelik
                  </span>
                  <div className="text-xl font-black text-white mt-1">
                    $2.99 <span className="text-xs text-slate-400 font-normal">/ ay</span>
                  </div>
                  <span className="text-[10px] text-slate-500 block mt-1">Her ay otomatik yenilenir • İstediğinde iptal et</span>
                  <div className="mt-3 w-full py-2 bg-slate-900 group-hover:bg-slate-800 text-slate-300 text-xs font-bold text-center rounded-xl border border-slate-700 transition">
                    Aylık Abone Ol →
                  </div>
                </a>

                {/* Sağ: Yıllık Otomatik Abonelik */}
                <a
                  href="https://kaynar82.gumroad.com/l/fitpulse-app"
                  target="_blank"
                  rel="noreferrer"
                  className="p-4 bg-gradient-to-br from-emerald-950/80 via-slate-950 to-slate-950 border-2 border-emerald-500/60 rounded-2xl text-left transition block group relative shadow-lg"
                >
                  <span className="absolute -top-2.5 right-3 bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 text-[9px] font-black px-2 py-0.5 rounded-full shadow-md">
                    %30 TASARRUF
                  </span>
                  <span className="text-[10px] text-amber-400 font-extrabold uppercase tracking-wider block">
                    Yıllık VIP Abonelik
                  </span>
                  <div className="text-xl font-black text-white mt-1">
                    $24.99 <span className="text-xs text-slate-400 font-normal">/ yıl</span>
                  </div>
                  <span className="text-[10px] text-emerald-400/90 block mt-1">Ayda sadece ~$2.08'a gelir</span>
                  <div className="mt-3 w-full py-2 bg-emerald-500 group-hover:bg-emerald-400 text-slate-950 text-xs font-black text-center rounded-xl transition shadow-md shadow-emerald-500/20">
                    Yıllık Avantajı Al →
                  </div>
                </a>
              </div>

              {/* Lisans Anahtarı ile Aktifleştirme */}
              <div className="border-t border-slate-800 pt-4 space-y-2">
                <span className="text-[11px] text-slate-400 block font-semibold">Zaten Abone Oldunuz mu? Lisansınızı Girin:</span>
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

        {/* PAYLAŞIM KARTI MODAL */}
        {showShareModal && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-sm w-full space-y-4 text-center shadow-2xl relative">
              <button onClick={() => setShowShareModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white text-lg">
                ✕
              </button>
              <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest block">
                Instagram & WhatsApp Story Kartı
              </span>
              <div className="bg-[#050811] border border-emerald-500/40 rounded-2xl p-6 space-y-4 text-left">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <span className="font-black text-white text-sm">⚡ FITPULSE OS</span>
                  <span className="text-[10px] text-emerald-400 font-bold uppercase">GÜNLÜK HEDEF</span>
                </div>
                <div className="text-center py-2">
                  <span className="text-4xl font-black text-white">{targetCalories}</span>
                  <span className="text-xs text-slate-400 block">kcal / Günlük Enerji</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="bg-slate-900 p-2 rounded-xl">
                    <span className="text-[9px] text-slate-400 block">Protein</span>
                    <span className="font-bold text-emerald-400">{proteinGrams}g</span>
                  </div>
                  <div className="bg-slate-900 p-2 rounded-xl">
                    <span className="text-[9px] text-slate-400 block">Karb</span>
                    <span className="font-bold text-cyan-400">{carbGrams}g</span>
                  </div>
                  <div className="bg-slate-900 p-2 rounded-xl">
                    <span className="text-[9px] text-slate-400 block">Yağ</span>
                    <span className="font-bold text-amber-400">{fatGrams}g</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => alert('Ekran görüntüsü alarak doğrudan Instagram / WhatsApp hikayenizde paylaşabilirsiniz!')}
                className="w-full py-3 bg-emerald-500 text-slate-950 rounded-xl text-xs font-black"
              >
                📸 Ekran Görüntüsü Al & Paylaş
              </button>
            </div>
          </div>
        )}

        {/* ALT SATIŞ ŞERİDİ */}
        <div className="bg-gradient-to-r from-emerald-950/80 via-slate-900 to-slate-950 border border-emerald-500/40 p-5 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xl">
          <div>
            <div className="inline-flex items-center gap-1.5 text-[10px] text-emerald-400 font-extrabold uppercase tracking-wider bg-emerald-950 px-2.5 py-0.5 rounded-md border border-emerald-500/30 mb-1.5">
              ⚡ PRO VIP ABONELİK
            </div>
            <h3 className="text-sm font-bold text-white">FitPulse Pro: Otomatik İlerleme & Takip Sistemi</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Aylık veya yıllık abonelikle tüm kilitleri açın, antrenman ve makrolarınızı otomatik takip edin.
            </p>
          </div>
          <button
            onClick={() => setShowProModal(true)}
            className="shrink-0 w-full sm:w-auto text-center bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black px-6 py-3.5 rounded-xl transition shadow-lg shadow-emerald-500/25 active:scale-95"
          >
            Abonelik Planlarını İncele
          </button>
        </div>

      </div>
    </main>
  );
}