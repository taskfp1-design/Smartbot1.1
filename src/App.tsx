import React, { useState, useCallback, useEffect } from 'react';
import { useLanguage } from './hooks/useLanguage';
import { LanguageSelector } from './components/LanguageSelector';
import { Timer } from './components/Timer';
import { CurrencySelector } from './components/CurrencySelector';
import { Chart } from './components/Chart';
import StrategyAnalysis from './components/StrategyAnalysis';
import { TrendingUp, BarChart, Clock, Flame } from 'lucide-react';

function App() {
  const { t } = useLanguage();
  const [selectedPair, setSelectedPair] = useState('EUR/USD');
  const [signalGenerated, setSignalGenerated] = useState(false);
  const [hasRecommendation, setHasRecommendation] = useState(false);
  const [recommendedPair, setRecommendedPair] = useState('');
  const [isPersonalSignalBlinking, setIsPersonalSignalBlinking] = useState(false);
  const [timerData, setTimerData] = useState({ timeLeft: 0, maxTime: 0 });
  const [triggerExpressSignal, setTriggerExpressSignal] = useState(0);
  const [lastExpressSignalTime, setLastExpressSignalTime] = useState<number | null>(null);
  const [canUseExpressSignal, setCanUseExpressSignal] = useState(true);
  const [expressSignalTimeLeft, setExpressSignalTimeLeft] = useState(0);
  const [canUseHourlySignal, setCanUseHourlySignal] = useState(true);
  const [hourlySignalTimeLeft, setHourlySignalTimeLeft] = useState(0);
  const [lastHourlySignalTime, setLastHourlySignalTime] = useState<number | null>(null);
  const [canUseFiveHourSignal, setCanUseFiveHourSignal] = useState(true);
  const [fiveHourSignalTimeLeft, setFiveHourSignalTimeLeft] = useState(0);
  const [lastFiveHourSignalTime, setLastFiveHourSignalTime] = useState<number | null>(null);
  const [canUseTwentyFourHourSignal, setCanUseTwentyFourHourSignal] = useState(true);
  const [twentyFourHourSignalTimeLeft, setTwentyFourHourSignalTimeLeft] = useState(0);
  const [lastTwentyFourHourSignalTime, setLastTwentyFourHourSignalTime] = useState<number | null>(null);

  const handleTimerEnd = useCallback(() => {
    setSignalGenerated(true);
    setTimeout(() => setSignalGenerated(false), 2000);
  }, []);

  const handleGetRecommendation = useCallback(() => {
    const currencyPairs = [
      'EUR/USD', 'GBP/USD', 'USD/JPY', 'AUD/USD', 'USD/CAD', 'USD/CHF',
      'NZD/USD', 'EUR/GBP', 'EUR/JPY', 'GBP/JPY', 'AUD/JPY', 'CAD/JPY',
      'EUR/USD-OTC', 'GBP/USD-OTC', 'USD/JPY-OTC', 'AUD/USD-OTC', 'USD/CAD-OTC',
      'USD/CHF-OTC', 'NZD/USD-OTC', 'EUR/GBP-OTC'
    ];
    
    const randomPair = currencyPairs[Math.floor(Math.random() * currencyPairs.length)];
    setRecommendedPair(randomPair);
    setHasRecommendation(true);
    
    // Trigger express signal for strategy analysis only
    setTriggerExpressSignal(prev => prev + 1);
    
    // Убираем рекомендацию через 30 секунд
    setTimeout(() => {
      setHasRecommendation(false);
      setRecommendedPair('');
    }, 30000);
  }, []);

  const handleGetRecommendationWithCooldown = useCallback(() => {
    if (canUseExpressSignal) {
      handleGetRecommendation();
      
      // Set 15-minute cooldown for express signal
      const now = Date.now();
      setLastExpressSignalTime(now);
      setCanUseExpressSignal(false);
      setExpressSignalTimeLeft(15 * 60); // 15 minutes in seconds
      
      // Reset after 15 minutes
      setTimeout(() => {
        setCanUseExpressSignal(true);
        setLastExpressSignalTime(null);
        setExpressSignalTimeLeft(0);
      }, 15 * 60 * 1000); // 15 minutes
    }
  }, [canUseExpressSignal, handleGetRecommendation]);

  const handleGetHourlySignal = useCallback(() => {
    if (canUseHourlySignal) {
      // Generate signal when hourly button is clicked
      setTriggerExpressSignal(prev => prev + 1);
      
      // Set 1-hour cooldown for hourly signal
      const now = Date.now();
      setLastHourlySignalTime(now);
      setCanUseHourlySignal(false);
      setHourlySignalTimeLeft(60 * 60); // 1 hour in seconds
      
      // Reset after 1 hour
      setTimeout(() => {
        setCanUseHourlySignal(true);
        setLastHourlySignalTime(null);
        setHourlySignalTimeLeft(0);
      }, 60 * 60 * 1000); // 1 hour
    }
  }, [canUseHourlySignal]);

  const handleGetFiveHourSignal = useCallback(() => {
    if (canUseFiveHourSignal) {
      // Generate signal when 5-hour button is clicked
      setTriggerExpressSignal(prev => prev + 1);
      
      // Set 5-hour cooldown for 5-hour signal
      const now = Date.now();
      setLastFiveHourSignalTime(now);
      setCanUseFiveHourSignal(false);
      setFiveHourSignalTimeLeft(5 * 60 * 60); // 5 hours in seconds
      
      // Reset after 5 hours
      setTimeout(() => {
        setCanUseFiveHourSignal(true);
        setLastFiveHourSignalTime(null);
        setFiveHourSignalTimeLeft(0);
      }, 5 * 60 * 60 * 1000); // 5 hours
    }
  }, [canUseFiveHourSignal]);

  const handleGetTwentyFourHourSignal = useCallback(() => {
    if (canUseTwentyFourHourSignal) {
      // Generate signal when 24-hour button is clicked
      setTriggerExpressSignal(prev => prev + 1);
      
      // Set 24-hour cooldown for 24-hour signal
      const now = Date.now();
      setLastTwentyFourHourSignalTime(now);
      setCanUseTwentyFourHourSignal(false);
      setTwentyFourHourSignalTimeLeft(24 * 60 * 60); // 24 hours in seconds
      
      // Reset after 24 hours
      setTimeout(() => {
        setCanUseTwentyFourHourSignal(true);
        setLastTwentyFourHourSignalTime(null);
        setTwentyFourHourSignalTimeLeft(0);
      }, 24 * 60 * 60 * 1000); // 24 hours
    }
  }, [canUseTwentyFourHourSignal]);

  // Check if 15 minutes have passed since last express signal
  useEffect(() => {
    if (lastExpressSignalTime) {
      const now = Date.now();
      const timePassed = now - lastExpressSignalTime;
      const fifteenMinutes = 15 * 60 * 1000;
      
      if (timePassed >= fifteenMinutes) {
        setCanUseExpressSignal(true);
        setLastExpressSignalTime(null);
      }
    }
  }, [lastExpressSignalTime]);

  // Countdown timer for express signal
  useEffect(() => {
    if (expressSignalTimeLeft > 0) {
      const timer = setInterval(() => {
        setExpressSignalTimeLeft(prev => {
          if (prev <= 1) {
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [expressSignalTimeLeft]);

  // Countdown timer for hourly signal
  useEffect(() => {
    if (hourlySignalTimeLeft > 0) {
      const timer = setInterval(() => {
        setHourlySignalTimeLeft(prev => {
          if (prev <= 1) {
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [hourlySignalTimeLeft]);

  // Countdown timer for 5-hour signal
  useEffect(() => {
    if (fiveHourSignalTimeLeft > 0) {
      const timer = setInterval(() => {
        setFiveHourSignalTimeLeft(prev => {
          if (prev <= 1) {
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [fiveHourSignalTimeLeft]);

  // Countdown timer for 24-hour signal
  useEffect(() => {
    if (twentyFourHourSignalTimeLeft > 0) {
      const timer = setInterval(() => {
        setTwentyFourHourSignalTimeLeft(prev => {
          if (prev <= 1) {
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [twentyFourHourSignalTimeLeft]);

  // Format time for display (HH:MM:SS)
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Blinking animation for personal signal button every 2 seconds
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      if (canUseExpressSignal) {
        setIsPersonalSignalBlinking(true);
        setTimeout(() => setIsPersonalSignalBlinking(false), 500); // Blink for 0.5 seconds
      }
    }, 2000); // Every 2 seconds

    return () => clearInterval(blinkInterval);
  }, [canUseExpressSignal]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-black">
      {/* Header */}
      <header className="bg-black/50 backdrop-blur-sm border-b border-blue-500/20">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-2 rounded-lg">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">{t.appTitle}</h1>
                <p className="text-blue-200">{t.appSubtitle}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
            </div>
          </div>
        </div>
      </header>

      {/* Signal Alert */}
      {signalGenerated && (
        <div className="fixed top-20 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-bounce">
          <div className="flex items-center gap-2">
            <BarChart className="w-5 h-5" />
            <span className="font-semibold">{t.tradingSignal}</span>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Единый большой контейнер */}
        <div className="bg-gradient-to-br from-purple-900/80 via-blue-900/80 to-cyan-900/80 backdrop-blur-sm rounded-xl shadow-2xl overflow-visible border border-purple-500/30 relative z-0">
          {/* График - полная ширина сверху */}
          <div className="w-full relative z-1">
            <Chart 
              currencyPair={selectedPair} 
              onPairChange={setSelectedPair}
              key={`${selectedPair}-${triggerExpressSignal}`}
            />
          </div>

          {/* Три блока в ряд */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 p-3 relative z-1">
            {/* Таймер */}
            <div className="bg-gradient-to-br from-purple-800/60 via-blue-800/60 to-cyan-800/60 backdrop-blur-sm rounded-lg p-3 border border-purple-400/40 shadow-lg shadow-purple-500/20 relative z-1">
              <Timer onTimerEnd={handleTimerEnd} onTimerUpdate={setTimerData} />
            </div>

            {/* Сигнал */}
            <div className="bg-gradient-to-br from-purple-800/60 via-blue-800/60 to-cyan-800/60 backdrop-blur-sm rounded-lg p-3 border border-purple-400/40 shadow-lg shadow-purple-500/20 relative z-1">
              <StrategyAnalysis 
                currencyPair={selectedPair} 
                timeLeft={timerData.timeLeft}
                maxTime={timerData.maxTime}
                expressSignalTrigger={triggerExpressSignal}
              />
            </div>

            {/* Сервисы */}
            <div className="bg-gradient-to-br from-purple-800/60 via-blue-800/60 to-cyan-800/60 backdrop-blur-sm rounded-lg p-3 border border-purple-400/40 shadow-lg shadow-purple-500/20 relative z-1">
              <div className="text-center">
                <button
                  onClick={handleGetRecommendationWithCooldown}
                  disabled={!canUseExpressSignal}
                  className={`w-full px-3 py-2 rounded-lg font-bold transition-all duration-200 mb-2 text-xs relative ${
                    !canUseExpressSignal
                      ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-blue-500 to-white hover:from-blue-600 hover:to-gray-100 text-blue-900 shadow-lg hover:shadow-xl transform hover:scale-105 font-inter'
                  } ${
                    isPersonalSignalBlinking && canUseExpressSignal ? 'animate-pulse shadow-lg shadow-blue-500/50' : ''
                  }`}
                  style={{ fontFamily: '"Inter", "SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}
                >
                  {!canUseExpressSignal && expressSignalTimeLeft > 0 ? (
                    <div className="flex items-center justify-center gap-2 py-1">
                      <Clock className="w-4 h-4" />
                      <div className="text-center">
                        <div className="font-black text-xs tracking-wider uppercase">
                          {t.nextSignalAfter}
                        </div>
                        <div className="font-mono text-sm font-bold">
                          {formatTime(expressSignalTimeLeft)}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-3 py-1">
                      {/* Fire animation */}
                      <div className="fire-animation">
                        🔥
                      </div>
                      <div className="text-center">
                        <div className="font-black text-sm tracking-wider uppercase text-shadow">
                          {t.getExpressSignal}
                        </div>
                        <div className="text-xs opacity-95 font-semibold tracking-wide">
                          {t.immediately}
                        </div>
                      </div>
                      <div className="fire-animation">
                        🔥
                      </div>
                    </div>
                  )}
                </button>
                
               <button className="w-full mt-2 px-3 py-2 bg-gradient-to-r from-blue-500 to-white hover:from-blue-600 hover:to-gray-100 text-blue-900 rounded-lg font-bold transition-all duration-200 text-xs shadow-lg hover:shadow-xl transform hover:scale-105"
                        style={{ fontFamily: '"Inter", "SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}
                        onClick={handleGetHourlySignal}
                        disabled={!canUseHourlySignal}>
                  {!canUseHourlySignal && hourlySignalTimeLeft > 0 ? (
                    <div className="flex items-center justify-center gap-2 py-1">
                      <Clock className="w-4 h-4" />
                      <div className="text-center">
                        <div className="font-black text-xs tracking-wider uppercase">
                          {t.nextSignalAfter}
                        </div>
                        <div className="font-mono text-sm font-bold">
                          {formatTime(hourlySignalTimeLeft)}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-3">
                      <span>📚</span>
                      <div className="text-center py-1">
                        <div className="font-black text-sm tracking-wider uppercase text-shadow">
                          {t.getEducationalMaterials}
                        </div>
                      </div>
                    </div>
                  )}
                </button>
                
               <button className="w-full mt-2 px-3 py-2 bg-gradient-to-r from-blue-500 to-white hover:from-blue-600 hover:to-gray-100 text-blue-900 rounded-lg font-bold transition-all duration-200 text-sm shadow-lg hover:shadow-xl transform hover:scale-105"
                        style={{ fontFamily: '"Inter", "SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}
                        onClick={handleGetFiveHourSignal}
                        disabled={!canUseFiveHourSignal}>
                  {!canUseFiveHourSignal && fiveHourSignalTimeLeft > 0 ? (
                    <div className="flex items-center justify-center gap-2 py-1">
                      <Clock className="w-4 h-4" />
                      <div className="text-center">
                        <div className="font-black text-xs tracking-wider uppercase">
                          {t.nextSignalAfter}
                        </div>
                        <div className="font-mono text-sm font-bold">
                          {formatTime(fiveHourSignalTimeLeft)}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-3">
                      <span>📊</span>
                      <div className="text-center py-1">
                        <div className="font-black text-sm tracking-wider uppercase text-shadow">
                          Get signal based on 5 hour market analysis
                        </div>
                      </div>
                    </div>
                  )}
                </button>
                
               <button className="w-full mt-2 px-3 py-2 bg-gradient-to-r from-blue-500 to-white hover:from-blue-600 hover:to-gray-100 text-blue-900 rounded-lg font-bold transition-all duration-200 text-xs shadow-lg hover:shadow-xl transform hover:scale-105"
                        style={{ fontFamily: '"Inter", "SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}
                        onClick={handleGetTwentyFourHourSignal}
                        disabled={!canUseTwentyFourHourSignal}>
                  {!canUseTwentyFourHourSignal && twentyFourHourSignalTimeLeft > 0 ? (
                    <div className="flex items-center justify-center gap-2 py-1">
                      <Clock className="w-4 h-4" />
                      <div className="text-center">
                        <div className="font-black text-xs tracking-wider uppercase">
                          {t.nextSignalAfter}
                        </div>
                        <div className="font-mono text-sm font-bold">
                          {formatTime(twentyFourHourSignalTimeLeft)}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-3">
                      <span>📈</span>
                      <div className="text-center py-1">
                        <div className="font-black text-sm tracking-wider uppercase text-shadow">
                          Get signal based on 24 hour market analysis
                        </div>
                      </div>
                    </div>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Разделитель */}
          <div className="border-t border-gray-700"></div>

        </div>
      </main>

      {/* Footer */}
      <footer className="bg-black/50 backdrop-blur-sm border-t border-blue-500/20 mt-12">
        <div className="max-w-7xl mx-auto px-4 py-6 text-center text-gray-400">
          <p>{t.footerCopyright}</p>
          <p className="text-sm mt-1">
            {t.footerWarning}
          </p>
        </div>
      </footer>
      
      {/* Fire animation styles */}
      <style jsx>{`
        .fire-animation {
          font-size: 36px;
          animation: fireFlicker 0.8s ease-in-out infinite alternate;
          filter: drop-shadow(0 0 3px rgba(255, 165, 0, 0.8));
        }
        
        @keyframes fireFlicker {
          0% {
            transform: scale(1) rotate(-2deg);
            opacity: 0.9;
          }
          25% {
            transform: scale(1.1) rotate(1deg);
            opacity: 1;
          }
          50% {
            transform: scale(0.95) rotate(-1deg);
            opacity: 0.95;
          }
          75% {
            transform: scale(1.05) rotate(2deg);
            opacity: 1;
          }
          100% {
            transform: scale(1) rotate(-1deg);
            opacity: 0.9;
          }
        }
        
        .diamond-large {
          font-size: 24px;
          display: inline-block;
          position: relative;
          z-index: 10;
          margin-right: 4px;
        }
       
       .text-shadow {
         text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3), 0 1px 2px rgba(0, 0, 0, 0.2);
       }
       
       .text-shadow-sm {
         text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
       }
       
       .font-inter {
         font-family: 'Inter', 'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
         font-feature-settings: 'cv02', 'cv03', 'cv04', 'cv11';
       }
      `}</style>
    </div>
  );
}

export default App;