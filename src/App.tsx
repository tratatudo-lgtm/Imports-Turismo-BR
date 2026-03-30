/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import Home from './pages/Home';
import Destinations from './pages/Destinations';
import QuoteRequestPage from './pages/QuoteRequest';
import Booking from './pages/Booking';
import Support from './pages/Support';
import TrackRequest from './pages/TrackRequest';
import AdminLogin from './pages/admin/Login';
import AdminDashboard from './pages/admin/Dashboard';

export default function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/destinos" element={<Destinations />} />
          <Route path="/orcamento" element={<QuoteRequestPage />} />
          <Route path="/reservas" element={<Booking />} />
          <Route path="/apoio" element={<Support />} />
          <Route path="/acompanhar" element={<TrackRequest />} />

          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
        </Routes>
      </Layout>
    </Router>
  );
}
