import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { AuthPage } from '../components/auth/AuthPage.tsx';
import { AuthProvider } from '../context/AuthContext.tsx';
import { ThemeProvider } from '../context/ThemeContext.tsx';

describe('AuthPage Component', () => {
  it('renders role gateway options (Shopper, Store / Merchant, Admin)', () => {
    render(
      <ThemeProvider>
        <AuthProvider>
          <AuthPage />
        </AuthProvider>
      </ThemeProvider>
    );

    expect(screen.getByText(/Login to Errand Ghana/i)).toBeInTheDocument();
    expect(screen.getByText('Login as Shopper')).toBeInTheDocument();
    expect(screen.getByText('Login as Store / Merchant')).toBeInTheDocument();
    expect(screen.getByText('Login as Admin')).toBeInTheDocument();
    expect(screen.getByText('Enter as Shopper')).toBeInTheDocument();
  });

  it('renders mode pills for Role Gateway, Demo Personas, and Create Account', () => {
    render(
      <ThemeProvider>
        <AuthProvider>
          <AuthPage />
        </AuthProvider>
      </ThemeProvider>
    );

    expect(screen.getByText('Role Gateway')).toBeInTheDocument();
    expect(screen.getByText('Demo Personas')).toBeInTheDocument();
    expect(screen.getByText('Create Account')).toBeInTheDocument();
  });

  it('allows toggling between light and dark themes', () => {
    render(
      <ThemeProvider>
        <AuthProvider>
          <AuthPage />
        </AuthProvider>
      </ThemeProvider>
    );

    const toggleBtn = screen.getByLabelText(/toggle light or dark theme/i);
    expect(toggleBtn).toBeInTheDocument();

    // Light mode is now the default
    expect(document.documentElement.classList.contains('light')).toBe(true);

    // Toggle to dark mode
    fireEvent.click(toggleBtn);
    expect(document.documentElement.classList.contains('dark')).toBe(true);

    // Toggle back to light mode
    fireEvent.click(toggleBtn);
    expect(document.documentElement.classList.contains('light')).toBe(true);
  });
});
