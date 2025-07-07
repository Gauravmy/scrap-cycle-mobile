
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useAuth } from '@/contexts/AuthContext';
import { usePickup } from '@/contexts/PickupContext';
import { ArrowLeft, Calendar, MapPin, Clock, Check, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const OrderHistory: React.FC = () => {
  const { user } = useAuth();
  const { getCustomerRequests, updateRequestStatus } = usePickup();
  const navigate = useNavigate();
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  
  const userRequests = getCustomerRequests(user?.id || '').sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

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

  const handleApproval = (requestId: string, approved: boolean) => {
    if (approved) {
      updateRequestStatus(requestId, 'completed');
      toast.success('Pickup approved and completed!');
    } else {
      updateRequestStatus(requestId, 'accepted');
      toast.info('Pickup rejected. Status reverted to accepted.');
    }
    setSelectedRequest(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-green-600 text-white p-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate('/customer')} className="text-white hover:bg-green-700">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">Order History</h1>
        </div>
      </div>

      <div className="p-6">
        {userRequests.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Clock className="h-16 w-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">No Orders Yet</h3>
              <p className="text-gray-500 mb-6">You haven't scheduled any pickups yet</p>
              <Button 
                className="bg-green-600 hover:bg-green-700"
                onClick={() => navigate('/schedule-pickup')}
              >
                Schedule Your First Pickup
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {userRequests.map((request) => (
              <Card key={request.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <span className="font-medium">{request.pickupDate}</span>
                        <span className="text-gray-500">{request.timeSlot}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <MapPin className="h-4 w-4" />
                        <span className="text-sm">{request.address}</span>
                      </div>
                    </div>
                    <Badge className={getStatusColor(request.status)}>
                      {getStatusText(request.status)}
                    </Badge>
                  </div>

                  {request.pickupCode && (
                    <div className="mb-3">
                      <span className="text-sm font-medium">Pickup Code: </span>
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded font-mono text-sm">
                        {request.pickupCode}
                      </span>
                    </div>
                  )}

                  {request.status === 'pending-approval' && (
                    <div className="border-t pt-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-orange-600 mb-1">
                            Approval Required
                          </p>
                          <p className="text-sm text-gray-600">
                            Total Amount: ₹{request.totalAmount || 0}
                          </p>
                        </div>
                        <Dialog open={selectedRequest?.id === request.id} onOpenChange={(open) => setSelectedRequest(open ? request : null)}>
                          <DialogTrigger asChild>
                            <Button size="sm" className="bg-orange-600 hover:bg-orange-700">
                              Review Details
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-md">
                            <DialogHeader>
                              <DialogTitle>Pickup Details for Approval</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div>
                                <h4 className="font-medium mb-2">Items Collected:</h4>
                                <div className="space-y-2">
                                  {request.items?.map((item, index) => (
                                    <div key={index} className="flex justify-between bg-gray-50 p-2 rounded">
                                      <span>{item.name} (x{item.quantity})</span>
                                      <span>₹{item.price}</span>
                                    </div>
                                  )) || <p className="text-gray-500">No items listed</p>}
                                </div>
                              </div>
                              <div className="border-t pt-3">
                                <div className="flex justify-between font-semibold text-lg">
                                  <span>Total:</span>
                                  <span>₹{request.totalAmount || 0}</span>
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <Button
                                  variant="outline"
                                  className="flex-1 text-red-600 border-red-200 hover:bg-red-50"
                                  onClick={() => handleApproval(request.id, false)}
                                >
                                  <X className="h-4 w-4 mr-2" />
                                  Reject
                                </Button>
                                <Button
                                  className="flex-1 bg-green-600 hover:bg-green-700"
                                  onClick={() => handleApproval(request.id, true)}
                                >
                                  <Check className="h-4 w-4 mr-2" />
                                  Approve
                                </Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  )}

                  {request.status === 'completed' && request.totalAmount && (
                    <div className="border-t pt-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-green-600">Completed</span>
                        <span className="font-semibold">₹{request.totalAmount}</span>
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

export default OrderHistory;
