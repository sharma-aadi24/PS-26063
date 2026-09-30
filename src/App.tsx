import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './auth/AuthContext';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import Explore from './pages/Explore';
import Expeditions from './pages/Expeditions';
import ExpeditionDetail from './pages/ExpeditionDetail';
import Stations from './pages/Stations';
import StationDetail from './pages/StationDetail';
import Datasets from './pages/Datasets';
import DatasetDetail from './pages/DatasetDetail';
import Publications from './pages/Publications';
import Media from './pages/Media';
import Learn from './pages/Learn';
import ArticleDetail from './pages/ArticleDetail';
import Outreach from './pages/Outreach';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Admin from './pages/Admin';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/expeditions" element={<Expeditions />} />
        <Route path="/expeditions/:id" element={<ExpeditionDetail />} />
        <Route path="/stations" element={<Stations />} />
        <Route path="/stations/:id" element={<StationDetail />} />
        <Route path="/datasets" element={<Datasets />} />
        <Route path="/datasets/:id" element={<DatasetDetail />} />
        <Route path="/publications" element={<Publications />} />
        <Route path="/media" element={<Media />} />
        <Route path="/learn" element={<Learn />} />
        <Route path="/learn/:id" element={<ArticleDetail />} />
        <Route path="/outreach" element={<Outreach />} />
        
        {/* Auth Route */}
        <Route path="/login" element={<Login />} />
        
        {/* Protected Routes */}
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />
        
        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
};

export default App;
