import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/Landingpage';
import Actions from './pages/Actions';
import FAQ from './pages/FAQ';
import Contact from './pages/Contact';
import Login from './pages/Login';
import RequestAccess from './pages/RequestAccess';
import AdminPortal from './pages/AdminPortal';
import SetPassword from './pages/SetPassword';
import CaseInformation from './pages/CaseInformation';
import ProofOfClaim from './pages/ProofOfClaim';
import UsefulLinks from './pages/UsefulLinks';
import CaseProfessionals from './pages/CaseProfessionals';
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

        {/* Public case information pages */}
        <Route path="/case-information" element={<CaseInformation />} />
        <Route path="/proof-of-claim" element={<ProofOfClaim />} />
        <Route path="/useful-links" element={<UsefulLinks />} />
        <Route path="/professionals" element={<CaseProfessionals />} />

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