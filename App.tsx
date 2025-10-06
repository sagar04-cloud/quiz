import React, { useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { quizService } from './services/quizService';
import { leaderboardService } from './services/leaderboardService';
import { authService } from './services/authService';

import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import DashboardPage from './pages/DashboardPage';
import QuizPage from './pages/QuizPage';
import ResultsPage from './pages/ResultsPage';
import LeaderboardPage from './pages/LeaderboardPage';
import AdminPage from './pages/AdminPage';
import MainLayout from './components/MainLayout';
import AdminLayout from './components/AdminLayout';
import NotFoundPage from './pages/NotFoundPage';
import ProfilePage from './pages/ProfilePage';

const App: React.FC = () => {
    useEffect(() => {
        authService.initialize();
        quizService.initialize();
        leaderboardService.initialize();
    }, []);

    return (
        <AuthProvider>
            <HashRouter>
                <Routes>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/signup" element={<SignUpPage />} />

                    <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
                        <Route path="/" element={<Navigate to="/dashboard" replace />} />
                        <Route path="dashboard" element={<DashboardPage />} />
                        <Route path="quiz/:quizId" element={<QuizPage />} />
                        <Route path="results/:quizId" element={<ResultsPage />} />
                        <Route path="leaderboard" element={<LeaderboardPage />} />
                        <Route path="profile" element={<ProfilePage />} />
                    </Route>

                    <Route path="/admin" element={<ProtectedRoute><AdminRoute><AdminLayout /></AdminRoute></ProtectedRoute>}>
                         <Route index element={<AdminPage />} />
                    </Route>
                    
                    <Route path="*" element={<NotFoundPage />} />
                </Routes>
            </HashRouter>
        </AuthProvider>
    );
};


interface ProtectedRouteProps {
    children: React.ReactElement;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const { user, loading } = useAuth();
    if (loading) {
        return <div className="flex h-screen w-full items-center justify-center bg-background text-text-primary">Loading...</div>;
    }
    return user ? children : <Navigate to="/login" />;
};

const AdminRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const { user, loading } = useAuth();
    if (loading) {
       return <div className="flex h-full w-full items-center justify-center bg-background text-text-primary">Loading...</div>;
    }
    return user && user.role === 'admin' ? children : <Navigate to="/dashboard" />;
};


export default App;