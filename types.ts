export enum UserRole {
  ADMIN = 'admin',
  PARTNER = 'partner',
  EMPLOYEE = 'employee',
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  companyName?: string; // For employees
  partnerId?: string; // For partners
}

export enum AppointmentStatus {
  PENDING = 'Pending',
  PICKED_UP = 'Picked Up',
  WASHING = 'Washing',
  FINISHED = 'Finished',
  DELIVERED = 'Delivered',
  CANCELLED = 'Cancelled',
}

export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  durationMinutes: number;
}

export interface Partner {
  id: string;
  name: string;
  address: string;
  rating: number;
  services: Service[];
}

export interface Vehicle {
  id: string;
  plate: string;
  model: string;
  color: string;
}

export interface Appointment {
  id: string;
  employeeId: string;
  employeeName: string;
  partnerId: string;
  partnerName: string;
  serviceId: string;
  serviceName: string;
  vehicle: Vehicle;
  date: string; // ISO string
  status: AppointmentStatus;
  price: number;
}