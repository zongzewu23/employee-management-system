// App.test.tsx
import React from 'react';
import { render, screen } from '@testing-library/react';

const SimpleComponent: React.FC = () => {
  return (
      <div className="test-component">
        <h1>Test Component</h1>
        <p>This is a simple test</p>
      </div>
  );
};

describe('Simple Component Tests', () => {
  test('renders simple component', () => {
    render(<SimpleComponent />);
    expect(screen.getByText('Test Component')).toBeInTheDocument();
  });

  test('contains expected text', () => {
    render(<SimpleComponent />);
    expect(screen.getByText('Test Component')).toBeInTheDocument();
    expect(screen.getByText('This is a simple test')).toBeInTheDocument();
  });

  test('has correct heading', () => {
    render(<SimpleComponent />);
    expect(screen.getByRole('heading', { name: 'Test Component' })).toBeInTheDocument();
  });
});