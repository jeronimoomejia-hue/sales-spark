import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Ventas from "./pages/Ventas";
import Hitos from "./pages/Hitos";
import Equipo from "./pages/Equipo";
import Cierres from "./pages/Cierres";
import Configuracion from "./pages/Configuracion";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminMilestones from "./pages/admin/AdminMilestones";
import AdminClosures from "./pages/admin/AdminClosures";
import AdminCommissions from "./pages/admin/AdminCommissions";
import AdminReports from "./pages/admin/AdminReports";
import AdminIntegrations from "./pages/admin/AdminIntegrations";
import AdminSettings from "./pages/admin/AdminSettings";
import AdminEvents from "./pages/admin/AdminEvents";
import AdminEventRoster from "./pages/admin/AdminEventRoster";
import AdminTemplates from "./pages/admin/AdminTemplates";
import AdminSellerRegistrations from "./pages/admin/AdminSellerRegistrations";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/ventas" element={<Ventas />} />
          <Route path="/hitos" element={<Hitos />} />
          <Route path="/equipo" element={<Equipo />} />
          <Route path="/cierres" element={<Cierres />} />
          <Route path="/configuracion" element={<Configuracion />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/events" element={<AdminEvents />} />
          <Route path="/admin/events/:eventId/roster" element={<AdminEventRoster />} />
          <Route path="/admin/templates" element={<AdminTemplates />} />
          <Route path="/admin/registrations" element={<AdminSellerRegistrations />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/milestones" element={<AdminMilestones />} />
          <Route path="/admin/closures" element={<AdminClosures />} />
          <Route path="/admin/commissions" element={<AdminCommissions />} />
          <Route path="/admin/reports" element={<AdminReports />} />
          <Route path="/admin/integrations" element={<AdminIntegrations />} />
          <Route path="/admin/settings" element={<AdminSettings />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
