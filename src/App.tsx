import './App.css';
import { Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';
const HomePage = lazy(() => import('./pages/Home/HomePage'));
const MatchCreationPage = lazy(() => import('./pages/Matchs/CreationPage'));
const MatchConfirmationPage = lazy(() => import('./pages/Matchs/ConfirmationPage'));
const MatchInvitationPage = lazy(() => import('./pages/Matchs/InvitationPage'));
const MatchLoginManagementPage = lazy(() => import('./pages/Matchs/LoginManagementPage'));
const MatchManagementPage = lazy(() => import('./pages/Matchs/ManagementPage'));
const NotFoundPage = lazy(() => import('./pages/NotFound'));

function App() {

  return (
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/match/creation" element={<MatchCreationPage />} />
        <Route path="/match/confirmation" element={<MatchConfirmationPage />} />
        <Route path="/match/invitation" element={<MatchInvitationPage />} />
        <Route path="/match/management/login" element={<MatchLoginManagementPage />} />
        <Route path="/match/management/:id" element={<MatchManagementPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
  );
};

export default App
