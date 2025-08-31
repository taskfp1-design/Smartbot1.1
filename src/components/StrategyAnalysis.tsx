import React, { useState, useEffect } from 'react';
import { Flame, TrendingUp, TrendingDown, Minus, Target, ArrowUp, ArrowDown } from 'lucide-react';

interface StrategyAnalysisProps {
  currencyPair: string;
  timeLeft: number;
  maxTime: number;
  expressSignalTrigger: number;
  onScheduledSignal?: boolean;
}

interface BinarySignal {
  pair: string;
  direction: 'HIGHER' | 'LOWER';
  expiration: '1 min' | '2 min' | '3 min' | '4 min' | '5 min';
  timestamp: number;
  entryPrice?: number;
}

const StrategyAnalysis: React.FC<StrategyAnalysisProps> = ({ currencyPair, timeLeft, maxTime, expressSignalTrigger, onScheduledSignal }) => {
  const [currentSignal, setCurrentSignal] = useState<BinarySignal | null>(null);
  const [currentStrategyText, setCurrentStrategyText] = useState<string>('');
  const [displayedStrategyText, setDisplayedStrategyText] = useState<string>('');
  const [isTyping, setIsTyping] = useState(false);
  const [isSignalBlinking, setIsSignalBlinking] = useState(false);

  // Список торговых пар для сигналов
  const tradingPairs = [
    'EUR/USD', 'GBP/USD', 'USD/JPY', 'AUD/USD', 'USD/CAD', 'USD/CHF',
    'NZD/USD', 'EUR/GBP', 'EUR/JPY', 'GBP/JPY', 'AUD/JPY', 'CAD/JPY',
    'EUR/USD-OTC', 'GBP/USD-OTC', 'USD/JPY-OTC', 'AUD/USD-OTC', 'USD/CAD-OTC',
    'USD/CHF-OTC', 'NZD/USD-OTC', 'EUR/GBP-OTC'
  ];

  // Проверка времени сигнала (11:00, 16:00, 21:00 по Москве)
  const isSignalTime = () => {
    const now = new Date();
    const moscowOffset = 3; // UTC+3 для Москвы
    const moscowTime = new Date(now.getTime() + (moscowOffset * 60 * 60 * 1000));
    
    const signalTimes = [11, 16, 21]; // Часы сигналов
    const currentHour = moscowTime.getUTCHours();
    const currentMinute = moscowTime.getUTCMinutes();
    const currentSecond = moscowTime.getUTCSeconds();
    
    // Проверяем, если текущее время соответствует времени сигнала (в пределах 1 минуты)
    return signalTimes.includes(currentHour) && currentMinute === 0 && currentSecond <= 10;
  };

  // Генерация случайного сигнала
  const generateRandomSignal = () => {
    const randomPair = tradingPairs[Math.floor(Math.random() * tradingPairs.length)];
    const randomDirection = Math.random() > 0.5 ? 'HIGHER' : 'LOWER';
    const randomExpiration = ['1 min', '2 min', '3 min', '4 min', '5 min'][Math.floor(Math.random() * 5)] as '1 min' | '2 min' | '3 min' | '4 min' | '5 min';
    
    // Генерируем случайную цену входа для реалистичности
    const basePrice = 1.0850;
    const variation = (Math.random() - 0.5) * 0.01;
    const entryPrice = basePrice + variation;
    
    setCurrentSignal({
      pair: randomPair,
      direction: randomDirection,
      expiration: randomExpiration,
      timestamp: Date.now(),
      entryPrice: entryPrice
    });
    
    // Запускаем мерцание на 1 минуту
    setIsSignalBlinking(true);
    
    // Через 1 минуту убираем сигнал и мерцание
    setTimeout(() => {
      setIsSignalBlinking(false);
      setCurrentSignal(null); // Убираем сигнал, возвращаем "Ожидание сигнала"
    }, 60000); // 60 секунд
    
    // Запускаем мерцание на 3 секунды
    
    // Обновляем текст стратегии при генерации экспресс сигнала
    const randomStrategy = strategies[randomPair as keyof typeof strategies] || strategies['EUR/USD'];
    setCurrentStrategyText(randomStrategy.strategy);
    
    // Запускаем эффект печатающей машинки
    startTypewriterEffect(randomStrategy.strategy);
  };

  // Эффект для генерации сигналов по расписанию (11:00, 16:00, 21:00 МСК)
  useEffect(() => {
    // Проверяем каждую секунду, не пора ли генерировать сигнал
    const interval = setInterval(() => {
      if (isSignalTime()) {
        generateRandomSignal();
      }
    }, 1000); // Проверяем каждую секунду

    return () => {
      clearInterval(interval);
    };
  }, []);

  // Эффект для генерации сигнала при окончании таймера (когда timeLeft становится <= 1)
  useEffect(() => {
    if (timeLeft <= 1 && timeLeft > 0) {
      // Генерируем сигнал когда таймер заканчивается
      setTimeout(() => {
        generateRandomSignal();
      }, 1000); // Небольшая задержка для синхронизации с "Точка входа"
    }
  }, [timeLeft]);

  // Эффект для генерации сигнала при нажатии кнопки "Экспресс сигнал"
  useEffect(() => {
    if (expressSignalTrigger > 0) {
      generateRandomSignal();
    }
  }, [expressSignalTrigger]);

  // Инициализация текста стратегии при загрузке компонента
  useEffect(() => {
    const currentStrategy = strategies[currencyPair as keyof typeof strategies] || strategies['EUR/USD'];
    if (!currentStrategyText) {
      setCurrentStrategyText(currentStrategy.strategy);
      startTypewriterEffect(currentStrategy.strategy);
    }
  }, [currencyPair, currentStrategyText]);
  
  // Функция для эффекта печатающей машинки
  const startTypewriterEffect = (text: string) => {
    setDisplayedStrategyText('');
    setIsTyping(true);
    
    let currentIndex = 0;
    const typingSpeed = 30; // Скорость печати в миллисекундах
    
    const typeInterval = setInterval(() => {
      if (currentIndex < text.length) {
        setDisplayedStrategyText(text.slice(0, currentIndex + 1));
        currentIndex++;
      } else {
        setIsTyping(false);
        clearInterval(typeInterval);
      }
    }, typingSpeed);
    
    // Очищаем интервал при размонтировании компонента
    return () => clearInterval(typeInterval);
  };
  
  // Вычисляем прогресс (от 0 до 100%)
  const progress = maxTime > 0 ? Math.max(0, Math.min(100, ((maxTime - timeLeft) / maxTime) * 100)) : 0;
  
  // Определяем цвет прогресс-бара в зависимости от прогресса
  const getProgressColor = () => {
    return 'from-blue-500 to-white';
  };

  // Определяем статус анализа
  const getAnalysisStatus = () => {
    if (progress < 25) return 'Initialization...';
    if (progress < 50) return 'Data collection...';
    if (progress < 75) return 'Trend analysis...';
    if (progress < 95) return 'Signal formation...';
    return 'Ready to trade!';
  };

  // Определяем цвет фона блока в зависимости от сигнала
  const getBlockBackgroundColor = () => {
    if (!currentSignal || !isSignalBlinking) return 'bg-gray-800';
    
    if (currentSignal.direction === 'BUY') {
      return 'bg-green-600/30 border-green-500';
    } else {
      return 'bg-red-600/30 border-red-500';
    }
  };

  // Стратегии для разных валютных пар
  const strategies = {
    'EUR/USD': {
      trend: 'Восходящий',
      trendIcon: TrendingUp,
      trendColor: 'text-green-400',
      volatility: 'Низкая',
      volatilityColor: 'text-blue-400',
      signal: 'CALL',
      signalColor: 'text-green-400',
      strength: '78%',
      strengthColor: 'text-green-400',
      description: 'Евро укрепляется против доллара на фоне позитивных экономических данных ЕС',
      strategy: 'Binary strategy "Level Breakout" - expecting EUR/USD consolidation above 1.0850. On breakout buy HIGHER option for 3-5 minutes. Signal confirmed by RSI above 60 and growing volumes. Success probability 78% when entry conditions are met.'
    },
    'GBP/USD': {
      trend: 'Нисходящий',
      trendIcon: TrendingDown,
      trendColor: 'text-red-400',
      volatility: 'Высокая',
      volatilityColor: 'text-red-400',
      signal: 'PUT',
      signalColor: 'text-red-400',
      strength: '65%',
      strengthColor: 'text-yellow-400',
      description: 'Фунт ослабевает из-за неопределенности в экономической политике Великобритании',
      strategy: 'Binary strategy "Bearish reversal" - GBP/USD forms a downward trend. On bounce to 1.2520 level buy LOWER option for 2-4 minutes. Confirmation: RSI below 40, MACD in red zone. High volatility increases trade profitability.'
    },
    'USD/JPY': {
      trend: 'Боковой',
      trendIcon: Minus,
      trendColor: 'text-gray-400',
      volatility: 'Средняя',
      volatilityColor: 'text-yellow-400',
      signal: 'HOLD',
      signalColor: 'text-gray-400',
      strength: '45%',
      strengthColor: 'text-gray-400',
      description: 'Доллар торгуется в узком диапазоне против иены, ожидается прорыв',
      strategy: 'Binary strategy "Channel Trading" - USD/JPY in range 148.20-149.80. At lower boundary buy HIGHER for 1-2 minutes, at upper boundary - LOWER. On channel breakout change tactics to trend following. Bollinger Bands help identify entry points.'
    },
    'AUD/USD': {
      trend: 'Восходящий',
      trendIcon: TrendingUp,
      trendColor: 'text-green-400',
      volatility: 'Средняя',
      volatilityColor: 'text-yellow-400',
      signal: 'CALL',
      signalColor: 'text-green-400',
      strength: '72%',
      strengthColor: 'text-green-400',
      description: 'Австралийский доллар растет благодаря высоким ценам на сырьевые товары',
      strategy: 'Binary strategy "Commodity Correlation" - AUD/USD rises with gold and iron ore prices. On pullbacks to EMA-21 buy HIGHER option for 3-5 minutes. Confirmation: gold prices rising, RSI above 50. Commodity currencies show high predictability.'
    },
    'USD/CAD': {
      trend: 'Нисходящий',
      trendIcon: TrendingDown,
      trendColor: 'text-red-400',
      volatility: 'Низкая',
      volatilityColor: 'text-blue-400',
      signal: 'PUT',
      signalColor: 'text-red-400',
      strength: '68%',
      strengthColor: 'text-green-400',
      description: 'Канадский доллар укрепляется на фоне роста цен на нефть',
      strategy: 'Binary strategy "Oil Correlation" - USD/CAD falls when WTI oil rises. When oil above $75, buy LOWER option for 2-4 minutes. Confirmation: EMA-12 below EMA-26, oil inventories declining. Oil correlation reaches 85% providing high accuracy.'
    },
    'USD/CHF': {
      trend: 'Боковой',
      trendIcon: Minus,
      trendColor: 'text-gray-400',
      volatility: 'Низкая',
      volatilityColor: 'text-blue-400',
      signal: 'HOLD',
      signalColor: 'text-gray-400',
      strength: '52%',
      strengthColor: 'text-yellow-400',
      description: 'Швейцарский франк стабилен, торгуется в узком диапазоне',
      strategy: 'Binary strategy "Swiss Franc Stability" - USD/CHF in narrow range 0.8850-0.8920. Use 1-minute options on bounces from boundaries. Low volatility compensated by increased trade frequency. Stochastic and RSI help identify reversal points.'
    },
    'NZD/USD': {
      trend: 'Восходящий',
      trendIcon: TrendingUp,
      trendColor: 'text-green-400',
      volatility: 'Высокая',
      volatilityColor: 'text-red-400',
      signal: 'CALL',
      signalColor: 'text-green-400',
      strength: '75%',
      strengthColor: 'text-green-400',
      description: 'Новозеландский доллар растет благодаря позитивным данным по экспорту',
      strategy: 'Binary strategy "Dairy Impulse" - NZD/USD rises after GlobalDairyTrade auctions. When dairy prices increase buy HIGHER option for 5 minutes. High volatility creates large movements. Confirmation: resistance breakout with volume.'
    },
    'EUR/GBP': {
      trend: 'Восходящий',
      trendIcon: TrendingUp,
      trendColor: 'text-green-400',
      volatility: 'Средняя',
      volatilityColor: 'text-yellow-400',
      signal: 'CALL',
      signalColor: 'text-green-400',
      strength: '69%',
      strengthColor: 'text-green-400',
      description: 'Евро укрепляется против фунта на фоне стабильности в еврозоне',
      strategy: 'Binary strategy "European Stability" - EUR/GBP in upward trend. On pullbacks to EMA-13 buy HIGHER option for 3-4 minutes. ECB stability vs Bank of England uncertainty creates directional movement. Monitor central bank decisions.'
    },
    'EUR/JPY': {
      trend: 'Нисходящий',
      trendIcon: TrendingDown,
      trendColor: 'text-red-400',
      volatility: 'Средняя',
      volatilityColor: 'text-yellow-400',
      signal: 'PUT',
      signalColor: 'text-red-400',
      strength: '63%',
      strengthColor: 'text-yellow-400',
      description: 'Евро ослабевает против иены из-за снижения доходности европейских облигаций',
      strategy: 'Binary strategy "Carry Trade Reversal" - EUR/JPY falls when carry positions close. When yield spread narrows buy LOWER option for 4-5 minutes. Confirmation: MACD in red zone, yen strengthening. Monitor Bank of Japan interventions.'
    },
    'GBP/JPY': {
      trend: 'Нисходящий',
      trendIcon: TrendingDown,
      trendColor: 'text-red-400',
      volatility: 'Высокая',
      volatilityColor: 'text-red-400',
      signal: 'PUT',
      signalColor: 'text-red-400',
      strength: '71%',
      strengthColor: 'text-green-400',
      description: 'Фунт значительно ослабевает против иены на фоне экономических проблем',
      strategy: 'Binary strategy "Double Weakness" - GBP/JPY falls due to pound problems and yen strength. On pullbacks to moving averages buy LOWER option for 3-5 minutes. High volatility creates large movements in short time. Perfect for short-term options.'
    },
    'AUD/JPY': {
      trend: 'Восходящий',
      trendIcon: TrendingUp,
      trendColor: 'text-green-400',
      volatility: 'Высокая',
      volatilityColor: 'text-red-400',
      signal: 'CALL',
      signalColor: 'text-green-400',
      strength: '76%',
      strengthColor: 'text-green-400',
      description: 'Австралийский доллар растет против иены благодаря высокому спросу на риск',
      strategy: 'Binary strategy "Risk-On Sentiment" - AUD/JPY rises during positive market sentiment. When stock indices rise buy HIGHER option for 4-5 minutes. Correlation with Nikkei and ASX reaches 80%. High volatility increases potential profit.'
    },
    'CAD/JPY': {
      trend: 'Боковой',
      trendIcon: Minus,
      trendColor: 'text-gray-400',
      volatility: 'Средняя',
      volatilityColor: 'text-yellow-400',
      signal: 'HOLD',
      signalColor: 'text-gray-400',
      strength: '48%',
      strengthColor: 'text-gray-400',
      description: 'Канадский доллар торгуется в диапазоне против иены, ожидается направление',
      strategy: 'Binary strategy "Oil vs Yen" - CAD/JPY balances between oil strength and yen power. In range 108.20-110.80 trade from boundaries: at support HIGHER, at resistance LOWER for 2-3 minutes. On range breakout switch to trend tactics.'
    },
    'EUR/USD-OTC': {
      trend: 'Восходящий',
      trendIcon: TrendingUp,
      trendColor: 'text-green-400',
      volatility: 'Низкая',
      volatilityColor: 'text-blue-400',
      signal: 'CALL',
      signalColor: 'text-green-400',
      strength: '81%',
      strengthColor: 'text-green-400',
      description: 'OTC версия EUR/USD показывает стабильный рост с низкой волатильностью',
      strategy: 'Binary strategy "OTC Stability" - EUR/USD-OTC shows smooth movements without sharp spikes. Perfect for 1-2 minute HIGHER options during uptrend. Low volatility increases forecast accuracy. Trading during off-market hours with high predictability.'
    },
    'GBP/USD-OTC': {
      trend: 'Нисходящий',
      trendIcon: TrendingDown,
      trendColor: 'text-red-400',
      volatility: 'Средняя',
      volatilityColor: 'text-yellow-400',
      signal: 'PUT',
      signalColor: 'text-red-400',
      strength: '67%',
      strengthColor: 'text-yellow-400',
      description: 'OTC GBP/USD демонстрирует нисходящий тренд со средней волатильностью',
      strategy: 'Binary strategy "OTC Continuation" - GBP/USD-OTC continues bearish trend from main session. On pullbacks to moving averages buy LOWER option for 2-4 minutes. Absence of news noise in OTC makes movements more predictable.'
    },
    'USD/JPY-OTC': {
      trend: 'Боковой',
      trendIcon: Minus,
      trendColor: 'text-gray-400',
      volatility: 'Низкая',
      volatilityColor: 'text-blue-400',
      signal: 'HOLD',
      signalColor: 'text-gray-400',
      strength: '43%',
      strengthColor: 'text-gray-400',
      description: 'OTC USD/JPY торгуется в узком диапазоне с низкой активностью',
      strategy: 'Binary strategy "OTC Micro-movements" - USD/JPY-OTC in narrow range 148.50-149.20. Use 1-minute options on small fluctuations. Low activity creates clear patterns. Perfect for frequent short trades with high accuracy.'
    },
    'AUD/USD-OTC': {
      trend: 'Восходящий',
      trendIcon: TrendingUp,
      trendColor: 'text-green-400',
      volatility: 'Высокая',
      volatilityColor: 'text-red-400',
      signal: 'CALL',
      signalColor: 'text-green-400',
      strength: '74%',
      strengthColor: 'text-green-400',
      description: 'OTC AUD/USD показывает сильный рост с повышенной волатильностью',
      strategy: 'Binary strategy "OTC Commodity Impulse" - AUD/USD-OTC continues growth on strong commodity data. On resistance breakouts buy HIGHER option for 4-5 minutes. High OTC volatility creates excellent opportunities for profitable trades.'
    },
    'USD/CAD-OTC': {
      trend: 'Нисходящий',
      trendIcon: TrendingDown,
      trendColor: 'text-red-400',
      volatility: 'Средняя',
      volatilityColor: 'text-yellow-400',
      signal: 'PUT',
      signalColor: 'text-red-400',
      strength: '69%',
      strengthColor: 'text-green-400',
      description: 'OTC USD/CAD ослабевает на фоне роста цен на нефть',
      strategy: 'Binary strategy "OTC Oil Correlation" - USD/CAD-OTC falls when oil rises during Asian session. When WTI grows, buy LOWER option for 3-4 minutes. Oil correlation in OTC session reaches 90%, increasing forecast accuracy.'
    },
    'USD/CHF-OTC': {
      trend: 'Боковой',
      trendIcon: Minus,
      trendColor: 'text-gray-400',
      volatility: 'Низкая',
      volatilityColor: 'text-blue-400',
      signal: 'HOLD',
      signalColor: 'text-gray-400',
      strength: '51%',
      strengthColor: 'text-yellow-400',
      description: 'OTC USD/CHF стабилен, торгуется в узком коридоре',
      strategy: 'Binary strategy "OTC Swiss Stability" - USD/CHF-OTC in narrow corridor 0.8860-0.8900. Use 1-minute options on micro-movements. Low volatility compensated by high trade frequency. Perfect for algorithmic binary options trading.'
    },
    'NZD/USD-OTC': {
      trend: 'Восходящий',
      trendIcon: TrendingUp,
      trendColor: 'text-green-400',
      volatility: 'Средняя',
      volatilityColor: 'text-yellow-400',
      signal: 'CALL',
      signalColor: 'text-green-400',
      strength: '73%',
      strengthColor: 'text-green-400',
      description: 'OTC NZD/USD растет благодаря позитивным экономическим данным',
      strategy: 'Binary strategy "OTC Dairy Correlation" - NZD/USD-OTC rises after positive dairy data. On resistance breakouts buy HIGHER option for 3-5 minutes. Monitor GlobalDairyTrade auctions - they provide strong entry signals.'
    },
    'EUR/GBP-OTC': {
      trend: 'Восходящий',
      trendIcon: TrendingUp,
      trendColor: 'text-green-400',
      volatility: 'Низкая',
      volatilityColor: 'text-blue-400',
      signal: 'CALL',
      signalColor: 'text-green-400',
      strength: '66%',
      strengthColor: 'text-yellow-400',
      description: 'OTC EUR/GBP укрепляется на фоне стабильности еврозоны',
      strategy: 'Binary strategy "OTC Central Bank Divergence" - EUR/GBP-OTC rises due to ECB and Bank of England policy differences. On pullbacks to trend line buy HIGHER option for 2-4 minutes. ECB stability creates directional movement in OTC session.'
    }
  };

  const currentStrategy = strategies[currencyPair as keyof typeof strategies] || strategies['EUR/USD'];
  const TrendIcon = currentStrategy.trendIcon;

  return (
    <div className={`h-full transition-all duration-300`}>
      <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-1">
        <TrendIcon className={`w-3 h-3 ${currentStrategy.trendColor}`} />
        Signal
      </h3>
      
      {/* Signal Field - moved above progress */}
      {currentSignal ? (
        <div className={`p-4 rounded border-2 mb-3 min-h-[80px] flex flex-col justify-center transition-all duration-300 ${
          isSignalBlinking ? 'animate-pulse' : ''
        } ${
          currentSignal.direction === 'ВЫШЕ' 
            ? isSignalBlinking 
              ? 'bg-gradient-to-br from-green-400/90 via-emerald-400/90 to-lime-400/90 backdrop-blur-sm border-green-200 shadow-2xl shadow-green-400/90 brightness-150' 
              : 'bg-gradient-to-br from-green-600/30 via-emerald-600/30 to-lime-600/30 backdrop-blur-sm border-green-400/60 shadow-lg shadow-green-500/40'
            : isSignalBlinking
              ? 'bg-gradient-to-br from-red-400/90 via-pink-400/90 to-rose-400/90 backdrop-blur-sm border-red-200 shadow-2xl shadow-red-400/90 brightness-150'
              : 'bg-gradient-to-br from-red-600/30 via-pink-600/30 to-rose-600/30 backdrop-blur-sm border-red-400/60 shadow-lg shadow-red-500/40'
        }`}>
          <div className="space-y-3">
            {/* Заголовок сигнала */}
            <div className="text-center">
              <div className={`text-xl font-black uppercase tracking-wider ${
                isSignalBlinking ? 'text-white' : 'text-white'
              }`}>
                🎯 TRADING SIGNAL
              </div>
            </div>
            
            {/* Основная информация */}
            <div className="flex items-center justify-center">
              <div className="flex items-center gap-2">
                {currentSignal.direction === 'ВЫШЕ' ? (
                  <ArrowUp className={`w-8 h-8 ${isSignalBlinking ? 'text-white' : 'text-green-300'}`} />
                ) : (
                  <ArrowDown className={`w-8 h-8 ${isSignalBlinking ? 'text-white' : 'text-red-300'}`} />
                )}
                <div className="text-center">
                  <div className={`font-black text-2xl ${
                    isSignalBlinking ? 'text-white' : 'text-white'
                  }`}>
                    {currentSignal.pair}
                  </div>
                  <div className={`font-bold text-xl ${
                    currentSignal.direction === 'HIGHER' 
                      ? isSignalBlinking ? 'text-green-100' : 'text-green-300'
                      : isSignalBlinking ? 'text-red-100' : 'text-red-300'
                  }`}>
                    {currentSignal.direction}
                  </div>
                </div>
                {currentSignal.direction === 'HIGHER' ? (
                  <ArrowUp className={`w-8 h-8 ${isSignalBlinking ? 'text-white' : 'text-green-300'}`} />
                ) : (
                  <ArrowDown className={`w-8 h-8 ${isSignalBlinking ? 'text-white' : 'text-red-300'}`} />
                )}
              </div>
            </div>
            
            {/* Время экспирации - крупно */}
            <div className="text-center">
              <div className={`text-lg font-semibold ${isSignalBlinking ? 'text-gray-100' : 'text-gray-200'}`}>
                Expiration time:
              </div>
              <div className={`text-3xl font-black ${
                currentSignal.direction === 'HIGHER' 
                  ? isSignalBlinking ? 'text-green-100' : 'text-green-300'
                  : isSignalBlinking ? 'text-red-100' : 'text-red-300'
              }`}>
                {currentSignal.expiration}
              </div>
            </div>
            
            {/* Дополнительная информация */}
            <div className="flex items-center justify-between text-sm">
              <div className={`${isSignalBlinking ? 'text-gray-100' : 'text-gray-200'}`}>
                <span className="font-semibold">Entry price:</span>
                <span className={`ml-1 font-bold ${isSignalBlinking ? 'text-white' : 'text-white'}`}>
                  {currentSignal.entryPrice?.toFixed(5)}
                </span>
              </div>
              <div className={`text-xs ${isSignalBlinking ? 'text-gray-100' : 'text-gray-300'}`}>
                {new Date(currentSignal.timestamp).toLocaleTimeString('ru-RU', {
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit'
                })}
              </div>
            </div>
            
            {/* Инструкция */}
            <div className={`text-center p-3 rounded-lg ${
              currentSignal.direction === 'HIGHER'
                ? 'bg-green-900/40 border-2 border-green-400/60'
                : 'bg-red-900/40 border-2 border-red-400/60'
            }`}>
              <div className={`text-sm font-bold ${isSignalBlinking ? 'text-white' : 'text-gray-100'}`}>
                📈 Direction: {currentSignal.direction} | Expiration: {currentSignal.expiration}
              </div>
              <div className={`text-xs mt-1 ${isSignalBlinking ? 'text-gray-100' : 'text-gray-200'}`}>
                {currentSignal.direction === 'HIGHER' 
                  ? "Bet on price rise" 
                  : "Bet on price fall"}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-4 bg-gradient-to-br from-purple-800/60 via-blue-800/60 to-cyan-800/60 backdrop-blur-sm rounded border border-purple-400/50 text-center mb-3 min-h-[80px] flex flex-col justify-center shadow-inner">
          <div className="relative w-full h-full flex flex-col justify-center">
            {/* Progress Bar Background */}
            <div className="w-full bg-gradient-to-r from-gray-800/60 via-gray-700/60 to-gray-800/60 backdrop-blur-sm rounded-full h-8 overflow-hidden relative mb-2 border border-purple-500/30">
              {/* Progress Fill */}
              <div 
                className="h-full bg-gradient-to-r from-purple-500 via-blue-500 via-cyan-400 to-green-400 transition-all duration-1000 ease-out relative shadow-lg"
                style={{ width: `${progress}%` }}
              >
                {/* Animated shine effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-pulse"></div>
                {/* Moving light effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-300/30 to-transparent animate-ping"></div>
              </div>
              
              {/* Percentage Text Overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-white font-bold text-sm font-mono drop-shadow-lg text-shadow-lg">
                  {Math.round(progress)}%
                </span>
              </div>
            </div>
            
            {/* Status Text */}
            <div className="text-gray-300 text-sm font-semibold">
              <span className="text-cyan-300">Waiting for signal...</span>
            </div>
          </div>
        </div>
      )}
      
      <div className="mt-3 bg-gradient-to-br from-purple-900/50 via-blue-900/50 to-cyan-900/50 backdrop-blur-sm p-2 rounded border border-purple-400/50 shadow-inner">
        <div className="text-xs text-cyan-300 font-semibold mb-1">Strategy principle:</div>
        <div className="text-white text-xs leading-relaxed font-medium brightness-110 h-[80px] overflow-hidden">
          <p className="w-full h-full flex items-start">
            {displayedStrategyText}
            {isTyping && <span className="animate-pulse text-cyan-400">|</span>}
          </p>
        </div>
      </div>
      
    </div>
  );
};

export default StrategyAnalysis;