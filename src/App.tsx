
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { PickupProvider } from "./contexts/PickupContext";
import LoginForm from "./components/auth/LoginForm";
import CustomerDashboard from "./components/customer/CustomerDashboard";
import SchedulePickup from "./components/customer/SchedulePickup";
import OrderHistory from "./components/customer/OrderHistory";
import PartnerDashboard from "./components/partner/PartnerDashboard";
import PickupDetails from "./components/partner/PickupDetails";
import AllPickups from "./components/partner/AllPickups";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const ProtectedRoute: React.FC<{ children: React.ReactNode; userType?: 'customer' | 'partner' }> = ({ 
  children, 
  userType 
}) => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/" replace />;
  }
  
  if (userType && user.type !== userType) {
    return <Navigate to={user.type === 'customer' ? '/customer' : '/partner'} replace />;
  }
  
  return <div>{children}</div>;
};

const AppContent = () => {
  const { user } = useAuth();
  
  return (
    <Routes>
      <Route path="/" element={user ? <Navigate to={user.type === 'customer' ? '/customer' : '/partner'} replace /> : <Index />} />
      
      <Route path="/login/customer" element={user ? <Navigate to="/customer" replace /> : <LoginForm userType="customer" />} />
      <Route path="/login/partner" element={user ? <Navigate to="/partner" replace /> : <LoginForm userType="partner" />} />
      
      <Route path="/customer" element={
        <ProtectedRoute userType="customer">
          <CustomerDashboard />
        </ProtectedRoute>
      } />
      <Route path="/schedule-pickup" element={
        <ProtectedRoute userType="customer">
          <SchedulePickup />
        </ProtectedRoute>
      } />
      <Route path="/order-history" element={
        <ProtectedRoute userType="customer">
          <OrderHistory />
        </ProtectedRoute>
      } />
      
      <Route path="/partner" element={
        <ProtectedRoute userType="partner">
          <PartnerDashboard />
        </ProtectedRoute>
      } />
      <Route path="/partner/pickups" element={
        <ProtectedRoute userType="partner">
          <AllPickups />
        </ProtectedRoute>
      } />
      <Route path="/partner/pickup/:id" element={
        <ProtectedRoute userType="partner">
          <PickupDetails />
        </ProtectedRoute>
      } />
      
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <PickupProvider>
            <AppContent />
          </PickupProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
