import { User, UserRole, Partner, Service } from './types';

export const MOCK_SERVICES: Service[] = [
  { id: 's1', name: 'Eco Wash Simple', description: 'Exterior waterless wash + tire shine', price: 35.00, durationMinutes: 40 },
  { id: 's2', name: 'Full Interior', description: 'Vacuum, dash cleaning, leather care', price: 60.00, durationMinutes: 60 },
  { id: 's3', name: 'Premium Detail', description: 'Full interior + exterior wax + engine bay', price: 120.00, durationMinutes: 120 },
];

export const MOCK_PARTNERS: Partner[] = [
  { 
    id: 'p1', 
    name: 'Sparkle Auto Spa', 
    address: '123 Innovation Dr (Block B)', 
    rating: 4.8, 
    services: MOCK_SERVICES 
  },
  { 
    id: 'p2', 
    name: 'QuickClean Mobile', 
    address: '456 Tech Park Ave', 
    rating: 4.5, 
    services: [MOCK_SERVICES[0], MOCK_SERVICES[1]] 
  },
];

export const MOCK_USERS: User[] = [
  {
    id: 'u1',
    name: 'John Doe',
    email: 'employee@company.com',
    role: UserRole.EMPLOYEE,
    companyName: 'TechCorp Inc.',
  },
  {
    id: 'u2',
    name: 'Alice Manager',
    email: 'partner@wash.com',
    role: UserRole.PARTNER,
    partnerId: 'p1',
  },
  {
    id: 'u3',
    name: 'System Admin',
    email: 'admin@platform.com',
    role: UserRole.ADMIN,
  }
];