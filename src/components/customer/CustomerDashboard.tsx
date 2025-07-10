
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { usePickup } from '@/contexts/PickupContext';
import { Calendar, MapPin, Clock, Plus, Package, TrendingUp, User, LogOut, Recycle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useStaggerAnimation, useCardHoverAnimation, useFadeInAnimation } from '@/hooks/useAnimations';

const CustomerDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const { getCustomerRequests } = usePickup();
  const navigate = useNavigate();
  
  const userRequests = getCustomerRequests(user?.id || '');
  const recentRequests = userRequests.slice(0, 3);
  const completedCount = userRequests.filter(r => r.status === 'completed').length;
  const pendingCount = userRequests.filter(r => r.status !== 'completed').length;

  // Animation refs
  const headerRef = useFadeInAnimation(0);
  const statsRef = useStaggerAnimation('.stat-card', 100);
  const actionsRef = useStaggerAnimation('.action-card', 150);
  const recentRef = useStaggerAnimation('.recent-card', 80);
  const actionCard1Ref = useCardHoverAnimation();
  const actionCard2Ref = useCardHoverAnimation();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-amber-600 bg-amber-100 border-amber-200';
      case 'accepted': return 'text-blue-600 bg-blue-100 border-blue-200';
      case 'in-process': return 'text-purple-600 bg-purple-100 border-purple-200';
      case 'pending-approval': return 'text-orange-600 bg-orange-100 border-orange-200';
      case 'completed': return 'text-green-600 bg-green-100 border-green-200';
      default: return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Pending';
      case 'accepted': return 'Accepted';
      case 'in-process': return 'In Process';
      case 'pending-approval': return 'Awaiting Approval';
      case 'completed': return 'Completed';
      default: return status;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white">
        <div className="p-6 pb-8" ref={headerRef}>
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <User className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold mb-1">Welcome back!</h1>
                <p className="text-green-100 text-sm">{user?.phone}</p>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={logout} 
              className="text-white hover:bg-white/20 rounded-xl transition-all duration-200"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 gap-4" ref={statsRef}>
            <div className="stat-card bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                  <TrendingUp className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{completedCount}</div>
                  <div className="text-green-100 text-sm">Completed</div>
                </div>
              </div>
            </div>
            <div className="stat-card bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{pendingCount}</div>
                  <div className="text-green-100 text-sm">Active</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6 -mt-4">
        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4" ref={actionsRef}>
          <Card 
            ref={actionCard1Ref}
            className="action-card cursor-pointer border-0 shadow-lg bg-gradient-to-br from-green-500 to-emerald-500 text-white transition-all duration-300" 
            onClick={() => navigate('/schedule-pickup')}
          >
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Plus className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-2">Schedule Pickup</h3>
              <p className="text-green-100">Book your next scrap collection</p>
            </CardContent>
          </Card>
          
          <Card 
            ref={actionCard2Ref}
            className="action-card cursor-pointer border-0 shadow-lg bg-gradient-to-br from-blue-500 to-cyan-500 text-white transition-all duration-300" 
            onClick={() => navigate('/order-history')}
          >
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Package className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-2">Order History</h3>
              <p className="text-blue-100">Track all your pickups</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Pickups */}
        <Card className="shadow-lg border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <Recycle className="h-5 w-5 text-green-600" />
              </div>
              Recent Pickups
            </CardTitle>
            <CardDescription className="text-base">Your latest pickup requests</CardDescription>
          </CardHeader>
          <CardContent>
            {recentRequests.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Package className="h-10 w-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-600 mb-3">No pickups yet</h3>
                <p className="text-gray-500 mb-6 max-w-sm mx-auto">Start your eco-friendly journey by scheduling your first scrap pickup</p>
                <Button 
                  className="bg-green-600 hover:bg-green-700 rounded-xl px-8 py-3 text-lg font-semibold transition-all duration-200"
                  onClick={() => navigate('/schedule-pickup')}
                >
                  Schedule Your First Pickup
                </Button>
              </div>
            ) : (
              <div className="space-y-4" ref={recentRef}>
                {recentRequests.map((request, index) => (
                  <div key={request.id} className={`recent-card border border-gray-200 rounded-2xl p-6 bg-white transition-all duration-300 hover:shadow-md`}>
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                          <Calendar className="h-6 w-6 text-green-600" />
                        </div>
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <span className="font-semibold text-lg">{request.pickupDate}</span>
                            <span className="text-gray-500">{request.timeSlot}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600 mb-2">
                            <MapPin className="h-4 w-4" />
                            <span className="text-sm">{request.address}</span>
                          </div>
                          {request.pickupCode && (
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium">Code:</span>
                              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-lg font-mono text-sm font-semibold">
                                {request.pickupCode}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold border ${getStatusColor(request.status)}`}>
                        {getStatusText(request.status)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CustomerDashboard;
