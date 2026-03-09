import { useState } from 'react';
import { motion } from 'framer-motion';
import { Wallet } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function WalletConnect() {
  const { 
    isWalletConnected, 
    connectWallet, 
    disconnectWallet
  } = useApp();
  const [loading, setLoading] = useState(false);

  const handleConnect = async () => {
    setLoading(true);
    try {
      const result = await connectWallet();
      if (!result.ok) {
        console.error('Connection failed:', result.error);
      }
    } catch (error) {
      console.error('Connection error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDisconnect = async () => {
    setLoading(true);
    try {
      const result = await disconnectWallet();
      if (!result.ok) {
        console.error('Disconnect failed:', result.error);
      }
    } catch (error) {
      console.error('Disconnect error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={isWalletConnected ? handleDisconnect : handleConnect}
      disabled={loading}
      className="flex items-center gap-2 px-4 py-2 rounded-xl font-semibold cursor-pointer border-0 transition-all whitespace-nowrap"
      style={{
        background: isWalletConnected 
          ? 'rgba(201, 168, 76, 0.1)' 
          : 'linear-gradient(135deg, #C9A84C, #A68A3E)',
        color: isWalletConnected ? '#C9A84C' : '#FFFDF8',
        boxShadow: '0 4px 16px rgba(201,168,76,0.25)',
      }}
    >
      <Wallet className="w-4 h-4" />
      {loading ? 'Connecting...' : isWalletConnected ? 'Disconnect' : 'Connect Wallet'}
    </motion.button>
  );
}
