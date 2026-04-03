import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { GameProvider } from './context/GameContext';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}
import EasterBackground from './components/ui/EasterBackground';
import Home from './pages/Home';
import SanderHub from './pages/SanderHub';
import SeldaHub from './pages/SeldaHub';
import SanderDepartment from './pages/SanderDepartment';
import SeldaDepartment from './pages/SeldaDepartment';
import Agent from './pages/Agent';
import AgentGroup from './pages/AgentGroup';
import AgentGame from './pages/AgentGame';
import Combine from './pages/Combine';
import Minecraft from './pages/Minecraft';
import Finale from './pages/Finale';
import VoksneHub from './pages/VoksneHub';
import VoksneDepartment from './pages/VoksneDepartment';

export default function App() {
  return (
    <GameProvider>
      <BrowserRouter>
        <ScrollToTop />
        <EasterBackground />
        <div className="relative z-10">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/sander" element={<SanderHub />} />
            <Route path="/sander/:deptId" element={<SanderDepartment />} />
            <Route path="/selda" element={<SeldaHub />} />
            <Route path="/selda/:deptId" element={<SeldaDepartment />} />
            <Route path="/agent" element={<Agent />} />
            <Route path="/agent/gruppe/:groupId" element={<AgentGroup />} />
            <Route path="/agent/spill/:stepId" element={<AgentGame />} />
            <Route path="/kombiner" element={<Combine />} />
            <Route path="/minecraft" element={<Minecraft />} />
            <Route path="/finale" element={<Finale />} />
            <Route path="/voksne" element={<VoksneHub />} />
            <Route path="/voksne/:deptId" element={<VoksneDepartment />} />
            <Route path="*" element={<Home />} />
          </Routes>
        </div>
      </BrowserRouter>
    </GameProvider>
  );
}
