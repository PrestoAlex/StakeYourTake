import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Flame, Clock, ArrowUpDown, Bitcoin, Globe, Cpu, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';
import PredictionCard from '../components/PredictionCard';
import type { Category, SortBy } from '../types';

const categoryFilters: { value: Category; label: string; icon: typeof Flame; color: string }[] = [
  { value: 'all', label: 'All', icon: Sparkles, color: '#C9A84C' },
  { value: 'bitcoin', label: 'Bitcoin', icon: Bitcoin, color: '#C9A84C' },
  { value: 'crypto', label: 'Crypto', icon: Sparkles, color: '#8B6914' },
  { value: 'tech', label: 'Tech', icon: Cpu, color: '#A8A8A8' },
  { value: 'world', label: 'World', icon: Globe, color: '#5B8DEF' },
];

const sortOptions: { value: SortBy; label: string; icon: typeof Flame }[] = [
  { value: 'trending', label: 'Trending', icon: Flame },
  { value: 'newest', label: 'Newest', icon: Clock },
  { value: 'highest-stake', label: 'Highest Stake', icon: ArrowUpDown },
];

export default function Feed() {
  const { predictions, selectedCategory, sortBy, setSelectedCategory, setSortBy } = useApp();

  const filtered = useMemo(() => {
    let result = selectedCategory === 'all'
      ? predictions
      : predictions.filter(p => p.category === selectedCategory);

    switch (sortBy) {
      case 'trending':
        return [...result].sort((a, b) => (b.likes + b.stakes * 10) - (a.likes + a.stakes * 10));
      case 'newest':
        return [...result].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      case 'highest-stake':
        return [...result].sort((a, b) => b.stakeAmount - a.stakeAmount);
      default:
        return result;
    }
  }, [predictions, selectedCategory, sortBy]);

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
      <div className="w-full" style={{ maxWidth: '760px', margin: '0 auto' }}>
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 px-6 py-2 rounded-lg mb-6 text-sm font-bold tracking-wider uppercase relative overflow-hidden"
            style={{ 
              background: 'linear-gradient(135deg, rgba(235, 225, 210, 0.98), rgba(245, 240, 230, 0.95))', 
              color: '#C9A84C', 
              border: '2px solid rgba(201,168,76,0.4)',
              boxShadow: '0 8px 32px rgba(44,36,24,0.12), inset 0 1px 0 rgba(255,255,255,0.2)',
              position: 'relative',
            }}
          >
            {/* Shimmer effect */}
            <div 
              className="absolute inset-0 opacity-40"
              style={{
                background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.3) 50%, transparent 60%)',
                animation: 'shimmer 2s ease-in-out infinite',
              }}
            />
            
            <style>{`
              @keyframes shimmer {
                0% { transform: translateX(-100%) rotate(45deg); }
                100% { transform: translateX(200%) rotate(45deg); }
              }
            `}</style>
            
            <div className="relative flex items-center gap-2">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="w-4 h-4" style={{ filter: 'drop-shadow(0 0 8px rgba(201,168,76,0.8))' }} />
              </motion.div>
              <span style={{ 
                textShadow: '0 0 20px rgba(201,168,76,0.5), 0 0 40px rgba(201,168,76,0.3)',
                letterSpacing: '0.05em'
              }}>
                Bitcoin Prediction Platform
              </span>
            </div>
          </motion.div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black mb-4 leading-tight text-text-primary">
            Put Your Money Where
            <br />
            <span style={{ background: 'linear-gradient(135deg, #C9A84C, #8B6914)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Your Mind Is
            </span>
          </h1>
          <div className="text-center mb-6">
            <div className="inline-block px-6 py-3 rounded-2xl text-center"
              style={{
                background: 'rgba(201, 168, 76, 0.15)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                border: '1px solid rgba(201, 168, 76, 0.3)',
                boxShadow: '0 8px 32px rgba(201, 168, 76, 0.1)',
              }}
            >
              <p className="text-white text-base sm:text-lg leading-relaxed font-medium">
                Make bold predictions, stake BTC on your confidence, earn reputation.
                <br className="hidden sm:block" />
                The sharpest minds win.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Filters */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-8 w-full" style={{ maxWidth: '760px', margin: '0 auto 2rem' }}>
          {categoryFilters.map(cat => (
            <motion.button
              key={cat.value}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedCategory(cat.value)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold transition-all cursor-pointer"
              style={{
                color: selectedCategory === cat.value ? '#FFFDF8' : '#2C2418',
                background: selectedCategory === cat.value 
                  ? 'linear-gradient(135deg, #C9A84C, #A68A3E)' 
                  : 'rgba(247, 244, 237, 0.9)',
                border: `1px solid ${selectedCategory === cat.value ? '#C9A84C' : 'rgba(201, 168, 76, 0.4)'}`,
                boxShadow: selectedCategory === cat.value 
                  ? '0 4px 16px rgba(201, 168, 76, 0.3)' 
                  : '0 4px 16px rgba(44, 36, 24, 0.15)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
              }}
            >
              <cat.icon className="w-4 h-4" />
              {cat.label}
            </motion.button>
          ))}
          <div className="w-px h-5 bg-border" />
          {sortOptions.map(opt => (
            <button
              key={opt.value}
              onClick={() => setSortBy(opt.value)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold transition-all cursor-pointer"
              style={{
                color: sortBy === opt.value ? '#FFFDF8' : '#2C2418',
                background: sortBy === opt.value 
                  ? 'linear-gradient(135deg, #C9A84C, #A68A3E)' 
                  : 'rgba(247, 244, 237, 0.9)',
                border: `1px solid ${sortBy === opt.value ? '#C9A84C' : 'rgba(201, 168, 76, 0.4)'}`,
                boxShadow: sortBy === opt.value 
                  ? '0 4px 16px rgba(201, 168, 76, 0.3)' 
                  : '0 4px 16px rgba(44, 36, 24, 0.15)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
              }}
            >
              <opt.icon className="w-4 h-4" />
              {opt.label}
            </button>
          ))}
        </div>

        {/* Predictions */}
        <div className="grid grid-cols-1 gap-5 w-full" style={{ maxWidth: '760px', margin: '0 auto' }}>
          {filtered.map((prediction, i) => (
            <PredictionCard key={prediction.id} prediction={prediction} index={i} />
          ))}
          {filtered.length === 0 && (
            <div className="text-center py-20 text-text-secondary">
              <p className="text-lg">No predictions in this category yet.</p>
              <p className="text-sm mt-1">Be the first to make a take!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
