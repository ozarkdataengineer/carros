import React, { useState, useEffect } from 'react';
import { User, UserRole } from './types';
import Login from './views/Login';
import EmployeeDashboard from './views/EmployeeDashboard';
import PartnerDashboard from './views/PartnerDashboard';
import AdminDashboard from './views/AdminDashboard';
import Layout from './components/Layout';
import { Loader2 } from 'lucide-react';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Simulate checking session
    const timer = setTimeout(() => {
      const savedUser = localStorage.getItem('washflow_user');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
    localStorage.setItem('washflow_user', JSON.stringify(loggedInUser));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('washflow_user');
  };

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-gray-50">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  const renderDashboard = () => {
    switch (user.role) {
      case UserRole.EMPLOYEE:
        return <EmployeeDashboard user={user} />;
      case UserRole.PARTNER:
        return <PartnerDashboard user={user} />;
      case UserRole.ADMIN:
        return <AdminDashboard />;
      default:
        return <div>Unknown role</div>;
    }
  };

  return (
    <Layout user={user} onLogout={handleLogout}>
      {renderDashboard()}
    </Layout>
  );
};

export default App;