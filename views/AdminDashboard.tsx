import React, { useEffect, useState } from 'react';
import { Appointment } from '../types';
import { mockApi } from '../services/api';
import StatCard from '../components/StatCard';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { 
  Users, 
  Briefcase, 
  DollarSign, 
  Activity 
} from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const [data, setData] = useState<Appointment[]>([]);
  
  useEffect(() => {
    mockApi.getAllAppointments().then(setData);
  }, []);

  const totalRevenue = data.reduce((sum, a) => sum + a.price, 0);
  const platformFees = totalRevenue * 0.15; // Assuming 15% take rate

  // Mock chart data
  const revenueData = [
    { name: 'Mon', uv: 4000 },
    { name: 'Tue', uv: 3000 },
    { name: 'Wed', uv: 2000 },
    { name: 'Thu', uv: 2780 },
    { name: 'Fri', uv: 1890 },
    { name: 'Sat', uv: 2390 },
    { name: 'Sun', uv: 3490 },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Admin Overview</h1>
        <button className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm hover:bg-black">Download Report</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard title="Total Revenue" value={`$${totalRevenue.toLocaleString()}`} icon={DollarSign} color="green" trend="+12.5% from last week" />
        <StatCard title="Platform Fees" value={`$${platformFees.toLocaleString()}`} icon={Activity} color="purple" />
        <StatCard title="Total Bookings" value={data.length} icon={Briefcase} color="blue" />
        <StatCard title="Active Partners" value="12" icon={Users} color="orange" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Revenue Chart */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Revenue Trends</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip />
                <Line type="monotone" dataKey="uv" stroke="#2563eb" strokeWidth={3} dot={{r: 4}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Partner Performance List */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Top Partners</h3>
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center font-bold text-gray-500">
                    {i}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Sparkle Auto Spa</p>
                    <p className="text-sm text-gray-500">145 Services completed</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900">$2,450</p>
                  <p className="text-xs text-green-600">Excellent</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;