
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useAuth } from '@/contexts/AuthContext';
import { usePickup } from '@/contexts/PickupContext';
import { ArrowLeft, Calendar, MapPin, Clock, Check, X, Package2, Search, Filter } from 'lucide-react';
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
      case 'pending': return 'Pending';
      case 'accepted': return 'Accepted';
      case 'in-process': return 'In Process';
      case 'pending-approval': return 'Awaiting Your Approval';
      case 'completed': return 'Completed';
      default: return status;
    }
  };

  const handleApproval = (requestId: string, approved: boolean) => {
    if (approved) {
      updateRequestStatus(requestId, 'completed');
      toast.success('Pickup approved and completed! 🎉');
    } else {
      updateRequestStatus(requestId, 'accepted');
      toast.info('Pickup details rejected. Our partner will revise.');
    }
    setSelectedRequest(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-6">
        <div className="flex items-center gap-4 mb-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate('/customer')} 
            className="text-white hover:bg-white/20 rounded-xl"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">Order History</h1>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex-1 bg-white/10 backdrop-blur-sm rounded-xl p-3">
            <div className="flex items-center gap-3">
              <Search className="h-5 w-5 text-white/70" />
              <span className="text-white/70">Search orders...</span>
            </div>
          </div>
          <Button variant="ghost" size="sm" className="text-white hover:bg-white/20 rounded-xl">
            <Filter className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <div className="p-6 -mt-4">
        {userRequests.length === 0 ? (
          <Card className="text-center py-16 shadow-xl border-0">
            <CardContent>
              <div className="w-24 h-24 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Package2 className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-600 mb-3">No orders yet</h3>
              <p className="text-gray-500 mb-8 max-w-md mx-auto text-lg">
                Start your sustainable journey by scheduling your first scrap pickup
              </p>
              <Button 
                className="bg-green-600 hover:bg-green-700 rounded-xl px-8 py-4 text-lg font-semibold"
                onClick={() => navigate('/schedule-pickup')}
              >
                Schedule Your First Pickup
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {userRequests.map((request) => (
              <Card key={request.id} className="hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center">
                        <Calendar className="h-7 w-7 text-green-600" />
                      </div>
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <span className="font-bold text-xl">{request.pickupDate}</span>
                          <span className="text-gray-500 font-medium">{request.timeSlot}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600 mb-3">
                          <MapPin className="h-4 w-4" />
                          <span>{request.address}</span>
                        </div>
                        {request.pickupCode && (
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">Pickup Code:</span>
                            <span className="bg-blue-100 text-blue-800 px-3 py-2 rounded-lg font-mono font-bold">
                              {request.pickupCode}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    <Badge className={`px-4 py-2 font-semibold border ${getStatusColor(request.status)}`}>
                      {getStatusText(request.status)}
                    </Badge>
                  </div>

                  {request.status === 'pending-approval' && (
                    <div className="border-t pt-6">
                      <div className="bg-orange-50 rounded-2xl p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h4 className="font-bold text-lg text-orange-800 mb-1">
                              Approval Required
                            </h4>
                            <p className="text-orange-600">
                              Review pickup details and approve payment
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="text-sm text-orange-600 font-medium">Total Amount</div>
                            <div className="text-2xl font-bold text-orange-800">₹{request.totalAmount || 0}</div>
                          </div>
                        </div>
                        
                        <Dialog open={selectedRequest?.id === request.id} onOpenChange={(open) => setSelectedRequest(open ? request : null)}>
                          <DialogTrigger asChild>
                            <Button className="w-full bg-orange-600 hover:bg-orange-700 rounded-xl py-3 text-lg font-semibold">
                              Review & Approve
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-md">
                            <DialogHeader>
                              <DialogTitle className="text-xl">Pickup Details Review</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-6">
                              <div>
                                <h4 className="font-semibold mb-4 text-lg">Items Collected:</h4>
                                <div className="space-y-3">
                                  {request.items?.map((item, index) => (
                                    <div key={index} className="flex justify-between items-center bg-gray-50 p-4 rounded-xl">
                                      <div>
                                        <div className="font-medium">{item.name}</div>
                                        <div className="text-sm text-gray-500">Quantity: {item.quantity}</div>
                                      </div>
                                      <div className="font-bold">₹{item.price}</div>
                                    </div>
                                  )) || <p className="text-gray-500 italic">No items listed</p>}
                                </div>
                              </div>
                              
                              <div className="border-t pt-4">
                                <div className="flex justify-between items-center mb-6">
                                  <span className="text-xl font-bold">Total Amount:</span>
                                  <span className="text-2xl font-bold text-green-600">₹{request.totalAmount || 0}</span>
                                </div>
                                
                                <div className="flex gap-3">
                                  <Button
                                    variant="outline"
                                    className="flex-1 border-2 border-red-200 text-red-600 hover:bg-red-50 rounded-xl py-3"
                                    onClick={() => handleApproval(request.id, false)}
                                  >
                                    <X className="h-5 w-5 mr-2" />
                                    Reject
                                  </Button>
                                  <Button
                                    className="flex-1 bg-green-600 hover:bg-green-700 rounded-xl py-3"
                                    onClick={() => handleApproval(request.id, true)}
                                  >
                                    <Check className="h-5 w-5 mr-2" />
                                    Approve
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  )}

                  {request.status === 'completed' && request.totalAmount && (
                    <div className="border-t pt-6">
                      <div className="bg-green-50 rounded-2xl p-6">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                              <Check className="h-5 w-5 text-green-600" />
                            </div>
                            <span className="font-semibold text-green-800">Pickup Completed</span>
                          </div>
                          <div className="text-right">
                            <div className="text-sm text-green-600 font-medium">Amount Paid</div>
                            <div className="text-xl font-bold text-green-800">₹{request.totalAmount}</div>
                          </div>
                        </div>
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
