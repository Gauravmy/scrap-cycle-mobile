
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { usePickup } from '@/contexts/PickupContext';
import { ArrowLeft, Calendar, Phone, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AllPickups: React.FC = () => {
  const { user } = useAuth();
  const { requests } = usePickup();
  const navigate = useNavigate();
  
  const partnerRequests = requests
    .filter(r => r.partnerId === user?.id)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-blue-600 text-white p-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate('/partner')} className="text-white hover:bg-blue-700">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">All My Pickups</h1>
        </div>
      </div>

      <div className="p-6">
        {partnerRequests.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <div className="text-gray-500">
                <p className="text-lg mb-2">No pickups assigned yet</p>
                <p>Accept requests from the dashboard to see them here</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {partnerRequests.map((request) => (
              <Card 
                key={request.id} 
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => navigate(`/partner/pickup/${request.id}`)}
              >
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold mb-1">{request.customerName}</h3>
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
                        <span className="line-clamp-1">{request.address}</span>
                      </div>
                    </div>
                    <Badge className={getStatusColor(request.status)}>
                      {getStatusText(request.status)}
                    </Badge>
                  </div>

                  {request.pickupCode && (
                    <div className="mb-3">
                      <span className="text-sm font-medium">Code: </span>
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded font-mono text-sm">
                        {request.pickupCode}
                      </span>
                    </div>
                  )}

                  {request.totalAmount && (
                    <div className="border-t pt-3">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Total Amount:</span>
                        <span className="text-lg font-bold">₹{request.totalAmount}</span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AllPickups;
