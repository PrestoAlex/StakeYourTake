import { motion } from 'framer-motion';
import { Trophy, TrendingUp, Coins, Crown, Medal } from 'lucide-react';
import { leaderboardUsers } from '../data/mockData';

const rankColors = ['#C9A84C', '#A8A8A8', '#A68A3E'];
const rankBorders = ['rgba(201,168,76,0.5)', 'rgba(168,168,168,0.5)', 'rgba(166,138,62,0.4)'];

export default function Leaderboard() {
  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
      <div className="w-full" style={{ maxWidth: '760px', margin: '0 auto' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-10"
      >
        <div className="flex items-center justify-center gap-2 mb-3">
          <Trophy className="w-8 h-8 text-gold" />
          <h1 className="text-3xl sm:text-4xl font-black text-text-primary">Leaderboard</h1>
        </div>
        <p className="text-text-secondary text-sm">Top forecasters ranked by reputation</p>
      </motion.div>

      {/* Top 3 podium */}
      <div className="grid grid-cols-3 gap-3 mb-8">
        {[1, 0, 2].map((idx, posIdx) => {
          const u = leaderboardUsers[idx];
          if (!u) return null;
          const rank = idx + 1;
          const isFirst = rank === 1;
          return (
            <motion.div
              key={u.wallet}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: posIdx * 0.15 }}
              className={`rounded-2xl p-4 text-center relative overflow-hidden ${isFirst ? 'sm:-mt-4' : ''}`}
              style={{
                background: 'linear-gradient(135deg, rgba(235, 225, 210, 0.98), rgba(245, 240, 230, 0.95))',
                border: `2px solid ${rankBorders[rank - 1]}`,
                boxShadow: isFirst ? '0 12px 40px rgba(201,168,76,0.15), inset 0 1px 0 rgba(255,255,255,0.2)' : '0 8px 32px rgba(44,36,24,0.12), inset 0 1px 0 rgba(255,255,255,0.15)',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Shimmer effect for podium */}
              <div 
                className="absolute inset-0 opacity-20"
                style={{
                  background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.15) 50%, transparent 60%)',
                  animation: 'shimmer 3s ease-in-out infinite',
                }}
              />
              {isFirst && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-16 rounded-full blur-[40px] opacity-15"
                  style={{ background: '#C9A84C' }} />
              )}
              <div className="relative">
                <div className="flex justify-center mb-2">
                  {rank === 1 ? (
                    <Crown className="w-6 h-6" style={{ color: rankColors[0] }} />
                  ) : (
                    <Medal className="w-5 h-5" style={{ color: rankColors[rank - 1] }} />
                  )}
                </div>
                <div className={`mx-auto rounded-full flex items-center justify-center mb-2 ${isFirst ? 'w-16 h-16 text-3xl' : 'w-12 h-12 text-2xl'}`}
                  style={{ borderWidth: 2, borderStyle: 'solid', borderColor: `${rankColors[rank - 1]}50`, background: `${rankColors[rank - 1]}10` }}>
                  {u.avatar}
                </div>
                <div className="text-sm font-bold text-text-primary">{u.name}</div>
                <div className="text-xs text-text-muted font-mono mb-2">{u.wallet}</div>
                <div className="text-lg font-black" style={{ color: rankColors[rank - 1] }}>
                  {u.reputation.toLocaleString()}
                </div>
                <div className="text-[10px] text-text-muted uppercase tracking-wider">reputation</div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Full leaderboard */}
      <div className="rounded-2xl overflow-hidden"
        style={{ 
          background: 'linear-gradient(135deg, rgba(235, 225, 210, 0.98), rgba(245, 240, 230, 0.95))', 
          border: '1px solid rgba(201,168,76,0.3)', 
          boxShadow: '0 8px 32px rgba(44,36,24,0.12), inset 0 1px 0 rgba(255,255,255,0.15)',
          position: 'relative',
          overflow: 'hidden',
        }}>
        {/* Shimmer effect for main table */}
        <div 
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.1) 50%, transparent 60%)',
            animation: 'shimmer 4s ease-in-out infinite',
          }}
        />
        
        <style>{`
          @keyframes shimmer {
            0% { transform: translateX(-100%) rotate(45deg); }
            100% { transform: translateX(200%) rotate(45deg); }
          }
        `}</style>
        
        {/* Header */}
        <div className="grid grid-cols-12 gap-2 px-4 py-3 text-[10px] font-semibold text-text-muted uppercase tracking-wider border-b border-border"
          style={{ background: '#F5F0E8' }}>
          <div className="col-span-1">#</div>
          <div className="col-span-4">User</div>
          <div className="col-span-2 text-center">
            <span className="hidden sm:inline">Reputation</span>
            <span className="sm:hidden">Rep</span>
          </div>
          <div className="col-span-2 text-center">
            <span className="hidden sm:inline">Predictions</span>
            <span className="sm:hidden">Pred</span>
          </div>
          <div className="col-span-1 text-center">
            <span className="hidden sm:inline">Accuracy</span>
            <span className="sm:hidden">Acc</span>
          </div>
          <div className="col-span-2 text-center">Staked</div>
        </div>

        {/* Rows */}
        {leaderboardUsers.map((u, i) => (
          <motion.div
            key={u.wallet}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className="grid grid-cols-12 gap-2 px-4 py-3 items-center border-b border-border/50 transition-colors group"
            style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(245,240,232,0.3)' }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = '#FFF9EF'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = i % 2 === 0 ? 'transparent' : 'rgba(245,240,232,0.3)'; }}
          >
            <div className="col-span-1">
              <span className="text-sm font-bold" style={{ color: i < 3 ? rankColors[i] : '#A69D8E' }}>
                {i + 1}
              </span>
            </div>
            <div className="col-span-4 flex items-center gap-2">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-lg shrink-0"
                style={{ background: '#F5F0E8' }}>
                {u.avatar}
              </div>
              <div className="min-w-0">
                <div className="text-sm font-semibold text-text-primary truncate">{u.name}</div>
                <div className="text-[10px] text-text-muted font-mono hidden sm:block">{u.wallet}</div>
              </div>
            </div>
            <div className="col-span-2 text-center">
              <div className="flex items-center justify-center gap-1">
                <TrendingUp className="w-3 h-3 text-gold" />
                <span className="text-sm font-bold text-text-primary">{u.reputation.toLocaleString()}</span>
              </div>
            </div>
            <div className="col-span-2 text-center text-sm text-text-secondary">{u.predictions}</div>
            <div className="col-span-1 text-center">
              <span className="text-sm font-semibold"
                style={{ color: u.accuracy >= 80 ? '#4CAF50' : u.accuracy >= 60 ? '#E6A817' : '#D44638' }}>
                {u.accuracy}%
              </span>
            </div>
            <div className="col-span-2 text-center">
              <div className="flex items-center justify-center gap-1">
                <Coins className="w-3 h-3 text-gold" />
                <span className="text-sm text-text-primary">{u.totalStaked.toFixed(1)}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      </div>
    </div>
  );
}
