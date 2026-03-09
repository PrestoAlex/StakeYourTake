import { useState } from 'react';
import { motion } from 'framer-motion';
import { UserPlus, UserCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface FollowButtonProps {
  userId: string;
  userName: string;
}

export default function FollowButton({ userId, userName }: FollowButtonProps) {
  const { user, followUser, unfollowUser } = useApp();
  const [isFollowing, setIsFollowing] = useState(
    user.following?.includes(userId) || false
  );

  const handleFollow = () => {
    if (isFollowing) {
      unfollowUser(userId);
      setIsFollowing(false);
    } else {
      followUser(userId);
      setIsFollowing(true);
    }
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleFollow}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold cursor-pointer border transition-all ${
        isFollowing 
          ? 'text-text-secondary border-text-muted/30' 
          : 'text-gold border-gold/40'
      }`}
      style={{
        background: isFollowing 
          ? 'rgba(166,157,142,0.08)' 
          : 'rgba(201,168,76,0.1)',
        borderColor: isFollowing 
          ? 'rgba(166,157,142,0.3)' 
          : 'rgba(201,168,76,0.4)',
      }}
    >
      {isFollowing ? (
        <>
          <UserCheck className="w-4 h-4" />
          <span>Following</span>
        </>
      ) : (
        <>
          <UserPlus className="w-4 h-4" />
          <span>Follow</span>
        </>
      )}
    </motion.button>
  );
}
