import { useState, useEffect } from 'react';
import { LIVE_QUOTES } from '../data/mockData';

export interface LiveQuoteItem {
  pair: string;
  bid: number;
  ask: number;
  change: number;
  direction: 'up' | 'down';
}

export function useLiveForexQuotes() {
  const [quotes, setQuotes] = useState<LiveQuoteItem[]>(LIVE_QUOTES);

  useEffect(() => {
    let isMounted = true;

    async function fetchRealPrices() {
      try {
        // Fetch real forex exchange rates based on USD
        const fxRes = await fetch('https://open.er-api.com/v6/latest/USD');
        if (!fxRes.ok) return;
        const fxData = await fxRes.json();
        const rates = fxData.rates;

        if (!rates || !isMounted) return;

        // Optionally fetch live Gold & Crypto
        let btcPrice = 92450;
        let btcChange = +2.35;
        let xauPrice = 2684.50;

        try {
          const cryptoRes = await fetch(
            'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,tether-gold&vs_currencies=usd&include_24hr_change=true'
          );
          if (cryptoRes.ok) {
            const cryptoData = await cryptoRes.json();
            if (cryptoData.bitcoin?.usd) {
              btcPrice = cryptoData.bitcoin.usd;
              btcChange = Number(cryptoData.bitcoin.usd_24h_change?.toFixed(2)) || +2.35;
            }
            if (cryptoData['tether-gold']?.usd) {
              xauPrice = cryptoData['tether-gold'].usd;
            }
          }
        } catch {
          // fallback to base prices
        }

        const getBidAsk = (rate: number, pipSpread = 0.00015) => {
          return {
            bid: rate,
            ask: rate + pipSpread,
          };
        };

        const updated: LiveQuoteItem[] = [
          {
            pair: 'EUR/USD',
            ...getBidAsk(1 / rates.EUR, 0.0001),
            change: +0.28,
            direction: 'up',
          },
          {
            pair: 'GBP/USD',
            ...getBidAsk(1 / rates.GBP, 0.00015),
            change: +0.41,
            direction: 'up',
          },
          {
            pair: 'USD/JPY',
            ...getBidAsk(rates.JPY, 0.015),
            change: -0.19,
            direction: 'down',
          },
          {
            pair: 'USD/CHF',
            ...getBidAsk(rates.CHF, 0.00015),
            change: -0.12,
            direction: 'down',
          },
          {
            pair: 'AUD/USD',
            ...getBidAsk(1 / rates.AUD, 0.00012),
            change: +0.33,
            direction: 'up',
          },
          {
            pair: 'USD/CAD',
            ...getBidAsk(rates.CAD, 0.00015),
            change: +0.08,
            direction: 'up',
          },
          {
            pair: 'NZD/USD',
            ...getBidAsk(1 / rates.NZD, 0.00015),
            change: +0.22,
            direction: 'up',
          },
          {
            pair: 'EUR/GBP',
            ...getBidAsk(rates.GBP / rates.EUR, 0.00012),
            change: -0.15,
            direction: 'down',
          },
          {
            pair: 'EUR/JPY',
            ...getBidAsk(rates.JPY / rates.EUR, 0.02),
            change: +0.14,
            direction: 'up',
          },
          {
            pair: 'GBP/JPY',
            ...getBidAsk(rates.JPY / rates.GBP, 0.025),
            change: +0.26,
            direction: 'up',
          },
          {
            pair: 'AUD/JPY',
            ...getBidAsk(rates.JPY / rates.AUD, 0.02),
            change: +0.18,
            direction: 'up',
          },
          {
            pair: 'XAU/USD',
            ...getBidAsk(xauPrice, 0.40),
            change: +1.14,
            direction: 'up',
          },
          {
            pair: 'XAG/USD',
            ...getBidAsk(31.42, 0.03),
            change: +0.86,
            direction: 'up',
          },
          {
            pair: 'US30',
            ...getBidAsk(43910.00, 2.5),
            change: +0.45,
            direction: 'up',
          },
          {
            pair: 'NAS100',
            ...getBidAsk(20850.00, 1.8),
            change: +0.62,
            direction: 'up',
          },
          {
            pair: 'BTC/USD',
            ...getBidAsk(btcPrice, 5.0),
            change: btcChange,
            direction: btcChange >= 0 ? 'up' : 'down',
          },
        ];

        if (isMounted) {
          setQuotes(updated);
        }
      } catch (err) {
        console.warn('Using base quotes feed', err);
      }
    }

    fetchRealPrices();
    // Poll every 30 seconds for fresh real market data
    const interval = setInterval(fetchRealPrices, 30000);

    // Micro-tick simulation between polls for live realistic feel
    const tickInterval = setInterval(() => {
      setQuotes((prev) =>
        prev.map((item) => {
          // 30% chance to micro-tick a pair by a fraction of a pip
          if (Math.random() > 0.3) return item;
          const isJpyOrIndex =
            item.pair.includes('JPY') ||
            item.pair.includes('BTC') ||
            item.pair.includes('XAU') ||
            item.pair.includes('US') ||
            item.pair.includes('NAS');
          const tickDelta = isJpyOrIndex
            ? (Math.random() - 0.5) * 0.04
            : (Math.random() - 0.5) * 0.00008;

          const newBid = Math.max(0.0001, item.bid + tickDelta);
          const spread = item.ask - item.bid;
          return {
            ...item,
            bid: newBid,
            ask: newBid + spread,
            direction: tickDelta >= 0 ? 'up' : 'down',
          };
        })
      );
    }, 2500);

    return () => {
      isMounted = false;
      clearInterval(interval);
      clearInterval(tickInterval);
    };
  }, []);

  return quotes;
}
