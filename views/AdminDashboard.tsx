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

  const formatCurrency = (value: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

  // Mock chart data
  const revenueData = [
    { name: 'Seg', uv: 4000 },
    { name: 'Ter', uv: 3000 },
    { name: 'Qua', uv: 2000 },
    { name: 'Qui', uv: 2780 },
    { name: 'Sex', uv: 1890 },
    { name: 'Sáb', uv: 2390 },
    { name: 'Dom', uv: 3490 },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Visão Geral do Admin</h1>
        <button className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm hover:bg-black">Baixar Relatório</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard title="Receita Total" value={formatCurrency(totalRevenue)} icon={DollarSign} color="green" trend="+12.5% vs semana passada" />
        <StatCard title="Taxas da Plataforma" value={formatCurrency(platformFees)} icon={Activity} color="purple" />
        <StatCard title="Total de Agendamentos" value={data.length} icon={Briefcase} color="blue" />
        <StatCard title="Parceiros Ativos" value="12" icon={Users} color="orange" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Revenue Chart */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Tendência de Receita</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip formatter={(value) => [`R$ ${value}`, 'Receita']} />
                <Line type="monotone" dataKey="uv" stroke="#2563eb" strokeWidth={3} dot={{r: 4}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Partner Performance List */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Melhores Parceiros</h3>
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center font-bold text-gray-500">
                    {i}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Lava-Rápido Brilho Total</p>
                    <p className="text-sm text-gray-500">145 Serviços concluídos</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900">R$ 2.450</p>
                  <p className="text-xs text-green-600">Excelente</p>
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