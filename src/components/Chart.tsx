import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Users } from 'lucide-react';

// Simple translations to avoid hook issues
const translations = {
  volume: "Volume:"
};

interface ChartProps {
  currencyPair: string;
  onPairChange: (pair: string) => void;
}

interface Candle {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

interface Indicator {
  sma20: number;
  sma50: number;
  ema12: number;
  ema26: number;
  rsi: number;
  macd: number;
  signal: number;
  bollinger: {
    upper: number;
    middle: number;
    lower: number;
  };
}

export const Chart: React.FC<ChartProps> = ({ currencyPair, onPairChange }) => {
  const [candles, setCandles] = useState<Candle[]>([]);
  const [indicators, setIndicators] = useState<Indicator[]>([]);
  const [currentPrice, setCurrentPrice] = useState(1.0850);
  const [isPlaying, setIsPlaying] = useState(true);
  const [waitingUsers, setWaitingUsers] = useState(1247);
  const [showIndicators, setShowIndicators] = useState({
    sma: true,
    ema: true,
    bollinger: true,
    rsi: true,
    macd: true
  });
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const calculateIndicators = (candles: Candle[]): Indicator[] => {
    const indicators: Indicator[] = [];
    
    for (let i = 0; i < candles.length; i++) {
      const currentCandles = candles.slice(0, i + 1);
      const closes = currentCandles.map(c => c.close);
      const highs = currentCandles.map(c => c.high);
      const lows = currentCandles.map(c => c.low);
      
      const sma20 = i >= 19 ? closes.slice(-20).reduce((a, b) => a + b) / 20 : closes[i];
      const sma50 = i >= 49 ? closes.slice(-50).reduce((a, b) => a + b) / 50 : closes[i];
      
      const ema12 = i === 0 ? closes[0] : (closes[i] * (2 / 13)) + (indicators[i - 1]?.ema12 || closes[0]) * (1 - (2 / 13));
      const ema26 = i === 0 ? closes[0] : (closes[i] * (2 / 27)) + (indicators[i - 1]?.ema26 || closes[0]) * (1 - (2 / 27));
      
      let rsi = 50;
      if (i >= 14) {
        const gains = [];
        const losses = [];
        for (let j = i - 13; j <= i; j++) {
          const change = closes[j] - closes[j - 1];
          gains.push(change > 0 ? change : 0);
          losses.push(change < 0 ? -change : 0);
        }
        const avgGain = gains.reduce((a, b) => a + b) / 14;
        const avgLoss = losses.reduce((a, b) => a + b) / 14;
        rsi = avgLoss === 0 ? 100 : 100 - (100 / (1 + (avgGain / avgLoss)));
      }
      
      const macd = ema12 - ema26;
      const signal = i === 0 ? macd : (macd * (2 / 10)) + (indicators[i - 1]?.signal || macd) * (1 - (2 / 10));
      
      let bollinger = { upper: closes[i], middle: closes[i], lower: closes[i] };
      if (i >= 19) {
        const sma = sma20;
        const variance = closes.slice(-20).reduce((sum, price) => sum + Math.pow(price - sma, 2), 0) / 20;
        const stdDev = Math.sqrt(variance);
        bollinger = {
          upper: sma + (stdDev * 2),
          middle: sma,
          lower: sma - (stdDev * 2)
        };
      }
      
      indicators.push({
        sma20,
        sma50,
        ema12,
        ema26,
        rsi,
        macd,
        signal,
        bollinger
      });
    }
    
    return indicators;
  };

  useEffect(() => {
    const initialCandles: Candle[] = [];
    let basePrice = 1.0850;
    const now = Date.now();

    for (let i = 0; i < 50; i++) {
      const time = now - (50 - i) * 5000;
      const open = basePrice;
      const volatility = 0.0005 + Math.random() * 0.0010;
      const direction = Math.random() > 0.5 ? 1 : -1;
      const change = direction * volatility * (0.5 + Math.random());
      const close = open + change;
      
      const high = Math.max(open, close) + Math.random() * 0.0003;
      const low = Math.min(open, close) - Math.random() * 0.0003;
      const volume = 1000 + Math.random() * 5000;

      initialCandles.push({ time, open, high, low, close, volume });
      basePrice = close;
    }

    setCandles(initialCandles);
    setIndicators(calculateIndicators(initialCandles));
    setCurrentPrice(basePrice);
  }, [currencyPair]);

  useEffect(() => {
    if (!isPlaying) return;

    intervalRef.current = setInterval(() => {
      setCandles(prev => {
        const lastCandle = prev[prev.length - 1];
        const open = lastCandle.close;
        const volatility = 0.0005 + Math.random() * 0.0015;
        const direction = Math.random() > 0.48 ? 1 : -1;
        const change = direction * volatility * (0.3 + Math.random() * 0.7);
        const close = open + change;
        
        const high = Math.max(open, close) + Math.random() * 0.0004;
        const low = Math.min(open, close) - Math.random() * 0.0004;
        const volume = 800 + Math.random() * 4000;

        const newCandle: Candle = {
          time: Date.now(),
          open,
          high,
          low,
          close,
          volume
        };

        setCurrentPrice(close);
        const newCandles = [...prev.slice(1), newCandle];
        setIndicators(calculateIndicators(newCandles));
        return newCandles;
      });

      setWaitingUsers(prev => {
        const change = Math.floor((Math.random() - 0.5) * 50);
        const newCount = Math.max(100, Math.min(5000, prev + change));
        return newCount;
      });
    }, 1500);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying]);

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const chartWidth = 900;
  const chartHeight = 400;
  const candleWidth = 14;
  const candleSpacing = 3;

  if (candles.length === 0) return <div>Loading...</div>;

  const visibleCandles = candles.slice(-40);
  const prices = visibleCandles.flatMap(c => [c.high, c.low]);
  const maxPrice = Math.max(...prices);
  const minPrice = Math.min(...prices);
  const priceRange = maxPrice - minPrice;
  const padding = priceRange * 0.1;

  const scaleY = (price: number) => {
    return chartHeight - ((price - minPrice + padding) / (priceRange + 2 * padding)) * chartHeight;
  };

  const currentPriceY = scaleY(currentPrice);
  const priceChange = visibleCandles.length > 1 ? 
    currentPrice - visibleCandles[visibleCandles.length - 2].close : 0;

  const visibleIndicators = indicators.slice(-40);

  return (
    <div className="bg-gradient-to-br from-gray-900 via-black to-gray-900 rounded-xl shadow-2xl overflow-visible relative z-0">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-transparent to-green-900/20 pointer-events-none z-0"></div>
      
      <div className="bg-black/80 backdrop-blur-sm px-4 sm:px-6 py-3 sm:py-4 border-b border-cyan-500/30 relative z-1">
        <div className="flex flex-wrap gap-2 justify-center mb-2">
          <button
            onClick={() => setShowIndicators(prev => ({ ...prev, sma: !prev.sma }))}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-300 transform hover:scale-105 ${
              showIndicators.sma 
                ? 'bg-gradient-to-r from-blue-500 to-cyan-400 text-white shadow-lg shadow-blue-500/50' 
                : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50 border border-gray-600'
            }`}
          >
            SMA
          </button>
          <button
            onClick={() => setShowIndicators(prev => ({ ...prev, ema: !prev.ema }))}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-300 transform hover:scale-105 ${
              showIndicators.ema 
                ? 'bg-gradient-to-r from-green-500 to-emerald-400 text-white shadow-lg shadow-green-500/50' 
                : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50 border border-gray-600'
            }`}
          >
            EMA
          </button>
          <button
            onClick={() => setShowIndicators(prev => ({ ...prev, bollinger: !prev.bollinger }))}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-300 transform hover:scale-105 ${
              showIndicators.bollinger 
                ? 'bg-gradient-to-r from-purple-500 to-pink-400 text-white shadow-lg shadow-purple-500/50' 
                : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50 border border-gray-600'
            }`}
          >
            BB
          </button>
          <button
            onClick={() => setShowIndicators(prev => ({ ...prev, rsi: !prev.rsi }))}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-300 transform hover:scale-105 ${
              showIndicators.rsi 
                ? 'bg-gradient-to-r from-orange-500 to-yellow-400 text-white shadow-lg shadow-orange-500/50' 
                : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50 border border-gray-600'
            }`}
          >
            RSI
          </button>
          <button
            onClick={() => setShowIndicators(prev => ({ ...prev, macd: !prev.macd }))}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-300 transform hover:scale-105 ${
              showIndicators.macd 
                ? 'bg-gradient-to-r from-red-500 to-pink-400 text-white shadow-lg shadow-red-500/50' 
                : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50 border border-gray-600'
            }`}
          >
            MACD
          </button>
        </div>
      </div>

      <div className="relative bg-black/90 p-4 overflow-hidden z-1" style={{ perspective: '1000px' }}>
        <div 
          className="relative transform-gpu transition-transform duration-1000 z-1"
          style={{ 
            transformStyle: 'preserve-3d',
            transform: 'rotateX(5deg) rotateY(-2deg)'
          }}
        >
          <svg 
            width="100%" 
            height={chartHeight} 
            viewBox={`0 0 ${chartWidth} ${chartHeight}`} 
            className="overflow-visible filter drop-shadow-2xl"
            style={{ filter: 'drop-shadow(0 0 20px rgba(0, 255, 255, 0.3))' }}
          >
            <defs>
              <pattern id="neonGrid" width="50" height="40" patternUnits="userSpaceOnUse">
                <path 
                  d="M 50 0 L 0 0 0 40" 
                  fill="none" 
                  stroke="url(#gridGradient)" 
                  strokeWidth="0.8" 
                  opacity="0.6"
                />
              </pattern>
              
              <linearGradient id="gridGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#00ffff" stopOpacity="0.8"/>
                <stop offset="50%" stopColor="#0080ff" stopOpacity="0.4"/>
                <stop offset="100%" stopColor="#00ffff" stopOpacity="0.8"/>
              </linearGradient>

              <linearGradient id="candleGreenGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#00ff88"/>
                <stop offset="50%" stopColor="#00cc66"/>
                <stop offset="100%" stopColor="#00ff88"/>
              </linearGradient>

              <linearGradient id="candleRedGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ff4444"/>
                <stop offset="50%" stopColor="#cc2222"/>
                <stop offset="100%" stopColor="#ff4444"/>
              </linearGradient>

              <filter id="greenGlow">
                <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                <feMerge> 
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>

              <filter id="redGlow">
                <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                <feMerge> 
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>

              <filter id="neonGlow">
                <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                <feMerge> 
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>

            <rect width="100%" height="100%" fill="url(#neonGrid)" opacity="0.3" />

            {[0.2, 0.4, 0.6, 0.8].map((ratio, i) => {
              const y = chartHeight * ratio;
              const price = maxPrice - (priceRange * ratio);
              return (
                <g key={i}>
                  <line 
                    x1="0" 
                    y1={y} 
                    x2={chartWidth} 
                    y2={y} 
                    stroke="#00ffff" 
                    strokeWidth="1" 
                    opacity="0.4" 
                    filter="url(#neonGlow)"
                    strokeDasharray="5,5"
                  />
                  <text 
                    x={chartWidth - 10} 
                    y={y - 5} 
                    fill="#00ffff" 
                    fontSize="11" 
                    textAnchor="end"
                    filter="url(#neonGlow)"
                    className="font-mono font-bold"
                  >
                    {price.toFixed(5)}
                  </text>
                </g>
              );
            })}

            <line 
              x1="0" 
              y1={currentPriceY} 
              x2={chartWidth} 
              y2={currentPriceY} 
              stroke="#ffff00" 
              strokeWidth="2" 
              strokeDasharray="8,4"
              opacity="0.9"
              filter="url(#neonGlow)"
              className="animate-pulse"
            />
            <text 
              x={chartWidth - 10} 
              y={currentPriceY - 5} 
              fill="#ffff00" 
              fontSize="13" 
              fontWeight="bold" 
              textAnchor="end"
              filter="url(#neonGlow)"
              className="font-mono animate-pulse"
            >
              {currentPrice.toFixed(5)}
            </text>

            {visibleCandles.map((candle, i) => {
              const x = i * (candleWidth + candleSpacing) + candleWidth / 2;
              const isGreen = candle.close > candle.open;
              const bodyTop = scaleY(Math.max(candle.open, candle.close));
              const bodyBottom = scaleY(Math.min(candle.open, candle.close));
              const bodyHeight = Math.max(2, bodyBottom - bodyTop);
              const wickTop = scaleY(candle.high);
              const wickBottom = scaleY(candle.low);

              return (
                <g key={candle.time} className="transform-gpu">
                  <g transform="translate(2, 2)" opacity="0.3">
                    <line
                      x1={x}
                      y1={wickTop}
                      x2={x}
                      y2={wickBottom}
                      stroke="#000"
                      strokeWidth="2"
                    />
                    <rect
                      x={x - candleWidth / 2}
                      y={bodyTop}
                      width={candleWidth}
                      height={bodyHeight}
                      fill="#000"
                    />
                  </g>

                  <line
                    x1={x}
                    y1={wickTop}
                    x2={x}
                    y2={wickBottom}
                    stroke={isGreen ? "#00ff88" : "#ff4444"}
                    strokeWidth="2"
                    filter={isGreen ? "url(#greenGlow)" : "url(#redGlow)"}
                    opacity="0.9"
                  />
                  
                  <rect
                    x={x - candleWidth / 2}
                    y={bodyTop}
                    width={candleWidth}
                    height={bodyHeight}
                    fill={isGreen ? "url(#candleGreenGradient)" : "url(#candleRedGradient)"}
                    stroke={isGreen ? "#00ff88" : "#ff4444"}
                    strokeWidth="1"
                    filter={isGreen ? "url(#greenGlow)" : "url(#redGlow)"}
                    rx="2"
                    className="transition-all duration-300"
                  />

                  <polygon
                    points={`${x - candleWidth / 2},${bodyTop} ${x - candleWidth / 2 + 3},${bodyTop - 3} ${x + candleWidth / 2 + 3},${bodyTop - 3} ${x + candleWidth / 2},${bodyTop}`}
                    fill={isGreen ? "#66ffaa" : "#ff6666"}
                    opacity="0.8"
                  />

                  <polygon
                    points={`${x + candleWidth / 2},${bodyTop} ${x + candleWidth / 2 + 3},${bodyTop - 3} ${x + candleWidth / 2 + 3},${bodyBottom - 3} ${x + candleWidth / 2},${bodyBottom}`}
                    fill={isGreen ? "#44dd88" : "#dd4444"}
                    opacity="0.6"
                  />
                </g>
              );
            })}

            {showIndicators.sma && visibleIndicators.length > 0 && (
              <g>
                <path
                  d={`M ${visibleIndicators.map((ind, i) => 
                    `${i * (candleWidth + candleSpacing) + candleWidth / 2},${scaleY(ind.sma20)}`
                  ).join(' L ')}`}
                  fill="none"
                  stroke="#00aaff"
                  strokeWidth="3"
                  opacity="0.8"
                  filter="url(#neonGlow)"
                />
                <path
                  d={`M ${visibleIndicators.map((ind, i) => 
                    `${i * (candleWidth + candleSpacing) + candleWidth / 2},${scaleY(ind.sma50)}`
                  ).join(' L ')}`}
                  fill="none"
                  stroke="#0066cc"
                  strokeWidth="3"
                  opacity="0.8"
                  filter="url(#neonGlow)"
                />
              </g>
            )}

            {showIndicators.ema && visibleIndicators.length > 0 && (
              <g>
                <path
                  d={`M ${visibleIndicators.map((ind, i) => 
                    `${i * (candleWidth + candleSpacing) + candleWidth / 2},${scaleY(ind.ema12)}`
                  ).join(' L ')}`}
                  fill="none"
                  stroke="#00ff66"
                  strokeWidth="3"
                  opacity="0.8"
                  filter="url(#neonGlow)"
                />
                <path
                  d={`M ${visibleIndicators.map((ind, i) => 
                    `${i * (candleWidth + candleSpacing) + candleWidth / 2},${scaleY(ind.ema26)}`
                  ).join(' L ')}`}
                  fill="none"
                  stroke="#00cc44"
                  strokeWidth="3"
                  opacity="0.8"
                  filter="url(#neonGlow)"
                />
              </g>
            )}
          </svg>
        </div>

      </div>

      <div className="bg-black/90 backdrop-blur-sm px-4 sm:px-6 py-3 border-t border-cyan-500/30 relative z-1">
        <div className="flex justify-between items-center text-xs">
          <div className="text-cyan-400 font-mono">
            {translations.volume} <span className="text-white font-bold">{Math.round(visibleCandles[visibleCandles.length - 1]?.volume || 0).toLocaleString()}</span>
          </div>
          {visibleIndicators.length > 0 && (
            <div className="flex gap-6 text-xs font-mono">
              <span className="text-orange-400">RSI: <span className="text-white font-bold">{visibleIndicators[visibleIndicators.length - 1]?.rsi.toFixed(1)}</span></span>
              <span className="text-blue-400">SMA20: <span className="text-white font-bold">{visibleIndicators[visibleIndicators.length - 1]?.sma20.toFixed(5)}</span></span>
              <span className="text-green-400">EMA12: <span className="text-white font-bold">{visibleIndicators[visibleIndicators.length - 1]?.ema12.toFixed(5)}</span></span>
            </div>
          )}
          <div className="flex items-center gap-2">
          </div>
        </div>
      </div>
    </div>
  );
};