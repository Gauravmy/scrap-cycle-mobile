
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { usePickup } from '@/contexts/PickupContext';
import { Calendar, MapPin, Phone, Package, TrendingUp, Clock } from 'lucide-react';
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
    completed: assignedRequests.filter(r => r.status === 'completed').length
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'accepted': return 'bg-blue-100 text-blue-800';
      case 'in-process': return 'bg-purple-100 text-purple-800';
      case 'pending-approval': return 'bg-orange-100 text-orange-800';
      case 'completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Pending';
      case 'accepted': return 'Accepted';
      case 'in-process': return 'In Process';
      case 'pending-approval': return 'Pending Approval';
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-blue-600 text-white p-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Partner Dashboard</h1>
            <p className="text-blue-100">{user?.name} - {user?.phone}</p>
          </div>
          <Button variant="outline" onClick={logout} className="text-blue-600 border-white">
            Logout
          </Button>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-6 text-center">
              <Clock className="h-8 w-8 mx-auto text-yellow-600 mb-2" />
              <div className="text-2xl font-bold text-gray-800">{stats.pending}</div>
              <div className="text-sm text-gray-600">Pending Requests</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <Package className="h-8 w-8 mx-auto text-blue-600 mb-2" />
              <div className="text-2xl font-bold text-gray-800">{stats.assigned}</div>
              <div className="text-sm text-gray-600">Assigned to You</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <TrendingUp className="h-8 w-8 mx-auto text-green-600 mb-2" />
              <div className="text-2xl font-bold text-gray-800">{stats.completed}</div>
              <div className="text-sm text-gray-600">Completed</div>
            </CardContent>
          </Card>
        </div>

        {/* Available Requests */}
        {pendingRequests.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Available Requests
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {pendingRequests.slice(0, 3).map((request) => (
                  <div key={request.id} className="border rounded-lg p-4 bg-white">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium">{request.customerName}</span>
                          <Badge className={getStatusColor(request.status)}>
                            {getStatusText(request.status)}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                          <Phone className="h-4 w-4" />
                          <span>{request.customerPhone}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                          <Calendar className="h-4 w-4" />
                          <span>{request.pickupDate} - {request.timeSlot}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <MapPin className="h-4 w-4" />
                          <span>{request.address}</span>
                        </div>
                      </div>
                      <Button 
                        size="sm" 
                        className="bg-blue-600 hover:bg-blue-700"
                        onClick={() => handleAcceptRequest(request.id)}
                      >
                        Accept
                      </Button>
                    </div>
                    {request.mapLink && (
                      <a 
                        href={request.mapLink} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 text-sm underline"
                      >
                        View on Map
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* My Pickups */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                My Pickups
              </CardTitle>
              <Button 
                variant="outline" 
                onClick={() => navigate('/partner/pickups')}
              >
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {assignedRequests.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No assigned pickups yet</p>
                <p className="text-sm">Accept requests from the available list above</p>
              </div>
            ) : (
              <div className="space-y-3">
                {assignedRequests.slice(0, 3).map((request) => (
                  <div 
                    key={request.id} 
                    className="border rounded-lg p-4 bg-white cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => navigate(`/partner/pickup/${request.id}`)}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium">{request.customerName}</span>
                          <Badge className={getStatusColor(request.status)}>
                            {getStatusText(request.status)}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="h-4 w-4" />
                          <span>{request.pickupDate} - {request.timeSlot}</span>
                        </div>
                      </div>
                    </div>
                    {request.pickupCode && (
                      <div className="text-sm">
                        <span className="font-medium">Code: </span>
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded font-mono">
                          {request.pickupCode}
                        </span>
                      </div>
                    )}
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
