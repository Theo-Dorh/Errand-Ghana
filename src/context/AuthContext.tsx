import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserRole } from '../types/index.ts';

interface AuthContextType {
  currentUser: UserProfile;
  switchUser: (user: UserProfile) => void;
  availableUsers: UserProfile[];
  role: UserRole;
}

export const PRESET_USERS: UserProfile[] = [
  {
    id: '11111111-1111-1111-1111-111111111111',
    email: 'shopper.kofi@ug.edu.gh',
    full_name: 'Kofi Mensah',
    role: 'shopper',
    momo_number: '0244123456',
    momo_provider: 'MTN_MOMO',
    neighborhood: 'East Legon, Accra',
    rating: 4.95,
    is_approved: true,
  },
  {
    id: '22222222-2222-2222-2222-222222222222',
    email: 'shopper.ama@gmail.com',
    full_name: 'Ama Serwaa',
    role: 'shopper',
    momo_number: '0501987654',
    momo_provider: 'TELECEL_CASH',
    neighborhood: 'Madina, Accra',
    rating: 4.90,
    is_approved: true,
  },
  {
    id: '33333333-3333-3333-3333-333333333333',
    email: 'makola.fresh@gmail.com',
    full_name: 'Auntie Naa Baskets',
    role: 'store',
    store_name: 'Naa Lamiley Makola Wholesale',
    momo_number: '0249876543',
    momo_provider: 'MTN_MOMO',
    neighborhood: 'Makola Market',
    rating: 4.88,
    is_approved: true,
    kyc_ghana_card: 'GHA-723910293-8',
  },
  {
    id: '44444444-4444-4444-4444-444444444444',
    email: 'kaneshie.mart@gmail.com',
    full_name: 'Uncle Joe Coldstore & Tubers',
    role: 'store',
    store_name: 'Kaneshie Organic Hub',
    momo_number: '0265551234',
    momo_provider: 'AT_MONEY',
    neighborhood: 'Kaneshie Market',
    rating: 4.75,
    is_approved: true,
    kyc_ghana_card: 'GHA-519283741-2',
  },
  {
    id: '55555555-5555-5555-5555-555555555555',
    email: 'admin.escrow@errandghana.ug.edu.gh',
    full_name: 'Prof. Boateng (Escrow Auditor)',
    role: 'admin',
    momo_number: '0240001122',
    momo_provider: 'MTN_MOMO',
    store_name: 'ERRAND GHANA Escrow Vault',
    neighborhood: 'University of Ghana, Legon',
    rating: 5.0,
    is_approved: true,
  },
];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('errand_ghana_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return PRESET_USERS[0];
      }
    }
    return PRESET_USERS[0];
  });

  const switchUser = (user: UserProfile) => {
    setCurrentUser(user);
    localStorage.setItem('errand_ghana_user', JSON.stringify(user));
  };

  useEffect(() => {
    localStorage.setItem('errand_ghana_user', JSON.stringify(currentUser));
  }, [currentUser]);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        switchUser,
        availableUsers: PRESET_USERS,
        role: currentUser.role,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
