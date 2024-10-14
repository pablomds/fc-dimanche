import './App.css';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/home';
import Match from './pages/matchs';
import MatchConfirmation from './pages/matchs/confirmation';
import MatchInvitation from './pages/matchs/invitation';
import NotFound from './pages/notFound'

function App() {

  return (
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/match/creation" element={<Match />} />
        <Route path="/match/confirmation" element={<MatchConfirmation />} />
        <Route path="/match/invitation" element={<MatchInvitation />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
  );
};

export default App
