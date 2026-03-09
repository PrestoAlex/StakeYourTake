import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Send, Heart, ChevronDown, ChevronUp } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface Comment {
  id: string;
  author: string;
  avatar: string;
  text: string;
  timestamp: string;
  likes: number;
}

interface CommentsSectionProps {
  predictionId: string;
  predictionText: string;
  isOpen: boolean;
  onToggle: () => void;
}

export default function CommentsSection({ predictionId, predictionText, isOpen, onToggle }: CommentsSectionProps) {
  const { addComment, user } = useApp();
  const [comments, setComments] = useState<Comment[]>([
    {
      id: '1',
      author: 'CryptoWhale',
      avatar: '🐋',
      text: 'Interesting prediction! I think this has a good chance of happening.',
      timestamp: '2 hours ago',
      likes: 12
    },
    {
      id: '2', 
      author: 'TokenMaster',
      avatar: '🎯',
      text: 'Not sure about this one. The timeline seems too aggressive.',
      timestamp: '1 hour ago',
      likes: 8
    },
    {
      id: '3',
      author: 'StakeKing',
      avatar: '👑',
      text: 'Bullish on this! Already staked 0.5 BTC',
      timestamp: '30 minutes ago',
      likes: 24
    }
  ]);
  
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setIsSubmitting(true);
    
    try {
      // Додаємо коментар через блокчейн
      await addComment(predictionId, newComment);
      
      const comment: Comment = {
        id: Date.now().toString(),
        author: user.name,
        avatar: user.avatar,
        text: newComment,
        timestamp: 'Just now',
        likes: 0
      };
      
      setComments(prev => [comment, ...prev]);
      setNewComment('');
    } catch (error) {
      console.error('❌ Error adding comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLike = (commentId: string) => {
    setComments(prev => 
      prev.map(comment => 
        comment.id === commentId 
          ? { ...comment, likes: comment.likes + 1 }
          : comment
      )
    );
  };

  return (
    <div className="w-full">
      {/* Comments Toggle Button */}
      <motion.button
        whileTap={{ scale: 0.98 }}
        onClick={onToggle}
        className="flex items-center gap-2 px-5 py-2.5 text-xs text-text-muted cursor-pointer border-0 bg-transparent hover:text-text-primary transition-all w-full justify-between"
      >
        <div className="flex items-center gap-2">
          <MessageCircle className="w-3.5 h-3.5" />
          <span>Comments ({comments.length})</span>
        </div>
        {isOpen ? (
          <ChevronUp className="w-3.5 h-3.5" />
        ) : (
          <ChevronDown className="w-3.5 h-3.5" />
        )}
      </motion.button>

      {/* Expandable Comments Section */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="border-t border-border mt-3 pt-4">
              {/* Prediction Preview */}
              <div className="mb-4 p-3 rounded-lg" style={{ backgroundColor: '#FAF9F6' }}>
                <p className="text-xs font-medium mb-1" style={{ color: '#6B6B6B' }}>
                  Prediction:
                </p>
                <p className="text-xs" style={{ color: '#1A1A1A' }}>
                  {predictionText}
                </p>
              </div>

              {/* Comments List */}
              <div className="space-y-3 mb-4">
                {comments.map((comment) => (
                  <motion.div
                    key={comment.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex gap-3 p-3 rounded-lg"
                    style={{ backgroundColor: '#FFFFFF' }}
                  >
                    <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs">
                      {comment.avatar}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-xs" style={{ color: '#1A1A1A' }}>
                          {comment.author}
                        </span>
                        <span className="text-xs" style={{ color: '#6B6B6B' }}>
                          {comment.timestamp}
                        </span>
                      </div>
                      <p className="text-xs mb-2" style={{ color: '#1A1A1A' }}>
                        {comment.text}
                      </p>
                      <button
                        onClick={() => handleLike(comment.id)}
                        className="flex items-center gap-1 text-xs hover:opacity-70 transition-opacity"
                        style={{ color: '#FF7A3D' }}
                      >
                        <span>❤️</span>
                        <span>{comment.likes}</span>
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Add Comment Form */}
              <form onSubmit={handleSubmit} className="border-t border-border pt-4">
                <div className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs">
                    🦄
                  </div>
                  <div className="flex-1">
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Add a comment..."
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 resize-none focus:outline-none focus:ring-2 text-xs"
                      style={{ 
                        backgroundColor: '#FFFFFF',
                        borderColor: '#E5E7EB',
                        color: '#1A1A1A',
                        '--tw-ring-color': '#7A8CFF'
                      } as React.CSSProperties}
                      rows={2}
                    />
                  </div>
                </div>
                <div className="flex justify-end mt-3">
                  <button
                    type="submit"
                    disabled={!newComment.trim() || isSubmitting}
                    className="px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-2 text-xs"
                    style={{
                      backgroundColor: newComment.trim() && !isSubmitting ? '#FF7A3D' : '#E5E7EB',
                      color: newComment.trim() && !isSubmitting ? '#FFFFFF' : '#6B6B6B'
                    }}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Posting...
                      </>
                    ) : (
                      <>
                        <Send className="w-3 h-3" />
                        Post
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
