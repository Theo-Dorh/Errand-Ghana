import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ErrandLogo } from '../components/common/ErrandLogo.tsx';

describe('ErrandLogo Component', () => {
  it('renders branding text in sentence case and SVG shield by default', () => {
    render(<ErrandLogo size="md" showText={true} />);

    expect(screen.getByTestId('errand-logo-container')).toBeInTheDocument();
    expect(screen.getByTestId('errand-logo-svg')).toBeInTheDocument();
    expect(screen.getByText('Errand')).toBeInTheDocument();
    expect(screen.getByText('GHANA')).toBeInTheDocument();
    expect(screen.getByText(/Everyday Grocery & Safe Pay/i)).toBeInTheDocument();
  });

  it('renders without text when showText is false', () => {
    render(<ErrandLogo size="sm" showText={false} />);

    expect(screen.getByTestId('errand-logo-container')).toBeInTheDocument();
    expect(screen.getByTestId('errand-logo-svg')).toBeInTheDocument();
    expect(screen.queryByText('Errand')).not.toBeInTheDocument();
  });

  it('triggers onClick handler when clicked', () => {
    const handleClick = vi.fn();
    render(<ErrandLogo size="md" onClick={handleClick} />);

    const logoContainer = screen.getByTestId('errand-logo-container');
    fireEvent.click(logoContainer);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
