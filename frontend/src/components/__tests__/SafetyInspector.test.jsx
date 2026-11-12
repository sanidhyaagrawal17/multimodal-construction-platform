import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { axe } from 'jest-axe';
import React from 'react';
import SafetyInspector, { computeLabelPlacements } from '../SafetyInspector';

describe('SafetyInspector - Deterministic Label Placement & Collision Avoidance', () => {
  it('computes collision-free label placements prioritizing Critical infractions', () => {
    const mockDetections = [
      {
        id: 'det-1',
        label: 'Hardhat Missing',
        severity: 'Critical',
        bbox: { x: 0.1, y: 0.2, w: 0.15, h: 0.15 },
        type: 'worker',
      },
      {
        id: 'det-2',
        label: 'Leading Edge Fall Hazard',
        severity: 'Critical',
        bbox: { x: 0.1, y: 0.2, w: 0.15, h: 0.15 }, // Overlapping position
        type: 'hazard',
      },
      {
        id: 'det-3',
        label: 'Safety Vest Missing',
        severity: 'Moderate',
        bbox: { x: 0.5, y: 0.5, w: 0.1, h: 0.2 },
        type: 'ppe',
      },
    ];

    const placements = computeLabelPlacements(mockDetections);
    expect(placements).toHaveProperty('det-1');
    expect(placements).toHaveProperty('det-2');
    expect(placements).toHaveProperty('det-3');

    // The two colliding items (det-1 and det-2) must receive distinct non-colliding placement classes
    expect(placements['det-1']).not.toEqual(placements['det-2']);
  });

  it('clamps label placement to right edge when bounding box is near boundary', () => {
    const edgeDetection = [
      {
        id: 'det-edge',
        label: 'Perimeter Barrier Gap',
        severity: 'Critical',
        bbox: { x: 0.85, y: 0.3, w: 0.1, h: 0.15 },
        type: 'hazard',
      },
    ];

    const placements = computeLabelPlacements(edgeDetection);
    // When near the right boundary (x + w > 0.80), placement class must include right-0 to clamp
    expect(placements['det-edge']).toContain('right-0');
  });

  it('renders overall Hazard Index and Fall Risk score metrics', () => {
    render(<SafetyInspector />);
    expect(screen.getByText(/TOTAL HAZARD RISK SCORE/i)).toBeInTheDocument();
    expect(screen.getByText('84')).toBeInTheDocument(); // 84 / 100 Risk Index
    expect(screen.getByText(/100 Risk Index/i)).toBeInTheDocument();
    expect(screen.getByText('88%')).toBeInTheDocument(); // 88% Fall Risk
  });

  it('renders OSHA infraction logs with standards reference', () => {
    render(<SafetyInspector />);
    expect(screen.getByText('OSHA 1926.501(b)(1)')).toBeInTheDocument();
    expect(screen.getByText('OSHA 1926.451(g)(1)')).toBeInTheDocument();
    expect(screen.getByText(/Worker positioned within 18 inches of leading edge/i)).toBeInTheDocument();
  });

  it('passes automated axe accessibility check with 0 critical violations', async () => {
    const { container } = render(<SafetyInspector />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
