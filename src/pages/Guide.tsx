import { motion } from 'framer-motion';
import { Sparkles, Bitcoin, Shield, TrendingUp, Users, ArrowRight, CheckCircle, BookOpen, Target, Zap } from 'lucide-react';

export default function Guide() {
  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 min-h-screen flex items-center justify-center">
      <div className="w-full max-w-6xl mx-auto">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl mb-6 text-sm font-semibold"
            style={{
              background: 'rgba(201, 168, 76, 0.15)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(201, 168, 76, 0.3)',
            }}
          >
            <BookOpen className="w-4 h-4" style={{ color: '#C9A84C' }} />
            <span style={{ color: '#C9A84C' }}>Complete Guide</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black mb-6 leading-tight">
            Why StakeYourTake
            <br />
            <span style={{ 
              background: 'linear-gradient(135deg, #C9A84C, #8B6914)', 
              WebkitBackgroundClip: 'text', 
              WebkitTextFillColor: 'transparent' 
            }}>
              Matters for Bitcoin
            </span>
          </h1>

          <div className="text-center mb-8">
            <div className="inline-block px-6 py-3 rounded-2xl text-center"
              style={{
                background: 'rgba(201, 168, 76, 0.15)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(201, 168, 76, 0.3)',
                boxShadow: '0 8px 32px rgba(201, 168, 76, 0.1)',
              }}
            >
              <p className="text-white text-base sm:text-lg leading-relaxed font-medium">
                The ultimate prediction platform for Bitcoin Layer 1 ecosystem
                <br className="hidden sm:block" />
                Combining DeFi, social proof, and on-chain reputation
              </p>
            </div>
          </div>
        </motion.div>

        {/* Why It Matters Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold mb-8 text-center" style={{ color: '#2C2418' }}>
            Why It Matters for Bitcoin & Layer 1
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 justify-items-center">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="p-6 rounded-2xl"
              style={{
                background: 'rgba(235, 225, 210, 0.95)',
                backdropFilter: 'blur(15px)',
                border: '1px solid rgba(201, 168, 76, 0.3)',
                boxShadow: '0 12px 40px rgba(44, 36, 24, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
              }}
            >
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl" style={{ background: 'rgba(201, 168, 76, 0.15)' }}>
                  <Bitcoin className="w-6 h-6" style={{ color: '#C9A84C' }} />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2" style={{ color: '#2C2418' }}>
                    Bitcoin Native Predictions
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    First prediction platform built specifically for Bitcoin L1. Leverage Bitcoin's security and decentralization for trustless, transparent prediction markets.
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="p-6 rounded-2xl"
              style={{
                background: 'rgba(235, 225, 210, 0.95)',
                backdropFilter: 'blur(15px)',
                border: '1px solid rgba(201, 168, 76, 0.3)',
                boxShadow: '0 12px 40px rgba(44, 36, 24, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
              }}
            >
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl" style={{ background: 'rgba(201, 168, 76, 0.15)' }}>
                  <Shield className="w-6 h-6" style={{ color: '#C9A84C' }} />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2" style={{ color: '#2C2418' }}>
                    On-Chain Reputation System
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    Build verifiable reputation through accurate predictions. Your success rate is permanently recorded on Bitcoin L1, creating trust without intermediaries.
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="p-6 rounded-2xl"
              style={{
                background: 'rgba(235, 225, 210, 0.95)',
                backdropFilter: 'blur(15px)',
                border: '1px solid rgba(201, 168, 76, 0.3)',
                boxShadow: '0 12px 40px rgba(44, 36, 24, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
              }}
            >
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl" style={{ background: 'rgba(201, 168, 76, 0.15)' }}>
                  <TrendingUp className="w-6 h-6" style={{ color: '#C9A84C' }} />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2" style={{ color: '#2C2418' }}>
                    DeFi Integration
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    Stake BTC directly on predictions. Earn yield while participating in prediction markets. Fully compatible with Bitcoin L1 DeFi ecosystem.
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="p-6 rounded-2xl"
              style={{
                background: 'rgba(235, 225, 210, 0.95)',
                backdropFilter: 'blur(15px)',
                border: '1px solid rgba(201, 168, 76, 0.3)',
                boxShadow: '0 12px 40px rgba(44, 36, 24, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
              }}
            >
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl" style={{ background: 'rgba(201, 168, 76, 0.15)' }}>
                  <Users className="w-6 h-6" style={{ color: '#C9A84C' }} />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2" style={{ color: '#2C2418' }}>
                    Social Proof & Wisdom
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    Tap into collective intelligence. Follow top predictors, learn from their analysis, and make more informed decisions in the crypto space.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Instructions Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold mb-8 text-center" style={{ color: '#2C2418' }}>
            How to Get Started
          </h2>

          <div className="space-y-6">
            {[
              {
                icon: <Target className="w-5 h-5" />,
                title: "Connect Your Bitcoin Wallet",
                description: "Connect your Bitcoin L1 compatible wallet to start making predictions. We support various Bitcoin wallets with L1 capabilities.",
                steps: ["Install a Bitcoin L1 wallet", "Click 'Connect Wallet' in the top right", "Approve the connection request"]
              },
              {
                icon: <Zap className="w-5 h-5" />,
                title: "Make Your First Prediction",
                description: "Create predictions about Bitcoin price, technology developments, or market events. Be specific and provide reasoning.",
                steps: ["Click 'New Take' button", "Write your prediction clearly", "Set the timeline and conditions", "Stake BTC on your confidence"]
              },
              {
                icon: <TrendingUp className="w-5 h-5" />,
                title: "Stake and Earn",
                description: "Stake Bitcoin on your predictions. Earn rewards for accurate predictions and build your on-chain reputation.",
                steps: ["Choose your stake amount", "Confirm the transaction", "Wait for the outcome", "Claim your rewards if correct"]
              },
              {
                icon: <Users className="w-5 h-5" />,
                title: "Engage with Community",
                description: "Follow top predictors, comment on predictions, and learn from the community's insights.",
                steps: ["Browse trending predictions", "Follow successful predictors", "Share your analysis", "Build your reputation"]
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.01 }}
                className="p-6 rounded-2xl"
                style={{
                  background: 'rgba(247, 244, 237, 0.9)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(201, 168, 76, 0.2)',
                  boxShadow: '0 8px 32px rgba(44, 36, 24, 0.1)',
                }}
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl flex-shrink-0" style={{ background: 'rgba(201, 168, 76, 0.15)' }}>
                    <div style={{ color: '#C9A84C' }}>{item.icon}</div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-2" style={{ color: '#2C2418' }}>
                      {item.title}
                    </h3>
                    <p className="text-gray-600 mb-4 leading-relaxed">
                      {item.description}
                    </p>
                    <div className="space-y-2">
                      {item.steps.map((step, stepIndex) => (
                        <div key={stepIndex} className="flex items-center gap-3">
                          <CheckCircle className="w-4 h-4 flex-shrink-0" style={{ color: '#C9A84C' }} />
                          <span className="text-gray-700 text-sm">{step}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Key Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold mb-8 text-center" style={{ color: '#2C2418' }}>
            Key Features
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 justify-items-center">
            {[
              {
                title: "On-Chain Verifiable",
                description: "All predictions and results are permanently stored on Bitcoin L1",
                icon: <Shield className="w-6 h-6" />
              },
              {
                title: "BTC Staking",
                description: "Stake native Bitcoin directly on your predictions",
                icon: <Bitcoin className="w-6 h-6" />
              },
              {
                title: "Reputation System",
                description: "Build trust through your prediction accuracy track record",
                icon: <TrendingUp className="w-6 h-6" />
              },
              {
                title: "Social Features",
                description: "Follow, comment, and engage with the community",
                icon: <Users className="w-6 h-6" />
              },
              {
                title: "No Intermediaries",
                description: "Direct peer-to-peer prediction markets on Bitcoin",
                icon: <Zap className="w-6 h-6" />
              },
              {
                title: "Mobile Optimized",
                description: "Full functionality available on all devices",
                icon: <Sparkles className="w-6 h-6" />
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05 }}
                className="p-6 rounded-2xl text-center"
                style={{
                  background: 'rgba(247, 244, 237, 0.9)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(201, 168, 76, 0.2)',
                  boxShadow: '0 8px 32px rgba(44, 36, 24, 0.1)',
                }}
              >
                <div className="w-12 h-12 mx-auto mb-4 rounded-xl flex items-center justify-center" 
                  style={{ background: 'rgba(201, 168, 76, 0.15)' }}>
                  <div style={{ color: '#C9A84C' }}>{feature.icon}</div>
                </div>
                <h3 className="text-lg font-bold mb-2" style={{ color: '#2C2418' }}>
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="text-center"
        >
          <div className="p-8 rounded-3xl"
            style={{
              background: 'linear-gradient(135deg, rgba(201, 168, 76, 0.15), rgba(166, 138, 62, 0.1))',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(201, 168, 76, 0.3)',
              boxShadow: '0 16px 64px rgba(201, 168, 76, 0.2)',
            }}
          >
            <h2 className="text-3xl font-bold mb-4" style={{ color: '#2C2418' }}>
              Ready to Start Predicting?
            </h2>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Join the future of Bitcoin prediction markets. Build your reputation, stake BTC, and be part of the growing Bitcoin L1 ecosystem.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white"
              style={{
                background: 'linear-gradient(135deg, #C9A84C, #A68A3E)',
                boxShadow: '0 8px 32px rgba(201, 168, 76, 0.3)',
              }}
              onClick={() => window.location.href = '/'}
            >
              Start Predicting
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
