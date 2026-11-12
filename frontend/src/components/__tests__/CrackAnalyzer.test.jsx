import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import React from 'react';
import CrackAnalyzer from '../CrackAnalyzer';

describe('CrackAnalyzer - ACI 224R / 318 Forensic Cards & Remediation', () => {
  it('renders diagnosed crack morphology with classification and risk tier', () => {
    render(<CrackAnalyzer />);
    expect(screen.getByText('DIAGNOSED CRACK MORPHOLOGY')).toBeInTheDocument();
    expect(screen.getByText('Shear Crack')).toBeInTheDocument();
    expect(screen.getByText('High Risk')).toBeInTheDocument();
  });

  it('renders structural metrics including estimated width and design code reference', () => {
    render(<CrackAnalyzer />);
    expect(screen.getByText('2.4 mm')).toBeInTheDocument();
    expect(screen.getByText('Severe')).toBeInTheDocument();
    expect(screen.getByText(/ACI 318-19 Section 9.5/i)).toBeInTheDocument();
    expect(screen.getByText(/ACI 224R-01 \(Tolerable Crack Widths: Limit 0.40mm/i)).toBeInTheDocument();
  });

  it('renders immediate safety actions and permanent remediation protocol', () => {
    render(<CrackAnalyzer />);
    expect(screen.getByText('Immediate Structural Safety Actions')).toBeInTheDocument();
    expect(screen.getByText(/Erect temporary heavy-duty hydraulic screw jacks/i)).toBeInTheDocument();
    expect(screen.getByText('Permanent Remediation Protocol')).toBeInTheDocument();
    expect(screen.getByText(/Carbon Fiber Reinforced Polymer \(CFRP\)/i)).toBeInTheDocument();
  });

  it('passes automated axe accessibility check with 0 critical violations', async () => {
    const { container } = render(<CrackAnalyzer />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
