import { useState, useEffect } from 'react';
import { Music, Music2, Volume2, VolumeX } from 'lucide-react';
import { backgroundMusic } from '../services/backgroundMusic';

export default function MusicController() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.3);
  const [showControls, setShowControls] = useState(false);

  useEffect(() => {
    // Update state when music status changes
    const interval = setInterval(() => {
      setIsPlaying(backgroundMusic.getIsPlaying());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const toggleMusic = () => {
    backgroundMusic.toggle();
    setIsPlaying(!isPlaying);
  };

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
    backgroundMusic.setVolume(newVolume);
  };

  return (
    <div className="fixed bottom-4 left-4 z-50">
      {/* Music Button */}
      <button
        onClick={() => setShowControls(!showControls)}
        className="p-3 rounded-full transition-all duration-300 hover:scale-110"
        style={{
          background: 'rgba(201, 168, 76, 0.9)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          border: '2px solid rgba(201, 168, 76, 0.3)',
          boxShadow: '0 4px 20px rgba(201, 168, 76, 0.3)',
        }}
      >
        {isPlaying ? (
          <Music2 className="w-5 h-5 text-white" />
        ) : (
          <Music className="w-5 h-5 text-white" />
        )}
      </button>

      {/* Extended Controls */}
      {showControls && (
        <div className="absolute bottom-16 left-0 p-4 rounded-2xl transition-all duration-300"
          style={{
            background: 'rgba(247, 244, 237, 0.95)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(201, 168, 76, 0.3)',
            boxShadow: '0 8px 32px rgba(44, 36, 24, 0.15)',
            minWidth: '200px',
          }}
        >
          <div className="space-y-3">
            {/* Play/Pause Button */}
            <button
              onClick={toggleMusic}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-xl transition-all hover:scale-105"
              style={{
                background: isPlaying 
                  ? 'linear-gradient(135deg, #C9A84C, #A68A3E)' 
                  : 'rgba(201, 168, 76, 0.1)',
                color: isPlaying ? '#FFFDF8' : '#C9A84C',
                border: '1px solid rgba(201, 168, 76, 0.3)',
              }}
            >
              {isPlaying ? (
                <>
                  <Volume2 className="w-4 h-4" />
                  <span className="text-sm font-medium">Pause</span>
                </>
              ) : (
                <>
                  <VolumeX className="w-4 h-4" />
                  <span className="text-sm font-medium">Play</span>
                </>
              )}
            </button>

            {/* Volume Control */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-text-secondary">Volume</span>
                <span className="text-xs text-text-muted">{Math.round(volume * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={volume}
                onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, #C9A84C 0%, #C9A84C ${volume * 100}%, #DDD5C4 ${volume * 100}%, #DDD5C4 100%)`,
                }}
              />
            </div>

            {/* Status */}
            <div className="text-xs text-text-muted text-center">
              {isPlaying ? '🎵 Playing...' : '🔇 Paused'}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
