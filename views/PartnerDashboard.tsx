import React, { useState, useEffect } from 'react';
import { User, Appointment, AppointmentStatus } from '../types';
import { mockApi } from '../services/api';
import StatCard from '../components/StatCard';
import { 
  CheckSquare, 
  Clock, 
  TrendingUp, 
  Car, 
  Play, 
  Check, 
  CornerDownRight,
  MoreHorizontal
} from 'lucide-react';

interface PartnerDashboardProps {
  user: User;
}

const PartnerDashboard: React.FC<PartnerDashboardProps> = ({ user }) => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAppts = async () => {
    if (user.partnerId) {
      const data = await mockApi.getAppointmentsByPartner(user.partnerId);
      setAppointments(data);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAppts();
  }, [user.partnerId]);

  const handleStatusChange = async (id: string, newStatus: AppointmentStatus) => {
    // Optimistic update
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, status: newStatus } : a));
    await mockApi.updateAppointmentStatus(id, newStatus);
  };

  if (isLoading) return <div>Loading...</div>;

  const pending = appointments.filter(a => a.status === AppointmentStatus.PENDING);
  const inProgress = appointments.filter(a => [AppointmentStatus.PICKED_UP, AppointmentStatus.WASHING].includes(a.status));
  const completed = appointments.filter(a => [AppointmentStatus.FINISHED, AppointmentStatus.DELIVERED].includes(a.status));

  const totalRevenue = completed.reduce((sum, a) => sum + a.price, 0);

  const StatusButton = ({ appt }: { appt: Appointment }) => {
    switch (appt.status) {
      case AppointmentStatus.PENDING:
        return (
          <button 
            onClick={() => handleStatusChange(appt.id, AppointmentStatus.PICKED_UP)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
          >
            <Play className="w-4 h-4" /> Pick Up Car
          </button>
        );
      case AppointmentStatus.PICKED_UP:
        return (
          <button 
             onClick={() => handleStatusChange(appt.id, AppointmentStatus.WASHING)}
             className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm font-medium"
          >
             Start Wash
          </button>
        );
      case AppointmentStatus.WASHING:
        return (
          <button 
             onClick={() => handleStatusChange(appt.id, AppointmentStatus.FINISHED)}
             className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium"
          >
             <Check className="w-4 h-4" /> Finish
          </button>
        );
      case AppointmentStatus.FINISHED:
        return (
          <button 
             onClick={() => handleStatusChange(appt.id, AppointmentStatus.DELIVERED)}
             className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 text-sm font-medium"
          >
             <CornerDownRight className="w-4 h-4" /> Deliver Key
          </button>
        );
      default:
        return <span className="text-gray-400 text-sm font-medium">Completed</span>;
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Partner Dashboard</h1>
        <div className="text-sm text-gray-500">
          Last updated: {new Date().toLocaleTimeString()}
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard title="Queue" value={pending.length} icon={Clock} color="orange" />
        <StatCard title="In Progress" value={inProgress.length} icon={Car} color="blue" />
        <StatCard title="Completed (Today)" value={completed.length} icon={CheckSquare} color="green" />
        <StatCard title="Revenue" value={`$${totalRevenue.toFixed(0)}`} icon={TrendingUp} color="purple" />
      </div>

      {/* Kanban-ish Board */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Column 1: To Do */}
        <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 h-full">
          <h3 className="text-sm font-bold text-gray-500 uppercase mb-4 tracking-wider flex items-center justify-between">
            To Do <span className="bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full text-xs">{pending.length}</span>
          </h3>
          <div className="space-y-3">
            {pending.map(appt => (
              <div key={appt.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <div className="flex justify-between items-start mb-2">
                   <h4 className="font-semibold text-gray-900">{appt.serviceName}</h4>
                   <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded font-medium">New</span>
                </div>
                <div className="text-sm text-gray-600 mb-3">
                  <p>{appt.employeeName}</p>
                  <p className="font-medium text-gray-800">{appt.vehicle.model} - {appt.vehicle.plate}</p>
                </div>
                <StatusButton appt={appt} />
              </div>
            ))}
            {pending.length === 0 && <p className="text-center text-gray-400 text-sm py-4">No pending requests</p>}
          </div>
        </div>

        {/* Column 2: In Progress */}
        <div className="bg-blue-50/50 rounded-xl p-4 border border-blue-100 h-full">
          <h3 className="text-sm font-bold text-blue-800 uppercase mb-4 tracking-wider flex items-center justify-between">
            In Progress <span className="bg-blue-200 text-blue-800 px-2 py-0.5 rounded-full text-xs">{inProgress.length}</span>
          </h3>
           <div className="space-y-3">
            {inProgress.map(appt => (
              <div key={appt.id} className="bg-white p-4 rounded-lg shadow-sm border border-blue-200 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
                <div className="flex justify-between items-start mb-2 pl-2">
                   <h4 className="font-semibold text-gray-900">{appt.serviceName}</h4>
                   <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-medium">{appt.status}</span>
                </div>
                <div className="text-sm text-gray-600 mb-3 pl-2">
                  <p>{appt.employeeName}</p>
                  <p className="font-medium text-gray-800">{appt.vehicle.model} - {appt.vehicle.plate}</p>
                </div>
                <div className="pl-2">
                   <StatusButton appt={appt} />
                </div>
              </div>
            ))}
             {inProgress.length === 0 && <p className="text-center text-gray-400 text-sm py-4">No cars in wash</p>}
          </div>
        </div>

        {/* Column 3: Ready/Finished */}
        <div className="bg-green-50/50 rounded-xl p-4 border border-green-100 h-full">
          <h3 className="text-sm font-bold text-green-800 uppercase mb-4 tracking-wider flex items-center justify-between">
            Ready / Delivered <span className="bg-green-200 text-green-800 px-2 py-0.5 rounded-full text-xs">{completed.length}</span>
          </h3>
           <div className="space-y-3">
            {completed.map(appt => (
              <div key={appt.id} className="bg-white p-4 rounded-lg shadow-sm border border-green-200 opacity-75 hover:opacity-100 transition-opacity">
                 <div className="flex justify-between items-start mb-2">
                   <h4 className="font-semibold text-gray-900">{appt.serviceName}</h4>
                   <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded font-medium">{appt.status}</span>
                </div>
                <div className="text-sm text-gray-600 mb-3">
                  <p>{appt.vehicle.plate}</p>
                </div>
                {appt.status !== AppointmentStatus.DELIVERED && <StatusButton appt={appt} />}
              </div>
            ))}
             {completed.length === 0 && <p className="text-center text-gray-400 text-sm py-4">No completed jobs yet</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PartnerDashboard;