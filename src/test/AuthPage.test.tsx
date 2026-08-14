import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AuthPage } from '../components/auth/AuthPage.tsx';
import { AuthProvider } from '../context/AuthContext.tsx';

describe('AuthPage Component', () => {
  it('renders role gateway options (Shopper, Store / Merchant, Admin)', () => {
    render(
      <AuthProvider>
        <AuthPage />
      </AuthProvider>
    );

    expect(screen.getByText('Login to Errand Ghana')).toBeInTheDocument();
    expect(screen.getByText('Login as Shopper')).toBeInTheDocument();
    expect(screen.getByText('Login as Store / Merchant')).toBeInTheDocument();
    expect(screen.getByText('Login as Admin')).toBeInTheDocument();
    expect(screen.getByText('Enter as Shopper')).toBeInTheDocument();
  });

  it('renders mode pills for Role Gateway, Demo Personas, and Create Account', () => {
    render(
      <AuthProvider>
        <AuthPage />
      </AuthProvider>
    );

    expect(screen.getByText('Role Gateway')).toBeInTheDocument();
    expect(screen.getByText('Demo Personas')).toBeInTheDocument();
    expect(screen.getByText('Create Account')).toBeInTheDocument();
  });
});
