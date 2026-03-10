import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import CreatePredictionModal from './components/CreatePredictionModal';
import MusicController from './components/MusicController';
import Feed from './pages/Feed';
import Profile from './pages/Profile';
import Leaderboard from './pages/Leaderboard';
import Guide from './pages/Guide';

export default function App() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-bg-primary relative">
      {/* Golden Rain Background */}
      <div className="golden-rain">
        <div className="rain-drop"></div>
        <div className="rain-drop"></div>
        <div className="rain-drop"></div>
        <div className="rain-drop"></div>
        <div className="rain-drop"></div>
        <div className="rain-drop"></div>
        <div className="rain-drop"></div>
        <div className="rain-drop"></div>
        <div className="rain-drop"></div>
        <div className="rain-drop"></div>
      </div>
      
      <Navbar onCreateOpen={() => setIsCreateOpen(true)} />
      
      {/* Main Content */}
      <div className="main-content flex-1">
        <main className="flex-1 w-full relative z-10">
          <Routes>
            <Route path="/" element={<Feed />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/guide" element={<Guide />} />
          </Routes>
        </main>
        <CreatePredictionModal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} />
        <MusicController />
      </div>
    </div>
  );
}
