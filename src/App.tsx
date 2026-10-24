import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppNavbar } from '@/components/navigation/AppNavbar';
import CustomCursor from '@/components/ui/CustomCursor';
import LandingScreen from '@/features/landing/LandingScreen';
import ExplorePage from '@/pages/ExplorePage';
import LoginScreen from '@/features/auth/LoginScreen';
import AdminDashboardScreen from '@/features/admin/AdminDashboardScreen';
import NotFoundPage from '@/pages/NotFoundPage';

export function App() {
  return (
    <BrowserRouter>
      <CustomCursor />
      <div className="flex flex-col min-h-screen">
        <AppNavbar />
        <div className="flex-1">
          <Routes>
            <Route path="/" element={<LandingScreen />} />
            <Route path="/explore" element={<ExplorePage />} />
            <Route path="/login" element={<LoginScreen />} />
            <Route path="/admin" element={<AdminDashboardScreen />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
