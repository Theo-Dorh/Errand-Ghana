import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserRole } from '../types/index.ts';

interface AuthContextType {
  currentUser: UserProfile;
  isAuthenticated: boolean;
  role: UserRole;
  users: UserProfile[];
  loginAs: (user: UserProfile) => void;
  loginByRole: (role: UserRole) => void;
  loginWithEmail: (email: string) => boolean;
  signup: (userData: Omit<UserProfile, 'id' | 'rating' | 'is_approved'>) => UserProfile;
  adminCreateUser: (userData: Omit<UserProfile, 'id' | 'rating'>) => UserProfile;
  updateUserRole: (userId: string, newRole: UserRole) => void;
  deleteUser: (userId: string) => void;
  logout: () => void;
  switchUser: (user: UserProfile) => void;
}

export const INITIAL_PRESET_USERS: UserProfile[] = [
  {
    id: '11111111-1111-1111-1111-111111111111',
    email: 'shopper.kofi@gmail.com',
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
    neighborhood: 'Makola Market, Accra',
    rating: 4.88,
    is_approved: true,
    kyc_ghana_card: 'GHA-723910293-8',
  },
  {
    id: '44444444-4444-4444-4444-444444444444',
    email: 'kaneshie.mart@gmail.com',
    full_name: 'Uncle Joe Coldstore',
    role: 'store',
    store_name: 'Kaneshie Organic Hub',
    momo_number: '0265551234',
    momo_provider: 'AT_MONEY',
    neighborhood: 'Kaneshie Market, Accra',
    rating: 4.75,
    is_approved: true,
    kyc_ghana_card: 'GHA-519283741-2',
  },
  {
    id: '55555555-5555-5555-5555-555555555555',
    email: 'admin@errandghana.com',
    full_name: 'Central Admin & Operations',
    role: 'admin',
    momo_number: '0240001122',
    momo_provider: 'MTN_MOMO',
    store_name: 'ERRAND GHANA Operations Hub',
    neighborhood: 'Airport Residential, Accra',
    rating: 5.0,
    is_approved: true,
  },
];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<UserProfile[]>(() => {
    const saved = localStorage.getItem('errand_ghana_users_list');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_PRESET_USERS;
      }
    }
    return INITIAL_PRESET_USERS;
  });

  const [currentUser, setCurrentUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('errand_ghana_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_PRESET_USERS[0];
      }
    }
    return INITIAL_PRESET_USERS[0];
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('errand_ghana_auth') === 'true';
  });

  useEffect(() => {
    localStorage.setItem('errand_ghana_users_list', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('errand_ghana_user', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('errand_ghana_auth', isAuthenticated ? 'true' : 'false');
  }, [isAuthenticated]);

  const loginAs = (user: UserProfile) => {
    setCurrentUser(user);
    setIsAuthenticated(true);
  };

  const loginByRole = (targetRole: UserRole) => {
    const user = users.find((u) => u.role === targetRole) || users[0];
    setCurrentUser(user);
    setIsAuthenticated(true);
  };

  const loginWithEmail = (email: string): boolean => {
    const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (user) {
      setCurrentUser(user);
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const signup = (userData: Omit<UserProfile, 'id' | 'rating' | 'is_approved'>): UserProfile => {
    const newUser: UserProfile = {
      id: crypto.randomUUID(),
      ...userData,
      rating: 5.0,
      is_approved: true,
    };
    setUsers((prev) => [newUser, ...prev]);
    setCurrentUser(newUser);
    setIsAuthenticated(true);
    return newUser;
  };

  const adminCreateUser = (userData: Omit<UserProfile, 'id' | 'rating'>): UserProfile => {
    const newUser: UserProfile = {
      id: crypto.randomUUID(),
      ...userData,
      rating: 5.0,
      is_approved: userData.is_approved ?? true,
    };
    setUsers((prev) => [newUser, ...prev]);
    return newUser;
  };

  const updateUserRole = (userId: string, newRole: UserRole) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
    );
    if (currentUser.id === userId) {
      setCurrentUser((prev) => ({ ...prev, role: newRole }));
    }
  };

  const deleteUser = (userId: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== userId));
    if (currentUser.id === userId) {
      const remaining = users.filter((u) => u.id !== userId);
      if (remaining.length > 0) {
        setCurrentUser(remaining[0]);
      }
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  const switchUser = (user: UserProfile) => {
    setCurrentUser(user);
    setIsAuthenticated(true);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated,
        role: currentUser.role,
        users,
        loginAs,
        loginByRole,
        loginWithEmail,
        signup,
        adminCreateUser,
        updateUserRole,
        deleteUser,
        logout,
        switchUser,
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
