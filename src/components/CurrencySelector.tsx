import React, { useState } from 'react';
import { ChevronDown, Flame } from 'lucide-react';

interface CurrencySelectorProps {
  selectedPair: string;
  onPairChange: (pair: string) => void;
  hasRecommendation?: boolean;
  recommendedPair?: string;
}

export const CurrencySelector: React.FC<CurrencySelectorProps> = ({
  selectedPair,
  onPairChange,
  hasRecommendation = false,
  recommendedPair = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const currencyPairs = [
    { pair: 'EUR/USD', flags: ['🇪🇺', '🇺🇸'], symbols: ['€', '$'], codes: ['EUR', 'USD'] },
    { pair: 'GBP/USD', flags: ['🇬🇧', '🇺🇸'], symbols: ['£', '$'], codes: ['GBP', 'USD'] },
    { pair: 'USD/JPY', flags: ['🇺🇸', '🇯🇵'], symbols: ['$', '¥'], codes: ['USD', 'JPY'] },
    { pair: 'AUD/USD', flags: ['🇦🇺', '🇺🇸'], symbols: ['A$', '$'], codes: ['AUD', 'USD'] },
    { pair: 'USD/CAD', flags: ['🇺🇸', '🇨🇦'], symbols: ['$', 'C$'], codes: ['USD', 'CAD'] },
    { pair: 'USD/CHF', flags: ['🇺🇸', '🇨🇭'], symbols: ['$', 'Fr'], codes: ['USD', 'CHF'] },
    { pair: 'NZD/USD', flags: ['🇳🇿', '🇺🇸'], symbols: ['NZ$', '$'], codes: ['NZD', 'USD'] },
    { pair: 'EUR/GBP', flags: ['🇪🇺', '🇬🇧'], symbols: ['€', '£'], codes: ['EUR', 'GBP'] },
    { pair: 'EUR/JPY', flags: ['🇪🇺', '🇯🇵'], symbols: ['€', '¥'], codes: ['EUR', 'JPY'] },
    { pair: 'GBP/JPY', flags: ['🇬🇧', '🇯🇵'], symbols: ['£', '¥'], codes: ['GBP', 'JPY'] },
    { pair: 'AUD/JPY', flags: ['🇦🇺', '🇯🇵'], symbols: ['A$', '¥'], codes: ['AUD', 'JPY'] },
    { pair: 'CAD/JPY', flags: ['🇨🇦', '🇯🇵'], symbols: ['C$', '¥'], codes: ['CAD', 'JPY'] },
    { pair: 'EUR/USD-OTC', flags: ['🇪🇺', '🇺🇸'], symbols: ['€', '$'], codes: ['EUR', 'USD-OTC'] },
    { pair: 'GBP/USD-OTC', flags: ['🇬🇧', '🇺🇸'], symbols: ['£', '$'], codes: ['GBP', 'USD-OTC'] },
    { pair: 'USD/JPY-OTC', flags: ['🇺🇸', '🇯🇵'], symbols: ['$', '¥'], codes: ['USD', 'JPY-OTC'] },
    { pair: 'AUD/USD-OTC', flags: ['🇦🇺', '🇺🇸'], symbols: ['A$', '$'], codes: ['AUD', 'USD-OTC'] },
    { pair: 'USD/CAD-OTC', flags: ['🇺🇸', '🇨🇦'], symbols: ['$', 'C$'], codes: ['USD', 'CAD-OTC'] },
    { pair: 'USD/CHF-OTC', flags: ['🇺🇸', '🇨🇭'], symbols: ['$', 'Fr'], codes: ['USD', 'CHF-OTC'] },
    { pair: 'NZD/USD-OTC', flags: ['🇳🇿', '🇺🇸'], symbols: ['NZ$', '$'], codes: ['NZD', 'USD-OTC'] },
    { pair: 'EUR/GBP-OTC', flags: ['🇪🇺', '🇬🇧'], symbols: ['€', '£'], codes: ['EUR', 'GBP-OTC'] }
  ];

  const selectedPairData = currencyPairs.find(p => p.pair === selectedPair) || currencyPairs[0];

  const handlePairSelect = (pair: string) => {
    onPairChange(pair);
    setIsOpen(false);
  };

  return (
    <div className={`bg-gradient-to-br from-purple-800/60 via-blue-800/60 to-cyan-800/60 backdrop-blur-sm rounded-lg p-2 border ${hasRecommendation ? 'border-orange-400/80 shadow-lg shadow-orange-500/30' : 'border-purple-400/50'} relative shadow-lg`}>
      {hasRecommendation && (
        <div className="absolute -top-2 -right-2 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full p-1 shadow-lg shadow-orange-500/50">
          <Flame className="w-3 h-3 text-white animate-pulse" />
        </div>
      )}
      
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full bg-gradient-to-br from-purple-800/80 via-blue-800/80 to-cyan-800/80 backdrop-blur-sm border border-purple-400/60 rounded-lg px-3 py-2 focus:border-cyan-400 focus:outline-none transition-colors duration-200 font-semibold text-white cursor-pointer hover:border-cyan-300 text-sm flex items-center justify-between shadow-inner"
        >
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <div className="w-14 h-8 overflow-hidden flex items-center justify-center text-lg -mr-4">
                {selectedPairData.flags[0]}
              </div>
              <div className="w-14 h-8 overflow-hidden flex items-center justify-center text-lg">
                {selectedPairData.flags[1]}
              </div>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-yellow-400 font-bold text-lg">
                {selectedPairData.symbols[0]}
              </span>
              <span className="text-blue-400 font-bold text-base">
                {selectedPairData.codes[0]}
              </span>
              <span className="text-gray-400 font-bold">/</span>
              <span className="text-yellow-400 font-bold text-lg">
                {selectedPairData.symbols[1]}
              </span>
              <span className="text-blue-400 font-bold text-base">
                {selectedPairData.codes[1]}
              </span>
            </div>
            {hasRecommendation && recommendedPair === selectedPair && (
              <Flame className="w-3 h-3 text-orange-500 animate-pulse" />
            )}
          </div>
          <ChevronDown className={`w-3 h-3 text-blue-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>
        
        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-gradient-to-br from-purple-900/90 via-blue-900/90 to-cyan-900/90 backdrop-blur-md border border-purple-400/60 rounded-lg shadow-2xl shadow-purple-500/30 z-50 max-h-60 overflow-y-auto">
            {currencyPairs.map(({ pair, flags, symbols, codes }) => (
              <button
                key={pair}
                onClick={() => handlePairSelect(pair)} 
                className={`w-full px-3 py-2 text-left hover:bg-gradient-to-r hover:from-purple-700/60 hover:to-blue-700/60 transition-colors flex items-center gap-2 ${
                  pair === selectedPair ? 'bg-gradient-to-r from-purple-700/60 to-blue-700/60' : ''
                }`}
              >
                <div className="flex items-center gap-2 flex-shrink-0"> 
                  <div className="w-14 h-8 overflow-hidden flex items-center justify-center text-base -mr-4">
                    {flags[0]}
                  </div>
                  <div className="w-14 h-8 overflow-hidden flex items-center justify-center text-base">
                    {flags[1]}
                  </div>
                </div>
                <div className="flex items-center gap-1 flex-1">
                  <span className="text-yellow-400 font-bold text-lg">
                    {symbols[0]}
                  </span>
                  <span className="text-blue-400 font-bold text-base">
                    {codes[0]}
                  </span>
                  <span className="text-gray-400 font-bold">/</span>
                  <span className="text-yellow-400 font-bold text-lg">
                    {symbols[1]}
                  </span>
                  <span className="text-blue-400 font-bold text-base">
                    {codes[1]}
                  </span>
                </div>
                {hasRecommendation && recommendedPair === pair && (
                  <Flame className="w-3 h-3 text-orange-500 animate-pulse flex-shrink-0" />
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};