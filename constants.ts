import { User, UserRole, Partner, Service } from './types';

export const MOCK_SERVICES: Service[] = [
  { id: 's1', name: 'Eco Lavagem Simples', description: 'Lavagem externa a seco + pretinho', price: 35.00, durationMinutes: 40 },
  { id: 's2', name: 'Completa Interiores', description: 'Aspiração, limpeza de painel, couro', price: 60.00, durationMinutes: 60 },
  { id: 's3', name: 'Detalhamento Premium', description: 'Completa + cera externa + motor', price: 120.00, durationMinutes: 120 },
];

export const MOCK_PARTNERS: Partner[] = [
  { 
    id: 'p1', 
    name: 'Lava-Rápido Brilho Total', 
    address: 'Rua da Inovação, 123 (Bloco B)', 
    rating: 4.8, 
    services: MOCK_SERVICES 
  },
  { 
    id: 'p2', 
    name: 'QuickClean Móvel', 
    address: 'Av. Tecnológica, 456', 
    rating: 4.5, 
    services: [MOCK_SERVICES[0], MOCK_SERVICES[1]] 
  },
];

export const MOCK_USERS: User[] = [
  {
    id: 'u1',
    name: 'João Silva',
    email: 'funcionario@empresa.com.br',
    role: UserRole.EMPLOYEE,
    companyName: 'TechCorp Ltda.',
  },
  {
    id: 'u2',
    name: 'Alice Gerente',
    email: 'parceiro@lavagem.com.br',
    role: UserRole.PARTNER,
    partnerId: 'p1',
  },
  {
    id: 'u3',
    name: 'Admin do Sistema',
    email: 'admin@plataforma.com.br',
    role: UserRole.ADMIN,
  }
];