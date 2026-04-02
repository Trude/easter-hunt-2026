import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { GameProvider } from './context/GameContext';
import EasterBackground from './components/ui/EasterBackground';
import Home from './pages/Home';
import SanderHub from './pages/SanderHub';
import SeldaHub from './pages/SeldaHub';
import SanderDepartment from './pages/SanderDepartment';
import SeldaDepartment from './pages/SeldaDepartment';
import Agent from './pages/Agent';
import AgentGroup from './pages/AgentGroup';
import Combine from './pages/Combine';
import Minecraft from './pages/Minecraft';
import Finale from './pages/Finale';

export default function App() {
  return (
    <GameProvider>
      <BrowserRouter>
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
            <Route path="/kombiner" element={<Combine />} />
            <Route path="/minecraft" element={<Minecraft />} />
            <Route path="/finale" element={<Finale />} />
            <Route path="*" element={<Home />} />
          </Routes>
        </div>
      </BrowserRouter>
    </GameProvider>
  );
}
