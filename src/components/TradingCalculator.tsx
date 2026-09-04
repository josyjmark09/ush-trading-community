import React, { useState, useMemo } from 'react';
import { 
  Calculator, 
  DollarSign, 
  TrendingUp, 
  Percent, 
  ShieldAlert, 
  Check, 
  Copy, 
  RotateCcw, 
  ArrowRight, 
  Info,
  Scale,
  Zap
} from 'lucide-react';

type CalculatorTab = 'position' | 'pip' | 'pnl' | 'margin';

interface InstrumentInfo {
  symbol: string;
  name: string;
  category: 'forex' | 'metal' | 'crypto' | 'index';
  contractSize: number;
  pipSize: number;
  standardPrice: number;
  pipDecimals: number;
}

const INSTRUMENTS: InstrumentInfo[] = [
  { symbol: 'EUR/USD', name: 'Euro / US Dollar', category: 'forex', contractSize: 100000, pipSize: 0.0001, standardPrice: 1.0850, pipDecimals: 4 },
  { symbol: 'GBP/USD', name: 'British Pound / US Dollar', category: 'forex', contractSize: 100000, pipSize: 0.0001, standardPrice: 1.2980, pipDecimals: 4 },
  { symbol: 'USD/JPY', name: 'US Dollar / Japanese Yen', category: 'forex', contractSize: 100000, pipSize: 0.01, standardPrice: 154.20, pipDecimals: 2 },
  { symbol: 'USD/CAD', name: 'US Dollar / Canadian Dollar', category: 'forex', contractSize: 100000, pipSize: 0.0001, standardPrice: 1.3920, pipDecimals: 4 },
  { symbol: 'AUD/USD', name: 'Australian Dollar / US Dollar', category: 'forex', contractSize: 100000, pipSize: 0.0001, standardPrice: 0.6550, pipDecimals: 4 },
  { symbol: 'USD/CHF', name: 'US Dollar / Swiss Franc', category: 'forex', contractSize: 100000, pipSize: 0.0001, standardPrice: 0.8840, pipDecimals: 4 },
  { symbol: 'NZD/USD', name: 'New Zealand Dollar / US Dollar', category: 'forex', contractSize: 100000, pipSize: 0.0001, standardPrice: 0.5890, pipDecimals: 4 },
  { symbol: 'EUR/GBP', name: 'Euro / British Pound', category: 'forex', contractSize: 100000, pipSize: 0.0001, standardPrice: 0.8350, pipDecimals: 4 },
  { symbol: 'GBP/JPY', name: 'British Pound / Japanese Yen', category: 'forex', contractSize: 100000, pipSize: 0.01, standardPrice: 200.15, pipDecimals: 2 },
  { symbol: 'XAU/USD', name: 'Gold / US Dollar', category: 'metal', contractSize: 100, pipSize: 0.10, standardPrice: 2650.00, pipDecimals: 2 },
  { symbol: 'BTC/USD', name: 'Bitcoin / US Dollar', category: 'crypto', contractSize: 1, pipSize: 1.0, standardPrice: 92500.00, pipDecimals: 2 },
  { symbol: 'US30', name: 'Dow Jones 30 Index', category: 'index', contractSize: 1, pipSize: 1.0, standardPrice: 43800.00, pipDecimals: 1 },
];

export const TradingCalculator: React.FC = () => {
  const [activeTab, setActiveTab] = useState<CalculatorTab>('position');
  const [copied, setCopied] = useState(false);

  // Common State
  const [selectedSymbol, setSelectedSymbol] = useState<string>('EUR/USD');
  const [accountCurrency, setAccountCurrency] = useState<string>('USD');

  // Position Size State
  const [accountBalance, setAccountBalance] = useState<number>(10000);
  const [riskType, setRiskType] = useState<'percent' | 'fixed'>('percent');
  const [riskPercent, setRiskPercent] = useState<number>(1.0);
  const [riskAmount, setRiskAmount] = useState<number>(100);
  const [stopLossPips, setStopLossPips] = useState<number>(20);

  // Pip Calculator State
  const [pipLotSize, setPipLotSize] = useState<number>(1.0);

  // P&L State
  const [orderType, setOrderType] = useState<'buy' | 'sell'>('buy');
  const [pnlLots, setPnlLots] = useState<number>(1.0);
  const [entryPrice, setEntryPrice] = useState<number>(1.0850);
  const [exitPrice, setExitPrice] = useState<number>(1.0900);

  // Margin State
  const [marginLots, setMarginLots] = useState<number>(1.0);
  const [leverage, setLeverage] = useState<number>(500);

  const instrument = useMemo(() => {
    return INSTRUMENTS.find((i) => i.symbol === selectedSymbol) || INSTRUMENTS[0];
  }, [selectedSymbol]);

  // Handle instrument change
  const handleInstrumentChange = (symbol: string) => {
    setSelectedSymbol(symbol);
    const found = INSTRUMENTS.find((i) => i.symbol === symbol);
    if (found) {
      setEntryPrice(found.standardPrice);
      if (found.category === 'forex') {
        setExitPrice(Number((found.standardPrice + found.pipSize * 50).toFixed(found.pipDecimals)));
      } else if (found.category === 'metal') {
        setExitPrice(Number((found.standardPrice + 10.0).toFixed(2)));
      } else {
        setExitPrice(Number((found.standardPrice + 200).toFixed(2)));
      }
    }
  };

  // Calculations for Position Size
  const calculatedRiskMoney = useMemo(() => {
    if (riskType === 'percent') {
      return (accountBalance * riskPercent) / 100;
    }
    return riskAmount;
  }, [accountBalance, riskType, riskPercent, riskAmount]);

  const positionResults = useMemo(() => {
    if (stopLossPips <= 0 || calculatedRiskMoney <= 0) {
      return { lots: 0, miniLots: 0, microLots: 0, units: 0, pipValuePerLot: 0 };
    }

    // Value of 1 pip for 1 standard lot
    let pipValuePerLot = 10; // default for EUR/USD with USD account
    if (instrument.symbol === 'USD/JPY') {
      pipValuePerLot = (0.01 / instrument.standardPrice) * instrument.contractSize;
    } else if (instrument.symbol === 'XAU/USD') {
      pipValuePerLot = instrument.contractSize * instrument.pipSize; // 100 * 0.10 = $10
    } else if (instrument.symbol === 'BTC/USD' || instrument.symbol === 'US30') {
      pipValuePerLot = instrument.contractSize * instrument.pipSize; // $1
    } else {
      pipValuePerLot = instrument.contractSize * instrument.pipSize; // $10 for standard majors
    }

    const totalPipValueRequired = calculatedRiskMoney / stopLossPips;
    const rawLots = totalPipValueRequired / pipValuePerLot;
    const lots = Math.max(0.01, Math.floor(rawLots * 100) / 100);
    const units = Math.round(lots * instrument.contractSize);

    return {
      lots: Number(lots.toFixed(2)),
      miniLots: Number((lots * 10).toFixed(1)),
      microLots: Number((lots * 100).toFixed(0)),
      units,
      pipValuePerLot: Number(pipValuePerLot.toFixed(2)),
    };
  }, [calculatedRiskMoney, stopLossPips, instrument]);

  // Calculations for Pip Value
  const pipValueResults = useMemo(() => {
    let basePipVal = 10;
    if (instrument.symbol === 'USD/JPY') {
      basePipVal = (0.01 / instrument.standardPrice) * instrument.contractSize;
    } else if (instrument.symbol === 'XAU/USD') {
      basePipVal = instrument.contractSize * instrument.pipSize;
    } else if (instrument.symbol === 'BTC/USD' || instrument.symbol === 'US30') {
      basePipVal = instrument.contractSize * instrument.pipSize;
    } else {
      basePipVal = instrument.contractSize * instrument.pipSize;
    }

    const valueForTrade = basePipVal * pipLotSize;
    return {
      pipValue: Number(valueForTrade.toFixed(2)),
      tenPips: Number((valueForTrade * 10).toFixed(2)),
      fiftyPips: Number((valueForTrade * 50).toFixed(2)),
      hundredPips: Number((valueForTrade * 100).toFixed(2)),
    };
  }, [instrument, pipLotSize]);

  // Calculations for P&L
  const pnlResults = useMemo(() => {
    const priceDiff = orderType === 'buy' ? exitPrice - entryPrice : entryPrice - exitPrice;
    const pips = priceDiff / instrument.pipSize;
    
    let pipValPerLot = 10;
    if (instrument.symbol === 'USD/JPY') {
      pipValPerLot = (0.01 / exitPrice) * instrument.contractSize;
    } else if (instrument.symbol === 'XAU/USD') {
      pipValPerLot = instrument.contractSize * instrument.pipSize;
    } else if (instrument.symbol === 'BTC/USD' || instrument.symbol === 'US30') {
      pipValPerLot = instrument.contractSize * instrument.pipSize;
    } else {
      pipValPerLot = instrument.contractSize * instrument.pipSize;
    }

    const totalProfit = pips * pipValPerLot * pnlLots;
    const notionalValue = entryPrice * instrument.contractSize * pnlLots;
    const roi = notionalValue > 0 ? (totalProfit / notionalValue) * 100 : 0;

    return {
      pips: Number(pips.toFixed(1)),
      profit: Number(totalProfit.toFixed(2)),
      isProfit: totalProfit >= 0,
      roi: Number(roi.toFixed(2)),
    };
  }, [orderType, entryPrice, exitPrice, instrument, pnlLots]);

  // Calculations for Margin
  const marginResults = useMemo(() => {
    const notional = marginLots * instrument.contractSize * instrument.standardPrice;
    const requiredMargin = notional / leverage;
    return {
      notional: Number(notional.toFixed(2)),
      requiredMargin: Number(requiredMargin.toFixed(2)),
      leverageRatio: `1:${leverage}`,
    };
  }, [marginLots, instrument, leverage]);

  const handleCopySummary = () => {
    let text = '';
    if (activeTab === 'position') {
      text = `USH Community of Traders Calculator - Position Size:
Pair: ${selectedSymbol}
Account Balance: $${accountBalance.toLocaleString()}
Risk: ${riskType === 'percent' ? `${riskPercent}% ($${calculatedRiskMoney.toFixed(2)})` : `$${riskAmount}`}
Stop Loss: ${stopLossPips} pips
Recommended Lots: ${positionResults.lots} Lots (${positionResults.units.toLocaleString()} units)`;
    } else if (activeTab === 'pip') {
      text = `USH Community of Traders Pip Value Calculator:
Pair: ${selectedSymbol}
Trade Size: ${pipLotSize} Lots
1 Pip Value: $${pipValueResults.pipValue}
50 Pips: $${pipValueResults.fiftyPips}`;
    } else if (activeTab === 'pnl') {
      text = `USH Community of Traders Trade P&L:
Pair: ${selectedSymbol} (${orderType.toUpperCase()})
Lots: ${pnlLots}
Entry: ${entryPrice} | Exit: ${exitPrice}
Result: ${pnlResults.pips} pips | ${pnlResults.isProfit ? '+' : ''}$${pnlResults.profit.toLocaleString()}`;
    } else {
      text = `USH Community of Traders Margin Calculator:
Pair: ${selectedSymbol}
Lots: ${marginLots} | Leverage: 1:${leverage}
Required Margin: $${marginResults.requiredMargin.toLocaleString()}`;
    }

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    setAccountBalance(10000);
    setRiskType('percent');
    setRiskPercent(1.0);
    setStopLossPips(20);
    setPipLotSize(1.0);
    setPnlLots(1.0);
    setMarginLots(1.0);
    setLeverage(500);
    handleInstrumentChange('EUR/USD');
  };

  return (
    <section 
      id="calculator"
      className="relative w-full max-w-[1200px] mx-auto px-3 sm:px-4 py-8 sm:py-12 scroll-mt-24 overflow-hidden"
    >
      {/* Header */}
      <div className="text-center mb-6 sm:mb-8 space-y-1">
        <span className="text-[#0053CF] font-inter text-[11px] sm:text-[12.5px] font-extrabold uppercase tracking-wider block">
          INSTITUTIONAL RISK MANAGEMENT
        </span>
        <h2 className="font-manrope text-[24px] sm:text-[32px] md:text-[36px] font-black text-slate-900 leading-tight">
          Professional Forex Trading Calculator
        </h2>
        <p className="font-inter text-[13.5px] sm:text-[15px] text-slate-600 max-w-xl mx-auto px-1">
          Calculate precise position sizing, pip value, margin requirements, and risk-reward to execute with disciplined risk management.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-300 shadow-sm overflow-hidden">
        {/* Navigation Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 border-b border-slate-200 bg-slate-50/80 p-1.5 gap-1.5">
          <button
            onClick={() => setActiveTab('position')}
            className={`flex items-center justify-center gap-1.5 sm:gap-2 py-2 sm:py-2.5 px-2 sm:px-3 rounded-xl font-manrope text-[12px] sm:text-[14px] font-bold transition-all cursor-pointer ${
              activeTab === 'position'
                ? 'bg-white text-[#0053CF] shadow-xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            <Calculator className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#0053CF] shrink-0" />
            <span className="truncate">Position Size</span>
          </button>

          <button
            onClick={() => setActiveTab('pip')}
            className={`flex items-center justify-center gap-1.5 sm:gap-2 py-2 sm:py-2.5 px-2 sm:px-3 rounded-xl font-manrope text-[12px] sm:text-[14px] font-bold transition-all cursor-pointer ${
              activeTab === 'pip'
                ? 'bg-white text-[#0053CF] shadow-xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            <DollarSign className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#0053CF] shrink-0" />
            <span className="truncate">Pip Value</span>
          </button>

          <button
            onClick={() => setActiveTab('pnl')}
            className={`flex items-center justify-center gap-1.5 sm:gap-2 py-2 sm:py-2.5 px-2 sm:px-3 rounded-xl font-manrope text-[12px] sm:text-[14px] font-bold transition-all cursor-pointer ${
              activeTab === 'pnl'
                ? 'bg-white text-[#0053CF] shadow-xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#0053CF] shrink-0" />
            <span className="truncate">Profit & Loss</span>
          </button>

          <button
            onClick={() => setActiveTab('margin')}
            className={`flex items-center justify-center gap-1.5 sm:gap-2 py-2 sm:py-2.5 px-2 sm:px-3 rounded-xl font-manrope text-[12px] sm:text-[14px] font-bold transition-all cursor-pointer ${
              activeTab === 'margin'
                ? 'bg-white text-[#0053CF] shadow-xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            <Scale className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#0053CF] shrink-0" />
            <span className="truncate">Margin & Lev</span>
          </button>
        </div>

        {/* Calculator Body */}
        <div className="p-3.5 sm:p-6 md:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-8 items-start">
            
            {/* Input Controls (Left Column) */}
            <div className="lg:col-span-7 space-y-4">
              
              {/* Instrument & Account Currency */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="space-y-1">
                  <label className="text-[12px] font-bold text-slate-800 font-inter block">
                    Trading Pair / Instrument
                  </label>
                  <select
                    value={selectedSymbol}
                    onChange={(e) => handleInstrumentChange(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-[16px] sm:text-[13.5px] font-manrope font-bold text-slate-900 focus:border-[#0053CF] outline-hidden cursor-pointer min-h-[42px] sm:min-h-0"
                  >
                    {INSTRUMENTS.map((inst) => (
                      <option key={inst.symbol} value={inst.symbol}>
                        {inst.symbol} ({inst.name})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[12px] font-bold text-slate-800 font-inter block">
                    Account Base Currency
                  </label>
                  <select
                    value={accountCurrency}
                    onChange={(e) => setAccountCurrency(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-[16px] sm:text-[13.5px] font-inter font-bold text-slate-900 focus:border-[#0053CF] outline-hidden cursor-pointer min-h-[42px] sm:min-h-0"
                  >
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                    <option value="NGN">NGN (₦)</option>
                    <option value="ZAR">ZAR (R)</option>
                  </select>
                </div>
              </div>

              {/* TAB 1: POSITION SIZE & RISK */}
              {activeTab === 'position' && (
                <div className="space-y-4 pt-1">
                  <div className="space-y-1">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                      <label className="text-[12px] font-bold text-slate-800 font-inter">
                        Account Balance
                      </label>
                      <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-1 touch-manipulation">
                        {[1000, 5000, 10000, 50000].map((val) => (
                          <button
                            key={val}
                            type="button"
                            onClick={() => setAccountBalance(val)}
                            className={`text-[11px] px-2.5 py-1 sm:py-0.5 rounded-md font-bold transition-colors cursor-pointer shrink-0 ${
                              accountBalance === val 
                                ? 'bg-[#0053CF] text-white shadow-2xs' 
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                          >
                            ${val.toLocaleString()}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-slate-400 font-bold">$</span>
                      <input
                        type="number"
                        min="1"
                        step="100"
                        value={accountBalance}
                        onChange={(e) => setAccountBalance(Math.max(0, Number(e.target.value)))}
                        className="w-full pl-7 pr-3 py-2 bg-white border border-slate-300 rounded-xl text-[16px] sm:text-[13.5px] font-inter font-bold text-slate-900 focus:border-[#0053CF] outline-hidden min-h-[42px] sm:min-h-0"
                      />
                    </div>
                  </div>

                  {/* Risk Amount / Percentage */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div className="space-y-1">
                      <label className="text-[12px] font-bold text-slate-800 font-inter block">
                        Risk Calculation Mode
                      </label>
                      <div className="flex rounded-xl bg-slate-100 p-1 border border-slate-200">
                        <button
                          type="button"
                          onClick={() => setRiskType('percent')}
                          className={`flex-1 py-1.5 text-[12px] font-bold rounded-lg transition-all cursor-pointer ${
                            riskType === 'percent'
                              ? 'bg-white text-[#0053CF] shadow-xs'
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          Percentage (%)
                        </button>
                        <button
                          type="button"
                          onClick={() => setRiskType('fixed')}
                          className={`flex-1 py-1.5 text-[12px] font-bold rounded-lg transition-all cursor-pointer ${
                            riskType === 'fixed'
                              ? 'bg-white text-[#0053CF] shadow-xs'
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          Fixed Cash ($)
                        </button>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[12px] font-bold text-slate-800 font-inter">
                        {riskType === 'percent' ? 'Risk Percentage' : 'Fixed Cash Risk'}
                      </label>
                      {riskType === 'percent' ? (
                        <div>
                          <div className="relative">
                            <input
                              type="number"
                              min="0.1"
                              max="100"
                              step="0.1"
                              value={riskPercent}
                              onChange={(e) => setRiskPercent(Math.max(0.1, Number(e.target.value)))}
                              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-[16px] sm:text-[13.5px] font-inter font-bold text-slate-900 focus:border-[#0053CF] outline-hidden min-h-[42px] sm:min-h-0"
                            />
                            <span className="absolute right-3 top-2.5 text-slate-400 font-bold">%</span>
                          </div>
                          <div className="flex gap-1.5 mt-1.5 overflow-x-auto no-scrollbar pb-1 touch-manipulation">
                            {[0.5, 1.0, 1.5, 2.0].map((p) => (
                              <button
                                key={p}
                                type="button"
                                onClick={() => setRiskPercent(p)}
                                className={`text-[11px] px-2 py-1 sm:py-0.5 rounded font-bold cursor-pointer shrink-0 transition-colors ${
                                  riskPercent === p ? 'bg-[#0053CF] text-white shadow-2xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                }`}
                              >
                                {p}%
                              </button>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="relative">
                          <span className="absolute left-3 top-2.5 text-slate-400 font-bold">$</span>
                          <input
                            type="number"
                            min="1"
                            step="10"
                            value={riskAmount}
                            onChange={(e) => setRiskAmount(Math.max(1, Number(e.target.value)))}
                            className="w-full pl-7 pr-3 py-2 bg-white border border-slate-300 rounded-xl text-[16px] sm:text-[13.5px] font-inter font-bold text-slate-900 focus:border-[#0053CF] outline-hidden min-h-[42px] sm:min-h-0"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Stop Loss Pips */}
                  <div className="space-y-1">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                      <label className="text-[12px] font-bold text-slate-800 font-inter">
                        Stop Loss (in Pips)
                      </label>
                      <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-1 touch-manipulation">
                        {[10, 15, 20, 30, 50].map((p) => (
                          <button
                            key={p}
                            type="button"
                            onClick={() => setStopLossPips(p)}
                            className={`text-[11px] px-2.5 py-1 sm:py-0.5 rounded-md font-bold cursor-pointer shrink-0 transition-colors ${
                              stopLossPips === p ? 'bg-[#0053CF] text-white shadow-2xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                          >
                            {p} pips
                          </button>
                        ))}
                      </div>
                    </div>
                    <input
                      type="number"
                      min="1"
                      step="1"
                      value={stopLossPips}
                      onChange={(e) => setStopLossPips(Math.max(1, Number(e.target.value)))}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-[16px] sm:text-[13.5px] font-inter font-bold text-slate-900 focus:border-[#0053CF] outline-hidden min-h-[42px] sm:min-h-0"
                    />
                  </div>
                </div>
              )}

              {/* TAB 2: PIP VALUE */}
              {activeTab === 'pip' && (
                <div className="space-y-4 pt-1">
                  <div className="space-y-1">
                    <label className="text-[12px] font-bold text-slate-800 font-inter block">
                      Trade Size (Standard Lots)
                    </label>
                    <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-1 mb-1.5 touch-manipulation">
                      {[0.01, 0.10, 0.50, 1.0, 2.0, 5.0].map((lots) => (
                        <button
                          key={lots}
                          type="button"
                          onClick={() => setPipLotSize(lots)}
                          className={`text-[11.5px] px-2.5 py-1 rounded-md font-bold cursor-pointer shrink-0 transition-colors ${
                            pipLotSize === lots ? 'bg-[#0053CF] text-white shadow-2xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                          }`}
                        >
                          {lots} Lots
                        </button>
                      ))}
                    </div>
                    <input
                      type="number"
                      min="0.01"
                      step="0.01"
                      value={pipLotSize}
                      onChange={(e) => setPipLotSize(Math.max(0.01, Number(e.target.value)))}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-[16px] sm:text-[13.5px] font-inter font-bold text-slate-900 focus:border-[#0053CF] outline-hidden min-h-[42px] sm:min-h-0"
                    />
                  </div>

                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-[12.5px] text-slate-600 leading-relaxed font-inter">
                    <div className="font-bold text-slate-900 mb-0.5">Understanding Pip Value:</div>
                    For {instrument.symbol}, 1 standard lot ({instrument.contractSize.toLocaleString()} units) has a base pip size of {instrument.pipSize}.
                  </div>
                </div>
              )}

              {/* TAB 3: PROFIT & LOSS */}
              {activeTab === 'pnl' && (
                <div className="space-y-4 pt-1">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[12px] font-bold text-slate-800 font-inter">
                        Trade Direction
                      </label>
                      <div className="flex rounded-xl bg-slate-100 p-1 border border-slate-200">
                        <button
                          type="button"
                          onClick={() => setOrderType('buy')}
                          className={`flex-1 py-1.5 text-[12px] font-bold rounded-lg cursor-pointer ${
                            orderType === 'buy' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600'
                          }`}
                        >
                          BUY (Long)
                        </button>
                        <button
                          type="button"
                          onClick={() => setOrderType('sell')}
                          className={`flex-1 py-1.5 text-[12px] font-bold rounded-lg cursor-pointer ${
                            orderType === 'sell' ? 'bg-rose-600 text-white shadow-xs' : 'text-slate-600'
                          }`}
                        >
                          SELL (Short)
                        </button>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[12px] font-bold text-slate-800 font-inter">
                        Position Volume (Lots)
                      </label>
                      <input
                        type="number"
                        min="0.01"
                        step="0.01"
                        value={pnlLots}
                        onChange={(e) => setPnlLots(Math.max(0.01, Number(e.target.value)))}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-[16px] sm:text-[13.5px] font-inter font-bold text-slate-900 focus:border-[#0053CF] outline-hidden min-h-[42px] sm:min-h-0"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div className="space-y-1">
                      <label className="text-[12px] font-bold text-slate-800 font-inter">
                        Open (Entry) Price
                      </label>
                      <input
                        type="number"
                        step="any"
                        value={entryPrice}
                        onChange={(e) => setEntryPrice(Number(e.target.value))}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-[16px] sm:text-[13.5px] font-inter font-bold text-slate-900 focus:border-[#0053CF] outline-hidden min-h-[42px] sm:min-h-0"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[12px] font-bold text-slate-800 font-inter">
                        Close (Exit) Price
                      </label>
                      <input
                        type="number"
                        step="any"
                        value={exitPrice}
                        onChange={(e) => setExitPrice(Number(e.target.value))}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-[16px] sm:text-[13.5px] font-inter font-bold text-slate-900 focus:border-[#0053CF] outline-hidden min-h-[42px] sm:min-h-0"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: MARGIN & LEVERAGE */}
              {activeTab === 'margin' && (
                <div className="space-y-4 pt-1">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div className="space-y-1">
                      <label className="text-[12px] font-bold text-slate-800 font-inter">
                        Trade Size (Lots)
                      </label>
                      <input
                        type="number"
                        min="0.01"
                        step="0.01"
                        value={marginLots}
                        onChange={(e) => setMarginLots(Math.max(0.01, Number(e.target.value)))}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-[16px] sm:text-[13.5px] font-inter font-bold text-slate-900 focus:border-[#0053CF] outline-hidden min-h-[42px] sm:min-h-0"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[12px] font-bold text-slate-800 font-inter">
                        Account Leverage Ratio
                      </label>
                      <select
                        value={leverage}
                        onChange={(e) => setLeverage(Number(e.target.value))}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-[16px] sm:text-[13.5px] font-inter font-bold text-slate-900 focus:border-[#0053CF] outline-hidden cursor-pointer min-h-[42px] sm:min-h-0"
                      >
                        <option value="50">1:50 (Standard Retail)</option>
                        <option value="100">1:100 (Standard)</option>
                        <option value="200">1:200 (Moderate)</option>
                        <option value="500">1:500 (Recommended / Exness)</option>
                        <option value="1000">1:1000 (Exness High)</option>
                        <option value="2000">1:2000 (Exness Max)</option>
                      </select>
                    </div>
                  </div>

                  <div className="p-3 bg-sky-50/70 border border-sky-200 rounded-xl text-[12px] text-sky-900 font-inter leading-relaxed flex items-start gap-2">
                    <Info className="w-4 h-4 text-[#0053CF] mt-0.5 shrink-0" />
                    <span>
                      High leverage lowers required margin, but increases exposure to rapid market swings. Always trade with predetermined stop losses.
                    </span>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={handleReset}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-[12px] font-bold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Defaults</span>
                </button>
                <button
                  type="button"
                  onClick={handleCopySummary}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-[12px] font-bold text-[#0053CF] bg-sky-50 hover:bg-sky-100 border border-sky-200 transition-colors cursor-pointer ml-auto"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied Calculation!' : 'Copy Summary'}</span>
                </button>
              </div>

            </div>

            {/* Results Display (Right Column) */}
            <div className="lg:col-span-5 bg-slate-900 text-white rounded-2xl p-4 sm:p-6 border border-slate-800 shadow-md flex flex-col justify-between">
              
              <div>
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="text-[11.5px] sm:text-[12px] font-extrabold uppercase tracking-wider text-slate-300 font-inter">
                      Calculated Outcome
                    </span>
                  </div>
                  <span className="text-[11px] font-mono bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700">
                    {selectedSymbol}
                  </span>
                </div>

                {/* TAB 1 RESULTS */}
                {activeTab === 'position' && (
                  <div className="space-y-3.5">
                    <div className="bg-slate-800/90 rounded-xl p-3.5 sm:p-4 border border-slate-700/80">
                      <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider block font-inter">
                        Recommended Position Size
                      </span>
                      <div className="flex items-baseline gap-2 mt-1">
                        <span className="text-[28px] sm:text-[34px] font-manrope font-black text-white leading-none">
                          {positionResults.lots}
                        </span>
                        <span className="text-[13px] sm:text-[14px] font-bold text-amber-400 font-inter">
                          Standard Lots
                        </span>
                      </div>
                      <div className="text-[12px] text-slate-300 font-mono mt-1">
                        = {positionResults.units.toLocaleString()} Contract Units
                      </div>
                    </div>

                    {/* Adjusted Mini Cards */}
                    <div className="grid grid-cols-2 gap-2 sm:gap-3">
                      <div className="bg-slate-800/70 p-2.5 sm:p-3 rounded-xl border border-slate-700/70 flex flex-col justify-between min-w-0">
                        <span className="text-[10.5px] sm:text-[11px] text-slate-400 font-medium block truncate">Cash at Risk</span>
                        <div className="mt-1 min-w-0">
                          <span className="text-[16px] sm:text-[19px] font-black text-rose-400 font-manrope block leading-tight truncate">
                            ${calculatedRiskMoney.toFixed(2)}
                          </span>
                          <span className="text-[10px] sm:text-[10.5px] text-slate-400 font-inter mt-0.5 block truncate">
                            {riskType === 'percent' ? `${riskPercent}% of balance` : 'Fixed cash risk'}
                          </span>
                        </div>
                      </div>

                      <div className="bg-slate-800/70 p-2.5 sm:p-3 rounded-xl border border-slate-700/70 flex flex-col justify-between min-w-0">
                        <span className="text-[10.5px] sm:text-[11px] text-slate-400 font-medium block truncate">Pip Value (Total)</span>
                        <div className="mt-1 min-w-0">
                          <span className="text-[16px] sm:text-[19px] font-black text-sky-400 font-manrope block leading-tight truncate">
                            ${(positionResults.lots * positionResults.pipValuePerLot).toFixed(2)}
                          </span>
                          <span className="text-[10px] sm:text-[10.5px] text-slate-400 font-inter mt-0.5 block truncate">
                            per pip movement
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Specs Detail */}
                    <div className="pt-2 border-t border-slate-800/80 space-y-2 text-[12px] font-inter text-slate-300">
                      <div className="flex justify-between items-center py-0.5">
                        <span className="text-slate-400">Mini Lots:</span>
                        <span className="font-bold text-white font-mono bg-slate-800/70 px-2 py-0.5 rounded">{positionResults.miniLots}</span>
                      </div>
                      <div className="flex justify-between items-center py-0.5">
                        <span className="text-slate-400">Micro Lots:</span>
                        <span className="font-bold text-white font-mono bg-slate-800/70 px-2 py-0.5 rounded">{positionResults.microLots}</span>
                      </div>
                      <div className="flex justify-between items-center py-0.5">
                        <span className="text-slate-400">Stop Distance:</span>
                        <span className="font-bold text-white font-mono bg-slate-800/70 px-2 py-0.5 rounded">{stopLossPips} Pips</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 2 RESULTS */}
                {activeTab === 'pip' && (
                  <div className="space-y-4">
                    <div className="bg-slate-800/80 rounded-xl p-3.5 sm:p-4 border border-slate-700/80">
                      <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider block font-inter">
                        Single Pip Movement Value
                      </span>
                      <div className="flex items-baseline gap-2 mt-1">
                        <span className="text-[28px] sm:text-[36px] font-manrope font-black text-white leading-none">
                          ${pipValueResults.pipValue.toFixed(2)}
                        </span>
                        <span className="text-[13px] font-bold text-sky-400 font-inter">
                          per 1 pip
                        </span>
                      </div>
                      <div className="text-[12px] text-slate-300 font-mono mt-1">
                        For {pipLotSize} Lots on {selectedSymbol}
                      </div>
                    </div>

                    <div className="space-y-2 pt-1">
                      <div className="flex justify-between items-center p-2.5 rounded-lg bg-slate-800/60 border border-slate-700/60 text-[12.5px]">
                        <span className="text-slate-300 font-inter">10 Pips Move:</span>
                        <span className="font-bold text-white font-mono">${pipValueResults.tenPips.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between items-center p-2.5 rounded-lg bg-slate-800/60 border border-slate-700/60 text-[12.5px]">
                        <span className="text-slate-300 font-inter">50 Pips Move:</span>
                        <span className="font-bold text-white font-mono">${pipValueResults.fiftyPips.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between items-center p-2.5 rounded-lg bg-slate-800/60 border border-slate-700/60 text-[12.5px]">
                        <span className="text-slate-300 font-inter">100 Pips Move:</span>
                        <span className="font-bold text-white font-mono">${pipValueResults.hundredPips.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 3 RESULTS */}
                {activeTab === 'pnl' && (
                  <div className="space-y-4">
                    <div className={`rounded-xl p-3.5 sm:p-4 border ${pnlResults.isProfit ? 'bg-emerald-950/40 border-emerald-700/60' : 'bg-rose-950/40 border-rose-700/60'}`}>
                      <span className="text-[11px] text-slate-300 font-bold uppercase tracking-wider block font-inter">
                        Net Profit / Loss
                      </span>
                      <div className="flex items-baseline gap-2 mt-1">
                        <span className={`text-[28px] sm:text-[36px] font-manrope font-black leading-none ${pnlResults.isProfit ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {pnlResults.isProfit ? '+' : ''}${pnlResults.profit.toLocaleString()}
                        </span>
                      </div>
                      <div className="text-[12px] text-slate-300 font-mono mt-1">
                        Gain/Loss: {pnlResults.pips > 0 ? `+${pnlResults.pips}` : pnlResults.pips} Pips
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
                      <div className="bg-slate-800/50 p-2.5 sm:p-3 rounded-xl border border-slate-700/60">
                        <span className="text-[10px] sm:text-[10.5px] text-slate-400 font-bold block">Trade Action</span>
                        <span className={`text-[14px] sm:text-[15px] font-black uppercase font-manrope ${orderType === 'buy' ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {orderType} {pnlLots} Lots
                        </span>
                      </div>

                      <div className="bg-slate-800/50 p-2.5 sm:p-3 rounded-xl border border-slate-700/60">
                        <span className="text-[10px] sm:text-[10.5px] text-slate-400 font-bold block">Price Delta</span>
                        <span className="text-[14px] sm:text-[15px] font-black text-white font-mono">
                          {Math.abs(exitPrice - entryPrice).toFixed(instrument.pipDecimals)}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 4 RESULTS */}
                {activeTab === 'margin' && (
                  <div className="space-y-4">
                    <div className="bg-slate-800/80 rounded-xl p-3.5 sm:p-4 border border-slate-700/80">
                      <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider block font-inter">
                        Required Initial Margin
                      </span>
                      <div className="flex items-baseline gap-2 mt-1">
                        <span className="text-[28px] sm:text-[36px] font-manrope font-black text-white leading-none">
                          ${marginResults.requiredMargin.toLocaleString()}
                        </span>
                      </div>
                      <div className="text-[12px] text-slate-300 font-mono mt-1">
                        Leverage: {marginResults.leverageRatio}
                      </div>
                    </div>

                    <div className="p-3 bg-slate-800/50 rounded-xl border border-slate-700/60 space-y-2 text-[12px] font-inter">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Total Notional Value:</span>
                        <span className="font-bold text-white font-mono">${marginResults.notional.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Margin Deposit Rate:</span>
                        <span className="font-bold text-white font-mono">{(100 / leverage).toFixed(2)}%</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Exness Recommended Partner Box */}
              <div className="mt-5 pt-4 border-t border-slate-800 text-[11.5px] text-slate-400 font-inter flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1.5">
                <span>Calculated with Exness Raw spreads specs</span>
                <span className="text-amber-400 font-bold flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5" />
                  <span>Sub-millisecond execution</span>
                </span>
              </div>

            </div>

          </div>
        </div>
      </div>
    </section>
  );
};
