import './App.css'
import { Routes, Route } from 'react-router-dom';
import Home from './pages/home'
import Match from './pages/matchs'
import MatchConfirmation from './pages/matchs/confirmation'

function App() {

  return (
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/match/creation" element={<Match />} />
        <Route path="/match/confirmation" element={<MatchConfirmation />} />
      </Routes>
  );
};

export default App
