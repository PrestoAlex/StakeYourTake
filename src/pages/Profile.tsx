import { useState } from 'react';
import { motion } from 'framer-motion';
import { Award, TrendingUp, Target, Coins, Sparkles, Edit } from 'lucide-react';
import { useApp } from '../context/AppContext';
import PredictionCard from '../components/PredictionCard';
import EditProfileModal from '../components/EditProfileModal';

export default function Profile() {
  const { user, predictions } = useApp();
  const userPredictions = predictions.filter(p => p.author.name === user.name);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const stats = [
    { label: 'Reputation', value: user.reputation.toLocaleString(), icon: Sparkles, color: '#C9A84C' },
    { label: 'Predictions', value: user.predictions, icon: TrendingUp, color: '#8B6914' },
    { label: 'Accuracy', value: `${user.accuracy}%`, icon: Target, color: '#4CAF50' },
    { label: 'Total Staked', value: `${user.totalStaked.toFixed(2)} BTC`, icon: Coins, color: '#C9A84C' },
  ];

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
      <div className="w-full" style={{ maxWidth: '760px', margin: '0 auto' }}>
      {/* Profile card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-xl p-6 mb-8 relative"
        style={{
          background: '#FFFDF8',
          border: '1px solid rgba(201,168,76,0.3)',
          boxShadow: '0 8px 32px rgba(44,36,24,0.08)',
        }}
      >
        {/* Warm glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 rounded-full blur-[80px] opacity-20"
          style={{ background: 'linear-gradient(135deg, #C9A84C, #E2C97E)', pointerEvents: 'none' }} />

        <div className="relative flex flex-col sm:flex-row items-center gap-6">
          {/* Avatar */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200 }}
            className="w-24 h-24 rounded-2xl flex items-center justify-center text-5xl overflow-hidden"
            style={{ background: 'rgba(201,168,76,0.08)', border: '2px solid rgba(201,168,76,0.3)' }}
          >
            {user.avatar.startsWith('/') || user.avatar.startsWith('http') ? (
              <img 
                src={user.avatar} 
                alt="User avatar"
                className="w-full h-full object-cover"
              />
            ) : (
              user.avatar
            )}
          </motion.div>

          <div className="text-center sm:text-left flex-1">
            <div className="flex items-center justify-center sm:justify-start gap-3 mb-2">
              <h1 className="text-2xl font-bold text-text-primary">{user.name}</h1>
              <button
                onClick={(e) => {
                  console.log('Edit button clicked!');
                  e.stopPropagation();
                  setIsEditModalOpen(true);
                }}
                className="p-2 rounded-lg text-text-secondary hover:text-text-primary transition-colors cursor-pointer border-0 bg-transparent relative z-50 hover:bg-gray-100"
                style={{ 
                  pointerEvents: 'auto',
                  position: 'relative',
                  zIndex: 50,
                  display: 'inline-block',
                  backgroundColor: 'transparent',
                  border: 'none',
                  padding: '8px'
                }}
              >
                <Edit className="w-4 h-4" />
              </button>
            </div>
            <p className="text-sm text-text-muted font-mono mb-3">{user.wallet}</p>
            {user.bio && (
              <p className="text-sm text-text-secondary mb-3">{user.bio}</p>
            )}
            <div className="flex items-center justify-center sm:justify-start gap-2 px-3 py-1.5 rounded-xl w-fit mx-auto sm:mx-0"
              style={{ background: '#F5F0E8', border: '1px solid rgba(201,168,76,0.25)' }}>
              <span className="text-gold font-bold">₿</span>
              <span className="text-text-primary font-semibold">{user.balance.toFixed(4)} BTC</span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="relative grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.1 }}
              className="rounded-xl p-3 text-center"
              style={{ background: '#F5F0E8', border: '1px solid #DDD5C4' }}
            >
              <stat.icon className="w-4 h-4 mx-auto mb-1.5" style={{ color: stat.color }} />
              <div className="text-lg font-bold text-text-primary">{stat.value}</div>
              <div className="text-[10px] text-text-muted uppercase tracking-wider">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Badges */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="rounded-2xl p-6 mb-8"
        style={{
          background: '#FFFDF8',
          border: '1px solid rgba(201,168,76,0.3)',
          boxShadow: '0 4px 16px rgba(44,36,24,0.05)',
        }}
      >
        <div className="flex items-center gap-2 mb-4">
          <Award className="w-5 h-5 text-gold" />
          <h2 className="text-lg font-bold text-text-primary">Badges</h2>
        </div>
        <div className="flex flex-wrap gap-3 justify-center sm:justify-start">
          {user.badges.map((badge, i) => {
            const borderStyle = badge.border === 'gold'
              ? '2px solid rgba(201,168,76,0.5)'
              : '2px solid rgba(168,168,168,0.5)';
            const glowBg = badge.border === 'gold'
              ? 'rgba(201,168,76,0.06)'
              : 'rgba(168,168,168,0.06)';
            return (
              <motion.div
                key={badge.id}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + i * 0.1, type: 'spring' }}
                whileHover={{ scale: 1.1, y: -4 }}
                className="group relative flex flex-col items-center gap-1 px-5 py-3 rounded-xl cursor-default"
                style={{ border: borderStyle, background: glowBg }}
              >
                <span className="text-3xl">{badge.icon}</span>
                <span className="text-xs font-semibold" style={{ color: badge.color }}>{badge.name}</span>
                {/* Tooltip */}
                <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-3 py-2 rounded-lg text-xs text-text-primary whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10"
                  style={{ background: '#FFFDF8', border: '1px solid #DDD5C4', boxShadow: '0 4px 16px rgba(44,36,24,0.1)' }}>
                  {badge.description}
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* User predictions */}
      <div>
        <h2 className="text-lg font-bold text-text-primary mb-4 text-center sm:text-left">Your Predictions</h2>
        <div className="grid grid-cols-1 gap-5 w-full" style={{ maxWidth: '760px', margin: '0 auto' }}>
            {userPredictions.length > 0 ? (
              userPredictions.map((p, i) => (
                <PredictionCard key={p.id} prediction={p} index={i} />
              ))
            ) : (
              <div className="text-center py-12 text-text-secondary">
                <p>No predictions yet. Make your first take!</p>
              </div>
            )}
        </div>
      </div>
      </div>
      
      {/* Edit Profile Modal */}
      <EditProfileModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} />
    </div>
  );
}
