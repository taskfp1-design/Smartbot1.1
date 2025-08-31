export interface Translation {
  // Header
  appTitle: string;
  appSubtitle: string;
  
  // Timer
  nextSignal: string;
  waitSignal: string;
  waitingSignal: string;
  signalSchedule: string;
  
  // Countries and times
  russia: string;
  kazakhstan: string;
  uzbekistan: string;
  kyrgyzstan: string;
  ankara: string;
  
  // Chart
  volume: string;
  
  // Strategy Analysis
  signal: string;
  tradingSignal: string;
  direction: string;
  expiration: string;
  entryPrice: string;
  higher: string;
  lower: string;
  waitingSignalText: string;
  strategyPrinciple: string;
  betOnRise: string;
  betOnFall: string;
  
  // Services
  getExpressSignal: string;
  immediately: string;
  getEducationalMaterials: string;
  getFiveHourSignal: string;
  addMoreExpressSignals: string;
  nextSignalIn: string;
  nextSignalAfter: string;
  
  // Footer
  footerCopyright: string;
  footerWarning: string;
  
  // Analysis statuses
  initialization: string;
  dataCollection: string;
  trendAnalysis: string;
  signalFormation: string;
  readyToTrade: string;
  
  // Entry point
  entryPoint: string;
  
  // Time units
  min1: string;
  min2: string;
  min3: string;
  min4: string;
  min5: string;
}

export const translations: Record<string, Translation> = {
  ru: {
    appTitle: "Смарт Трейдинг Бот - Бинарные Опционы",
    appSubtitle: "Профессиональная аналитика валютных пар",
    
    nextSignal: "Следующий сигнал:",
    waitSignal: "Ожидать сигнал",
    waitingSignal: "Ожидаю сигнал ✓",
    signalSchedule: "Расписание сигналов",
    
    russia: "🇷🇺 Россия (UTC+3)",
    kazakhstan: "🇮🇳 Дели (UTC+5:30)",
    uzbekistan: "🇧🇷 Бразилиа (UTC-3)",
    kyrgyzstan: "🇬🇭 Аккра (UTC+0)",
    ankara: "🇹🇷 Ankara (UTC+3)",
    
    volume: "Объем:",
    
    signal: "Сигнал",
    tradingSignal: "🎯 ТОРГОВЫЙ СИГНАЛ",
    direction: "Направление:",
    expiration: "Время экспирации:",
    entryPrice: "Цена входа:",
    higher: "ВЫШЕ",
    lower: "НИЖЕ",
    waitingSignalText: "Ожидание сигнала...",
    strategyPrinciple: "Принцип стратегии:",
    betOnRise: "Ставка на рост цены",
    betOnFall: "Ставка на падение цены",
    
    getExpressSignal: "Получить экспресс сигнал",
    immediately: "немедленно",
    getEducationalMaterials: "Получить сигнал на основании 1 часа анализа рынка",
    activateCopyTrading: "Активировать копитрейдинг",
    addMoreExpressSignals: "Добавить еще 10 экспресс сигналов",
    nextSignalIn: "Следующий сигнал через",
    nextSignalAfter: "Следующий сигнал через",
    
    footerCopyright: "© 2025 Binary Options Analytics. Все права защищены.",
    footerWarning: "Торговля бинарными опционами несет высокий риск потери капитала",
    
    initialization: "Инициализация...",
    dataCollection: "Сбор данных...",
    trendAnalysis: "Анализ трендов...",
    signalFormation: "Формирование сигнала...",
    readyToTrade: "Готов к торговле!",
    
    entryPoint: "Точка входа",
    
    min1: "1 мин",
    min2: "2 мин",
    min3: "3 мин",
    min4: "4 мин",
    min5: "5 мин"
  },
  
  en: {
    appTitle: "Smart Trading Bot - Binary Options",
    appSubtitle: "Professional currency pair analytics",
    
    nextSignal: "Next signal:",
    waitSignal: "Wait for signal",
    waitingSignal: "Waiting for signal ✓",
    signalSchedule: "Signal schedule",
    
    russia: "🇷🇺 Russia (UTC+3)",
    kazakhstan: "🇰🇿 Kazakhstan (UTC+6)",
    uzbekistan: "🇧🇷 Brasilia (UTC-3)",
    kyrgyzstan: "🇬🇭 Accra (UTC+0)",
    ankara: "🇹🇷 Ankara (UTC+3)",
    
    volume: "Volume:",
    
    signal: "Signal",
    tradingSignal: "🎯 TRADING SIGNAL",
    direction: "Direction:",
    expiration: "Expiration time:",
    entryPrice: "Entry price:",
    higher: "HIGHER",
    lower: "LOWER",
    waitingSignalText: "Waiting for signal...",
    strategyPrinciple: "Strategy principle:",
    betOnRise: "Bet on price rise",
    betOnFall: "Bet on price fall",
    
    getExpressSignal: "Get express signal",
    immediately: "immediately",
    getEducationalMaterials: "Get signal based on 1 hour market analysis",
    getFiveHourSignal: "Get signal based on 5 hour market analysis",
    addMoreExpressSignals: "Add 10 more express signals",
    nextSignalIn: "Next signal in",
    nextSignalAfter: "Next signal in",
    
    footerCopyright: "© 2025 Binary Options Analytics. All rights reserved.",
    footerWarning: "Binary options trading carries high risk of capital loss",
    
    initialization: "Initialization...",
    dataCollection: "Data collection...",
    trendAnalysis: "Trend analysis...",
    signalFormation: "Signal formation...",
    readyToTrade: "Ready to trade!",
    
    entryPoint: "Entry point",
    
    min1: "1 min",
    min2: "2 min",
    min3: "3 min",
    min4: "4 min",
    min5: "5 min"
  },
  
  kk: {
    appTitle: "Смарт Трейдинг Бот - Бинарлык Опциялар",
    appSubtitle: "Валюта жұптарының кәсіби аналитикасы",
    
    nextSignal: "Келесі сигнал:",
    waitSignal: "Сигналды күту",
    waitingSignal: "Сигналды күтемін ✓",
    signalSchedule: "Сигналдар кестесі",
    
    russia: "🇷🇺 Ресей (UTC+3)",
    kazakhstan: "🇰🇿 Қазақстан (UTC+6)",
    uzbekistan: "🇺🇿 Өзбекстан (UTC+5)",
    kyrgyzstan: "🇬🇭 Аккра (UTC+0)",
    ankara: "🇹🇷 Ankara (UTC+3)",
    
    volume: "Көлем:",
    
    signal: "Сигнал",
    tradingSignal: "🎯 САУДА СИГНАЛЫ",
    direction: "Бағыт:",
    expiration: "Аяқталу уақыты:",
    entryPrice: "Кіру бағасы:",
    higher: "ЖОҒАРЫ",
    lower: "ТӨМЕН",
    waitingSignalText: "Сигналды күту...",
    strategyPrinciple: "Стратегия принципі:",
    betOnRise: "Баға өсуіне ставка",
    betOnFall: "Баға түсуіне ставка",
    
    getExpressSignal: "Экспресс сигнал алу",
    immediately: "дереу",
    getEducationalMaterials: "Оқу материалдарын алу",
    getFiveHourSignal: "5 сааттык рынок анализи негизинде сигнал алуу",
    addMoreExpressSignals: "Тағы 10 экспресс сигнал қосу",
    nextSignalIn: "Келесі сигнал",
    nextSignalAfter: "Келесі сигнал",
    
    footerCopyright: "© 2025 Binary Options Analytics. Барлық құқықтар қорғалған.",
    footerWarning: "Бинарлық опциондармен сауда капиталды жоғалту қаупін көтереді",
    
    initialization: "Инициализация...",
    dataCollection: "Деректерді жинау...",
    trendAnalysis: "Трендтерді талдау...",
    signalFormation: "Сигнал қалыптастыру...",
    readyToTrade: "Саудаға дайын!",
    
    entryPoint: "Кіру нүктесі",
    
    min1: "1 мин",
    min2: "2 мин",
    min3: "3 мин",
    min4: "4 мин",
    min5: "5 мин"
  },
  
  uz: {
    appTitle: "Smart Savdo Boti - Binary Opsiyalar",
    appSubtitle: "Valyuta juftlarining professional tahlili",
    
    nextSignal: "Keyingi signal:",
    waitSignal: "Signalni kutish",
    waitingSignal: "Signalni kutmoqdaman ✓",
    signalSchedule: "Signallar jadvali",
    
    russia: "🇷🇺 Moskva (UTC+3)",
    kazakhstan: "🇰🇿 Qozog'iston (UTC+6)",
    uzbekistan: "🇧🇷 Braziliya (UTC-3)",
    kyrgyzstan: "🇬🇭 Akkra (UTC+0)",
    ankara: "🇹🇷 Ankara (UTC+3)",
    
    volume: "Hajm:",
    
    signal: "Signal",
    tradingSignal: "🎯 SAVDO SIGNALI",
    direction: "Yo'nalish:",
    expiration: "Tugash vaqti:",
    entryPrice: "Kirish narxi:",
    higher: "YUQORI",
    lower: "PAST",
    waitingSignalText: "Signalni kutish...",
    strategyPrinciple: "Strategiya printsipi:",
    betOnRise: "Narx o'sishiga stavka",
    betOnFall: "Narx tushishiga stavka",
    
    getExpressSignal: "Ekspress signal olish",
    immediately: "darhol",
    getEducationalMaterials: "Ta'lim materiallarini olish",
    getFiveHourSignal: "5 soatlik bozor tahlili asosida signal olish",
    addMoreExpressSignals: "Yana 10 ta ekspress signal qo'shish",
    nextSignalIn: "Keyingi signal",
    nextSignalAfter: "Keyingi signal",
    
    footerCopyright: "© 2025 Binary Options Analytics. Barcha huquqlar himoyalangan.",
    footerWarning: "Binar opsiyonlar bilan savdo kapitalini yo'qotish xavfini olib keladi",
    
    initialization: "Boshlash...",
    dataCollection: "Ma'lumot yig'ish...",
    trendAnalysis: "Trendlarni tahlil qilish...",
    signalFormation: "Signal shakllanishi...",
    readyToTrade: "Savdoga tayyor!",
    
    entryPoint: "Kirish nuqtasi",
    
    min1: "1 daq",
    min2: "2 daq",
    min3: "3 daq",
    min4: "4 daq",
    min5: "5 daq"
  },
  
  ky: {
    appTitle: "Смарт Трейдинг Бот - Бинардык Опциялар",
    appSubtitle: "Валюта жуптарынын кесиптик аналитикасы",
    
    nextSignal: "Кийинки сигнал:",
    waitSignal: "Сигналды күтүү",
    waitingSignal: "Сигналды күтөм ✓",
    signalSchedule: "Сигналдар программасы",
    
    russia: "🇷🇺 Россия (UTC+3)",
    kazakhstan: "🇰🇿 Казакстан (UTC+6)",
    uzbekistan: "🇺🇿 Өзбекстан (UTC+5)",
    kyrgyzstan: "🇰🇬 Кыргызстан (UTC+6)",
    ankara: "🇹🇷 Ankara (UTC+3)",
    
    volume: "Көлөм:",
    
    signal: "Сигнал",
    tradingSignal: "🎯 СООДА СИГНАЛЫ",
    direction: "Багыт:",
    expiration: "Аяктоо убактысы:",
    entryPrice: "Кирүү баасы:",
    higher: "ЖОГОРУ",
    lower: "ТӨМӨН",
    waitingSignalText: "Сигналды күтүү...",
    strategyPrinciple: "Стратегия принциби:",
    betOnRise: "Баанын өсүшүнө ставка",
    betOnFall: "Баанын түшүшүнө ставка",
    
    getExpressSignal: "Экспресс сигнал алуу",
    immediately: "дароо",
    getEducationalMaterials: "1 саат рынок анализи негизинде сигнал алуу",
    getFiveHourSignal: "5 саат рынок анализи негизинде сигнал алуу",
    addMoreExpressSignals: "Дагы 10 экспресс сигнал кошуу",
    nextSignalIn: "Кийинки сигнал",
    nextSignalAfter: "Кийинки сигнал",
    
    footerCopyright: "© 2025 Binary Options Analytics. Бардык укуктар корголгон.",
    footerWarning: "Бинардык опциялар менен соода капиталды жоготуу коркунучун алып келет",
    
    initialization: "Баштоо...",
    dataCollection: "Маалымат чогултуу...",
    trendAnalysis: "Тренддерди талдоо...",
    signalFormation: "Сигнал калыптандыруу...",
    readyToTrade: "Соодага даяр!",
    
    entryPoint: "Кирүү чекити",
    
    min1: "1 мүн",
    min2: "2 мүн",
    min3: "3 мүн",
    min4: "4 мүн",
    min5: "5 мүн"
  },
  
  ar: {
    appTitle: "بوت التداول للتداول الجماعي مع أيدار",
    appSubtitle: "تحليل احترافي لأزواج العملات",
    
    nextSignal: "الإشارة التالية:",
    waitSignal: "انتظار الإشارة",
    waitingSignal: "في انتظار الإشارة ✓",
    signalSchedule: "جدول الإشارات",
    
    russia: "🇷🇺 روسيا (UTC+3)",
    kazakhstan: "🇰🇿 كازاخستان (UTC+6)",
    uzbekistan: "🇧🇷 برازيليا (UTC-3)",
    kyrgyzstan: "🇰🇬 قيرغيزستان (UTC+6)",
    ankara: "🇹🇷 Ankara (UTC+3)",
    
    volume: "الحجم:",
    
    signal: "إشارة",
    tradingSignal: "🎯 إشارة التداول",
    direction: "الاتجاه:",
    expiration: "وقت الانتهاء:",
    entryPrice: "سعر الدخول:",
    higher: "أعلى",
    lower: "أقل",
    waitingSignalText: "في انتظار الإشارة...",
    strategyPrinciple: "مبدأ الاستراتيجية:",
    betOnRise: "رهان على ارتفاع السعر",
    betOnFall: "رهان على انخفاض السعر",
    
    getExpressSignal: "الحصول على إشارة سريعة",
    immediately: "فوراً",
    getEducationalMaterials: "الحصول على إشارة بناءً على تحليل السوق لمدة ساعة واحدة",
    getFiveHourSignal: "الحصول على إشارة بناءً على تحليل السوق لمدة 5 ساعات",
    addMoreExpressSignals: "إضافة 10 إشارات سريعة أخرى",
    nextSignalIn: "الإشارة التالية خلال",
    nextSignalAfter: "الإشارة التالية خلال",
    
    footerCopyright: "© 2025 Binary Options Analytics. جميع الحقوق محفوظة.",
    footerWarning: "تداول الخيارات الثنائية ينطوي على مخاطر عالية لفقدان رأس المال",
    
    initialization: "التهيئة...",
    dataCollection: "جمع البيانات...",
    trendAnalysis: "تحليل الاتجاهات...",
    signalFormation: "تكوين الإشارة...",
    readyToTrade: "جاهز للتداول!",
    
    entryPoint: "نقطة الدخول",
    
    min1: "1 دقيقة",
    min2: "2 دقيقة",
    min3: "3 دقيقة",
    min4: "4 دقيقة",
    min5: "5 دقيقة"
  },
  
  tr: {
    appTitle: "Akıllı Ticaret Botu - Binary Opsiyonlar",
    appSubtitle: "Döviz çiftlerinin profesyonel analizi",
    
    nextSignal: "Sonraki sinyal:",
    waitSignal: "Sinyal bekle",
    waitingSignal: "Sinyal bekliyorum ✓",
    signalSchedule: "Sinyal programı",
    
    russia: "🇷🇺 Moskova (UTC+3)",
    kazakhstan: "🇰🇿 Kazakistan (UTC+6)",
    uzbekistan: "🇧🇷 Brasília (UTC-3)",
    kyrgyzstan: "🇬🇭 Akra (UTC+0)",
    ankara: "🇹🇷 Ankara (UTC+3)",
    
    volume: "Hacim:",
    
    signal: "Sinyal",
    tradingSignal: "🎯 TİCARET SİNYALİ",
    direction: "Yön:",
    expiration: "Bitiş zamanı:",
    entryPrice: "Giriş fiyatı:",
    higher: "YÜKSEK",
    lower: "DÜŞÜK",
    waitingSignalText: "Sinyal bekleniyor...",
    strategyPrinciple: "Strateji prensibi:",
    betOnRise: "Fiyat artışına bahis",
    betOnFall: "Fiyat düşüşüne bahis",
    
    getExpressSignal: "Ekspres sinyal al",
    immediately: "hemen",
    getEducationalMaterials: "1 saatlik piyasa analizine dayalı sinyal al",
    getFiveHourSignal: "5 saatlik piyasa analizine dayalı sinyal al",
    addMoreExpressSignals: "10 ekspres sinyal daha ekle",
    nextSignalIn: "Sonraki sinyal",
    nextSignalAfter: "Sonraki sinyal",
    
    footerCopyright: "© 2025 Binary Options Analytics. Tüm hakları saklıdır.",
    footerWarning: "İkili opsiyon ticareti yüksek sermaye kaybı riski taşır",
    
    initialization: "Başlatılıyor...",
    dataCollection: "Veri toplama...",
    trendAnalysis: "Trend analizi...",
    signalFormation: "Sinyal oluşturma...",
    readyToTrade: "Ticarete hazır!",
    
    entryPoint: "Giriş noktası",
    
    min1: "1 dk",
    min2: "2 dk",
    min3: "3 dk",
    min4: "4 dk",
    min5: "5 dk"
  }
};

export const languages = [
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'kk', name: 'Қазақша', flag: '🇰🇿' },
  { code: 'uz', name: 'O\'zbekcha', flag: '🇺🇿' },
  { code: 'ky', name: 'Кыргызча', flag: '🇰🇬' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
  { code: 'tr', name: 'Türkçe', flag: '🇹🇷' }
];