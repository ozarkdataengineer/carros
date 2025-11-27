import React, { useState, useEffect } from 'react';
import { User, Appointment, Partner, AppointmentStatus } from '../types';
import { mockApi } from '../services/api';
import StatCard from '../components/StatCard';
import { 
  CalendarPlus, 
  Clock, 
  CheckCircle, 
  Car, 
  MapPin, 
  Calendar,
  DollarSign,
  ChevronRight,
  Loader2
} from 'lucide-react';

interface EmployeeDashboardProps {
  user: User;
}

const EmployeeDashboard: React.FC<EmployeeDashboardProps> = ({ user }) => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isBooking, setIsBooking] = useState(false);

  // Booking State
  const [selectedPartnerId, setSelectedPartnerId] = useState<string>('');
  const [selectedServiceId, setSelectedServiceId] = useState<string>('');
  const [selectedVehicle, setSelectedVehicle] = useState({ plate: '', model: '', color: '' });
  const [bookingLoading, setBookingLoading] = useState(false);

  const fetchData = async () => {
    try {
      const [appts, parts] = await Promise.all([
        mockApi.getAppointmentsByEmployee(user.id),
        mockApi.getPartners()
      ]);
      setAppointments(appts);
      setPartners(parts);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user.id]);

  const handleBookService = async () => {
    setBookingLoading(true);
    try {
      const partner = partners.find(p => p.id === selectedPartnerId);
      const service = partner?.services.find(s => s.id === selectedServiceId);
      
      if (!partner || !service) return;

      await mockApi.createAppointment({
        employeeId: user.id,
        employeeName: user.name,
        partnerId: partner.id,
        partnerName: partner.name,
        serviceId: service.id,
        serviceName: service.name,
        vehicle: { id: 'new-v', ...selectedVehicle },
        date: new Date().toISOString(), // Immediate booking for MVP
        price: service.price
      });

      setIsBooking(false);
      // Reset form
      setSelectedPartnerId('');
      setSelectedServiceId('');
      setSelectedVehicle({ plate: '', model: '', color: '' });
      // Refresh list
      fetchData();
    } catch (e) {
      console.error(e);
    } finally {
      setBookingLoading(false);
    }
  };

  const getStatusColor = (status: AppointmentStatus) => {
    switch (status) {
      case AppointmentStatus.PENDING: return 'bg-yellow-100 text-yellow-800';
      case AppointmentStatus.WASHING: return 'bg-blue-100 text-blue-800';
      case AppointmentStatus.FINISHED: return 'bg-purple-100 text-purple-800';
      case AppointmentStatus.DELIVERED: return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) return <div className="p-8"><Loader2 className="animate-spin" /></div>;

  // Render New Booking Form
  if (isBooking) {
    const selectedPartner = partners.find(p => p.id === selectedPartnerId);
    
    return (
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Book a Wash</h2>
          <button 
            onClick={() => setIsBooking(false)}
            className="text-sm text-gray-500 hover:text-gray-900"
          >
            Cancel
          </button>
        </div>

        <div className="space-y-6">
          {/* Step 1: Vehicle Info */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
              <Car className="w-5 h-5 text-blue-500" /> Vehicle Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input 
                placeholder="Model (e.g. Toyota Corolla)" 
                className="p-2 border rounded-md w-full"
                value={selectedVehicle.model}
                onChange={e => setSelectedVehicle({...selectedVehicle, model: e.target.value})}
              />
              <input 
                placeholder="License Plate" 
                className="p-2 border rounded-md w-full"
                value={selectedVehicle.plate}
                onChange={e => setSelectedVehicle({...selectedVehicle, plate: e.target.value})}
              />
              <input 
                placeholder="Color" 
                className="p-2 border rounded-md w-full"
                value={selectedVehicle.color}
                onChange={e => setSelectedVehicle({...selectedVehicle, color: e.target.value})}
              />
            </div>
          </div>

          {/* Step 2: Select Partner */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-blue-500" /> Select Partner
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {partners.map(p => (
                <div 
                  key={p.id}
                  onClick={() => { setSelectedPartnerId(p.id); setSelectedServiceId(''); }}
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${selectedPartnerId === p.id ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200' : 'hover:border-gray-300'}`}
                >
                  <div className="font-semibold">{p.name}</div>
                  <div className="text-sm text-gray-500">{p.address}</div>
                  <div className="text-xs mt-2 text-yellow-600">★ {p.rating} Rating</div>
                </div>
              ))}
            </div>
          </div>

          {/* Step 3: Select Service */}
          {selectedPartner && (
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-blue-500" /> Select Service
              </h3>
              <div className="space-y-3">
                {selectedPartner.services.map(s => (
                  <div 
                    key={s.id}
                    onClick={() => setSelectedServiceId(s.id)}
                    className={`flex justify-between items-center p-4 border rounded-lg cursor-pointer ${selectedServiceId === s.id ? 'border-blue-500 bg-blue-50' : 'hover:bg-gray-50'}`}
                  >
                    <div>
                      <div className="font-semibold text-gray-900">{s.name}</div>
                      <div className="text-sm text-gray-500">{s.description}</div>
                      <div className="text-xs text-blue-600 mt-1 font-medium">{s.durationMinutes} mins est.</div>
                    </div>
                    <div className="text-lg font-bold text-gray-900">${s.price}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <button
            disabled={!selectedPartnerId || !selectedServiceId || !selectedVehicle.plate || bookingLoading}
            onClick={handleBookService}
            className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold shadow-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex justify-center"
          >
            {bookingLoading ? <Loader2 className="animate-spin" /> : 'Confirm Booking'}
          </button>
        </div>
      </div>
    );
  }

  // Dashboard View
  const activeAppts = appointments.filter(a => a.status !== AppointmentStatus.FINISHED && a.status !== AppointmentStatus.DELIVERED && a.status !== AppointmentStatus.CANCELLED);
  const pastAppts = appointments.filter(a => a.status === AppointmentStatus.FINISHED || a.status === AppointmentStatus.DELIVERED || a.status === AppointmentStatus.CANCELLED);

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user.name}</h1>
          <p className="text-gray-500">Manage your car wash services</p>
        </div>
        <button 
          onClick={() => setIsBooking(true)}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 shadow-sm transition-colors"
        >
          <CalendarPlus className="w-5 h-5" />
          Book New Wash
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Active Washes" value={activeAppts.length} icon={Car} color="blue" />
        <StatCard title="Total Services" value={appointments.length} icon={CheckCircle} color="green" />
        <StatCard title="This Month" value="$0.00" icon={DollarSign} color="purple" trend="Company paid" />
      </div>

      {/* Active Services */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Active Services</h2>
        {activeAppts.length === 0 ? (
          <div className="bg-white rounded-xl border border-dashed border-gray-300 p-8 text-center">
            <Car className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No active car washes at the moment.</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {activeAppts.map(appt => (
              <div key={appt.id} className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex gap-4">
                  <div className="p-3 bg-blue-50 rounded-lg hidden md:block">
                    <Clock className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{appt.serviceName}</h3>
                    <p className="text-sm text-gray-500">{appt.partnerName} • {appt.vehicle.model} ({appt.vehicle.plate})</p>
                    <div className="mt-2 text-xs text-gray-400">
                      {new Date(appt.date).toLocaleDateString()} at {new Date(appt.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
                   <div className="text-right mr-4 hidden md:block">
                      <p className="text-sm font-medium text-gray-900">${appt.price.toFixed(2)}</p>
                      <p className="text-xs text-gray-500">Billed to company</p>
                   </div>
                   <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(appt.status)}`}>
                     {appt.status}
                   </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* History */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Past Services</h2>
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-500 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 font-medium">Date</th>
                  <th className="px-6 py-4 font-medium">Service</th>
                  <th className="px-6 py-4 font-medium">Partner</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {pastAppts.map(appt => (
                  <tr key={appt.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-gray-900">
                      {new Date(appt.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900">{appt.serviceName}</td>
                    <td className="px-6 py-4 text-gray-500">{appt.partnerName}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(appt.status)}`}>
                        {appt.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right text-gray-900">${appt.price.toFixed(2)}</td>
                  </tr>
                ))}
                {pastAppts.length === 0 && (
                   <tr>
                     <td colSpan={5} className="px-6 py-8 text-center text-gray-500">No history available</td>
                   </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;