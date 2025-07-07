
import React, { createContext, useContext, useState, useEffect } from 'react';

export interface PickupRequest {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  partnerId?: string;
  partnerName?: string;
  pickupDate: string;
  timeSlot: string;
  address: string;
  mapLink?: string;
  status: 'pending' | 'accepted' | 'in-process' | 'pending-approval' | 'completed';
  pickupCode?: string;
  items?: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  totalAmount?: number;
  createdAt: string;
}

interface PickupContextType {
  requests: PickupRequest[];
  createRequest: (request: Omit<PickupRequest, 'id' | 'status' | 'createdAt'>) => void;
  updateRequestStatus: (id: string, status: PickupRequest['status'], updates?: Partial<PickupRequest>) => void;
  getCustomerRequests: (customerId: string) => PickupRequest[];
  getPendingRequests: () => PickupRequest[];
  getPartnerRequests: (partnerId: string) => PickupRequest[];
}

const PickupContext = createContext<PickupContextType | undefined>(undefined);

export const PickupProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [requests, setRequests] = useState<PickupRequest[]>([]);

  useEffect(() => {
    const storedRequests = localStorage.getItem('pickupRequests');
    if (storedRequests) {
      setRequests(JSON.parse(storedRequests));
    } else {
      // Initialize with mock data
      const mockRequests: PickupRequest[] = [
        {
          id: '1',
          customerId: 'customer1',
          customerName: 'John Doe',
          customerPhone: '+1234567890',
          pickupDate: '2024-07-10',
          timeSlot: '10:00 AM - 11:00 AM',
          address: '123 Main St, City, State',
          mapLink: 'https://maps.google.com',
          status: 'pending',
          createdAt: new Date().toISOString()
        }
      ];
      setRequests(mockRequests);
      localStorage.setItem('pickupRequests', JSON.stringify(mockRequests));
    }
  }, []);

  const saveRequests = (updatedRequests: PickupRequest[]) => {
    setRequests(updatedRequests);
    localStorage.setItem('pickupRequests', JSON.stringify(updatedRequests));
  };

  const createRequest = (requestData: Omit<PickupRequest, 'id' | 'status' | 'createdAt'>) => {
    const newRequest: PickupRequest = {
      ...requestData,
      id: Date.now().toString(),
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    const updatedRequests = [...requests, newRequest];
    saveRequests(updatedRequests);
  };

  const updateRequestStatus = (id: string, status: PickupRequest['status'], updates?: Partial<PickupRequest>) => {
    const updatedRequests = requests.map(request => {
      if (request.id === id) {
        const updatedRequest = { ...request, status, ...updates };
        
        // Generate pickup code when accepted
        if (status === 'accepted' && !updatedRequest.pickupCode) {
          updatedRequest.pickupCode = Math.random().toString(36).substring(2, 8).toUpperCase();
        }
        
        return updatedRequest;
      }
      return request;
    });
    saveRequests(updatedRequests);
  };

  const getCustomerRequests = (customerId: string) => {
    return requests.filter(request => request.customerId === customerId);
  };

  const getPendingRequests = () => {
    return requests.filter(request => request.status === 'pending');
  };

  const getPartnerRequests = (partnerId: string) => {
    return requests.filter(request => request.partnerId === partnerId || request.status === 'pending');
  };

  return (
    <PickupContext.Provider value={{
      requests,
      createRequest,
      updateRequestStatus,
      getCustomerRequests,
      getPendingRequests,
      getPartnerRequests
    }}>
      {children}
    </PickupContext.Provider>
  );
};

export const usePickup = () => {
  const context = useContext(PickupContext);
  if (context === undefined) {
    throw new Error('usePickup must be used within a PickupProvider');
  }
  return context;
};
