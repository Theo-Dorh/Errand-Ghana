import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MLPriceBenchmarkVisualizer } from '../components/ml/MLPriceBenchmarkVisualizer.tsx';
import { MLPriceBenchmarkResult } from '../types/index.ts';

describe('MLPriceBenchmarkVisualizer Component', () => {
  const mockBenchmark: MLPriceBenchmarkResult = {
    itemName: 'Navrongo Fresh Tomatoes',
    shopperBudgetValue: 100.0,
    storeOfferValue: 95.0,
    accraRetailBenchmark: 118.0, // 1.18x Accra baseline
    supermarketVariancePercent: 19.5,
    consumerSavingsGHS: 23.0,
    mlConfidenceScore: 94.8,
    volatilityIndex: 'High',
    recommendation: 'Optimal competitive pricing. High merchant acceptance probability.',
  };

  it('renders benchmark comparison elements accurately', () => {
    render(<MLPriceBenchmarkVisualizer benchmark={mockBenchmark} />);

    expect(screen.getByTestId('ml-benchmark-container')).toBeInTheDocument();
    expect(screen.getByTestId('ml-confidence-score')).toHaveTextContent('94.8% ML Confidence');
    expect(screen.getByText(/Accra Supermarket Retail Benchmark/i)).toBeInTheDocument();
    expect(screen.getByText('GH₵ 118.00')).toBeInTheDocument();
    expect(screen.getByText('GH₵ 100.00')).toBeInTheDocument();
    expect(screen.getByText('GH₵ 95.00')).toBeInTheDocument();
  });

  it('calculates and displays consumer savings vs Accra supermarket markup', () => {
    render(<MLPriceBenchmarkVisualizer benchmark={mockBenchmark} />);

    expect(screen.getByText(/Estimated Consumer Savings:/i)).toBeInTheDocument();
    expect(screen.getByText('GH₵ 23.00')).toBeInTheDocument();
    expect(screen.getByText(/19.5% below retail/i)).toBeInTheDocument();
  });

  it('renders compact mode properly', () => {
    render(<MLPriceBenchmarkVisualizer benchmark={mockBenchmark} compact={true} />);

    expect(screen.getByText('Navrongo Fresh Tomatoes')).toBeInTheDocument();
    expect(screen.getByText('GH₵ 95.00')).toBeInTheDocument();
    expect(screen.getByText('-19.5%')).toBeInTheDocument();
  });
});
