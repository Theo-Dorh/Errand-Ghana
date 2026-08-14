import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ErrandLogo } from '../components/common/ErrandLogo.tsx';

describe('ErrandLogo Component', () => {
  it('renders branding text and SVG shield by default', () => {
    render(<ErrandLogo size="md" showText={true} />);

    expect(screen.getByTestId('errand-logo-container')).toBeInTheDocument();
    expect(screen.getByTestId('errand-logo-svg')).toBeInTheDocument();
    expect(screen.getByText('ERRAND')).toBeInTheDocument();
    expect(screen.getByText('GHANA')).toBeInTheDocument();
    expect(screen.getByText(/2PC MoMo Escrow Marketplace/i)).toBeInTheDocument();
  });

  it('renders without text when showText is false', () => {
    render(<ErrandLogo size="sm" showText={false} />);

    expect(screen.getByTestId('errand-logo-container')).toBeInTheDocument();
    expect(screen.getByTestId('errand-logo-svg')).toBeInTheDocument();
    expect(screen.queryByText('ERRAND')).not.toBeInTheDocument();
  });
});
