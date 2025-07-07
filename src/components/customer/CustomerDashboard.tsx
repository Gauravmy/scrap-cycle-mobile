
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { usePickup } from '@/contexts/PickupContext';
import { Calendar, MapPin, Clock, Plus, Package } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CustomerDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const { getCustomerRequests } = usePickup();
  const navigate = useNavigate();
  
  const userRequests = getCustomerRequests(user?.id || '');
  const recentRequests = userRequests.slice(0, 3);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'accepted': return 'text-blue-600 bg-blue-100';
      case 'in-process': return 'text-purple-600 bg-purple-100';
      case 'pending-approval': return 'text-orange-600 bg-orange-100';
      case 'completed': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-green-600 text-white p-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Welcome Back!</h1>
            <p className="text-green-100">{user?.phone}</p>
          </div>
          <Button variant="outline" onClick={logout} className="text-green-600 border-white">
            Logout
          </Button>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate('/schedule-pickup')}>
            <CardContent className="p-6 text-center">
              <Plus className="h-12 w-12 mx-auto text-green-600 mb-4" />
              <h3 className="text-lg font-semibold text-gray-800">Schedule Pickup</h3>
              <p className="text-gray-600 text-sm">Book a new scrap pickup</p>
            </CardContent>
          </Card>
          
          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate('/order-history')}>
            <CardContent className="p-6 text-center">
              <Package className="h-12 w-12 mx-auto text-blue-600 mb-4" />
              <h3 className="text-lg font-semibold text-gray-800">Order History</h3>
              <p className="text-gray-600 text-sm">View all your pickups</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Pickups */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Recent Pickups
            </CardTitle>
            <CardDescription>Your latest pickup requests</CardDescription>
          </CardHeader>
          <CardContent>
            {recentRequests.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No pickup requests yet</p>
                <Button 
                  className="mt-4 bg-green-600 hover:bg-green-700"
                  onClick={() => navigate('/schedule-pickup')}
                >
                  Schedule Your First Pickup
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {recentRequests.map((request) => (
                  <div key={request.id} className="border rounded-lg p-4 bg-white">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <span className="font-medium">{request.pickupDate}</span>
                        <span className="text-gray-500">{request.timeSlot}</span>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                        {getStatusText(request.status)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin className="h-4 w-4" />
                      <span className="text-sm">{request.address}</span>
                    </div>
                    {request.pickupCode && (
                      <div className="mt-2 text-sm">
                        <span className="font-medium">Pickup Code: </span>
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

export default CustomerDashboard;
