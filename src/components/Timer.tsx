import React, { useState, useEffect } from 'react';
import { useLanguage } from '../hooks/useLanguage';
import { Clock, Target, Users, Calendar } from 'lucide-react';

interface TimerProps {
  onTimerEnd: () => void;
  onTimerUpdate: (data: { timeLeft: number; maxTime: number }) => void;
}

export const Timer: React.FC<TimerProps> = ({ onTimerEnd, onTimerUpdate }) => {
  const { t } = useLanguage();
  const [timeLeft, setTimeLeft] = useState(0);
  const [milliseconds, setMilliseconds] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(true);
  const [showEntryPoint, setShowEntryPoint] = useState(false);
  const [waitingUsers, setWaitingUsers] = useState(1247);
  const [isWaitingSignal, setIsWaitingSignal] = useState(false);
  const [nextSignalTime, setNextSignalTime] = useState('');
  const [isButtonFading, setIsButtonFading] = useState(false);

  const getNextSignalTime = () => {
    const now = new Date();
    const moscowOffset = 3;
    const moscowTime = new Date(now.getTime() + (moscowOffset * 60 * 60 * 1000));
    
    const signalTimes = [11, 16, 21];
    const currentHour = moscowTime.getUTCHours();
    const currentMinute = moscowTime.getUTCMinutes();
    const currentSecond = moscowTime.getUTCSeconds();
    
    let nextHour = null;
    for (const hour of signalTimes) {
      if (hour > currentHour || (hour === currentHour && currentMinute === 0 && currentSecond === 0)) {
        nextHour = hour;
        break;
      }
    }
    
    if (nextHour === null) {
      nextHour = signalTimes[0];
      moscowTime.setUTCDate(moscowTime.getUTCDate() + 1);
    }
    
    const nextSignal = new Date(moscowTime);
    nextSignal.setUTCHours(nextHour, 0, 0, 0);
    
    return nextSignal;
  };

  const calculateTimeLeft = () => {
    const now = new Date();
    const nextSignal = getNextSignalTime();
    const difference = nextSignal.getTime() - now.getTime();
    
    if (difference > 0) {
      const hours = Math.floor(difference / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);
      
      const totalSeconds = hours * 3600 + minutes * 60 + seconds;
      setTimeLeft(totalSeconds);
      
      const signalHour = nextSignal.getUTCHours();
      setNextSignalTime(`${signalHour}:00`);
      
      const maxTimeToSignal = 10 * 60 * 60;
      onTimerUpdate({ timeLeft: totalSeconds, maxTime: maxTimeToSignal });
      
      return totalSeconds;
    }
    
    return 0;
  };

  useEffect(() => {
    calculateTimeLeft();
  }, []);

  useEffect(() => {
    const msTimer = setInterval(() => {
      setMilliseconds(prev => (prev + 1) % 100);
    }, 10);

    const timer = setInterval(() => {
      const newTimeLeft = calculateTimeLeft();
      
      if (newTimeLeft <= 1) {
        setIsAnalyzing(false);
        setShowEntryPoint(true);
        onTimerEnd();
        
        setTimeout(() => {
          setShowEntryPoint(false);
          setIsAnalyzing(false);
          setIsAnalyzing(true);
          calculateTimeLeft();
        }, 3000);
      }
      
      setWaitingUsers(prev => {
        const change = Math.floor((Math.random() - 0.5) * 50);
        const newCount = Math.max(100, Math.min(5000, prev + change));
        return newCount;
      });
    }, 1000);

    return () => {
      clearInterval(timer);
      clearInterval(msTimer);
    };
  }, [onTimerEnd]);

  const handleWaitSignal = () => {
    setIsButtonFading(true);
    
    setTimeout(() => {
      setIsWaitingSignal(!isWaitingSignal);
      if (!isWaitingSignal) {
        setWaitingUsers(prev => prev + 1);
      } else {
        setWaitingUsers(prev => Math.max(100, prev - 1));
      }
      setIsButtonFading(false);
    }, 300);
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return { hours, mins, secs };
  };

  const { hours, mins, secs } = formatTime(timeLeft);
  
  const maxTimeToSignal = 10 * 60 * 60;
  const progress = timeLeft > 0 ? ((maxTimeToSignal - timeLeft) / maxTimeToSignal) * 100 : 0;

  return (
    <div className="h-full flex flex-col justify-between">
      <div className="flex items-center justify-center mb-3">
        <h3 className="text-sm font-bold text-white flex items-center gap-1">
          <Clock className="w-5 h-5 text-blue-400" />
          {t.nextSignal} {nextSignalTime}
        </h3>
      </div>
      
      <div className="mb-3">
        <button
          onClick={handleWaitSignal}
          className={`w-full px-2 py-1 rounded text-xs font-bold transition-all duration-300 ${
            isButtonFading ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
          } ${
            isWaitingSignal
              ? 'bg-gradient-to-r from-green-500 to-green-400 hover:from-green-600 hover:to-green-500 text-white'
              : 'bg-gradient-to-r from-blue-500 to-white hover:from-blue-600 hover:to-gray-100 text-blue-900'
          }`}
        >
          {isWaitingSignal ? t.waitingSignal : t.waitSignal}
        </button>
        
        <div className="flex items-center justify-center gap-1 mt-1">
          <Users className="w-2 h-2 text-gray-400" />
          <span className="text-gray-400 text-xs">{waitingUsers.toLocaleString()}</span>
        </div>
      </div>
      
      <div className="bg-gradient-to-br from-purple-900/70 via-blue-900/70 to-cyan-900/70 backdrop-blur-sm rounded-t p-2 mb-0 border border-purple-400/50 border-b-0 shadow-inner">
        <div className="flex items-center gap-1 mb-1">
          <Calendar className="w-3 h-3 text-blue-400" />
          <span className="text-xs text-cyan-300 font-semibold">{t.signalSchedule}</span>
        </div>
        
        <div className="mb-2">
          <div className="text-center mb-1">
            <span className="text-xs text-white">{t.russia}</span>
          </div>
          <div className="grid grid-cols-3 gap-1 text-center mb-1">
            <div className={`rounded px-1 py-0.5 ${nextSignalTime === '11:00' ? 'bg-gradient-to-r from-purple-600 to-blue-600 shadow-lg shadow-purple-500/50' : 'bg-gradient-to-r from-gray-800/80 to-gray-700/80'}`}>
              <div className="text-xs font-bold text-white">11:00</div>
            </div>
            <div className={`rounded px-1 py-0.5 ${nextSignalTime === '16:00' ? 'bg-gradient-to-r from-purple-600 to-blue-600 shadow-lg shadow-purple-500/50' : 'bg-gradient-to-r from-gray-800/80 to-gray-700/80'}`}>
              <div className="text-xs font-bold text-white">16:00</div>
            </div>
            <div className={`rounded px-1 py-0.5 ${nextSignalTime === '21:00' ? 'bg-gradient-to-r from-purple-600 to-blue-600 shadow-lg shadow-purple-500/50' : 'bg-gradient-to-r from-gray-800/80 to-gray-700/80'}`}>
              <div className="text-xs font-bold text-white">21:00</div>
            </div>
          </div>
        </div>
        
        <div>
          <div className="text-center mb-1">
            <span className="text-xs text-white">{t.kazakhstan}</span>
          </div>
          <div className="grid grid-cols-3 gap-1 text-center">
            <div className={`rounded px-1 py-0.5 ${nextSignalTime === '11:00' ? 'bg-gradient-to-r from-purple-600 to-blue-600 shadow-lg shadow-purple-500/50' : 'bg-gradient-to-r from-gray-800/80 to-gray-700/80'}`}>
              <div className="text-xs font-bold text-white">13:30</div>
            </div>
            <div className={`rounded px-1 py-0.5 ${nextSignalTime === '16:00' ? 'bg-gradient-to-r from-purple-600 to-blue-600 shadow-lg shadow-purple-500/50' : 'bg-gradient-to-r from-gray-800/80 to-gray-700/80'}`}>
              <div className="text-xs font-bold text-white">18:30</div>
            </div>
            <div className={`rounded px-1 py-0.5 ${nextSignalTime === '21:00' ? 'bg-gradient-to-r from-purple-600 to-blue-600 shadow-lg shadow-purple-500/50' : 'bg-gradient-to-r from-gray-800/80 to-gray-700/80'}`}>
              <div className="text-xs font-bold text-white">23:30</div>
            </div>
          </div>
        </div>
        
        <div className="mb-2">
          <div className="text-center mb-1">
            <span className="text-xs text-white">{t.uzbekistan}</span>
          </div>
          <div className="grid grid-cols-3 gap-1 text-center">
            <div className={`rounded px-1 py-0.5 ${nextSignalTime === '11:00' ? 'bg-gradient-to-r from-purple-600 to-blue-600 shadow-lg shadow-purple-500/50' : 'bg-gradient-to-r from-gray-800/80 to-gray-700/80'}`}>
              <div className="text-xs font-bold text-white">05:00</div>
            </div>
            <div className={`rounded px-1 py-0.5 ${nextSignalTime === '16:00' ? 'bg-gradient-to-r from-purple-600 to-blue-600 shadow-lg shadow-purple-500/50' : 'bg-gradient-to-r from-gray-800/80 to-gray-700/80'}`}>
              <div className="text-xs font-bold text-white">10:00</div>
            </div>
            <div className={`rounded px-1 py-0.5 ${nextSignalTime === '21:00' ? 'bg-gradient-to-r from-purple-600 to-blue-600 shadow-lg shadow-purple-500/50' : 'bg-gradient-to-r from-gray-800/80 to-gray-700/80'}`}>
              <div className="text-xs font-bold text-white">15:00</div>
            </div>
          </div>
        </div>
        
        <div>
          <div className="text-center mb-1">
            <span className="text-xs text-white">{t.kyrgyzstan}</span>
          </div>
          <div className="grid grid-cols-3 gap-1 text-center">
            <div className={`rounded px-1 py-0.5 ${nextSignalTime === '11:00' ? 'bg-gradient-to-r from-purple-600 to-blue-600 shadow-lg shadow-purple-500/50' : 'bg-gradient-to-r from-gray-800/80 to-gray-700/80'}`}>
              <div className="text-xs font-bold text-white">08:00</div>
            </div>
            <div className={`rounded px-1 py-0.5 ${nextSignalTime === '16:00' ? 'bg-gradient-to-r from-purple-600 to-blue-600 shadow-lg shadow-purple-500/50' : 'bg-gradient-to-r from-gray-800/80 to-gray-700/80'}`}>
              <div className="text-xs font-bold text-white">13:00</div>
            </div>
            <div className={`rounded px-1 py-0.5 ${nextSignalTime === '21:00' ? 'bg-gradient-to-r from-purple-600 to-blue-600 shadow-lg shadow-purple-500/50' : 'bg-gradient-to-r from-gray-800/80 to-gray-700/80'}`}>
              <div className="text-xs font-bold text-white">18:00</div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-gradient-to-br from-purple-900/70 via-blue-900/70 to-cyan-900/70 backdrop-blur-sm rounded-b p-2 border border-purple-400/50 border-t-0 shadow-inner">
        <div className="bg-gradient-to-br from-black/80 via-purple-900/40 to-blue-900/40 backdrop-blur-sm rounded p-2 mb-2 border border-purple-500/50 shadow-inner">
          <div className="flex items-center justify-center">
            {hours > 0 && (
              <>
                <div className="flex">
                  <div className="digital-digit">
                    {Math.floor(hours / 10)}
                  </div>
                  <div className="digital-digit">
                    {hours % 10}
                  </div>
                </div>
                
                <div className="digital-separator">:</div>
              </>
            )}
            
            <div className="flex">
              <div className="digital-digit">
                {Math.floor(mins / 10)}
              </div>
              <div className="digital-digit">
                {mins % 10}
              </div>
            </div>
            
            <div className="digital-separator">:</div>
            
            <div className="flex">
              <div className="digital-digit">
                {Math.floor(secs / 10)}
              </div>
              <div className="digital-digit">
                {secs % 10}
              </div>
            </div>
            
            <div className="digital-separator">.</div>
            <div className="flex">
              <div className="digital-digit-small">
                {Math.floor(milliseconds / 10)}
              </div>
              <div className="digital-digit-small">
                {milliseconds % 10}
              </div>
            </div>
          </div>
        </div>
        
        <div className="min-h-[20px] flex items-center justify-center">
          {showEntryPoint ? (
            <div className="bg-gradient-to-r from-green-600/80 to-emerald-600/80 backdrop-blur-sm px-2 py-0.5 rounded border border-green-400/60 w-full shadow-lg shadow-green-500/30">
              <div className="flex items-center justify-center gap-2 text-white">
                <Target className="w-3 h-3 animate-pulse" />
                <span className="text-xs font-bold text-center">{t.entryPoint}</span>
              </div>
            </div>
          ) : null}
        </div>
      </div>
      

      <style jsx>{`
        .digital-digit {
          font-family: 'Courier New', monospace;
          font-size: 1.5rem;
          font-weight: bold;
          color: #60A5FA;
          text-shadow: 0 0 10px #60A5FA;
          background: linear-gradient(135deg, #1E3A8A 0%, #3B82F6 50%, #60A5FA 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          width: 1.5rem;
          text-align: center;
          display: inline-block;
          position: relative;
        }
        
        .digital-digit::before {
          content: '8';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          color: #1F2937;
          opacity: 0.1;
          z-index: -1;
        }
        
        .digital-digit-small {
          font-family: 'Courier New', monospace;
          font-size: 1.2rem;
          font-weight: bold;
          color: #60A5FA;
          text-shadow: 0 0 8px #60A5FA;
          background: linear-gradient(135deg, #1E3A8A 0%, #3B82F6 50%, #60A5FA 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          width: 1.2rem;
          text-align: center;
          display: inline-block;
          position: relative;
        }
        
        .digital-digit-small::before {
          content: '8';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          color: #1F2937;
          opacity: 0.1;
          z-index: -1;
        }
        
        .digital-separator {
          font-family: 'Courier New', monospace;
          font-size: 1.5rem;
          font-weight: bold;
          color: #60A5FA;
          text-shadow: 0 0 10px #60A5FA;
          margin: 0 0.2rem;
          animation: blink 1s infinite;
        }
        
        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0.3; }
        }
      `}</style>
    </div>
  );
};