
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, ArrowLeft, MapPin, Clock, Link, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { usePickup } from '@/contexts/PickupContext';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const SchedulePickup: React.FC = () => {
  const { user } = useAuth();
  const { createRequest } = usePickup();
  const navigate = useNavigate();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    pickupDate: undefined as Date | undefined,
    timeSlot: '',
    address: '',
    mapLink: ''
  });
  const [loading, setLoading] = useState(false);

  const timeSlots = [
    '9:00 AM - 10:00 AM',
    '10:00 AM - 11:00 AM',
    '11:00 AM - 12:00 PM',
    '12:00 PM - 1:00 PM',
    '2:00 PM - 3:00 PM',
    '3:00 PM - 4:00 PM',
    '4:00 PM - 5:00 PM',
    '5:00 PM - 6:00 PM'
  ];

  const steps = [
    { id: 1, title: 'Date & Time', icon: CalendarIcon },
    { id: 2, title: 'Address', icon: MapPin },
    { id: 3, title: 'Review', icon: CheckCircle2 }
  ];

  const handleNext = () => {
    if (currentStep === 1) {
      if (!formData.pickupDate || !formData.timeSlot) {
        toast.error('Please select both date and time slot');
        return;
      }
    } else if (currentStep === 2) {
      if (!formData.address.trim()) {
        toast.error('Please enter your pickup address');
        return;
      }
    }
    setCurrentStep(prev => prev + 1);
  };

  const handleSubmit = async () => {
    setLoading(true);
    
    setTimeout(() => {
      createRequest({
        customerId: user?.id || '',
        customerName: user?.name || '',
        customerPhone: user?.phone || '',
        pickupDate: format(formData.pickupDate!, 'yyyy-MM-dd'),
        timeSlot: formData.timeSlot,
        address: formData.address,
        mapLink: formData.mapLink || undefined
      });
      
      setLoading(false);
      toast.success('Pickup scheduled successfully! 🎉');
      navigate('/customer');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-6">
        <div className="flex items-center gap-4 mb-6">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate('/customer')} 
            className="text-white hover:bg-white/20 rounded-xl"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">Schedule Pickup</h1>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center gap-4">
          {steps.map((step, index) => (
            <React.Fragment key={step.id}>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                  currentStep >= step.id 
                    ? 'bg-white text-green-600' 
                    : 'bg-white/20 text-white'
                }`}>
                  <step.icon className="h-5 w-5" />
                </div>
                <span className={`font-medium transition-all ${
                  currentStep >= step.id ? 'text-white' : 'text-green-200'
                }`}>
                  {step.title}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div className={`flex-1 h-1 rounded-full transition-all ${
                  currentStep > step.id ? 'bg-white' : 'bg-white/20'
                }`} />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className="p-6 -mt-4">
        <Card className="max-w-2xl mx-auto shadow-xl border-0">
          <CardHeader className="pb-6">
            <CardTitle className="text-2xl">
              {currentStep === 1 && 'When do you need pickup?'}
              {currentStep === 2 && 'Where should we pick up?'}
              {currentStep === 3 && 'Review your booking'}
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Step 1: Date & Time */}
            {currentStep === 1 && (
              <div className="space-y-8">
                <div className="space-y-3">
                  <Label className="text-lg font-semibold flex items-center gap-2">
                    <CalendarIcon className="h-5 w-5 text-green-600" />
                    Pickup Date
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full h-14 justify-start text-left font-normal text-lg border-2 rounded-xl",
                          !formData.pickupDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-3 h-5 w-5" />
                        {formData.pickupDate ? format(formData.pickupDate, "PPPP") : "Select pickup date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={formData.pickupDate}
                        onSelect={(date) => setFormData(prev => ({ ...prev, pickupDate: date }))}
                        disabled={(date) => date < new Date()}
                        initialFocus
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-3">
                  <Label className="text-lg font-semibold flex items-center gap-2">
                    <Clock className="h-5 w-5 text-green-600" />
                    Time Slot
                  </Label>
                  <Select onValueChange={(value) => setFormData(prev => ({ ...prev, timeSlot: value }))}>
                    <SelectTrigger className="h-14 text-lg border-2 rounded-xl">
                      <SelectValue placeholder="Choose convenient time" />
                    </SelectTrigger>
                    <SelectContent>
                      {timeSlots.map((slot) => (
                        <SelectItem key={slot} value={slot} className="text-lg p-4">
                          {slot}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {/* Step 2: Address */}
            {currentStep === 2 && (
              <div className="space-y-8">
                <div className="space-y-3">
                  <Label className="text-lg font-semibold flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-green-600" />
                    Pickup Address
                  </Label>
                  <Textarea
                    placeholder="Enter your complete pickup address..."
                    value={formData.address}
                    onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                    className="min-h-[120px] text-lg border-2 rounded-xl resize-none"
                  />
                </div>

                <div className="space-y-3">
                  <Label className="text-lg font-semibold flex items-center gap-2">
                    <Link className="h-5 w-5 text-blue-600" />
                    Google Maps Link <span className="text-sm font-normal text-gray-500">(Optional)</span>
                  </Label>
                  <Input
                    type="url"
                    placeholder="https://maps.google.com/..."
                    value={formData.mapLink}
                    onChange={(e) => setFormData(prev => ({ ...prev, mapLink: e.target.value }))}
                    className="h-14 text-lg border-2 rounded-xl"
                  />
                  <p className="text-sm text-gray-500">
                    Add a Google Maps link to help our partner find your location easily
                  </p>
                </div>
              </div>
            )}

            {/* Step 3: Review */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="bg-green-50 rounded-2xl p-6 space-y-4">
                  <div className="flex items-center gap-3 pb-3 border-b border-green-200">
                    <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                      <CalendarIcon className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <div className="font-semibold text-lg">{formData.pickupDate && format(formData.pickupDate, "PPPP")}</div>
                      <div className="text-green-600 font-medium">{formData.timeSlot}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center mt-1">
                      <MapPin className="h-5 w-5 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold mb-1">Pickup Address</div>
                      <div className="text-gray-600">{formData.address}</div>
                      {formData.mapLink && (
                        <a 
                          href={formData.mapLink} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 text-sm underline mt-2 inline-block"
                        >
                          View on Google Maps
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 rounded-2xl p-6">
                  <h3 className="font-semibold text-lg mb-3 text-blue-800">What happens next?</h3>
                  <div className="space-y-2 text-blue-700">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                      <span>A nearby eco-partner will accept your request</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                      <span>You'll receive a pickup code to share with them</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                      <span>They'll collect and evaluate your scrap items</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                      <span>You'll approve the final amount and get paid!</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex gap-4 pt-6">
              {currentStep > 1 && (
                <Button
                  variant="outline"
                  onClick={() => setCurrentStep(prev => prev - 1)}
                  className="flex-1 h-12 rounded-xl border-2"
                >
                  Previous
                </Button>
              )}
              
              {currentStep < 3 ? (
                <Button
                  onClick={handleNext}
                  className="flex-1 h-12 bg-green-600 hover:bg-green-700 rounded-xl text-lg font-semibold"
                >
                  Continue
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex-1 h-12 bg-green-600 hover:bg-green-700 rounded-xl text-lg font-semibold"
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Scheduling...
                    </div>
                  ) : (
                    'Schedule Pickup'
                  )}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SchedulePickup;
