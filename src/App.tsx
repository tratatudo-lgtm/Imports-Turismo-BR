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
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import Cookies from './pages/Cookies';
import Contacts from './pages/Contacts';
import SupportCenter from './pages/SupportCenter';
import AdminLogin from './pages/admin/Login';
import { ProtectedRoute as AdminProtectedRoute } from './components/admin/ProtectedRoute';
import AdminDashboard from './pages/admin/Dashboard';
import AdminCRM from './pages/admin/CRM';
import AdminCustomerDetail from './pages/admin/CustomerDetail';
import AdminOrders from './pages/admin/Orders';
import AdminComplaints from './pages/admin/Complaints';
import AdminSales from './pages/admin/Sales';

import ClientLogin from './pages/client/Login';
import MagicLinkCallback from './pages/client/MagicLinkCallback';
import ClientDashboard from './pages/client/Dashboard';
import ClientPurchases from './pages/client/Purchases';
import ClientDocuments from './pages/client/Documents';
import ClientSupport from './pages/client/Support';
import ClientProfile from './pages/client/Profile';
import TicketDetail from './pages/client/TicketDetail';

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
          <Route path="/termos" element={<Terms />} />
          <Route path="/privacidade" element={<Privacy />} />
          <Route path="/cookies" element={<Cookies />} />
          <Route path="/contactos" element={<Contacts />} />
          <Route path="/centro-apoio" element={<SupportCenter />} />

          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminProtectedRoute><AdminDashboard /></AdminProtectedRoute>} />
          <Route path="/admin/crm" element={<AdminProtectedRoute><AdminCRM /></AdminProtectedRoute>} />
          <Route path="/admin/crm/:id" element={<AdminProtectedRoute><AdminCustomerDetail /></AdminProtectedRoute>} />
          <Route path="/admin/pedidos" element={<AdminProtectedRoute><AdminOrders /></AdminProtectedRoute>} />
          <Route path="/admin/reclamacoes" element={<AdminProtectedRoute><AdminComplaints /></AdminProtectedRoute>} />
          <Route path="/admin/vendas" element={<AdminProtectedRoute><AdminSales /></AdminProtectedRoute>} />

          {/* Client Routes */}
          <Route path="/cliente/login" element={<ClientLogin />} />
          <Route path="/cliente/verify-magic-link" element={<MagicLinkCallback />} />
          <Route path="/cliente/dashboard" element={<ClientDashboard />} />
          <Route path="/cliente/compras" element={<ClientPurchases />} />
          <Route path="/cliente/documentos" element={<ClientDocuments />} />
          <Route path="/cliente/apoio" element={<ClientSupport />} />
          <Route path="/cliente/perfil" element={<ClientProfile />} />
          <Route path="/cliente/tickets/:id" element={<TicketDetail />} />
        </Routes>
      </Layout>
    </Router>
  );
}
