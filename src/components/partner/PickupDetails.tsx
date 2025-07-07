
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { usePickup } from '@/contexts/PickupContext';
import { ArrowLeft, Calendar, MapPin, Phone, Plus, Trash2 } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';

const PickupDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { requests, updateRequestStatus } = usePickup();
  const navigate = useNavigate();
  
  const request = requests.find(r => r.id === id);
  const [pickupCode, setPickupCode] = useState('');
  const [items, setItems] = useState([{ name: '', quantity: 1, price: 0 }]);
  const [loading, setLoading] = useState(false);

  if (!request) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p>Request not found</p>
      </div>
    );
  }

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

  const handleStartPickup = () => {
    if (pickupCode !== request.pickupCode) {
      toast.error('Invalid pickup code');
      return;
    }
    updateRequestStatus(request.id, 'in-process');
    toast.success('Pickup started successfully!');
  };

  const addItem = () => {
    setItems([...items, { name: '', quantity: 1, price: 0 }]);
  };

  const removeItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const updateItem = (index: number, field: string, value: any) => {
    const updatedItems = items.map((item, i) => 
      i === index ? { ...item, [field]: value } : item
    );
    setItems(updatedItems);
  };

  const handleSubmitForApproval = () => {
    const validItems = items.filter(item => item.name.trim() && item.quantity > 0);
    if (validItems.length === 0) {
      toast.error('Please add at least one item');
      return;
    }

    const totalAmount = validItems.reduce((sum, item) => sum + (item.quantity * item.price), 0);
    
    setLoading(true);
    setTimeout(() => {
      updateRequestStatus(request.id, 'pending-approval', {
        items: validItems,
        totalAmount
      });
      setLoading(false);
      toast.success('Pickup details submitted for customer approval!');
      navigate('/partner');
    }, 1000);
  };

  const totalAmount = items.reduce((sum, item) => sum + (item.quantity * item.price), 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-blue-600 text-white p-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate('/partner')} className="text-white hover:bg-blue-700">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">Pickup Details</h1>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Request Info */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <CardTitle>Request Information</CardTitle>
              <Badge className={getStatusColor(request.status)}>
                {getStatusText(request.status)}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium mb-2">Customer Details</h4>
                <p className="text-sm text-gray-600 mb-1">{request.customerName}</p>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Phone className="h-4 w-4" />
                  <span>{request.customerPhone}</span>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Pickup Schedule</h4>
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                  <Calendar className="h-4 w-4" />
                  <span>{request.pickupDate}</span>
                </div>
                <p className="text-sm text-gray-600">{request.timeSlot}</p>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Address</h4>
              <div className="flex items-start gap-2 text-sm text-gray-600">
                <MapPin className="h-4 w-4 mt-0.5" />
                <span>{request.address}</span>
              </div>
              {request.mapLink && (
                <a 
                  href={request.mapLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 text-sm underline ml-6"
                >
                  Open in Maps
                </a>
              )}
            </div>

            {request.pickupCode && (
              <div>
                <h4 className="font-medium mb-2">Pickup Code</h4>
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded font-mono">
                  {request.pickupCode}
                </span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Action Based on Status */}
        {request.status === 'accepted' && (
          <Card>
            <CardHeader>
              <CardTitle>Start Pickup</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="pickupCode">Enter Pickup Code from Customer</Label>
                  <Input
                    id="pickupCode"
                    value={pickupCode}
                    onChange={(e) => setPickupCode(e.target.value.toUpperCase())}
                    placeholder="Enter 6-character code"
                    className="font-mono"
                    maxLength={6}
                  />
                </div>
                <Button 
                  onClick={handleStartPickup}
                  className="bg-purple-600 hover:bg-purple-700"
                  disabled={pickupCode.length !== 6}
                >
                  Start Pickup
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {request.status === 'in-process' && (
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Add Item Details</CardTitle>
                <Button onClick={addItem} size="sm" variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Item
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {items.map((item, index) => (
                  <div key={index} className="grid grid-cols-12 gap-3 items-end">
                    <div className="col-span-5">
                      <Label htmlFor={`item-name-${index}`}>Item Name</Label>
                      <Input
                        id={`item-name-${index}`}
                        value={item.name}
                        onChange={(e) => updateItem(index, 'name', e.target.value)}
                        placeholder="e.g., Copper Wire"
                      />
                    </div>
                    <div className="col-span-2">
                      <Label htmlFor={`item-quantity-${index}`}>Qty</Label>
                      <Input
                        id={`item-quantity-${index}`}
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value) || 1)}
                      />
                    </div>
                    <div className="col-span-3">
                      <Label htmlFor={`item-price-${index}`}>Price (₹)</Label>
                      <Input
                        id={`item-price-${index}`}
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.price}
                        onChange={(e) => updateItem(index, 'price', parseFloat(e.target.value) || 0)}
                      />
                    </div>
                    <div className="col-span-2">
                      {items.length > 1 && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeItem(index)}
                          className="w-full text-red-600 border-red-200 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
                
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-lg font-semibold">Total Amount:</span>
                    <span className="text-xl font-bold">₹{totalAmount.toFixed(2)}</span>
                  </div>
                  <Button 
                    onClick={handleSubmitForApproval}
                    className="w-full bg-orange-600 hover:bg-orange-700"
                    disabled={loading || items.every(item => !item.name.trim())}
                  >
                    {loading ? 'Submitting...' : 'Submit for Customer Approval'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {(request.status === 'pending-approval' || request.status === 'completed') && request.items && (
          <Card>
            <CardHeader>
              <CardTitle>Pickup Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {request.items.map((item, index) => (
                  <div key={index} className="flex justify-between items-center bg-gray-50 p-3 rounded">
                    <div>
                      <span className="font-medium">{item.name}</span>
                      <span className="text-gray-600 ml-2">(x{item.quantity})</span>
                    </div>
                    <span className="font-medium">₹{(item.quantity * item.price).toFixed(2)}</span>
                  </div>
                ))}
                <div className="border-t pt-3">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold">Total Amount:</span>
                    <span className="text-xl font-bold">₹{request.totalAmount?.toFixed(2)}</span>
                  </div>
                </div>
                {request.status === 'pending-approval' && (
                  <p className="text-sm text-orange-600 mt-3">
                    Waiting for customer approval...
                  </p>
                )}
                {request.status === 'completed' && (
                  <p className="text-sm text-green-600 mt-3">
                    ✅ Pickup completed successfully!
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default PickupDetails;
