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
import AdminCRM from './pages/admin/CRM';
import AdminCustomerDetail from './pages/admin/CustomerDetail';
import AdminOrders from './pages/admin/Orders';
import AdminComplaints from './pages/admin/Complaints';
import AdminSales from './pages/admin/Sales';

import ClientLogin from './pages/client/Login';
import ClientDashboard from './pages/client/Dashboard';
import ClientPurchases from './pages/client/Purchases';
import ClientDocuments from './pages/client/Documents';
import ClientSupport from './pages/client/Support';
import ClientProfile from './pages/client/Profile';

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
          <Route path="/admin/crm" element={<AdminCRM />} />
          <Route path="/admin/crm/:id" element={<AdminCustomerDetail />} />
          <Route path="/admin/pedidos" element={<AdminOrders />} />
          <Route path="/admin/reclamacoes" element={<AdminComplaints />} />
          <Route path="/admin/vendas" element={<AdminSales />} />

          {/* Client Routes */}
          <Route path="/cliente/login" element={<ClientLogin />} />
          <Route path="/cliente/dashboard" element={<ClientDashboard />} />
          <Route path="/cliente/compras" element={<ClientPurchases />} />
          <Route path="/cliente/documentos" element={<ClientDocuments />} />
          <Route path="/cliente/apoio" element={<ClientSupport />} />
          <Route path="/cliente/perfil" element={<ClientProfile />} />
        </Routes>
      </Layout>
    </Router>
  );
}
