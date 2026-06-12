import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/Landingpage';
import Actions from './pages/Actions';
import FAQ from './pages/FAQ';
import Contact from './pages/Contact';
import Login from './pages/Login';
import RequestAccess from './pages/RequestAccess';
import AdminPortal from './pages/AdminPortal';
import SetPassword from './pages/SetPassword';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public — always visible */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/request-access" element={<RequestAccess />} />
        <Route path="/set-password" element={<SetPassword />} />

        {/* Protected — requires login */}
        <Route path="/actions" element={<ProtectedRoute><Actions /></ProtectedRoute>} />
        <Route path="/faq" element={<ProtectedRoute><FAQ /></ProtectedRoute>} />
        <Route path="/contact" element={<ProtectedRoute><Contact /></ProtectedRoute>} />

        {/* Admin only */}
        <Route path="/admin" element={<AdminRoute><AdminPortal /></AdminRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;