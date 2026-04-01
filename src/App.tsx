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
import UnifiedLogin from './pages/UnifiedLogin';
import { ProtectedRoute as AdminProtectedRoute } from './components/admin/ProtectedRoute';
import { ProtectedRoute as ClientProtectedRoute } from './components/client/ProtectedRoute';
import AdminDashboard from './pages/admin/Dashboard';
import AdminCRM from './pages/admin/CRM';
import AdminCustomerDetail from './pages/admin/CustomerDetail';
import AdminOrders from './pages/admin/Orders';
import AdminComplaints from './pages/admin/Complaints';
import AdminSales from './pages/admin/Sales';
import AdminTravelOrderDetail from './pages/admin/TravelOrderDetail';
import AdminTravelPaymentDetail from './pages/admin/TravelPaymentDetail';

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

          {/* Auth Routes */}
          <Route path="/login" element={<UnifiedLogin />} />
          <Route path="/admin/login" element={<UnifiedLogin />} />
          <Route path="/cliente/login" element={<UnifiedLogin />} />

          {/* Admin Routes */}
          <Route path="/admin/dashboard" element={<AdminProtectedRoute><AdminDashboard /></AdminProtectedRoute>} />
          <Route path="/admin/crm" element={<AdminProtectedRoute><AdminCRM /></AdminProtectedRoute>} />
          <Route path="/admin/crm/:id" element={<AdminProtectedRoute><AdminCustomerDetail /></AdminProtectedRoute>} />
          <Route path="/admin/pedidos" element={<AdminProtectedRoute><AdminOrders /></AdminProtectedRoute>} />
          <Route path="/admin/reclamacoes" element={<AdminProtectedRoute><AdminComplaints /></AdminProtectedRoute>} />
          <Route path="/admin/vendas" element={<AdminProtectedRoute><AdminSales /></AdminProtectedRoute>} />
          <Route path="/admin/travel/orders/:id" element={<AdminProtectedRoute><AdminTravelOrderDetail /></AdminProtectedRoute>} />
          <Route path="/admin/travel/payments/:id" element={<AdminProtectedRoute><AdminTravelPaymentDetail /></AdminProtectedRoute>} />

          {/* Client Routes */}
          <Route path="/cliente/verify-magic-link" element={<MagicLinkCallback />} />
          <Route path="/cliente/dashboard" element={<ClientProtectedRoute><ClientDashboard /></ClientProtectedRoute>} />
          <Route path="/cliente/compras" element={<ClientProtectedRoute><ClientPurchases /></ClientProtectedRoute>} />
          <Route path="/cliente/documentos" element={<ClientProtectedRoute><ClientDocuments /></ClientProtectedRoute>} />
          <Route path="/cliente/apoio" element={<ClientProtectedRoute><ClientSupport /></ClientProtectedRoute>} />
          <Route path="/cliente/perfil" element={<ClientProtectedRoute><ClientProfile /></ClientProtectedRoute>} />
          <Route path="/cliente/tickets/:id" element={<ClientProtectedRoute><TicketDetail /></ClientProtectedRoute>} />
        </Routes>
      </Layout>
    </Router>
  );
}
