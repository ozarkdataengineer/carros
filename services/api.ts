import { User, Appointment, AppointmentStatus, Partner, Vehicle } from '../types';
import { MOCK_USERS, MOCK_PARTNERS, MOCK_SERVICES } from '../constants';

const STORAGE_KEY = 'washflow_db_v1';

const DEFAULT_APPOINTMENTS: Appointment[] = [
  {
    id: 'appt-1',
    employeeId: 'u1',
    employeeName: 'John Doe',
    partnerId: 'p1',
    partnerName: 'Sparkle Auto Spa',
    serviceId: 's1',
    serviceName: 'Eco Wash Simple',
    vehicle: { id: 'v1', plate: 'ABC-1234', model: 'Toyota Corolla', color: 'Silver' },
    date: new Date().toISOString(),
    status: AppointmentStatus.WASHING,
    price: 35.00
  },
  {
    id: 'appt-2',
    employeeId: 'u1',
    employeeName: 'John Doe',
    partnerId: 'p2',
    partnerName: 'QuickClean Mobile',
    serviceId: 's2',
    serviceName: 'Full Interior',
    vehicle: { id: 'v1', plate: 'ABC-1234', model: 'Toyota Corolla', color: 'Silver' },
    date: new Date(Date.now() - 86400000).toISOString(), // Yesterday
    status: AppointmentStatus.DELIVERED,
    price: 60.00
  }
];

// Helper to handle localStorage
const getStoredData = (): Appointment[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : DEFAULT_APPOINTMENTS;
  } catch (e) {
    console.error('Error loading data', e);
    return DEFAULT_APPOINTMENTS;
  }
};

const persistData = (data: Appointment[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Error saving data', e);
  }
};

// Initialize state
let appointments: Appointment[] = getStoredData();

export const mockApi = {
  login: async (email: string): Promise<User> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const user = MOCK_USERS.find(u => u.email === email);
        if (user) resolve(user);
        else reject(new Error('Invalid credentials'));
      }, 800);
    });
  },

  getPartners: async (): Promise<Partner[]> => {
    return Promise.resolve(MOCK_PARTNERS);
  },

  getAppointmentsByEmployee: async (employeeId: string): Promise<Appointment[]> => {
    return Promise.resolve(appointments.filter(a => a.employeeId === employeeId).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
  },

  getAppointmentsByPartner: async (partnerId: string): Promise<Appointment[]> => {
    return Promise.resolve(appointments.filter(a => a.partnerId === partnerId).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
  },

  getAllAppointments: async (): Promise<Appointment[]> => {
    return Promise.resolve(appointments);
  },

  createAppointment: async (appt: Omit<Appointment, 'id' | 'status'>): Promise<Appointment> => {
    const newAppt: Appointment = {
      ...appt,
      id: `appt-${Date.now()}`,
      status: AppointmentStatus.PENDING
    };
    appointments = [newAppt, ...appointments];
    persistData(appointments);
    return Promise.resolve(newAppt);
  },

  updateAppointmentStatus: async (id: string, status: AppointmentStatus): Promise<Appointment> => {
    const index = appointments.findIndex(a => a.id === id);
    if (index > -1) {
      appointments[index] = { ...appointments[index], status };
      appointments = [...appointments]; // Create new reference
      persistData(appointments);
      return Promise.resolve(appointments[index]);
    }
    return Promise.reject('Not found');
  }
};