import React, { useState, useCallback, useEffect } from 'react';
import { TrendingUp, BarChart, Clock, Flame } from 'lucide-react';

// Lazy load components to avoid circular dependencies
const Timer = React.lazy(() => import('./components/Timer').then(module => ({ default: module.Timer })));
const Chart = React.lazy(() => import('./components/Chart').then(module => ({ default: module.Chart })));
const StrategyAnalysis = React.lazy(() => import('./components/StrategyAnalysis'));

// Simple translations to avoid hook issues
const translations = {
  appTitle: "Smart Trading Bot - Binary Options",
  appSubtitle: "Professional currency pair analytics",
  tradingSignal: "🎯 TRADING SIGNAL",
  nextSignalAfter: "Next signal in",
  getExpressSignal: "Get express signal",
  immediately: "immediately",
  getEducationalMaterials: "Get signal based on 1 hour market analysis",
  footerCopyright: "© 2025 Binary Options Analytics. All rights reserved.",
  footerWarning: "Binary options trading carries high risk of capital loss"
};

function App() {
  // Error boundary state
  const [hasError, setHasError] = useState(false);
  
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

  // Error handling
  useEffect(() => {
    const handleError = (error: ErrorEvent) => {
      console.error('Global error:', error);
      setHasError(true);
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error('Unhandled promise rejection:', event.reason);
      setHasError(true);
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  if (hasError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-black flex items-center justify-center">
        <div className="bg-red-900/50 border border-red-500 rounded-lg p-8 max-w-md text-center">
          <h2 className="text-white text-xl font-bold mb-4">Application Error</h2>
          <p className="text-red-200 mb-4">Something went wrong. Please refresh the page.</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

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
    
    setTimeout(() => {
      setHasRecommendation(false);
      setRecommendedPair('');
    }, 30000);
  }, []);

  const handleGetRecommendationWithCooldown = useCallback(() => {
    if (canUseExpressSignal) {
      handleGetRecommendation();
      
      const now = Date.now();
      setLastExpressSignalTime(now);
      setCanUseExpressSignal(false);
      setExpressSignalTimeLeft(15 * 60);
      
      setTimeout(() => {
        setCanUseExpressSignal(true);
        setLastExpressSignalTime(null);
        setExpressSignalTimeLeft(0);
      }, 15 * 60 * 1000);
    }
  }, [canUseExpressSignal, handleGetRecommendation]);

  const handleGetHourlySignal = useCallback(() => {
    if (canUseHourlySignal) {
      setTriggerExpressSignal(prev => prev + 1);
      
      const now = Date.now();
      setLastHourlySignalTime(now);
      setCanUseHourlySignal(false);
      setHourlySignalTimeLeft(60 * 60);
      
      setTimeout(() => {
        setCanUseHourlySignal(true);
        setLastHourlySignalTime(null);
        setHourlySignalTimeLeft(0);
      }, 60 * 60 * 1000);
    }
  }, [canUseHourlySignal]);

  const handleGetFiveHourSignal = useCallback(() => {
    if (canUseFiveHourSignal) {
      setTriggerExpressSignal(prev => prev + 1);
      
      const now = Date.now();
      setLastFiveHourSignalTime(now);
      setCanUseFiveHourSignal(false);
      setFiveHourSignalTimeLeft(5 * 60 * 60);
      
      setTimeout(() => {
        setCanUseFiveHourSignal(true);
        setLastFiveHourSignalTime(null);
        setFiveHourSignalTimeLeft(0);
      }, 5 * 60 * 60 * 1000);
    }
  }, [canUseFiveHourSignal]);

  const handleGetTwentyFourHourSignal = useCallback(() => {
    if (canUseTwentyFourHourSignal) {
      setTriggerExpressSignal(prev => prev + 1);
      
      const now = Date.now();
      setLastTwentyFourHourSignalTime(now);
      setCanUseTwentyFourHourSignal(false);
      setTwentyFourHourSignalTimeLeft(24 * 60 * 60);
      
      setTimeout(() => {
        setCanUseTwentyFourHourSignal(true);
        setLastTwentyFourHourSignalTime(null);
        setTwentyFourHourSignalTimeLeft(0);
      }, 24 * 60 * 60 * 1000);
    }
  }, [canUseTwentyFourHourSignal]);

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

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    const blinkInterval = setInterval(() => {
      if (canUseExpressSignal) {
        setIsPersonalSignalBlinking(true);
        setTimeout(() => setIsPersonalSignalBlinking(false), 500);
      }
    }, 2000);

    return () => clearInterval(blinkInterval);
  }, [canUseExpressSignal]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-black">
      <header className="bg-black/50 backdrop-blur-sm border-b border-blue-500/20">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-2 rounded-lg">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">{translations.appTitle}</h1>
                <p className="text-blue-200">{translations.appSubtitle}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
            </div>
          </div>
        </div>
      </header>

      {signalGenerated && (
        <div className="fixed top-20 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-bounce">
          <div className="flex items-center gap-2">
            <BarChart className="w-5 h-5" />
            <span className="font-semibold">{translations.tradingSignal}</span>
          </div>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-gradient-to-br from-purple-900/80 via-blue-900/80 to-cyan-900/80 backdrop-blur-sm rounded-xl shadow-2xl overflow-visible border border-purple-500/30 relative z-0">
          <React.Suspense fallback={
            <div className="w-full h-96 flex items-center justify-center">
              <div className="text-white">Loading chart...</div>
            </div>
          }>
            <div className="w-full relative z-1">
              <Chart 
                currencyPair={selectedPair} 
                onPairChange={setSelectedPair}
                key={`${selectedPair}-${triggerExpressSignal}`}
              />
            </div>
          </React.Suspense>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 p-3 relative z-1">
            <React.Suspense fallback={
              <div className="bg-gradient-to-br from-purple-800/60 via-blue-800/60 to-cyan-800/60 backdrop-blur-sm rounded-lg p-3 border border-purple-400/40 shadow-lg shadow-purple-500/20 relative z-1">
                <div className="text-white text-center">Loading timer...</div>
              </div>
            }>
              <div className="bg-gradient-to-br from-purple-800/60 via-blue-800/60 to-cyan-800/60 backdrop-blur-sm rounded-lg p-3 border border-purple-400/40 shadow-lg shadow-purple-500/20 relative z-1">
                <Timer onTimerEnd={handleTimerEnd} onTimerUpdate={setTimerData} />
              </div>
            </React.Suspense>

            <React.Suspense fallback={
              <div className="bg-gradient-to-br from-purple-800/60 via-blue-800/60 to-cyan-800/60 backdrop-blur-sm rounded-lg p-3 border border-purple-400/40 shadow-lg shadow-purple-500/20 relative z-1">
                <div className="text-white text-center">Loading analysis...</div>
              </div>
            }>
              <div className="bg-gradient-to-br from-purple-800/60 via-blue-800/60 to-cyan-800/60 backdrop-blur-sm rounded-lg p-3 border border-purple-400/40 shadow-lg shadow-purple-500/20 relative z-1">
                <StrategyAnalysis 
                  currencyPair={selectedPair} 
                  timeLeft={timerData.timeLeft}
                  maxTime={timerData.maxTime}
                  expressSignalTrigger={triggerExpressSignal}
                />
              </div>
            </React.Suspense>

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
                >
                  {!canUseExpressSignal && expressSignalTimeLeft > 0 ? (
                    <div className="flex items-center justify-center gap-2 py-1">
                      <Clock className="w-4 h-4" />
                      <div className="text-center">
                        <div className="font-black text-xs tracking-wider uppercase">
                          {translations.nextSignalAfter}
                        </div>
                        <div className="font-mono text-sm font-bold">
                          {formatTime(expressSignalTimeLeft)}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-3 py-1">
                      <div className="fire-animation">
                        🔥
                      </div>
                      <div className="text-center">
                        <div className="font-black text-sm tracking-wider uppercase text-shadow">
                          {translations.getExpressSignal}
                        </div>
                        <div className="text-xs opacity-95 font-semibold tracking-wide">
                          {translations.immediately}
                        </div>
                      </div>
                      <div className="fire-animation">
                        🔥
                      </div>
                    </div>
                  )}
                </button>
                
               <button className="w-full mt-2 px-3 py-2 bg-gradient-to-r from-blue-500 to-white hover:from-blue-600 hover:to-gray-100 text-blue-900 rounded-lg font-bold transition-all duration-200 text-xs shadow-lg hover:shadow-xl transform hover:scale-105"
                        onClick={handleGetHourlySignal}
                        disabled={!canUseHourlySignal}>
                  {!canUseHourlySignal && hourlySignalTimeLeft > 0 ? (
                    <div className="flex items-center justify-center gap-2 py-1">
                      <Clock className="w-4 h-4" />
                      <div className="text-center">
                        <div className="font-black text-xs tracking-wider uppercase">
                          {translations.nextSignalAfter}
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
                          {translations.getEducationalMaterials}
                        </div>
                      </div>
                    </div>
                  )}
                </button>
                
               <button className="w-full mt-2 px-3 py-2 bg-gradient-to-r from-blue-500 to-white hover:from-blue-600 hover:to-gray-100 text-blue-900 rounded-lg font-bold transition-all duration-200 text-sm shadow-lg hover:shadow-xl transform hover:scale-105"
                        onClick={handleGetFiveHourSignal}
                        disabled={!canUseFiveHourSignal}>
                  {!canUseFiveHourSignal && fiveHourSignalTimeLeft > 0 ? (
                    <div className="flex items-center justify-center gap-2 py-1">
                      <Clock className="w-4 h-4" />
                      <div className="text-center">
                        <div className="font-black text-xs tracking-wider uppercase">
                          {translations.nextSignalAfter}
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
                        onClick={handleGetTwentyFourHourSignal}
                        disabled={!canUseTwentyFourHourSignal}>
                  {!canUseTwentyFourHourSignal && twentyFourHourSignalTimeLeft > 0 ? (
                    <div className="flex items-center justify-center gap-2 py-1">
                      <Clock className="w-4 h-4" />
                      <div className="text-center">
                        <div className="font-black text-xs tracking-wider uppercase">
                          {translations.nextSignalAfter}
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

          <div className="border-t border-gray-700"></div>

        </div>
      </main>

      <footer className="bg-black/50 backdrop-blur-sm border-t border-blue-500/20 mt-12">
        <div className="max-w-7xl mx-auto px-4 py-6 text-center text-gray-400">
          <p>{translations.footerCopyright}</p>
          <p className="text-sm mt-1">
            {translations.footerWarning}
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;