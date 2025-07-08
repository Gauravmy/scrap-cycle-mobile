
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { usePickup } from '@/contexts/PickupContext';
import { Calendar, MapPin, Phone, Package, TrendingUp, Clock, User, LogOut, Truck, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PartnerDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const { getPartnerRequests, getPendingRequests, updateRequestStatus } = usePickup();
  const navigate = useNavigate();
  
  const partnerRequests = getPartnerRequests(user?.id || '');
  const pendingRequests = getPendingRequests();
  const assignedRequests = partnerRequests.filter(r => r.partnerId === user?.id);

  const stats = {
    pending: pendingRequests.length,
    assigned: assignedRequests.length,
    completed: assignedRequests.filter(r => r.status === 'completed').length,
    inProgress: assignedRequests.filter(r => ['accepted', 'in-process', 'pending-approval'].includes(r.status)).length
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'accepted': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'in-process': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'pending-approval': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Available';
      case 'accepted': return 'Accepted';
      case 'in-process': return 'In Process';
      case 'pending-approval': return 'Awaiting Approval';
      case 'completed': return 'Completed';
      default: return status;
    }
  };

  const handleAcceptRequest = (requestId: string) => {
    updateRequestStatus(requestId, 'accepted', {
      partnerId: user?.id,
      partnerName: user?.name
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="p-6 pb-8">
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <User className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold mb-1">Partner Dashboard</h1>
                <p className="text-blue-100">{user?.name} • {user?.phone}</p>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={logout} 
              className="text-white hover:bg-white/20 rounded-xl"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-500/20 rounded-xl flex items-center justify-center">
                  <Clock className="h-5 w-5 text-amber-200" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{stats.pending}</div>
                  <div className="text-blue-100 text-sm">Available</div>
                </div>
              </div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center">
                  <Truck className="h-5 w-5 text-purple-200" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{stats.inProgress}</div>
                  <div className="text-blue-100 text-sm">In Progress</div>
                </div>
              </div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-500/20 rounded-xl flex items-center justify-center">
                  <CheckCircle className="h-5 w-5 text-green-200" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{stats.completed}</div>
                  <div className="text-blue-100 text-sm">Completed</div>
                </div>
              </div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center">
                  <Package className="h-5 w-5 text-blue-200" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{stats.assigned}</div>
                  <div className="text-blue-100 text-sm">Total Assigned</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6 -mt-4">
        {/* Available Requests */}
        {pendingRequests.length > 0 && (
          <Card className="shadow-xl border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-xl">
                <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                  <Clock className="h-5 w-5 text-amber-600" />
                </div>
                Available Pickup Requests
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pendingRequests.slice(0, 3).map((request) => (
                  <div key={request.id} className="border border-gray-200 rounded-2xl p-6 bg-gradient-to-r from-white to-amber-50/30 hover:shadow-lg transition-all">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                          <Package className="h-6 w-6 text-amber-600" />
                        </div>
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <span className="font-bold text-lg">{request.customerName}</span>
                            <Badge className={`px-3 py-1 font-semibold border ${getStatusColor(request.status)}`}>
                              {getStatusText(request.status)}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600 mb-2">
                            <Phone className="h-4 w-4" />
                            <span className="font-medium">{request.customerPhone}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600 mb-2">
                            <Calendar className="h-4 w-4" />
                            <span>{request.pickupDate} • {request.timeSlot}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <MapPin className="h-4 w-4" />
                            <span className="max-w-md truncate">{request.address}</span>
                          </div>
                        </div>
                      </div>
                      <Button 
                        size="lg" 
                        className="bg-blue-600 hover:bg-blue-700 rounded-xl px-6 py-3 font-semibold"
                        onClick={() => handleAcceptRequest(request.id)}
                      >
                        Accept Request
                      </Button>
                    </div>
                    {request.mapLink && (
                      <div className="border-t pt-4">
                        <a 
                          href={request.mapLink} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 font-medium underline"
                        >
                          📍 Open in Google Maps
                        </a>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* My Pickups */}
        <Card className="shadow-xl border-0">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center gap-3 text-xl">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Truck className="h-5 w-5 text-blue-600" />
                </div>
                My Assigned Pickups
              </CardTitle>
              <Button 
                variant="outline" 
                onClick={() => navigate('/partner/pickups')}
                className="rounded-xl border-2"
              >
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {assignedRequests.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Package className="h-10 w-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-600 mb-3">No assigned pickups</h3>
                <p className="text-gray-500 max-w-md mx-auto">
                  Accept pickup requests from the available list above to start earning
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {assignedRequests.slice(0, 3).map((request) => (
                  <div 
                    key={request.id} 
                    className="border border-gray-200 rounded-2xl p-6 bg-white cursor-pointer hover:shadow-lg transition-all"
                    onClick={() => navigate(`/partner/pickup/${request.id}`)}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                          <Package className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <span className="font-bold text-lg">{request.customerName}</span>
                            <Badge className={`px-3 py-1 font-semibold border ${getStatusColor(request.status)}`}>
                              {getStatusText(request.status)}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600 mb-2">
                            <Calendar className="h-4 w-4" />
                            <span>{request.pickupDate} • {request.timeSlot}</span>
                          </div>
                          {request.pickupCode && (
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium">Code:</span>
                              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-lg font-mono font-semibold">
                                {request.pickupCode}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-500">Click to manage</div>
                        <div className="text-blue-600 font-medium">→</div>
                      </div>
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

export default PartnerDashboard;
